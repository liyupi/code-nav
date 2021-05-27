/**
 * 公告类型
 */
export interface NoticeType {
  _id: string;
  userId: string;
  title: string;
  content?: string;
  isDelete?: boolean;
  _createTime?: Date;
  _updateTime?: Date;
}
