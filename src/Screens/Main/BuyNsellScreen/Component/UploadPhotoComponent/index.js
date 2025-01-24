import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { ICONS } from "../../../../../Constants/Icons";
import { COLORS } from "../../../../../Constants/Colors";
import { SITE_URL } from "../../../../../Services/Constants";
import { WP } from "../../../../../../Utils/Resposive";

const BuyNsellPhotoComponent = ({ item, deleteItem, onPressImage }) => {
  const CrossIcon = ({ onPress }) => (
    <TouchableOpacity style={styles.imgcrossWrap} onPress={onPress}>
      {ICONS.fontAwesome("close", COLORS.white, WP(4.5))}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPressImage(item)}
      >
        <CrossIcon onPress={() => deleteItem(item)} />
        <FastImage
          key={item.index}
          resizeMode="cover"
          style={styles.image}
          source={{
            uri: item?.uri ? item?.uri : SITE_URL + item.file_path,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  docContainer: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
  },
  docImage: {
    width: WP(18),
    height: WP(18),
  },
  video: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),

    borderWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
  },
  controlOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imgcrossWrap: {
    position: "absolute",
    elevation: 100,
    zIndex: 100,
    height: WP(6),
    width: WP(6),
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: COLORS.red,
    borderRadius: WP(6),
    top: WP(2),
    justifyContent: "center",
    alignItems: "center",
    left: WP(2),
  },
});
export default BuyNsellPhotoComponent;
