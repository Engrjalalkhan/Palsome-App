import React from "react";
import { useTranslation } from "react-i18next";

import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import Header from "../../../../../Components/Header";
import { IMAGES } from "../../../../../Constants/Images";
import { HP, WP } from "../../../../../../Utils/Resposive";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";
import { isRTL } from "../../../../../../Utils/IsRTL";

const BuyNsellHeader = ({ onPressBack, isCreateItem, setIsCreateItem }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          onPressBack();
        }}
      >
        <Image
          source={IMAGES.backIcon}
          style={[
            styles.backIcon,
            { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
          ]}
        />
      </TouchableOpacity>
      <View style={styles.headerSubContainer}>
        <Image source={IMAGES.buyNsell} style={styles.buyNsellLogo} />
        <Header>{t("buyNsell")}</Header>
      </View>

      <View style={[styles.addIcon, { height: getHeight(3.5) }]}></View>
      <TouchableOpacity
        onPress={() => {
          setIsCreateItem(true);
        }}
      >
        <Image
          source={IMAGES.add}
          style={[styles.addIcon, { marginLeft: 10 }]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BuyNsellHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(65),
    justifyContent: "center",
    paddingLeft: 25,
  },
  addIcon: {
    height: HP(4),
    width: WP(8),
    resizeMode: "contain",
  },
  buyNsellLogo: {
    height: getHeight(6),
    width: getWidth(8),
    resizeMode: "contain",
    margin: 5,
    marginTop: 8,
  },
  backIcon: {
    height: HP(3),
    resizeMode: "contain",
  },
});
