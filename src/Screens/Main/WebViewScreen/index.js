import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { WP } from "../../../../Utils/Resposive";
import MyHeader from "../../../Components/MyHeader";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function WebViewScreen({ route, navigation }) {
  const URL = route.params;
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });
  // console.log(URL);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MyHeader
        goBack={navigation.goBack}
        // heading="Profile Settings"
      />

      <WebView source={{ uri: URL }} />
    </SafeAreaView>
  );
}
