import type {TagType} from "@/models/tag";
import type {SimpleUser} from "@/models/user";

/**
 * 用户介绍
 */
export interface UserIntroduceType {
  _id: string;
  userId: string;
  content: string;
  thumbNum: number;
  reviewStatus: number;
  reviewMessage?: string;
  contact: string;
  tags: TagType[];
  isDelete?: boolean;
  _createTime?: Date;
  _updateTime?: Date;
}

/**
 * 用户介绍（封装用户信息）
 */
export interface UserIntroduceUserType extends UserIntroduceType {
  userInfo: SimpleUser[];
  isThumb?: boolean;
}


