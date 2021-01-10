export interface TagType {
  _id?: string;
}

export interface TagModelState {
}

export interface TagModelType {
  namespace: 'tag';
  state: TagModelState;
  effects: {};
  reducers: {};
}

const Model: TagModelType = {
  namespace: 'tag',

  state: {},

  effects: {},

  reducers: {},
};

export default Model;
