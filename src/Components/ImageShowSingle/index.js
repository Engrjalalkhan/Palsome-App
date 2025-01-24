import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import GallerySwiper from "react-native-gallery-swiper";
import Feather from "react-native-vector-icons/Feather";

import ShareModel from "../ShareModel";
import ComentModel from "../ComentModel";
import LikeComShare from "../LikeComShare";
import TitleName from "../NewsFeedList/TitleName";
import TaggedPeopleModal from "../TaggedPeopleModal";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import { timeDifference } from "../NewsFeedList/Functions";
import ShowLikeCommentShare from "../ShowLikeCommentShare";
import { HeightScreen, WidthScreen } from "../TopBar/Dimensions";

import { HP, WP } from "../../../Utils/Resposive";
import { showImgFunc } from "../../../Utils/Data";
import { downloadAndSave } from "../../../Utils/Download";
import { privacy, tags } from "../../../Utils/PickerDataStatus/privacyData";

import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";
import { withoutStringiApiCall2 } from "../../Services/Apis";

import { ACTIONS } from "../../Redux/action-types";
import { fetchComments } from "../../Redux/actions/NewsFeedActions";
import FlashMessage from "react-native-flash-message";

const ImageShowSingle = React.memo((props) => {
  const {
    index,
    postData,
    onRefresh,
    currentDimensions,
    isSinglePictureModell,
    setIsSinglePictureModell,
  } = props;

  let flashRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData);

  const [currentPostData, setCurrentPostData] = useState({});
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [isCommentModel, setIsCommentModel] = useState(false);
  const [data_target, setData_target] = useState();
  const [isComments, setIsComments] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [showSaveModel, setShowSaveModal] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  const onPressTaggedPerson = (item) => {
    setIsSinglePictureModell(false);

    navigation.navigate("ProfileScreen", {
      userName: item.name,
    });
  };

  useEffect(() => {
    setCurrentPostData(postData);
  }, [postData]);

  //////////////////////////////footer functions start////////////////////////

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
    formData.append("post_type", "post");

    postData.reaction = {
      reaction_type_id: 1,
    };

    postData.post_reactions_count = reactChk(
      postData.post_reactions_count,
      postData.localReacted
    );
    postData.localReacted = true;

    setCurrentPostData({
      ...currentPostData,
      reaction: postData.reaction,
      post_reactions_count: postData.post_reactions_count,
      localReacted: postData.localReacted,
    });

    try {
      const res = await withoutStringiApiCall2({
        route: "post/reaction",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
      }
    } catch (e) {
      console.log("saga like gallery pic error -- ", e.toString());
    }
  };

  const unLikeItemFunc = async (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);

    if (postData?.reaction.reaction_type_id == 1) {
      let like = postData?.like?.filter((i) => i.user_id != userName.id);
      postData.like = like;
    }
    if (postData?.reaction.reaction_type_id == 2) {
      let heart = postData?.heart?.filter((i) => i.user_id != userName.id);
      postData.heart = heart;
    }
    if (postData?.reaction.reaction_type_id == 3) {
      let haha = postData?.haha?.filter((i) => i.user_id != userName.id);
      postData.haha = haha;
    }
    if (postData?.reaction.reaction_type_id == 4) {
      let wow = postData?.wow?.filter((i) => i.user_id != userName.id);
      postData.wow = wow;
    }
    if (postData?.reaction.reaction_type_id == 5) {
      let sad = postData?.sad?.filter((i) => i.user_id != userName.id);
      postData.sad = sad;
    }
    if (postData?.reaction.reaction_type_id == 6) {
      let angry = postData?.angry?.filter((i) => i.user_id != userName.id);
      postData.angry = angry;
    }
    postData.reaction = null;
    postData.localReacted = false;
    postData.post_reactions_count = postData.post_reactions_count - 1;
    setCurrentPostData({
      ...currentPostData,
      reaction: postData.reaction,
      post_reactions_count: postData.post_reactions_count,
      localReacted: postData.localReacted,
      like: postData.like,
      heart: postData.heart,
      haha: postData.haha,
      wow: postData.wow,
      sad: postData.sad,
      angry: postData.angry,
    });
    try {
      const res = await withoutStringiApiCall2({
        route: "post/reaction/delete",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in unlike gallery pic ... ", res);
      } else if (res.responseCode == 200) {
      }
    } catch (e) {
      console.log("saga unlike gallery pic error -- ", e.toString());
    }
  };

  const reactionType = async (id, item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");

    if (postData?.reaction?.reaction_type_id == 1) {
      let like = postData?.like?.filter((i) => i.user_id != userName.id);
      postData.like = like;
    }
    if (postData?.reaction?.reaction_type_id == 2) {
      let heart = postData?.heart?.filter((i) => i.user_id != userName.id);
      postData.heart = heart;
    }
    if (postData?.reaction?.reaction_type_id == 3) {
      let haha = postData?.haha?.filter((i) => i.user_id != userName.id);
      postData.haha = haha;
    }
    if (postData?.reaction?.reaction_type_id == 4) {
      let wow = postData?.wow?.filter((i) => i.user_id != userName.id);
      postData.wow = wow;
    }
    if (postData?.reaction?.reaction_type_id == 5) {
      let sad = postData?.sad?.filter((i) => i.user_id != userName.id);
      postData.sad = sad;
    }
    if (postData?.reaction?.reaction_type_id == 6) {
      let angry = postData?.angry?.filter((i) => i.user_id != userName.id);
      postData.angry = angry;
    }
    postData.post_reactions_count = reactChk(
      postData.post_reactions_count,
      postData.localReacted,
      postData.reaction
    );

    postData.reaction = {
      reaction_type_id: id,
    };

    postData.localReacted = true;

    setCurrentPostData({
      ...currentPostData,
      reaction: { reaction_type_id: id },
      post_reactions_count: reactChk(
        item.post_reactions_count,
        item.localReacted,
        item.reaction
      ),
      localReacted: true,
    });

    try {
      const res = await withoutStringiApiCall2({
        route: "post/reaction",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
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

  //////////////////////////////footer functions end////////////////////////

  const handleLongPress = () => {
    setShowSaveModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      {postData?.media[0]?.post_file_type === "image" ||
      postData?.media[0]?.post_file_type === "post" ||
      postData?.media[0]?.post_file_type === "palsome_ai" ? (
        <Modal
          onBackButtonPress={() => {
            setIsSinglePictureModell(false);
          }}
          visible={isSinglePictureModell}
          style={{
            margin: 0,
          }}
        >
          <View
            style={{
              right: 10,
              zIndex: 1000,
              position: "absolute",
              flexDirection: "row",
              top: currentDimensions?.height
                ? currentDimensions?.height * 0.05
                : 35,
            }}
          >
            <TouchableOpacity style={{ padding: 10 }} onPress={handleLongPress}>
              {ICONS.entypo("dots-three-horizontal", COLORS.grey, 35)}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => setIsSinglePictureModell(false)}
            >
              {ICONS.materialIcons("cancel", COLORS.grey, 35)}
            </TouchableOpacity>
          </View>

          <GallerySwiper
            images={[
              postData?.media[0]?.post_file_type === "image" ||
              postData?.media[0]?.post_file_type === "palsome_ai"
                ? {
                    uri: SITE_URL + postData?.media[0]?.path,
                  }
                : { uri: postData?.media[0]?.path },
            ]}
            initialNumToRender={1}
            imageComponent={(imageProps, imageDimensions, index) => (
              <FastImage
                onLoadStart={() => console.log("a===sa")}
                onLoadEnd={() => setLoadingImage(false)}
                {...imageProps}
              />
            )}
            resizeMode="contain"
            sensitiveScroll={false}
            onSwipeUpReleased={() => setIsSinglePictureModell(false)}
            onSwipeDownReleased={(e) => setIsSinglePictureModell(false)}
            onSingleTapConfirmed={() => setVisibleFooter(!visibleFooter)}
            enableScale
            onLongPress={handleLongPress}
          />

          <ActivityIndicator
            animating={loadingImage}
            size="large"
            color={COLORS.primary}
            style={{ position: "absolute", alignSelf: "center" }}
          />
          {visibleFooter && (
            <View
              style={[
                styles.footerWrapper,
                {
                  paddingBottom: currentDimensions?.height
                    ? currentDimensions?.height * 0.05
                    : HeightScreen * 0.02,
                },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 5,
                  marginBottom: HeightScreen * 0.02,
                  marginTop: HeightScreen * 0.01,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // margin: 5,
                  }}
                >
                  <Text style={{}}>
                    <TitleName
                      user={postData?.user}
                      pages={postData?.pages?.[0]}
                      groups={postData?.groups?.[0]}
                      rooms={postData?.rooms?.[0]}
                      events={postData?.events}
                      color={COLORS.white}
                      onPressName={() => setIsSinglePictureModell(false)}
                    />

                    {postData.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {t("is")} {postData.feeling_action}{" "}
                          {postData.feeling_value}{" "}
                          {showImgFunc(postData.feeling_value)}
                        </Text>
                      </>
                    )}

                    {postData?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!postData.feeling_action && "is "}
                          {t("with")}
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: COLORS.primary,
                            }}
                            onPress={() =>
                              onPressTaggedPerson(postData?.tagged_users?.[0])
                            }
                          >
                            {" "}
                            {postData?.tagged_users?.[0]?.first_name}{" "}
                            {postData?.tagged_users?.[0]?.last_name}{" "}
                          </Text>
                          {postData?.tagged_users.length > 1 && (
                            <Text>
                              {t("and")}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: COLORS.primary,
                                }}
                                onPress={() =>
                                  onPressTaggedOthers(postData?.tagged_users)
                                }
                              >
                                {" "}
                                {postData?.tagged_users.length - 1} {t("other")}
                                {postData?.tagged_users.length - 1 > 1
                                  ? "s"
                                  : null}
                              </Text>
                            </Text>
                          )}
                        </Text>
                      </>
                    )}
                    {postData.post_type === "profile_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated profile picture")}
                      </Text>
                    ) : postData.post_type === "shared_post" ? (
                      <Text style={styles.action}>
                        {" "}
                        {t("has shared a post")}{" "}
                        {postData?.groups[0]?.name
                          ? `to ${postData?.groups[0]?.name}`
                          : postData?.pages[0]?.name
                          ? `in ${postData?.pages[0]?.name}`
                          : postData?.rooms[0]?.name
                          ? `in ${postData?.rooms[0]?.name}`
                          : postData?.shared_user_post?.name
                          ? `with ${postData?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : postData.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        {" "}
                        at {postData.post_map}
                      </Text>
                    ) : postData.post_type == "timeline" &&
                      postData.user.id !== postData?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              userName: postData?.wall_user?.name,
                            })
                          }
                          style={styles.name}
                        >
                          {postData?.wall_user?.first_name}{" "}
                          {postData?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}
                  </Text>
                </View>
                <ScrollView style={{ maxHeight: 300 }}>
                  <NewsFeedText
                    txt={postData?.post_text}
                    color={COLORS.white}
                    paddingLeftTrue={true}
                  />
                </ScrollView>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Text style={[styles.time, { color: COLORS.white }]}>
                      {timeDifference(postData.created_at)}
                    </Text>
                    {privacy(postData.post_privacy, "white", {
                      top: 3,
                    })}
                    <Text style={styles.tagTxt}>
                      {tags(postData.post_tag_id)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.likeCommShareWrapper}>
                <ShowLikeCommentShare
                  postId={postData.id}
                  reaction={postData.reaction}
                  post_reactions_count={postData.post_reactions_count}
                  comments_count={
                    postData?.comments_count + postData?.replies_count
                  }
                  shared_post_count={postData?.shared_post_count}
                  like={postData?.like}
                  heart={postData?.heart}
                  haha={postData?.haha}
                  wow={postData?.wow}
                  sad={postData?.sad}
                  angry={postData?.angry}
                  fontColor={COLORS.white}
                  pressfunction={() => {
                    getIdAndDispatch(
                      postData.encrypted_id,
                      postData.id,
                      index,
                      "comment"
                    );
                  }}
                />

                <LikeComShare
                  likePress={() => {
                    likeItemFunc(postData, index);
                  }}
                  unLikePress={() => {
                    unLikeItemFunc(postData, index);
                  }}
                  commentPress={() => {
                    setInputFocus(true);
                    getIdAndDispatch(
                      postData.encrypted_id,
                      postData.id,
                      index,
                      "comment"
                    );

                    // setPostIndex(index);
                  }}
                  sharePress={() => {
                    setShareModel(!shareModel);
                    //  setPostIndex(index);
                  }}
                  likesCount={postData.post_reactions_count}
                  commentsCount={
                    postData.comments_count + postData?.replies_count
                  }
                  shareCount={postData.shared_post_count}
                  color={COLORS.primary}
                  liked={postData.reaction != null ? true : false}
                  reactionID={postData?.reaction?.reaction_type_id}
                  reactionType={(id) => reactionType(id, postData, index)}
                  hideShare={
                    postData?.post_type == "ad_post" ||
                    postData?.post_type === "room_post" ||
                    postData?.post_privacy !== "public"
                  }
                />
              </View>
            </View>
          )}

          <>
            {isCommentModel ? (
              <ComentModel
                inputFocus={inputFocus}
                setInputFocus={setInputFocus}
                isModell={isCommentModel}
                setIsModel={setIsCommentModel}
                item3={postData}
                data_target={data_target}
                encrypted_id={postData.encrypted_id}
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
            {shareModel ? (
              <ShareModel
                shareModel={shareModel}
                setShareModel={setShareModel}
                onRefresh={onRefresh}
                postId={postData.id}
                item={postData}
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

          {showSaveModel && (
            <Modal
              visible={showSaveModel}
              hasBackdrop={true}
              animationInTiming={2000}
              onBackdropPress={() => setShowSaveModal(false)}
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
                    setShowSaveModal(false);
                    const url = SITE_URL + postData?.media[0]?.path;

                    flashRef.current.showMessage({
                      message: "Saving...",
                      type: "info",
                    });

                    downloadAndSave(url, (res) => {
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
        </Modal>
      ) : null}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  ModelContanier: {
    flex: 1,
  },
  footer: {
    width: WidthScreen * 0.9,

    bottom: 1,
    position: "absolute",
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
  content: {
    flex: 1,
    backgroundColor: COLORS.transparent,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 800,
    justifyContent: "space-around",
  },
  header: {
    alignSelf: "baseline",
    borderBottomColor: COLORS.cocoGray,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 5,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.lightGray,
    marginLeft: 5,
    fontWeight: "normal",
    fontSize: 14,
  },
  time: {
    color: COLORS.transparent,
    // marginTop: 5,
    // marginLeft: 10,
  },
  likeCommShareWrapper: { marginBottom: HP(1.5), marginLeft: WP(1.5) },
  footerWrapper: {
    paddingTop: 10,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: COLORS.transparent,

    position: "absolute",
    bottom: 0,
  },
  tagTxt: {
    marginLeft: 8,
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  mapaction: {
    color: COLORS.lightGray,
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default ImageShowSingle;
