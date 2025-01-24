import { ACTIONS } from "../action-types";
import { put, takeLatest } from "redux-saga/effects";
import SimpleToast from "react-native-simple-toast";
import Toast from "react-native-simple-toast";
import {
  withoutStringiApiCall2,
  addWalletApiCall,
  withoutStringiApiCall,
} from "../../Services/Apis";
import {
  getReelsDataRequest,
  setReelsData,
  clearReelsData,
  uploadReel,
  reactToggle,
  reelViewCount,
  setReelsComments,
  setUserReelsData,
} from "../actions/ReelsActions";

function* fetchReelsReq(params) {
  console.log("params from fetchReelsReq");

  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      // route: "reel",
      route: `reel?page=${
        params?.data?.currentPage + params?.data?.reel_order
          ? "&reel_order=" + params?.data?.reel_order
          : ""
      }`,
      verb: "GET",
      token: params?.data?.token,
    });
    // console.log("res from fetchReelsReq saga -- ", res);
    if (res.responseCode !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      let public_reels = res?.payload?.data?.public_reels;
      public_reels["reel_order"] = res?.payload?.data?.reel_order;
      yield put(setReelsData(public_reels));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* fetchReelsSaga() {
  yield takeLatest(ACTIONS.GET_REELS_REQUEST, fetchReelsReq);
}

//=============================///
// function* fetchUserReelsReq(params) {
//   console.log("params from fetchReelsReq", params?.data?.current_page);

//   try {
//     params?.data?.setLoading ? params?.data?.setLoading(true) : null;
//     const res = yield withoutStringiApiCall2({
//       // route: "reel",
//       route: `timeline/${params?.data?.userName}/reels?page=${params?.data?.current_page}`,
//       verb: "GET",
//       token: params?.data?.token,
//     });
//     // console.log("res from fetchReelsReq saga -- ", res);
//     if (res.responseCode !== 200) {
//       params?.data?.setLoading ? params?.data?.setLoading(false) : null;
//       console.log("Error in saga", res);
//     } else if (res.responseCode == 200) {
//       let data = res.payload?.data?.reels?.data;
//       yield put(setUserReelsData(data));
//       params?.data?.setLoading ? params?.data?.setLoading(false) : null;
//     }
//   } catch (e) {
//     console.log("saga error -- ", e.toString());
//   }
// }

// export function* fetchUserReelsSaga() {
//   yield takeLatest(ACTIONS.GET_USER_REELS_REQUEST, fetchUserReelsReq);
// }
//=========================///

function* uploadReelReq(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "reel",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    console.log("Reponse From uploadRequest:", res);

    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(uploadReel(res?.payload?.data?.reel));
      Toast.show("Your clip has been uploaded", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* uploadReelSaga() {
  yield takeLatest(ACTIONS.UPLOAD_REEL_REQUEST, uploadReelReq);
}

function* deleteReelReq(params) {
  // console.log("deleteReelReq", params);
  try {
    const res = yield withoutStringiApiCall2({
      route: `reel/${params?.data?.reelId}`,
      verb: "DELETE",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("Error in saga", res);
      // SimpleToast.show("Error in deleting reel");
    } else if (res.responseCode == 200) {
      SimpleToast.show("Clip deleted successfully");
      params?.data?.refresh ? params?.data?.refresh() : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deleteReelSaga() {
  yield takeLatest(ACTIONS.DELETE_REEL, deleteReelReq);
}

function* updateReelReq(params) {
  try {
    const formData = new FormData();
    formData.append("reel_description", params?.data?.description);
    const res = yield withoutStringiApiCall2({
      route: `reel/${params?.data?.reelId}`,
      params: formData,
      verb: "POST",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("Error in saga", res);
      // SimpleToast.show("Error in deleting reel");
    } else if (res.responseCode == 200) {
      SimpleToast.show("Clip updated successfully");
      params?.data?.refresh ? params?.data?.refresh() : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* updatedReelSaga() {
  yield takeLatest(ACTIONS.UPDATE_REEL, updateReelReq);
}

function* reactToggleReq(params) {
  console.log(
    "params from reactToggleReq saga -- ",
    JSON.stringify(params?.data)
  );
  try {
    const res = yield withoutStringiApiCall2({
      route: `reel/react/toggle`,
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    console.log("res from reactToggleReq saga -- ", res);
    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      console.log("React Toggle Successfully");
      // yield put(uploadReel(res?.payload?.data?.reel));
      console.log(
        "res?.payload?.data?.react_count",
        res?.payload?.data?.react_count
      );
      yield put(reactToggle(res?.payload?.data?.react_count));
      params?.data?.refresh ? params?.data?.refresh() : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* reactToggleSaga() {
  yield takeLatest(ACTIONS.REACT_TOGGLE_REQUEST, reactToggleReq);
}

function* increaseReelViewCountReq(params) {
  // console.log("params from increaseReelViewCountReq saga -- ", params?.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `reel/increment/view`,

      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(reelViewCount(res?.payload?.data?.view));
      console.log("View Count Increased Successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* increaseReelViewCountSaga() {
  yield takeLatest(ACTIONS.INCREASE_REEL_VIEW_COUNT, increaseReelViewCountReq);
}

function* fetchReelsCommentsReq(params) {
  // console.log("params from fetchReelsCommentsReq saga -- ", params?.data);
  try {
    const res = yield withoutStringiApiCall2({
      route: `post/comment/fetch?post_id=${params?.data?.reelId}&data_target=comment`,
      verb: "GET",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      yield put(setReelsComments(res?.payload?.data?.comments?.data));
      console.log("Reels Comments Fetched Successfully");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* fetchReelsCommentsSaga() {
  yield takeLatest(ACTIONS.GET_REEL_COMMENTS_REQUEST, fetchReelsCommentsReq);
}
