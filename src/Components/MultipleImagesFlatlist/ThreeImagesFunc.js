import { View } from "react-native";
import React from "react";

import { HP, WP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";

const ThreeImagesFunc = (uri1, uri2, uri3) => {
  return (
    <View>
      <FastImage
        resizeMode="cover"
        style={{
          width: WidthScreen * 0.9,
          height: HP(25),
          marginTop: HP(1),
        }}
        source={{
          uri: SITE_URL + uri1,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: COLORS.transparent,
          width: WidthScreen * 0.9,
        }}
      >
        <FastImage
          resizeMode="cover"
          style={{
            width: WidthScreen * 0.45,
            height: HP(20),
            marginTop: HP(1),
          }}
          source={{
            uri: SITE_URL + uri2,
          }}
        />
        <FastImage
          resizeMode="cover"
          style={{
            width: WidthScreen * 0.45,
            height: HP(20),
            marginTop: HP(1),
            marginLeft: WP(1),
          }}
          source={{
            uri: SITE_URL + uri3,
          }}
        />
      </View>
    </View>
  );
};

export default ThreeImagesFunc;
