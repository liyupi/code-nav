import { getCurrentUser, getUserById } from '@/services/user';
import { getApp, tcbCustomLogin, tcbLogout } from '@/tcb';
import { getMockData, MOCK_OPEN } from '../../mock';

const app = getApp();

export interface LoginParamsType {
  captcha: string;
  type: string;
  userId?: string;
}

/**
 * 用户登录
 * @param params
 * @return user
 */
export async function login(params: LoginParamsType) {
  if (MOCK_OPEN) {
    return getMockData(login.name);
  }
  // tcb 登录
  const loginState = await tcbCustomLogin(params.captcha);
  if (!loginState || loginState.loginType !== 'CUSTOM' || !loginState.user.customUserId) {
    return null;
  }
  // 自动登录
  if (params.userId) {
    return getUserById(params.userId);
  }
  // 首次登录
  return getCurrentUser(loginState.user.customUserId);
}

/**
 * 用户退出登录
 */
export function logout() {
  return tcbLogout();
}

/**
 * 每日登录
 */
export async function doDailyLogin() {
  return app
    .callFunction({
      name: 'doDailyLogin',
    })
    .then((res) => res.result)
    .catch((err) => {
      console.error('doDailyLogin error', err);
      return false;
    });
}
