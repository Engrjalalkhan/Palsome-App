import { ACTIONS } from "../action-types";

export const getBuyNsellApiCall = (data) => {
  return {
    type: ACTIONS.GET_BUYNSELL_EXPLORE_API_CALL,
    data,
  };
};

export const getBuyNsellExplore = (data) => {
  return {
    type: ACTIONS.GET_BUYNSELL_EXPLORE,
    data,
  };
};
export const getBuyNsellParentCategories = (data) => {
  return {
    type: ACTIONS.GET_BUYNSELL_PARENT_CATEGORY,
    data,
  };
};
export const getBuyNsellParentCategoriesData = (data) => {
  return {
    type: ACTIONS.GET_BUYNSELL_PARENT_CATEGORY_DATA,
    data,
  };
};
