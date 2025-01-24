import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { Image } from "react-native";
import { TextInput } from "react-native";
import { StyleSheet, View } from "react-native";

import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";
import { HP, WP } from "../../../../../../Utils/Resposive";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";

const BuyNSellSearchComponent = ({ setSearchText }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(e) => {
          setSearchText(e);
        }}
        placeholder={t("Search Ad")}
        placeholderTextColor={COLORS.tooDarkGrey}
      />
      <Image
        source={IMAGES.searchIcon}
        style={[styles.addIcon, { height: getHeight(3.5) }]}
      />
    </View>
  );
};

export default memo(BuyNSellSearchComponent);

const styles = StyleSheet.create({
  input: {
    height: 45,
    marginVertical: 6,
    padding: 10,
    width: getWidth(82),
    borderRadius: 10,
    right: 6,
    paddingRight: 50,
    backgroundColor: COLORS.cocoGrey,
  },

  addIcon: {
    height: HP(3),
    width: WP(5),
    resizeMode: "contain",
    right: 45,
    tintColor: COLORS.grey,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(85),
  },
});
