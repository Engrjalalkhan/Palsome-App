import { View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { HP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../Services/Constants";

const SingleImage = (uri) => {
  return (
    <View style={{ flex: 1 }}>
      <FastImage
        resizeMode="contain"
        style={{
          width: WidthScreen * 0.9,
          height: HP(35),

          marginRight: 20,
        }}
        source={{
          uri: SITE_URL + uri,
        }}
      />
    </View>
  );
};

export default SingleImage;
