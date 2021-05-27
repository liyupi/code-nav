const cloud = require("@cloudbase/node-sdk");

/**
 * 更新用户兴趣
 * @param event
 * @param context
 */
exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const {interests} = event;

  if (!interests || interests.length > 10) {
    return false;
  }

  const {userInfo} = app.auth().getEndUserInfo();

  if (!userInfo || !userInfo.customUserId) {
    return false;
  }

  const db = app.database();

  const currentUser = await db.collection("user")
    .where({
      unionId: userInfo.customUserId,
      isDelete: false,
    }).limit(1).get().then(({data}) => data[0]);

  if (!currentUser || !currentUser._id) {
    return false;
  }

  return db.collection("user")
    .doc(currentUser._id)
    .update({
      interests,
      _updateTime: new Date(),
    });
};
