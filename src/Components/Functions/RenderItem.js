import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import VideoPlayer from "react-native-video-player";
import { HP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";
import { WidthScreen } from "../TopBar/Dimensions";

export const RenderItemImages = ({ item, index }) => {
  return (
    <FastImage
      key={index}
      resizeMode="cover"
      style={{
        width: WidthScreen * 0.9,
        height: HP(17.5),
        marginTop: HP(1),
        borderLeftColor: COLORS.white,
        borderLeftWidth: 2,
      }}
      source={{
        uri: SITE_URL + item,
      }}
    />
  );
};

export const RenderItemVideos = ({ item, index, thumb }) => {
  return (
    <View
      key={index}
      style={{
        width: WidthScreen * 0.9,
        height: HP(28),
        marginTop: HP(1),
        flex: 1,
      }}
    >
      <VideoPlayer
        key={index}
        video={{
          uri: SITE_URL + "converted_videos/" + item.videoUri,
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
        thumbnail={{
          uri: SITE_URL + "converted_videos/thumbnails/" + item.thumbUri,
        }}
      />
    </View>
  );
};
