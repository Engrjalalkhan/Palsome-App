import {
  settingsApiCall,
  updateApiCall,
  withoutStringiApiCall2,
} from "../../Services/Apis";
import { ACTIONS } from "../action-types";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  saveCities,
  saveStates,
  setBirthdayData,
  setEditProf,
  setEducationData,
  setExp,
  updateDoValue,
} from "../actions/ProfileActions";
import { Alert } from "react-native";
import { getTimeline } from "../actions/NewsFeedActions";
import { updateUserData } from "../actions/AuthActions";
import Toast from "react-native-simple-toast";

function* deletePost(params) {
  yield put({ type: ACTIONS.DELETE_POST_LOADING, deletePostLoading: true });

  try {
    const res = settingsApiCall({
      route: "delete_post" + params.data.id,
      verb: "DELETE",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      console.log("Response !===== 200... :", res);
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Error in deleting post", Toast.SHORT);
    } else if (res.responseCode == 200) {
      console.log("Response ===== 200 :", res.message);
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Post deleted successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("Saga deletePost error ---", e.toString());
    yield put({
      type: ACTIONS.DELETE_POST_LOADING,
      deletePostLoading: fasle,
    });
    Toast.show("Error in deleting post", Toast.SHORT);
  }
}

export function* deletePostSaga() {
  yield takeLatest(ACTIONS.DELETE_POST, deletePost);
}

function* fetchEditProf(params) {
  // console.log("params======>>>>>>", params);
  params?.data?.setLoading ? params?.data?.setLoading(true) : null;

  // console.log("params in fetch profile", params);
  try {
    const res = yield settingsApiCall({
      route: `settings`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      // console.log("res !== 200 ... in fetch edit profile data", res);
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    } else if (res.responseCode == 200) {
      yield put(setEditProf(res.payload.data));
      // console.log("res fro saga - - fetch edit profile data", res.payload.data);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* settingsSaga() {
  yield takeLatest(ACTIONS.EDIT_PROF, fetchEditProf);
}

function* updateProfileData(params) {
  console.log("params", params.data.params);
  params.data.setUpdateLoader(true);
  try {
    const res = yield settingsApiCall({
      route: "saveprofile",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.params,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... in update ", res);
      Alert.alert("Error", res.message);
      params.data.setUpdateLoader(false);
    } else if (res.responseCode == 200) {
      console.log("res on save", res.responseCode);

      yield put(updateUserData(res?.payload?.data));
      params.data.setUpdateLoader(false);
      Alert.alert("Success", "Profile data saved successfully");
    }
  } catch (e) {
    console.log("saga update error----- ", e.toString());
  }
}

export function* updateProfSaga() {
  yield takeLatest(ACTIONS.UPDATE_PROF_DATA, updateProfileData);
}

function* fetchEducationData(token) {
  try {
    const res = yield settingsApiCall({
      route: "work_education",
      verb: "GET",
      token: token.data,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      yield put(setEducationData(res));
      console.log(res);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchEduSaga() {
  yield takeLatest(ACTIONS.EDUCATION, fetchEducationData);
}

function* sendSaveEducation(params) {
  try {
    const res = yield settingsApiCall({
      route: "save_education",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.params,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      Alert.alert("Success", "Education added successfully");
      console.log(res);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* sendSaveEduSaga() {
  yield takeLatest(ACTIONS.SEND_SAVE_EDUCATION, sendSaveEducation);
}

function* fetchExperience(token) {
  try {
    const res = yield settingsApiCall({
      route: "work_employment",
      verb: "GET",
      token: token.data,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      yield put(setExp(res));
      console.log(res);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchExpSaga() {
  yield takeLatest(ACTIONS.FETCH_EXP, fetchExperience);
}

function* sendSaveEmployement(params) {
  try {
    const res = yield settingsApiCall({
      route: "save_employment",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.params,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      Alert.alert("Success", "Experience saved successfully");
      console.log(res);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* sendSaveEmployementSaga() {
  yield takeLatest(ACTIONS.SEND_SAVE_EMPLOYEMENT, sendSaveEmployement);
}

function* fetchStates(params) {
  console.log("con id ", params.data.con_id);
  try {
    const res = yield settingsApiCall({
      route: "getStates?country_id=" + params.data.con_id,
      verb: "POST",
      token: params?.data?.token,
      params: params.data.params,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in fetchStates ... ", res);
    } else if (res.responseCode == 200) {
      yield put(saveStates(res.payload.data));
      // console.log("res from saga", res.payload.data);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchStatesSaga() {
  yield takeLatest(ACTIONS.FETCH_STATES, fetchStates);
}

function* fetchCities(params) {
  console.log("state id ", params.data.formData);

  try {
    const res = yield withoutStringiApiCall2({
      route: "getCities?state_id=" + params.data.id,
      verb: "POST",
      token: params?.data?.token,
      // params: params.data.formData,
    });
    // console.log("cities - - - ", res);

    if (res.responseCode !== 200) {
      console.log("res !== 200 in fetch cities... ", res);
    } else if (res.responseCode == 200) {
      yield put(saveCities(res.payload.data));
      // console.log("res from saga", res.payload.data);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchCitiesSaga() {
  yield takeLatest(ACTIONS.FETCH_CITIES, fetchCities);
}

function* experienceUpdate(body) {
  console.log("my updtae data going to api", body.data.formData);
  try {
    const res = yield updateApiCall({
      route: "employment_edit_popup/update/" + body.data.id,
      verb: "PUT",
      token: body.data.token,
      params: body.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in update experience ... ", res);
    } else if (res.responseCode == 200) {
      Alert.alert("Success", "Experience updated successfully");
      console.log("update experience ", res);
    }
  } catch (e) {
    console.log("saga update education error -- ", e.toString());
  }
}

export function* experienceUpdateSaga() {
  yield takeLatest(ACTIONS.UPDATE_EXPERIENCE, experienceUpdate);
}

function* educationUpdate(body) {
  console.log("from data", body.data.formData);
  try {
    const res = yield updateApiCall({
      route: "education_edit_popup/update/" + body.data.id,
      verb: "PUT",
      token: body.data.token,
      params: body.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      console.log(res);
    } else if (res.responseCode == 200) {
      Alert.alert("Success", "Education updated successfully");

      console.log("educationUpdate result", res);
    }
  } catch (e) {
    console.log("saga update education error -- ", e.toString());
  }
}

export function* educationUpdateSaga() {
  yield takeLatest(ACTIONS.UPDATE_EDUCATION, educationUpdate);
}

function* deleteExperience(params) {
  console.log("controle there");
  try {
    const res = yield settingsApiCall({
      route: "employment_delete/" + params.data.id,
      verb: "DELETE",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in deleteExperience ... ", res);
    } else if (res.responseCode == 200) {
      console.log("res in deleteExperience - - ", res);
      Alert.alert("Success", "Experience deleted successfully");
      params.data.setIsDeleted(true);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}
export function* sendDeleteExperienceSaga() {
  yield takeLatest(ACTIONS.DELETE_EXPERIENCE, deleteExperience);
}

function* deleteEducation(params) {
  console.log("controle there");
  try {
    const res = yield settingsApiCall({
      route: "education_delete/" + params.data.id,
      verb: "DELETE",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in deleteEducation... ", res);
    } else if (res.responseCode == 200) {
      params.data.setIsDeleted(true);
      Alert.alert("Success", "Education deleted successfully");
      console.log("deleteEducation", res);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}
export function* sendDeleteEducationSaga() {
  yield takeLatest(ACTIONS.DELETE_EDUCATION, deleteEducation);
}

function* deleteProfileVideo(params) {
  yield put({ type: ACTIONS.DELETE_POST_LOADING, deletePostLoading: true });

  try {
    const res = yield settingsApiCall({
      route: "user/video/" + params.data.id,
      verb: "DELETE",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Error in deleting post", Toast.SHORT);
    } else if (res.responseCode == 200) {
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Post deleted successfully", Toast.SHORT);
      params?.data?.refresh ? params?.data?.refresh() : null;
      params.data.navigation.navigate
        ? params?.data?.navigation.goBack()
        : null;
    }
  } catch (e) {
    console.log("saga deletePost error -- ", e.toString());
    yield put({
      type: ACTIONS.DELETE_POST_LOADING,
      deletePostLoading: false,
    });
    Toast.show("Error deleting post", Toast.SHORT);
  }
}

export function* deleteVideoSaga() {
  yield takeLatest(ACTIONS.DELETE_VIDEO_PROFILE, deleteProfileVideo);
}

function* changePassword(params) {
  console.log("change password--", params.data.formData);
  try {
    const res = yield withoutStringiApiCall2({
      route: "savenewpassword",
      token: params?.data?.token,
      verb: "POST",
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      Alert.alert("Password Change Unsuccessful", res.message);
      // yield put({ type: ACTIONS.LOGIN_ERRORS, loginErrors: res });
    } else if (res.responseCode == 200) {
      Alert.alert("Success", "Password Changed Successfully");
      // yield put(setLoginData(res.payload));
    }
  } catch (e) {
    console.log("saga ChangePassword error -- ", e.toString());
  }
}
export function* changePasswordSaga() {
  yield takeLatest(ACTIONS.CHANGEPASSWORD, changePassword);
}

function* createGroup(params) {
  console.log("CreateGroup--", params.data.formData);
  try {
    const res = yield withoutStringiApiCall2({
      route: "groups/store",
      token: params?.data?.token,
      verb: "POST",
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      alert("Create Group Sucessfully");
      Alert.alert("Success", "Group Created Successfully");
    }
  } catch (e) {
    console.log("saga CreateGroup error -- ", e.toString());
  }
}
export function* createGroupSaga() {
  yield takeLatest(ACTIONS.CREATEGROUP, createGroup);
}

function* handleFriendRequest(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "users/connect_friends",
      token: params?.data?.token,
      verb: "POST",
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      // console.log("res !== 200 ... ", res);
      Toast.show(res.message, Toast.SHORT);
    } else if (res.responseCode == 200) {
      // console.log("res = 200 ... ", res);
      // params?.data?.refresh();
      if (params.data.do == "friend-add" || params.data.do == "friend-accept") {
        params?.data?.setIsModal ? params?.data?.setIsModal(true) : null;
      }

      params.data.do == "friend-add"
        ? Toast.show("Friend request sent successfully", Toast.SHORT)
        : params.data.do == "friend-cancel"
        ? Toast.show("Friend request cancelled successfully", Toast.SHORT)
        : params.data.do == "friend-remove"
        ? Toast.show("Friend removed successfully", Toast.SHORT)
        : params.data.do == "friend-accept"
        ? Toast.show("Friend request accepted", Toast.SHORT)
        : params.data.do == "friend-decline"
        ? Toast.show("Friend request declined", Toast.SHORT)
        : null;

      yield put(updateDoValue(params.data.do));
    }
  } catch (e) {
    console.log("saga CreateGroup error -- ", e.toString());
  }
}
export function* handleFriendReqSaga() {
  yield takeLatest(ACTIONS.Handle_Friend_Request, handleFriendRequest);
}

function* fetchBirthdayData(params) {
  try {
    const res = yield settingsApiCall({
      // route: "friends/birthdays",
      route: "friends/birthdays?page=" + params.data.current_page,
      verb: "GET",
      token: params?.data?.token,
    });

    console.log("res from birthday saga", res);

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      yield put(setBirthdayData(res.payload.data));
      // console.log("res from saga", res.payload.data);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchBirthdayDataSaga() {
  yield takeLatest(ACTIONS.GET_BIRTHDAY_REQUEST, fetchBirthdayData);
}

function* WishBirthdaySagaFn(params) {
  console.log("params", params?.data?.formData);
  try {
    const res = yield withoutStringiApiCall2({
      route: "friends_birthdays/wishBirthday",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    console.log("res from birthday saga", res);

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      // yield put(setBirthdayData(res.payload.data));
      // console.log("res from saga", res.payload.data);
      Toast.show("Birthday Wish Sent Successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* WishBirthdaySaga() {
  yield takeLatest(ACTIONS.WISH_BIRTHDAY, WishBirthdaySagaFn);
}
