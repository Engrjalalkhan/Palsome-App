import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "../Header";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import { ICONS } from "../../Constants/Icons";
import { isRTL } from "../../../Utils/IsRTL";

export default function MyHeader(props) {
  const navigation = useNavigation();
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center" }, props.outerStyle]}
    >
      <TouchableOpacity
        // onPress={props.goBack}
        onPress={() => navigation.goBack()}
        style={styles.imageContainer}
      >
        {isRTL ? (
          <Image
            style={{ resizeMode: "contain", height: 35, width: 35 }}
            source={IMAGES.rightArrow}
          />
        ) : (
          <Image style={{ resizeMode: "contain" }} source={IMAGES.leftArrow} />
        )}
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Header>{props.heading}</Header>
      </View>
      <View style={{ width: WP(15) }}>
        {props?.rightIconName && (
          <TouchableOpacity
            onPress={props?.onPressRight}
            disabled={props?.disabled}
            style={styles.iconContainer}
          >
            {ICONS.entypo(
              props?.rightIconName,
              props.disabled ? COLORS.maroonBrown : COLORS.primary,
              WP(7)
            )}
          </TouchableOpacity>
        )}
        {props?.rightIconNameMuseum && (
          <TouchableOpacity
            onPress={props?.onPressRightIconFiler}
            disabled={props?.disabled}
            style={styles.iconContainer}
          >
            {ICONS.materialCommunityIcons(
              props?.rightIconNameMuseum,
              props.disabled ? COLORS.maroonBrown : COLORS.primary,
              WP(7)
            )}
          </TouchableOpacity>
        )}
        {props?.clipUpload && (
          <TouchableOpacity
            onPress={props?.onPressClipUpload}
            disabled={props?.disabled}
            style={styles.iconContainer}
          >
            <Image source={IMAGES.add} style={styles.addIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: WP(2),
    justifyContent: "center",
    alignItems: "center",
    width: WP(15),
  },

  addIcon: {
    height: HP(3),
    width: WP(7),
    resizeMode: "contain",
  },
});
