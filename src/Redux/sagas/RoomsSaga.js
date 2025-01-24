import { ACTIONS } from "../action-types";
import { put, takeLatest } from "redux-saga/effects";
import SimpleToast from "react-native-simple-toast";
import { withoutStringiApiCall2, addWalletApiCall } from "../../Services/Apis";
import {
  joinedRoomsSuccess,
  leaveRoomSuccess,
  myRoomsSuccess,
  showRoomSuccess,
  setFriendsList,
  createRoomSuccess,
  addMemberRequest,
  addMemberSuccess,
  roomMembersSuccess,
  getAlbumsDataSuccess,
  getPhotosDataSuccess,
  deletePhoto,
  getVideosSuccess,
  updateRoomSettingsSuccess,
  updateRoomSettingsRequest,
  previewAlbumSuccess,
  deleteAlbumSuccess,
  deleteAlbumPhoto,
  removeAdminSuccess,
  makeSilentObserverSuccess,
  removeSilentObserverSuccess,
  removeMemberSuccess,
  uploadAlbumSuccess,
  uploadPhotoSuccess,
  deleteRoomRequest,
  deleteRoomSuccess,
  makeAdminSuccess,
} from "../actions/RoomActions";
import { getRoomsList } from "../actions/EventActions";

function* joinedRoomsReq(params) {
  //   console.log("params.data response from joinedRooms saga", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "rooms/joined_rooms",
      verb: "GET",
      token: params?.data?.token,
    });
    // console.log("res from joinedRooms saga -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(joinedRoomsSuccess(res?.payload?.data?.joinedRooms));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* joinedRoomsSaga() {
  yield takeLatest(ACTIONS.JOINED_ROOM_REQUEST, joinedRoomsReq);
}

function* myRoomsReq(params) {
  // console.log("params Data in My Rooms Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "rooms?page=" + params.data.current_page,
      verb: "GET",
      token: params?.data?.token,
    });
    // console.log("res from joinedRooms saga -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(getRoomsList(true));

      yield put(myRoomsSuccess(res?.payload?.data?.myRooms));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* myRoomsSaga() {
  yield takeLatest(ACTIONS.MY_ROOM_REQUEST, myRoomsReq);
}

function* showRoomReq(params) {
  // console.log("params Data in Show Room Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "rooms/" + params.data?.id + "?page=" + params.data?.page,
      verb: "GET",
      token: params?.data?.token,
    });
    // console.log("res from show Room Req -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga of Show Room Saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(showRoomSuccess(res?.payload?.data));
      yield params?.data?.setConcatTimelineData(
        params.data.concatTimelineData.concat(
          res.payload.data?.singlePost?.data
        )
      );

      yield params.data.setPaginationData({
        current_page: res.payload.data?.singlePost?.current_page,
        last_page: res.payload.data?.singlePost?.last_page,
        total: res.payload.data?.singlePost?.total,
      });

      yield params.data.setIsTimelineData(true);

      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* showRoomSaga() {
  yield takeLatest(ACTIONS.SHOW_ROOM_REQUEST, showRoomReq);
}

function* leaveRoomReq(params) {
  console.log("params Data in Leave Room Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "rooms/" + params.data?.id + "/leave",
      verb: "DELETE",
      token: params?.data?.token,
    });
    // console.log("res from show Room Req -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      // console.log("res from show Room Req -- ", res);
      // yield put(myRoomsSaga());
      yield put(leaveRoomSuccess());
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      params?.data?.navigation.navigate("RoomsHome");
      SimpleToast.show("Room left successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* leaveRoomSaga() {
  yield takeLatest(ACTIONS.LEAVE_ROOM_REQUEST, leaveRoomReq);
}

function* createRoomRequest(params) {
  console.log(
    "params Data in Create Room Request::>>>",
    JSON.stringify(params.data)
  );
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: "rooms/store",
      verb: "POST",
      token: params?.data?.token,
    });
    // console.log("res from show Room Req -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res.responseCode == 200) {
      yield put(createRoomSuccess(res?.payload?.data));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      SimpleToast.show("Room created successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* createRoomSaga() {
  yield takeLatest(ACTIONS.CREATE_ROOM_REQUEST, createRoomRequest);
}

function* addMemberReq(param) {
  console.log("params Data in Add Member Request::>>>", param.data);
  try {
    param?.data?.setLoading ? param?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: param.data.formData,
      route: "rooms/" + param.data?.room_id + "/members/add",
      verb: "POST",
      token: param.data.token,
    });
    console.log("res from show Room Req -- ", res);
    if (res.responseCode !== 200) {
      param?.data?.setLoading ? param?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res.responseCode == 200) {
      yield put(getRoomsList(true));
      yield put(addMemberSuccess(res?.payload?.data));
      param?.data?.setLoading ? param?.data?.setLoading(false) : null;
      SimpleToast.show("Member added successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* addMemberSaga() {
  yield takeLatest(ACTIONS.ADD_MEMBER_REQUEST, addMemberReq);
}

function* roomMembersReq(param) {
  console.log("params Data in Room Members Request::>>>", param.data);
  try {
    param?.data?.setLoading ? param?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: "rooms/" + param.data?.room_id + "/members",
      verb: "GET",
      token: param.data.token,
    });
    // console.log("res from room Member Api -- ", res);
    if (res.responseCode !== 200) {
      param?.data?.setLoading ? param?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(roomMembersSuccess(res?.payload?.data));
      param?.data?.setLoading ? param?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* roomMembersSaga() {
  yield takeLatest(ACTIONS.ROOM_MEMBER_REQUEST, roomMembersReq);
}

function* fetchAlbumsDataReq(params) {
  // console.log("params Data in Fetch Albums Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: "rooms/" + params.data?.room_id + "/album",
      verb: "GET",
      token: params?.data?.token,
    });
    console.log("res from fetchAlbumsDataReq -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(getAlbumsDataSuccess(res?.payload?.data?.albums));
      yield put(getPhotosDataSuccess(res?.payload?.data?.photos));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* fetchAlbumsDataSaga() {
  yield takeLatest(ACTIONS.GET_ALBUMS_DATA, fetchAlbumsDataReq);
}

function* deletePhotoReq(params) {
  console.log("params Data in Delete Photo Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `rooms/delete_photo/${params.data?.photo_id}`,
      verb: "DELETE",
      token: params?.data?.token,
    });
    console.log("res from deletePhotoReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(deletePhoto(res?.payload?.data));
      SimpleToast.show("Photo deleted successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deletePhotoSaga() {
  yield takeLatest(ACTIONS.DELETE_PHOTO_REQUEST, deletePhotoReq);
}

function* getVideosReq(params) {
  // console.log("params Data in Get Videos Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `rooms/${params.data?.room_id}/videos`,
      verb: "GET",
      token: params?.data?.token,
    });
    console.log("res from getVideosReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(getVideosSuccess(res?.payload?.data));
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* getRoomsVideosSaga() {
  yield takeLatest(ACTIONS.GET_VIDEOS_REQUEST, getVideosReq);
}

function* updateRoomReq(params) {
  console.log("params Data in Update Room Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/settings/update`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from updateRoomReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(getRoomsList(true));
      yield put(updateRoomSettingsSuccess(res?.payload?.data));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      params?.data?.refreshPage ? params?.data?.refreshPage() : null;
      SimpleToast.show("Room updated successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* updateRoomSaga() {
  yield takeLatest(ACTIONS.UPDATE_ROOM_REQUEST, updateRoomReq);
}

function* previewAlbumReq(params) {
  // console.log("params Data in Preview Album Request::>>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: `rooms/${params.data?.room_encrypted_id}/album_photos/${params.data?.album_id}`,
      verb: "GET",
      token: params?.data?.token,
    });
    console.log("res from previewAlbumReq -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(previewAlbumSuccess(res?.payload?.data));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* previewAlbumSaga() {
  yield takeLatest(ACTIONS.PREVIEW_ALBUM_REQUEST, previewAlbumReq);
}

function* deleteAlbumReq(params) {
  console.log("params Data in Delete Album Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `rooms/delete_album/${params.data?.album_id}`,
      verb: "DELETE",
      token: params?.data?.token,
    });
    console.log("res from deleteAlbumReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(deleteAlbumSuccess(res?.payload?.data));
      SimpleToast.show("Album deleted successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deleteAlbumSaga() {
  yield takeLatest(ACTIONS.DELETE_ALBUM_REQUEST, deleteAlbumReq);
}

function* deleteAlbumPhotoReq(params) {
  console.log(
    ">>",
    `rooms/delete_album_photo/${params.data?.photo_id}?id=${params.data?.album_id}`
  );
  // console.log("params Data in Delete Album Photo Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `rooms/delete_album_photo/${params.data?.photo_id}?id=${params.data?.album_id}`,
      verb: "DELETE",
      token: params?.data?.token,
    });
    console.log("res from deleteAlbumPhoto -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(deleteAlbumPhoto(res?.payload?.data));
      SimpleToast.show("Photo deleted successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deleteAlbumPhotoSaga() {
  yield takeLatest(ACTIONS.DELETE_ALBUM_PHOTO, deleteAlbumPhotoReq);
}

function* makeAdminRequest(params) {
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/member/make-admin`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from makeAdminRequest -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(makeAdminSuccess(res?.payload?.data));

      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Admin added successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* makeAdminSaga() {
  yield takeLatest(ACTIONS.MAKE_ADMIN_REQUEST, makeAdminRequest);
}

function* removeAdminRequest(params) {
  console.log("params Data in Remove Admin Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/member/remove-admin`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from removeAdminRequest -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(removeAdminSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Admin removed successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* removeAdminSaga() {
  yield takeLatest(ACTIONS.REMOVE_ADMIN_REQUEST, removeAdminRequest);
}

function* makeSilentObserver(params) {
  console.log("params Data in Make Silent Observer Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/member/silent-observer`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from makeSilentObserver -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(makeSilentObserverSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Silent observer added successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* makeSilentObserverSaga() {
  yield takeLatest(ACTIONS.MAKE_SILENT_OBERVER_REQUEST, makeSilentObserver);
}

function* removeSilentObserver(params) {
  console.log(
    "params Data in Remove Silent Observer Request::>>>",
    params.data
  );
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/member/remove-silent-observer`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from removeSilentObserver -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(removeSilentObserverSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Silent observer removed successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* removeSilentObserverSaga() {
  yield takeLatest(ACTIONS.REMOVE_SILENT_OBERVER_REQUEST, removeSilentObserver);
}

function* removeMember(params) {
  console.log("params Data in Remove Member Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/member/remove`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from removeMember -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(getRoomsList(true));
      yield put(removeMemberSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Member removed successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* removeMemberSaga() {
  yield takeLatest(ACTIONS.REMOVE_MEMBER_REQUEST, removeMember);
}

function* uploadAlbumReq(params) {
  yield put({
    type: ACTIONS.CREATE_ALBUM_POST_LOADING,
    createAlumPostLoading: true,
  });
  console.log("params Data in Upload Album Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/save_album`,
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from uploadAlbumReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(uploadAlbumSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Album uploaded successfully");
      yield put({
        type: ACTIONS.CREATE_ALBUM_POST_LOADING,
        createAlumPostLoading: false,
      });
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* uploadAlbumSaga() {
  yield takeLatest(ACTIONS.UPLOAD_ROOM_ALBUM_REQUEST, uploadAlbumReq);
}

function* uploadAlbumImageReq(params) {
  yield put({
    type: ACTIONS.CREATE_ALBUM_POST_LOADING,
    createAlumPostLoading: true,
  });
  console.log("params Data in Upload Album Image Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/save_photos`,
      verb: "POST",
      token: params?.data?.token,
    });
    SimpleToast.show("uploading...");
    console.log("res from uploadAlbumImageReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(uploadPhotoSuccess(res?.payload?.data));

      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Photo uploaded successfully");
      yield put({
        type: ACTIONS.CREATE_ALBUM_POST_LOADING,
        createAlumPostLoading: false,
      });
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* uploadAlbumImageSaga() {
  yield takeLatest(ACTIONS.UPLOAD_ROOM_PHOTO_REQUEST, uploadAlbumImageReq);
}

function* uploadAlbumVideoReq(params) {
  console.log("params Data in Upload Album Video Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/videos`,
      verb: "POST",
      token: params?.data?.token,
    });
    SimpleToast.show("uploading...");
    console.log("res from uploadAlbumVideoReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      yield put(uploadVideoSuccess(res?.payload?.data));
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Video uploaded successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* uploadAlbumVideoSaga() {
  yield takeLatest(ACTIONS.UPLOAD_ROOM_VIDEO_REQUEST, uploadAlbumVideoReq);
}

function* deleteRoomReq(params) {
  console.log("params Data in Delete Room Request::>>>", params.data);
  try {
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `rooms/${params.data?.room_id}/destroy`,
      verb: "DELETE",
      token: params?.data?.token,
    });
    console.log("res from deleteRoomReq -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      params?.data?.navigation.goBack();
      yield put(getRoomsList(true));

      // yield put(deleteRoomSuccess(res?.payload?.data));
      console.log("res from deleteRoomReq -- ", res);
      params?.data?.refresh ? params?.data?.refresh() : null;
      SimpleToast.show("Room deleted successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deleteRoomRequestSaga() {
  yield takeLatest(ACTIONS.DELETE_ROOM_REQUEST, deleteRoomReq);
}
