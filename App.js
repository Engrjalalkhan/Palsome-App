import "./src/i18n/i18n";
import Main from "./src/Navigators/Main";
import { COLORS } from "./src/Constants/Colors";
import { LogBox, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { persistor, store } from "./src/Redux/store";
import NetInfoBar from "./src/Components/NetInfoBar";
import FlashMessage from "react-native-flash-message";
import RNSplashScreen from "react-native-splash-screen";
import messaging from "@react-native-firebase/messaging";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

global.Buffer = require("buffer").Buffer; // Corrected Buffer import
LogBox.ignoreAllLogs();

function App() {
  useEffect(() => {
    if (Platform.OS === "ios") {
      RNSplashScreen.hide();
    }
  }, []);

  useEffect(() => {
    const getUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);
          getFCMToken();
        }
      } catch (error) {
        console.error("Error getting user permission:", error);
      }
    };

    getUserPermission();
  }, []);

  const getFCMToken = async () => {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    if (!fcmtoken) {
      try {
        const newToken = await messaging().getToken();
        console.log("New token =======>> :", newToken);
        await AsyncStorage.setItem("fcmtoken", newToken);
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    } else {
      console.log("Token already !!!!", fcmtoken);
    }
  };

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const getImage = remoteMessage?.data;
    if (getImage?.type === "user_Profile_update") {
      await AsyncStorage.setItem("image", getImage?.avatar_full);
    } else {
      console.log("Image available in kill session");
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NetInfoBar />
            <Main />
            <FlashMessage
              position="bottom"
              floating
              duration={3000}
              icon="auto"
              style={{
                alignItems: "center",
                backgroundColor: COLORS.secondary,
              }}
            />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
