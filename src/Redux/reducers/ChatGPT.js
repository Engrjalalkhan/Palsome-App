import { ACTIONS } from "../action-types";

const initialState = {
  allConversations: [],
  messages: [],
};

const chatGPTReducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ALL_CONVERSATIONS:
      return {
        ...state,
        allConversations: action.data,
      };

    case ACTIONS.GET_CONVERSATION_MESSAGES:
      return {
        ...state,
        messages: action.data,
      };

    case ACTIONS.SEND_MESSAGE:
      let convers = [...state.allConversations];
      let allConvers = [action.data, ...convers];

      return {
        ...state,
        allConversations: allConvers,
      };

    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };

    default:
      return state;
  }
};

export default chatGPTReducers;
