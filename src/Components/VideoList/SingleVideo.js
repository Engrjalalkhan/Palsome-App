import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import VideoPlayer from "react-native-video-player";
import { SITE_URL } from "../../Services/Constants";

const SingleVideo = (arr) => {
  return arr.video?.map((itm, ind) => {
    return (
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          marginRight: 20,
        }}
        key={ind}
      >
        <VideoPlayer
          key={ind}
          video={{
            uri: SITE_URL + "converted_videos/" + itm.videoUri,
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
            uri: SITE_URL + "converted_videos/thumbnails/" + itm.thumbUri,
          }}
        />
      </View>
    );
  });
};

export default SingleVideo;
