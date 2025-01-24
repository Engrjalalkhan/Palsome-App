import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  getReelsDataRequest,
  reactToggleReq,
  reelViewCount,
  getReelsCommentsReq,
} from "../../../../Redux/actions/ReelsActions";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import Video from "react-native-video";
import { SITE_URL } from "../../../../Services/Constants";
import ReelsHeader from "./ReelsHeader";
import ReelsBottomView from "./ReelsBottomView";
import LikeCommentShare from "./LikeCommentShare";
import NoReels from "./NoReels";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { HP, WP } from "../../../../../Utils/Resposive";
import Loader from "../../../../Components/Loader";
import { useRoute } from "@react-navigation/native";
import ReelsDotMenuModal from "./ReelsDotMenuModal";
import { deleteReel } from "../../../../Redux/actions/ReelsActions";
import ComentModel from "../../../../Components/ComentModel";
import {
  fetchComments,
  likeItem,
} from "../../../../Redux/actions/NewsFeedActions";
import ShareModel from "../../../../Components/ShareModel";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import SimpleToast from "react-native-simple-toast";

const ShareReelSuggestions = () => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const route = useRoute();
  const token = useSelector((state) => state.auth.userToken);
  const reelsData = useSelector((state) => state.reelsRed.reelsData);
  const myReelData = reelsData.data;
  console.log("myyy reeeeeel datatatatatatatatataattaattata>>>", myReelData);

  const react_count = useSelector((state) => state.reelsRed.react_count);
  const reelCommentsData = useSelector(
    (state) => state.reelsRed.reelCommentsData
  );
  const user_id = useSelector((state) => state.auth.userData.id);
  const last_page = reelsData?.last_page;

  const [current_User_ID, setCurrent_User_ID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mute, setMute] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flatListData, setFlatListData] = useState(new Array());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentReelId, setCurrentReelId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentReelEncryptedId, setCurrentReelEncryptedId] = useState(null);
  const [currentReelValue, setCurrentReelValue] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [currentReelsReactCount, setCurrentReelsReactCount] = useState(0);
  const [isReelLiked, setIsReelLiked] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [reelReactCount, setReelReactCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const getReelsDataApi = () => {
    dispatch(
      getReelsDataRequest({
        token,
        setLoading,
        currentPage: currentPage,
      })
    );
  };

  useEffect(() => {
    getReelsDataApi();
  }, [currentPage]);

  //   useEffect(() => {
  //     if (route.params?.item) {
  //       setFlatListData([route.params?.item, ...reelsData?.data]);
  //     } else {
  //       if (flatListData?.length > 1) {
  //         // deepclone using lodash

  //         console.log("flatListData::>>", flatListData.length);
  //         setFlatListData([...reelsData?.data, flatListData]);
  //         // setFlatListData((prev) => [...reelsData?.data, ...prev]);
  //       } else {
  //         setFlatListData(reelsData?.data);
  //       }
  //     }
  //   }, [reelsData, route.params?.item]);

  const onBuffer = (msg) => {
    // console.log("onBuffer", msg);
  };

  const videoError = (e) => {
    // console.log("videoError", e);
  };

  const muteVoume = () => {
    if (mute) {
      videoRef.current.setNativeProps({ muted: false });
      setMute(false);
    } else {
      videoRef.current.setNativeProps({ muted: true });
      setMute(true);
    }
  };

  const onChangeIndex = ({ index, prevIndex }) => {
    // console.log("onChangeIndex::>>", index, prevIndex);
    setCurrentIndex(index);
  };

  const refreshFn = () => {
    getReelsDataApi();
  };

  const handleLoadMore = () => {
    console.log("handleLoadMore::>>", last_page, currentPage);
    if (last_page > currentPage) {
      setCurrentPage(currentPage + 1);
    }

    if (last_page === currentPage) {
      SimpleToast.show("No More Data");
    }
  };

  const onPressMenuModal = () => {
    setShowModal(true);
  };

  const copyLink = () => {
    alert("copyLink");
  };

  const editReel = () => {
    alert("editReel");
  };

  const deleteReelFn = (id) => {
    // console.log("id::>>", id);
    dispatch(
      deleteReel({ token, reelId: id, setLoading, refresh: refreshFn() })
    );
    setShowModal(false);
  };

  const reactToggleFn = async (id) => {
    console.log("id in reactToggleFn::>>", id);
    const formData = new FormData();
    formData.append("reel_id", id);
    // dispatch(
    //   reactToggleReq({
    //     token,
    //     setLoading,
    //     formData,
    //   })
    // );

    const res = await withoutStringiApiCall2({
      route: `reel/react/toggle`,
      verb: "POST",
      token: token,
      params: formData,
    });

    console.log("res in reactToggleFn::>>", res);

    setReelReactCount(res?.payload?.data?.react_count);

    dispatch(getReelsDataRequest({ token }));
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

  useEffect(() => {
    increaseCount();
  }, [currentReelId]);

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

    console.log("showCommentModal inside of modal::>>", showCommentModal);
  };

  useEffect(() => {
    if (refreshData) {
      dispatch(
        getReelsDataRequest({
          token,
        })
      );
      setRefreshData(false);
    }
  }, [refreshData]);

  const onRefresh = () => {
    setCurrentPage(1);
  };

  const onSharePress = (id) => {
    setShowShareModal(true);
  };

  // console.log("currentReelValue::>>", currentReelValue);

  const renderReel = ({ item, index }) => {
    if (currentIndex === index) {
      setCurrent_User_ID(item?.user?.id);
      setCurrentReelId(item?.id);
      setCurrentReelEncryptedId(item?.encrypted_id);
      setCurrentReelValue(item);
      setCurrentReelsReactCount(item?.post_reactions_count);
      console.log("item?.reaction::>>", item?.reaction);
      if (item?.reaction !== null) {
        setIsReelLiked(true);
      } else {
        setIsReelLiked(false);
      }

      if (user_id === current_User_ID) {
        setIsAdmin(true);
      }
    }
    return (
      <SafeAreaView>
        <View style={styles.reelContainer}>
          <View style={styles.reelHeaderContainer}>
            <ReelsHeader
              voumeUp={muteVoume}
              muteVoume={muteVoume}
              mute={mute}
              name={item?.user?.first_name + " " + item?.user?.last_name}
              profilePic={item?.reel_audio?.[0]?.user?.profile_picture}
              onPressMenuModal={onPressMenuModal}
              isAdmin={isAdmin}
            />
          </View>
          <Video
            onTouchStart={() => {
              setIsPlaying(!isPlaying);

              if (isPlaying) {
                setCurrentIndex(index);
                setShowPlayButton(true);
                setTimeout(() => {
                  setShowPlayButton(false);
                }, 1000);
              }
              if (!isPlaying) {
                setCurrentIndex(!index);
                setShowPauseButton(true);
                setTimeout(() => {
                  setShowPauseButton(false);
                }, 1000);
              }
            }}
            ref={videoRef}
            source={{ uri: SITE_URL + item?.media?.[0]?.path }}
            poster={SITE_URL + item?.media?.[0]?.thumb_path}
            onBuffer={(msg) => onBuffer(msg)}
            onError={(e) => videoError(e)}
            style={styles.backgroundVideo}
            controls={false}
            repeat={true}
            volume={2}
            paused={currentIndex !== index ? true : false}
            resizeMode="contain"
            muted={mute}
          />

          <LikeCommentShare
            reactToggleFn={() => reactToggleFn((id = item?.id))}
            comments_count={item?.comments_count + item?.replies_count}
            post_reactions_count={
              reelReactCount !== 0 ? reelReactCount : item?.post_reactions_count
            }
            // post_reactions_count={currentReelsReactCount}
            shared_post_count={item?.shared_post_count}
            // reacted={item?.reaction}
            reacted={isReelLiked}
            onCommentPress={onCommentPress}
            onSharePress={onSharePress}
          />
          <ReelsBottomView
            title={item?.post_text === null ? "" : item?.post_text}
            // title={
            //   item?.post_text === null
            //     ? item?.media?.[0]?.title
            //     : item?.post_text + item?.media?.[0]?.title
            // }
            name={
              item?.reel_audio?.[0]?.user?.first_name +
              " " +
              item?.reel_audio?.[0]?.user?.last_name
            }
          />

          {console.log("isAdmin::>>", isAdmin)}

          {showModal && (
            <ReelsDotMenuModal
              modalVisible={showModal}
              setModalVisible={setShowModal}
              onDeletePress={() => deleteReelFn((id = item?.id))}
              onEditPress={editReel}
              onCopyLinkPress={copyLink}
              // is_Admin={user_id === current_User_ID ? true : false}
              is_Admin={isAdmin}
              item={item}
            />
          )}

          {showCommentModal && (
            <ComentModel
              isModell={showCommentModal}
              setIsModel={setShowCommentModal}
              item3={currentReelValue}
              data_target={"comment"}
              postID={currentReelId}
              reel
              setRefreshData={setRefreshData}
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

          {showShareModal && (
            <ShareModel
              shareModel={showShareModal}
              setShareModel={setShowShareModal}
              onRefresh={onRefresh}
              postId={currentReelId}
            />
          )}

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
        </View>
      </SafeAreaView>
    );
  };

  const renderFooter = () => {
    return <View style={styles.marginBottom}>{loading && <Loader />}</View>;
  };

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.swiperFlatlistContainer}>
      <StatusBar backgroundColor={COLORS.black} barStyle="light-content" />

      <SwiperFlatList
        vertical
        data={myReelData}
        renderItem={renderReel}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={onChangeIndex}
        ListEmptyComponent={() => <NoReels />}
        onEndReached={handleLoadMore}
        // onEndReachedThreshold={0.5}
        onRefresh={() => getReelsDataApi()}
        refreshing={loading}
        maxToRenderPerBatch={6}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
        onScroll={() => setReelReactCount(0)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WP(100),
    height: HP(100),
  },
  backgroundVideo: {
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
    width: WP(100),
    height: HP(100),
  },
  reelHeaderContainer: {
    position: "absolute",
    top: 0,
    width: WP(100),
    zIndex: 1,
  },
  swiperFlatlistContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  playPauseContainer: { position: "absolute", top: "50%", left: "50%" },
  marginBottom: { marginBottom: 20 },
});
export default ShareReelSuggestions;
