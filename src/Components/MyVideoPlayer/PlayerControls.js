import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

export const PlayerControls = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => {
  return (
    <View style={styles.wrapper}>
      {showPreviousAndNext && (
        <TouchableOpacity
          style={[
            styles.touchable,
            previousDisabled && styles.touchableDisabled,
          ]}
          onPress={onPrevious}
          disabled={previousDisabled}
        >
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2017/11/10/05/34/play-2935460__340.png",
            }}
            style={{ borderWidth: 1, height: 50, width: 50 }}
          />
        </TouchableOpacity>
      )}

      {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
          {ICONS.materialCommunityIcons("skip-previous", COLORS.white, 35)}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}
      >
        {playing ? (
                    ICONS.materialCommunityIcons("stop" , COLORS.white, 35)
        ) : (
          ICONS.materialCommunityIcons("play" , COLORS.white, 35)
        )}
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
          {ICONS.materialCommunityIcons("skip-next" , COLORS.white, 35)}
        </TouchableOpacity>
      )}

      {showPreviousAndNext && (
        <TouchableOpacity
          style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2017/11/10/05/34/play-2935460__340.png",
            }}
            style={{ borderWidth: 1, height: 50, width: 50 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
