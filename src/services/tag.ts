import {getApp} from "@/tcb";
import {TagType} from "@/models/tag";

// 云开发对象
const app = getApp();
const db = app.database();

/**
 * 搜索参数
 */
export interface TagSearchParams {
}

/**
 * 新增
 * @param params
 * @return id
 */
export function add(params: TagType) {
  // todo 请求
  return "id";
}

/**
 * 搜索
 * @param params
 * @param pageSize
 * @param pageNum
 */
export function searchByPage(params: TagSearchParams = {}, pageSize?: number, pageNum?: number) {

}
