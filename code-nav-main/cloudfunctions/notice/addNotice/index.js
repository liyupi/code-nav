const cloud = require('@cloudbase/node-sdk');

// 鉴权，仅管理员可调用该接口
const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV,
});
const db = app.database();
const collection = db.collection('notice');

/**
 * 添加通知
 * @param event
 * @param context
 * @author yupili
 */
exports.main = async (event, context) => {
  const { title, content } = event;
  // 请求参数校验
  if (!title) {
    return false;
  }
  // 获取当前登录用户
  const { userInfo } = app.auth().getEndUserInfo();
  if (!userInfo || !userInfo.customUserId) {
    return false;
  }
  const currentUser = await db
    .collection('user')
    .where({
      unionId: userInfo.customUserId,
      isDelete: false,
    })
    .limit(1)
    .get()
    .then(({ data }) => data[0]);
  // 仅管理员可操作
  if (!currentUser || !currentUser._id || !currentUser.authority.includes('admin')) {
    return false;
  }

  return await collection
    .add({
      title,
      content,
      userId: currentUser._id,
      isDelete: false,
      _createTime: new Date(),
      _updateTime: new Date(),
    })
    .then((res) => {
      console.log('addNotice succeed', res);
      return true;
    })
    .catch((e) => {
      console.error('addNotice error', e);
      return false;
    });
};
