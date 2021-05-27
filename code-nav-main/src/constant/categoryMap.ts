interface CategoryType {
  name: string;
  mapTag: string;
}

declare type CategoryMapType = { [key: string]: CategoryType };

/**
 * 分类专栏映射
 */
export const CATEGORY_MAP: CategoryMapType = {
  tutorial: {
    name: '贴心教程',
    mapTag: '教程',
  },
  algorithm: {
    name: '算法数据结构',
    mapTag: '算法',
  },
  system: {
    name: '计算机系统',
    mapTag: '系统',
  },
};
