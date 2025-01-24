import { ACTIONS } from "../action-types";

export const getEventsList = (data) => {
  return {
    type: ACTIONS.EVENTS_LIST,
    data,
  };
};
export const resetEventList = (data) => {
  return {
    type: ACTIONS.EVENTS_RESET_LIST,
    data,
  };
};
export const getGroupsList = (data) => {
  return {
    type: ACTIONS.GROUP_LIST,
    data,
  };
};
export const resetGroupList = (data) => {
  return {
    type: ACTIONS.GROUP_RESET_LIST,
    data,
  };
};
export const getRoomsList = (data) => {
  return {
    type: ACTIONS.MY_ROOM_REQUEST_LIST,
    data,
  };
};
export const resetRoomList = (data) => {
  return {
    type: ACTIONS.ROOM_RESET_LIST,
    data,
  };
};
export const getSavedPostList = (data) => {
  return {
    type: ACTIONS.MY_SAVED_POST_LIST,
    data,
  };
};
export const resetSavedList = (data) => {
  return {
    type: ACTIONS.SAVED_POST_RESET_LIST,
    data,
  };
};
