import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../../../../Constants/Colors";
import { useTranslation } from "react-i18next";

const ViewRoomTabs = ({
  onHomePressed,
  onVideosPressed,
  onAlbumsPressed,
  onMemberPressed,
  onMuseumPressed,
  onGalleryPressed,
  onSettingsPressed,
  isAdmin,
}) => {
  const { t } = useTranslation();

  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const scRef = useRef(null);
  const isFocused = useIsFocused();
  const tabNames = [
    { title: t("Home") },
    { title: t("Albums") },
    { title: t("Videos") },
    { title: t("Members") },
    { title: t("Museum") },
    { title: t("Gallery") },
  ];

  const labelStyle = (index) => {
    return {
      marginTop: 5,
      fontWeight: "bold",
      color: index === focusedTabIndex ? COLORS.white : COLORS.black,
    };
  };
  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.pictonBlue : COLORS.tooLightGrey,
    };
  };

  const onTabPress = (index) => {
    setFocusedTabIndex(index);
    if (index === 0) {
      onHomePressed();
    } else if (index === 1) {
      onAlbumsPressed();
    } else if (index === 2) {
      onVideosPressed();
    } else if (index === 3) {
      onMemberPressed();
    } else if (index === 4) {
      onMuseumPressed();
    } else if (index === 5) {
      onGalleryPressed();
    } else {
      onSettingsPressed();
    }
    scRef.current.scrollTo({
      x: index * WP(50),
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scRef}>
        {tabNames.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTabPress(index)}
            style={[styles.tabBullet, tabBulletStyle(index)]}
          >
            <Text style={labelStyle(index)}>{item?.title}</Text>
            <View style={[styles.tabBullet, tabBulletStyle(index)]} />
          </TouchableOpacity>
        ))}
        {isAdmin && (
          <TouchableOpacity
            onPress={() => onTabPress(6)}
            style={[styles.tabBullet, tabBulletStyle(6)]}
          >
            <Text style={labelStyle(6)}>{t("Settings")}</Text>
            <View style={[styles.tabBullet, tabBulletStyle(6)]} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, marginHorizontal: 4 },
  tabBullet: {
    backgroundColor: COLORS.grey,
    paddingVertical: WP(1),
    paddingHorizontal: WP(3),
    borderRadius: WP(10),
    marginHorizontal: WP(2.2),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ViewRoomTabs;
