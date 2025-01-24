import { ACTIONS } from "../action-types";
import { put, takeLatest } from "redux-saga/effects";
import SimpleToast from "react-native-simple-toast";
import { withoutStringiApiCall2, addWalletApiCall } from "../../Services/Apis";
import {
  getBuyNsellExplore,
  getBuyNsellParentCategoriesData,
} from "../actions/BuyNsellActions";

function* exploreBuyNsellReq(params) {
  //   console.log("params.data response from joinedRooms saga", params.data);
  try {
    params?.data?.setLoading ? params?.data?.setLoading(true) : null;
    const res = yield withoutStringiApiCall2({
      params: params.data.params,
      route: "buynsell/explore?limit=15",
      verb: "GET",
      token: params?.data?.token,
    });
    if (res?.responseCode == 200) {
      yield put(getBuyNsellExplore(res?.payload?.data?.market_place));
    } else {
      console.log("Error in BuyNsell Saga", res);
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* exploreBuyNsellReqSaga() {
  yield takeLatest(ACTIONS.GET_BUYNSELL_EXPLORE_API_CALL, exploreBuyNsellReq);
}

function* categoriesApiRequest(params) {
  //   console.log("params.data response from joinedRooms saga", params.data);

  try {
    const res = yield withoutStringiApiCall2({
      route: "buynsell/item/parentcategories",
      verb: "GET",
      token: params?.data?.token,
    });

    if (res?.responseCode == 200) {
      const categories = res?.payload?.data?.parent_categories;
      yield put(getBuyNsellParentCategoriesData(categories));
    } else {
      console.log("Error in BuyNsell Saga", res);
    }
  } catch (e) {
    console.log("saga error -- ", e.toString());
  }
}

export function* parentCategoryBuyNsellReqSaga() {
  yield takeLatest(ACTIONS.GET_BUYNSELL_PARENT_CATEGORY, categoriesApiRequest);
}
