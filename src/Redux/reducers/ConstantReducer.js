import { ACTIONS } from "../action-types";

const initialState = {
  isBackScreen: false,
};

const constantReducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HANDLE_BACK_SPLASH:
      return {
        ...state,
        isBackScreen: action.data,
      };

    default:
      return state;
  }
};

export default constantReducers;
