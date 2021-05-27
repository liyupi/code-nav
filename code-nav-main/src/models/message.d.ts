export interface MessageType {
  _id: string;
  title?: string;
  content?: string;
  fromUserId?: string;
  toUserId?: string;
  status?: number;
  type?: number;
  _createTime?: Date;
  _updateTime?: Date;
  readTime?: Date;
  isDelete?: boolean;
}
