import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import VideoPlayer from "react-native-video-player";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { imgRegex, videoRegex } from "../../../Utils/Regexes/imgVideoRegex";
import { HP, WP } from "../../../Utils/Resposive";
import { Platform } from "react-native";
import { PlayerControls } from "../MyVideoPlayer/PlayerControls";
import { SITE_URL } from "../../Services/Constants";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import Video from "react-native-video";

const VideoAndroid = ({ style, ...otherprops }) => {
  const [state, setState] = useState({
    fullscreen: false,
    play: false,

    showControls: true,
  });
  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({ ...state, play: false, showControls: true });
      return;
    }

    setState({ ...state, play: true });
    setTimeout(() => setState((s) => ({ ...s, showControls: false })), 2000);
  }
  return (
    <View>
      <Video
        style={[style]}
        resizeMode="cover"
        paused={!state.play}
        {...otherprops}
      />

      <View style={styles.controlOverlay}>
        <PlayerControls
          playing={state.play}
          onPlay={handlePlayPause}
          onPause={handlePlayPause}
        />
      </View>
    </View>
  );
};

const PostModalImgsVidz = (item, deletItem, onPressImage) => {
  const CrossIcon = ({ onPress }) => (
    <TouchableOpacity style={styles.imgcrossWrap} onPress={onPress}>
      {ICONS.fontAwesome("close", COLORS.white, WP(4.5))}
    </TouchableOpacity>
  );
  return (
    <View>
      {item?.post_file_type == "image" ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => onPressImage(item)}
        >
          <CrossIcon onPress={() => deletItem(item)} />
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={styles.image}
            source={{
              // uri: item.uri,
              uri: SITE_URL + item.path,
            }}
          />
        </TouchableOpacity>
      ) : item?.message_from == "ai" || item?.post_file_type == "palsome_ai" ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => onPressImage(item)}
        >
          <CrossIcon onPress={() => deletItem(item)} />
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={styles.image}
            source={{
              uri:
                item?.post_file_type === "palsome_ai"
                  ? SITE_URL + item.path
                  : SITE_URL + item.image,
            }}
          />
        </TouchableOpacity>
      ) : item?.post_file_type == "post" ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => onPressImage(item)}
        >
          <CrossIcon onPress={() => deletItem(item)} />
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={styles.image}
            source={{
              // uri: item.uri,
              uri: item.path,
            }}
          />
        </TouchableOpacity>
      ) : item?.type?.match(imgRegex) ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => onPressImage(item)}
        >
          <CrossIcon onPress={() => deletItem(item)} />
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={styles.image}
            source={{
              uri: item.uri,
            }}
          />
        </TouchableOpacity>
      ) : item?.post_file_type == "video" ? (
        Platform.OS == "ios" ? (
          <View style={styles.container}>
            <CrossIcon onPress={() => deletItem(item)} />
            <VideoPlayer
              style={styles.video}
              video={{
                uri: SITE_URL + "converted_videos/" + item.stream_path240,
              }}
              thumbnail={{
                uri:
                  SITE_URL + "converted_videos/thumbnails/" + item.thumb_path,
              }}
              automaticallyWaitsToMinimizeStalling={true}
              paused={false}
              controls={false}
              pauseOnPress
              customStyles={{
                controls: {
                  width: getWidth(28),
                  left: getWidth(5),
                  backgroundColor: "transparent",
                },
                seekBar: { width: 0 },
                playIcon: {
                  position: "absolute",
                  bottom: 20,
                  left: getWidth(5),
                },
              }}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <CrossIcon onPress={() => deletItem(item)} />
            <VideoAndroid
              style={[styles.video]}
              source={{
                uri: SITE_URL + "converted_videos/" + item.stream_path240,
              }}
              automaticallyWaitsToMinimizeStalling={true}
              controls={false}
              poster={
                SITE_URL + "converted_videos/thumbnails/" + item.thumb_path
              }
            />
          </View>
        )
      ) : item?.type?.match(videoRegex) ? (
        Platform.OS == "ios" ? (
          <View style={styles.container}>
            <CrossIcon onPress={() => deletItem(item)} />
            <VideoPlayer
              autoplay={true}
              style={styles.video}
              video={{
                uri: item.uri,
              }}
              automaticallyWaitsToMinimizeStalling={true}
              paused={false}
              controls={false}
              pauseOnPress
              customStyles={{
                controls: {
                  width: getWidth(28),
                  left: getWidth(5),
                  backgroundColor: "transparent",
                },
                seekBar: { width: 0 },
                playIcon: {
                  position: "absolute",
                  bottom: 20,
                  left: getWidth(5),
                },
              }}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <CrossIcon onPress={() => deletItem(item)} />
            <VideoAndroid
              style={[styles.video]}
              source={{
                uri: item.uri,
              }}
              automaticallyWaitsToMinimizeStalling={true}
              controls={false}
            />
          </View>
        )
      ) : item?.post_file_type !== "image" &&
        item?.post_file_type !== "video" &&
        item?.post_file_type !== "post" ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => onPressImage(item)}
        >
          <CrossIcon onPress={() => deletItem(item, "map")} />
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={styles.image}
            source={{
              // uri: item.uri,
              uri: item,
            }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WP(30),
    marginRight: 4,
  },
  image: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
  },
  video: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),

    borderWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
  },
  controlOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imgcrossWrap: {
    position: "absolute",
    elevation: 100,
    zIndex: 100,
    height: WP(6),
    width: WP(6),
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: COLORS.red,
    borderRadius: WP(6),
    top: WP(2),
    justifyContent: "center",
    alignItems: "center",
    left: WP(2),
  },
});
export default PostModalImgsVidz;
