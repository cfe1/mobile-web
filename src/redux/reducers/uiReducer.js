import UI_TYPES from "../types/uiTypes";

const initialState = {
  loading: false,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case UI_TYPES.SHOW_LOADER:
      return {
        ...state,
        loading: true,
      };

    case UI_TYPES.HIDE_LOADER:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
