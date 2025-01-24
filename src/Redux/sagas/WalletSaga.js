import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { ACTIONS } from "../action-types";
import SimpleToast from "react-native-simple-toast";
import { withoutStringiApiCall2, addWalletApiCall } from "../../Services/Apis";
import {
  walletSetSignUpData,
  walletSetSignInData,
  setWalletToken,
  setWalletData,
  setWalletPreviewData,
  setNewWallet,
  deleteWalletToken,
  deleteWallet,
  updateWalletItems,
  refreshWallet,
} from "../actions/WalletActions";
function* walletSignUpRequest(params) {
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "wallet/password",
      verb: "POST",
      token: params?.data?.token,
    });
    console.log("res from saga -->>> ", res);
    if (res.status !== 200) {
      yield put({ type: ACTIONS.ERRORS, errorText: res.errors });
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res?.message);
      SimpleToast.show(res?.message);
    } else {
      yield put(setWalletToken(res?.data?.wallet_api_token));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      SimpleToast.show(res?.message);
      // Navigate to the Signin screen
      params?.data?.navigation?.navigate("WalletSignin");
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* walletSignUpSaga() {
  yield takeLatest(ACTIONS.WALLET_SIGNUP_REQUEST, walletSignUpRequest);
}

function* walletSignInRequest(params) {
  // console.log("params.data response from wallet sigin saga", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "wallet/action/verification",
      verb: "POST",
      token: params?.data?.token,
    });
    // console.log("res from wallet signIn saga -- ", res);
    if (res.status !== 200) {
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Error in saga", res.errors);
      alert("Password is incorrect");
    } else if (res.status == 200) {
      console.log("success response in signup api ", res);
      yield put(setWalletToken(res?.data?.wallet_api_token));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("sigIn saga - catch error -- ", e.toString());
  }
}

export function* walletSignInSaga() {
  yield takeLatest(ACTIONS.WALLET_SIGIN_REQUEST, walletSignInRequest);
}

function* walletDataRequest(params) {
  // console.log("Params in Wallet dta req:::>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: `wallet?wallet_api_token=${params.data.walletToken}`,
      verb: "GET",
      token: params?.data?.token,
    });
    // console.log("res from wallet data saga -- ", res);
    if (res.responseCode !== 200) {
      if (res.responseCode == 400) {
        SimpleToast.show("SESSION EXPIRED");
        yield put(deleteWalletToken());
      }
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Status code Error in saga", res);
    } else if (res.responseCode == 200) {
      console.log("success response in wallet data api ", res);
      yield put(setWalletData(res.payload));
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* walletDataSaga() {
  yield takeLatest(ACTIONS.GET_WALLET_DATA, walletDataRequest);
}

function* walletPreviewDataRequest(params) {
  // console.log("Params in Wallet Preview Data:::>>", params.data);
  try {
    params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: `wallet/item/${params.data?.item_id}?wallet_api_token=${params.data.walletToken}`,
      verb: "GET",
      token: params?.data?.token,
    });
    console.log("res from wallet preview data saga -- ", res);
    if (res.responseCode !== 200) {
      if (res.responseCode == 400) {
        SimpleToast.show("SESSION EXPIRED");
        yield put(deleteWalletToken());
      }
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
      console.log("Status code Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      console.log("success response in wallet preview data api ", res);
      yield put(setWalletPreviewData(res.payload));
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* walletPreviewDataSaga() {
  yield takeLatest(ACTIONS.GET_WALLET_PREVIEW_DATA, walletPreviewDataRequest);
}

function* walletAddItemRequest(params) {
  console.log("Params in Wallet Add Item:::>>", JSON.stringify(params.data));
  console.log(
    "Params in Wallet Add Item:::>>",
    JSON.stringify(params.data.formData)
  );
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.formData,
      route: `wallet/item/add?wallet_api_token=${params.data.walletToken}`,
      verb: "POST",
      token: params?.data?.token,
    });

    console.log("res from wallet add item saga -- ", res);

    if (res.responseCode !== 200) {
      if (res.responseCode == 400) {
        SimpleToast.show("SESSION EXPIRED");
        yield put(deleteWalletToken());
      }
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Status code Error in saga", res);
    } else if (res.responseCode == 200) {
      console.log("success response in wallet add item api ", res);
      // yield put(setNewWallet(res.payload));
      params?.data?.setResponseUploadApi
        ? params?.data?.setResponseUploadApi(res)
        : null;
      SimpleToast.show("Item added successfully");
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      yield put(refreshWallet(true));
    }
  } catch (e) {
    console.log("saga error in catch of add walletItems::>> ", e.toString());
  }
}

export function* walletAddItemSaga() {
  yield takeLatest(ACTIONS.SET_NEW_WALLET, walletAddItemRequest);
}

function* deleteWalletFn(params) {
  console.log("Params in delete wallet:::>>", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: `wallet/item/${params.data?.encrypted_id}/delete?wallet_api_token=${params.data.walletToken}`,
      verb: "DELETE",
      token: params?.data?.token,
    });
    console.log("res from wallet delete item saga -- ", res);
    if (res.responseCode !== 200) {
      SimpleToast.show("Something went wrong");
      if (res.responseCode == 400) {
        SimpleToast.show("SESSION EXPIRED");
        yield put(deleteWalletToken());
      }
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      console.log("Status code Error in saga", res.errors);
    } else if (res.responseCode == 200) {
      console.log("success response in wallet delete item api ", res);
      SimpleToast.show("Item deleted successfully");
      params?.data?.setResponseDeleteApi
        ? params?.data?.setResponseDeleteApi(res)
        : null;
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      yield put(refreshWallet(true));
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* deleteWalletSaga() {
  yield takeLatest(ACTIONS.DELETE_WALLET_REQUEST, deleteWalletFn);
}

function* updateWalletItemRequest(params) {
  console.log("Params in update wallet Item:::>>", JSON.stringify(params.data));
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      route: `wallet/item/update?wallet_api_token=${params.data.walletToken}`,
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });
    console.log("res from update wallet items::>>", res);
    if (res.responseCode !== 200) {
      // SimpleToast.show("Something went wrong>>>>>>>>>");
      if (res.responseCode == 400) {
        SimpleToast.show("SESSION EXPIRED");
        yield put(deleteWalletToken());
      }
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
      // SimpleToast.show("Something went wrong");
      console.log("Status code Error in update wallet saga", res.errors);
    } else if (res.responseCode == 200) {
      console.log("success response in update wallet items api ", res);
      yield put(updateWalletItems(res.payload));
      SimpleToast.show("Wallet updated successfully");
      params?.data?.setSuccessFullyUpdated
        ? params?.data?.setSuccessFullyUpdated(true)
        : null;
      params?.data?.setLoading ? params?.data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* updateWalletItemSaga() {
  yield takeLatest(ACTIONS.UPDATE_WALLET_ITEM_REQUEST, updateWalletItemRequest);
}
