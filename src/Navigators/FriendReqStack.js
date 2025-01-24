import React from "react";
import NewsFeed from "../Screens/Main/NewsFeed";
import { createStackNavigator } from "@react-navigation/stack";
import Notifications from "../Screens/Notifications";
import ProfileScreen from "../Screens/ProfileScreen";
import FriendReq from "../Screens/FriendReq";
import FindFriendsModalScreen from "../Screens/Main/FindFriendsModalScreen";
import ImageShowScreen from "../Screens/Main/ImageShowScreen";
import SearchComponent from "../Components/SearchComponent";
import AllFriendModalScreen from "../Screens/Main/AllFriendModalScreen";

const Stack = createStackNavigator();

const FriendReqStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="FriendReqStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FriendReq" component={FriendReq} />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
      <Stack.Screen
        name="FindFriendsModalScreen"
        component={FindFriendsModalScreen}
        screenOptions={{ presentation: "modal" }}
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
      <Stack.Screen
        name="SearchComponent"
        component={SearchComponent}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AllFriendModalScreenFriendStack"
        component={AllFriendModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default FriendReqStack;
