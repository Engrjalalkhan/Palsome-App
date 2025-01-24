import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  LogBox,
  FlatList,
  Animated,
  Platform,
  Pressable,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import { Modal } from "react-native";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import Autolink from "react-native-autolink";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import Ionic from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ReadMore from "../../../../Components/ReadMore";

import { withoutStringiApiCall } from "../../../../Services/Apis";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import { ICONS } from "../../../../Constants/Icons";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import { HP, WP } from "../../../../../Utils/Resposive";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import { isRTL } from "../../../../../Utils/IsRTL";
import { alignment } from "../../../../styles/TextAlignment";
import { useBackHandler } from "../../../../../Utils/backHardwareBackPress/handleHardBackPress";

const myStory = ({ ...props }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });


  const flatRef = React.useRef(null);
  const progress = useRef(new Animated.Value(0))?.current;

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);

  let userId = userData.id;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [mute, setMute] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [duration, setDuration] = useState();
  const [type, setItemtype] = useState();

  const [Currentzitem, setCurrentzitem] = useState(props.route.params.index);
  const [end, setEnd] = useState(0);
  const [current, setCurrent] = useState(Currentzitem);
  const [load, setLoad] = useState(false);
  const [videoActivity, setVideoActivity] = useState(true);
  const [content, setContent] = useState([{}]);
  const [index, setIndex] = useState(0);
  const [itemsLenth, setItemsLenth] = useState();
  const [seenId, setseenId] = useState();
  const my_storyData = useSelector((state) => state.blackNewsF?.setStories);

  const [startvid, setStartVid] = useState(false);
  const [storyViewModal, setStoryViewModal] = useState(false);
  const [storyViewData, setStoryViewData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const toggleStoryViewModal = () => {
    setStoryViewModal(!storyViewModal);
  };

  function start(item) {
    if (mute == false) {
      if (type === "text") {
        Animated.timing(progress, {
          toValue: 1,
          duration: 5000,
        }).start(({ finished }) => {
          if (finished) {
            next(item);
          }
        });
      }

      if (type === "video") {
        if (startvid == true) {
          Animated.timing(progress, {
            toValue: 1,
            duration: duration,
          }).start(({ finished }) => {
            if (finished) {
              next(item);
            }
          });
        } else {
          progress.stopAnimation();
        }
      }

      if (type === "photo") {
        if (load == false) {
          Animated.timing(progress, {
            toValue: 1,
            duration: 5000,
          }).start(({ finished }) => {
            if (finished) {
              next(item);
            }
          });
        } else {
          progress.stopAnimation();
        }
      }
    } else {
      progress.stopAnimation();
    }
  }

  function next(item) {
    setMute(false);

    if (current <= itemsLenth - 2) {
      let data = [...content];
      data[current];

      setContent(data);
      setCurrent(current + 1);
      setLoad(false);
      progress.setValue(0);
      setseenId(data[current]?.id);
    } else {
      navigation.navigate("NewsFeed");
    }
  }

  function previous(item) {
    setMute(false);
    if (current > 0) {
      let data = [...content];

      setContent(data);
      setCurrent(current - 1);
      setseenId(data[current]?.id);
      progress.setValue(0);
      setLoad(false);
    } else {
      close();
    }
  }

  function close() {
    navigation.goBack();
  }

  const handleText = () => {
    if (readMore && mute) {
      setMute(false);
      setReadMore(false);
    } else if (readMore && !mute) {
    } else if (!readMore && mute) {
      setReadMore(true);
    } else {
      setMute(true);
      setReadMore(true);
    }
  };

  useEffect(() => {
    if (mute == true) {
      progress.stopAnimation();
    } else {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          next();
        }
      });
    }
  }, [mute]);

  const timeDifference = (previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = new Date() - new Date(previous);
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

  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
    onViewSeenBy();
    onViewSeen();
  }, [seenId]);

  useMemo(() => {
    my_storyData?.[0]?.items.sort((a, b) => {
      const aTime = new Date(a.timestamp);
      const bTime = new Date(b.timestamp);

      return aTime - bTime;
    });
  }, [my_storyData]);

  if (my_storyData?.[0]?.items?.length == current) {
    setCurrent(0);
  }

  const onViewSeen = async () => {
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
  };

  const onViewSeenBy = async () => {
    setLoading(true);
    try {
      const storyViewApi = await withoutStringiApiCall({
        route: `story/views/seen_users?id=${seenId}`,
        verb: "GET",
        token: token,
      });

      if (storyViewApi?.responseCode === 200) {
        setStoryViewData(storyViewApi?.payload?.data?.viewers?.data);
        setLoading(false);
      } else {
        console.log("Error: " + storyViewApi);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Toast.show("An error occurred while fetching data");
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration * 1000);
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
                  setMute(!mute);
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
                    setMute(!mute);
                }
              }}
            >
              <Text
                numberOfLines={1}
                style={{
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
          return text.length < 25 ? (
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
              handleText={handleText}
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
    <SafeAreaView style={[styles.modalView, { backgroundColor: COLORS.black }]}>
      {storyViewModal && (
        <Modal
          onSwipeComplete={() => setStoryViewModal(false)}
          swipeDirection="down"
          isVisible={storyViewModal}
          onBackdropPress={toggleStoryViewModal}
          scrollHorizontal={true}
          animationIn="fadeIn"
          animationOut="slideOutDown"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.viewersContainer}>
              <Text style={styles.viewersText}>
                {storyViewData?.length} {t("viewers")}
              </Text>
              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={toggleStoryViewModal}
              >
                <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator size={"large"} color={COLORS.primary} />
              </View>
            ) : (
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.storyViewUsers}>
                  {storyViewData?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setStoryViewModal(false);
                        navigation.navigate("ProfileScreen", {
                          id: item?.id,
                        });
                      }}
                      key={index}
                      style={styles.storyUsersCard}
                    >
                      <FastImage
                        style={styles.storyUsersDP}
                        source={
                          item.profile_picture
                            ? {
                                uri: SITE_URL + item?.profile_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />

                      <View style={styles.userNameTextContainer}>
                        <Text
                          style={styles.storyUsersNameText}
                          numberOfLines={1}
                        >
                          {item?.first_name + " " + item?.last_name}
                        </Text>
                        <Text style={alignment.left}>
                          {timeDifference(item?.pivot?.created_at) +
                            " " +
                            "ago"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {storyViewData?.length === 0 && (
                    <View style={styles.emptyMessageContainer}>
                      <View style={styles.emptyMessageCard}>
                        <Text style={styles.emptyMessageText}>
                          {t("No one has seen this yet!")}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </Modal>
      )}

      <FlatList
        ref={flatRef}
        data={my_storyData || []}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={styles.secondFlist}
        renderItem={({ item, index }) => {
          return (
            <SafeAreaView
              style={{
                width: windowWidth,
                height: windowHeight,
              }}
            >
              {[
                setContent(item?.items),
                setCurrentzitem(item?.currentItem),
                setItemsLenth(item?.items?.length),
                setItemtype(item?.items?.[current]?.type),
                setseenId(item?.items?.[current]?.id),
              ]}

              <View style={styles.barStarter}>
                <View
                  style={{
                    flexDirection: "row",
                    width: wp(96),
                    marginTop: hp(1.9),
                  }}
                >
                  {item.items?.map((index, key) => {
                    return (
                      <View
                        key={key}
                        style={[
                          styles.barStyle,
                          {
                            backgroundColor:
                              current - 1 < key
                                ? item?.items[current]?.seen
                                  ? COLORS.redicalRed
                                  : COLORS.tooDarkGrey
                                : COLORS.primary,
                          },
                        ]}
                      >
                        <Animated.View
                          style={{
                            flex:
                              current == key
                                ? progress
                                : item?.items?.[key]?.finish,
                            height: hp(0.3),
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          }}
                        />
                      </View>
                    );
                  })}
                </View>

                <View style={styles.lastView}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableWithoutFeedback
                      style={styles.buttonView}
                      onPress={() => navigation.goBack()}
                    >
                      {ICONS.antDesign(
                        isRTL ? "arrowright" : "arrowleft",
                        COLORS.white,
                        24,
                        styles.iconStyle
                      )}
                    </TouchableWithoutFeedback>

                    <View style={styles.profileView}>
                      <Image
                        source={{ uri: item.profile_picture }}
                        style={styles.profileStyle}
                      />
                    </View>

                    <View style={styles.userNameView}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.timeStyle}>
                        {timeDifference(item?.items[current]?.timestamp)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      onViewSeenBy(item);
                      toggleStoryViewModal();
                      setMute(true);
                    }}
                    style={{
                      flex: 0.7,
                      height: hp(5),
                      marginLeft: wp(2),
                      alignItems: "center",
                      flexDirection: "row",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    {ICONS.ionIcons("eye-outline", COLORS.white, 24, {
                      marginLeft: wp(5.5),
                    })}

                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 14,
                        paddingLeft: wp(1),
                      }}
                    >
                      {item.items[current]?.seen_count}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setMute(true);
                      navigation.navigate("myStoryDel", {
                        myStoryData: my_storyData,
                      });
                    }}
                    style={{
                      marginRight: wp(7),
                    }}
                  >
                    {ICONS.ionIcons(
                      "ellipsis-vertical",
                      COLORS.white,
                      null,
                      styles.dotStyle
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  width: windowWidth,
                  height: windowHeight,
                }}
              >
                {item?.items?.[current]?.type == "video" ? (
                  <>
                    <Video
                      volume={1.0}
                      rate={1.0}
                      resizeMode="contain"
                      onError={(error) => console.log(error)}
                      play={true}
                      onBuffer={({ isBuffering }) => {
                        console.log(isBuffering, "Buffer issssssss");
                        if (!isBuffering) {
                          console.log("isBuffering is false");
                          setStartVid(true);
                        } else {
                          console.log("isBuffering is true");
                          setStartVid(false);
                        }
                      }}
                      onLoad={onLoad}
                      onEnd={() => {
                        next();
                      }}
                      paused={mute ? true : false}
                      onReadyForDisplay={() => {
                        start();
                        setVideoActivity(null);
                      }}
                      poster={item?.items[current]?.preview}
                      posterStyle={styles.posterStyleA}
                      automaticallyWaitsToMinimizeStalling={true}
                      source={{
                        uri: item.items?.[current]?.src,
                      }}
                      onPlaybackStatusUpdate={(AVPlaybackStatus) => {
                        setLoad(AVPlaybackStatus.isLoaded);
                        setEnd(AVPlaybackStatus.durationMillis);
                      }}
                      style={styles.videoStyle}
                    />

                    {videoActivity ? (
                      <View style={styles.indicatStyle}>
                        <ActivityIndicator
                          size="large"
                          color={COLORS.primary}
                        />
                      </View>
                    ) : null}
                  </>
                ) : item.items?.[current]?.type == "text" ? (
                  <View style={styles.textStyle}>
                    {item.items?.[current]?.colored_pattern?.type == "image" ? (
                      <>
                        {[start()]}
                        <ImageBackground
                          resizeMode="cover"
                          onLoad={() => {
                            start();
                          }}
                          source={{
                            uri:
                              "https://palsome.com/frontend/img/" +
                              item?.items?.[current]?.colored_pattern
                                ?.background_image,
                          }}
                          style={styles.backimgStyle}
                        >
                          <Pressable
                            style={styles.backimgStyle}
                            onPress={() => {
                              setMute(!mute);
                            }}
                          >
                            {renderAutoLink(item.items?.[current])}
                          </Pressable>
                        </ImageBackground>
                      </>
                    ) : (
                      <>
                        {[start()]}
                        <LinearGradient
                          colors={[
                            item?.items?.[current]?.colored_pattern
                              ?.background_color_1
                              ? item.items?.[current]?.colored_pattern
                                  ?.background_color_1
                              : COLORS.blueLight,
                            item.items?.[current]?.colored_pattern
                              ?.background_color_2
                              ? item?.items?.[current]?.colored_pattern
                                  ?.background_color_2
                              : COLORS.royalBlue,
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientstl}
                        >
                          <Pressable
                            style={styles.gradientstl}
                            onPress={() => {
                              setMute(!mute);
                            }}
                          >
                            {renderAutoLink(item.items?.[current])}
                          </Pressable>
                        </LinearGradient>
                      </>
                    )}
                  </View>
                ) : (
                  <View style={styles.mainImage}>
                    <FastImage
                      style={styles.imgSty}
                      onLoadStart={() => setLoad(true)}
                      onLoadEnd={() => {
                        setLoad(false);
                      }}
                      source={{
                        uri: item.items?.[current]?.src,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => previous()}
                style={{
                  zIndex: 2,
                  width: WP(25),

                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  top: HP(18),
                }}
              />

              {item?.items[current]?.type !== "text" && (
                <Pressable
                  onPress={() => {
                    setMute(!mute);
                    setReadMore(false);
                  }}
                  style={{
                    zIndex: 2,
                    alignItems: "center",
                    justifyContent: "center",

                    position: "absolute",
                    bottom: 0,
                    top: HP(18),
                    left: WP(25),
                    right: WP(25),
                  }}
                />
              )}

              <Pressable
                onPress={() => {
                  setIndex(index);
                  next(item);
                  setItemsLenth(item?.items?.length);

                  setItemtype(item.items[current].type);
                  start(item);
                }}
                style={{
                  zIndex: 2,
                  width: WP(25),

                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  top: HP(18),
                }}
              />

              {load ? (
                <View style={styles.indicatStyle}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : null}

              {mute ? (
                <Ionic
                  name="play"
                  size={hp(7)}
                  style={[styles.muteStyle, { padding: mute ? hp(1) : 0 }]}
                />
              ) : null}

              {item?.items[current]?.type !== "text" ? (
                <>
                  {[start()]}
                  {item?.items[current]?.story_text?.length >= 1 ? (
                    <View style={styles.storytxtStyle}>
                      {renderAutoLinkCaption(item?.items[current])}
                    </View>
                  ) : null}
                </>
              ) : null}
            </SafeAreaView>
          );
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  viewersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: HP(5),
    zIndex: 1000,
    width: getWidth(95),
    padding: 10,
  },

  viewersText: {
    fontSize: 17,
    fontWeight: "bold",
  },

  crossIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },

  storyViewUsers: {
    marginTop: 10,
    padding: 10,
  },

  storyUsersCard: {
    width: WP(90),
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },

  storyUsersDP: {
    height: 55,
    width: 55,
    borderRadius: 125,
    resizeMode: "contain",
  },

  storyUsersNameText: {
    fontSize: 16,
    width: getWidth(75),
    fontWeight: "bold",
    paddingRight: 20,
    marginBottom: 2,
    textAlign: "left",
  },

  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyMessageCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  emptyMessageText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },

  posterStyleA: {
    width: wp(100),
    height: hp(50),
  },

  indicatStyle: {
    flex: 1,
    top: hp(40),
    left: wp(40),
    zIndex: 1000,
    width: wp(20),
    height: hp(10),
    borderRadius: 40,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  textStyle: {
    width: wp(100),
    height: hp(100),
  },

  muteStyle: {
    color: COLORS.white,
    position: "absolute",
    top: hp(47),
    left: wp(40),
    backgroundColor: "rgba(52,52,52,0.6)",
    borderRadius: 70,
  },

  storytxtStyle: {
    width: wp(96),
    backgroundColor: "rgba(52,52,52,0.6)",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 10,
    bottom: hp(13),
    padding: 10,
    zIndex: 1000,
  },

  secondFlist: {
    width: wp(100),
    height: hp(100),
    backgroundColor: "Gray",
  },

  barStarter: {
    zIndex: 1,

    position: "absolute",
    left: 0,
    right: 0,
  },

  userNameView: {
    width: wp(32),
    height: hp(6),
    marginLeft: wp(5),
    flexDirection: "column",
  },

  userName: {
    fontWeight: "bold",
    color: "white",
    width: wp(45),
    marginTop: Platform.OS === "ios" ? 10 : 0,
    textAlign: "left",
  },

  backimgStyle: {
    width: wp(100),
    height: hp(100),
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  barStyle: {
    height: 2,
    flex: 1,
    flexDirection: isRTL ? "row-reverse" : "row",
    marginHorizontal: 2,
  },

  dotStyle: {
    fontSize: 20,
    color: COLORS.white,
    opacity: 0.6,
  },

  timeStyle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
    width: wp(45),
    textAlign: "left",
  },

  profileView: {
    width: 38,
    height: 38,
    marginLeft: wp(2),
    borderRadius: 100,
  },

  videoStyle: {
    width: wp(100),
    height: hp(100),
    overflow: "visible",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  mainImage: {
    width: wp(100),
    height: hp(100),
    backgroundColor: COLORS.black,
  },

  gradientstl: {
    width: wp(100),
    height: hp(100),
    justifyContent: "center",
    alignItems: "center",
  },

  imgSty: {
    height: hp(100),
    width: wp(100),
    justifyContent: "center",
  },

  profileStyle: {
    borderRadius: 100,
    resizeMode: "cover",
    width: "92%",
    height: "92%",
  },

  lastView: {
    left: wp(3),
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS == "ios" ? hp(4) : hp(2),
    // Shadow properties
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.45,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 70,
      },
    }),
    backgroundColor: "rgba(60, 60, 60, 0)",
  },
  buttonView: {
    width: wp(6),
    height: hp(4),
    backgroundColor: "green",
  },

  iconStyle: {
    width: wp(8),
    height: hp(5),
    marginLeft: wp(1.8),
    paddingTop: hp(1),
  },
  userNameTextContainer: {
    paddingHorizontal: 10,
  },
});

export default myStory;
