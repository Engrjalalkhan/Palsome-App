import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsFeed from "../Screens/Main/NewsFeed/index";
import { Keyboard, Platform } from "react-native";
import SettingsStack from "./SettingsStack";
import HomeStack from "./HomeStack";
import { WP } from "../../Utils/Resposive";
import Notifications from "../Screens/Notifications";
import NotificationStack from "./NotificationStack";
import NewPostModal from "../Components/NewPostModal";
import { ACTIONS } from "../Redux/action-types";
import { useDispatch } from "react-redux";
import { COLORS } from "../Constants/Colors";
import { ICONS } from "../Constants/Icons";

const Tab = createBottomTabNavigator();
// @refresh reset
export default function BottomTab() {
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          backgroundColor: COLORS.white,
        },
        activeTintColor: COLORS.primary,
        inactiveTintColor: COLORS.black,

        style: { height: WP(18), zIndex: 1 },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "News Feed",
          tabBarIcon: ({ focused, color, size }) =>
            !focused
              ? ICONS.ionIcons("md-home", COLORS.black, 22)
              : ICONS.ionIcons("md-home", COLORS.primary, 32),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Home}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ focused, color, size }) =>
            !focused
              ? ICONS.ionIcons("md-search", COLORS.black, 25)
              : ICONS.ionIcons("md-search", COLORS.primary, 37),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Home}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            dispatch({ type: ACTIONS.OPEN_MODAL, visibility: true });
          },
        })}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ focused, color, size }) =>
            !focused
              ? ICONS.ionIcons("md-add-circle", COLORS.primary, 35)
              : ICONS.ionIcons("md-add-circle", COLORS.primary, 51),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ focused, color, size }) =>
            !focused
              ? ICONS.ionIcons("md-notifications", COLORS.primary, 25)
              : ICONS.ionIcons("md-notifications", COLORS.primary, 35),
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color, size }) =>
            !focused
              ? ICONS.ionIcons("md-settings", COLORS.primary, 25)
              : ICONS.ionIcons("md-settings", COLORS.primary, 35),
        }}
      />
    </Tab.Navigator>
  );
}
