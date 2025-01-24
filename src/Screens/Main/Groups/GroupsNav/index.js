import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Groups from "../index";
import GroupsTL from "../GroupsTL";
import SearchGroups from "../SearchGroups";
import ImageShowScreen from "../../../Main/ImageShowScreen";
import PreviewGroupAlbums from "../PreviewGroupAlbums";

const Stack = createStackNavigator();

const GroupsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="GroupsHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GroupsHome" component={Groups} />
      <Stack.Screen name="GroupsTL" component={GroupsTL} />
      <Stack.Screen name="SearchGroups" component={SearchGroups} />
      <Stack.Screen name="ImageShowScreen" component={ImageShowScreen} />
      <Stack.Screen name="PreviewGroupAlbums" component={PreviewGroupAlbums} />
    </Stack.Navigator>
  );
};

export default GroupsNav;
