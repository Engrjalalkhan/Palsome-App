import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";

import { WP } from "../../../../Utils/Resposive";
import { isRTL } from "../../../../Utils/IsRTL";

const ChatHeader = ({ openDrawer, newChatAction }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleback = () => {
    newChatAction();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {ICONS.antDesign(
          isRTL ? "arrowright" : "arrowleft",

          COLORS.white,
          35,
          styles.backBtn,
          handleback
        )}

        <Text style={styles.titleText}>{t("Palsome AI")}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {ICONS.antDesign(
          "pluscircle",
          COLORS.white,
          25,
          styles.backBtn,
          newChatAction
        )}
        {ICONS.fontAwesome(
          "bars",
          COLORS.white,
          25,
          styles.backBtn,
          openDrawer
        )}
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },

  textContainer: {
    flex: 0.8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  backBtn: {
    padding: WP(2),
    marginRight: WP(1),
  },

  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },

  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
