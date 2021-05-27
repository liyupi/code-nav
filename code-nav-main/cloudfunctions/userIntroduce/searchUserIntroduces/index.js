const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV,
});
const db = app.database();
const collection = db.collection('userIntroduce');
const _ = db.command;
const $ = db.command.aggregate;

/**
 * 获取用户介绍（支持分页）
 * @param event
 * @param context
 */
exports.main = async (event, context) => {
  const { pageSize = 10, pageNum = 1 } = event;

  const conditions = getSearchConditions(event);

  // 查询总数
  const total = await collection
    .where(conditions)
    .count()
    .then((res) => {
      return res.total;
    });

  if (!total) {
    return {
      total: 0,
      data: [],
    };
  }

  // 查询消息
  const data = await collection
    .aggregate()
    .match(conditions)
    .lookup({
      from: 'user',
      let: {
        userId: '$userId',
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([$.eq(['$_id', '$$userId'])])))
        .project({
          avatarUrl: 1,
          nickName: 1,
        })
        .done(),
      as: 'userInfo',
    })
    .sort({
      _createTime: -1,
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .end()
    .then((res) => {
      return res.data;
    });

  return {
    total,
    data,
  }
};

/**
 * 获得搜索条件
 * @param params
 */
function getSearchConditions(params) {
  const condition = { isDelete: false, reviewStatus: params.reviewStatus, contact: _.neq('') };
  if (params.content) {
    condition.content = {
      $regex: `.*${params.content}.*`,
      $options: 'i',
    };
  }
  if (params.tags && params.tags.length > 0) {
    condition.tags = _.in([params.tags[0]]);
    for (let i = 1; i < params.tags.length; i += 1) {
      condition.tags = condition.tags.and(_.in([params.tags[i]]));
    }
  }
  return condition;
}
