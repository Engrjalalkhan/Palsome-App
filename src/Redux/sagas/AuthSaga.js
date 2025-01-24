import { ApiCall, VerApiCall } from "../../Services/Apis";
import { ACTIONS } from "../action-types";
import {
  setLoginData,
  setLoginRes,
  setOtpData,
  setResendOtpData,
  setSaveUserPasswords,
  setSignUpData,
  setSwitchUsers,
} from "../actions/AuthActions";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { Alert } from "react-native";
import Toast from "react-native-simple-toast";
import { resetReminders } from "../actions/Reminders";

function* loginRequest(params) {
  console.log("rparams ", params);

  try {
    params?.data?.setLoading(true);
    const res = yield ApiCall({
      params: params.data,
      route: "login",
      verb: "POST",
    });
    console.log(res?.payload?.user?.id, "RESPONSE");

    yield put(setLoginRes(res));
    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      params?.data?.setLoading(false);
      if (res?.payload?.token && params?.data?.setInactiveUserData) {
        params?.data?.setInactiveUserData(res?.payload);
      } else Alert.alert("Unsuccessful", "Email or password is wrong");

      yield put({ type: ACTIONS.LOGIN_ERRORS, loginErrors: res });
    } else if (res.responseCode == 200) {
      yield put({ type: ACTIONS.CLEAR_DP });
      let userEmail = params?.data?.email;
      let userPassword = params?.data?.password;
      let userCredentials = { email: userEmail, password: userPassword };
      yield put(setSaveUserPasswords(userCredentials));
      params?.data?.setLoading(false);
      yield put(setLoginData(res.payload));
      yield put(setSwitchUsers(res.payload));
      yield put(resetReminders());

      // console.log("login data", res.payload);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}
export function* loginSaga() {
  yield takeLatest(ACTIONS.LOGIN, loginRequest);
}

function* signUpRequest(params) {
  console.log("params.data", params.data);
  try {
    params?.data?.setLoading(true);
    const res = yield VerApiCall({
      params: params.data.params,
      route: "register",
      verb: "POST",
    });
    console.log("res from saga -- ", res);
    if (res.responseCode !== 200) {
      yield put({ type: ACTIONS.ERRORS, errorText: res.errors });
      params?.data?.setLoading(false);
      Toast.show(res?.message, Toast.LONG);
    } else if (res.responseCode == 200) {
      yield put({ type: ACTIONS.CLEAR_DP });
      console.log("success response in signup api ", res);
      // yield put(setSignUpData(res.payload));

      params?.data?.setInactiveUserData
        ? params?.data?.setInactiveUserData(res?.payload)
        : null;
      params?.data?.setLoading(false);
    }
  } catch (e) {
    console.log("saga sign up err --- ", e);
  }
}
export function* signUpSaga() {
  yield takeLatest(ACTIONS.SIGN_UP, signUpRequest);
}

function* OtpRequest(params) {
  console.log("check otp saga api params", params);

  params?.data?.setSendOtpLoading ? params.data.setSendOtpLoading(true) : null;
  try {
    const res = yield VerApiCall({
      params: params.data,
      route: "check_otp",
      verb: "POST",
    });
    console.log(res);
    yield put(setLoginRes(res));
    console.log(params.data);
    if (res.responseCode !== 200) {
      console.log("res !== 200 in otp api... ", res);
      params?.data?.setErorResponse
        ? params.data.setErorResponse(res.payload)
        : null;
      params?.data?.setSendOtpLoading
        ? params.data.setSendOtpLoading(false)
        : null;
      Alert.alert(res?.message);
    } else if (res.responseCode == 200) {
      console.log("res == 200 in otp api... ", res);
      params?.data?.setSendOtpLoading
        ? params.data.setSendOtpLoading(false)
        : null;
      yield put(setOtpData(res.payload));
      yield put(setSwitchUsers(res.payload));
    }
  } catch (e) {
    console.log("saga sign up err --- ", e);
  }
}
export function* OtpSaga() {
  yield takeLatest(ACTIONS.OTP, OtpRequest);
}

function* ResendOtp(params) {
  // console.log("params in saga resen", params.data.setResendApiReponse);
  params?.data?.setLoadingResend ? params?.data?.setLoadingResend(true) : null;
  try {
    const res = yield VerApiCall({
      params: params?.data?.body,
      route: "save_resend_otp",
      verb: "POST",
    });
    console.log(res);
    console.log(params.data);
    if (res.responseCode !== 200) {
      params?.data?.setLoadingResend
        ? params?.data?.setLoadingResend(false)
        : null;
      console.log("res !== 200 in resend otp api... ", res);
    } else if (res.responseCode == 200) {
      params?.data?.setLoadingResend
        ? params?.data?.setLoadingResend(false)
        : null;

      console.log("res == 200 in resend otp api... ", res);

      Toast.show(res?.message, Toast.SHORT);
      yield put(setResendOtpData(res.payload));
    }
  } catch (e) {
    console.log("saga sign up err --- ", e);
  }
}
export function* ResendOtpSaga() {
  yield takeLatest(ACTIONS.RESEND_OTP, ResendOtp);
}
