import {getApp} from '@/tcb';
import {wrapPageQuery} from '@/utils/utils';
import type {ResourceType} from '@/models/resource';
import reviewStatusEnum, {reviewStatusInfoMap} from '@/constant/reviewStatusEnum';
import {getMockData, MOCK_OPEN} from "../../mock";

const app = getApp();
const db = app.database();
const collection = db.collection('resource');
const _ = db.command;

export interface ResourceSearchParams {
  _ids?: string[];
  notId?: string;
  name?: string;
  tags?: string[];
  reviewStatus?: number;
  userId?: string;
  pageSize?: number;
  pageNum?: number;
  orderKey?: string;
  order?: string;
  link?: string;
}

/**
 * 添加资源
 * @param params
 * @return 资源 id
 */
export function addResource(params: ResourceType) {
  if (!params.userId || !params.tags || params.tags.length < 1) {
    return false;
  }

  return app
    .callFunction({
      name: 'addResource',
      data: params,
    })
    .then((res: any) => {
      console.log(`addResource succeed`, res);
      return res.result;
    })
    .catch((e: any) => {
      console.error(`addResource error`, e);
      return false;
    });
}

/**
 * 搜索资源
 * @param params
 */
export async function searchResources(params: ResourceSearchParams) {
  const condition = getSearchConditions(params);
  const query = wrapPageQuery(collection.where(condition), params.pageSize, params.pageNum);
  return query
    .orderBy(params.orderKey ?? 'publishTime', params.order ?? 'desc')
    .get()
    .then(({data}: any) => {
      console.log(`searchResources succeed, length = ${data.length}`);
      return data;
    })
    .catch((e: any) => {
      console.error('searchResources error', e);
      return [];
    });
}

/**
 * 分页搜索资源
 * @param params
 */
export async function searchResourcesByPage(params: ResourceSearchParams) {
  if (MOCK_OPEN) {
    return getMockData(searchResourcesByPage.name);
  }
  const {pageSize = 12, pageNum = 1} = params;
  const condition = getSearchConditions(params);
  // 分页查总数
  const total = await collection
    .where(condition)
    .count()
    .then((res) => res.total)
    .catch(err => {
      console.error('getTotal error', err);
      return 0;
    });

  const query = wrapPageQuery(collection.where(condition), pageSize, pageNum);
  return query
    .orderBy(params.orderKey ?? 'publishTime', params.order ?? 'desc')
    .get()
    .then(({data}: any) => {
      console.log(`searchResourcesByPage succeed, length = ${data.length}, total = ${total}`);
      return {
        data,
        total,
      };
    })
    .catch((e: any) => {
      console.error('searchResourcesByPage error', e);
      return {
        data: [],
        total: 0,
      };
    });
}

/**
 * 根据 id 列表分页获取资源
 * @param resourceIds
 * @param pageSize
 * @param pageNum
 */
export async function listResourcesByIdsByPage(
  resourceIds: string[],
  pageSize: number,
  pageNum: number,
) {
  if (!resourceIds || resourceIds.length === 0) {
    return {
      data: [],
      total: 0,
    };
  }

  const params: ResourceSearchParams = {
    _ids: resourceIds,
    reviewStatus: reviewStatusEnum.PASS,
    pageSize,
    pageNum,
  };
  return searchResourcesByPage(params);
}

/**
 * 增加分享数
 * @param resourceId
 */
export function addShareNum(resourceId: string) {
  if (!resourceId) {
    return false;
  }

  return app
    .callFunction({
      name: 'addShareNum',
      data: {
        resourceId,
      },
    })
    .then((res: any) => {
      console.log('addShareNum succeed');
      return res;
    })
    .catch((e: any) => {
      console.error('addShareNum error', e);
    });
}

/**
 * 收藏（取消收藏）
 * @param resourceId
 * @return 收藏数变化
 */
export function likeResource(resourceId: string) {
  if (!resourceId) {
    return 0;
  }

  return app
    .callFunction({
      name: 'likeResource',
      data: {
        resourceId,
      },
    })
    .then((res: any) => {
      console.log('likeResource succeed');
      return res.result;
    })
    .catch((e: any) => {
      console.error('likeResource error', e);
      return 0;
    });
}

/**
 * 根据用户兴趣获取推荐资源
 * @param size
 */
export function listRecommendResources(size: number = 12) {
  return app
    .callFunction({
      name: 'listRecommendResources',
      data: {
        size,
      },
    })
    .then(({result}: any) => {
      console.log('listRecommendResources succeed');
      return result;
    })
    .catch((e: any) => {
      console.error('listRecommendResources error', e);
      return [];
    });
}

/**
 * 修改资源
 * @param resourceId
 * @param resource
 */
export async function updateResource(resourceId: string, resource: Partial<ResourceType>) {
  if (!resourceId || !resource || !resource.tags || resource.tags.length < 1) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateResource',
      data: {
        resourceId,
        resource,
      },
    })
    .then((res: any) => {
      console.log(`updateResource succeed, id = ${resourceId}`, res);
      return true;
    })
    .catch((e: any) => {
      console.error(`updateResource error, id = ${resourceId}`, e);
      return false;
    });
}

/**
 * 根据 id 获取资源
 * @param resourceId
 */
export function getResource(resourceId: string) {
  if (MOCK_OPEN) {
    return getMockData(getResource.name);
  }

  if (!resourceId) {
    return null;
  }

  return collection
    .where({
      _id: resourceId,
      isDelete: false,
    })
    .limit(1)
    .get()
    .then(({data}: any) => {
      console.log(`getResource succeed, id = ${resourceId}`);
      return data[0];
    })
    .catch((e: any) => {
      console.error(`getResource error, id = ${resourceId}`, e);
      return null;
    });
}

/**
 * 审核资源
 * @param resourceId
 * @param reviewStatus
 * @param reviewMessage
 */
export async function reviewResource(
  resourceId: string,
  reviewStatus: number,
  reviewMessage?: string,
) {
  if (!resourceId || !reviewStatusInfoMap[reviewStatus]) {
    return false;
  }

  return app
    .callFunction({
      name: 'reviewResource',
      data: {
        resourceId,
        reviewStatus,
        reviewMessage,
      },
    })
    .then((res: any) => {
      console.log(`reviewResource succeed, id = ${resourceId}`);
      return res;
    })
    .catch((e: any) => {
      console.error(`reviewResource error, id = ${resourceId}`, e);
      return false;
    });
}

/**
 * 更新标签
 * @param currentTag
 * @param newTag
 */
export async function updateTag(currentTag: string, newTag: string) {
  if (!currentTag || !newTag) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateTags',
      data: {
        currentTag,
        newTag,
      },
    })
    .then((res: any) => {
      console.log(`updateTag succeed`, res);
      return res;
    })
    .catch((e: any) => {
      console.error(`updateTag error`, e);
      return false;
    });
}

/**
 * 浏览资源
 * @param resourceId
 */
export async function viewResource(resourceId: string) {
  if (!resourceId) {
    return false;
  }

  return app
    .callFunction({
      name: 'viewResource',
      data: {
        resourceId,
      },
    })
    .then((res: any) => {
      console.log(`viewResource succeed, id = ${resourceId}`, res);
      return true;
    })
    .catch((e: any) => {
      console.error(`viewResource error, id = ${resourceId}`, e);
      return false;
    });
}

/**
 * 获得搜索条件
 * @param params
 */
function getSearchConditions(params: ResourceSearchParams) {
  const condition: any = {isDelete: false, reviewStatus: params.reviewStatus};
  if (params._ids) {
    condition._id = _.in(params._ids);
  }
  if (params.notId) {
    condition._id = _.neq(params.notId);
  }
  if (params.userId) {
    condition.userId = params.userId;
  }
  if (params.name) {
    condition.name = {
      $regex: `.*${params.name}.*`,
      $options: 'i',
    };
  }
  if (params.link) {
    condition.link = params.link;
  }

  if (params.tags && params.tags.length > 0) {
    condition.tags = _.in([params.tags[0]]);
    for (let i = 1; i < params.tags.length; i += 1) {
      condition.tags = condition.tags.and(_.in([params.tags[i]]));
    }
  }
  return condition;
}
