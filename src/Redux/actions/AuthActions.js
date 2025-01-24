import { ACTIONS } from "../action-types";

export const loginRequest = (data) => ({
  type: ACTIONS.LOGIN,
  data,
});

export const setLoginData = (data) => ({
  type: ACTIONS.FETCH_LOGIN_DATA,
  data,
});
export const setSwitchUsers = (data) => ({
  type: ACTIONS.SWITCH_USERS,
  data,
});
export const setLoginRes = (data) => ({
  type: ACTIONS.LOGIN_RES,
  data,
});
export const setSaveUserPasswords = (data) => ({
  type: ACTIONS.SAVE_USER_PASSWORDS,
  data,
});

export const setPushNotificationProfile = (data) => ({
  type: ACTIONS.PUSH_NOTIFICATION_PROFILE,
  data,
});

export const setFCMToken = (data) => ({
  type: ACTIONS.SET_FCM_TOKEN,
  data,
});

export const signUpRequest = (data) => ({
  type: ACTIONS.SIGN_UP,
  data,
});

export const setSignUpData = (data) => ({
  type: ACTIONS.FETCH_SIGN_UP,
  data,
});

export const OtpRequest = (data) => ({
  type: ACTIONS.OTP,
  data,
});

export const setOtpData = (data) => ({
  type: ACTIONS.FETCH_OTP,
  data,
});

export const changePassword = (data) => ({
  type: ACTIONS.CHANGEPASSWORD,
  data,
});
export const updateUserData = (data) => ({
  type: ACTIONS.UPDATE_USERDATA,
  data,
});

export const resendOtp = (data) => ({
  type: ACTIONS.RESEND_OTP,
  data,
});

export const setResendOtpData = (data) => ({
  type: ACTIONS.SET_RESEND_OTP_DATA,
  data,
});
