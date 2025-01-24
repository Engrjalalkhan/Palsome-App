import React from "react";
import { View, ScrollView } from "react-native";
import VideoPlayer from "react-native-video-player";
import { HP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { WidthScreen } from "../TopBar/Dimensions";

export const ShowVideos = (props) => {

  if (props.videoUris) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled
        >
          {props.videoUris.map((itm, ind) => {
            return (
              <View
                key={ind}
                style={{
                  width: WidthScreen * 0.6,
                  height: HP(28),
                  marginTop: HP(1),
                  flex: 1,
                  borderLeftColor: COLORS.white,
                  borderLeftWidth: 2,
                }}
              >
                <VideoPlayer
                  video={{
                    uri: itm.uri,
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
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
};
