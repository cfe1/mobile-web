import ADMIN_TYPES from "../types/adminTypes";

export const updateAdmin = (data) => ({
  type: ADMIN_TYPES.UPDATE_ADMIN_DATA,
  payload: data,
});

export const updateRole = (data) => ({
  type: ADMIN_TYPES.UPDATE_ROLE_DATA,
  payload: data,
});
export const updateNotification = (data)=>({
  type:ADMIN_TYPES.UPDATE_NOTIFICATION,
  payload:data,
})

export const clearAdmin = ()=>({
  type:ADMIN_TYPES.CLEAR_ADMIN,
})

