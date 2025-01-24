import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";

const TabBar = ({ selectedTab, setSelectedTab }) => {
  const scRef = useRef(null);
  const { t } = useTranslation();

  const tabNames = [
    { title: t("All Saved Items") },
    { title: t("My Collections") },
  ];

  const labelStyle = (index) => {
    return {
      marginTop: 5,
      fontWeight: "bold",
      color: selectedTab === index ? "white" : "black",
    };
  };

  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        selectedTab === index ? COLORS.primary : COLORS.tooLightGrey,
    };
  };

  const onTabPress = (index) => {
    setSelectedTab(index);
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
          <Pressable
            key={index}
            onPress={() => onTabPress(index, item.title)}
            style={[styles.tabBullet, tabBulletStyle(index)]}
          >
            <Text style={labelStyle(index)}>{t(item.title)}</Text>
            <View style={[styles.tabBullet, tabBulletStyle(index)]} />
          </Pressable>
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
