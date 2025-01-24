import { ACTIONS } from "../action-types";

const initialState = {
  editProfData: [],
  educationData: null,
  expData: null,
  states: null,
  cities: null,
  visibility: false,
  deletePostLoading: false,
  addFriendStats: "",
  profilePicture: null,
  birthdayData: null,
};

const profileReducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_EDIT_PROF:
      return {
        ...state,
        editProfData: action.data,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        userToken: null,
        userData: null,
        errors: null,
        otpToken: null,
        editProfData: null,
        profilePicture: null,
      };
    case ACTIONS.CLEAR_DP:
      return {
        ...state,
        profilePicture: null,
      };
    case ACTIONS.UPDATE_PROFILE_PICTURE: // Handle the new action
      return {
        ...state,
        profilePicture: action.profilePicture,
      };
    case ACTIONS.SET_EDUCATION:
      return {
        ...state,
        educationData: action.data,
      };
    case ACTIONS.SET_EXP:
      return {
        ...state,
        expData: action.data,
      };
    case ACTIONS.GET_STATES:
      return {
        ...state,
        states: action.data,
      };
    case ACTIONS.GET_CITIES:
      return {
        ...state,
        cities: action.data,
      };
    case ACTIONS.OPEN_MODAL:
      return {
        ...state,
        visibility: action.visibility,
      };
    case ACTIONS.DELETE_POST_LOADING:
      return {
        ...state,
        deletePostLoading: action.deletePostLoading,
      };

    case ACTIONS.SET_ADD_FRIEND_STATS:
      return {
        ...state,
        addFriendStats: action.payload,
      };

    case ACTIONS.UPDATE_DO_VALUE:
      return { ...state, doValue: action.payload };

    case ACTIONS.SET_BIRTHDAY_DATA:
      return {
        ...state,
        birthdayData: action.data,
      };

    case ACTIONS.CLEAR_BIRTHDAY_DATA:
      return {
        ...state,
        birthdayData: null,
      };

    default:
      return state;
  }
};

export default profileReducers;
