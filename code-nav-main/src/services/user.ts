import { getApp } from '@/tcb';
import { listResourcesByIdsByPage } from '@/services/resource';
import {getMockData, MOCK_OPEN} from "../../mock";

const app = getApp();

/**
 * 查询用户
 * @param userId
 */
export function getUserById(userId: string) {
  if (!userId) {
    return null;
  }
  return app
    .callFunction({
      name: 'getUser',
      data: {
        userId,
      },
    })
    .then(({ result }) => {
      console.log(`getUser succeed`);
      return result;
    })
    .catch((e: any) => {
      console.error('getUser error', e);
      return null;
    });
}

/**
 * 查询当前用户
 * @param unionId
 */
export function getCurrentUser(unionId: string) {
  if (!unionId) {
    return null;
  }

  return app
    .callFunction({
      name: 'getUser',
      data: {
        unionId,
      },
    })
    .then(({ result }: any) => {
      console.log('getCurrentUser succeed');
      return result;
    })
    .catch((e: any) => {
      console.error('getCurrentUser error', e);
      return null;
    });
}

/**
 * 查询用户简略信息
 * @param userId
 */
export function getUserSimpleInfo(userId: string) {
  if (MOCK_OPEN) {
    return getMockData(getUserSimpleInfo.name);
  }

  if (!userId) {
    return null;
  }

  return app
    .callFunction({
      name: 'getSimpleUser',
      data: {
        userId,
      },
    })
    .then(({ result }) => {
      console.log(`getUserSimpleInfo succeed`);
      return result;
    })
    .catch((e: any) => {
      console.error('getUserSimpleInfo error', e);
      return null;
    });
}

/**
 * 分页获取用户收藏的资源列表
 * @param userId
 * @param pageSize
 * @param pageNum
 */
export async function getUserLikeResourcesByPage(
  userId: string,
  pageSize: number,
  pageNum: number,
) {
  const user = await getUserById(userId);
  if (!user || !user.likeResourceIds || user.likeResourceIds.length === 0) {
    return {
      data: [],
      total: 0,
    };
  }
  // 分页
  return listResourcesByIdsByPage(user.likeResourceIds, pageSize, pageNum)
    .then((res: any) => {
      console.log(`getUserLikeResourcesByPage succeed, total = ${res.data.length}`);
      return res;
    })
    .catch((e: any) => {
      console.error('getUserLikeResourcesByPage error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

/**
 * 更新用户兴趣
 * @param interests
 */
export function updateUserInterests(interests: string[]) {
  if (!interests) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateUserInterests',
      data: {
        interests,
      },
    })
    .then((res: any) => {
      console.log(`updateUserInterests succeed`, res);
      return true;
    })
    .catch((e: any) => {
      console.error(`updateUserInterests error`, e);
      return false;
    });
}

/**
 * 查询用户积分总排行
 * @param pageSize
 * @param pageNum
 */
export function listUserTotalRank(pageSize: number = 10, pageNum: number = 1) {
  return app
    .callFunction({
      name: 'listUserTotalRank',
      data: {
        pageSize,
        pageNum,
      },
    })
    .then(({ result }) => {
      console.log(`listUserTotalRank succeed`);
      return result;
    })
    .catch((e: any) => {
      console.error('listUserTotalRank error', e);
      return [];
    });
}

/**
 * 查询指定用户的积分排行
 * @param userId
 */
export function getUserRank(userId: string) {
  if (!userId) {
    return -1;
  }
  return app
    .callFunction({
      name: 'getUserRank',
      data: {
        userId,
      },
    })
    .then(({ result }) => {
      console.log(`getUserRank succeed`, result);
      return result;
    })
    .catch((e: any) => {
      console.error('getUserRank error', e);
      return -1;
    });
}

/**
 * 查询用户周期积分排行
 * @param cycle
 * @param countDate
 * @param pageSize
 */
export async function listUserCycleRank(cycle: number = 0, countDate: string, pageSize: number = 10) {
  if (cycle < 0 || cycle > 1 || !countDate) {
    return [];
  }

  return app
    .callFunction({
      name: 'listUserCycleRank',
      data: {
        cycle,
        countDate,
        pageSize,
      },
    })
    .then(({ result }) => {
      console.log(`listUserCycleRank succeed`);
      return result;
    })
    .catch((e: any) => {
      console.error('listUserCycleRank error', e);
      return [];
    });
}
