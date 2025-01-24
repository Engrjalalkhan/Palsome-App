import { ACTIONS } from "../action-types";

const initialState = {
  remindersData: [],
  completeRemindersData: [],
  friendsRemindersData: [],
  reminderAlert: false,
};

const reminderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REMINDERS_DATA:
      const newReminders = action.data || [];
      const existingIds = new Set(
        state.remindersData.map((reminder) => reminder.id)
      );
      const uniqueNewReminders = newReminders.filter(
        (reminder) => !existingIds.has(reminder.id)
      );

      return {
        ...state,
        remindersData: [...state.remindersData, ...uniqueNewReminders],
      };

    case ACTIONS.COMPLETE_REMINDERS:
      const completedReminders = action.data || [];
      const existingCompleteIds = new Set(
        state.completeRemindersData.map((reminder) => reminder.id)
      );
      const uniqueCompleteReminders = completedReminders.filter(
        (reminder) => !existingCompleteIds.has(reminder.id)
      );

      return {
        ...state,
        completeRemindersData: [
          ...state.completeRemindersData,
          ...uniqueCompleteReminders,
        ],
      };

    case ACTIONS.FRIENDS_REMINDERS:
      const friendsReminders = action.data || [];
      const existingFriendsIds = new Set(
        state.friendsRemindersData.map((reminder) => reminder.id)
      );
      const uniqueFriendsReminders = friendsReminders.filter(
        (reminder) => !existingFriendsIds.has(reminder.id)
      );

      return {
        ...state,
        friendsRemindersData: [
          ...state.friendsRemindersData,
          ...uniqueFriendsReminders,
        ],
      };

    case ACTIONS.DELETE_REMINDER:
      return {
        ...state,
        remindersData: state.remindersData.filter(
          (reminder) => reminder.id !== action.data
        ),
        completeRemindersData: state.completeRemindersData.filter(
          (reminder) => reminder.id !== action.data
        ),
        friendsRemindersData: state.friendsRemindersData.filter(
          (reminder) => reminder.id !== action.data
        ),
      };

    case ACTIONS.RESET_REMINDERS:
      return {
        ...state,
        remindersData: [],
        completeRemindersData: [],
        friendsRemindersData: [],
      };

    case ACTIONS.SINGLE_REMINDER:
      return {
        ...state,
        remindersData: [action.data, ...state.remindersData],
      };

    case ACTIONS.DELETE_FRIEND_FROM_REMINDER:
      return {
        ...state,
        remindersData: state.remindersData.map((reminder) => {
          if (reminder.id === action.data?.reminderId) {
            return {
              ...reminder,
              friends: reminder.friends.filter(
                (friend) => friend.id !== action.data.friendId
              ),
            };
          }
          return reminder;
        }),
        completeRemindersData: state.completeRemindersData.map((reminder) => {
          if (reminder.id === action.data?.reminderId) {
            return {
              ...reminder,
              friends: reminder.friends.filter(
                (friend) => friend.id !== action.data.friendId
              ),
            };
          }
          return reminder;
        }),
      };

    case ACTIONS.UPDATE_REMINDER:
      return {
        ...state,
        remindersData: state.remindersData.map((reminder) =>
          reminder.id === action.data.id ? action.data : reminder
        ),
        completeRemindersData: state.completeRemindersData.map((reminder) =>
          reminder.id === action.data.id ? action.data : reminder
        ),
      };
    case ACTIONS.REMINDER_ALERT_YES:
      return {
        ...state,
        reminderAlert: true,
      };

    default:
      return state;
  }
};

export default reminderReducer;
