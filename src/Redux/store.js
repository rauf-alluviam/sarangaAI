import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Reducers/authReducer";
import { cameraReducer } from "./Reducers/cameraReducers";
import { fgStockReducer } from "./Reducers/fgStockReducer";
import { toolManagementReducer } from "./Reducers/toolManagementReducer";
import { complaintReducer } from "./Reducers/complaintReducer";
import { storeStockReducer } from "./Reducers/storeStockReducer";

const rootReducer= combineReducers({
    auth: authReducer,
    cameras: cameraReducer,
    fgStock: fgStockReducer,
    toolManagement: toolManagementReducer,
    complaint: complaintReducer,
    storeStock: storeStockReducer
})

const store= legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;