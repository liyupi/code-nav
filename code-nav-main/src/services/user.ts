import {getApp} from "@/tcb";
import {MOCK_USER, MOCK_SIMPLE_USER} from "../../mock/user";
import {CurrentUser} from "@/models/user";

// 云开发对象
const app = getApp();
const db = app.database();

/**
 * 查询用户
 * @param userId
 */
export function getById(userId: string) {
  // todo 请求
  return MOCK_USER;
}

/**
 * 查询用户简略信息
 * @param userId
 */
export function getSimpleById(userId: string) {
  // todo 请求
  return MOCK_SIMPLE_USER;
}

/**
 * 更新
 * @param userId
 * @param user
 */
export function update(userId: string, user: CurrentUser) {
  // todo 请求
  return true;
}
