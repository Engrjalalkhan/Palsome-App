import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";
import { IMAGES } from "../../../../../Constants/Images";
import { Image } from "react-native";
import { COLORS } from "../../../../../Constants/Colors";

const NoCreatedAdMessage = ({ titleMessage, subTitle }) => {
  return (
    <View style={styles.gridCard}>
      <Image source={IMAGES.buyNsellAd} style={{ height: 100, width: 100 }} />
      <Text style={styles.titleMessageText}>{titleMessage}</Text>
      <Text style={styles.subTitleMessageText}>{subTitle}</Text>
    </View>
  );
};

export default NoCreatedAdMessage;

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 10,
    alignItems: "center",
    width: getWidth(95),
    justifyContent: "center",
    height: getHeight(35),
  },
  titleMessageText: {
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 5,
  },
  subTitleMessageText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.cocoGrey,
  },
});
