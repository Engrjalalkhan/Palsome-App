import { ACTIONS } from "../../action-types";

const initialState = {
  reelsData: [],
  // userReelsData: [],
  react_count: 0,
  reelViewCount: 0,
  reelCommentsData: [],
};

const ReelsRed = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_REELS_DATA:
      return {
        ...state,
        reelsData: action.data,
      };

    // case ACTIONS.SET_USER_REELS_DATA:
    //   return {
    //     ...state,
    //     userReelsData: action.data,
    //   };

    case ACTIONS.SET_REELS_DATA_NEXT_PAGE:
      return {
        ...state,
        reelsDataNextPage: action.data,
      };

    case ACTIONS.UPLOAD_REEL:
      return {
        ...state,
      };

    case ACTIONS.CLEAR_REELS_DATA:
      return {
        ...state,
        reelsData: [],
      };

    case ACTIONS.DELETE_REEL:
      return {
        ...state,
      };

    case ACTIONS.REACT_TOGGLE:
      return {
        ...state,
        react_count: action.data,
      };

    case ACTIONS.INCREASE_REEL_VIEW_COUNT:
      return {
        ...state,
        reelViewCount: action.data,
      };

    case ACTIONS.SET_REEL_COMMENTS_DATA:
      return {
        ...state,
        reelCommentsData: action.data,
      };

    default:
      return state;
  }
};

export default ReelsRed;
