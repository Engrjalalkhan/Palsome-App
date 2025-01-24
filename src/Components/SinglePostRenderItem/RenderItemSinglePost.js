import { useTranslation } from "react-i18next";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Alert, Dimensions } from "react-native";
import { Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import { HP, WP } from "../../../Utils/Resposive";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { timeDifference } from "../NewsFeedList/Functions";
import { privacy, tags } from "../../../Utils/PickerDataStatus/privacyData";
import { getWidth } from "../../../Utils/NewResponsive";
import { ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ShowLikeCommentShare from "../ShowLikeCommentShare";
import LikeComShare from "../LikeComShare";
import Dp from "../NewsFeedList/Dp";
import TitleName from "../NewsFeedList/TitleName";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import ImageGrid from "../ImageGridFlatlist";
import Toast from "react-native-simple-toast";

import { ACTIONS } from "../../Redux/action-types";

import {
  fetchComments,
  unLikeItem,
  likeItem,
  showGalleryPosts,
  deletePost,
  editPost,
  fetchSinglePost,
} from "../../Redux/actions/NewsFeedActions";

import { useNavigation } from "@react-navigation/native";
import ShareModel from "../ShareModel";
import ComentModel from "../ComentModel";

import ImageShowSingle from "../ImageShowSingle";
import { showImgFunc } from "../../../Utils/Data";
import TaggedPeopleModal from "../TaggedPeopleModal";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";
import PostMenuModel from "../NewsFeedList/PostMenuModel";
import EditPostModal from "../EditPostModal";
import { ICONS } from "../../Constants/Icons";
import { postStatusApiCall } from "../../Services/Apis";
import LogoutModal from "../LogoutModal";
import { deleteApiData } from "../../Screens/Main/ReminderScreen/Components/remindersApiCall";
import { showMessage } from "react-native-flash-message";
import SavePostFeed from "../SavePost/SavePostFeed";
import { getSavedPostList } from "../../Redux/actions/EventActions";
const RenderItemSinglePost = ({
  item,
  index,
  data,
  setData,
  fetchUri,
  setLoading,
  fromSavedPost,
}) => {
  // console.log("RenderItemSinglePost>>>>>", item?.post_shared?.post_type);

  const [isModell, setIsModel] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [data_target, setData_target] = useState("");
  const [shareModel, setShareModel] = useState(false);
  const [isComments, setIsComments] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [currentDimensions, setCurrentDimensions] = useState();
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [saved_post, setSavedPost] = useState("");
  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

  const imageModelShow = (item, index, myIndex) => {
    // setImageGridIndex(index);
    // setPostGalleryIndex(myIndex);

    setIsSinglePictureModell(!isSinglePictureModell);
  };

  ///////////////////////////////////////////////////
  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };
  const likeItemFunc = async (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");
    console.log(formData);
    dispatch(likeItem({ token, formData }));

    let myArray = [...data];
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
    setData(myArray);
  };

  const unLikeItemFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...data];
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
    setData(myArray);
  };

  const reactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...data];
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
    setData(myArray);
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    // console.log("getIDAndDispatch function called");
    setData_target(data_target);
    setIsModel(!isModell);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(
      fetchComments({ token, id: id, setIsComments, data_target, page: 0 })
    );
  };

  useEffect(() => {
    // console.log("current Item", item);
    setCurrentItem(item);
    // getIdAndDispatch(item.encrypted_id, item.id, 1, "comment");
  }, [item]);

  const onPressTaggedPerson = (item) => {
    navigation.navigate("ProfileScreen", {
      id: item.id,
    });
  };
  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };
  // const deleteMyPost = (id) => {
  //   dispatch(deletePost({ id, token }));
  //   navigation.goBack();
  // };

  const unTagUsers = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    const res = await postStatusApiCall({
      route: "post/tagged-users/untag",
      verb: "POST",
      token: token,
      body: formData,
    });

    if (res.responseCode === 200) {
      navigation.goBack();
      Toast.show(t("You have been successfully untagged from this post"));
    }
    return res;
  };

  const deleteMyPost = async (id, tag) => {
    if (tag) {
      let filter = data?.find((post) => {
        return post?.encrypted_id === id;
      });
      const res = await unTagUsers(id);
      if (res?.responseCode == 200) {
        if (filter) {
          const updatedData = data?.map((post) => {
            if (post?.encrypted_id === id) {
              const filteredUsers = post?.tagged_users?.filter(
                (user) => user?.id !== userName?.id
              );

              return { ...post, tagged_users: filteredUsers };
            }
            return post;
          });

          setData(updatedData);
        }
      } else {
        console.log("Error occurred while untagging users.");
      }
    } else {
      dispatch(deletePost({ id, token }));
      navigation.goBack();
    }
  };

  const showConfirmDialog = (id, tag) => {
    let message = t("Are you sure?");
    if (tag) {
      message = t("You won't be tagged in this post anymore");
    } else {
      message = t("Are you sure you want to remove this post?");
    }

    return Alert.alert(tag ? t("Remove tag") : t("Are you sure?"), message, [
      {
        text: tag ? t("Remove tag") : t("Yes"),
        onPress: () => {
          deleteMyPost(id, tag);
        },
      },
      {
        text: tag ? t("cancel") : t("No"),
      },
    ]);
  };
  const editMyPost = (id) => {
    dispatch(editPost({ id, token }));
    setTimeout(() => {
      setEditPostVisibility(true);
    }, 500);
  };
  const onPressSavedPost = useCallback(
    (post) => {
      setSavedPost(post);
      setTimeout(() => {
        setIsSavePostModalVisible(true);
      }, 500);
    },
    [isSavePostModalVisible]
  );

  const onPressUnSavePost = (post) => {
    setSavedPost(post);
    setTimeout(() => {
      setUnSavedPostModal(true);
    }, 500);
  };

  const onPressUnSavePostConfirm = async () => {
    setUnSavedPostModal(false);
    let apiRoute;
    let verb = "DELETE";
    apiRoute = `collections/post?post_id=${saved_post.encrypted_id}&collection_id=${saved_post?.saved_post[0]?.encrypted_id}`;
    let unSavePost = await deleteApiData(apiRoute, token, verb);
    if (unSavePost?.responseCode === 200) {
      showMessage({
        message: t(`${unSavePost?.message}`),
        type: "info",
        position: "bottom",
      });

      const updatedData = data.map((item) => {
        if (item?.encrypted_id === saved_post.encrypted_id) {
          return {
            ...item,
            saved_post: [],
          };
        }
        return item;
      });
      setData(updatedData);
      dispatch(
        fetchSinglePost({ token, url: fetchUri, setLoading: setLoading })
      );
      if (fromSavedPost) {
        navigation?.goBack();
        dispatch(getSavedPostList(true));
      }
    }
  };
  

  return currentItem ? (
    <View style={styles.container}>
      {editPostVisibility && item.encrypted_id ? (
        <EditPostModal
          visible={editPostVisibility}
          goBack={() => setEditPostVisibility(false)}
        />
      ) : null}

      <>
        <View style={styles.upperTab}>
          <View style={styles.imgAndStatus}>
            <Dp
              user={currentItem?.user}
              pages={currentItem?.pages?.[0]}
              groups={currentItem?.groups?.[0]}
              rooms={currentItem?.rooms?.[0]}
              events={currentItem?.events}
              shared_page_post= {item?.shared_page_post}
            />

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10 }}>
                  <TitleName
                    user={currentItem?.user}
                    pages={currentItem?.pages?.[0]}
                    groups={currentItem?.groups?.[0]}
                    rooms={currentItem?.rooms?.[0]}
                    events={currentItem?.events}
                    shared_page_post= {item?.shared_page_post}
                    item={currentItem}
                  />
                  {currentItem?.feeling_action && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        is {currentItem?.feeling_action}{" "}
                        {currentItem?.feeling_value}{" "}
                        {showImgFunc(currentItem?.feeling_value)}
                      </Text>
                    </>
                  )}
                  {currentItem?.tagged_users?.length > 0 && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {!currentItem.feeling_action && "is "}
                        with
                        <Text
                          onPress={() =>
                            onPressTaggedPerson(currentItem?.tagged_users?.[0])
                          }
                          style={{
                            fontWeight: "bold",
                            color: COLORS.primary,
                            fontSize: 16,
                          }}
                        >
                          {" "}
                          {currentItem?.tagged_users?.[0]?.first_name}{" "}
                          {currentItem?.tagged_users?.[0]?.last_name}{" "}
                        </Text>
                        {currentItem?.tagged_users.length > 1 && (
                          <Text>
                            and
                            <Text
                              onPress={() =>
                                onPressTaggedOthers(currentItem?.tagged_users)
                              }
                              style={{
                                fontWeight: "bold",
                                color: COLORS.primary,
                              }}
                            >
                              {" "}
                              {currentItem?.tagged_users.length - 1} other
                              {currentItem?.tagged_users.length - 1 > 1
                                ? "s"
                                : null}
                            </Text>
                          </Text>
                        )}
                      </Text>
                    </>
                  )}
                  {currentItem?.post_type === "profile_picture" ? (
                    <Text style={styles.action} onPress={() => null}>
                      {" "}
                      {t("updated profile picture")}
                    </Text>
                  ) : currentItem?.post_type === "shared_post" ? (
                    <Text style={styles.action}>
                      {" "}
                      {t("has shared a post")}{" "}
                      {currentItem?.groups[0]?.name
                        ? `in ${"a group"}`
                        : currentItem?.pages[0]?.name
                        ? `in ${currentItem?.pages[0]?.name}`
                        : currentItem?.rooms[0]?.name
                        ? `in ${"a room"}`
                        : currentItem?.shared_user_post?.name
                        ? `with ${currentItem?.shared_user_post?.name}`
                        : null}
                    </Text>
                  ) : currentItem?.post_map ? (
                    <Text onPress={() => null} style={styles.mapaction}>
                      {" "}
                      at {currentItem?.post_map}
                    </Text>
                  ) : currentItem?.post_type == "timeline" ||
                    currentItem?.post_type === "birthday_post" ? (
                    currentItem?.user?.id !== currentItem?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              userName: currentItem?.wall_user?.name,
                            })
                          }
                          style={styles.name}
                        >
                          {currentItem?.wall_user?.first_name}{" "}
                          {currentItem?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null
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
                {item?.post_type == "ad_post" ? (
                      <Text style={styles.time}>{t("Sponsored")}</Text>
                    ) :(
                  <Text style={styles.time}>
                    {timeDifference(currentItem?.created_at)}
                  </Text>)}
                  <View style={styles.privacyTagContainer}>
                    {privacy(currentItem?.post_privacy)}
                  </View>
                  
                  {item?.post_type !== "ad_post" ? (
                      <Text style={styles.tagTxt}>
                        {tags(currentItem?.post_tag_id)}
                      </Text>
                    ) : null}
                </View>

                <PostMenuModel
                  showConfirmDialog={showConfirmDialog}
                  editMyPost={editMyPost}
                  item3={item}
                  isAdmin={item?.user?.id == userName?.id ? true : false}
                  isTimeLine={item?.wall_id == userName?.id}
                  unSavePost={onPressUnSavePost}
                  savePost={onPressSavedPost}
                />
              </View>
            </View>
          </View>
        </View>
        {currentItem?.post_text != null ? (
          <View style={{ flex: 0.7, paddingHorizontal: 16, paddingBottom: 7 }}>
            {currentItem?.pattern ? null : (
              <NewsFeedText txt={currentItem?.post_text} />
            )}
          </View>
        ) : null}
      </>

      {/* ------------shared start---------------------  */}
      {currentItem?.post_type === "shared_post" ? (
        <View style={styles.sharePost}>
          {currentItem?.post_shared !== null && (
            <View style={[styles.upperTab, { marginBottom: 10 }]}>
              <Dp
                user={currentItem?.post_shared?.user}
                pages={currentItem?.post_shared?.pages?.[0]}
                groups={currentItem?.post_shared?.groups?.[0]}
                rooms={currentItem?.post_shared?.rooms?.[0]}
                events={currentItem?.post_shared?.events}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>
                    <TitleName
                      user={currentItem?.post_shared?.user}
                      pages={currentItem?.post_shared?.pages?.[0]}
                      groups={currentItem?.post_shared?.groups?.[0]}
                      rooms={currentItem?.post_shared?.rooms?.[0]}
                      events={currentItem?.post_shared?.events}
                    />
                    {currentItem?.post_shared?.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {t("is")} {currentItem?.post_shared?.feeling_action}{" "}
                          {currentItem?.post_shared?.feeling_value}{" "}
                          {showImgFunc(currentItem?.post_shared?.feeling_value)}
                        </Text>
                      </>
                    )}

                    {currentItem?.post_shared?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!currentItem?.post_shared?.feeling_action && "is "}
                          {t("with")}
                          <Text
                            onPress={() =>
                              onPressTaggedPerson(
                                currentItem?.post_shared?.tagged_users?.[0]
                              )
                            }
                            style={{
                              fontWeight: "bold",
                              color: COLORS.primary,
                              fontSize: 16,
                            }}
                          >
                            {" "}
                            {
                              currentItem?.post_shared?.tagged_users?.[0]
                                ?.first_name
                            }{" "}
                            {
                              currentItem?.post_shared?.tagged_users?.[0]
                                ?.last_name
                            }{" "}
                          </Text>
                          {currentItem?.post_shared?.tagged_users.length >
                            1 && (
                            <Text>
                              {t("and")}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: COLORS.primary,
                                }}
                                onPress={() =>
                                  onPressTaggedOthers(
                                    currentItem?.post_shared?.tagged_users
                                  )
                                }
                              >
                                {" "}
                                {currentItem?.post_shared?.tagged_users.length -
                                  1}{" "}
                                {t("other")}
                                {currentItem?.post_shared?.tagged_users.length -
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
                    {currentItem?.post_shared?.post_type ===
                    "profile_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated profile picture")}
                      </Text>
                    ) : currentItem?.post_shared?.post_type ===
                      "shared_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("has shared a post")}{" "}
                        {currentItem?.post_shared?.groups[0]?.name
                          ? `to ${currentItem?.post_shared?.groups[0]?.name}`
                          : currentItem?.post_shared?.pages[0]?.name
                          ? `in ${currentItem?.post_shared?.pages[0]?.name}`
                          : currentItem?.post_shared?.rooms[0]?.name
                          ? `in ${currentItem?.post_shared?.rooms[0]?.name}`
                          : currentItem?.post_shared?.shared_user_post?.name
                          ? `with ${currentItem?.post_shared?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : currentItem?.post_shared?.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        {" "}
                        at {currentItem?.post_shared?.post_map}
                      </Text>
                    ) : currentItem?.post_shared?.post_type == "timeline" &&
                      currentItem?.post_shared?.user?.id !==
                        currentItem?.post_shared?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              userName:
                                currentItem?.post_shared?.wall_user?.name,
                            })
                          }
                          style={styles.name}
                        >
                          {currentItem?.post_shared?.wall_user?.first_name}{" "}
                          {currentItem?.post_shared?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.time}>
                    {timeDifference(currentItem?.post_shared?.created_at)}
                  </Text>
                  {privacy(currentItem?.post_privacy)}
                  <Text style={styles.tagTxt}>
                    {tags(currentItem?.post_shared?.post_tag_id)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {currentItem?.post_shared?.post_text != null ? (
            <View
              style={{
                paddingBottom: 10,
                paddingHorizontal: 16,
                marginTop: -10,
              }}
            >
              {currentItem?.post_shared?.pattern ? null : (
                <NewsFeedText txt={currentItem?.post_shared?.post_text} />
              )}
            </View>
          ) : null}
          {currentItem?.post_shared?.media?.length ? (
            <>
              <ImageGrid
                data={currentItem?.post_shared?.media}
                item3={currentItem}
                isModell={isModell}
                setIsModel={setIsModel}
                // setPostId={setPostId}
                // handleLike={handleLike}
                // handleShare={handleShare}
                // onRefresh={onRefresh}
                imageModelShow={(item, imgIndex) =>
                  imageModelShow(currentItem, imgIndex, index)
                }
                fetchApiForGrid={() =>
                  fetchApiForGrid(currentItem?.post_shared?.encrypted_id)
                }
                shared={true}
              />

              <>
                {isSinglePictureModell ? (
                  <ImageShowSingle
                    key={currentItem?.id}
                    isSinglePictureModell={isSinglePictureModell}
                    setIsSinglePictureModell={setIsSinglePictureModell}
                    // singlePostData={singlePostData}
                    index={index}
                    postData={currentItem?.post_shared}
                    currentDimensions={currentDimensions}
                    // onRefresh={onRefresh}
                  />
                ) : null}
              </>
            </>
          ) : null}

          {currentItem?.post_shared?.pattern ? (
            <View style={styles.postedView}>
              {currentItem?.post_shared?.pattern?.type == "image" ? (
                <ImageBackground
                  source={{
                    uri:
                      SITE_URL +
                      "frontend/img/" +
                      currentItem?.post_shared?.pattern?.background_image,
                  }}
                  resizeMode="cover"
                  style={styles.imageShare}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: currentItem?.post_shared?.pattern?.text_color,
                      },
                    ]}
                  >
                    {currentItem?.post_shared?.post_text}
                  </Text>
                </ImageBackground>
              ) : (
                <LinearGradient
                  colors={[
                    currentItem?.post_shared?.pattern?.background_color_1,
                    currentItem?.post_shared?.pattern?.background_color_2,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.colorPost]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: currentItem?.post_shared?.pattern?.text_color,
                      },
                    ]}
                  >
                    {currentItem?.post_shared?.post_text}
                  </Text>
                </LinearGradient>
              )}
            </View>
          ) : currentItem?.post_shared == null ? (
            <View style={styles.noContent}>
              {ICONS.antDesign("infocirlce", COLORS.grey, 20)}
              <Text style={{ padding: 5 }}>
                {t("This content is not available!")}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {/* ------------shared end---------------------  */}
      {currentItem?.media?.length ? (
        <>
          <ImageGrid
            data={currentItem?.media}
            singlePostStyle={styles.singlePostStyle}
            item3={currentItem}
            isModell={isModell}
            setIsModel={setIsModel}
            // setPostId={setPostId}
            // handleLike={handleLike}
            // handleShare={handleShare}
            // onRefresh={onRefresh}
            imageModelShow={(item, imgIndex) =>
              imageModelShow(currentItem, imgIndex, index)
            }
            fetchApiForGrid={() => fetchApiForGrid(currentItem?.encrypted_id)}
          />

          {isSinglePictureModell ? (
            <ImageShowSingle
              key={currentItem?.id}
              isSinglePictureModell={isSinglePictureModell}
              setIsSinglePictureModell={setIsSinglePictureModell}
              // singlePostData={singlePostData}
              index={index}
              postData={currentItem}
              currentDimensions={currentDimensions}
              // onRefresh={onRefresh}
            />
          ) : null}
        </>
      ) : null}
      {currentItem?.pattern ? (
        <View
          style={{
            marginTop: HP(1),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentItem?.pattern.type == "image" ? (
            <ImageBackground
              source={{
                uri:
                  SITE_URL +
                  "frontend/img/" +
                  currentItem?.pattern.background_image,
              }}
              resizeMode="cover"
              style={styles.image}
            >
              <Text
                style={[
                  styles.text,
                  { color: currentItem?.pattern.text_color },
                ]}
              >
                {currentItem?.post_text}
              </Text>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={[
                currentItem?.pattern?.background_color_1,
                currentItem?.pattern?.background_color_2,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.colorPost, { width: WP(100) }]}
            >
              <Text
                style={[
                  styles.text,
                  { color: currentItem?.pattern?.text_color },
                ]}
              >
                {currentItem?.post_text}
              </Text>
            </LinearGradient>
          )}
        </View>
      ) : null}
      {item?.post_type !== "reel" && (
        <>
          <ShowLikeCommentShare
            postId={currentItem?.id}
            reaction={currentItem?.reaction}
            post_reactions_count={currentItem?.post_reactions_count}
            comments_count={
              currentItem?.comments_count + currentItem?.replies_count
            }
            shared_post_count={currentItem?.shared_post_count}
            like={currentItem?.like}
            heart={currentItem?.heart}
            haha={currentItem?.haha}
            wow={currentItem?.wow}
            sad={currentItem?.sad}
            angry={currentItem?.angry}
            fontColor={"black"}
            pressfunction={() => {
              getIdAndDispatch(
                currentItem?.encrypted_id,
                currentItem?.id,
                index,
                "comment"
              );
            }}
          />
          <LikeComShare
            likePress={() => {
              likeItemFunc(currentItem, index);
            }}
            unLikePress={() => {
              unLikeItemFunc(currentItem, index);
            }}
            commentPress={() => {
              setInputFocus(true);

              getIdAndDispatch(
                currentItem?.encrypted_id,
                currentItem?.id,
                index,
                "comment"
              );
            }}
            sharePress={() => {
              setShareModel(!shareModel);
              // , setPostIndex(index);
            }}
            likesCount={currentItem?.post_reactions_count}
            commentsCount={
              currentItem?.comments_count + currentItem?.replies_count
            }
            shareCount={currentItem?.shared_post_count}
            color={COLORS.primary}
            liked={currentItem?.reaction != null ? true : false}
            reactionID={currentItem?.reaction?.reaction_type_id}
            reactionType={(id) => reactionType(id, currentItem, index)}
            hideShare={ item?.post_type == "ad_post"}
          />
        </>
      )}
      {shareModel ? (
        <ShareModel
          shareModel={shareModel}
          setShareModel={setShareModel}
          // onRefresh={onRefresh}
          postId={currentItem.id}
          item={currentItem}
        />
      ) : null}

      {isModell ? (
        <ComentModel
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          isModell={isModell}
          setIsModel={setIsModel}
          item3={currentItem}
          data_target={data_target}
          encrypted_id={currentItem?.encrypted_id}
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
      {isSavePostModalVisible && (
        <SavePostFeed
          isModalVisible={isSavePostModalVisible}
          setIsSavePostModalVisible={setIsSavePostModalVisible}
          savePost={saved_post}
          data={data}
          setData={setData}
          setLoadingFetch={setLoading}
          fetchUri={fetchUri}
          fromNotifications={true}
        />
      )}
      {unSavedPostModal && (
        <LogoutModal
          isVisible={unSavedPostModal}
          setIsVisible={setUnSavedPostModal}
          // title="Delete Photo"
          message={t("You want to unsave this post?")}
          onYesPress={onPressUnSavePostConfirm}
        />
      )}
    </View>
  ) : null;
};

export default RenderItemSinglePost;
