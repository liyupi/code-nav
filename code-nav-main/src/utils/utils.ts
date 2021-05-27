import {parse} from 'querystring';
import {ResourceType} from "@/models/resource";
import moment from "moment";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
export const URL_REG = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => URL_REG.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 让查询支持分页
 * @param query
 * @param pageSize
 * @param pageNum
 */
export const wrapPageQuery = (query: any, pageSize?: number, pageNum?: number) => {
  if (pageSize) {
    query = query.limit(pageSize);
    if (pageNum) {
      query = query.skip(pageSize * (pageNum - 1));
    }
  }
  return query;
}

/**
 * 获取评分
 */
export const getRate = (resource?: ResourceType) => {
  // 3 人评论才有效
  if (!resource || !resource.rate || !resource.rateNum || resource.rateNum < 3) {
    return null;
  }
  return Math.min(resource.rate + 0.5, 5);
}

/**
 * 美化文本
 *
 * @param str
 */
export const beautifyDetail = (str: string) => {
  str = str.replace(/\n/g,"<br/>")
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  if (str.length && reg.exec(str)) {
    return str.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>");
  }
  return str;
}

/**
 * 获得格式化日期字符串
 * @param time
 */
export const formatDateStr = (time: any) => {
  if (!time) {
    return '';
  }
  return moment(time).format('YYYY-MM-DD');
}

/**
 * 获得格式化日期时间字符串
 * @param time
 */
export const formatDateTimeStr = (time: any) => {
  if (!time) {
    return '';
  }
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

