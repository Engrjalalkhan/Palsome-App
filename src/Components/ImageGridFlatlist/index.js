import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Video from "react-native-video";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import AutoHeightImage from "react-native-auto-height-image";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import CustomPlayIcon from "../../Components/CustomPlayIcon";
import ReelsBottomView from "../../Screens/Main/Reels/components/ReelsBottomView";
import SharedReelHeader from "../../Screens/Main/Reels/components/SharedReelHeader";
import AndroidVideoPlayer from "../../Screens/Videos/VideoScreen/AndroidVideoPlayer";

import { HP, WP } from "../../../Utils/Resposive";
import { getHeight } from "../../../Utils/NewResponsive";
import { WidthScreen, HeightScreen } from "../TopBar/Dimensions";

import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { IMAGES } from "../../Constants/Images";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-simple-toast";
import { ICONS } from "../../Constants/Icons";

const ImageGrid = React.memo((props) => {
  const videoRef = useRef(null);

  const { item3 } = props;

  const shared = item3?.post_shared;

  const focused = useIsFocused();
  const navigation = useNavigation();

  const sharedStyle = props.shared_style;
  const token = useSelector((state) => state.auth.userToken);

  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleReelData, setSingleReelData] = useState({});

  useEffect(() => {
    if (!focused) setCurrentIndex(-1);
  }, [focused]);

  const muteVoume = () => {
    if (mute) {
      videoRef?.current?.setNativeProps({ muted: false });
      setMute(false);
    } else {
      videoRef?.current?.setNativeProps({ muted: true });
      setMute(true);
    }
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setCurrentIndex(viewableItems?.[0]?.key);
  }, []);

  const _viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 30,
  };

  const onPressDownload = async (item) => {
    const { dirs } = RNFetchBlob.fs;
    const downloadDir =
      Platform.OS == "ios" ? dirs?.DocumentDir : dirs?.DownloadDir;
    const fileExtension = item.path.split(".").pop();
    let mimeType = "";

    // Set MIME type based on file extension
    switch (fileExtension.toLowerCase()) {
      case "pdf":
        mimeType = "application/pdf";
        break;
      case "png":
        mimeType = "image/png";
        break;

      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        break;

      default:
        mimeType = "application/octet-stream";
        break;
    }

    RNFetchBlob.config({
      fileCache: true,
      mime: "",
      path: `${downloadDir}/${item?.title}`,
      notification: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${downloadDir}/${item?.title}`,
        description: "File downloaded by download manager.",
        mime: "",
      },
    })
      .fetch("GET", `${SITE_URL}${item.path}`)
      .then((res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.openDocument(res.data);
        }
      })
      .catch((err) => {
        Toast.show("Downloading canceled");
      });
    Toast.show("Downloading...", Toast.SHORT);
  };

  return (
    <SafeAreaView>
      {props?.data?.length < 5 ? (
        <>
          <FlatList
            key={props?.data?.length}
            data={props?.data}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewabilityConfig}
            keyExtractor={(item, index) => index.toString()}
            listKey={(item) => item.toString()}
            renderItem={({ item, index }) =>
              index < 4 ? (
                <View style={styles.list}>
                  {item?.post_file_type === "image" ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);
                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        } else props?.imageModelShow(props?.data, index);
                      }}
                    >
                      {props?.data?.length == 1 ? (
                        <AutoHeightImage
                          width={
                            props?.shared
                              ? props?.profile
                                ? WidthScreen * 0.88
                                : WidthScreen * 0.915
                              : WidthScreen * 0.995
                          }
                          source={{
                            uri: SITE_URL + item.path,
                          }}
                          maxHeight={HeightScreen * 0.8}
                          style={[
                            {
                              alignSelf: "center",
                            },
                            sharedStyle,
                          ]}
                        />
                      ) : (
                        <FastImage
                          resizeMode="cover"
                          style={[styles.imageThumbnail]}
                          source={{
                            uri: SITE_URL + item.path,
                          }}
                        />
                      )}
                    </TouchableWithoutFeedback>
                  ) : item?.post_file_type === "palsome_ai" ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);
                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        } else props?.imageModelShow(props?.data, index);
                      }}
                    >
                      {props?.data?.length == 1 ? (
                        <AutoHeightImage
                          width={
                            props?.shared
                              ? props?.profile
                                ? WidthScreen * 0.88
                                : WidthScreen * 0.915
                              : WidthScreen * 0.995
                          }
                          source={{
                            uri: SITE_URL + item.path,
                          }}
                          maxHeight={HeightScreen * 0.8}
                          style={[
                            {
                              alignSelf: "center",
                            },
                            sharedStyle,
                          ]}
                        />
                      ) : (
                        <FastImage
                          resizeMode="cover"
                          style={[styles.imageThumbnail]}
                          source={{
                            uri: SITE_URL + item.path,
                          }}
                        />
                      )}
                    </TouchableWithoutFeedback>
                  ) : item?.post_file_type === "post" ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);
                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        } else props?.imageModelShow(props?.data, index);
                      }}
                    >
                      {props?.data?.length == 1 ? (
                        <AutoHeightImage
                          width={
                            props?.shared
                              ? props?.profile
                                ? WidthScreen * 0.88
                                : WidthScreen * 0.915
                              : WidthScreen * 0.995
                          }
                          source={{
                            uri: item.path,
                          }}
                          maxHeight={HeightScreen * 0.8}
                          style={[
                            {
                              alignSelf: "center",
                            },
                            sharedStyle,
                          ]}
                          // style={sharedStyle}
                        />
                      ) : (
                        <FastImage
                          resizeMode="cover"
                          style={[styles.imageThumbnail]}
                          source={{
                            uri: item.path,
                          }}
                        />
                      )}
                    </TouchableWithoutFeedback>
                  ) : item?.post_file_type === "file" ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);
                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        } else props?.imageModelShow(props?.data, index);
                      }}
                    >
                      {props?.data?.length == 1 ? (
                        (() => {
                          const fileExtension = item?.title?.split(".").pop();
                          return (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              onPress={() => onPressDownload(item)}
                              style={styles.elevation}
                            >
                              <View
                                style={[
                                  styles.imgContainerStyle,
                                  {
                                    marginHorizontal:
                                      !props?.room && !props?.group ? 10 : 0,
                                  },
                                ]}
                              >
                                {fileExtension === "pdf" ? (
                                  <FastImage
                                    source={IMAGES.pdfFile}
                                    style={styles.pdfImgStyle}
                                  />
                                ) : fileExtension === "txt" ? (
                                  ICONS.antDesign(
                                    "filetext1",
                                    COLORS.black,
                                    40,
                                    {
                                      color: COLORS.primary,
                                    }
                                  )
                                ) : fileExtension === "docx" ? (
                                  ICONS.antDesign(
                                    "wordfile1",
                                    COLORS.black,
                                    40,
                                    {
                                      color: COLORS.primary,
                                    }
                                  )
                                ) : (
                                  ICONS.antDesign(
                                    "filetext1",
                                    COLORS.black,
                                    40,
                                    {
                                      color: COLORS.primary,
                                    }
                                  )
                                )}

                                <Text style={styles.fileTitle}>
                                  {item?.title}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })()
                      ) : (
                        <FastImage
                          resizeMode="cover"
                          style={[styles.imageThumbnail]}
                          source={{
                            uri: item.path,
                          }}
                        />
                      )}
                    </TouchableWithoutFeedback>
                  ) : (
                    <>
                      {props?.data?.length > 1 ? (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            if (props?.data?.length > 1) {
                              props.fetchApiForGrid(item, index);

                              navigation.navigate("ImgGridModelScreen", {
                                ...props,
                                myIndex: index,
                                singlePostData: props?.data,
                              });
                            }
                          }}
                        >
                          <FastImage
                            resizeMode="cover"
                            style={styles.imageThumbnailPost}
                            source={{
                              uri:
                                SITE_URL +
                                "converted_videos/thumbnails/" +
                                item?.thumb_path,
                            }}
                          >
                            <CustomPlayIcon
                              sizeCicle={HeightScreen * 0.07}
                              sizeIcon={HeightScreen * 0.035}
                              onPress={() => {
                                if (props?.data?.length > 1) {
                                  props.fetchApiForGrid(item, index);

                                  navigation.navigate("ImgGridModelScreen", {
                                    ...props,
                                    myIndex: index,
                                    singlePostData: props?.data,
                                  });
                                }
                              }}
                            />
                          </FastImage>
                        </TouchableWithoutFeedback>
                      ) : (
                        <>
                          {Platform.OS == "ios" ? (
                            <>
                              {item?.disk == "processed_reels" && (
                                <View
                                  style={[
                                    styles.reelContainer,
                                    props?.singlePostStyle,
                                  ]}
                                >
                                  <SharedReelHeader
                                    voumeUp={muteVoume}
                                    muteVoume={muteVoume}
                                    mute={!mute}
                                    group={props?.group}
                                  />
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCurrentIndex(null);
                                      if (singleReelData) {
                                        navigation.push("ReelsNav", {
                                          params: {
                                            item:
                                              shared !== null
                                                ? item3?.post_shared
                                                : item3,
                                          },
                                          screen: "ReelsIndex",
                                        });
                                      }
                                    }}
                                    style={{
                                      backgroundColor: COLORS.black,
                                      marginTop: 1,
                                    }}
                                  >
                                    <Video
                                      onTouchStart={() => {
                                        setIsPlaying(!isPlaying);
                                        if (isPlaying) {
                                          setCurrentIndex(index);
                                        }
                                        if (!isPlaying) {
                                          setCurrentIndex(!index);
                                        }
                                      }}
                                      style={{
                                        height: HP(58),
                                        // width: WP(90),
                                        backgroundColor: COLORS.black,
                                        position: "relative",
                                        marginTop: 10,
                                      }}
                                      ref={videoRef}
                                      source={{
                                        uri: SITE_URL + item?.path,
                                      }}
                                      controls={false}
                                      repeat={true}
                                      volume={2}
                                      paused={
                                        currentIndex == index ? false : true
                                      }
                                      resizeMode="contain"
                                      muted={!mute}
                                    />
                                  </TouchableOpacity>
                                  {props?.item3 && props?.item3?.post_shared ? (
                                    <View
                                      style={{
                                        marginTop: 60,
                                        marginRight: 20,
                                      }}
                                    >
                                      <ReelsBottomView
                                        title={
                                          props?.item3?.post_shared?.post_text
                                        }
                                        name={
                                          props?.item3?.post_shared?.user
                                            ?.first_name +
                                          " " +
                                          props?.item3?.post_shared?.user
                                            ?.last_name
                                        }
                                      />
                                    </View>
                                  ) : null}

                                  <Text>{item?.post_text}</Text>
                                </View>
                              )}
                              {item?.stream_path240 != null ? (
                                <AndroidVideoPlayer
                                  source={{
                                    uri:
                                      SITE_URL +
                                      "converted_videos/" +
                                      item?.stream_path240,
                                  }}
                                  style={{
                                    height: getHeight(45),
                                    backgroundColor: COLORS.transparent,
                                  }}
                                  controls={true}
                                  resizeMode={"contain"}
                                  poster={
                                    SITE_URL +
                                    "converted_videos/thumbnails/" +
                                    item?.thumb_path
                                  }
                                  myIndex={props?.myVideoIndex}
                                  index={props?.NewsFeedIndex}
                                />
                              ) : (
                                item?.stream_path720 != null && (
                                  <AndroidVideoPlayer
                                    source={{
                                      uri:
                                        SITE_URL +
                                        "converted_videos/" +
                                        item?.stream_path720,
                                    }}
                                    style={{
                                      height: getHeight(45),
                                      backgroundColor: COLORS.transparent,
                                    }}
                                    controls={true}
                                    resizeMode={"contain"}
                                    poster={
                                      SITE_URL +
                                      "converted_videos/thumbnails/" +
                                      item?.thumb_path
                                    }
                                    myIndex={props?.myVideoIndex}
                                    index={props?.NewsFeedIndex}
                                  />
                                )
                              )}
                            </>
                          ) : (
                            <View
                              style={{
                                backgroundColor: COLORS.transparent,
                              }}
                            >
                              <>
                                {item?.stream_path240 != null ? (
                                  <>
                                    <AndroidVideoPlayer
                                      source={{
                                        uri:
                                          SITE_URL +
                                          "converted_videos/" +
                                          item?.stream_path240,
                                      }}
                                      style={{
                                        height: 300,
                                        // width: 300,
                                        backgroundColor: COLORS.transparent,
                                      }}
                                      controls={true}
                                      resizeMode={"contain"}
                                      poster={
                                        SITE_URL +
                                        "converted_videos/thumbnails/" +
                                        item?.thumb_path
                                      }
                                      myIndex={props?.myVideoIndex}
                                      index={props?.NewsFeedIndex}
                                    />
                                  </>
                                ) : item?.stream_path720 != null ? (
                                  <AndroidVideoPlayer
                                    source={{
                                      uri:
                                        SITE_URL +
                                        "converted_videos/" +
                                        item?.stream_path720,
                                    }}
                                    style={{
                                      height: 300,
                                      backgroundColor: COLORS.transparent,
                                    }}
                                    controls={true}
                                    resizeMode={"contain"}
                                    poster={
                                      SITE_URL +
                                      "converted_videos/thumbnails/" +
                                      item?.thumb_path
                                    }
                                    myIndex={props?.myVideoIndex}
                                    index={props?.NewsFeedIndex}
                                  />
                                ) : item?.path != null ? (
                                  // <SafeAreaView>
                                  <View style={styles.reelContainer}>
                                    <SharedReelHeader
                                      voumeUp={muteVoume}
                                      muteVoume={muteVoume}
                                      mute={!mute}
                                    />

                                    <TouchableOpacity
                                      onPress={() => {
                                        setCurrentIndex(null);
                                        if (singleReelData) {
                                          navigation.push("ReelsNav", {
                                            params: {
                                              item:
                                                shared !== null
                                                  ? item3?.post_shared
                                                  : item3,
                                            },
                                            screen: "ReelsIndex",
                                          });
                                        }
                                      }}
                                      style={{
                                        backgroundColor: COLORS.black,
                                        marginTop: 1,
                                      }}
                                    >
                                      <Video
                                        style={{
                                          height: HP(58),
                                          // width: WP(90),
                                          backgroundColor: COLORS.black,
                                          position: "relative",
                                        }}
                                        ref={videoRef}
                                        source={{
                                          uri: SITE_URL + item?.path,
                                        }}
                                        poster={SITE_URL + item?.thumb_path}
                                        controls={false}
                                        repeat={true}
                                        volume={2}
                                        paused={
                                          currentIndex == index ? false : true
                                        }
                                        resizeMode="contain"
                                        muted={!mute}
                                      />
                                    </TouchableOpacity>
                                    {props?.item3 &&
                                    props?.item3?.post_shared ? (
                                      <View
                                        style={{
                                          marginTop: 60,
                                          marginRight: 20,
                                        }}
                                      >
                                        <ReelsBottomView
                                          title={
                                            props?.item3?.post_shared?.post_text
                                          }
                                          name={
                                            props?.item3?.post_shared?.user
                                              .first_name +
                                            " " +
                                            props?.item3?.post_shared?.user
                                              ?.last_name
                                          }
                                        />
                                      </View>
                                    ) : null}
                                    <Text>{item?.post_text}</Text>
                                  </View>
                                ) : null}
                              </>
                            </View>
                          )}
                        </>
                      )}
                    </>
                  )}
                </View>
              ) : index == 4 && item?.post_file_type == "video" ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props.data.length > 1) {
                      props.fetchApiForGrid(item, index);

                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    }
                  }}
                >
                  <ImageBackground
                    source={{
                      uri:
                        SITE_URL +
                        "converted_videos/thumbnails/" +
                        item?.thumb_path,
                    }}
                    resizeMode="cover"
                    style={styles.backGroundImg}
                  >
                    <View style={styles.backGroundImgView}>
                      <Text style={styles.txt}>{props?.data?.length - 4}+</Text>
                    </View>
                  </ImageBackground>
                </TouchableWithoutFeedback>
              ) : index == 4 && item?.post_file_type == "image" ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props?.data?.length > 1) {
                      props.fetchApiForGrid(item, index);

                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    } else props?.imageModelShow(props?.data, index);
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: SITE_URL + item?.path,
                    }}
                    resizeMode="cover"
                    style={styles.backGroundImg}
                  >
                    <View style={styles.backGroundImgView}>
                      <Text style={styles.txt}>{props?.data?.length - 4}+</Text>
                    </View>
                  </ImageBackground>
                </TouchableWithoutFeedback>
              ) : item?.post_file_type === "post" ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props?.data?.length > 1) {
                      props.fetchApiForGrid(item, index);
                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    } else {
                    }
                  }}
                >
                  {props?.data?.length == 1 ? (
                    <AutoHeightImage
                      width={
                        props?.shared
                          ? props?.profile
                            ? WidthScreen * 0.88
                            : WidthScreen * 0.915
                          : WidthScreen * 0.995
                      }
                      source={{
                        uri: item.path,
                      }}
                      maxHeight={HeightScreen * 0.8}
                      style={[
                        {
                          alignSelf: "center",
                        },
                        sharedStyle,
                      ]}
                      // style={sharedStyle}
                    />
                  ) : (
                    <FastImage
                      resizeMode="cover"
                      style={[styles.imageThumbnail]}
                      source={{
                        uri: item.path,
                      }}
                    />
                  )}
                </TouchableWithoutFeedback>
              ) : null
            }
            numColumns={props?.data?.length > 4 ? 3 : 3 ? 2 : 1}
          />
        </>
      ) : (
        <FlatList
          key={props?.data?.length}
          data={props?.data}
          listKey={(item) => "d" + item.toString()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>
            index < 3 ? (
              <View style={styles.list}>
                {item?.post_file_type === "image" ? (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (props?.data?.length > 1) {
                        props.fetchApiForGrid(item, index);
                        navigation.navigate("ImgGridModelScreen", {
                          ...props,
                          myIndex: index,
                          singlePostData: props?.data,
                        });
                      } else props.imageModelShow(props?.data, index);
                    }}
                  >
                    <FastImage
                      resizeMode="cover"
                      style={[styles.imageThumbnail]}
                      source={{
                        uri: SITE_URL + item?.path,
                      }}
                    />
                  </TouchableWithoutFeedback>
                ) : item?.post_file_type === "palsome_ai" ? (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (props?.data?.length > 1) {
                        props.fetchApiForGrid(item, index);
                        navigation.navigate("ImgGridModelScreen", {
                          ...props,
                          myIndex: index,
                          singlePostData: props?.data,
                        });
                      } else props?.imageModelShow(props?.data, index);
                    }}
                  >
                    {props?.data?.length == 1 ? (
                      <AutoHeightImage
                        width={
                          props?.shared
                            ? props?.profile
                              ? WidthScreen * 0.88
                              : WidthScreen * 0.915
                            : WidthScreen * 0.995
                        }
                        source={{
                          uri: SITE_URL + item.path,
                        }}
                        maxHeight={HeightScreen * 0.8}
                        style={[
                          {
                            alignSelf: "center",
                          },
                          sharedStyle,
                        ]}
                      />
                    ) : (
                      <FastImage
                        resizeMode="cover"
                        style={[styles.imageThumbnail]}
                        source={{
                          uri: SITE_URL + item.path,
                        }}
                      />
                    )}
                  </TouchableWithoutFeedback>
                ) : item?.post_file_type === "post" ? (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (props?.data?.length > 1) {
                        props.fetchApiForGrid(item, index);
                        navigation.navigate("ImgGridModelScreen", {
                          ...props,
                          myIndex: index,
                          singlePostData: props?.data,
                        });
                      } else {
                      }
                    }}
                  >
                    {props?.data?.length == 1 ? (
                      <AutoHeightImage
                        width={
                          props?.shared
                            ? props?.profile
                              ? WidthScreen * 0.88
                              : WidthScreen * 0.915
                            : WidthScreen * 0.995
                        }
                        source={{
                          uri: item.path,
                        }}
                        maxHeight={HeightScreen * 0.8}
                        style={[
                          {
                            alignSelf: "center",
                          },
                          sharedStyle,
                        ]}
                        // style={sharedStyle}
                      />
                    ) : (
                      <FastImage
                        resizeMode="cover"
                        style={[styles.imageThumbnail]}
                        source={{
                          uri: item.path,
                        }}
                      />
                    )}
                  </TouchableWithoutFeedback>
                ) : (
                  <>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);

                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        }
                      }}
                    >
                      <FastImage
                        resizeMode="cover"
                        style={{
                          aspectRatio: 1.2,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        source={{
                          uri:
                            SITE_URL +
                            "converted_videos/thumbnails/" +
                            item.thumb_path,
                        }}
                      >
                        <CustomPlayIcon
                          sizeCicle={HeightScreen * 0.065}
                          sizeIcon={HeightScreen * 0.025}
                          onPress={() => {
                            if (props.data.length > 1) {
                              props.fetchApiForGrid(item, index);

                              navigation.navigate("ImgGridModelScreen", {
                                ...props,
                                myIndex: index,
                                singlePostData: props.data,
                              });
                            }
                          }}
                        />
                      </FastImage>
                    </TouchableWithoutFeedback>
                  </>
                )}
              </View>
            ) : index == 3 && item?.post_file_type == "video" ? (
              <View style={{ height: getHeight(16), flex: 1, margin: 1 }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props?.data?.length > 1) {
                      props.fetchApiForGrid(item, index);

                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    }
                  }}
                >
                  <FastImage
                    resizeMode="cover"
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    source={{
                      uri:
                        SITE_URL +
                        "converted_videos/thumbnails/" +
                        item?.thumb_path,
                    }}
                  >
                    <CustomPlayIcon
                      sizeCicle={HeightScreen * 0.065}
                      sizeIcon={HeightScreen * 0.025}
                      onPress={() => {
                        if (props?.data?.length > 1) {
                          props.fetchApiForGrid(item, index);

                          navigation.navigate("ImgGridModelScreen", {
                            ...props,
                            myIndex: index,
                            singlePostData: props?.data,
                          });
                        }
                      }}
                    />
                  </FastImage>
                </TouchableWithoutFeedback>
              </View>
            ) : index == 3 && item?.post_file_type == "image" ? (
              <View style={{ height: getHeight(16), flex: 1, margin: 1 }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props?.data?.length > 1) {
                      props.fetchApiForGrid(item, index);

                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    } else props.imageModelShow(props.data, index);
                  }}
                >
                  <FastImage
                    resizeMode="cover"
                    style={{ flex: 1 }}
                    source={{
                      uri: SITE_URL + item?.path,
                    }}
                  />
                </TouchableWithoutFeedback>
              </View>
            ) : index == 3 && item?.post_file_type === "post" ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (props?.data?.length > 1) {
                    props.fetchApiForGrid(item, index);
                    navigation.navigate("ImgGridModelScreen", {
                      ...props,
                      myIndex: index,
                      singlePostData: props?.data,
                    });
                  } else {
                  }
                }}
              >
                {props?.data?.length == 1 ? (
                  <AutoHeightImage
                    width={
                      props?.shared
                        ? props?.profile
                          ? WidthScreen * 0.88
                          : WidthScreen * 0.915
                        : WidthScreen * 0.995
                    }
                    source={{
                      uri: item.path,
                    }}
                    maxHeight={HeightScreen * 0.8}
                    style={[
                      {
                        alignSelf: "center",
                      },
                      sharedStyle,
                    ]}
                    // style={sharedStyle}
                  />
                ) : (
                  <FastImage
                    resizeMode="cover"
                    style={[styles.imageThumbnail]}
                    source={{
                      uri: item.path,
                    }}
                  />
                )}
              </TouchableWithoutFeedback>
            ) : index == 4 ? (
              <ImageBackground
                source={{
                  uri:
                    item?.post_file_type == "video"
                      ? SITE_URL +
                        "converted_videos/thumbnails/" +
                        item?.thumb_path
                      : item?.post_file_type == "image"
                      ? SITE_URL + item?.path
                      : null,
                }}
                resizeMode="cover"
                style={{
                  justifyContent: "center",
                  flex: 1,
                  margin: 1,
                  marginLeft: 0.5,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (props?.data?.length > 1) {
                      props.fetchApiForGrid(item, index);

                      navigation.navigate("ImgGridModelScreen", {
                        ...props,
                        myIndex: index,
                        singlePostData: props?.data,
                      });
                    }
                  }}
                >
                  <View style={styles.backGroundImgViewThree}>
                    <Text style={styles.txt}>{props?.data?.length - 4}+</Text>
                  </View>
                </TouchableWithoutFeedback>
              </ImageBackground>
            ) : null
          }
          numColumns={props.data.length > 4 ? 3 : 3 ? 2 : 1}
        />
      )}
    </SafeAreaView>
  );
});

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  list: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageThumbnailThree: {
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    aspectRatio: 1.2,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  imageThumbnailPost: {
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  imageThumbnailPostMap: {
    justifyContent: "center",
    alignItems: "center",
    height: 210,
  },
  txt: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: "bold",
  },
  backGroundImg: {
    justifyContent: "center",
    width: WidthScreen * 0.45,
  },
  backGroundImgView: {
    backgroundColor: COLORS.transparent,
    height: 190,
    justifyContent: "center",
    alignItems: "center",
  },
  backGroundImgThree: {
    justifyContent: "center",
    width: WidthScreen * 0.565,
    height: 140,
  },
  backGroundImgViewThree: {
    backgroundColor: COLORS.transparent,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //// ============= FIle

  elevation: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  imgContainerStyle: {
    height: WP(20.7),
    // width: WP(95),

    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: "flex-start",
    padding: 15,
    alignItems: "center",
    backgroundColor: COLORS.white,
    flexDirection: "row",
  },
  pdfImgStyle: { resizeMode: "contain", height: 60, width: 50 },

  // =============reel shared
  reelContainer: {
    height: HP(60),
    backgroundColor: COLORS.black,
  },
  reelHeaderContainer: {
    position: "absolute",
    top: 0,
    width: WP(100),
    zIndex: 1,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  img: { width: WP(90), height: HP(60) },
  fileTitle: {
    paddingLeft: 10,
    width: 330,
    textAlign: "left",
  },
});
