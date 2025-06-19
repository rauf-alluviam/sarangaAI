import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Reducers/authReducer";
import { cameraReducer } from "./Reducers/cameraReducers";
import { fgStockReducer } from "./Reducers/fgStockReducer";
import { toolManagementReducer } from "./Reducers/toolManagementReducer";
import { complaintReducer } from "./Reducers/complaintReducer";

const rootReducer= combineReducers({
    auth: authReducer,
    cameras: cameraReducer,
    fgStock: fgStockReducer,
    toolManagement: toolManagementReducer,
    complaint: complaintReducer
})

const store= legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;