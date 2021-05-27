import { getApp } from '@/tcb';
import { MESSAGE_STATUS_ENUM } from '@/constant/message';

const app = getApp();

export interface MessageSearchParams {
  status?: number;
  type?: number;
  pageSize?: number;
  pageNum?: number;
}

/**
 * 获取当前用户收到的消息（支持分页）
 * @param params
 */
export async function searchMessages(params: MessageSearchParams) {
  const defaultValue = {
    total: 0,
    data: [],
  };

  if (!params) {
    return defaultValue;
  }

  return app
    .callFunction({
      name: 'searchMessages',
      data: params,
    })
    .then(({ result }: any) => {
      console.log('searchMessages succeed', result);
      return result;
    })
    .catch((e: any) => {
      console.error('searchMessages error', e);
      return defaultValue;
    });
}

/**
 * 删除消息
 * @param messageId
 */
export function deleteMessage(messageId: string) {
  if (!messageId) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateMessage',
      data: {
        messageId,
        isDelete: true,
      },
    })
    .then(({ result }: any) => {
      console.log('deleteMessage succeed', result);
      return true;
    })
    .catch((e: any) => {
      console.error('deleteMessage error', e);
      return false;
    });
}

/**
 * 阅读消息
 * @param messageId
 */
export function readMessage(messageId: string) {
  if (!messageId) {
    return false;
  }

  return app
    .callFunction({
      name: 'updateMessage',
      data: {
        messageId,
        status: MESSAGE_STATUS_ENUM.HAS_READ,
      },
    })
    .then(({ result }: any) => {
      console.log('readMessage succeed', result);
      return true;
    })
    .catch((e: any) => {
      console.error('readMessage error', e);
      return false;
    });
}

/**
 * 获取当前用户收到的消息数
 * @param params
 */
export async function countMyMessages(params: MessageSearchParams) {
  if (!params) {
    return 0;
  }

  return app
    .callFunction({
      name: 'countMyMessages',
      data: params,
    })
    .then(({ result }: any) => {
      console.log('countMyMessages succeed', result);
      return result;
    })
    .catch((e: any) => {
      console.error('countMyMessages error', e);
      return 0;
    });
}
