import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { useTranslation } from "react-i18next";

import { COLORS } from "../../../../Constants/Colors";

const ViewGroupTab = ({
  onMemberPressed,
  onVideosPressed,
  onAlbumsPressed,
  onHomePressed,
  onMentorshipPressed,
  onSettingsPressed,
  isAdmin,
  onMuseumPressed,
  onGalleryPressed,
  focusMembers,
}) => {
  const { t } = useTranslation();

  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const scRef = useRef(null);
  const tabNames = [
    { title: t("Home") },
    { title: t("Albums") },
    { title: t("Videos") },
    // { title: "Mentorship" },
    { title: t("Group Members") },
    { title: t("Museum") },
    { title: t("Gallery") },
  ];

  useEffect(() => {
    if (focusMembers) onTabPress(3);
  }, [focusMembers]);

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
      // onMentorshipPressed();
      onMemberPressed();
    } else if (index === 4) {
      // onMemberPressed();
      // onSettingsPressed();
      onMuseumPressed();
    } else if (index === 5) {
      // onSettingsPressed();
      onGalleryPressed();
    } else if (index === 6) {
      onSettingsPressed();
    }
    scRef.current.scrollTo({
      x: index * WP(20),
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

export default ViewGroupTab;
