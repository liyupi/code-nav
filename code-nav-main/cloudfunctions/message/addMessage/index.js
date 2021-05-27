const cloud = require('@cloudbase/node-sdk');

/**
 * 发送系统消息（内部调用）
 * @param event
 * @param context
 */
exports.main = async (event, context) => {
  const { toUserId, title, content } = event;

  // 请求参数校验
  if (!toUserId || !title) {
    return false;
  }

  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const db = app.database();

  // 封装数据
  const data = {
    toUserId,
    title,
    content,
    fromUserId: 0,
    status: 0,
    type: 0,
    _createTime: new Date(),
    _updateTime: new Date(),
    isDelete: false,
  };

  // 插入数据
  return await db
    .collection('message')
    .add(data)
    .then((res) => {
      console.log(`addMessage succeed, id = ${res.id}`);
      return true;
    })
    .catch((e) => {
      console.error('addMessage error', e);
      return false;
    });
};
