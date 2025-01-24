import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";

import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

import ComentModel from "../../../Components/ComentModel";
import LikeComShare from "../../../Components/LikeComShare";
import TitleName from "../../../Components/NewsFeedList/TitleName";
import TaggedPeopleModal from "../../../Components/TaggedPeopleModal";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";
import { timeDifference } from "../../../Components/NewsFeedList/Functions";
import AndroidVideoPlayer from "../../Videos/VideoScreen/AndroidVideoPlayer";

import {
  HeightScreen,
  WidthScreen,
} from "../../../Components/TopBar/Dimensions";

import { SITE_URL } from "../../../Services/Constants";
import { withoutStringiApiCall2 } from "../../../Services/Apis";

import { HP, WP } from "../../../../Utils/Resposive";
import { showImgFunc } from "../../../../Utils/Data";
import { downloadAndSave } from "../../../../Utils/Download";
import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import { privacy, tags } from "../../../../Utils/PickerDataStatus/privacyData";

import { ACTIONS } from "../../../Redux/action-types";
import { fetchComments } from "../../../Redux/actions/NewsFeedActions";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import FlashMessage from "react-native-flash-message";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ReactNativeZoomableView from "../../../Components/Zoom";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const index = ({ route }) => {
  const { data, initialIndex, post, updatedDimension } = route.params;

  const { t } = useTranslation();
  const ref = useRef();
  let flashRef = useRef();
  let zoomableViewRef = useRef();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData);

  const [media, setMedia] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [statusBarTrans, setStatusBarTrans] = useState();
  const [imageIndex, setimageIndex] = useState(route.params?.initialIndex);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [videoFooterVisible, setVideoFooterVisible] = useState(true);
  const [currentWidth, setCurrentWidth] = useState(WidthScreen);
  const [currentHeight, setCurrentHeight] = useState(HeightScreen);

  const [currentVideoDim, setCurrentVideoDim] = useState({
    resizeMode: "contain",
    height: HeightScreen * 0.5,
    width: WidthScreen,
    crossHeight: 50,
  });

  const [isCommentModel, setIsCommentModel] = useState(false);
  const [data_target, setData_target] = useState();
  const [postIndex, setPostIndex] = useState();
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isComments, setIsComments] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSaveModel, setShowSaveModal] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const isPortrait = (e) => {
    return e.height >= e.width;
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setCurrentIndex(changed?.[0]?.key);
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  useEffect(() => {
    setMedia(data);
  }, [data]);

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  useEffect(() => {
    updatedDimension?.height &&
    updatedDimension?.width &&
    !isPortrait(updatedDimension)
      ? landscapeSettings()
      : portraitSettings();
  }, [updatedDimension]);

  const portraitSettings = () => {
    setCurrentHeight(HeightScreen);
    setCurrentWidth(WidthScreen);
    setVideoFooterVisible(true);
    setCurrentVideoDim({
      resizeMode: "contain",
      height: HeightScreen * 0.5,
      width: WidthScreen,
      crossHeight: 50,
    });
    setStatusBarTrans(false);
  };

  const landscapeSettings = () => {
    setCurrentHeight(WidthScreen);
    setCurrentWidth(HeightScreen);
    setVideoFooterVisible(false);
    setStatusBarTrans(true);

    setCurrentVideoDim({
      resizeMode: "cover",
      height: WidthScreen * 0.9,
      width: HeightScreen * 0.8,
      crossHeight: 15,
    });
  };

  const onLayout = () => {
    ref.current.scrollToIndex({
      index: activeIndex ? imageIndex : imageIndex,
      animated: false,
    });
  };

  const getItemLayout = (data, index) => ({
    length: currentWidth,
    offset: currentWidth * index,
    index,
  });

  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };

  const likeItemFunc = async (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", 1);

    let myArray = [...media];
    let myIndex = myArray.indexOf(item);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item) {
        itm.reaction = {
          reaction_type_id: 1,
        };
        itm.gallery_post_reactions_count = reactChk(
          itm.gallery_post_reactions_count,
          itm.localReacted
        );
        itm.localReacted = true;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setMedia(myArray);

    try {
      const res = await withoutStringiApiCall2({
        route: "gallery_post/reaction",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        // console.log("response in like gallery pic", res);
      }
    } catch (e) {
      console.log("saga like gallery pic error -- ", e.toString());
    }
  };

  const unLikeItemFunc = async (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);

    let myArray = [...media];
    let myIndex = myArray.indexOf(item);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item) {
        if (itm?.reaction.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != userName.id);
          itm.like = like;
        }
        if (itm?.reaction.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != userName.id);
          itm.heart = heart;
        }
        if (itm?.reaction.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != userName.id);
          itm.haha = haha;
        }
        if (itm?.reaction.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != userName.id);
          itm.wow = wow;
        }
        if (itm?.reaction.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != userName.id);
          itm.sad = sad;
        }
        if (itm?.reaction.reaction_type_id == 6) {
          let angry = itm?.angry?.filter((i) => i.user_id != userName.id);
          itm.angry = angry;
        }
        itm.reaction = null;
        itm.localReacted = false;
        itm.gallery_post_reactions_count = itm.gallery_post_reactions_count - 1;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setMedia(myArray);

    try {
      const res = await withoutStringiApiCall2({
        route: "gallery_post/reaction/delete",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in unlike gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        // console.log("response in unlike gallery pic", res);
      }
    } catch (e) {
      console.log("saga unlike gallery pic error -- ", e.toString());
    }
  };

  const reactionType = async (id, item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", id);

    let myArray = [...media];
    let myIndex = myArray.indexOf(item);

    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item) {
        if (itm?.reaction?.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != userName.id);
          itm.like = like;
        }
        if (itm?.reaction?.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != userName.id);
          itm.heart = heart;
        }
        if (itm?.reaction?.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != userName.id);
          itm.haha = haha;
        }
        if (itm?.reaction?.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != userName.id);
          itm.wow = wow;
        }
        if (itm?.reaction?.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != userName.id);
          itm.sad = sad;
        }
        if (itm?.reaction?.reaction_type_id == 6) {
          let angry = itm?.angry?.filter((i) => i.user_id != userName.id);
          itm.angry = angry;
        }
        itm.gallery_post_reactions_count = reactChk(
          itm.gallery_post_reactions_count,
          itm.localReacted,
          itm.reaction
        );

        itm.reaction = {
          reaction_type_id: id,
        };

        itm.localReacted = true;
        return itm;
      }
    });

    myArray[myIndex] = myNewItem;
    setMedia(myArray);

    try {
      const res = await withoutStringiApiCall2({
        route: "gallery_post/reaction",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        // console.log("response in like gallery pic", res);
      }
    } catch (e) {
      console.log("saga like gallery pic error -- ", e.toString());
    }
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setData_target(data_target);
    setIsCommentModel(!isCommentModel);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(
      fetchComments({ token, id: id, setIsComments, data_target, page: 0 })
    );
  };


  const MyFastImage = ({ source }) => {
    const [loading, setLoading] = useState(true);

    return (
      <TouchableWithoutFeedback
        onLongPress={() => handleLongPress(source.uri)}
        onPress={() => setVisibleFooter(!visibleFooter)}
      >
        <FastImage
          style={{
            width: null,
            height: "100%",
          }}
          source={source}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
        />
        <ActivityIndicator
          animating={loading}
          size={"large"}
          color={COLORS.primary}
          style={{
            position: "absolute",
            top: "50%",
            alignSelf: "center",
          }}
        />
      </TouchableWithoutFeedback>
    );
  };

  const handleLongPress = (url) => {
    setShowSaveModal(url);
  };

  return (
    <>
      <FlatList
        ref={ref}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewabilityConfig}
        scrollEnabled={scrollEnabled}
        data={media}
        style={{ backgroundColor: COLORS.black }}
        horizontal
        pagingEnabled
        ListEmptyComponent={
          <View style={{ backgroundColor: COLORS.black, flex: 1 }} />
        }
        ListHeaderComponent={
          <StatusBar translucent={statusBarTrans} hidden={statusBarTrans} />
        }
        initialScrollIndex={initialIndex}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}
        getItemLayout={getItemLayout}
        disableScrollViewPanResponder
        onMomentumScrollBegin={() => {
          zoomableViewRef?.current?.zoomTo(1);
        }}
        onMomentumScrollEnd={(ev) =>
          setActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / currentWidth)
          )
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (
            item.post_file_type === "image" ||
            item.post_file_type === "video" ||
            item.post_file_type === "post" ||
            item.post_file_type === "palsome_ai"
          ) {
            return (
              <View
                style={[
                  styles.Box,
                  { width: currentWidth, height: currentHeight },
                ]}
              >
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                    top: currentVideoDim.crossHeight,
                    zIndex: 1000,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {item?.post_file_type == "image" && (
                    <TouchableOpacity
                      style={{ padding: 10 }}
                      onPress={() => handleLongPress(SITE_URL + item.path)}
                    >
                      {ICONS.entypo("dots-three-horizontal", COLORS.grey, 35)}
                    </TouchableOpacity>
                  )}
                  {item?.post_file_type == "palsome_ai" && (
                    <TouchableOpacity
                      style={{ padding: 10 }}
                      onPress={() => handleLongPress(SITE_URL + item.path)}
                    >
                      {ICONS.entypo("dots-three-horizontal", COLORS.grey, 35)}
                    </TouchableOpacity>
                  )}
                  {item?.post_file_type == "post" && (
                    <TouchableOpacity
                      style={{ padding: 10 }}
                      onPress={() => handleLongPress(item.path)}
                    >
                      {ICONS.entypo("dots-three-horizontal", COLORS.grey, 35)}
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => navigation.goBack()}
                  >
                    {ICONS.materialIcons("cancel", COLORS.grey, 35)}
                  </TouchableOpacity>
                </View>

                <ReactNativeZoomableView
                  ref={zoomableViewRef}
                  maxZoom={1.5}
                  minZoom={1}
                  initialZoom={1}
                  bindToBorders={true}
                  doubleTapZoomToCenter
                  onZoomEnd={(e, gState, zoomableViewEventObject) => {
                    zoomableViewEventObject.zoomLevel > 1
                      ? setScrollEnabled(false)
                      : setScrollEnabled(true);
                  }}
                  onZoomBefore={(e, gState, zoomableViewEventObject) => {
                    zoomableViewEventObject.zoomLevel > 1
                      ? setScrollEnabled(false)
                      : setScrollEnabled(true);
                  }}
                  onDoubleTapAfter={(e, gState, zoomableViewEventObject) => {
                    zoomableViewEventObject.zoomLevel > 1
                      ? setScrollEnabled(false)
                      : setScrollEnabled(true);
                  }}
                  style={{
                    padding: 1,
                    backgroundColor: COLORS.black,
                  }}
                >
                  {item?.post_file_type == "image" ? (
                    <MyFastImage
                      source={{
                        uri: SITE_URL + item.path,
                        // uri: item.img,
                      }}
                    />
                  ) : item?.post_file_type == "palsome_ai" ? (
                    <MyFastImage
                      source={{
                        uri: SITE_URL + item.path,
                        // uri: item.img,
                      }}
                    />
                  ) : item?.post_file_type == "post" ? (
                    <MyFastImage
                      source={{
                        uri: item.path,
                        // uri: item.img,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        flex: 1,
                        position: "absolute",
                        width: "100%",
                        zIndex: 1,
                      }}
                    >
                      <AndroidVideoPlayer
                        source={{
                          uri:
                            SITE_URL +
                            "converted_videos/" +
                            item?.stream_path240,
                        }}
                        paused={true}
                        style={{
                          height: getHeight(50),
                          width: getWidth(100),
                          backgroundColor: COLORS.black,
                        }}
                        controls={true}
                        resizeMode={"contain"}
                        poster={
                          SITE_URL +
                          "converted_videos/thumbnails/" +
                          item?.thumb_path
                        }
                        myIndex={currentIndex}
                        index={currentIndex}
                      />
                    </View>
                  )}
                </ReactNativeZoomableView>

                {visibleFooter && (
                  <View
                    style={[
                      styles.footer,
                      { paddingBottom: currentHeight * 0.05 },
                    ]}
                  >
                    {/* /////////////////////////////// */}

                    <TouchableOpacity style={{ marginVertical: 10 }} disabled>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 5,
                        }}
                      >
                        <Text style={{ marginLeft: 10 }}>
                          <TitleName
                            user={post?.[0]?.user}
                            pages={post?.[0]?.pages?.[0]}
                            groups={post?.[0]?.groups?.[0]}
                            rooms={post?.[0]?.rooms?.[0]}
                            events={post?.[0]?.events}
                            color={COLORS.white}
                          />
                          {post?.[0].feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                is {post?.[0].feeling_action}{" "}
                                {post?.[0].feeling_value}{" "}
                                {showImgFunc(post?.[0].feeling_value)}
                              </Text>
                            </>
                          )}
                          {post?.[0]?.tagged_users?.length > 0 && (
                            <>
                              <Text style={styles.action}>
                                {" "}
                                {!post?.[0].feeling_action && "is "}
                                {t("with")}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: COLORS.primary,
                                  }}
                                  onPress={() =>
                                    navigation.navigate("ProfileScreen", {
                                      userName:
                                        post?.[0]?.tagged_users?.[0]?.name,
                                    })
                                  }
                                >
                                  {" "}
                                  {
                                    post?.[0]?.tagged_users?.[0]?.first_name
                                  }{" "}
                                  {post?.[0]?.tagged_users?.[0]?.last_name}{" "}
                                </Text>
                                {post?.[0]?.tagged_users.length > 1 && (
                                  <Text>
                                    {t("and")}
                                    <Text
                                      onPress={() =>
                                        onPressTaggedOthers(
                                          post?.[0]?.tagged_users
                                        )
                                      }
                                      style={{
                                        fontWeight: "bold",
                                        color: COLORS.primary,
                                      }}
                                    >
                                      {" "}
                                      {post?.[0]?.tagged_users.length - 1}{" "}
                                      {t("other")}
                                      {post?.[0]?.tagged_users.length - 1 > 1
                                        ? "s"
                                        : null}
                                    </Text>
                                  </Text>
                                )}
                              </Text>
                            </>
                          )}
                          {post?.[0].post_type === "profile_picture" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
                              {t("updated profile picture")}
                            </Text>
                          ) : post?.[0].post_type === "shared_post" ? (
                            <Text style={styles.action}>
                              {" "}
                              {t("has shared a post")}{" "}
                              {post?.[0]?.groups[0]?.name
                                ? `to ${post?.[0]?.groups[0]?.name}`
                                : post?.[0]?.pages[0]?.name
                                ? `in ${post?.[0]?.pages[0]?.name}`
                                : post?.[0]?.rooms[0]?.name
                                ? `in ${post?.[0]?.rooms[0]?.name}`
                                : post?.[0]?.shared_user_post?.name
                                ? `with ${post?.[0]?.shared_user_post?.name}`
                                : null}
                            </Text>
                          ) : post?.[0].post_map ? (
                            <Text onPress={() => null} style={styles.action}>
                              {" "}
                              at {post?.[0].post_map}
                            </Text>
                          ) : post?.[0].post_type == "timeline" &&
                            post?.[0].user.id !== post?.[0]?.wall_user?.id ? (
                            <>
                              <Text style={styles.action}>
                                {" "}
                                {t("posted on ")}
                              </Text>

                              <Text style={styles.name}>
                                {post?.[0]?.wall_user?.first_name}{" "}
                                {post?.[0]?.wall_user?.last_name}
                              </Text>
                              <Text style={styles.action}>
                                {t("'s timeline")}
                              </Text>
                            </>
                          ) : null}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.time}>
                            {" "}
                            {timeDifference(post?.[0].created_at)}
                          </Text>
                          {privacy(post?.[0].post_privacy, COLORS.white)}
                          <Text style={styles.tagTxt}>
                            {tags(post?.[0].post_tag_id)}
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <ScrollView style={{ maxHeight: 300 }}>
                          <NewsFeedText
                            txt={post?.[0]?.post_text}
                            color={COLORS.white}
                          />
                        </ScrollView>
                      </View>
                    </TouchableOpacity>

                    {/* ////////////////////////////////// */}
                    <ShowLikeCommentShare
                      reaction={item?.reaction}
                      post_reactions_count={item?.gallery_post_reactions_count}
                      comments_count={
                        item?.comments_count + item?.replies_count
                      }
                      shared_post_count={item?.shared_post_count}
                      like={item?.like}
                      heart={item?.heart}
                      haha={item?.haha}
                      wow={item?.wow}
                      sad={item?.sad}
                      angry={item?.angry}
                      fontColor={COLORS.white}
                      pressfunction={() => {
                        getIdAndDispatch(
                          item?.encrypted_id,
                          item?.id,
                          index,
                          "gallery_comment"
                        );
                        setPostIndex(index);
                      }}
                    />
                    <LikeComShare
                      likePress={() => {
                        likeItemFunc(item, index);
                      }}
                      unLikePress={() => {
                        unLikeItemFunc(item, index);
                      }}
                      commentPress={() => {
                        setInputFocus(true);
                        getIdAndDispatch(
                          item?.encrypted_id,
                          item?.id,
                          index,
                          "gallery_comment"
                        );
                        setPostIndex(index);
                      }}
                      hideShare
                      likesCount={item?.gallery_post_reactions_count}
                      commentsCount={item?.comments_count}
                      shareCount={item?.shared_post_count}
                      color={COLORS.primary}
                      liked={item?.reaction != null ? true : false}
                      reactionID={item?.reaction?.reaction_type_id}
                      reactionType={(id) => reactionType(id, item, index)}
                    />
                  </View>
                )}
                <>
                  {isCommentModel && postIndex == index ? (
                    <ComentModel
                      inputFocus={inputFocus}
                      setInputFocus={setInputFocus}
                      isModell={isCommentModel}
                      setIsModel={setIsCommentModel}
                      item3={item}
                      data_target={data_target}
                      encrypted_id={item?.encrypted_id}
                      isReplying={isReplying}
                      setIsReplying={setIsReplying}
                      replyingName={replyingName}
                      setReplyingName={setReplyingName}
                      commentId={commentId}
                      setCommentId={setCommentId}
                      fromNewsFeed={fromNewsFeed}
                      setFromNewsFeed={setFromNewsFeed}
                    />
                  ) : null}
                  {taggedPeopleModel ? (
                    <TaggedPeopleModal
                      isVisible={taggedPeopleModel}
                      close={() => setTaggedPeopleModel(false)}
                      taggedPeopleList={taggedPeopleList}
                    />
                  ) : null}
                </>
              </View>
            );
          }
        }}
      />

      {showSaveModel !== "" && (
        <Modal
          visible={showSaveModel !== "" ? true : false}
          hasBackdrop={true}
          animationInTiming={2000}
          onBackdropPress={() => setShowSaveModal("")}
          style={{
            margin: 0,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <SafeAreaView
            style={{
              // height: "15%",
              backgroundColor: "white",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          >
            <View
              style={{
                width: WP(20),
                height: 5,
                marginTop: -HP(1),
                marginBottom: HP(1),
                backgroundColor: "white",
                alignSelf: "center",
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              style={{
                padding: HP(2),
                margin: HP(1),
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                setShowSaveModal("");

                flashRef.current.showMessage({
                  message: "Saving...",
                  type: "info",
                });

                downloadAndSave(showSaveModel, (res) => {
                  if (res)
                    flashRef.current.showMessage({
                      message: "Saved successfully",
                      type: "success",
                    });
                });
              }}
            >
              <Feather name="download" size={HP(3)} color="black" />
              <Text style={{ marginLeft: 13, fontSize: 19 }}>
                {t("Save To Phone")}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
      <FlashMessage
        ref={flashRef}
        position="bottom"
        floating
        duration={3000}
        icon="auto"
        style={{
          alignItems: "center",
          backgroundColor: COLORS.secondary,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, position: "absolute" },
  Box: {
    // borderColor: COLORS.red,
    backgroundColor: COLORS.black,
    borderWidth: 1,
  },
  button: {
    backgroundColor: COLORS.red,
    marginTop: 300,
    alignSelf: "center",
    padding: 100,
  },
  footer: {
    backgroundColor: COLORS.transparent,

    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  name: {
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 10,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: "normal",
    fontSize: 14,
  },
  time: {
    color: COLORS.white,
    marginLeft: 10,
  },
  tagTxt: {
    marginLeft: 8,
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
});
export default index;
