const Redis = require('ioredis');

const redis = new Redis({
  host: '10.0.192.8',
  port: 6379,
  password: 'bcdh6666',
});

/**
 * Redis 服务
 *
 * @desc 支持多种操作
 * @param event
 * @param context
 * @author yupili
 */
exports.main = async (event, context) => {
  const { op, key, value, expireSeconds } = event;
  if (!op || !key) {
    return null;
  }

  switch (op) {
    case 'set':
      return set(key, value, expireSeconds);
    case 'setnx':
      return setnx(key, value, expireSeconds);
    case 'get':
      return get(key);
    default:
      return null;
  }
};

function set(key, value, expireSeconds) {
  if (expireSeconds) {
    return redis.set(key, value, 'EX', expireSeconds);
  }
  return redis.set(key, value);
}

function setnx(key, value, expireSeconds) {
  if (expireSeconds) {
    return redis.set(key, value, 'EX', expireSeconds, 'NX');
  }
  return redis.set(key, value, 'NX');
}

function get(key) {
  return redis.get(key);
}
