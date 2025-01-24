import React from "react";
import Slider from "@react-native-community/slider";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../Constants/Colors";

export const ProgressBar = ({
  currentTime,
  duration,
  onSlideCapture,
  onSlideStart,
  onSlideComplete,
  children,
}) => {
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);

  return (
    <View style={styles.wrapper}>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeLeft}>
          {position} / <Text style={styles.timeRight}>{fullDuration}</Text>
        </Text>
        <Slider
          style={{ width: "70%", marginRight: 60 }}
          value={currentTime}
          minimumValue={0}
          maximumValue={duration}
          step={1}
          onValueChange={handleOnSlide}
          onSlidingStart={onSlideStart}
          onSlidingComplete={onSlideComplete}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.white}
          thumbTintColor={COLORS.primary}
        />
      </View>
    </View>
  );

  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : "0" + minutes}:${
      seconds >= 10 ? seconds : "0" + seconds
    }`;
  }

  function handleOnSlide(time) {
    onSlideCapture({ seekTime: time });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeLeft: {
    flex: 1,
    fontSize: 8,
    color: COLORS.white,
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 8,
    color: COLORS.white,
    textAlign: "right",
    paddingRight: 10,
  },
});
