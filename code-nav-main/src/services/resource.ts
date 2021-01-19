import {getApp} from "@/tcb";
import {ResourceType} from "@/models/resource";
import {MOCK_RESOURCES} from "../../mock/resources";

// 云开发对象
const app = getApp();
const db = app.database();

/**
 * 搜索参数
 */
export interface ResourceSearchParams {
  name?: string;
  form?: string;
  category?: string;
  pageSize?: number;
  pageNum?: number;
}

/**
 * 增加
 * @param params
 * @return id
 */
export function add(params: ResourceType) {
  // todo 请求
  return "id";
}

/**
 * 搜索
 * @param params
 */
export async function search(params: ResourceSearchParams) {
  // todo 请求
  return MOCK_RESOURCES;
}

/**
 * 分页搜索
 * @param params
 */
export async function searchByPage(params: ResourceSearchParams) {
  // todo 请求
  return {
    data: MOCK_RESOURCES,
    total: MOCK_RESOURCES.length,
  };
}

/**
 * 获取推荐资源
 * @param pageNum
 * @param pageSize
 */
export function listRecommend(pageNum: number = 1, pageSize: number = 10) {
  // todo 请求
  return MOCK_RESOURCES;
}

/**
 * 修改资源
 * @param resourceId
 * @param resource
 * @param userId
 */
export async function update(resourceId: string, resource: Partial<ResourceType>, userId: string) {
  // todo 请求
  return true;
}

/**
 * 根据 id 获取资源
 * @param id
 */
export function getById(id: string) {
  // todo 请求
  return MOCK_RESOURCES[0];
}

/**
 * 审核
 * @param resourceId
 * @param result 审核结果
 * @param message 审核信息
 */
export function review(resourceId: string, result: number, message?: string) {
  // todo 请求
  return true;
}

/**
 * 喜欢资源
 * @param resourceId
 * @param userId
 */
export function likeResource(resourceId: string, userId: string) {
  // todo 请求
  return true;
}
