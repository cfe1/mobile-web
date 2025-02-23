import ADMIN_TYPES from "../types/adminTypes";


const initialState = {
  loading: false,
  adminInfo: null, 
  roleInfo:{},
  notification:null,
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case ADMIN_TYPES.UPDATE_ADMIN_DATA:
      return {
        ...state,
        adminInfo: action.payload,
      };
    case ADMIN_TYPES.UPDATE_ROLE_DATA:
      return{
        ...state,
        roleInfo:action.payload
      }
      case ADMIN_TYPES.UPDATE_NOTIFICATION:
      return {
        ...state,
        notification:action.payload
      }  
      case ADMIN_TYPES.CLEAR_ADMIN:
        return {
          ...state,
          adminInfo: null, 
          roleInfo:{},
          notification:null,
        } 
    default:
      return state;
  }
}