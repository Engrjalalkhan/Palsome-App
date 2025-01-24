import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import Video from "react-native-video";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { HP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";

const AndroidVideoPlayer = ({ index = 0, myIndex = 0, ...otherprops }) => {
  let vidref = useRef();
  const focused = useIsFocused();
  const autoPlayVideos = useSelector((state) => state.newsF.autoPlayVideos);

  const [vidLoading, setVidLoading] = useState(true);

  useEffect(() => {
    if (autoPlayVideos) {
      myIndex == index && focused
        ? vidref?.current?.setNativeProps({ paused: false })
        : vidref?.current?.setNativeProps({ paused: true });
    } else {
      vidref?.current?.setNativeProps({ paused: true });
    }
  }, [myIndex, focused, autoPlayVideos]);

  const handleReadyForDisplay = () => {
    setVidLoading(false);
  };

  return (
    <View style={styles.container}>
      <Video
        key={otherprops?.source?.uri}
        ref={vidref}
        onEnd={() => vidref?.current?.setNativeProps({ paused: true })}
        paused={true}
        automaticallyWaitsToMinimizeStalling={true}
        onReadyForDisplay={handleReadyForDisplay}
        {...otherprops}
        ignoreSilentSwitch="ignore"
      />
      {myIndex == index && focused && vidLoading && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});
export default AndroidVideoPlayer;
