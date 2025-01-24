import { ACTIONS } from "../action-types";

const initialState = {
  exploreData: [],
};

const buyNsellReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_BUYNSELL_EXPLORE:
      return {
        ...state,
        exploreData: action.data,
      };
    case ACTIONS.GET_BUYNSELL_PARENT_CATEGORY:
      return {
        ...state,
        parentCategories: action.data,
      };
    case ACTIONS.GET_BUYNSELL_PARENT_CATEGORY_DATA:
      return {
        ...state,
        parentCategoriesData: action.data,
      };

    default:
      return state;
  }
};

export default buyNsellReducer;
