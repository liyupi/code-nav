import { getApp } from '@/tcb';
import { wrapPageQuery } from '@/utils/utils';
import type { ReportType } from '@/models/report';
import { reviewStatusInfoMap } from '@/constant/reviewStatusEnum';

const app = getApp();
const db = app.database();
const collection = db.collection('report');

export interface ReportSearchParams {
  reportResourcesId?: string;
  reporterId?: string;
  reportedUserId?: string;
  reportType?: number;
  reportReason?: number;
  reviewStatus?: number;
  reviewerId?: string;
  pageSize?: number;
  pageNum?: number;
  orderKey?: string;
}

/**
 * 新增
 * @param params
 */
export async function addReport(params: Partial<ReportType>) {
  const { reportedUserId, reportResourceId, reportType = -1, reportReason = -1 } = params;
  if ((!reportResourceId && !reportedUserId) || reportType < 0 || reportReason < 0) {
    return false;
  }

  return app
    .callFunction({
      name: 'addReport',
      data: params,
    })
    .then((res: any) => {
      console.log(`addReport succeed`, res);
      return res.result;
    })
    .catch((e: any) => {
      console.error(`addReport error`, e);
      return false;
    });
}

/**
 * 分页搜索
 * @param params
 */
export async function searchReportByPage(params: ReportSearchParams) {
  const { pageSize = 12, pageNum = 1 } = params;
  const condition: any = getSearchConditions(params);

  // 分页查总数
  const total = await collection
    .where(condition)
    .count()
    .then((res) => res.total);
  const query = wrapPageQuery(collection.where(condition), pageSize, pageNum);
  return query
    .orderBy(params.orderKey ?? '_createTime', 'desc')
    .get()
    .then(({ data }: any) => {
      console.log(`searchReportByPage succeed, length = ${data.length}, total = ${total}`);
      return {
        data,
        total,
      };
    })
    .catch((e: any) => {
      console.error('searchReportByPage error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

/**
 * 审核举报
 * @param reportId
 * @param reviewStatus
 * @param reviewMessage
 */
export async function reviewReport(reportId: string, reviewStatus: number, reviewMessage?: string) {
  if (!reviewStatusInfoMap[reviewStatus]) {
    return false;
  }
  return app
    .callFunction({
      name: 'reviewReport',
      data: {
        reportId,
        reviewStatus,
        reviewMessage,
      },
    })
    .then((res: any) => {
      console.log(`reviewReport succeed, id = ${reportId}, reviewStatus = ${reviewStatus}`);
      return res;
    })
    .catch((e: any) => {
      console.error('reviewReport error', e);
      return false;
    });
}

/**
 * 获得搜索条件
 * @param params
 */
function getSearchConditions(params: ReportSearchParams) {
  return {
    isDelete: false,
    reviewStatus: params.reviewStatus,
    reportType: params.reportType,
    reportReason: params.reportReason,
    reporterId: params.reporterId,
    reportResourcesId: params.reportResourcesId,
    reviewerId: params.reviewerId,
    reportedUserId: params.reportedUserId,
  };
}
