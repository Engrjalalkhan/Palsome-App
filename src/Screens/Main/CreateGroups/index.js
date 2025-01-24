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

import { Text } from "react-native-paper";
import Button from "../../../Components/Button";

import MyActivityHeader from "../../../Components/MyActivityHeader";

import styles from "./styles";
import { getWidth } from "../../../../Utils/NewResponsive";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

export const result = [
  {
    id: "1",
    Image: IMAGES.illustration,
    Members: "Muhammad Adell-New Group",
  },
  {
    id: "2",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
  {
    id: "3",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
  {
    id: "4",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
  {
    id: "5",
    Image: IMAGES.illustration,
    Members: "Muhammad Adell-New Group",
  },
  {
    id: "6",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
  {
    id: "7",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
  {
    id: "8",
    Image: IMAGES.illustration,
    Members: "3 Memebers",
  },
];
export const DATA = [
  { id: "1", name: "For You" },
  { id: "2", name: "Explore" },
  { id: "3", name: "Invitations" },
  { id: "4", name: "Pending approval" },
  { id: "5", name: "Joind groups" },
  { id: "6", name: "My groups" },
];

const CreateGroups = ({ navigation }) => {
  const [selectedCatgory, setSelectedCatgory] = useState(1);
  const ButtonPress = () => {
    navigation.navigate("CreateGroup");
  };
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, marginLeft: 15, marginRight: "8%" }}>
      <MyActivityHeader
        ButtonText="Create new Group"
        ButtonPress={ButtonPress}
      />
      <FlatList
        data={DATA}
        horizontal={true}
        style={{
          height: 30,
        }}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ padding: 10 }}></View>}
        keyExtractor={(DATA) => DATA.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={
                selectedCatgory == item.id
                  ? styles.active
                  : { alignItems: "center" }
              }
              onPress={() => setSelectedCatgory(item.id)}
            >
              <Text
                style={
                  selectedCatgory == item.id
                    ? styles.activeText
                    : styles.simpleText
                }
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={result}
        contentContainerStyle={{ paddingBottom: 10 }}
        numColumns={2}
        keyExtractor={(result) => result.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.box}
              onPress={() => navigation.navigate("ShowSingleGroup")}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image style={styles.image} source={item.Image} />
                <Text
                  style={{
                    color: COLORS.white,
                    marginTop: 7,
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: 12,
                    textAlign: "center",
                    lineHeight: 15.06,
                  }}
                >
                  {item.Members}
                </Text>
                <View style={styles.card_icons_view}>
                  {ICONS.fontAwesome(
                    "smile-o",
                    COLORS.black,
                    24,
                    styles.card_icon_style
                  )}

                  {ICONS.materialCommunityIcons(
                    "message-text-outline",
                    COLORS.black,
                    24,
                    styles.card_icon_style
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};
export default CreateGroups;
