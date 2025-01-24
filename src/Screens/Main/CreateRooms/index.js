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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import { Text } from "react-native-paper";

import styles from "./styles";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Rooms from "./Rooms";
import RoomFeed from "./RoomFeed";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";


export const result = [
  {
    id: "1",
    Image: IMAGES.room1,
    Members: "2 Members",
  },
  {
    id: "2",
    Image: IMAGES.room2,
    Members: "3 Memebers",
  },
  {
    id: "3",
    Image: IMAGES.room3,
    Members: "2 Members",
  },
  {
    id: "4",
    Image: IMAGES.room4,
    Members: "3 Memebers",
  },
];

export const resultSecond = [
  {
    id: "2",
    Image: IMAGES.room3,
    Members: "2 Members",
  },
  {
    id: "1",
    Image: IMAGES.room5,
    Members: "3 Memebers",
  },
  {
    id: "4",
    Image: IMAGES.room2,
    Members: "2 Members",
  },
  {
    id: "3",
    Image: IMAGES.room1,
    Members: "3 Memebers",
  },
];

const CreateRoom = ({ navigation }) => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView
      style={{
        height: hp(90),
        width: wp(100),
      }}
    >
      <View style={{ overflow: "hidden", paddingBottom: 5 }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            width: wp(100),
            height: 60,
            shadowColor: COLORS.black,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.32,
            shadowRadius: 4,
            elevation: 9,
          }}
        >
          <View
            style={{
              width: wp(100),
              height: hp(8),
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              shadowColor: COLORS.black,
              shadowOffset: {
                width: 0,
                height: 2,
              },
            }}
          >
            <TouchableOpacity style={{ paddingLeft: wp(1) }}>
              <Ionicons name="chevron-back-outline" size={30} color={COLORS.black} />
            </TouchableOpacity>
            <View
              style={{
                width: wp(84),
                height: hp(6),
                // alignSelf: "flex-end",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                marginRight: wp(2),
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                Room Feed{" "}
              </Text>
              <TouchableOpacity>
                <AntDesign name="pluscircle" color={COLORS.primary} size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.tabStyle}>
        <Tab.Navigator
          initialRouteName="RoomFeed"
          tabBarOptions={{
            activeTintColor: COLORS.primary,
            inactiveTintColor: COLORS.tooLightGrey,
            indicatorStyle: {
              backgroundColor: COLORS.primary,
              height: hp(0.5),
              fontFamily: "Roboto-Regular",
              fontWeight: "900",
            },

            labelStyle: {
              fontSize: 14,
              fontFamily: "Nunito-Bold",
              textTransform: "none",
            },
          }}
        >
          <Tab.Screen
            name="Room Feed"
            component={Rooms}
            options={{ tabBarLabel: "Room Feed" }}
          />
          <Tab.Screen
            name="Rooms"
            component={RoomFeed}
            options={{ tabBarLabel: "Rooms" }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};
export default CreateRoom;
