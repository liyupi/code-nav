export interface FormType {
  _id?: string;
}

export interface FormModelState {
}

export interface FormModelType {
  namespace: 'form';
  state: FormModelState;
  effects: {};
  reducers: {};
}

const Model: FormModelType = {
  namespace: 'form',

  state: {},

  effects: {},

  reducers: {},
};

export default Model;
