import { ACTIONS } from "../../action-types";

const initialState = {
  // statusPosted: [],
  walletToken: null,
  walletData: [],
  walletPreviewData: [],
  myWalletData: [],
  newWalletData: [],
  resfresh: false,
  walletRefresh: false,
};

const WalletRed = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_WALLET_TOKEN:
      return {
        ...state,
        walletToken: action.data,
      };

    case ACTIONS.DELETE_WALLET_TOKEN:
      return {
        ...state,
        walletToken: null,
      };

    case ACTIONS.SET_WALLET_DATA:
      return {
        ...state,
        walletData: action.data,
      };

    case ACTIONS.SET_WALLET_PREVIEW_DATA:
      return {
        ...state,
        walletPreviewData: action.data,
      };

    case ACTIONS.SET_NEW_WALLET:
      return {
        ...state,
        newWalletData: action.data,
      };

    case ACTIONS.WALLET_REFRESH:
      return {
        ...state,
        walletRefresh: action.data,
      };

    case ACTIONS.DELET_WALLET:
      console.log("Data in red", action.data);
      return {
        ...state,
        walletData: action.data,
        resfresh: true,
      };

    case ACTIONS.UPDATE_WALLET_ITEM:
      console.log("Data in red", action.data);
      return {
        ...state,
        walletPreviewData: action.data,
      };

    case ACTIONS.GET_WALLET_DATA:
      return {
        ...state,
        myWalletData: action.data,
      };

    default:
      return state;
  }
};

export default WalletRed;
