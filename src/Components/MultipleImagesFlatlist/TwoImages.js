import { View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { FlatList } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../Services/Constants";

export const TwoImages = React.memo((props) => {
  return props.images.map((item, index) => {
    return (
      <View key={index} style={{ flex: 1 }}>
        <FastImage
          key={index}
          resizeMode="cover"
          style={{
            width: WidthScreen * 0.9,
            height: HP(25),
            marginTop: HP(1),
          }}
          source={{
            uri: SITE_URL + item,
          }}
        />
      </View>
    );
  });
});

export const ThreeImages = React.memo((props) => {
  return props.images.map((item, index) => {
    return (
      <View key={index} style={{ flex: 1 }}>
        {index == 0 ? (
          <View>
            <FastImage
              key={index}
              resizeMode="cover"
              style={{
                width: WidthScreen * 0.9,
                height: HP(17),
                marginTop: HP(1),
                marginHorizontal: WP(0.1),
              }}
              source={{
                uri: SITE_URL + item,
              }}
            />
          </View>
        ) : index == 1 ? (
          <View key={index} style={{ display: "flex" }}>
            <FastImage
              key={index}
              resizeMode="cover"
              style={{
                width: WP(33),
                height: HP(14),
                marginTop: HP(1),
                marginHorizontal: WP(0.1),
                flexDirection: "row",
              }}
              source={{
                uri: SITE_URL + item,
              }}
            />
          </View>
        ) : index == 2 ? (
          <View key={index} style={{ display: "flex" }}>
            <FastImage
              key={index}
              resizeMode="cover"
              style={{
                width: WP(33),
                height: HP(14),
                marginTop: HP(1),
                marginHorizontal: WP(0.1),
                flexDirection: "row",
              }}
              source={{
                uri: SITE_URL + item,
              }}
            />
          </View>
        ) : null}
      </View>
    );
  });
});
