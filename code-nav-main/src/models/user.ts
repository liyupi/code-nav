import {Effect, Reducer} from 'umi';

import {message} from "antd";
import {getById} from "@/services/user";

export interface CurrentUser {
  _id?: string;
  nickName?: string;
  interests?: string[];
  score?: number;
  title?: string;
  avatarUrl?: string;
}

export interface SimpleUser {
  _id?: string;
  nickName?: string;
  avatarUrl?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
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
    currentUser: undefined,
  },

  effects: {
    * fetchCurrent({payload}, {call, put}) {
      const {userId} = payload;
      if (!userId) {
        return;
      }
      const user = yield call(getById, userId);
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
