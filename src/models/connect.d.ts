import {MenuDataItem} from '@ant-design/pro-layout';
import {UserModelState} from './user';
import {StateType} from './login';
import {TagModelState} from "@/models/tag";
import {FormModelState} from "@/models/form";
import {CategoryModelState} from "@/models/category";
import {ResourceModelState} from "@/models/resource";

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    menu?: boolean;
    user?: boolean;
    login?: boolean;
    resources?: boolean;
    tags?: boolean;
    forms?: boolean;
    categories?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  user: UserModelState;
  login: StateType;
  resource: ResourceModelState;
  tag: TagModelState;
  form: FormModelState;
  category: CategoryModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
