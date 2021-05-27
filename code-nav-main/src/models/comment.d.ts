import type { SimpleUser } from '@/models/user';

/**
 * 评论类型
 */
export interface CommentType {
  _id: string;
  userId: string;
  resourceId: string;
  content: string;
  rate: number;
  thumbNum: number;
  reviewStatus: number;
  reviewMessage?: string;
  reviewerId?: string;
  reviewTime?: Date;
  isDelete?: boolean;
  _createTime?: Date;
}

/**
 * 评论类型（封装用户信息）
 */
export interface CommentUserType extends CommentType {
  userInfo: SimpleUser[];
  isThumb?: boolean;
}
