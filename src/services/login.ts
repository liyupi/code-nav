/**
 * 登录参数
 */
import {MOCK_USER} from "../../mock/user";

export interface LoginParamsType {
}

/**
 * 用户登录
 * @param params
 * @return userInfo
 */
export async function login(params: LoginParamsType) {
  // todo 请求
  return MOCK_USER;
}

/**
 * 用户退出登录
 */
export async function logout() {
  // todo 请求
  return true;
}
