import { ACTIONS } from "../action-types";

export const fetchEditProf = (data) => ({
  type: ACTIONS.EDIT_PROF,
  data,
});

export const deletePost = (data) => ({
  type: ACTIONS.DELETE_POST,
  data,
});

export const deleteVideoProfile = (data) => ({
  type: ACTIONS.DELETE_VIDEO_PROFILE,
  data,
});

export const updateProfilePicture = (profilePicture) => ({
  type: ACTIONS.UPDATE_PROFILE_PICTURE,
  profilePicture,
});

export const setEditProf = (data) => ({
  type: ACTIONS.FETCH_EDIT_PROF,
  data,
});

export const updateProfileData = (data) => ({
  type: ACTIONS.UPDATE_PROF_DATA,
  data,
});

export const fetchEducationData = (data) => ({
  type: ACTIONS.EDUCATION,
  data,
});

export const setEducationData = (data) => ({
  type: ACTIONS.SET_EDUCATION,
  data,
});

export const sendSaveEducation = (data) => ({
  type: ACTIONS.SEND_SAVE_EDUCATION,
  data,
});

export const deleteEducation = (data) => ({
  type: ACTIONS.DELETE_EDUCATION,
  data,
});

export const fetchExperience = (data) => ({
  type: ACTIONS.FETCH_EXP,
  data,
});

export const setExp = (data) => ({
  type: ACTIONS.SET_EXP,
  data,
});

export const deleteExperience = (data) => ({
  type: ACTIONS.DELETE_EXPERIENCE,
  data,
});

export const sendSaveEmployement = (data) => ({
  type: ACTIONS.SEND_SAVE_EMPLOYEMENT,
  data,
});

export const fetchStates = (data) => ({
  type: ACTIONS.FETCH_STATES,
  data,
});

export const saveStates = (data) => ({
  type: ACTIONS.GET_STATES,
  data,
});

export const fetchCities = (data) => ({
  type: ACTIONS.FETCH_CITIES,
  data,
});

export const saveCities = (data) => ({
  type: ACTIONS.GET_CITIES,
  data,
});

export const updateEducation = (data) => ({
  type: ACTIONS.UPDATE_EDUCATION,
  data,
});

export const updateExperience = (data) => ({
  type: ACTIONS.UPDATE_EXPERIENCE,
  data,
});

export const createGroup = (data) => ({
  type: ACTIONS.CREATEGROUP,
  data,
});

export const handleFriendRequest = (data) => ({
  type: ACTIONS.Handle_Friend_Request,
  data,
});

export function updateDoValue(data) {
  return { type: ACTIONS.UPDATE_DO_VALUE, payload: data };
}

export const setAddFriendStats = (data) => {
  return {
    type: ACTIONS.SET_ADD_FRIEND_STATS,
    payload: data,
  };
};

export const getBirthdayData = (data) => ({
  type: ACTIONS.GET_BIRTHDAY_REQUEST,
  data,
});

export const setBirthdayData = (data) => ({
  type: ACTIONS.SET_BIRTHDAY_DATA,
  data,
});

export const clearBirthdayData = () => ({
  type: ACTIONS.CLEAR_BIRTHDAY_DATA,
});

export const wishBirthday = (data) => ({
  type: ACTIONS.WISH_BIRTHDAY,
  data,
});
