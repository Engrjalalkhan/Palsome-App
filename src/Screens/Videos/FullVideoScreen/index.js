import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Video, {
  OnSeekData,
  OnLoadData,
  OnProgressData,
} from "react-native-video";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { PlayerControls } from "../../../Components/MyVideoPlayer/PlayerControls";
import { ProgressBar } from "../../../Components/MyVideoPlayer/ProgressBar";
import { COLORS } from "../../../Constants/Colors";

export const heightScreen = Dimensions.get("screen").height;
export const widthScreen = Dimensions.get("screen").width;

const FullVideoScreen = () => {
  const videoRef = React.useRef();
  const [track, setTrack] = useState(320);

  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });

  // function handleOrientation(orientation) {
  //   orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT"
  //     ? (setState((s) => ({ ...s, fullscreen: true })),
  //       StatusBar.setHidden(true))
  //     : (setState((s) => ({ ...s, fullscreen: false })),
  //       StatusBar.setHidden(false));
  // }

  // function handleFullscreen() {
  //   state.fullscreen
  //     ? Orientation.unlockAllOrientations()
  //     : Orientation.lockToLandscapeLeft();
  // }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({ ...state, play: false, showControls: true });
      return;
    }

    setState({ ...state, play: true });
    setTimeout(() => setState((s) => ({ ...s, showControls: false })), 2000);
  }

  function skipBackward() {
    videoRef.current.seek(state.currentTime - 15);
    setState({ ...state, currentTime: state.currentTime - 15 });
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 15);
    setState({ ...state, currentTime: state.currentTime + 15 });
  }

  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState({ ...state, currentTime: data.seekTime });
  }

  function onLoadEnd(data) {
    console.log("loading", data, OnSeekData);
    setState((s) => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onProgress(data) {
    setState((s) => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({ ...state, play: false });
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true });
  }

  // useEffect(() => {
  //   Orientation.addOrientationListener(handleOrientation);

  //   return () => {
  //     Orientation.removeOrientationListener(handleOrientation);
  //   };
  // }, [state.fullscreen]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{
              uri:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            }}
            style={state.fullscreen ? styles.fullscreenVideo : styles.video}
            controls={false}
            resizeMode={state.fullscreen ? "contain" : "cover"}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
            onLoadStart={() => console.log("loading starts")}
            onVideoLoadStart={() => console.log("onVideoLoadStart starts")}
          />
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                // onPress={handleFullscreen}
                hitSlop={{ top: 10, bottom: 20, left: 10, right: 10 }}
                style={styles.fullscreenButton}
              >
                {state.fullscreen ? (
                  <MaterialCommunityIcons
                    name="fullscreen-exit"
                    size={25}
                    color={COLORS.white}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="fullscreen"
                    size={25}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
              {/* <ModalDropdown
                style={
                  state.fullscreen
                    ? styles.dropdownContainerFull
                    : styles.dropdownContainer
                }
                dropdownStyle={{height: 105}}
                onSelect={(index, option) => setTrack(option)}
                options={['360', '720', '1080']}>
                <MaterialCommunityIcons
                  name="quality-high"
                  size={25}
                  color={'white'}
                />
              </ModalDropdown> */}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  video: {
    height: Dimensions.get("window").width * (9 / 16),
    width: Dimensions.get("window").width,
    borderWidth: 3,
    borderColor: COLORS.blue,
  },
  fullscreenVideo: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").height,
    borderWidth: 3,
    borderColor: COLORS.blue,
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: "justify",
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    top: 100,
  },
  controlOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.transparent,
    justifyContent: "space-between",
  },
  dropdownContainerFull: {
    position: "absolute",
    right: 40,
    bottom: 50,
    backgroundColor: COLORS.transparent,
  },
  dropdownContainer: {
    position: "absolute",
    right: 40,
    bottom: heightScreen * 0.02,
    backgroundColor: COLORS.transparent,
  },
  videoContainer: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default FullVideoScreen;

// <MyVideoPlayer
//   videoRef={videoRef}
//   navigate={() => console.log("navigatings")}
//   lessControls={true}
//   muted={myMute}
//   volumePress={() => setMyMute(!myMute)}
//   play={isFocused && myIndex == item.id ? false : true}
//   showControls={state.showControls}
//   fullscreen={state.fullscreen}
//   duration={state.duration}
//   currentTime={state.currentTime}
//   handleFullscreen={handleFullscreen}
//   handlePlayPause={handlePlayPause}
//   skipBackward={skipBackward}
//   skipForward={skipForward}
//   onSeek={onSeek}
//   onLoadEnd={onLoadEnd}
//   onProgress={onProgress}
//   onEnd={onEnd}
//   showControlsFunc={showControls}
//   onLoadStart={() => setVideoLoading(true)}
//   poster={
//     "https://www.palsome.com/converted_videos/thumbnails/" +
//     item?.media[0]?.thumb_path
//   }
// />
