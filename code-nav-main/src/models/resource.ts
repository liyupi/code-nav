import type {Effect, Reducer} from 'umi';
import { history} from 'umi';
import {addResource, searchResources, updateResource} from "@/services/resource";
import {message} from "antd";

export interface ResourceType {
  _id: string;
  name?: string;
  icon?: string;
  desc?: string;
  detail?: string;
  likeNum?: number;
  shareNum?: number;
  tags: string[];
  link?: string;
  reviewStatus: number;
  reviewMessage?: string;
  userId?: string;
  rate?: number;
  rateNum?: number;
  viewNum?: number;
  explain?: string;
  priority?: number;
  _createTime?: Date;
  _updateTime?: Date;
  reviewTime?: Date;
  publishTime?: Date;
}

export interface ResourceModelState {
  resources?: ResourceType[];
}

export interface ResourceModelType {
  namespace: 'resource';
  state: ResourceModelState;
  effects: {
    search: Effect;
    add: Effect;
    update: Effect;
  };
  reducers: {
    setResources: Reducer<ResourceModelState>;
  };
}

const Model: ResourceModelType = {
  namespace: 'resource',

  state: {
    resources: [],
  },

  effects: {
    * search({payload}, {call, put}) {
      const response = yield call(searchResources, payload);
      yield put({
        type: 'setResources',
        payload: response,
      });
    },
    * add({payload}, {call}) {
      const rid = yield call(addResource, payload);
      if (rid) {
        history.replace({
          pathname: '/addSucceed',
          query: {
            rid,
          }
        });
      } else {
        message.error('提交失败，请刷新页面重试！');
      }
    },
    * update({payload}, {call}) {
      const res = yield call(updateResource, payload.resourceId, payload.resource);
      if (res) {
        history.replace({
          pathname: '/addSucceed',
          query: {
            rid: payload.resourceId,
          }
        });
      } else {
        message.error('修改失败，请刷新页面重试！');
      }
    },
  },

  reducers: {
    setResources(
      state,
      action
    ) {
      return {
        ...state,
        resources: action.payload,
      };
    },
  },
};

export default Model;
