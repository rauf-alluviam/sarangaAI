// src/store/index.js
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import cameraReducer from './reducers/cameraReducers';
import fgStockReducer from './reducers/fgStockReducer';
import toolManagementReducer from './reducers/toolManagementReducer';
import complaintReducer from './reducers/complaintReducer';
import storeStockReducer from './reducers/storeStockReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cameras: cameraReducer,
  fgStock: fgStockReducer,
  toolManagement: toolManagementReducer,
  complaint: complaintReducer,
  storeStock: storeStockReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;
