import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useTranslation } from "react-i18next";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";

const TopTabs = ({ handleTabPress }) => {
  const { t } = useTranslation();

  const [focusedTabIndex, setFocusedTabIndex] = useState(0);
  const tabNames = [
    t("Explore"),
    t("Responded"),
    t("Invitations"),
    t("My Events"),
  ];

  const labelStyle = (index) => {
    return {
      fontWeight: "bold",
      color: index === focusedTabIndex ? "white" : "black",
    };
  };

  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.primary : COLORS.tooLightGrey,
    };
  };

  const onTabPress = (index) => {
    handleTabPress(index);
    setFocusedTabIndex(index);
  };

  return (
    <View style={styles.container}>
      {tabNames.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onTabPress(index)}
          style={[styles.tabBullet, tabBulletStyle(index)]}
        >
          <Text style={labelStyle(index)}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: WP(3),
    justifyContent: "space-between",
  },

  tabBullet: {
    padding: WP(2),
    borderRadius: WP(6),
    backgroundColor: COLORS.grey,
  },
});

export default TopTabs;
