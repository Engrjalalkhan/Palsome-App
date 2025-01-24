import React from "react";
import NewsFeed from "../Screens/Main/NewsFeed";

import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "../Screens/Notifications";
import SinglePost from "../Screens/SinglePost";
// import ReelsIndex from "../Screens/ReelsIndex";
import ReelsIndex from "../Screens/Main/Reels";
// import ReelsIndex from "./index";
import ImgGridModalScreen from "../Screens/Main/ImgGridModalScreen";
import ProfileScreen from "../Screens/ProfileScreen/index";
import Reels from "../Screens/Main/Reels";
import SingleReel from "../Screens/Main/Reels/SingleReel";
import ReelsNav from "../Screens/Main/Reels/ReelsNav";
import ImageShowScreen from "../Screens/Main/ImageShowScreen";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Notifications"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="SinglePost" component={SinglePost} />
      <Stack.Screen name="SingleReel" component={SingleReel} />

      {/* <Stack.Screen name="SingleReel" component={SingleReel} />
      <Stack.Screen name="ReelsNav" component={ReelsNav} /> */}
      {/* <Stack.Screen name="ReelsIndex" component={ReelsIndex} /> */}
      <Stack.Screen
        name="ImgGridModelScreen"
        component={ImgGridModalScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImageshowScreen"
        component={ImageShowScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerStyle: { backgroundColor: "black" },
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
    </Stack.Navigator>
  );
};

export default NotificationStack;
