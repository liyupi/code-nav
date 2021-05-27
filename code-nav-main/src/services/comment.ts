import { getApp } from '@/tcb';
import type { CommentType } from '@/models/comment';
import { reviewStatusInfoMap } from '@/constant/reviewStatusEnum';

const app = getApp();

export interface CommentSearchParams {
  resourceId?: string;
  reviewStatus?: number;
  pageSize?: number;
  pageNum?: number;
  orderKey?: string;
}

/**
 * 新增
 * @param params
 */
export function addComment(params: CommentType) {
  const { content, resourceId, rate } = params;
  if (!content || !resourceId || !rate) {
    return false;
  }

  return app
    .callFunction({
      name: 'addComment',
      data: params,
    })
    .then((res: any) => {
      console.log(`addComment succeed`, res);
      return res.result;
    })
    .catch((e: any) => {
      console.error(`addComment error`, e);
      return false;
    });
}

/**
 * 分页搜索
 * @param params
 */
export async function searchComments(params: CommentSearchParams) {
  return app
    .callFunction({
      name: 'searchComments',
      data: params,
    })
    .then(({ result }: any) => {
      console.log(`searchComments succeed`, result);
      return result;
    })
    .catch((e: any) => {
      console.error('searchComments error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

/**
 * 审核评论
 * @param commentId
 * @param reviewStatus
 * @param reviewMessage
 */
export async function reviewComment(
  commentId: string,
  reviewStatus: number,
  reviewMessage?: string,
) {
  if (!commentId || !reviewStatusInfoMap[reviewStatus]) {
    return false;
  }

  return app
    .callFunction({
      name: 'reviewComment',
      data: {
        commentId,
        reviewStatus,
        reviewMessage,
      },
    })
    .then((res: any) => {
      console.log(`reviewComment succeed, id = ${commentId}`);
      return res;
    })
    .catch((e: any) => {
      console.error(`reviewComment error, id = ${commentId}`, e);
      return false;
    });
}

/**
 * 点赞数 +1
 * @param commentId
 * @return
 */
export function thumbUpComment(commentId: string) {
  if (!commentId) {
    return false;
  }

  return app
    .callFunction({
      name: 'thumbUpComment',
      data: {
        commentId,
      },
    })
    .then((res: any) => {
      console.log(`thumbUpComment succeed, id = ${commentId}`, res);
      return true;
    })
    .catch((e: any) => {
      console.error(`thumbUpComment error, id = ${commentId}`, e);
      return false;
    });
}
