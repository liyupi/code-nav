import {parse} from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
export const URL_REG = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => URL_REG.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 让云开发查询支持分页
 *
 * @param query 云开发对象
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
