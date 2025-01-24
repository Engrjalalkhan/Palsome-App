import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomsHome from "./RoomsHome";
import SearchRooms from "./SearchRooms";
import ViewRoom from "./ViewRoom";
import ImageShowScreen from "../../Main/ImageShowScreen";
import PreviewAlbum from "./PreviewAlbum";
import ProfileScreen from "../../ProfileScreen";

const Stack = createStackNavigator();

const RoomsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="RoomsHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RoomsHome" component={RoomsHome} />
      <Stack.Screen name="SearchRooms" component={SearchRooms} />
      <Stack.Screen name="ViewRoom" component={ViewRoom} />
      <Stack.Screen name="ImageShowScreen" component={ImageShowScreen} />
      <Stack.Screen name="PreviewAlbum" component={PreviewAlbum} />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
    </Stack.Navigator>
  );
};

export default RoomsNav;
