import AUTH_TYPES from "../types/authTypes";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: {},
  role: null,
  is_profile_complete: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_TYPES.RESET_STATE:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: {},
        role: null,
        is_profile_complete: false,
      };

    case AUTH_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        submitting: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: {
          first_name: action.payload.profile.first_name,
          last_name: action.payload.profile.last_name,
          profile_photo: action.payload.profile.profile_photo,
        },
        role: action.payload.role,
        is_profile_complete: action.payload.is_profile_complete
      };

    case AUTH_TYPES.UPDATE_INFO:
      return {
        ...state,
        user: {
          ...state.user,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
        },
      };
    case AUTH_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profile_photo: action.payload.profile_photo,
        },
      };


    default:
      return state;
  }
}
