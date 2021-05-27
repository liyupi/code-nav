import {getApp} from '@/tcb';
import type {UserIntroduceType} from '@/models/userIntroduce';

const app = getApp();
const db = app.database();
const collection = db.collection('userIntroduce');

export interface UserIntroduceSearchParams {
  content?: string;
  tags?: string[];
  reviewStatus?: number;
  pageSize?: number;
  pageNum?: number;
}

/**
 * 添加或更新
 * @param params
 * @return  id
 */
export async function addOrUpdateUserIntroduce(params: UserIntroduceType) {
  if (!params.content) {
    return false;
  }

  return app
    .callFunction({
      name: 'addOrUpdateUserIntroduce',
      data: params,
    })
    .then((res: any) => {
      console.log('addOrUpdateUserIntroduce succeed', res);
      return res.result;
    })
    .catch((e: any) => {
      console.error('addOrUpdateUserIntroduce error', e);
      return 0;
    });
}

/**
 * 查询
 * @param userId
 * @return  id
 */
export async function getUserIntroduce(userId: string) {
  if (!userId) {
    return null;
  }

  return collection
    .where({
      userId,
      isDelete: false,
    })
    .orderBy('_createTime', 'desc')
    .limit(1)
    .get()
    .then(({data}: any) => {
      console.log(`getUserIntroduce succeed`, data);
      return data[0];
    })
    .catch((e: any) => {
      console.error('getUserIntroduce error', e);
      return null;
    });
}

/**
 * 分页搜索
 * @param params
 */
export async function searchUserIntroduces(params: UserIntroduceSearchParams) {
  return app
    .callFunction({
      name: 'searchUserIntroduces',
      data: params,
    })
    .then(({result}: any) => {
      console.log(`searchUserIntroduces succeed`, result);
      return result;
    })
    .catch((e: any) => {
      console.error('searchUserIntroduces error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

/**
 * 点赞数 +1
 * @param userIntroduceId
 * @return
 */
export function thumbUpUserIntroduce(userIntroduceId: string) {
  if (!userIntroduceId) {
    return false;
  }

  return app
    .callFunction({
      name: 'thumbUpUserIntroduce',
      data: {
        userIntroduceId,
      },
    })
    .then((res: any) => {
      console.log(`thumbUpUserIntroduce succeed, id = ${userIntroduceId}`, res);
      return true;
    })
    .catch((e: any) => {
      console.error(`thumbUpUserIntroduce error, id = ${userIntroduceId}`, e);
      return false;
    });
}

