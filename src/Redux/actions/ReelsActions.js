import { ACTIONS } from "../action-types";

export const getReelsDataRequest = (data) => {
  return {
    type: ACTIONS.GET_REELS_REQUEST,
    data,
  };
};

export const getUserReelsDataRequest = (data) => {
  return {
    type: ACTIONS.GET_USER_REELS_REQUEST,
    data,
  };
};

export const setReelsData = (data) => {
  return {
    type: ACTIONS.SET_REELS_DATA,
    data,
  };
};
// export const setUserReelsData = (data) => {
//   return {
//     type: ACTIONS.SET_USER_REELS_DATA,
//     data,
//   };
// };

export const setReelsDataNextPage = (data) => {
  return {
    type: ACTIONS.SET_REELS_DATA_NEXT_PAGE,
    data,
  };
};

export const clearReelsData = () => {
  return {
    type: ACTIONS.CLEAR_REELS_DATA,
  };
};

export const uploadReelRequest = (data) => {
  return {
    type: ACTIONS.UPLOAD_REEL_REQUEST,
    data,
  };
};

export const uploadReel = (data) => {
  return {
    type: ACTIONS.UPLOAD_REEL,
    data,
  };
};

export const deleteReel = (data) => {
  return {
    type: ACTIONS.DELETE_REEL,
    data,
  };
};
export const updateReel = (data) => {
  return {
    type: ACTIONS.UPDATE_REEL,
    data,
  };
};

export const reactToggleReq = (data) => {
  return {
    type: ACTIONS.REACT_TOGGLE_REQUEST,
    data,
  };
};

export const reactToggle = (data) => {
  return {
    type: ACTIONS.REACT_TOGGLE,
    data,
  };
};

export const reelViewCount = (data) => {
  return {
    type: ACTIONS.INCREASE_REEL_VIEW_COUNT,
    data,
  };
};

export const getReelsCommentsReq = (data) => {
  return {
    type: ACTIONS.GET_REEL_COMMENTS_REQUEST,
    data,
  };
};

export const setReelsComments = (data) => {
  return {
    type: ACTIONS.SET_REEL_COMMENTS_DATA,
    data,
  };
};
