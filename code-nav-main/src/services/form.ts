import {getApp} from "@/tcb";
import {FormType} from "@/models/form";

// 云开发对象
const app = getApp();
const db = app.database();

export interface FormSearchParams {
}

/**
 * 新增
 * @param params
 * @return id
 */
export function add(params: FormType) {
  // todo 请求
  return "id";
}

/**
 * 搜索
 * @param params
 * @param pageSize
 * @param pageNum
 */
export function search(params: FormSearchParams = {}, pageSize?: number, pageNum?: number) {
  // todo 请求
  return [];
}
