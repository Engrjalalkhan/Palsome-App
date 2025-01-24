import { ACTIONS } from "../action-types";

export const getReminders = (data) => {
  return {
    type: ACTIONS.REMINDERS_DATA,
    data,
  };
};
export const completeReminders = (data) => {
  return {
    type: ACTIONS.COMPLETE_REMINDERS,
    data,
  };
};
export const friendsReminders = (data) => {
  return {
    type: ACTIONS.FRIENDS_REMINDERS,
    data,
  };
};
export const deleteReminder = (data) => {
  return {
    type: ACTIONS.DELETE_REMINDER,
    data,
  };
};
export const resetReminders = (data) => {
  return {
    type: ACTIONS.RESET_REMINDERS,
    data,
  };
};
export const singleReminder = (data) => {
  return {
    type: ACTIONS.SINGLE_REMINDER,
    data,
  };
};
export const deleteFriendFromReminder = (reminderId, friendId) => ({
  type: ACTIONS.DELETE_FRIEND_FROM_REMINDER,
  data: { reminderId, friendId },
});
export const updateReminder = (data) => ({
  type: ACTIONS.UPDATE_REMINDER,
  data,
});
export const reminderAlertYes = (data) => {
  return {
    type: ACTIONS.REMINDER_ALERT_YES,
    data,
  };
};
