import {getApp} from "@/tcb";
import {CategoryType} from "@/models/category";

// 云开发对象
const app = getApp();
const db = app.database();

/**
 * 搜索参数
 */
export interface CategorySearchParams {
}

/**
 * 新增
 * @param params
 * @return id
 */
export function add(params: CategoryType) {
  // todo 请求
  return "id";
}

/**
 * 搜索
 * @param params
 * @param pageSize
 * @param pageNum
 */
export function search(params: CategorySearchParams = {}, pageSize?: number, pageNum?: number) {
  // todo 请求
  return [];
}
