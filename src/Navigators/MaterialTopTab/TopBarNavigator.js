import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  FlatList,
  LogBox,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../Constants/Colors";

const Tab = createMaterialTopTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="RoomFeed"
      tabBarOptions={{
        activeTintColor: COLORS.primary,
        labelStyle: { fontSize: 12 },
        style: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="RoomFeed"
        component={RoomFeed}
        options={{ tabBarLabel: "RoomFeed" }}
      />
      <Tab.Screen
        name="Rooms"
        component={Rooms}
        options={{ tabBarLabel: "RoomFeed" }}
      />
    </Tab.Navigator>
  );
}
export default function TopBarNavigator() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
