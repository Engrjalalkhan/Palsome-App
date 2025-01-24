import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import VideoScreen from "../Screens/Videos/VideoScreen";
import FullVideoScreen from "../Screens/Videos/FullVideoScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const VideoStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="VideoScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="VideoScreen" component={VideoScreen} />

      <Stack.Screen
        name="FullVideoScreen"
        component={FullVideoScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default VideoStack;
