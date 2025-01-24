import { View } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { Text } from "react-native";
import FastImage from "react-native-fast-image";
import { HP, WP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";

const MoreThanFour = (uri1, uri2, uri3, uri4, number) => {
  return (
    <View>
      <FastImage
        resizeMode="cover"
        style={{
          width: WidthScreen * 0.9,

          height: HP(22),
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
            width: WidthScreen * 0.3,
            height: HP(15),
            marginTop: HP(1),
          }}
          source={{
            uri: SITE_URL + uri2,
          }}
        />
        <FastImage
          resizeMode="cover"
          style={{
            width: WidthScreen * 0.3,
            height: HP(15),
            marginTop: HP(1),
            marginLeft: WP(1),
          }}
          source={{
            uri: SITE_URL + uri3,
          }}
        />
        <View
          style={{
            width: WidthScreen * 0.3,
            height: HP(15),
          }}
        >
          <ImageBackground
            source={{
              uri: SITE_URL + uri4,
            }}
            resizeMode="cover"
            style={{
              justifyContent: "center",
              width: WidthScreen * 0.29,
              height: HP(15),
              marginTop: HP(1),
              marginLeft: WP(1),
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.transparent,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 42,
                  fontWeight: "bold",
                }}
              >
                {number}+
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

export default MoreThanFour;
