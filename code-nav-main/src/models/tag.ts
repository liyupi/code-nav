import type { Effect, Reducer } from 'umi';
import { getTags } from '@/services/tag';
import { message } from 'antd';

export type TagType = string;

export interface GroupTag {
  name: string;
  tags: TagType[];
}

declare type categoryTagsMapType = Record<string, { must: string, tags: string[] }>;

export interface WholeTagsMap {
  hotTags: TagType[];
  allTags: TagType[];
  groupTags: GroupTag[];
  userIntroduceGroupTags: GroupTag[];
  categoryTagsMap: categoryTagsMapType;
}

export interface TagModelState {
  wholeTagsMap: WholeTagsMap;
}

export interface TagModelType {
  namespace: 'tag';
  state: TagModelState;
  effects: {
    get: Effect;
  };
  reducers: {
    setWholeTagsMap: Reducer<TagModelState>;
  };
}

const Model: TagModelType = {
  namespace: 'tag',

  state: {
    wholeTagsMap: { hotTags: [], groupTags: [], userIntroduceGroupTags: [], allTags: [], categoryTagsMap: {} },
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(getTags, payload);
      if (response) {
        yield put({
          type: 'setWholeTagsMap',
          payload: response,
        });
      } else {
        message.error('获取标签失败，请刷新页面');
      }
    },
  },

  reducers: {
    setWholeTagsMap(state, action) {
      return {
        ...state,
        wholeTagsMap: action.payload,
      };
    },
  },
};

export default Model;
