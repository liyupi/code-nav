import copy from "copy-to-clipboard";
import {message} from "antd";
import {ResourceType} from "@/models/resource";
import {LEVELS, LevelType} from "@/constant/level";

/**
 * 分享
 */
export const doShare = async (resource: ResourceType) => {
  // 复制到剪切板
  if (resource._id) {
    copy(`『 ${resource.name} 』对编程很有帮助，快来看看`);
    message.success('链接已复制，感谢分享！');
  }
}

/**
 * 根据积分获取等级
 * @param score
 */
export const getLevel = (score?: number): LevelType => {
  if (!score) {
    return LEVELS[0];
  }
  for (let i = 0; i < LEVELS.length; i++) {
    if (score < LEVELS[i].score) {
      return LEVELS[i];
    }
  }
  return LEVELS[LEVELS.length - 1];
}
