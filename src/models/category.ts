export interface CategoryType {
  _id?: string;
}

export interface CategoryModelState {
}

export interface CategoryModelType {
  namespace: 'category';
  state: CategoryModelState;
  effects: {};
  reducers: {};
}

const Model: CategoryModelType = {
  namespace: 'category',

  state: {},

  effects: {},

  reducers: {},
};

export default Model;
