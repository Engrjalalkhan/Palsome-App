// BottomSheet.js
import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { COLORS } from "../../../../Constants/Colors";
import { TouchableOpacity } from "react-native";

const { height } = Dimensions.get("window");

const BottomSheet = ({
  visible,
  onDismiss,
  onPressComplete,
  onPressEdit,
  onPressDelete,
}) => {
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20 });
    } else {
      translateY.value = withTiming(height, {}, () => {
        runOnJS(onDismiss)();
      });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [0, height],
        [0.5, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const handleDismiss = () => {
    translateY.value = withTiming(height, {}, () => {
      runOnJS(onDismiss)();
    });
  };

  const gestureHandler = useCallback((event) => {
    if (event.nativeEvent.translationY > 100) {
      handleDismiss();
    }
  }, []);

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
        </TouchableWithoutFeedback>
      )}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: COLORS.grey,
              position: "absolute",
              top: -0,
              left: "48%",
              height: 6,
              width: 50,
              borderRadius: 20,
            }}
          >
            <Text>-</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressComplete}>
              <Text style={styles.textStyle}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressEdit}>
              <Text style={styles.textStyle}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressDelete}>
              <Text style={styles.textStyle}>Delete Reminder</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 80,
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
    // justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    padding: 10,
  },
  textStyle: { fontSize: 20, padding: 10 },
});

export default BottomSheet;
