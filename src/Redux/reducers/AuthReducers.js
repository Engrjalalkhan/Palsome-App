import { ACTIONS } from "../action-types";

const initialState = {
  userToken: null,
  userData: null,
  switchUserData: [],
  saveUserPasswords: [],
  errorText: null,
  otpToken: null,
  loginErrors: null,
  resendOtpData: null,
  fcmToken: null,
  pushNotificationProfile: null,
  userRes: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_LOGIN_DATA:
      return {
        ...state,
        userToken: action?.data?.accessToken,
        userData: action?.data?.user,
      };
    case ACTIONS.LOGIN_RES:
      return {
        ...state,
        userRes: action?.data,
      };
    case ACTIONS.SWITCH_USERS:
      const updatedSwitchUserData = state.switchUserData.filter(
        (user) =>
          user?.id !== action?.data && user !== null && user !== undefined
      );

      // Check if the user already exists in the updatedSwitchUserData array
      const existingUserIndex = updatedSwitchUserData.findIndex(
        (user) => user?.id === action?.data?.user?.id
      );

      // If the user already exists, remove it
      if (existingUserIndex !== -1) {
        updatedSwitchUserData.splice(existingUserIndex, 1);
      }

      return {
        ...state,
        switchUserData: [...updatedSwitchUserData, action?.data?.user],
      };

    case ACTIONS.SAVE_USER_PASSWORDS: {
      const { email, password } = action?.data;

      if (action.data?.filter) {
        const filteredUserPasswords = state.saveUserPasswords.filter(
          (user) => user.email !== action.data.filteredUsers
        );

        return {
          ...state,

          saveUserPasswords: [...filteredUserPasswords, { email, password }],
        };
      } else {
        const existingUserIndex = state?.saveUserPasswords.findIndex(
          (user) => user?.email === email
        );

        if (existingUserIndex !== -1) {
          const updatedUserPasswords = [...state?.saveUserPasswords];
          updatedUserPasswords[existingUserIndex] = { email, password };

          return {
            ...state,
            saveUserPasswords: updatedUserPasswords,
          };
        } else {
          return {
            ...state,
            saveUserPasswords: [
              ...state.saveUserPasswords,
              { email, password },
            ],
          };
        }
      }
    }

    case ACTIONS.FETCH_SIGN_UP:
      return {
        ...state,
        otpToken: action.data.token,
        userData: action.data,
      };

    case ACTIONS.SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.data,
      };

    case ACTIONS.PUSH_NOTIFICATION_PROFILE:
      return {
        ...state,
        pushNotificationProfile: action.data,
      };

    case ACTIONS.FETCH_OTP:
      return {
        ...state,
        userToken: action.data.access_token,
        userData: action.data.user,
      };

    case ACTIONS.ERRORS: {
      return {
        ...state,
        errorText: action.errorText,
      };
    }
    case ACTIONS.LOGIN_ERRORS: {
      return {
        ...state,
        loginErrors: action.loginErrors,
      };
    }

    case ACTIONS.LOGOUT:
      return {
        ...state,
        userToken: null,
        userData: null,
        errors: null,
        otpToken: null,
        loginErrors: null,
        switchUserData: [],
        saveUserPasswords: [],
        userRes: null,
      };

    case ACTIONS.CLEAR_USER_TOKEN:
      return {
        ...state,
        userToken: null,
      };

    case ACTIONS.CLEAR_LOGIN_RES:
      return {
        ...state,
        userRes: null,
      };

    case ACTIONS.CLEAR_LOGIN_RES_ALL:
      return {
        ...state,
        userData: null,
      };

    case ACTIONS.UPDATE_USERDATA:
      return {
        ...state,

        userData: { ...state.userData, ...action.data },
      };

    case ACTIONS.SET_RESEND_OTP_DATA: {
      return {
        ...state,
        resendOtpData: action.data,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
