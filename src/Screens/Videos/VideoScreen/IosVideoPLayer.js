import React, { useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import { HP } from "../../../../Utils/Resposive";
import { useSelector } from "react-redux";
import { COLORS } from "../../../Constants/Colors";

const IosVideoPLayer = ({ ...otherprops }, ref) => {
  const [vidLoading, setVidLoading] = useState(true);

  const videref = useRef();
  const autoPlayVideos = useSelector((state) => state.newsF.autoPlayVideos);

  return (
    <View>
      {/* <InViewPort
        onChange={(isVisible) => {
          // if (videref?.current?.presentFullscreenPlayer) {
          //   return;
          // }
          if (autoPlayVideos) {
            isVisible
              ? videref?.current?.setNativeProps({ paused: false })
              : videref?.current?.setNativeProps({ paused: true });
          } else {
            isVisible
              ? videref?.current?.setNativeProps({ paused: true })
              : videref?.current?.setNativeProps({ paused: true });
          }
        }}
      > */}
      <Video
        ref={videref}
        onReadyForDisplay={() => setVidLoading(false)}
        paused={!autoPlayVideos}
        onEnd={() => videref?.current?.setNativeProps({ paused: true })}
        {...otherprops}
      />
      {/* </InViewPort> */}

      <ActivityIndicator
        animating={vidLoading}
        size={"large"}
        color={COLORS.primary}
        style={{
          alignSelf: "center",
          marginTop: HP(18),
          position: "absolute",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});
export default IosVideoPLayer;
