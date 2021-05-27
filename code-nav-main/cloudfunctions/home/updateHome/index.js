const cloud = require("@cloudbase/node-sdk");

/**
 * 更新主页模板
 * @param event
 * @param context
 * @return {Promise<cloudbase.database.SetRes>}
 */
exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const db = app.database();

  const {homeId, home, userId} = event;

  if (!homeId || !home || !userId) {
    return;
  }

  const originHome = await db.collection('home')
    .where({
      _id: homeId,
      userId,
      isDelete: false,
    }).get().then(({data}) => data[0]);

  if (!originHome) {
    return;
  }

  return db.collection('home')
    .doc(homeId)
    .update({
      ...home,
      _updateTime: new Date(),
    });
};
