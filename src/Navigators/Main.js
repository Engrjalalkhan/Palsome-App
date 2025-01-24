/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import AuthNavigator from "./Auth";
import { useDispatch, useSelector } from "react-redux";
import MainStack from "./MainNavigator";
import messaging from "@react-native-firebase/messaging";

import { navigationRef } from "./RootNavigation";
import { deleteApiData } from "../Screens/Main/ReminderScreen/Components/remindersApiCall";
import { Alert } from "react-native";
import { reminderAlertYes } from "../Redux/actions/Reminders";
import { WebSocketProvider } from "../socket";
import checkForUpdate from "../../Utils/checkForUpdate/CheckForUpdate";
import { BackPressProvider } from "../../Utils/backHardwareBackPress/handleHardBackPress";

const Main = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);

  const showAlert = async (item) => {
    const nodeUrl = item?.node_url;
    const reminderNode = nodeUrl?.split("/");
    const encrypted_id_reminder = reminderNode[reminderNode?.length - 1];
    const queryString = item?.notify_id;
    const regex = /[?&]notify_id=(\d+)/;
    const match = queryString.match(regex);
    const notifyId = match ? match[1] : null;

    Alert.alert(
      "Reminder",
      `${item.reminder_name}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => {
            try {
              const apiRoute = `reminders/complete/${encrypted_id_reminder}`;
              const verb = "GET";
              const deleteReminderData = await deleteApiData(
                apiRoute,
                token,
                verb
              );

              if (deleteReminderData?.responseCode === 200) {
                console.log(
                  "Dispatching deleteReminder with notifyId:",
                  notifyId
                );
                // dispatch(deleteReminder(notifyId));
                dispatch(reminderAlertYes(true));
                console.log("Reminder completed and deleted");
              } else {
                console.log("Failed to delete reminder:", deleteReminderData);
              }
            } catch (error) {
              console.error("Error completing reminder:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showFriendAlert = (item) => {
    Alert.alert(
      "Reminder",
      `${item.reminder_name} (Check Reminders section for more details) `,

      [
        {
          text: "Ok",
          style: "Ok",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const unsubscribe = handleForegroundMessages();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    checkForUpdate(token);
  }, []);

  const handleForegroundMessages = () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      let getReminder = remoteMessage?.data;
      if (getReminder?.action === "reminder") {
        showAlert(getReminder);
      } else if (getReminder?.action === "send-reminder-tofriend") {
        showFriendAlert(getReminder);
      }
    });
    return unsubscribe;
  };

  const linking = {
    prefixes: ["palsome://"],
    config: {
      screens: {
        ProfileScreen: {
          path: "ProfileScreen/:id/:fromTouchbase",
        },
      },
    },
  };

  return (
    <BackPressProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        {token ? (
          <WebSocketProvider>
            <MainStack />
          </WebSocketProvider>
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </BackPressProvider>
  );
};

export default Main;
