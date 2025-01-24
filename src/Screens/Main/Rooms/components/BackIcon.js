import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { getHeight } from "../../../../../Utils/NewResponsive";
import { useNavigation } from "@react-navigation/native";
import { WP } from "../../../../../Utils/Resposive";
import { ICONS } from "../../../../Constants/Icons";

const BackIcon = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButtonWrapper}
      onPress={() => navigation.goBack()}
    >
      {ICONS.antDesign("arrowleft", null, getHeight(3.5))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonWrapper: {
    backgroundColor: "rgba(150, 150, 150, 0.7)",
    height: getHeight(4.5),
    width: getHeight(4.5),
    borderRadius: getHeight(4),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: getHeight(7),
    left: WP(3),
  },
});
export default BackIcon;
