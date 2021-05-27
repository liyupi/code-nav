const cloud = require("@cloudbase/node-sdk");

/**
 * 获取指定用户信息（传 unionId 为获取当前登录用户信息）
 * @param event
 * @param context
 * @return {Promise<boolean|number>}
 */
exports.main = async (event, context) => {
  const {userId, unionId} = event;

  if (!userId && !unionId) {
    return null;
  }

  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const {userInfo} = app.auth().getEndUserInfo();

  if (!userInfo || !userInfo.customUserId) {
    return false;
  }

  const db = app.database();

  // 获取当前用户
  const currentUser = await db.collection("user")
    .where({
      unionId: userInfo.customUserId,
      isDelete: false,
    }).limit(1).get().then(({data}) => data[0]);

  if (!currentUser || !currentUser._id) {
    return false;
  }

  // 获取某 user 信息
  if (userId) {
    if (currentUser._id === userId) {
      return currentUser;
    }
    if (currentUser.authority.includes('admin')) {
      return db.collection("user")
        .where({
          _id: userId,
          isDelete: false,
        }).limit(1).get().then(({data}) => data[0]);
    }
    return null;
  }

  // 根据 unionId 获取信息（用于首次登录）
  if (unionId !== userInfo.customUserId) {
    return null;
  }

  return currentUser;
};
