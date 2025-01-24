import { ACTIONS } from "../action-types";

export const walletSetSignUpData = (data) => ({
  type: ACTIONS.WALLET_SIGNUP_REQUEST,
  data,
});

export const walletSetSignInData = (data) => ({
  type: ACTIONS.WALLET_SIGIN_REQUEST,
  data,
});

export const setWalletToken = (data) => {
  // console.log("data from set wallet token", data);
  return {
    type: ACTIONS.SET_WALLET_TOKEN,
    data,
  };
};

export const deleteWalletToken = () => {
  console.log("data from delete wallet token");
  return {
    type: ACTIONS.DELETE_WALLET_TOKEN,
  };
};

export const getWalletData = (data) => ({
  type: ACTIONS.GET_WALLET_DATA,
  data,
});
export const setWalletData = (data) => ({
  type: ACTIONS.SET_WALLET_DATA,
  data,
});

export const getWalletPreviewData = (data) => ({
  type: ACTIONS.GET_WALLET_PREVIEW_DATA,
  data,
});

export const setWalletPreviewData = (data) => ({
  type: ACTIONS.SET_WALLET_PREVIEW_DATA,
  data,
});

export const createNewWallet = (data) => ({
  type: ACTIONS.CREATE_NEW_WALLET,
  data,
});

export const setNewWalletData = (data) => {
  // console.log("data from set new wallet", data);
  return {
    type: ACTIONS.SET_NEW_WALLET,
    data,
  };
};

export const deleteWalletRequest = (data) => ({
  type: ACTIONS.DELETE_WALLET_REQUEST,
  data,
});

export const deleteWallet = (data) => {
  return {
    type: ACTIONS.DELET_WALLET,
    data,
  };
};

export const updateWalletRequest = (data) => ({
  type: ACTIONS.UPDATE_WALLET_ITEM_REQUEST,
  data,
});

export const refreshWallet = (data) => ({
  type: ACTIONS.WALLET_REFRESH,
  data,
});

export const updateWalletItems = (data) => {
  return {
    type: ACTIONS.UPDATE_WALLET_ITEM,
    data,
  };
};
