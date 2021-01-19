export interface ResourceType {
  _id?: string;
  name?: string;
  icon?: string;
  desc?: string;
  userId?: string;
  tags?: string[];
  category?: string;
  form?: string;
  link?: string;
  detail?: string;
  _createTime?: Date;
  _updateTime?: Date;
}

export interface ResourceModelState {
}

export interface ResourceModelType {
  namespace: 'resource';
  state: ResourceModelState;
  effects: {};
  reducers: {};
}

const Model: ResourceModelType = {
  namespace: 'resource',

  state: {},

  effects: {},

  reducers: {},
};

export default Model;
