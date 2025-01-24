import { ACTIONS } from "../action-types";

export const joinedRoomsRequest = (data) => {
  return {
    type: ACTIONS.JOINED_ROOM_REQUEST,
    data,
  };
};

export const joinedRoomsSuccess = (data) => {
  return {
    type: ACTIONS.SET_JOINED_ROOM,
    data,
  };
};

export const myRoomsRequest = (data) => {
  return {
    type: ACTIONS.MY_ROOM_REQUEST,
    data,
  };
};

export const myRoomsSuccess = (data) => {
  return {
    type: ACTIONS.SET_MY_ROOM,
    data,
  };
};

export const showRoomRequest = (data) => {
  return {
    type: ACTIONS.SHOW_ROOM_REQUEST,
    data,
  };
};

export const showRoomSuccess = (data) => {
  // console.log("data in showRoomSuccess", data);
  return {
    type: ACTIONS.SET_SHOW_ROOM,
    data,
  };
};

export const clearRoomData = () => {
  return {
    type: ACTIONS.CLEAR_ROOM_DATA,
  };
};

export const leaveRoomRequest = (data) => {
  return {
    type: ACTIONS.LEAVE_ROOM_REQUEST,
    data,
  };
};

export const leaveRoomSuccess = (data) => {
  return {
    type: ACTIONS.LEAVE_ROOM,
    data,
  };
};

export const createRoomRequest = (data) => {
  return {
    type: ACTIONS.CREATE_ROOM_REQUEST,
    data,
  };
};

export const createRoomSuccess = (data) => {
  return {
    type: ACTIONS.CREATE_ROOM,
    data,
  };
};

export const addMemberRequest = (data) => {
  return {
    type: ACTIONS.ADD_MEMBER_REQUEST,
    data,
  };
};

export const addMemberSuccess = (data) => {
  return {
    type: ACTIONS.ADD_MEMBER,
    data,
  };
};

export const roomMembersRequest = (data) => {
  return {
    type: ACTIONS.ROOM_MEMBER_REQUEST,
    data,
  };
};

export const roomMembersSuccess = (data) => {
  return {
    type: ACTIONS.SET_ROOM_MEMBER,
    data,
  };
};

export const clearRoomMembersData = () => {
  return {
    type: ACTIONS.CLEAR_ROOM_MEMBERS_DATA,
  };
};

export const getAlbumsDataRequest = (data) => {
  return {
    type: ACTIONS.GET_ALBUMS_DATA,
    data,
  };
};

export const getAlbumsDataSuccess = (data) => {
  return {
    type: ACTIONS.SET_ALBUMS_DATA,
    data,
  };
};

export const getPhotosData = (data) => {
  return {
    type: ACTIONS.GET_PHOTOS_DATA,
    data,
  };
};

export const getPhotosDataSuccess = (data) => {
  return {
    type: ACTIONS.SET_PHOTOS_DATA,
    data,
  };
};

export const deletePhotoRequest = (data) => {
  return {
    type: ACTIONS.DELETE_PHOTO_REQUEST,
    data,
  };
};

export const deletePhoto = (data) => {
  return {
    type: ACTIONS.DELETE_PHOTO,
    data,
  };
};

export const clearPhotosData = () => {
  return {
    type: ACTIONS.CLEAR_PHOTOS_DATA,
  };
};

export const clearAlbumsData = () => {
  return {
    type: ACTIONS.CLEAR_ALBUMS_DATA,
  };
};

export const getVideosReq = (data) => {
  return {
    type: ACTIONS.GET_VIDEOS_REQUEST,
    data,
  };
};

export const getVideosSuccess = (data) => {
  return {
    type: ACTIONS.SET_VIDEOS_DATA,
    data,
  };
};

export const clearVideosData = () => {
  return {
    type: ACTIONS.CLEAR_VIDEOS_DATA,
  };
};

export const updateRoomSettingsRequest = (data) => {
  return {
    type: ACTIONS.UPDATE_ROOM_REQUEST,
    data,
  };
};

export const updateRoomSettingsSuccess = (data) => {
  return {
    type: ACTIONS.UPDATE_ROOM,
    data,
  };
};

export const previewAlbumReq = (data) => {
  return {
    type: ACTIONS.PREVIEW_ALBUM_REQUEST,
    data,
  };
};

export const previewAlbumSuccess = (data) => {
  return {
    type: ACTIONS.SET_PREVIEW_ALBUM,
    data,
  };
};

export const deleteAlbumReq = (data) => {
  return {
    type: ACTIONS.DELETE_ALBUM_REQUEST,
    data,
  };
};

export const deleteAlbumSuccess = (data) => {
  return {
    type: ACTIONS.DELETE_ALBUM,
    data,
  };
};

export const deleteAlbumPhoto = (data) => {
  return {
    type: ACTIONS.DELETE_ALBUM_PHOTO,
    data,
  };
};

export const makeAdminReq = (data) => {
  return {
    type: ACTIONS.MAKE_ADMIN_REQUEST,
    data,
  };
};

export const makeAdminSuccess = (data) => {
  return {
    type: ACTIONS.MAKE_ADMIN,
    data,
  };
};

export const removeAdminReq = (data) => {
  return {
    type: ACTIONS.REMOVE_ADMIN_REQUEST,
    data,
  };
};

export const removeAdminSuccess = (data) => {
  return {
    type: ACTIONS.REMOVE_ADMIN,
    data,
  };
};

export const makeSilentObserverReq = (data) => {
  return {
    type: ACTIONS.MAKE_SILENT_OBERVER_REQUEST,
    data,
  };
};

export const makeSilentObserverSuccess = (data) => {
  return {
    type: ACTIONS.MAKE_SILENT_OBERVER,
    data,
  };
};

export const removeSilentObserverReq = (data) => {
  return {
    type: ACTIONS.REMOVE_SILENT_OBERVER_REQUEST,
    data,
  };
};

export const removeSilentObserverSuccess = (data) => {
  return {
    type: ACTIONS.REMOVE_SILENT_OBERVER,
    data,
  };
};

export const removeMemberReq = (data) => {
  return {
    type: ACTIONS.REMOVE_MEMBER_REQUEST,
    data,
  };
};

export const removeMemberSuccess = (data) => {
  return {
    type: ACTIONS.REMOVE_MEMBER,
    data,
  };
};

export const uploadAlbumReq = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_ALBUM_REQUEST,
    data,
  };
};

export const uploadAlbumSuccess = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_ALBUM,
    data,
  };
};

export const uploadPhotoReq = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_PHOTO_REQUEST,
    data,
  };
};

export const uploadPhotoSuccess = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_PHOTO,
    data,
  };
};

export const uploadVideoReq = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_VIDEO_REQUEST,
    data,
  };
};

export const uploadVideoSuccess = (data) => {
  return {
    type: ACTIONS.UPLOAD_ROOM_VIDEO,
    data,
  };
};

export const deleteRoomRequest = (data) => {
  return {
    type: ACTIONS.DELETE_ROOM_REQUEST,
    data,
  };
};

export const deleteRoomSuccess = (data) => {
  return {
    type: ACTIONS.DELETE_ROOM,
    data,
  };
};
