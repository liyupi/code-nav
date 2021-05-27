const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV,
});

const db = app.database();
const _ = db.command;

/**
 * 为用户介绍点赞
 * @param event
 */
exports.main = async (event) => {
  const { userIntroduceId } = event;

  if (!userIntroduceId) {
    return false;
  }

  // 登录才能点赞
  const {userInfo} = app.auth().getEndUserInfo();

  if (!userInfo || !userInfo.customUserId) {
    return false;
  }

  const currentUser = await db.collection("user")
    .where({
      unionId: userInfo.customUserId,
      isDelete: false,
    }).limit(1).get().then(({data}) => data[0]);

  if (!currentUser || !currentUser._id) {
    return false;
  }

  console.log(`thumbUpUserIntroduce userId = ${currentUser._id}`);

  return await db
    .collection('userIntroduce')
    .doc(userIntroduceId)
    .update({
      thumbNum: _.inc(1),
      _updateTime: new Date(),
    });
};
