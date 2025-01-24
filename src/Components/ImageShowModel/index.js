import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { FlatList, View, Modal, Text } from "react-native";
import LikeComShare from "../LikeComShare";
import FastImage from "react-native-fast-image";
import { HeightScreen, WidthScreen } from "../TopBar/Dimensions";
import VideoPlayer from "react-native-video-player";
import GestureRecognizer from "react-native-swipe-gestures";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";

const ImageShowModel = (props) => {
  const {
    isPictureModell,
    singlePostData,
    setIsPictureModell,
    setIsModel,
    setPostId,
    handleLike,
    handleShare,
    isModell,
    myIndex,
    setImageGridIndex,
  } = props;

  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
    gestureIsClickThreshold: 1,
  };

  const flatlistRef = useRef();

  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 750 * index,
    index,
  });

  const scrollToIndex = () => {
    flatlistRef?.current?.scrollToIndex({ animated: true, index: myIndex });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToIndex();
    }, 500);
  }, [myIndex]);

  return (
    <SafeAreaView>
      <GestureRecognizer
        style={{ flex: 1 }}
        onSwipeDown={() => {
          setIsPictureModell(false);
          setImageGridIndex(0);
        }}
        config={config}
      >
        <Modal
          animationType="slide"
          presentationStyle="formSheet"
          transparent={false}
          visible={isPictureModell}
          onRequestClose={() => {
            setIsPictureModell(!isPictureModell);
            setImageGridIndex(0);
          }}
        >
          <FlatList
            ref={flatlistRef}
            getItemLayout={getItemLayout}
            data={singlePostData}
            renderItem={({ item, index }) => (
              <View style={styles.list}>
                {item.post_file_type === "image" ? (
                  <View style={{ marginBottom: 10 }}>
                    <FastImage
                      resizeMode="contain"
                      style={styles.imageThumbnail}
                      source={{
                        uri: SITE_URL + item.path,
                      }}
                    />
                    <LikeComShare
                      likePress={() => handleLike()}
                      commentPress={() => {
                        setIsModel(!isModell), setPostId(item?.encrypted_id);
                      }}
                      sharePress={() => handleShare()}
                      likesCount={singlePostData?.post_reactions_count}
                      commentsCount={singlePostData?.comments_count}
                      shareCount={singlePostData?.shared_post_count}
                      color={COLORS.primary}
                    />
                  </View>
                ) : item.post_file_type === "post" ? (
                  <View>
                    <FastImage
                      resizeMode="center"
                      style={styles.imageThumbnail}
                      source={{
                        uri: item.path,
                      }}
                    />
                    <LikeComShare
                      likePress={() => handleLike()}
                      commentPress={() => {
                        setIsModel(!isModell),
                          setPostId(singlePostData?.encrypted_id);
                      }}
                      sharePress={() => handleShare()}
                      likesCount={singlePostData?.post_reactions_count}
                      commentsCount={singlePostData?.comments_count}
                      shareCount={singlePostData?.shared_post_count}
                      color={COLORS.primary}
                    />
                  </View>
                ) : (
                  <View>
                    <VideoPlayer
                      video={{
                        uri:
                          SITE_URL + "converted_videos/" + item.stream_path360,
                      }}
                      muted={false}
                      repeat={false}
                      resizeMode={"contain"}
                      volume={9.0}
                      rate={1.0}
                      ignoreSilentSwitch={"ignore"}
                      videoWidth={3000}
                      videoHeight={1900}
                      disableControlsAutoHide={true}
                      disableFullscreen={false}
                      style={styles.imageThumbnail}
                      thumbnail={{
                        uri:
                          SITE_URL +
                          "converted_videos/thumbnails/" +
                          item.thumb_path,
                      }}
                    />
                    <LikeComShare
                      likePress={() => handleLike()}
                      commentPress={() => {
                        setIsModel(!isModell),
                          setPostId(singlePostData?.encrypted_id);
                      }}
                      sharePress={() => handleShare()}
                      likesCount={singlePostData?.post_reactions_count}
                      commentsCount={singlePostData?.comments_count}
                      shareCount={singlePostData?.shared_post_count}
                      color={COLORS.primary}
                    />
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </Modal>
      </GestureRecognizer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ModelContanier: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    backgroundColor: "transparent",
    left: 0,
    right: 0,
    flex: 1,

    // height: HP(15),
    bottom: 0,
    shadowColor: COLORS.transparent,
    shadowOffset: {
      width: 0,
      height: 98,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 26.5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  list: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: COLORS.lightGray,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: HeightScreen * 0.85,
  },
  backGroundImg: {
    justifyContent: "center",
    width: WidthScreen,
  },
  txt: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: "bold",
  },
  backGroundImgView: {
    backgroundColor: COLORS.transparent,
    height: HeightScreen,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageShowModel;
