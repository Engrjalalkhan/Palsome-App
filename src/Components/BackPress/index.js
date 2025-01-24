import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ICONS } from "../../Constants/Icons";
import { getHeight } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { Image } from "react-native";
import { IMAGES } from "../../Constants/Images";

const BackPress = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButtonWrapper}
      onPress={() => navigation.goBack()}
    >
      {/* {ICONS.antDesign("arrowleft", null, getHeight(3.5))} */}
      <Image source={IMAGES.backIcon} style={styles.backIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButtonWrapper: {
    // backgroundColor: "rgba(150, 150, 150, 0.7)",
    height: getHeight(4.5),
    width: getHeight(4.5),
    borderRadius: getHeight(4),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: getHeight(6),
    left: WP(3),
  },
  backIcon: {
    marginTop: HP(1),
    height: HP(3),
    resizeMode: "contain",
  },
});
export default BackPress;
