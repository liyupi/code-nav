import {WEB_HOST} from '@/constant';
import {addShareNum} from '@/services/resource';
import {message} from 'antd';
import type {ResourceType} from '@/models/resource';
import type { LevelType} from '@/constant/level';
import {LEVELS} from '@/constant/level';
import copy from 'copy-to-clipboard';

/**
 * 分享资源
 */
export const doShare = async (resource?: ResourceType) => {
  // 复制到剪切板，分享数 +1
  if (resource && resource._id) {
    copy(`我在编程导航发现了『 ${resource.name} 』💎 快来看看 ${WEB_HOST}/rd/?rid=${resource._id}`);
    addShareNum(resource._id);
    message.success('链接已复制，感谢分享！');
  }
};

/**
 * 根据积分获取等级
 * @param score
 */
export const getLevel = (score?: number): LevelType => {
  if (!score) {
    return LEVELS[0];
  }
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (score < LEVELS[i].score) {
      return LEVELS[i];
    }
  }
  return LEVELS[LEVELS.length - 1];
};
