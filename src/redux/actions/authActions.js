import AUTH_TYPES from "../types/authTypes";

export const loginSuccess = (data) => ({
  type: AUTH_TYPES.LOGIN_SUCCESS,
  payload: data,
});

export const logoutSuccess =()=>(
  {
    type:AUTH_TYPES.RESET_STATE
  }
)
export const updateInfo = (data) => ({
  type: AUTH_TYPES.UPDATE_INFO,
  payload: data,
});

export const updateProfile = (data) => ({
  type: AUTH_TYPES.UPDATE_PROFILE,
  payload: data,
});
