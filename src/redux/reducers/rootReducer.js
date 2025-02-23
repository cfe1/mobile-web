import { combineReducers } from "redux";

import uiReducer from "./uiReducer";
import authReducer from "./authReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
  ui: uiReducer,
  auth: authReducer,
  admin: adminReducer,
});