import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WalletSignin from "./WalletSignIn";
import WalletSignUp from "./WalletSignUp";
import SettingsStack from "../../../Navigators/SettingsStack";
import WalletChangePassword from "./WalletChangePassword";
import { useSelector } from "react-redux";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../../../Constants/Colors";
import { View } from "native-base";
import { SafeAreaView } from "react-native";
import WalletForgotPassword from "./WalletForgotPassword";
import WalletVerifyOtp from "./WalletVerifyOtp";

const Stack = createStackNavigator();

const WalletAuthStack = (props) => {
  const [showLoginScreen, setShowLoginScreen] = useState(null);
  const token = useSelector((state) => state.auth.userToken);

  const getWalletStatus = async () => {
    const response = await withoutStringiApiCall2({
      route: "wallet/password/status",
      verb: "GET",
      token: token,
    });

    if (response.payload.data.isPasswordSet) {
      setShowLoginScreen(true);
    } else {
      setShowLoginScreen(false);
    }
  };

  useEffect(() => {
    getWalletStatus();
  }, []);

  if (showLoginScreen === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={40} color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={showLoginScreen ? "WalletSignin" : "WalletSignUp"}
      screenOptions={{
        headerShown: false,
      }}
    >
      {showLoginScreen && (
        <>
          <Stack.Screen name="WalletSignin" component={WalletSignin} />
          <Stack.Screen
            name="WalletChangePassword"
            component={WalletChangePassword}
          />
          <Stack.Screen
            name="WalletForgotPassword"
            component={WalletForgotPassword}
          />
          <Stack.Screen name="WalletVerifyOtp" component={WalletVerifyOtp} />
        </>
      )}
      {!showLoginScreen && (
        <>
          <Stack.Screen name="WalletSignUp" component={WalletSignUp} />
          <Stack.Screen name="WalletSignin" component={WalletSignin} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WalletAuthStack;
