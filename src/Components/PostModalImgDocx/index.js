import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import { getHeight } from "../../../Utils/NewResponsive";
import { imgRegex, videoRegex } from "../../../Utils/Regexes/imgVideoRegex";
import { HP, WP } from "../../../Utils/Resposive";
import { PlayerControls } from "../MyVideoPlayer/PlayerControls";
import { SITE_URL } from "../../Services/Constants";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";

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

const PostModalImgDocx = (item, deletItem, onPressImage) => {
  const CrossIcon = ({ onPress }) => (
    <TouchableOpacity style={styles.imgcrossWrap} onPress={onPress}>
      {ICONS.fontAwesome("close", COLORS.white, WP(4.5))}
    </TouchableOpacity>
  );

  return (
    <View>
      {/* {console.log("images item here", item)} */}

      {
        // item?.post_file_type == "image" ? (
        //   <TouchableOpacity
        //     style={styles.container}
        //     onPress={() => onPressImage(item)}
        //   >
        //     <CrossIcon onPress={() => deletItem(item)} />
        //     <FastImage
        //       key={item.index}
        //       resizeMode="cover"
        //       style={styles.image}
        //       source={{
        //         // uri: item.uri,
        //         uri: SITE_URL + item.path,
        //       }}
        //     />
        //   </TouchableOpacity>
        // ) :
        item?.type?.match(imgRegex) ? (
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
        ) : item?.type == "pdf" ? (
          <TouchableOpacity
            style={styles.docContainer}
            onPress={() => onPressImage(item)}
          >
            <CrossIcon onPress={() => deletItem(item)} />
            <FastImage
              key={item.index}
              resizeMode="contain"
              style={styles.docImage}
              source={IMAGES.pdfFile}
            />
          </TouchableOpacity>
        ) : item?.type == "doc" ? (
          <TouchableOpacity
            style={styles.docContainer}
            onPress={() => onPressImage(item)}
          >
            <CrossIcon onPress={() => deletItem(item)} />
            <FastImage
              key={item.index}
              resizeMode="contain"
              style={styles.docImage}
              source={IMAGES.wordFile}
            />
          </TouchableOpacity>
        ) : null
      }
      {item?.file_path && (
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
              uri: SITE_URL + item.file_path,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  docContainer: {
    width: WP(30),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(1.5),
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
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
  docImage: {
    width: WP(18),
    height: WP(18),
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
export default PostModalImgDocx;
