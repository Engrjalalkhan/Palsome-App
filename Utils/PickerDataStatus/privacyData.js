import React, { useCallback, useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getHeight, getWidth } from "../NewResponsive";
import { ICONS } from "../../src/Constants/Icons";

export const privacyData = [
  { id: 1, title: "Public", value: "public" },
  {
    id: 2,
    title: "Friends",
    value: "friends_only",
  },
  {
    id: 3,
    title: "Only Me",
    value: "only_me",
  },
  {
    id: 4,
    title: "Specific Friends",
    value: "specific_friends",
  },
];
export const privacyDataSettings = [
  { id: 1, title: "Public", value: "public" },
  {
    id: 2,
    title: "Friends",
    value: "friends_only",
  },
  {
    id: 3,
    title: "Only Me",
    value: "only_me",
  },
  {
    id: 4,
    title: "Specific Friends",
    value: "specific_friends",
  },
];

export const tags = (id) => {
  if (id == 1) {
    return "General";
  } else if (id == 2) {
    return "Religious";
  } else if (id == 3) {
    return "Political";
  } else if (id == 4) {
    return "Social";
  } else if (id == 5) {
    return "Educational";
  }
};

export const privacy = (data, color = "black", style = {}) => {
  if (data == "public") {
    return (
      <View style={styles.txt}>
        {ICONS.fontAwesome5("globe-africa", color, 12)}
      </View>
    );
  } else if (data == "only_me") {
    return (
      <View style={styles.txt2}>
        {ICONS.fontAwesome5("user-alt", color, 12)}
      </View>
    );
  } else if (data == "friends_only") {
    return (
      <View style={styles.txt3}>{ICONS.fontAwesome5("users", color, 12)}</View>
    );
  } else if (data == "specific_friends") {
    return (
      <View style={styles.txt3}>
        {ICONS.fontAwesome5("user-friends", color, 12)}
      </View>
    );
  } else if (data == "private") {
    return (
      <View style={[styles.txt3, { borderWidth: 0 }]}>
        {ICONS.fontAwesome5("lock", color, 12)}
      </View>
    );
  }
};

export const privacyNewPost = (data, color = "black", newPostModel) => {
  if (data == "public") {
    return ICONS.fontAwesome5(
      "globe-africa",
      { color },
      12,
      styles.newPostIcon
    );
  } else if (data == "only_me") {
    return ICONS.fontAwesome5("user-alt", { color }, 12, styles.newPostIcon);
  } else if (data == "friends_only") {
    return ICONS.fontAwesome5("users", null, 12, styles.newPostIcon);
  } else if (data == "specific_friends") {
    return ICONS.fontAwesome5("user-friends", null, 12, styles.newPostIcon);
  }
};

export const tagsData = [
  { id: 1, title: "General", value: "1" },
  {
    id: 2,
    title: "Religious",
    value: "2",
  },
  {
    id: 3,
    title: "Political",
    value: "3",
  },
  {
    id: 4,
    title: "Social",
    value: "4",
  },
  {
    id: 5,
    title: "Educational",
    value: "5",
  },
];

const styles = StyleSheet.create({
  txt: {
    left: getWidth(1.3),
    justifyContent: "center",
    marginBottom: 6,
  },
  txt2: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    left: getWidth(1.5),
  },
  txt3: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    left: getWidth(1.5),
  },
  newPostIcon: { alignSelf: "center" },
});
