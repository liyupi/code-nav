import { getApp } from '@/tcb';
import type { NoticeType } from '@/models/notice';
import { wrapPageQuery } from '@/utils/utils';
import type cloudbase from '@cloudbase/js-sdk';

const app = getApp();
const db = app.database();
const collection = db.collection('notice');

export interface NoticeSearchParams {
  pageSize?: number;
  pageNum?: number;
  orderKey?: string;
  order?: string;
}

/**
 * 添加
 * @param params
 * @return id
 */
export function addNotice(params: NoticeType) {
  if (!params.title) {
    return false;
  }

  return app
    .callFunction({
      name: 'addNotice',
      data: params,
    })
    .then((res: any) => {
      console.log(`addNotice succeed`, res);
      return res.result;
    })
    .catch((e: any) => {
      console.error(`addNotice error`, e);
      return false;
    });
}

/**
 * 删除
 * @param noticeId
 */
export function deleteNotice(noticeId: string) {
  if (!noticeId) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateNotice',
      data: {
        noticeId,
        isDelete: true,
      },
    })
    .then(({ result }: any) => {
      console.log('deleteNotice succeed', result);
      return true;
    })
    .catch((e: any) => {
      console.error('deleteNotice error', e);
      return false;
    });
}

/**
 * 分页搜索
 * @param params
 */
export async function searchNoticesByPage(params: NoticeSearchParams) {
  const { pageSize = 12, pageNum = 1 } = params;
  const condition = { isDelete: false };
  // 分页查总数
  const total = await collection
    .where(condition)
    .count()
    .then((res) => res.total);

  const query = wrapPageQuery(collection.where(condition), pageSize, pageNum);
  return query
    .orderBy(params.orderKey ?? '_createTime', params.order ?? 'desc')
    .get()
    .then(({ data }: any) => {
      console.log(`searchNoticesByPage succeed, length = ${data.length}, total = ${total}`);
      return {
        data,
        total,
      };
    })
    .catch((e: any) => {
      console.error('searchNoticesByPage error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

// 监听器（单例）
let noticeWatcher: cloudbase.database.DBRealtimeListener;

/**
 * 开启监听
 * @param callback
 */
export function openNoticeWatcher(callback: (notice: NoticeType) => void) {
  if (noticeWatcher) {
    return null;
  }

  noticeWatcher = collection
    .where({
      isDelete: false,
    })
    .watch({
      onChange(snapshot) {
        const { docChanges } = snapshot;
        if (docChanges && docChanges.length > 0) {
          for (let i = 0; i < docChanges.length; i += 1) {
            if (docChanges[i].dataType === 'add') {
              callback(docChanges[i].doc as NoticeType);
            }
          }
        }
      },
      onError(err) {
        console.error('notice watch closed', err);
      },
    });
  return noticeWatcher;
}

/**
 * 结束监听
 */
export function closeNoticeWatcher() {
  if (noticeWatcher) {
    noticeWatcher.close();
  }
}
