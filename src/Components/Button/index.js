import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../../Core/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

export default function Button({
  mode,
  style,
  icon,
  labelStyle,
  disabled = false,
  ...props
}) {
  return (
    <PaperButton
      disabled={disabled}
      style={[
        style === "small"
          ? styles.smallButtonContainer
          : style === "medium"
          ? styles.mediumButtonContainer
          : styles.largeButtonContainer,
        mode === "outlined" && { backgroundColor: theme.colors.surface },
      ]}
      labelStyle={[
        labelStyle === "small"
          ? styles.textSmall
          : labelStyle === "tosmall"
          ? styles.toosmalltext
          : styles.text,
      ]}
      mode={mode}
      icon={() => ICONS.ionIcons(icon, null, 20, styles.smallButtonIcon)}
      color={COLORS.primary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  largeButtonContainer: {
    width: "100%",
    marginVertical: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
  },
  mediumButtonContainer: {
    marginTop: 20,
    width: "46%",
    backgroundColor: COLORS.primary,
  },
  smallButtonContainer: {
    backgroundColor: COLORS.primary,

    // marginBottom: widthPercentageToDP("1"),
    // width: widthPercentageToDP("28"),
    // height: heightPercentageToDP("4.1"),
  },
  text: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  textSmall: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: widthPercentageToDP("6"),
  },
  toosmalltext: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: widthPercentageToDP("6"),
  },
  smallButtonIcon: {
    color: COLORS.white,
    marginLeft: widthPercentageToDP("2"),
  },
});
