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
import ModalDropdown from "react-native-modal-dropdown";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { getHeight } from "../../../Utils/NewResponsive";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

// export const heightScreen = Dimensions.get("screen").height;
// export const widthScreen = Dimensions.get("screen").width;

// export const MyVideoPlayer = (props) => {
//   return (
//     <View style={styles.container}>
//       <TouchableWithoutFeedback onPress={props.showControlsFunc}>
//         <View style={styles.videoContainer}>
//           <Video
//             ref={props.videoRef}
//             source={{
//               uri:
//                 "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//             }}
//             style={props.fullscreen ? styles.fullscreenVideo : styles.video}
//             controls={false}
//             resizeMode={props.fullscreen ? "contain" : "cover"}
//             onLoad={props.onLoadEnd}
//             onProgress={props.onProgress}
//             onEnd={props.onEnd}
//             paused={props.play}
//             poster={props.poster}
//             muted={props.muted}
//             onLoadStart={props.onLoadStart}
//           />
//           {props.showControls && (
//             <View style={styles.controlOverlay}>
//               <PlayerControls
//                 onPlay={props.handlePlayPause}
//                 onPause={props.handlePlayPause}
//                 playing={props.play}
//                 showPreviousAndNext={false}
//                 showSkip={true}
//                 skipBackwards={props.skipBackward}
//                 skipForwards={props.skipForward}
//               />
//               <ProgressBar
//                 currentTime={props.currentTime}
//                 duration={props.duration > 0 ? props.duration : 0}
//                 onSlideStart={props.handlePlayPause}
//                 onSlideComplete={props.handlePlayPause}
//                 onSlideCapture={props.onSeek}
//               />
//               <ModalDropdown
//                 style={
//                   props.fullscreen
//                     ? styles.dropdownContainerFull
//                     : styles.dropdownContainer
//                 }
//                 dropdownStyle={{ height: 105 }}
//                 onSelect={(index, option) => setTrack(option)}
//                 options={["360", "720", "1080"]}
//               >
//                 <MaterialCommunityIcons
//                   name="quality-high"
//                   size={25}
//                   color={"white"}
//                 />
//               </ModalDropdown>
//               <TouchableOpacity
//                 onPress={props.handleFullscreen}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                 style={styles.fullscreenButton}
//               >
//                 {props.fullscreen ? (
//                   <MaterialCommunityIcons
//                     name="fullscreen-exit"
//                     size={25}
//                     color={"white"}
//                   />
//                 ) : (
//                   <MaterialCommunityIcons
//                     name="fullscreen"
//                     size={25}
//                     color={"white"}
//                   />
//                 )}
//               </TouchableOpacity>
//             </View>
//           )}
//           {props.muted ? (
//             <TouchableOpacity onPress={props.volumePress}>
//               <MaterialCommunityIcons
//                 name="volume-low"
//                 size={25}
//                 color={"white"}
//                 style={
//                   props.fullscreen ? styles.volumeFullScreen : styles.volume
//                 }
//               />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity onPress={props.volumePress}>
//               <MaterialCommunityIcons
//                 name="volume-high"
//                 size={25}
//                 color={"white"}
//                 style={
//                   props.fullscreen ? styles.volumeFullScreen : styles.volume
//                 }
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "red",
//     zIndex: 1000,
//   },
//   video: {
//     height: Dimensions.get("window").width * (9 / 15),
//     width: Dimensions.get("window").width,
//   },
//   fullscreenVideo: {
//     height: Dimensions.get("window").width,
//     width: Dimensions.get("window").height,
//   },
//   text: {
//     marginTop: 30,
//     marginHorizontal: 20,
//     fontSize: 15,
//     textAlign: "justify",
//   },
//   fullscreenButton: {
//     position: "absolute",
//     bottom: 2,
//     right: 10,
//   },
//   controlOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: COLORS.transparent,
//     justifyContent: "space-between",
//   },
//   dropdownContainerFull: {
//     position: "absolute",
//     right: 90,
//     bottom: 10,
//     backgroundColor: COLORS.transparent,
//   },
//   dropdownContainer: {
//     position: "absolute",
//     right: 80,
//     bottom: 1,
//     backgroundColor: COLORS.transparent,
//   },
//   videoContainer: {
//     backgroundColor: COLORS.transparent,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   volume: {
//     position: "absolute",
//     right: -150,
//     bottom: 2,
//   },
//   volumeFullScreen: {
//     position: "absolute",
//     right: -250,
//     bottom: 2,
//   },
// });

export const heightScreen = Dimensions.get("screen").height;
export const widthScreen = Dimensions.get("screen").width;

export const MyVideoPlayer = (props) => {
  const videoRef = React.useRef();
  const [track, setTrack] = useState(320);

  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
  });

  function handleOrientation(orientation) {
    orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT"
      ? (setState((s) => ({ ...s, fullscreen: true })),
        StatusBar.setHidden(true))
      : (setState((s) => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false));
  }

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
              uri: props.uri,
            }}
            style={state.fullscreen ? styles.fullscreenVideo : styles.video}
            controls={false}
            resizeMode={state.fullscreen ? "contain" : "contain"}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
            poster={props.uri}
          />
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                // onPress={() => {
                //   handleFullscreen();
                //   props.handleFullScreen();
                // }}
                hitSlop={{ top: 10, bottom: 20, left: 10, right: 10 }}
                style={
                  state.fullscreen
                    ? styles.fullscreenButtonFull
                    : styles.fullscreenButton
                }
              >
                {/* {state.fullscreen ? (
                  <MaterialCommunityIcons
                    name="fullscreen-exit"
                    size={25}
                    color={"white"}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="fullscreen"
                    size={25}
                    color={"white"}
                  />
                )} */}
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
              <ModalDropdown
                style={
                  state.fullscreen
                    ? styles.dropdownContainerFull
                    : styles.dropdownContainer
                }
                dropdownStyle={{ height: 105 }}
                onSelect={(index, option) => setTrack(option)}
                options={["360", "720", "1080"]}
              >
                {ICONS.materialCommunityIcons("quality-high", COLORS.white, 25)}
              </ModalDropdown>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  video: {
    height: getHeight(45),
    width: Dimensions.get("window").width,
  },
  fullscreenVideo: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").height,
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
    top: 160,
  },
  fullscreenButtonFull: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    top: 260,
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
    bottom: heightScreen * 0.01,
    backgroundColor: COLORS.transparent,
  },
  videoContainer: {
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
  },
});
