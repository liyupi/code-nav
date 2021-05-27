import type {Effect, Reducer} from 'umi';

import {getUserById} from '@/services/user';
import {message} from "antd";

export interface CurrentUser {
  _id?: string;
  avatarUrl?: string;
  nickName?: string;
  gender?: number;
  city?: string;
  province?: string;
  country?: string;
  language?: string;
  likeResourceIds?: string[];
  interests?: string[];
  score?: number;
  title?: string;
}

export interface SimpleUser {
  _id?: string;
  avatarUrl?: string;
  nickName?: string;
  score?: number;
}

export interface UserModelState {
  currentUser: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    setCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    * fetchCurrent({payload}, {call, put}) {
      const {userId} = payload;
      if (!userId) {
        return;
      }
      const user = yield call(getUserById, userId);
      if (!user) {
        message.error('获取用户信息失败，请刷新重试');
        return;
      }
      yield put({
        type: 'setCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    setCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || undefined,
      };
    },
  },
};

export default UserModel;
