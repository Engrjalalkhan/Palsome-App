import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { WP } from "../../../../../Utils/Resposive";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../../../../Constants/Colors";

const TopTabs = ({
  onExplorePress,
  buyNsell,
  onPressMyListing,
  yourListing,
  onPressYourAds,
  onPressDrafts,
  onPressFavorite,
}) => {
  const { t } = useTranslation();
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const scRef = useRef(null);
  const isFocused = useIsFocused();
  const tabNames = [{ title: t("Explore") }, { title: t("My Listings") }];
  const yourListingTabs = [
    { title: t("My Ads") },
    { title: t("Drafts") },
    { title: t("Favorites") },
  ];

  const labelStyle = (index) => {
    return {
      marginTop: 5,
      fontWeight: "bold",
      color: index === focusedTabIndex ? "white" : "black",
    };
  };
  // const tabBulletStyle = (index) => {
  //   return {
  //     backgroundColor: index === focusedTabIndex ? COLORS.primary : COLORS.tooLightGrey,
  //   };
  // };

  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.primary : COLORS.tooLightGrey,
    };
  };

  const onTabPress = (index) => {
    setFocusedTabIndex(index);
    if (yourListing) {
      if (index === 0) {
        onPressYourAds();
      } else if (index === 1) {
        onPressDrafts();
      } else {
        onPressFavorite();
      }
    } else if (index === 0) {
      onExplorePress();
    } else {
      onPressMyListing();
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
        {yourListing
          ? yourListingTabs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onTabPress(index)}
                style={[styles.tabBullet, tabBulletStyle(index)]}
              >
                <Text style={labelStyle(index)}>{item.title}</Text>
                <View style={[styles.tabBullet, tabBulletStyle(index)]} />
              </TouchableOpacity>
            ))
          : tabNames.map((item, index) => (
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
