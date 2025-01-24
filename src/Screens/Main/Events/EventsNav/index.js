import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Events from "../index";
import EventTL from "../EventTL";
import SearchEvents from "../SearchEvents";
import ImageShowScreen from "../../../Main/ImageShowScreen";

const Stack = createStackNavigator();

const EventsNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="EventsHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="EventTL" component={EventTL} />
      <Stack.Screen name="EventsHome" component={Events} />
      <Stack.Screen name="SearchEvents" component={SearchEvents} />
      <Stack.Screen name="ImageShowScreen" component={ImageShowScreen} />
    </Stack.Navigator>
  );
};

export default EventsNav;
