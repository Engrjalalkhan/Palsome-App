import { ACTIONS } from "../action-types";

const initialState = {
  eventsListIsRefresh: false,
  groupsListIsRefresh: false,
  roomsListIsRefresh: false,
  savedListIsRefresh: false,
};

const EventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.EVENTS_LIST:
      return {
        ...state,
        eventsListIsRefresh: true,
      };
    case ACTIONS.EVENTS_RESET_LIST:
      return {
        ...state,
        eventsListIsRefresh: false,
      };
    case ACTIONS.GROUP_LIST:
      return {
        ...state,
        groupsListIsRefresh: true,
      };
    case ACTIONS.GROUP_RESET_LIST:
      return {
        ...state,
        groupsListIsRefresh: false,
      };

    case ACTIONS.MY_ROOM_REQUEST_LIST:
      return {
        ...state,
        roomsListIsRefresh: true,
      };
    case ACTIONS.ROOM_RESET_LIST:
      return {
        ...state,
        roomsListIsRefresh: false,
      };

    case ACTIONS.MY_SAVED_POST_LIST:
      return {
        ...state,
        savedListIsRefresh: true,
      };
    case ACTIONS.SAVED_POST_RESET_LIST:
      return {
        ...state,
        savedListIsRefresh: false,
      };

    default:
      return state;
  }
};

export default EventsReducer;
