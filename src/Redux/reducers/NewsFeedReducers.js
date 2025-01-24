import { ACTIONS } from "../action-types";

const initialState = {
  newsFeedData: [],
  coloredPatterns: null,
  singlePost: null,
  successMessage: null,
  autoPlayVideos: false,
  getNotificationEvent: false,
  numOfNotifications: 0,
  stories: [],
  myStories: [],
  sideBarFriendList: [],
  StoryStatus: false,
  saveLanguage: null,
};

const newsFeedReducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_NEWS_FEED:
      return {
        ...state,
        newsFeedData: action.data,
      };
    case ACTIONS.SET_COLORED_PATTERNS:
      return {
        ...state,
        coloredPatterns: action.data,
      };
    case ACTIONS.SET_SINGLE_POST:
      return {
        ...state,
        singlePost: action.data,
      };
    case ACTIONS.SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.successMessage,
      };
    case ACTIONS.AUTOPLAY_VIDEOS:
      return {
        ...state,
        autoPlayVideos: action.autoPlayVideos,
      };
    case ACTIONS.SET_NUM_OF_NOTIFICATIONS:
      return {
        ...state,
        numOfNotifications: action.data,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        newsFeedData: [],
        coloredPatterns: null,
        singlePost: null,
        successMessage: null,
        numOfNotifications: 0,
        stories: [],
        myStories: [],
        sideBarFriendList: [],
      };

    case ACTIONS.SET_STORIES:
      return {
        ...state,
        stories: action.data,
      };
    case ACTIONS.PUSH_NOTIFICATION_EVENT:
      return {
        ...state,
        getNotificationEvent: action.data,
      };

    case ACTIONS.CLEAR_LOGIN_RES_ALL:
      return {
        ...state,
        newsFeedData: [],
        coloredPatterns: null,
        singlePost: null,
        successMessage: null,
        numOfNotifications: 0,
        stories: [],
        myStories: [],
        sideBarFriendList: [],
      };

    case ACTIONS.SET_MYSTORY:
      return {
        ...state,
        myStories: action.data,
      };
    case ACTIONS.STORY_STATUS:
      return {
        ...state,
        StoryStatus: action.data,
      };
    case ACTIONS.SET_Side_Bar_FRIEND_LIST:
      return {
        ...state,
        sideBarFriendList: action.data,
      };
    case ACTIONS.SET_STORIESUPDATE:
      return {
        ...state,
        storiesUpdate: action.data,
      };
    case ACTIONS.SAVE_LANGUAGE:
      return {
        ...state,
        saveLanguage: action.data,
      };

    default:
      return state;
  }
};

export default newsFeedReducers;
