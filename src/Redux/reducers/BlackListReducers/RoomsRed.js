import { ACTIONS } from "../../action-types";

const initialState = {
  joinedRooms: {},
  myRooms: {},
  showRoomDeatils: [],
  createdRoomData: [],
  roomMembers: [],
  albumsData: [],
  photosData: [],
  videosData: [],
  previewAlbumData: [],
};

const RoomsRed = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_JOINED_ROOM:
      return {
        ...state,
        joinedRooms: action.data,
      };

    case ACTIONS.SET_MY_ROOM:
      return {
        ...state,
        myRooms: action.data,
      };

    case ACTIONS.SET_SHOW_ROOM:
      // console.log("action.data in showRoom", action.data);
      return {
        ...state,
        showRoomDeatils: [action.data],
      };

    case ACTIONS.CLEAR_ROOM_DATA:
      return {
        ...state,
        showRoomDeatils: [],
      };

    case ACTIONS.LEAVE_ROOM:
      return {
        ...state,
      };

    case ACTIONS.CREATE_ROOM:
      return {
        ...state,
        createdRoomData: action.data,
      };

    case ACTIONS.ADD_MEMBER:
      return {
        ...state,
      };

    case ACTIONS.SET_ROOM_MEMBER:
      return {
        ...state,
        roomMembers: action.data,
      };

    case ACTIONS.CLEAR_ROOM_MEMBERS_DATA:
      return {
        ...state,
        roomMembers: [],
      };

    case ACTIONS.SET_ALBUMS_DATA:
      return {
        ...state,
        albumsData: action.data,
      };

    case ACTIONS.SET_PHOTOS_DATA:
      return {
        ...state,
        photosData: action.data,
      };

    case ACTIONS.DELETE_PHOTO:
      return {
        ...state,
      };

    case ACTIONS.CLEAR_PHOTOS_DATA:
      return {
        ...state,
        photosData: [],
      };

    case ACTIONS.CLEAR_ALBUMS_DATA:
      return {
        ...state,
        albumsData: [],
      };

    case ACTIONS.SET_VIDEOS_DATA:
      return {
        ...state,
        videosData: action.data,
      };

    case ACTIONS.CLEAR_VIDEOS_DATA:
      return {
        ...state,
        videosData: [],
      };

    case ACTIONS.UPDATE_ROOM:
      return {
        ...state,
      };

    case ACTIONS.SET_PREVIEW_ALBUM:
      return {
        ...state,
        previewAlbumData: action.data,
      };

    case ACTIONS.DELETE_ALBUM:
      return {
        ...state,
      };

    case ACTIONS.DELETE_ALBUM_PHOTO:
      return {
        ...state,
      };

    case ACTIONS.MAKE_ADMIN:
      return {
        ...state,
      };

    case ACTIONS.REMOVE_ADMIN:
      return {
        ...state,
      };

    case ACTIONS.MAKE_SILENT_OBERVER:
      return {
        ...state,
      };

    case ACTIONS.REMOVE_SILENT_OBERVER:
      return {
        ...state,
      };

    case ACTIONS.REMOVE_MEMBER:
      return {
        ...state,
      };

    case ACTIONS.UPLOAD_ROOM_ALBUM:
      return {
        ...state,
      };

    case ACTIONS.UPLOAD_ROOM_PHOTO:
      return {
        ...state,
      };

    case ACTIONS.UPLOAD_ROOM_VIDEO:
      return {
        ...state,
      };

    case ACTIONS.DELETE_ROOM:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default RoomsRed;
