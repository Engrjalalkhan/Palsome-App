import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import TopBar from "../../../../Components/TopBar";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { HP, WP } from "../../../../../Utils/Resposive";
import { isRTL } from "../../../../../Utils/IsRTL";
import { ActivityIndicator } from "react-native";

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
      <View>
        <TopBar title="Palsome" />
      </View>
      {creatingItem ? (
        <View style={styles.createItemContainer}>
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Creating Reminder...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        </View>
      ) : null}
      {updatingItem ? (
        <View style={styles.createItemContainer}>
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Updating Reminder...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        </View>
      ) : null}
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
        {home ? (
          <View style={styles.reminderTextContainer}>
            {ICONS.materialCommunityIcons(
              "bell-ring-outline",
              COLORS.primary,
              30
            )}
            <Text style={styles.title}>{t("Reminders")}</Text>
          </View>
        ) : (
          <Text style={styles.title}>{t(title)}</Text>
        )}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    paddingHorizontal: 10,
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
