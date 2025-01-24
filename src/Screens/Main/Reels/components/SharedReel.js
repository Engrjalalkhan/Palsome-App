import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import Video from "react-native-video";
import { useSelector, useDispatch } from "react-redux";
import { HP, WP } from "../../../../../Utils/Resposive";
import ComentModel from "../../../../Components/ComentModel";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";
import { fetchComments } from "../../../../Redux/actions/NewsFeedActions";
import {
  deleteReel,
  getReelsCommentsReq,
  getReelsDataRequest,
} from "../../../../Redux/actions/ReelsActions";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import { SITE_URL } from "../../../../Services/Constants";
import LikeCommentShare from "./LikeCommentShare";
import ReelsBottomView from "./ReelsBottomView";
import ReelsDotMenuModal from "./ReelsDotMenuModal";
import ReelsHeader from "./ReelsHeader";

const SharedReel = ({ item, index }) => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const route = useRoute();
  const token = useSelector((state) => state.auth.userToken);
  const reelsData = useSelector((state) => state.reelsRed.reelsData);
  // console.log(
  //   "reeeeeeeeeeeeeeeeeeeeels data.data.media[0]>>",
  //   reelsData.data.map((item) => item.media[0].thumb_path)
  // );
  const [flatListData, setFlatListData] = useState(new Array());

  const [current_User_ID, setCurrent_User_ID] = useState(null);
  const [currentReelId, setCurrentReelId] = useState(null);
  const [currentReelEncryptedId, setCurrentReelEncryptedId] = useState(null);
  const [currentReelValue, setCurrentReelValue] = useState(null);
  const [currentReelsReactCount, setCurrentReelsReactCount] = useState(0);
  const [isReelLiked, setIsReelLiked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mute, setMute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showPauseButton, setShowPauseButton] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reelReactCount, setReelReactCount] = useState(0);

  useEffect(() => {
    if (route.params?.item) {
      setFlatListData([route.params?.item, ...reelsData?.data]);
    } else {
      if (flatListData?.length > 1) {
        // deepclone using lodash

        console.log("flatListData::>>", flatListData.length);
        setFlatListData([...reelsData?.data, flatListData]);
        // setFlatListData((prev) => [...reelsData?.data, ...prev]);
      } else {
        setFlatListData(reelsData?.data);
      }
    }
  }, [reelsData, route.params?.item]);

  // const array1 = flatListData.map((item) => item.user);
  // const firstName = array1.map((item2) => item2.first_name);
  // const lastName = array1.map((item2) => item2.last_name);
  // console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeel item.user arrray::>>>", array1);
  // console.log(
  //   "reeeeeeeeeeeeeeeeeeeeeeeeeeel item.user arrray item 2222::>>>",
  //   array1.map((item2) => item2.first_name)
  // );

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

  const muteVoume = () => {
    if (mute) {
      videoRef.current.setNativeProps({ muted: false });
      setMute(false);
    } else {
      videoRef.current.setNativeProps({ muted: true });
      setMute(true);
    }
  };
  const onPressMenuModal = () => {
    setShowModal(true);
  };
  const onBuffer = (msg) => {
    // console.log("onBuffer", msg);
  };

  const videoError = (e) => {
    // console.log("videoError", e);
  };
  const deleteReelFn = (id) => {
    // console.log("id::>>", id);
    dispatch(
      deleteReel({ token, reelId: id, setLoading, refresh: refreshFn() })
    );
    setShowModal(false);
  };
  const onRefresh = () => {
    setCurrentPage(1);
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

  const onSharePress = (id) => {
    setShowShareModal(true);
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ReelsNav", {
          screen: "ReelsIndex",
          params: { item: item },
        })
      }
      style={{ backgroundColor: COLORS.cadetBlue }}
    >
      <Image
        source={{ uri: SITE_URL + item?.media[0]?.thumb_path }}
        style={styles.img}
      />
      <SafeAreaView>
        <View style={styles.reelContainer}>
          {/* <View style={styles.reelHeaderContainer}> */}
          <ReelsHeader
              voumeUp={muteVoume}
              muteVoume={muteVoume}
              mute={mute}
              name={firstName[1] + " " + lastName[1]}
              profilePic={item?.reel_audio?.[0]?.user?.profile_picture}
              onPressMenuModal={onPressMenuModal}
              isAdmin={isAdmin}
            />
          {/* </View> */}
          {/* <Video
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
          /> */}

          {/* <LikeCommentShare
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
          /> */}
          {/* <ReelsBottomView
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
          /> */}

          {/* {console.log("isAdmin::>>", isAdmin)} */}

          {/* {showModal && (
            <ReelsDotMenuModal
              modalVisible={showModal}
              setModalVisible={setShowModal}
              onDeletePress={() => deleteReelFn((id = item?.id))}
              onEditPress={editReel}
              onCopyLinkPress={copyLink}
              // is_Admin={user_id === current_User_ID ? true : false}
              is_Admin={isAdmin}
            />
          )} */}

          {/* {showCommentModal && (
            <ComentModel
              isModell={showCommentModal}
              setIsModel={setShowCommentModal}
              item3={currentReelValue}
              data_target={"comment"}
              postID={currentReelId}
              reel
              setRefreshData={setRefreshData}
            />
          )} */}

          {/* {showShareModal && (
            <ShareModel
              shareModel={showShareModal}
              setShareModel={setShowShareModal}
              onRefresh={onRefresh}
              postId={currentReelId}
            />
          )} */}

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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reelContainer: {
    width: WP(90),
    height: HP(60),
    // width: "100%",
    // height: "120%",
    // marginHorizontal: 10,
    marginBottom: 5,
    marginTop: -10,
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
});

export default SharedReel;
