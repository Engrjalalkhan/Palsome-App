import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Signin from "../Screens/Authentication/Signin/index";
import Signup from "../Screens/Authentication/Signup/index";
import Intro from "../Screens/Authentication/Intro/index";
import Otp from "../Screens/Authentication/Otp/index";
import ForgetPassword from "../Screens/Main/ForgetPassword";
import ResetPassword from "../Screens/Authentication/ResetPassword";
import Splash from "../Screens/SplashScreen/Splash";
import NotificationStack from "./NotificationStack";
import ProfileScreen from "../Screens/ProfileScreen";
import GroupsNav from "../Screens/Main/Groups/GroupsNav";
import RoomsNav from "../Screens/Main/Rooms/RoomsNav";

const Stack = createStackNavigator();

// @refresh reset
const SwitchUserStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Groups" component={GroupsNav} />
      <Stack.Screen
        name="RoomsNav"
        component={RoomsNav}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="NotificationStackMain"
        component={NotificationStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SwitchUserStack;
