import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AutoHeightImage from "react-native-auto-height-image";

import Dp from "../../../Components/NewsFeedList/Dp";
import ShareModel from "../../../Components/ShareModel";
import ComentModel from "../../../Components/ComentModel";
import LikeComShare from "../../../Components/LikeComShare";
import TitleName from "../../../Components/NewsFeedList/TitleName";
import TaggedPeopleModal from "../../../Components/TaggedPeopleModal";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import { timeDifference } from "../../../Components/NewsFeedList/Functions";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";
import AndroidVideoPlayer from "../../Videos/VideoScreen/AndroidVideoPlayer";

import {
  HeightScreen,
  WidthScreen,
} from "../../../Components/TopBar/Dimensions";

import { showImgFunc } from "../../../../Utils/Data";
import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import { privacy, tags } from "../../../../Utils/PickerDataStatus/privacyData";

import {
  likeItem,
  unLikeItem,
  fetchComments,
  showGalleryPostsData,
} from "../../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../../Redux/action-types";

import { SITE_URL } from "../../../Services/Constants";
import { withoutStringiApiCall2 } from "../../../Services/Apis";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import FastImage from "react-native-fast-image";
import { isRTL } from "../../../../Utils/IsRTL";

const MYAutoHeightImage = (props) => {
  const [loading, setImageLoading] = useState(true);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <AutoHeightImage {...props} onLoadEnd={() => setImageLoading(false)} />

      <ActivityIndicator
        animating={loading}
        size="large"
        color={COLORS.primary}
        style={{
          position: "absolute",
          alignSelf: "center",
        }}
      />
    </View>
  );
};

const ImgGridModelScreen = (props) => {
  // console.log("Props============>>", props?.route?.params?.room);
  const { t } = useTranslation();
  const flatlistRef = useRef();
  const { item3, myIndex, onRefresh } = props.route.params;

  const userName = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [media, setMedia] = useState([]);
  const [post, setPost] = useState([]);
  const [postIndex, setPostIndex] = useState();
  const [changedDimensions, setChangedDimensions] = useState({});
  const [isCommentModel, setIsCommentModel] = useState(false);
  const [data_target, setData_target] = useState();
  const [isComments, setIsComments] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [containsVideo, setContainsVideo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [shareModel, setShareModel] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  const gallerPostData = useSelector(
    (state) => state.blackNewsF.gallerPostData
  );

  const likePost = async (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...post];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
        itm.reaction = {
          reaction_type_id: 1,
        };
        itm.post_reactions_count = reactChk(
          itm.post_reactions_count,
          itm.localReacted
        );
        itm.localReacted = true;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setPost(myArray);
  };

  const unLikePost = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...post];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
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
        itm.post_reactions_count = itm.post_reactions_count - 1;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setPost(myArray);
  };

  const reactionTypePost = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...post];
    let myIndex = myArray.indexOf(item3);

    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
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
        itm.post_reactions_count = reactChk(
          itm.post_reactions_count,
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
    setPost(myArray);
  };

  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };

  const likeItemFunc = async (item, index) => {
    console.log("id - -", item.id);
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
        console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        console.log("response in like gallery pic", res);
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
        console.log("res !== 200 in unlike gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        console.log("response in unlike gallery pic", res);
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
        console.log("res !== 200 in like gallery pic ... ", res);
      } else if (res.responseCode == 200) {
        console.log("response in like gallery pic", res);
      }
    } catch (e) {
      console.log("saga like gallery pic error -- ", e.toString());
    }
  };

  const getItemLayout = (data, index) => ({
    length: WidthScreen,
    offset: WidthScreen * index,
    index,
  });

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setData_target(data_target);
    setIsCommentModel(!isCommentModel);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(
      fetchComments({ token, id: id, setIsComments, data_target, page: 0 })
    );
  };

  useEffect(() => {
    setPost(gallerPostData?.post);
  }, [gallerPostData?.post]);

  useEffect(() => {
    setPost(gallerPostData?.post);
  }, []);

  useEffect(() => {
    setMedia(gallerPostData?.post?.[0]?.media);
  }, [gallerPostData?.post?.[0]?.media?.length]);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );

    const navListener = navigation.addListener(
      "gestureEnd",
      handleBackButtonClick
    );
    return () => {
      backhandler.remove();
      navListener();
    };
  }, []);

  function handleBackButtonClick() {
    navigation.goBack();
    dispatch(showGalleryPostsData([]));
    return true;
  }

  const handleOnPressImage = (index) => {
    navigation.navigate("ImageVideoGridSwiperScreen", {
      data: media,
      initialIndex: index,
      post: post,
      updatedDimension: changedDimensions,
    });
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setCurrentIndex(changed?.[0]?.key);
    // console.log("current index", changed?.[0]?.key);
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  const handleImagePress = (index) => {
    flatlistRef.current.scrollToIndex({ index, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, backgroundColor: COLORS.tooLightGrey }}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => handleBackButtonClick()}
            style={{
              width: 80,
            }}
          >
            {ICONS.antDesign(
              isRTL ? "arrowright" : "arrowleft",
              null,
              35,
              styles.headerIcon
            )}
          </TouchableOpacity>
          <View style={{ marginHorizontal: 30 }}>
            <Text numberOfLines={1} style={styles.headerTxt}>
              <TitleName
                item={item3}
                user={item3?.user}
                pages={item3?.pages?.[0]}
                // groups={item3?.groups?.[0]}
                // rooms={item3?.rooms?.[0]}
                events={item3?.events}
                pageVerifiedText={true}
                shared_page_post={item3?.post_shared?.pages}
                style={{
                  fontSize: getWidth(4.5),
                  fontFamily: "Roboto",
                  color: COLORS.black,
                }}
              />
              {item3?.pages?.[0]?.page_verified == "0" ? "'s" : "'s"} post
            </Text>
          </View>
        </View>

        <FlatList
          ref={flatlistRef}
          initialScrollIndex={myIndex}
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewabilityConfig}
          ListHeaderComponent={
            <View>
              <FlatList
                ref={flatlistRef}
                onViewableItemsChanged={_onViewableItemsChanged}
                viewabilityConfig={_viewabilityConfig}
                data={post}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {item.post_type === "shared_post" ? (
                        <>
                          <TouchableOpacity
                            style={styles.upperTab}
                            onPress={() =>
                              navigation.navigate("ProfileScreen", {
                                userName: item?.post_shared?.user?.name,
                              })
                            }
                          >
                            <View style={styles.imgAndStatus}>
                              <Dp
                                user={item?.post_shared?.user}
                                pages={item?.post_shared?.pages?.[0]}
                                groups={item?.post_shared?.groups?.[0]}
                                rooms={item?.post_shared?.rooms?.[0]}
                                events={item?.post_shared?.events}
                              />

                              <View>
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={{ marginLeft: 10 }}>
                                    <TitleName
                                      user={item?.post_shared?.user}
                                      pages={item?.post_shared?.pages?.[0]}
                                      groups={item?.post_shared?.groups?.[0]}
                                      rooms={item?.post_shared?.rooms?.[0]}
                                      events={item?.post_shared?.events}
                                    />
                                    {item?.post_shared?.feeling_action && (
                                      <>
                                        <Text
                                          style={styles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          is {
                                            item?.post_shared?.feeling_action
                                          }{" "}
                                          {item?.post_shared?.feeling_value}{" "}
                                          {showImgFunc(
                                            item?.post_shared?.feeling_value
                                          )}
                                        </Text>
                                      </>
                                    )}
                                    {item?.post_shared?.tagged_users?.length >
                                      0 && (
                                      <>
                                        <Text
                                          style={styles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          {!item?.post_shared.feeling_action &&
                                            "is "}
                                          with
                                          <Text
                                            style={{
                                              fontWeight: "bold",
                                              color: COLORS.primary,
                                            }}
                                            onPress={() =>
                                              navigation.navigate(
                                                "ProfileScreen",
                                                {
                                                  userName:
                                                    item?.post_shared
                                                      ?.tagged_users?.[0]?.name,
                                                }
                                              )
                                            }
                                          >
                                            {" "}
                                            {
                                              item?.post_shared
                                                ?.tagged_users?.[0]?.first_name
                                            }{" "}
                                            {
                                              item?.post_shared
                                                ?.tagged_users?.[0]?.last_name
                                            }{" "}
                                          </Text>
                                          {item?.post_shared?.tagged_users
                                            .length > 1 && (
                                            <Text>
                                              {t("and")}
                                              <Text
                                                onPress={() =>
                                                  onPressTaggedOthers(
                                                    item?.post_shared
                                                      .tagged_users
                                                  )
                                                }
                                                style={{
                                                  fontWeight: "bold",
                                                  color: COLORS.primary,
                                                }}
                                              >
                                                {" "}
                                                {item?.post_shared?.tagged_users
                                                  .length - 1}{" "}
                                                {t("other")}
                                                {item?.post_shared?.tagged_users
                                                  .length -
                                                  1 >
                                                1
                                                  ? "s"
                                                  : null}
                                              </Text>
                                            </Text>
                                          )}
                                        </Text>
                                      </>
                                    )}
                                    {item?.post_shared?.post_type ===
                                    "profile_picture" ? (
                                      <Text
                                        style={styles.action}
                                        onPress={() => null}
                                      >
                                        {" "}
                                        {t("updated profile picture")}
                                      </Text>
                                    ) : item?.post_shared?.post_type ===
                                      "shared_post" ? (
                                      <Text
                                        style={styles.action}
                                        onPress={() => null}
                                      >
                                        {" "}
                                        {t("has shared a post")}{" "}
                                        {item?.post_shared?.groups[0]?.name
                                          ? `to ${item?.post_shared?.groups[0]?.name}`
                                          : item?.post_shared?.pages[0]?.name
                                          ? `in ${item?.post_shared?.pages[0]?.name}`
                                          : item?.post_shared?.rooms[0]?.name
                                          ? `in ${item?.post_shared?.rooms[0]?.name}`
                                          : item?.post_shared?.shared_user_post
                                              ?.name
                                          ? `with ${item?.post_shared?.shared_user_post?.name}`
                                          : null}
                                      </Text>
                                    ) : item?.post_shared?.post_map ? (
                                      <Text
                                        onPress={() => null}
                                        style={styles.mapaction}
                                      >
                                        {" "}
                                        at {item?.post_shared?.post_map}
                                      </Text>
                                    ) : item?.post_shared?.post_type ==
                                        "timeline" &&
                                      item?.post_shared?.user?.id !==
                                        item?.post_shared?.wall_user?.id ? (
                                      <>
                                        <Text style={styles.action}>
                                          {" "}
                                          {t("posted on ")}
                                        </Text>

                                        <Text style={styles.name}>
                                          {
                                            item?.post_shared?.wall_user
                                              ?.first_name
                                          }{" "}
                                          {
                                            item?.post_shared?.wall_user
                                              ?.last_name
                                          }
                                        </Text>
                                        <Text style={styles.action}>
                                          {t("'s timeline")}
                                        </Text>
                                      </>
                                    ) : null}
                                  </Text>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                  <Text style={styles.time}>
                                    {timeDifference(
                                      item?.post_shared?.created_at
                                    )}
                                  </Text>

                                  <Text style={styles.tagTxt}>
                                    {tags(item?.post_shared?.post_tag_id)}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>

                          {item.post_shared?.post_text != null ? (
                            <View style={styles.posttextBox}>
                              {/* <Text>{item?.post_shared?.post_text}</Text> */}
                              <NewsFeedText
                                txt={item?.post_shared?.post_text}
                              />
                            </View>
                          ) : null}
                          <View style={{ backgroundColor: COLORS.white }}>
                            <ShowLikeCommentShare
                              postId={item.post_shared?.id}
                              reaction={item?.post_shared?.reaction}
                              post_reactions_count={
                                item?.post_shared?.post_reactions_count
                              }
                              comments_count={
                                item?.post_shared?.comments_count +
                                item?.post_shared?.replies_count
                              }
                              shared_post_count={
                                item?.post_shared?.shared_post_count
                              }
                              like={item?.post_shared?.like}
                              heart={item?.post_shared?.heart}
                              haha={item?.post_shared?.haha}
                              wow={item?.post_shared?.wow}
                              sad={item?.post_shared?.sad}
                              angry={item?.post_shared?.angry}
                              fontColor={COLORS.black}
                              pressfunction={() => {
                                getIdAndDispatch(
                                  item.encrypted_id,
                                  item.id,
                                  index
                                );
                                setPostIndex(index);
                              }}
                            />
                          </View>
                          <View style={styles.LikeShareCommBox}>
                            <LikeComShare
                              likePress={() => {
                                likePost(item);
                              }}
                              unLikePress={() => {
                                unLikePost(item);
                              }}
                              commentPress={() => {
                                setInputFocus(true);
                                getIdAndDispatch(
                                  item.encrypted_id,
                                  item.id,
                                  index,
                                  "comment"
                                );
                                setPostIndex(index);
                              }}
                              reactionType={(id) =>
                                reactionTypePost(id, item, index)
                              }
                              sharePress={() => {
                                setShareModel(!shareModel);
                                setPostIndex(index);
                              }}
                              color={COLORS.primary}
                              // commentPress={() => {
                              //   setIsModel(!isModell);
                              //   setPostId(item?.encrypted_id);
                              // }}
                              like={item?.post_shared?.like}
                              comments_count={
                                item?.post_shared?.comments_count +
                                item?.post_shared?.replies_count
                              }
                              shareCount={item?.post_shared?.shared_post_count}
                              liked={item.reaction != null ? true : false}
                              reactionID={item?.reaction?.reaction_type_id}
                            />
                          </View>
                        </>
                      ) : (
                        <View>
                          <TouchableOpacity style={styles.upperTab}>
                            <View style={styles.imgAndStatus}>
                              <Dp
                                user={item?.user}
                                pages={item?.pages?.[0]}
                                groups={item?.groups?.[0]}
                                rooms={item?.rooms?.[0]}
                                events={item?.events}
                              />

                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={{ marginLeft: 10 }}>
                                    <TitleName
                                      user={item?.user}
                                      pages={item?.pages?.[0]}
                                      groups={item?.groups?.[0]}
                                      rooms={item?.rooms?.[0]}
                                      events={item?.events}
                                    />
                                    {item.feeling_action && (
                                      <>
                                        <Text
                                          style={styles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          is {item.feeling_action}{" "}
                                          {item.feeling_value}{" "}
                                          {showImgFunc(item.feeling_value)}
                                        </Text>
                                      </>
                                    )}
                                    {item?.tagged_users?.length > 0 && (
                                      <>
                                        <Text
                                          style={styles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          {!item.feeling_action && "is "}
                                          with
                                          <Text
                                            style={{
                                              fontWeight: "bold",
                                              color: COLORS.primary,
                                            }}
                                            onPress={() =>
                                              navigation.navigate(
                                                "ProfileScreen",
                                                {
                                                  userName:
                                                    item?.tagged_users?.[0]
                                                      ?.name,
                                                }
                                              )
                                            }
                                          >
                                            {" "}
                                            {
                                              item?.tagged_users?.[0]
                                                ?.first_name
                                            }{" "}
                                            {item?.tagged_users?.[0]?.last_name}{" "}
                                          </Text>
                                          {item?.tagged_users.length > 1 && (
                                            <Text>
                                              {t("and")}
                                              <Text
                                                onPress={() =>
                                                  onPressTaggedOthers(
                                                    item?.tagged_users
                                                  )
                                                }
                                                style={{
                                                  fontWeight: "bold",
                                                  color: COLORS.primary,
                                                }}
                                              >
                                                {" "}
                                                {item?.tagged_users.length -
                                                  1}{" "}
                                                {t("other")}
                                                {item?.tagged_users.length - 1 >
                                                1
                                                  ? "s"
                                                  : null}
                                              </Text>
                                            </Text>
                                          )}
                                        </Text>
                                      </>
                                    )}

                                    {item.post_type === "profile_picture" ? (
                                      <Text
                                        style={styles.action}
                                        onPress={() => null}
                                      >
                                        {" "}
                                        {t("updated profile picture")}
                                      </Text>
                                    ) : item.post_type === "shared_post" ? (
                                      <Text style={styles.action}>
                                        {" "}
                                        {t("has shared a post")}{" "}
                                        {item?.groups[0]?.name
                                          ? `to ${item?.groups[0]?.name}`
                                          : item?.pages[0]?.name
                                          ? `in ${item?.pages[0]?.name}`
                                          : item?.rooms[0]?.name
                                          ? `in ${item?.rooms[0]?.name}`
                                          : item?.shared_user_post?.name
                                          ? `with ${item?.shared_user_post?.name}`
                                          : null}
                                      </Text>
                                    ) : item.post_map ? (
                                      <Text
                                        onPress={() => null}
                                        style={styles.mapaction}
                                      >
                                        {" "}
                                        at {item.post_map}
                                      </Text>
                                    ) : item.post_type == "timeline" &&
                                      item.user.id !== item?.wall_user?.id ? (
                                      <>
                                        <Text style={styles.action}>
                                          {" "}
                                          {t("posted on ")}
                                        </Text>

                                        <Text style={styles.name}>
                                          {item?.wall_user?.first_name}{" "}
                                          {item?.wall_user?.last_name}
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
                                      {timeDifference(item.created_at)}
                                    </Text>
                                    {privacy(item.post_privacy)}
                                    <Text style={styles.tagTxt}>
                                      {tags(item.post_tag_id)}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                          {item.post_text != null ? (
                            <View style={styles.posttextBox}>
                              {/* <Text>{item.post_text}</Text> */}
                              <NewsFeedText txt={item.post_text} />
                            </View>
                          ) : null}
                          <View
                            style={{
                              backgroundColor: COLORS.white,
                              paddingBottom: 10,
                            }}
                          >
                            <ShowLikeCommentShare
                              postId={item.id}
                              reaction={item.reaction}
                              post_reactions_count={item.post_reactions_count}
                              comments_count={
                                item.comments_count + item?.replies_count
                              }
                              shared_post_count={item.shared_post_count}
                              like={item.like}
                              heart={item.heart}
                              haha={item.haha}
                              wow={item.wow}
                              sad={item.sad}
                              angry={item.angry}
                              fontColor={COLORS.black}
                              pressfunction={() => {
                                getIdAndDispatch(
                                  item.encrypted_id,
                                  item.id,
                                  index,
                                  "comment"
                                );

                                setPostIndex(index);
                              }}
                            />

                            <LikeComShare
                              likePress={() => {
                                likePost(item);
                              }}
                              unLikePress={() => {
                                unLikePost(item);
                              }}
                              commentPress={() => {
                                setInputFocus(true);

                                getIdAndDispatch(
                                  item.encrypted_id,
                                  item.id,
                                  index,
                                  "comment"
                                );

                                setPostIndex(index);
                              }}
                              reactionType={(id) =>
                                reactionTypePost(id, item, index)
                              }
                              sharePress={() => {
                                setShareModel(!shareModel);
                                setPostIndex(index);
                              }}
                              color={COLORS.primary}
                              likesCount={item3.post_reactions_count}
                              commentsCount={
                                item.comments_count + item.replies_count
                              }
                              shareCount={item.shared_post_count}
                              liked={item.reaction != null ? true : false}
                              reactionID={item?.reaction?.reaction_type_id}
                              hideShare={
                                item?.post_type == "ad_post" ||
                                item?.post_type === "room_post" ||
                                item?.post_privacy !== "public"
                              }
                            />
                          </View>
                        </View>
                      )}

                      {shareModel && postIndex == index ? (
                        <ShareModel
                          shareModel={shareModel}
                          setShareModel={setShareModel}
                          onRefresh={onRefresh}
                          postId={item.id}
                          item={item}
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
                  );
                }}
                keyExtractor={(item, indexx) => indexx.toString()}
              />
            </View>
            // ----------------------------header end -----------------------------
          }
          getItemLayout={getItemLayout}
          data={media}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1 }}>
                {gallerPostData?.post?.[0]?.media?.length && (
                  <View style={styles.list}>
                    {item.post_file_type === "image" ? (
                      <View style={{ marginBottom: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            navigation.navigate("ImageVideoGridSwiperScreen", {
                              data: media,
                              initialIndex: index,
                              post: post,
                              updatedDimension: changedDimensions,
                              containsVideo: containsVideo,
                            });
                          }}
                        >
                          <MYAutoHeightImage
                            width={WidthScreen * 0.995}
                            source={{
                              uri: SITE_URL + item.path,
                            }}
                            maxHeight={HeightScreen * 0.5}
                            style={styles.Thumbnail}
                          />
                        </TouchableWithoutFeedback>

                        <ShowLikeCommentShare
                          postId={item.post_id}
                          reaction={item.reaction}
                          post_reactions_count={
                            item.gallery_post_reactions_count
                          }
                          comments_count={
                            item.comments_count + item.replies_count
                          }
                          shared_post_count={item.shared_post_count}
                          like={item.like}
                          heart={item.heart}
                          haha={item.haha}
                          wow={item.wow}
                          sad={item.sad}
                          angry={item.angry}
                          fontColor={COLORS.black}
                          pressfunction={() => {
                            getIdAndDispatch(
                              item.encrypted_id,
                              item.id,
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
                              item.encrypted_id,
                              item.id,
                              index,
                              "gallery_comment"
                            );
                            setPostIndex(index);
                          }}
                          hideShare
                          likesCount={item.gallery_post_reactions_count}
                          commentsCount={
                            item.comments_count + item.replies_count
                          }
                          shareCount={item.shared_post_count}
                          color={COLORS.primary}
                          liked={item.reaction != null ? true : false}
                          reactionID={item?.reaction?.reaction_type_id}
                          reactionType={(id) => reactionType(id, item, index)}
                        />
                      </View>
                    ) : item.post_file_type === "palsome_ai" ? (
                      <View style={{ marginBottom: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            navigation.navigate("ImageVideoGridSwiperScreen", {
                              data: media,
                              initialIndex: index,
                              post: post,
                              updatedDimension: changedDimensions,
                              containsVideo: containsVideo,
                            });
                          }}
                        >
                          <MYAutoHeightImage
                            width={WidthScreen * 0.995}
                            source={{
                              uri: SITE_URL + item.path,
                            }}
                            maxHeight={HeightScreen * 0.5}
                            style={styles.Thumbnail}
                          />
                        </TouchableWithoutFeedback>

                        <ShowLikeCommentShare
                          postId={item.post_id}
                          reaction={item.reaction}
                          post_reactions_count={
                            item.gallery_post_reactions_count
                          }
                          comments_count={
                            item.comments_count + item.replies_count
                          }
                          shared_post_count={item.shared_post_count}
                          like={item.like}
                          heart={item.heart}
                          haha={item.haha}
                          wow={item.wow}
                          sad={item.sad}
                          angry={item.angry}
                          fontColor={COLORS.black}
                          pressfunction={() => {
                            getIdAndDispatch(
                              item.encrypted_id,
                              item.id,
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
                              item.encrypted_id,
                              item.id,
                              index,
                              "gallery_comment"
                            );
                            setPostIndex(index);
                          }}
                          hideShare
                          likesCount={item.gallery_post_reactions_count}
                          commentsCount={
                            item.comments_count + item.replies_count
                          }
                          shareCount={item.shared_post_count}
                          color={COLORS.primary}
                          liked={item.reaction != null ? true : false}
                          reactionID={item?.reaction?.reaction_type_id}
                          reactionType={(id) => reactionType(id, item, index)}
                        />
                      </View>
                    ) : item?.post_file_type === "post" ? (
                      <View style={{ marginBottom: 10 }}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            navigation.navigate("ImageVideoGridSwiperScreen", {
                              data: media,
                              initialIndex: index,
                              post: post,
                              updatedDimension: changedDimensions,
                              containsVideo: containsVideo,
                            });
                          }}
                        >
                          <MYAutoHeightImage
                            width={WidthScreen * 0.995}
                            source={{
                              uri: item.path,
                            }}
                            maxHeight={HeightScreen * 0.5}
                            style={styles.Thumbnail}
                          />
                        </TouchableWithoutFeedback>

                        <ShowLikeCommentShare
                          postId={item.post_id}
                          reaction={item.reaction}
                          post_reactions_count={
                            item.gallery_post_reactions_count
                          }
                          comments_count={
                            item.comments_count + item.replies_count
                          }
                          shared_post_count={item.shared_post_count}
                          like={item.like}
                          heart={item.heart}
                          haha={item.haha}
                          wow={item.wow}
                          sad={item.sad}
                          angry={item.angry}
                          fontColor={COLORS.black}
                          pressfunction={() => {
                            getIdAndDispatch(
                              item.encrypted_id,
                              item.id,
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
                              item.encrypted_id,
                              item.id,
                              index,
                              "gallery_comment"
                            );
                            setPostIndex(index);
                          }}
                          hideShare
                          likesCount={item.gallery_post_reactions_count}
                          commentsCount={
                            item.comments_count + item.replies_count
                          }
                          shareCount={item.shared_post_count}
                          color={COLORS.primary}
                          liked={item.reaction != null ? true : false}
                          reactionID={item?.reaction?.reaction_type_id}
                          reactionType={(id) => reactionType(id, item, index)}
                        />
                      </View>
                    ) : (
                      <View style={{ marginBottom: 10 }}>
                        {containsVideo ? null : setContainsVideo(true)}

                        {Platform.OS == "ios" ? (
                          <>
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
                                index={index + 1}
                              />
                            ) : item?.stream_path720 != null ? (
                              <AndroidVideoPlayer
                                source={{
                                  uri:
                                    SITE_URL +
                                    "converted_videos/" +
                                    item?.stream_path720,
                                }}
                                style={{
                                  height: getHeight(45),
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
                                index={index + 1}
                              />
                            ) : (
                              <Text>Video Not Found</Text>
                            )}
                          </>
                        ) : (
                          <>
                            {item?.stream_path240 != null ? (
                              <AndroidVideoPlayer
                                source={{
                                  uri:
                                    SITE_URL +
                                    "converted_videos/" +
                                    item?.stream_path240,
                                }}
                                style={{
                                  height: 300,
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
                                index={index}
                              />
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
                                index={index}
                              />
                            ) : (
                              <Text>Video Not Found</Text>
                            )}
                          </>
                        )}

                        <ShowLikeCommentShare
                          reaction={item.reaction}
                          post_reactions_count={
                            item.gallery_post_reactions_count
                          }
                          comments_count={
                            item.comments_count + item.replies_count
                          }
                          shared_post_count={item.shared_post_count}
                          like={item.like}
                          heart={item.heart}
                          haha={item.haha}
                          wow={item.wow}
                          sad={item.sad}
                          angry={item.angry}
                          fontColor={COLORS.black}
                          pressfunction={() => {
                            getIdAndDispatch(
                              item.encrypted_id,
                              item.id,
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
                              item.encrypted_id,
                              item.id,
                              index,
                              "gallery_comment"
                            );
                            setPostIndex(index);
                          }}
                          hideShare
                          likesCount={item.gallery_post_reactions_count}
                          commentsCount={
                            item.comments_count + item.replies_count
                          }
                          shareCount={item.shared_post_count}
                          color={COLORS.primary}
                          liked={item.reaction != null ? true : false}
                          reactionID={item?.reaction?.reaction_type_id}
                          reactionType={(id) => reactionType(id, item, index)}
                        />
                      </View>
                    )}
                  </View>
                )}

                {isCommentModel && postIndex == index ? (
                  <ComentModel
                    inputFocus={inputFocus}
                    setInputFocus={setInputFocus}
                    isModell={isCommentModel}
                    setIsModel={setIsCommentModel}
                    item3={item}
                    data_target={data_target}
                    encrypted_id={item.encrypted_id}
                    fromImageGride
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
              </View>
            );
          }}
        />
      </View>
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
    shadowColor: COLORS.black,
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
    backgroundColor: "white",
  },
  list: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: COLORS.tooLightGrey,
    backgroundColor: COLORS.white,
  },

  Thumbnail: {
    justifyContent: "center",
    alignItems: "center",
    // height: WidthScreen,
    borderBottomWidth: 1,
    borderTopWidth: 10,
    backgroundColor: "white",
    borderColor: COLORS.tooLightGrey,
    minHeight: HeightScreen * 0.2,
    resizeMode: "contain",

    // flex: 1,
  },
  backGroundImg: {
    justifyContent: "center",
    width: WidthScreen,
  },
  txt: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },
  backGroundImgView: {
    backgroundColor: COLORS.transparent,
    height: HeightScreen,
    justifyContent: "center",
    alignItems: "center",
  },
  upperTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 15,
    marginTop: 8,
    backgroundColor: COLORS.white,
  },
  imgAndStatus: {
    flexDirection: "row",
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  name: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.lightGray,
    marginLeft: 5,
  },
  time: {
    color: COLORS.black,
    marginLeft: 10,
  },
  tagTxt: {
    left: getWidth(2.5),
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  footerwrapper: {
    paddingBottom: HeightScreen * 0.045,
    // paddingTop: 10,
    paddingHorizontal: 10,
    width: WidthScreen,
    backgroundColor: COLORS.transparent,
    position: "absolute",
    bottom: 0,
  },
  headerBox: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: HeightScreen * 0.02,
  },
  headerIcon: {
    marginLeft: WidthScreen * 0.01,
    alignSelf: "flex-start",
  },
  headerTxt: {
    position: "absolute",
    alignSelf: "center",
    fontSize: getWidth(4.5),
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginRight: 10,
    marginLeft: 30,
    bottom: 6,
  },
  LikeShareCommBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 10,
    marginTop: 1,
  },

  posttextBox: {
    flex: 0.7,
    paddingLeft: 16,
    backgroundColor: COLORS.white,
  },
  mapaction: {
    color: COLORS.lightGray,
    marginLeft: 5,
    fontWeight: "bold",
  },
  imageThumbnailPostMap: {
    justifyContent: "center",
    alignItems: "center",
    height: 210,
  },
});

export default ImgGridModelScreen;
