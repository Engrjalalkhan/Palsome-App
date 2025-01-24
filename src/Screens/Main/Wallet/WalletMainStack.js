import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WalletHome from "./WalletHome";
import ViewWallet from "./ViewWallet";
import WalletPdfView from "./WalletPdfView";
import WalletImageView from "./WalletImageViewModal";
import WalletDocxView from "./WalletDocxView";

const Stack = createStackNavigator();

// @refresh reset
const WalletMainStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="WalletHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WalletHome" component={WalletHome} />
      <Stack.Screen name="ViewWallet" component={ViewWallet} />
      <Stack.Screen name="WalletPdfView" component={WalletPdfView} />
      <Stack.Screen name="WalletImageView" component={WalletImageView} />
      <Stack.Screen name="WalletDocxView" component={WalletDocxView} />
    </Stack.Navigator>
  );
};

export default WalletMainStack;
