const cloud = require("@cloudbase/node-sdk");

/**
 * 获取当前用户收到的消息（支持分页）
 * @param event
 * @param context
 */
exports.main = async (event, context) => {

  const {type, status, pageSize = 10, pageNum = 1} = event;

  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const {userInfo} = app.auth().getEndUserInfo();

  if (!userInfo || !userInfo.customUserId) {
    return null;
  }

  const db = app.database();

  const currentUser = await db.collection("user")
    .where({
      unionId: userInfo.customUserId,
      isDelete: false,
    }).limit(1).get().then(({data}) => data[0]);

  if (!currentUser || !currentUser._id) {
    return null;
  }

  const condition = {
    toUserId: currentUser._id,
    isDelete: false,
  };

  if (status > -1) {
    condition.status = status;
  }

  if (type > -1) {
    condition.type = type;
  }

  // 查询总数
  const total = await db.collection("message")
    .where(condition)
    .count()
    .then(res => {
      return res.total;
    });

  if (!total) {
    return {
      total: 0,
      data: [],
    }
  }

  // 查询消息
  const list = await db.collection("message")
    .where(condition)
    .skip((pageNum - 1) * pageSize)
    .orderBy('_createTime', 'desc')
    .limit(pageSize)
    .get()
    .then(res => {
      return res.data;
    });

  return {
    total,
    data: list,
  }
};
