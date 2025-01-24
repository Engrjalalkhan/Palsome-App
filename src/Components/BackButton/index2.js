import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { IMAGES } from "../../Constants/Images";
import { isRTL } from "../../../Utils/IsRTL";

export default function BackButtonTwo({ goBack, outerStyle, tintColor }) {
  return (
    <TouchableOpacity onPress={goBack} style={[outerStyle, styles.container]}>
      {isRTL ? (
        <Image
          style={[
            styles.image,
            tintColor,
            { height: 35, width: 35, resizeMode: "contain" },
          ]}
          source={IMAGES.rightArrow}
        />
      ) : (
        <Image style={[styles.image, tintColor]} source={IMAGES.leftArrow} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 5 },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    // backgroundColor: "black"
  },
});
