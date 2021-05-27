const cloud = require("@cloudbase/node-sdk");

/**
 * 获取简略用户信息
 * @param event
 */
exports.main = async (event) => {
  const {userId} = event;

  if (!userId) {
    return null;
  }

  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });
  const db = app.database();

  return await db.collection("user")
    .field({
      _id: true,
      nickName: true,
      avatarUrl: true,
    }).where({
      _id: userId,
      isDelete: false,
    }).limit(1).get().then(({data}) => data[0]);
};
