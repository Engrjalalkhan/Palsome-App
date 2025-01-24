import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeStack from "../HomeStack";
import NotificationStack from "../NotificationStack";
import SettingsStack from "../SettingsStack";
import { getHeight } from "../../../Utils/FuncsAndRespons";
import { Platform, Text, View, Image, TouchableOpacity } from "react-native";
import VideoScreen from "../../Screens/Videos/VideoScreen";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import FriendReqStack from "../FriendReqStack";
import { WP } from "../../../Utils/Resposive";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

const Tab = createMaterialTopTabNavigator();

const MyTopTabs = () => {
  const getSelectedLanguage = useSelector((state) => state.newsF.saveLanguage);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (getSelectedLanguage) {
      i18n.changeLanguage(getSelectedLanguage);
    }
  }, [getSelectedLanguage, i18n]);

  const numOfNots = useSelector((state) => state.newsF.numOfNotifications);
  const friendRequestsNumber = useSelector(
    (state) => state.blackNewsF.friendRequestsNumber
  );
  const IconSize = WP(6);
  const labelSize = WP(2.5);
  const NotsNumLabel = ({
    backColor = COLORS.primary,
    txtColor = "white",
    number,
    top = 0,
    right = 0,
  }) =>
    number ? (
      <View
        style={{
          backgroundColor: backColor,
          position: "absolute",
          top: top,
          right: right,
          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
          height: 12,
          width: 12,
          borderRadius: 20,
        }}
      >
        <Text
          style={{ fontSize: 7, fontWeight: "bold", color: txtColor }}
          adjustsFontSizeToFit
        >
          {number}
        </Text>
      </View>
    ) : null;

  return (
    <SafeAreaProvider>
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: labelSize,
            textTransform: "none",
            width: WP(16),
          },
          tabBarItemStyle: {},
          tabBarStyle: {
            paddingBottom: Platform.OS === "ios" ? getHeight(1) : getHeight(0),
            borderTopWidth: 0.2,
            borderColor: "gray",
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: "black",
          tabBarBounces: "true",
          tabStyle: { borderColor: "purple", borderWidth: 4 },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.primary,
            top: 0,
            height: 3,
            alignSelf: "center",
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarLabel: t("Home"),
            tabBarIcon: ({ focused }) =>
              !focused
                ? ICONS.fontAwesome5("home", COLORS.black, IconSize)
                : ICONS.fontAwesome5("home", COLORS.primary, IconSize),
          }}
          name="Home"
          component={HomeStack}
        />
        <Tab.Screen
          options={{
            tabBarLabel: t("Friends"),

            tabBarIcon: ({ focused, color, size }) =>
              !focused ? (
                <>
                  <NotsNumLabel
                    number={friendRequestsNumber}
                    backColor={COLORS.skyBlue}
                    right={-2}
                    top={-2}
                  />
                  <Image
                    source={IMAGES.friendRequest}
                    style={{ height: IconSize, width: IconSize, marginTop: 1 }}
                  />
                </>
              ) : (
                <>
                  <Image
                    source={IMAGES.friendRequest}
                    style={{
                      height: IconSize,
                      width: IconSize,
                      tintColor: COLORS.primary,
                      marginTop: 1,
                    }}
                  />
                </>
              ),
          }}
          name="FriendReqStack"
          component={FriendReqStack}
        />

        <Tab.Screen
          options={({ route }) => ({
            tabBarLabel: t("Videos"),
            tabBarIcon: ({ focused, color, size }) =>
              !focused
                ? ICONS.entypo("folder-video", COLORS.black, IconSize)
                : ICONS.entypo("folder-video", COLORS.primary, IconSize),
            lazy: true,
          })}
          name="VideoScreen"
          component={VideoScreen}
        />
        <Tab.Screen
          options={{
            tabBarLabel: t("Notifications"),
            tabBarIcon: ({ focused, color, size }) =>
              !focused ? (
                <>
                  <NotsNumLabel number={numOfNots} />
                  {ICONS.ionIcons("notifications", COLORS.black, IconSize)}
                </>
              ) : (
                <>{ICONS.ionIcons("notifications", COLORS.primary, IconSize)}</>
              ),
          }}
          name="Notifications"
          component={NotificationStack}
        />
        <Tab.Screen
          options={{
            tabBarLabel: t("Menu"),
            tabBarIcon: ({ focused, color, size }) =>
              !focused
                ? ICONS.ionIcons("menu", COLORS.black, IconSize)
                : ICONS.ionIcons("menu", COLORS.primary, IconSize),
          }}
          name="Settings"
          component={SettingsStack}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default MyTopTabs;
