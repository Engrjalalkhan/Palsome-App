import React, { useState, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import { WP } from "../../../../../Utils/Resposive";

import { COLORS } from "../../../../Constants/Colors";

const TopTabs = ({
  albums,
  setSelectedTab,
  onAlbumsPressed,
  onPhotosPressed,
}) => {
  const scRef = useRef(null);
  const { t } = useTranslation();

  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const tabNames = [
    { title: t("Explore") },
    { title: t("Feed") },
    { title: t("Invitations") },
    { title: t("Pending Approval") },
    { title: t("Joined Groups") },
    { title: t("My Groups") },
  ];

  const tabNames2 = [{ title: t("Albums") }, { title: t("Photos") }];

  const labelStyle = (index) => {
    return {
      marginTop: 5,
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
    !albums && setSelectedTab(index);
    albums && index === 0 && onAlbumsPressed();
    albums && index === 1 && onPhotosPressed();
    setFocusedTabIndex(index);
    scRef.current.scrollTo({
      x: index * WP(20),
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scRef}>
        {(albums ? tabNames2 : tabNames).map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTabPress(index)}
            style={[styles.tabBullet, tabBulletStyle(index)]}
          >
            <Text style={labelStyle(index)}>{item.title}</Text>
            <View style={[styles.tabBullet, tabBulletStyle(index)]} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, marginHorizontal: 4 },
  tabBullet: {
    backgroundColor: COLORS.grey,
    paddingHorizontal: WP(2),
    paddingVertical: WP(1),
    borderRadius: WP(6),
    marginHorizontal: WP(2.2),
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

export default TopTabs;
