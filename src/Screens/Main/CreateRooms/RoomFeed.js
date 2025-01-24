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
import FastImage from "react-native-fast-image";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

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
const RoomFeed = ({ navigation }) => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  const Tab = createMaterialTopTabNavigator();

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
        <View style={{ marginTop: hp(2) }}>
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
          <FlatList
            //refreshing={props.refreshing}
            //onRefresh={props.onRefresh}
            showsHorizontalScrollIndicator={false}
            data={result}
            horizontal
            pagingEnabled
            // numColumns={2}
            keyExtractor={(result) => result.id}
            renderItem={({ item }) => {
              return (
                <View style={styles.box}>
                  <FastImage source={item.Image} style={styles.imageStyle}>
                    <TouchableOpacity style={styles.ButtonStyle}>
                      {ICONS.materialCommunityIcons(
                        "dots-vertical",
                        COLORS.grey,
                        24
                      )}
                    </TouchableOpacity>
                  </FastImage>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "red",
                      marginVertical: hp(1),
                      width: wp(37),
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontWeight: "400",
                        fontSize: 14,
                      }}
                    >
                      {item.Members}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
          <View style={styles.roomStyle}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Joined Rooms
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
              >
                see more
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            //refreshing={props.refreshing}
            //onRefresh={props.onRefresh}
            showsHorizontalScrollIndicator={false}
            data={resultSecond}
            pagingEnabled
            horizontal
            // numColumns={2}
            keyExtractor={(result) => result.id}
            renderItem={({ item }) => {
              return (
                <View style={styles.box}>
                  <FastImage source={item.Image} style={styles.imageStyle}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.white,
                        width: wp(8),
                        height: hp(4),
                        borderRadius: 18,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "flex-end",
                        marginRight: wp(1.7),
                        marginTop: hp(1.2),
                        // padding:4,
                      }}
                    >
                      {ICONS.materialCommunityIcons(
                        "dots-vertical",
                        COLORS.grey,
                        24
                      )}
                    </TouchableOpacity>
                  </FastImage>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      // backgroundColor: "red",
                      marginVertical: hp(1),
                      width: wp(37),
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontWeight: "400",
                        fontSize: 14,
                      }}
                    >
                      {item.Members}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RoomFeed;
