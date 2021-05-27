const cloud = require("@cloudbase/node-sdk");

/**
 * 浏览资源
 * @param event
 * @param context
 */
exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  const db = app.database();
  const _ = db.command;

  const {resourceId} = event;

  if (!resourceId) {
    return false;
  }

  const resource = await db.collection('resource')
    .where({
      _id: resourceId,
      isDelete: false,
    }).get().then(({data}) => data[0]);

  if (!resource) {
    return false;
  }

  return db.collection('resource')
    .doc(resourceId)
    .update({
      viewNum: _.inc(1),
      _updateTime: new Date(),
    });
};
