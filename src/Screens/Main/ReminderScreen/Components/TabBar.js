import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";

const TabBar = ({ selectedTab, setSelectedTab }) => {
  const scRef = useRef(null);
  const { t } = useTranslation();

  const tabNames = [
    { title: t("Reminders") },
    { title: t("Completed Reminders") },
    { title: t("Friends Reminders") },
  ];

  const labelStyle = (tabName) => {
    return {
      marginTop: 5,
      fontWeight: "bold",
      color: selectedTab === tabName ? "white" : "black",
    };
  };

  const tabBulletStyle = (tabName) => {
    return {
      backgroundColor:
        selectedTab === tabName ? COLORS.primary : COLORS.tooLightGrey,
    };
  };

  const onTabPress = (index, item) => {
    setSelectedTab(item);
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
            onPress={() => onTabPress(index, item.title)}
            style={[styles.tabBullet, tabBulletStyle(t(item?.title))]}
          >
            <Text style={labelStyle(t(item?.title))}>{t(item.title)}</Text>
            <View style={[styles.tabBullet, tabBulletStyle(t(item?.title))]} />
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

export default TabBar;
