import { createStore } from '../lib/my-redux';
import reducer from './couterReducer/index';

let store = createStore(reducer);

export default store;