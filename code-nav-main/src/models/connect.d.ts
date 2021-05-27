import type { MenuDataItem } from '@ant-design/pro-layout';
import type { UserModelState } from './user';
import type { LoginType } from './login';
import type { TagModelState } from './tag';
import type { ResourceModelState } from './resource';

export interface Loading {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    menu?: boolean;
    user?: boolean;
    login?: boolean;
    resource?: boolean;
    tag?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  user: UserModelState;
  login: LoginType;
  resource: ResourceModelState;
  tag: TagModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
