const cloud = require('@cloudbase/node-sdk');

// 鉴权，仅管理员可调用该接口
const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV,
});
const db = app.database();

/**
 * 修改通知
 * @param event
 * @param context
 * @author yupili
 */
exports.main = async (event, context) => {
  const { noticeId, title, content, isDelete } = event;
  // 请求参数校验
  if (!noticeId || (title === undefined && content === undefined && isDelete === undefined)) {
    return false;
  }

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
  // 仅管理员可更新
  if (!currentUser || !currentUser._id || !currentUser.authority.includes('admin')) {
    return false;
  }

  const updateData = {
    _updateTime: new Date(),
  };
  if (title !== undefined) {
    updateData.title = title;
  }
  if (content !== undefined) {
    updateData.title = title;
  }
  if (isDelete !== undefined) {
    updateData.isDelete = isDelete;
  }
  return await db.collection('notice').doc(noticeId).update(updateData);
};
