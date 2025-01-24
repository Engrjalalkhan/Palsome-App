/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import SimpleToast from "react-native-simple-toast";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import { HP, WP } from "../../../../Utils/Resposive";
import ComentModel from "../../../Components/ComentModel";
import Loader from "../../../Components/Loader";
import ShareModel from "../../../Components/ShareModel";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { fetchComments } from "../../../Redux/actions/NewsFeedActions";
import Clipboard from "@react-native-clipboard/clipboard";

import {
  deleteReel,
  getReelsCommentsReq,
  getReelsDataRequest,
  reelViewCount,
  updateReel,
} from "../../../Redux/actions/ReelsActions";

import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { SHARE_URL, SITE_URL } from "../../../Services/Constants";
import LikeCommentShare from "./components/LikeCommentShare";
import ReelsBottomView from "./components/ReelsBottomView";
import ReelsDotMenuModal from "./components/ReelsDotMenuModal";
import ReelsHeader from "./components/ReelsHeader";
import LogoutModal from "../../../Components/LogoutModal";
import ReelEditModal from "./components/ReelEditModal";
import { useFocusEffect } from "@react-navigation/native";
import VideoPlayer from "react-native-video-player";
import { useTranslation } from "react-i18next";

import Toast from "react-native-simple-toast";
import { getHeight } from "../../../../Utils/NewResponsive";
import DeviceInfo from "react-native-device-info";
import { ActivityIndicator } from "react-native";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Reels = (props) => {
  const { t } = useTranslation();

  const reelItem = props?.route?.params?.item;
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state.auth.userToken);
  const reelsData = useSelector((state) => state.reelsRed.reelsData);

  const user_id = useSelector((state) => state.auth.userData.id);

  const [current_User_ID, setCurrent_User_ID] = useState(null);
  const [loading, setLoading] = useState(
    props?.route?.params?.userReels ? true : false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mute, setMute] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flatListData, setFlatListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentReelId, setCurrentReelId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentReelEncryptedId, setCurrentReelEncryptedId] = useState(null);
  const [currentReelValue, setCurrentReelValue] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [isReelLiked, setIsReelLiked] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pause, setPause] = useState(true);
  const [play, setPlay] = useState(true);
  const [likePosts, setLikedPost] = useState(0);
  const [reactCount, setReactCount] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [updatedText, setUpdatedText] = useState("");
  const [userReelsData, setUserReelsData] = useState([]);
  const [current_page, setCurrent_page] = useState(1);
  const [last_page, setLast_page] = useState();
  const [isPhoneHasButton, setIsPhoneHasButton] = useState(false);
  const [deviceModel, setDeviceModel] = useState();
  const [isVideoLoading, setIsVideoLoading] = useState(true); // Initially set to false
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  useEffect(() => {
    route;
  }, []);

  useEffect(() => {
    const getDeviceModel = DeviceInfo.getModel();
    setDeviceModel(getDeviceModel);
  }, []);
  const getVideoHeight = () => {
    if (Platform.OS === "ios") {
      if (deviceModel === "iPhone 8 Plus") {
        return getHeight(297);
      } else if (deviceModel === "iPhone 8") {
        return getHeight(328);
      } else {
        return getHeight(270);
      }
    } else {
      return getHeight(350);
    }
  };

  useEffect(() => {
    increaseCount();
  }, [currentReelId]);

  useEffect(() => {
    if (refreshData) {
      if (nextPage > 1) {
      } else {
        dispatch(
          getReelsDataRequest({
            token,
            currentPage: nextPage,
          })
        );
      }
      setRefreshData(false);
    }
  }, [refreshData]);

  useEffect(() => {
    if (reelsData?.data?.length > 0) {
      const item = reelsData?.data[currentIndex];
      setLikedPost(item?.post_reactions_count || 0);
    }
  }, [reelsData, currentIndex]);

  // useEffect(() => {
  //   getReelsDataApi();
  // }, [currentPage]);

  const getReelsDataApi = () => {
    dispatch(
      getReelsDataRequest({
        token,
        setLoading,
        currentPage: 1,
      })
    );
  };

  useEffect(() => {
    if (showCommentModal) {
      dispatch(
        getReelsCommentsReq({
          token,
          reelId: currentReelEncryptedId,
        })
      );
      const data_target = "comment";
      dispatch(
        dispatch(
          fetchComments({
            token,
            id: currentReelEncryptedId,
            data_target: data_target,
            page: 0,
          })
        )
      );
    }
  }, [
    route?.params?.item?.comments_count,
    route?.params?.item?.replies_count,
    showCommentModal,
  ]);

  const onBuffer = (msg) => {
    // console.log("onBuffer", msg);
  };

  const handleLoad = (e) => {
    setIsVideoLoading(false);
  };

  const videoError = (e) => {
    // console.log("videoError", e);
  };

  const muteVoume = () => {
    setMute(!mute);
    // if (mute) {
    //   videoRef?.current?.setNativeProps({ muted: false });
    //   setMute(false);
    // } else {
    //   videoRef?.current?.setNativeProps({ muted: true });
    //   setMute(true);
  };

  const onChangeIndex = ({ index, prevIndex }) => {
    setCurrentIndex(index);
  };

  const getReels = async (page) => {
    const response = await withoutStringiApiCall2({
      route: `reel?page=${page}`,
      verb: "GET",
      token: token,
    });
    const lastPage = response?.payload?.data?.public_reels?.last_page;
    if (response?.responseCode === 200) {
      if (lastPage > nextPage) {
        const data = response?.payload?.data?.public_reels?.data;
        setFlatListData((prevData) => [...prevData, ...data]);
      } else if (
        lastPage < nextPage ||
        response?.payload?.data?.public_reels?.data === []
      ) {
        SimpleToast.show("No more reels available");
      }
    } else if (response.responseCode !== 200 && nextPage > lastPage) {
      setIsLoading(true);
    }
  };

  const getUserReelsDataApi = useCallback(async () => {
    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/${props?.route?.params?.userReels}/reels?page=${current_page}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("Error In UserClip Api", res);
        setLoading(false);
      } else if (res.responseCode == 200) {
        setLoading(false);
        setLast_page(res.payload?.data?.reels?.last_page);

        let newData = res.payload?.data?.reels?.data ?? [];
        if (newData.length > 0) {
          newData = newData.filter(
            (item) => item?.id !== route?.params?.item?.id
          );
          newData = [route?.params?.item, ...newData];
          setUserReelsData([...userReelsData, ...newData]);
        } else {
          if (userReelsData?.length > 0) {
            setUserReelsData([...newData, ...userReelsData]);
          } else {
            setUserReelsData(...userReelsData, ...newData);
          }
        }
      }
    } catch (e) {
      console.log("UserReels error -- ", e.toString());
    }
  });

  useEffect(() => {
    let newData = reelsData?.data ?? [];

    if (newData.length > 0) {
      newData = newData.filter((item) => item?.id !== route?.params?.item?.id);
      newData = [route?.params?.item, ...newData];
      setFlatListData(newData);
    } else {
      if (flatListData?.length > 1) {
        setFlatListData([...reelsData?.data, ...flatListData]);
      } else if (reelsData?.length > 0) {
        setFlatListData(reelsData?.data);
      } else {
        setFlatListData([reelItem]);
      }
    }
  }, [reelsData, route?.params?.item?.id]);

  {
    props?.route?.params?.userReels &&
      useFocusEffect(
        React.useCallback(() => {
          getUserReelsDataApi();
          return () => {};
        }, [current_page])
      );
  }

  const handleLoadMore = () => {
    if (props?.route?.params?.userReels) {
      setCurrent_page(current_page + 1);
    } else {
      setIsLoading(true);
      setNextPage(nextPage + 1);
      getReels(nextPage + 1);
    }
  };

  const onPressMenuModal = () => {
    setShowModal(true);
  };

  const copyLink = (id) => {
    setTimeout(() => {
      let url = `${SHARE_URL}/en/news_feed/post/${id}`;
      Clipboard.setString(url);
      SimpleToast.show(t("Link copied"));
    }, 500);
    setShowModal(false);
  };

  const editReel = (id) => {
    setShowModal(false);
    setTimeout(() => {
      setEditModal(true);
    }, 0);
  };
  const onPressUpdate = (id) => {
    // if (updatedText?.length > 0) {
    dispatch(
      updateReel({
        token,
        reelId: id,
        description: updatedText,
        setLoading,
        refresh: refreshFn(),
      })
    );
    setShowModal(false);
    setEditModal(false);
    {
      props?.route?.params?.userReels &&
        updatedText?.length &&
        navigation.goBack();
    }
    // } else {
    //   Toast.show("The clip description is required", Toast.SHORT);
    // }
  };

  const refreshFn = useCallback(() => {
    dispatch(
      getReelsDataRequest({
        token,
        // currentPage: 1,
        reel_order: reelsData?.reel_order,
      })
    );
  });

  const deleteReelFn = (id) => {
    dispatch(
      deleteReel({ token, reelId: id, setLoading, refresh: refreshFn() })
    );
    setShowModal(false);
    setDeleteModal(false);
    {
      props?.route?.params?.userReels && navigation.goBack();
    }
  };

  const clipDeleteModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 0);
  };

  const reactToggleFn = async (item) => {
    const formData = new FormData();
    formData.append("reel_id", item.id);
    // dispatch(likeItem({ token, formData }));
    let response = await withoutStringiApiCall2({
      route: `reel/react/toggle`,
      verb: "POST",
      token: token,
      params: formData,
    });

    console.log("response", response);
  };

  const increaseCount = () => {
    if (currentReelId != null) {
      const formData = new FormData();
      formData.append("reel_id", currentReelId);
      dispatch(
        reelViewCount({
          token,
          formData,
        })
      );
    }
  };

  const onCommentPress = (id) => {
    setShowCommentModal(true);
    dispatch(
      getReelsCommentsReq({
        token,
        reelId: currentReelEncryptedId,
      })
    );
    const data_target = "comment";
    dispatch(
      dispatch(
        fetchComments({
          token,
          id: currentReelEncryptedId,
          data_target: data_target,
          page: 0,
        })
      )
    );
  };

  const onRefresh = () => {
    setCurrentPage(1);
    handleLoadMore();
  };

  const onSharePress = (id) => {
    setShowShareModal(true);
  };

  const onPressBack = () => {
    const emptyFlatlist = [];
    setFlatListData(emptyFlatlist);
    navigation.goBack();
  };

  useEffect(() => {
    if (currentIndex === -1) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  }, [currentIndex]);

  const handleVideoTouchEnd = (index) => {
    console.log("TouchEnd", index);
    setCurrentIndex(index);
    setPlay(!play);
    // if (play) {
    //   setShowPauseButton(false);
    //   setShowPlayButton(true);
    //   setTimeout(() => {
    //     setShowPlayButton(false);
    //   }, 1000);
    // } else {
    //   setShowPauseButton(true);
    //   setShowPlayButton(false);
    //   setTimeout(() => {
    //     setShowPauseButton(false);
    //   }, 1000);
    // }
  };
  const renderReel = ({ item, index }) => {
    if (currentIndex === index) {
      setCurrent_User_ID(item?.user?.id);
      setCurrentReelId(item?.id);
      setCurrentReelEncryptedId(item?.encrypted_id);
      setCurrentReelValue(item);
      if (item?.reaction !== null) {
        setIsReelLiked(true);
      } else {
        setIsReelLiked(false);
      }

      if (user_id === item?.user_id) {
        setIsAdmin(true);
      }
      if (modalVisible == true) {
        setCurrentIndex(index);
      }
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={styles.reelContainer}>
          <View style={styles.reelHeaderContainer}>
            <ReelsHeader
              // isAdmin={isAdmin}
              item={item}
              voumeUp={muteVoume}
              muteVoume={muteVoume}
              mute={mute}
              name={item?.user?.first_name + " " + item?.user?.last_name}
              profilePic={
                item?.reel_audio?.[0]?.user?.profile_picture
                  ? item?.reel_audio?.[0]?.user?.profile_picture
                  : item?.user?.profile_picture
              }
              onPressMenuModal={onPressMenuModal}
              modalVisible={modalVisible}
              onPressBack={onPressBack}
              setModalVisible={setModalVisible}
              reelPrivacy={item?.post_privacy}
              onPress={() => {
                navigation.push("ProfileScreen", { id: item?.user_id }),
                  setPlay(true);
              }}
            />
          </View>
          {/* <Video
            onTouchEnd={() => handleVideoTouchEnd(index)}
            ref={videoRef}
            source={{ uri: SITE_URL + item?.media?.[0]?.path }}
            poster={SITE_URL + item?.media?.[0]?.thumb_path}
            onBuffer={(msg) => onBuffer(msg)}
            onError={(e) => videoError(e)}
            style={styles.backgroundVideo}
            controls={true}
            repeat={true}
            volume={2}
            paused={currentIndex == index ? play : pause}
            resizeMode="contain"
            muted={mute}
          /> */}
          <VideoPlayer
            ref={videoRef}
            loop={true}
            video={{ uri: SITE_URL + item?.media?.[0]?.path }}
            poster={SITE_URL + item?.media?.[0]?.thumb_path}
            onBuffer={(msg) => onBuffer(msg)}
            onError={(e) => videoError(e)}
            paused={currentIndex == index ? play : pause}
            autoplay={true}
            volume={2}
            onPlayPress={() => setPlay(false)}
            onStart={currentIndex == index}
            resizeMode="contain"
            pauseOnPress={true}
            onTouchEnd={() => handleVideoTouchEnd(index)}
            controlsTimeout={1000}
            disableFullscreen={true}
            onLoad={handleLoad}
            hideControlsOnStart={true}
            videoHeight={getVideoHeight()}
            muted={mute}
            customStyles={{
              controls: {
                // top: 5,
                bottom: 20,
                height: getHeight(10),
                alignItems: "center",
                flexDirection: isRTL ? "row-reverse" : "row",
              },
              seekBar: {
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            }}
          />
          {isVideoLoading && (
            <ActivityIndicator
              style={styles.videoLoader}
              size="large"
              color={COLORS.primary}
            />
          )}

          <LikeCommentShare
            reactToggleFn={() => reactToggleFn(item)}
            comments_count={item?.comments_count + item?.replies_count}
            post_reactions_count={item?.post_reactions_count}
            shared_post_count={item?.shared_post_count}
            reacted={isReelLiked}
            onCommentPress={onCommentPress}
            onSharePress={onSharePress}
            LikeReact={reactCount}
            item={item}
          />

          <ReelsBottomView
            title={item?.post_text === null ? "" : item?.post_text}
            name={
              item?.reel_audio?.[0]?.user?.first_name &&
              item?.reel_audio?.[0]?.user?.last_name == undefined
                ? ""
                : item?.reel_audio?.[0]?.user?.first_name +
                  " " +
                  item?.reel_audio?.[0]?.user?.last_name
            }
            clipStop={() => {
              setPlay(true);
            }}
            stop
          />

          {showModal && currentIndex == index && (
            <ReelsDotMenuModal
              modalVisible={showModal}
              setModalVisible={setShowModal}
              onDeletePress={() => clipDeleteModal()}
              onEditPress={() => {
                editReel((id = item?.id));
              }}
              onCopyLinkPress={() => {
                copyLink(item?.encrypted_id);
              }}
              is_Admin={isAdmin}
              item={item}
            />
          )}
          {editModal && currentIndex == index && (
            <ReelEditModal
              editModal={editModal}
              setEditModal={setEditModal}
              item={item}
              onPressUpdated={(text) => {
                onPressUpdate((id = item?.id));
              }}
              updatedText={(text) => {
                setUpdatedText(text);
              }}
            />
          )}

          {deleteModal && currentIndex == index && (
            <LogoutModal
              isVisible={deleteModal}
              setIsVisible={setDeleteModal}
              message={t("You want to delete this clip?")}
              onYesPress={() => {
                deleteReelFn((id = item?.id));
              }}
            />
          )}

          {showCommentModal && currentIndex == index && (
            <ComentModel
              isModell={showCommentModal}
              setIsModel={setShowCommentModal}
              item3={currentReelValue}
              data_target={"comment"}
              postID={currentReelId}
              reel
              setRefreshData={setRefreshData}
              setPlay={setPlay}
              isReplying={isReplying}
              setIsReplying={setIsReplying}
              replyingName={replyingName}
              setReplyingName={setReplyingName}
              commentId={commentId}
              setCommentId={setCommentId}
              fromNewsFeed={fromNewsFeed}
              setFromNewsFeed={setFromNewsFeed}
            />
          )}

          {showShareModal && currentIndex == index && (
            <ShareModel
              shareModel={showShareModal}
              setShareModel={setShowShareModal}
              onRefresh={onRefresh}
              postId={currentReelId}
              item={item}
            />
          )}
        </View>
        {showPlayButton && (
          <View style={styles.playPauseContainer}>
            {ICONS.fontAwesome5("play", "white", 30)}
          </View>
        )}

        {showPauseButton && (
          <View style={styles.playPauseContainer}>
            {ICONS.fontAwesome5("pause", "white", 30)}
          </View>
        )}
      </SafeAreaView>
    );
  };

  const renderFooter = () => {
    return <View style={styles.marginBottom}>{isLoading && <Loader />}</View>;
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setCurrentIndex(viewableItems?.[0]?.index);
  }, []);

  const _viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 30,
  };

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.statusBarContainer}>
      <View style={styles.swiperFlatlistContainer}>
        <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />
        <FlatList
          pagingEnabled={true}
          onViewableItemsChanged={_onViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={_viewabilityConfig}
          vertical
          data={
            !props?.route?.params?.userReels
              ? reelItem && reelItem[0]?.notify
                ? [reelItem[0], ...flatListData]
                : flatListData || []
              : reelItem && reelItem[0]?.notify
              ? [reelItem[0], ...userReelsData]
              : userReelsData || []
          }
          renderItem={renderReel}
          keyExtractor={(item, index) => index.toString()}
          onChangeIndex={onChangeIndex}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={5}
          // onRefresh={() => getReelsDataApi()}
          windowSize={10}
          removeClippedSubviews={true}
          refreshing={loading}
          maxToRenderPerBatch={6}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusBarContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    width: WP(100),
    height: HP(80),
  },
  backgroundVideo: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  flexHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  reelsText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  reelContainer: {
    width: WP("100%"),
    height: HP("100%"),
    zIndex: -1,
    backgroundColor: COLORS.black,
  },
  reelHeaderContainer: {
    position: "absolute",
    top: 0,
    width: WP(100),
    zIndex: 1,
  },
  swiperFlatlistContainer: {
    width: WP("100%"),
    height: HP("100%"),
  },
  playPauseContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  marginBottom: {
    marginTop: -20,
  },
  videoLoader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Reels;
