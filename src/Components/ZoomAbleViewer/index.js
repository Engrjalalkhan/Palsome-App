import React, { useState, useRef } from 'react';
import { Animated, View } from 'react-native';
import { TapGestureHandler, PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

const ZoomableView = ({ children }) => {
  const [panEnabled, setPanEnabled] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const pinchRef = useRef();
  const panRef = useRef();
  const doubleTapRef = useRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      lastScale.current = scale._value;
    }

    if (nativeEvent.state === State.END) {
      const nScale = lastScale.current * nativeEvent.scale;

      if (nScale < 1) {
        resetZoom();
      } else {
        lastScale.current = nScale;
        setPanEnabled(true);
      }
    }
  };

  const handleDoubleTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      Animated.timing(scale, {
        toValue: lastScale.current === 1 ? 2 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (lastScale.current === 1) {
          resetZoom();
        } else {
          lastScale.current = scale._value;
          setPanEnabled(true);
        }
      });
    }
  };

  const resetZoom = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setPanEnabled(false);
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
  };

  return (
    <View style={{ flex: 1 }}>
      <TapGestureHandler
        onHandlerStateChange={handleDoubleTap}
        numberOfTaps={2}
        waitFor={pinchRef}
      >
        {/* <PanGestureHandler
          onGestureEvent={onPanEvent}
          ref={panRef}
          simultaneousHandlers={[pinchRef, doubleTapRef]}
          enabled={panEnabled}
        > */}
          <Animated.View>
            <PinchGestureHandler
              ref={pinchRef}
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={handlePinchStateChange}
              simultaneousHandlers={[panRef, doubleTapRef]}
            >
              <Animated.View
                style={{
                  transform: [{ scale }, { translateX }, { translateY }],
                }}
              >
                {children}
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        {/* </PanGestureHandler> */}
      </TapGestureHandler>
    </View>
  );
};

export default ZoomableView;
