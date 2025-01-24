import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  FlatList,
  LogBox,
  ScrollView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Text } from "react-native-paper";

import styles from "./styles";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
const Rooms = ({ navigation }) => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <SafeAreaView
      style={{
        height: hp(90),
        width: wp(95),
        alignSelf: "center",
        justifyContent: "center",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: hp(3) }}>
          <View style={styles.roomStyle}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Rooms</Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                see more
              </Text>
            </TouchableOpacity>
          </View>
          {/* <NewsfComponent /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Rooms;
