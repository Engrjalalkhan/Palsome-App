import { ICONS } from "../../../Constants/Icons";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../../Constants/Colors";
import { showMessage } from "react-native-flash-message";
import { Animated, StyleSheet, Text, Pressable } from "react-native";

const CustomSwitch = ({
  isEnabled,
  toggleSwitch,
  aiImageLimit,
  setIsEnabled,
}) => {
  const [animation] = useState(new Animated.Value(isEnabled ? 1 : 0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isEnabled]);

  const handleToggleSwitch = () => {
    if (!isEnabled && aiImageLimit === 0) {
      setIsEnabled(true);
      setTimeout(() => {
        setIsEnabled(false);
        showMessage({
          message: "You have reached the maximum limit.",
          type: "warning",
          position: "bottom",
        });
      }, 500);
      return;
    }

    if (isEnabled) {
      showMessage({
        message: "Switched to text as a response from AI.",
        type: "info",
        position: "top",
      });
    } else {
      showMessage({
        message: "Switched to image as a response from AI.",
        type: "info",
        position: "top",
      });
    }

    Animated.timing(animation, {
      toValue: isEnabled ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    toggleSwitch();
  };

  const interpolatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.primary, COLORS.primary],
  });

  const thumbPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 45],
  });

  return (
    <Pressable onPress={handleToggleSwitch} style={styles.switchContainer}>
      <Animated.View
        style={[styles.track, { backgroundColor: interpolatedColor }]}
      />
      <Animated.View style={[styles.thumb, { left: thumbPosition }]} />
      {isEnabled &&
        ICONS.materialCommunityIcons("camera", COLORS.white, 14, {
          right: 1,
        })}
      <Text style={[styles.text, { marginRight: isEnabled ? 25 : -20 }]}>
        {isEnabled ? `(${aiImageLimit})` : "A"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 73,
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

export default CustomSwitch;
