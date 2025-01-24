import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  NativeModules,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import Autolink from "react-native-autolink";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import GestureRecognizer from "react-native-swipe-gestures";

import ReadMore from "../../../ReadMore";
import { COLORS } from "../../../../Constants/Colors";
import { usePrevious, isNullOrWhitespace } from "./helpers";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import { useTranslation } from "react-i18next";
import { ICONS } from "../../../../Constants/Icons";
import { HP, WP } from "../../../../../Utils/Resposive";
import { isRTL } from "../../../../../Utils/IsRTL";
import { postStatusApiCall } from "../../../../Services/Apis";

const { StatusBarManager } = NativeModules;
const { width, height } = Dimensions.get("window");

export const StoryListItem = ({
  index,
  key,
  userId,
  profileImage,
  profileName,
  inititalDuration,
  onFinish,
  onClosePress,
  stories,
  currentPage,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const [top, setTop] = useState(0);
  const [load, setLoad] = useState(true);
  const [current, setCurrent] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [duration, setDuration] = useState(inititalDuration);
  const [content, setContent] = useState(
    stories.map((x) => ({
      ...x,
      finish: 0,
      paused: x.type == "video" ? true : undefined,
    }))
  );

  const prevCurrent = usePrevious(current);
  const prevCurrentPage = usePrevious(currentPage);

  const playerRef = useRef();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === "ios") {
      StatusBarManager.getHeight((bar) => {
        setTop(bar.height);
      });
    } else {
      setTop(StatusBarManager.HEIGHT);
    }
  }, []);

  useEffect(() => {
    let isPrevious = !!prevCurrentPage && prevCurrentPage > currentPage;

    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          x.finish = 0;
        }
      } else {
        x.finish = 0;
      }
    });
    setContent(data);
    start();
  }, [currentPage]);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (prevCurrent) {
        if (
          current > prevCurrent &&
          content[current - 1].src == content[current].src
        ) {
          start();
        } else if (
          current < prevCurrent &&
          content[current + 1].src == content[current].src
        ) {
          start();
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const onView = async (seenId) => {
      if (seenId > -1) {
        const apiURL = `${BASE_URL}/story/seen`;
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer" + " " + token);
        const formData = new FormData();
        formData.append("id", seenId);
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formData,
        };

        try {
          await fetch(apiURL, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.responseCode === 200) {
              } else {
              }
            })
            .catch((error) => {
              console.log("media Post error", error);
            });
        } catch (error) {
          console.log("media Post error", error.message);
        }
      }
    };

    if (currentPage === index && !content[current].seen)
      onView(content[current].id);
  }, [currentPage, current]);

  const shouldStartVideo = () => {
    if (content[current].type == "video" && currentPage == index) {
      let data = [...content];
      data.forEach((x, i) => {
        if (i == current) {
          x.paused = false;
          playerRef?.current?.seek(0);
        } else {
          x.paused = true;
        }
      });

      setContent(data);
    } else {
      let data = [...content];
      data.forEach((x) => {
        x.paused = true;
      });

      setContent(data);
    }
  };

  function start() {
    setLoad(false);
    progress.setValue(0);
    startAnimation();
    shouldStartVideo();
  }

  function startAnimation() {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        next();
      }
    });
  }

  function onSwipeDown(_props) {
    onClosePress();
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function next() {
    setLoad(true);
    setShowButton(false);
    setDuration(inititalDuration);
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      close("next");
    }
  }

  function previous() {
    // checking if the previous content is not empty
    setLoad(true);
    setShowButton(false);
    setDuration(inititalDuration);
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
    } else {
      // the previous content is empty
      close("previous");
    }
  }

  function close(state) {
    let data = [...content];
    data.map((x) => (x.finish = 0));
    setContent(data);
    progress.setValue(0);
    if (currentPage == index) {
      if (onFinish) {
        onFinish(state);
      }
    }
  }

  const timeDifference = (previousn) => {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;
    let elapsed = new Date() - new Date(previousn);

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " s";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " m";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " h";
    } else if (elapsed < msPerMonth) {
      return +Math.round(elapsed / msPerDay) + " d";
    } else if (elapsed < msPerYear) {
      return +Math.round(elapsed / msPerMonth) + " month";
    } else {
      return +Math.round(elapsed / msPerYear) + " y";
    }
  };

  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen", {
      id: userId,
    });

    onClosePress();
  };

  const playPauseVideo = () => {
    if (content[current].type == "video") {
      let data = [...content];
      data[current].paused = !data[current].paused;

      setContent(data);
    }
  };

  const pauseTimer = () => {
    if (!showButton) {
      progress.stopAnimation();
      setShowButton(true);
      playPauseVideo();
    } else {
      startAnimation();
      setShowButton(false);
      playPauseVideo();
      setReadMore(false);
    }
  };

  const videoLoadingError = () => {
    Toast.show("Error loading media", Toast.SHORT);
    next();
  };

  const handleLoading = (data) => {
    setDuration(Math.ceil(data.duration * 1000));
    start();
  };

  const handleBuffering = ({ isBuffering }) => {
    if (!isBuffering) {
      startAnimation();
    } else {
      progress.stopAnimation();
    }
  };

  const handleReadMore = () => {
    if (readMore && showButton) {
      setReadMore(false);
      setShowButton(false);

      startAnimation();
      playPauseVideo();
    } else if (readMore && !showButton) {
    } else if (!readMore && showButton) {
      setReadMore(true);
    } else {
      setReadMore(true);
      setShowButton(true);

      progress.stopAnimation();
      playPauseVideo();
    }
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onFocus = () => {
    setKeyboardStatus(true);
    progress.stopAnimation();
    playPauseVideo();
  };

  const onBlur = () => {
    setKeyboardStatus(false);
    startAnimation();
    setShowButton(false);
    playPauseVideo();
  };
  const handleOnChange = (text) => {
    setText(text);
  };

  const onSend = async () => {
    setText("");
    Keyboard.dismiss();
    const formData = new FormData();
    formData.append("story_media_id", content[current]?.id);
    formData.append("message_body", text);

    const res = await postStatusApiCall({
      route: "chat/story/reply",
      verb: "POST",
      token: token,
      body: formData,
    });
    if (res?.responseCode === 200) {
      Toast.show(t("Message sent"));
    }
  };

  const renderImage = () => {
    return (
      <FastImage
        onLoadEnd={start}
        source={{ uri: content[current].src }}
        style={styles.image}
        resizeMode="contain"
      />
    );
  };

  const renderAutoLink = (item) => (
    <Autolink
      component={View}
      text={item?.story_text}
      renderLink={(text, match) => {
        return (
          <TouchableOpacity
            onPress={() => {
              switch (match.getType()) {
                default:
                  navigation.navigate("WebViewScreen", match.getAnchorHref());
                  onClosePress();
              }
            }}
            style={{
              width: WP(90),
              padding: WP(2),
              borderRadius: 25,
              alignItems: "center",
              marginHorizontal: WP(5),
              paddingHorizontal: WP(5),
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                textAlign: "center",
                textDecorationLine: "underline",
                color: item?.colored_pattern?.text_color,
                textDecorationColor: item?.colored_pattern?.text_color,
              }}
            >
              {text}
            </Text>
          </TouchableOpacity>
        );
      }}
      renderText={(text) => {
        return (
          <View
            style={{
              width: WP(90),
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: item?.colored_pattern?.text_color,
              }}
            >
              {text}
            </Text>
          </View>
        );
      }}
    />
  );

  const renderColoredImage = () => {
    return (
      <ImageBackground
        resizeMode="cover"
        onLoad={start}
        source={{
          uri: `${SITE_URL}/frontend/img/${content[current]?.colored_pattern?.background_image}`,
        }}
        style={styles.backimgStyle}
      >
        <Pressable style={styles.backimgStyle} onPress={pauseTimer}>
          {showButton && (
            <View style={styles.spinnerContainer}>
              <Ionicons name="play" style={styles.muteStyle} />
            </View>
          )}

          {renderAutoLink(content[current])}
        </Pressable>
      </ImageBackground>
    );
  };

  const renderColoredPatteren = () => {
    return (
      <LinearGradient
        onLayout={start}
        colors={[
          content[current]?.colored_pattern?.background_color_1
            ? content[current]?.colored_pattern?.background_color_1
            : "#4c669f",
          content[current]?.colored_pattern?.background_color_2
            ? content[current]?.colored_pattern?.background_color_2
            : "#192f6a",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientstl}
      >
        <Pressable style={styles.backimgStyle} onPress={pauseTimer}>
          {showButton && (
            <View style={styles.spinnerContainer}>
              <Ionicons name="play" style={styles.muteStyle} />
            </View>
          )}
          {renderAutoLink(content[current])}
        </Pressable>
      </LinearGradient>
    );
  };

  const renderVideo = () => {
    return (
      <Video
        ref={playerRef}
        resizeMode="contain"
        style={styles.image}
        onLoad={handleLoading}
        key={content[current].src}
        onBuffer={handleBuffering}
        onError={videoLoadingError}
        paused={content[current]?.paused}
        poster={content[current]?.preview}
        source={{ uri: content[current].src }}
        automaticallyWaitsToMinimizeStalling={true}
      />
    );
  };

  const renderAutoLinkCaption = (item) => {
    return (
      <Autolink
        component={View}
        text={item?.story_text}
        renderLink={(text, match) => {
          return (
            <TouchableOpacity
              style={{ width: WP(92), alignItems: "center" }}
              onPress={() => {
                switch (match.getType()) {
                  default:
                    navigation.navigate("WebViewScreen", match.getAnchorHref());
                    onClosePress();
                }
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  textAlign: "center",
                  textDecorationLine: "underline",
                  color: COLORS.white,
                  opacity: 0.8,
                  textDecorationColor: COLORS.white,
                }}
              >
                {text}
              </Text>
            </TouchableOpacity>
          );
        }}
        renderText={(text) => {
          return text.length < 100 ? (
            <Text
              style={{
                color: COLORS.white,
                opacity: 0.8,
                textAlign: "center",
                width: WP(92),
              }}
            >
              {text}
            </Text>
          ) : (
            <ReadMore
              handleText={handleReadMore}
              text={text}
              textstyle={{
                color: COLORS.white,
                opacity: 0.8,
                textAlign: "center",
                width: WP(92),
              }}
              readMore={readMore}
            />
          );
        }}
      />
    );
  };

  return (
    <GestureRecognizer
      key={key}
      onSwipeDown={onSwipeDown}
      config={config}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {keyboardStatus && (
            <Pressable
              onPress={Keyboard.dismiss}
              style={{
                height: 500,
                width: 400,
                position: "absolute",
                zIndex: 1000,
              }}
            ></Pressable>
          )}
          <View style={[styles.backgroundContainer, { top: top }]}>
            <View style={styles.animationBarContainer}>
              {content.map((index, key) => {
                return (
                  <View key={key} style={styles.animationBackground}>
                    <Animated.View
                      style={{
                        flex: current == key ? progress : content[key].finish,
                        height: 2,
                        backgroundColor: "white",
                      }}
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.userContainer}>
              <View style={styles.flexRowCenter}>
                <TouchableWithoutFeedback onPress={onClosePress}>
                  {ICONS.antDesign(
                    isRTL ? "arrowright" : "arrowleft",
                    COLORS.white,
                    24,
                    styles.iconStyle
                  )}
                </TouchableWithoutFeedback>

                <TouchableOpacity
                  style={{ marginLeft: WP(2), width: 38, height: 38 }}
                  onPress={handleProfilePress}
                >
                  <Image
                    style={styles.avatarImage}
                    source={{ uri: profileImage }}
                  />
                </TouchableOpacity>

                <View style={{ marginLeft: WP(5) }}>
                  <Text style={styles.avatarText} onPress={handleProfilePress}>
                    {profileName}
                  </Text>
                  <Text style={styles.avatarText}>
                    {timeDifference(content[current].timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            {load && (
              <View style={[styles.spinnerContainer]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}

            {content[current].type == "photo"
              ? renderImage()
              : content[current].type == "text" &&
                content[current]?.colored_pattern?.type == "image"
              ? renderColoredImage()
              : content[current].type == "text"
              ? renderColoredPatteren()
              : content[current].type == "video"
              ? renderVideo()
              : null}
          </View>

          <Pressable
            style={styles.leftButton}
            onPress={() => {
              if (!readMore) previous();
            }}
          />

          {content[current]?.type !== "text" && (
            <Pressable style={styles.centerButton} onPress={pauseTimer}>
              {showButton && <Ionicons name="play" style={styles.muteStyle} />}
            </Pressable>
          )}

          <Pressable
            style={styles.rightButton}
            onPress={() => {
              if (!readMore) next();
            }}
          />

          {content[current]?.type !== "text" &&
          content[current]?.story_text?.length > 0 ? (
            <View
              style={[
                styles.storytxtStyle,
                {
                  bottom:
                    Platform.OS === "ios"
                      ? keyboardStatus
                        ? HP(48)
                        : HP(13)
                      : HP(13),
                },
              ]}
            >
              {renderAutoLinkCaption(content[current])}
            </View>
          ) : null}
          {content[current] && (
            <View style={[styles.textInputContainer]}>
              <TextInput
                onFocus={onFocus}
                value={text}
                onChangeText={handleOnChange}
                onBlur={onBlur}
                placeholder="Send a message"
                placeholderTextColor={COLORS.black}
                style={styles.textInput}
              />
              <TouchableOpacity style={{ padding: 6 }} onPress={onSend}>
                {ICONS.feather("send", COLORS.primary, 30)}
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureRecognizer>
  );
};

export default StoryListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.45,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 70,
      },
    }),
    backgroundColor: "rgba(60, 60, 60, 0)",
  },

  image: {
    width: width,
    height: height,
  },

  backgroundContainer: {
    zIndex: 1,

    position: "absolute",
    left: 0,
    right: 0,
  },

  spinnerContainer: {
    width: width,
    zIndex: 2,
    height: height,
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  animationBarContainer: {
    paddingTop: 10,
    flexDirection: "row",
    paddingHorizontal: 10,
  },

  animationBackground: {
    flex: 1,
    height: 2,
    flexDirection: isRTL ? "row-reverse" : "row",
    marginHorizontal: 2,
    backgroundColor: COLORS.redicalRed,
  },

  userContainer: {
    zIndex: 1,
    flexDirection: "row",
    // height: getHeight(10),
    paddingHorizontal: 15,
    justifyContent: "space-between",

    // previous
    paddingTop: Platform.OS == "ios" ? HP(4) : HP(2),
  },

  avatarImage: {
    width: "92%",
    height: "92%",
    borderRadius: 100,
  },

  avatarText: {
    color: "white",
    fontWeight: "bold",
  },

  leftButton: {
    zIndex: 2,
    width: WP(25),
    // backgroundColor: "pink",

    position: "absolute",
    left: 0,
    bottom: 0,
    top: HP(18),
  },

  centerButton: {
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",

    position: "absolute",
    bottom: 0,
    top: HP(18),
    left: WP(25),
    right: WP(25),
  },

  rightButton: {
    zIndex: 2,
    width: WP(25),
    // backgroundColor: "pink",

    position: "absolute",
    right: 0,
    bottom: 0,
    top: HP(18),
  },

  // From previous
  backimgStyle: {
    width: WP(100),
    height: HP(100),
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: WP(5),
  },

  patrenstext: {
    fontSize: 20,
    width: WP(93),
    height: HP(40),
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  gradientstl: {
    width: WP(100),
    height: HP(100),
    alignItems: "center",
    justifyContent: "center",
  },

  gradientEndStyle: {
    fontSize: 20,
    width: WP(93),
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  iconStyle: {
    width: WP(8),
    height: HP(5),
    paddingTop: HP(1),
    marginLeft: WP(1.8),
  },

  muteStyle: {
    zIndex: 2,
    fontSize: HP(7),
    borderRadius: 70,
    color: COLORS.white,
    backgroundColor: "rgba(52,52,52,0.6)",
  },

  storytxtStyle: {
    zIndex: 10,
    padding: 10,
    width: WP(96),
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52,52,52,0.6)",

    position: "absolute",
    bottom: HP(13),
    // bottom: HP(5.5),
  },
  textInput: {
    backgroundColor: "gray",
    width: "90%",
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 13,
  },
  textInputContainer: {
    bottom: 40,
    zIndex: 10000,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: Platform.OS === "android" ? 7 : 0,
  },
});
