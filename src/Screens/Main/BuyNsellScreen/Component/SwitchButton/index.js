import React, { useState, useEffect } from "react";

import { COLORS } from "../../../../../Constants/Colors";
import { Animated, StyleSheet, Pressable, Platform } from "react-native";
import darkColors from "react-native-elements/dist/config/colorsDark";
import { ICONS } from "../../../../../Constants/Icons";
import { isRTL } from "../../../../../../Utils/IsRTL";

const CustomSwitchLocation = ({ isEnabled, toggleSwitch }) => {
  const [animation] = useState(new Animated.Value(isEnabled ? 1 : 0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isEnabled]);

  const handleToggleSwitch = () => {
    Animated.timing(animation, {
      toValue: isEnabled ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    toggleSwitch();
  };

  const interpolatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.grey, COLORS.primary],
  });
  darkColors;

  const thumbPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: isRTL ? [32, 2] : [2, 32],
  });

  return (
    <Pressable onPress={handleToggleSwitch} style={styles.switchContainer}>
      <Animated.View
        style={[styles.track, { backgroundColor: interpolatedColor }]}
      />
      {isEnabled &&
        ICONS.materialIcons("location-pin", COLORS.white, 22, {
          right: isRTL ? -12 : 12,
        })}
      <Animated.View style={[styles.thumb, { left: thumbPosition }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 60,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  track: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    position: "absolute",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#f4f3f4",
    position: "absolute",
    top: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default CustomSwitchLocation;
