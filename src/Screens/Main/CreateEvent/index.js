import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Button,
  FlatList,
  LogBox,
  ScrollView,
} from "react-native";

import { Text } from "react-native-paper";
//import Button from "../../../Components/Button";

import MyActivityHeader from "../../../Components/MyActivityHeader";

import styles from "./styles";
import { theme } from "../../../Core/theme";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

export const result = [
  {
    id: "1",
    Image: IMAGES.illustration,
    Members: "Test Event",
  },
  {
    id: "2",
    Image: IMAGES.illustration,
    Members: "Baking Classes",
  },
  {
    id: "3",
    Image: IMAGES.illustration,
    Members: "Test Event",
  },
  {
    id: "4",
    Image: IMAGES.illustration,
    Members: "Baking Classes",
  },
];
const CreateEvents = ({ navigation }) => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
      <MyActivityHeader
        ButtonText="Create new event"
        ButtonPress={() => console.log("pressed")}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 10,
          marginBottom: 13,
        }}
      >
        <TouchableOpacity style={styles.button_outlook}>
          <Text style={styles.button_text}>My Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_outlook}>
          <Text style={styles.button_text}>Public Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_outlook}>
          <Text style={styles.button_text}>Invited Events</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "400" }}>
            Recommended Events
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: COLORS.pictonBlue,
              marginTop: 6,
              // marginRight: 5,
            }}
          >
            Show all
          </Text>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={result}
          numColumns={2}
          keyExtractor={(result) => result.id}
          renderItem={({ item }) => {
            return (
              <View style={[styles.box, { marginTop: 10 }]}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image style={styles.image} source={item.Image} />
                  <Text
                    style={{
                      color: COLORS.white,
                      marginTop: 7,
                      justifyContent: "center",
                    }}
                  >
                    {item.Members}
                  </Text>
                </View>
                <View style={styles.card_icons_view}>
                  {ICONS.fontAwesome(
                    "calendar",
                    COLORS.black,
                    20,
                    styles.card_icon_style
                  )}
                  <Text
                    style={{
                      marginRight: 10,
                      marginLeft: 15,
                      textAlign: "center",
                    }}
                  >
                    2021-02-02 21:20:00
                  </Text>
                </View>
                <View style={styles.card_icons_view2}>
                  {ICONS.materialCommunityIcons(
                    "map-marker",
                    COLORS.black,
                    24,
                    styles.card_icon_style
                  )}
                  <Text
                    style={{
                      marginRight: 10,
                      marginLeft: 15,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    Lahore, Pakistan
                  </Text>
                </View>
                {/*  */}
              </View>
            );
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "400" }}>
            Popular Events
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: COLORS.pictonBlue,
              marginTop: 8,
            }}
          >
            Show all
          </Text>
        </View>
        <FlatList
          //refreshing={props.refreshing}
          //onRefresh={props.onRefresh}
          showsVerticalScrollIndicator={false}
          data={result}
          numColumns={2}
          keyExtractor={(result) => result.id}
          renderItem={({ item }) => {
            return (
              <View style={[styles.box, { marginTop: 10, marginBottom: 10 }]}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Image style={styles.image} source={item.Image} />
                  <Text
                    style={{
                      color: COLORS.white,
                      marginTop: 7,
                      justifyContent: "center",
                    }}
                  >
                    {item.Members}
                  </Text>
                </View>
                <View style={styles.card_icons_view}>
                  {ICONS.fontAwesome(
                    "calendar",
                    COLORS.black,
                    20,
                    styles.card_icon_style
                  )}
                  <Text
                    style={{
                      marginRight: 10,
                      marginLeft: 15,
                      textAlign: "center",
                    }}
                  >
                    2021-02-02 21:20:00
                  </Text>
                </View>
                <View style={styles.card_icons_view2}>
                  {ICONS.fontAwesome(
                    "map-marker",
                    COLORS.black,
                    24,
                    styles.card_icon_style
                  )}

                  <Text
                    style={{
                      marginRight: 10,
                      marginLeft: 15,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    Lahore, Pakistan
                  </Text>
                </View>
                {/*  */}
              </View>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateEvents;
