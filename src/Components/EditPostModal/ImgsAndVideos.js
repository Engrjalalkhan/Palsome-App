import { View } from "react-native";
import React from "react";
import FastImage from "react-native-fast-image";
import VideoPlayer from "react-native-video-player";
import { HP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import { getHeight } from "../../../Utils/NewResponsive";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

export const ImgsAndVideos = (item, deletItem) => {
  return (
    <View style={{ flex: 1 }}>
      {item.post_file_type === "image" ? (
        <View style={{ flexDirection: "row-reverse" }}>
          {ICONS.fontAwesome5("times-circle", COLORS.red, 14, () =>
            deletItem({ itemPath: item.path, itemId: item.encrypted_id })
          )}
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={{
              width: WidthScreen * 0.4,
              height: getHeight(15),
              marginTop: HP(1),
              borderLeftColor: COLORS.white,
              borderLeftWidth: 1,
            }}
            source={{
              uri: SITE_URL + item.path,
            }}
          />
        </View>
      ) : item.type === "image/jpg" || item.type === "image/png" ? (
        <View style={{ flexDirection: "row-reverse" }}>
          {ICONS.fontAwesome5("times-circle", COLORS.red, 14, () => deletItem({ localuri: item.uri }))}
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={{
              width: WidthScreen * 0.4,
              height: getHeight(15),
              marginTop: HP(1),
              borderLeftColor: COLORS.white,
              borderLeftWidth: 1,
            }}
            source={{
              uri: item.uri,
            }}
          />
        </View>
      ) : item.type === "video/mp4" ? (
        <View
          key={item.index}
          style={{
            flexDirection: "row-reverse",
            borderWidth: 1,
          }}
        >
        {ICONS.fontAwesome5("times-circle", COLORS.red, 14, () => deletItem({ localuri: item.uri }))}
          <VideoPlayer
            video={{
              uri: SITE_URL + item.path,
            }}
            muted={false}
            repeat={false}
            resizeMode={"contain"}
            volume={9.0}
            rate={1.0}
            ignoreSilentSwitch={"ignore"}
            videoWidth={3000}
            videoHeight={1900}
            disableControlsAutoHide={true}
            disableFullscreen={false}
            style={{ marginTop: HP(1), borderWidth: 1 }}
          />
        </View>
      ) : (
        <View
          key={item.index}
          style={{
            width: WidthScreen * 0.6,
            height: HP(31),
            flex: 1,
            flexDirection: "row-reverse",
          }}
        >
         {ICONS.fontAwesome5("times-circle", COLORS.red, 14, () => deletItem(item.path, item.encrypted_id))}
          <VideoPlayer
            video={{
              uri: SITE_URL + item.path,
            }}
            muted={false}
            repeat={false}
            resizeMode={"contain"}
            volume={9.0}
            rate={1.0}
            ignoreSilentSwitch={"ignore"}
            videoWidth={3000}
            videoHeight={1900}
            disableControlsAutoHide={true}
            disableFullscreen={false}
            thumbnail={{ uri: SITE_URL + item.thumb_path }}
            style={{ marginTop: HP(1) }}
          />
        </View>
      )}
    </View>
  );
};
