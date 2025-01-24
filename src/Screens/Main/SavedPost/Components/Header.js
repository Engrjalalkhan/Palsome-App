import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import TopBar from "../../../../Components/TopBar";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { HP, WP } from "../../../../../Utils/Resposive";
import { isRTL } from "../../../../../Utils/IsRTL";
import { getWidth } from "../../../../../Utils/NewResponsive";

const Header = ({
  onPressBack,
  onPressAddItem,
  addIcon,
  home,
  title,
  creatingItem,
  updatingItem,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <StatusBar backgroundColor={COLORS.primary} />
      <TopBar title="Palsome" />
      {creatingItem && (
        <View style={styles.createItemContainer}>
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Creating Reminder...")}</Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        </View>
      )}
      {updatingItem && (
        <View style={styles.createItemContainer}>
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Updating Reminder...")}</Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        </View>
      )}
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressBack}>
          <Image
            style={[
              styles.backIcon,
              { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
            ]}
            source={IMAGES.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {home ? t("Saved") : t(title)}
          </Text>
        </View>
        {addIcon ? (
          <TouchableOpacity onPress={onPressAddItem}>
            <Image source={IMAGES.add} style={styles.addIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.addIconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.backgroundColor,
  },
  container: {
    marginTop: 20,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createItemContainer: {
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    paddingHorizontal: 10,
    maxWidth: getWidth(90),
    textAlign: "center", // Center align the text
  },
  reminderTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addIcon: {
    width: WP(8),
    height: HP(4),
    resizeMode: "contain",
  },
  addIconPlaceholder: {
    width: WP(8),
    height: HP(4),
  },
  backIcon: {
    height: HP(3),
    resizeMode: "contain",
  },
  loading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
  },
  txt: {
    color: COLORS.white,
    fontSize: 15,
  },
});

export default Header;
