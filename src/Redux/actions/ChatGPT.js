import { ACTIONS } from "../action-types";

export const getAllConversations = (data) => {
  return {
    type: ACTIONS.GET_ALL_CONVERSATIONS,
    data,
  };
};

export const getConversationMessages = (data) => {
  return {
    type: ACTIONS.GET_CONVERSATION_MESSAGES,
    data,
  };
};

export const sendMessage = (data) => {
  return {
    type: ACTIONS.SEND_MESSAGE,
    data,
  };
};

export const clearMessages = () => {
  return {
    type: ACTIONS.CLEAR_MESSAGES,
  };
};
