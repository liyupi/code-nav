/**
 * HelloWorld 云函数
 */
const cloud = require("@cloudbase/node-sdk");

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
  });

  // 获取 db 对象
  const db = app.database();

  const {name} = event;

  return `hello, ${name}`;
};

