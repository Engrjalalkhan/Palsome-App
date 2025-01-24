import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const ImageCrossIcon = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.imgcrossWrap} onPress={onPress}>
      {ICONS.fontAwesome("close", COLORS.white, WP(4.5))}
    </TouchableOpacity>
  );
};

export default ImageCrossIcon;

const styles = StyleSheet.create({
  imgcrossWrap: {
    position: "absolute",
    elevation: 100,
    zIndex: 100,
    height: WP(6),
    width: WP(6),
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: COLORS.red,
    borderRadius: WP(6),
    top: WP(2.5),
    justifyContent: "center",
    alignItems: "center",
    left: WP(3.5),
  },
});
