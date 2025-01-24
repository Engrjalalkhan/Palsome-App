import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";
import { useTranslation } from "react-i18next";

const ReelStoriesTabs = ({ selectedTab, onPressReels, onPressStories }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === "stories" && styles.selectedTab]}
        onPress={onPressStories}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "stories" && styles.selectedTabText,
          ]}
        >
          {t("Stories")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === "reels" && styles.selectedTab]}
        onPress={onPressReels}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "reels" && styles.selectedTabText,
          ]}
        >
          {t("Clips")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: WP(100),
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tab: {
    width: WP(40),
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedTab: {
    backgroundColor: COLORS.primary,
  },
  selectedTabText: {
    color: COLORS.white,
  },
});
export default React.memo(ReelStoriesTabs);
