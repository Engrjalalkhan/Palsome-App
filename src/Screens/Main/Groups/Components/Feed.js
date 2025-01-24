import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Loader from "../../../../Components/Loader";
import styles from "../../Rooms/components/RoomsTLStyles";
import ShareModel from "../../../../Components/ShareModel";
import ComentModel from "../../../../Components/ComentModel";
import LikeComShare from "../../../../Components/LikeComShare";
import FirstComment from "../../../../Components/FirstComment";
import ImageShowSingle from "../../../../Components/ImageShowSingle";
import ImageGrid from "../../../../Components/ImageGridFlatlist/index";
import TaggedPeopleModal from "../../../../Components/TaggedPeopleModal";
import NewsFeedText from "../../../../Components/NewsFeedList/NewsFeedText";
import PostMenuModel from "../../../../Components/NewsFeedList/PostMenuModel";
import ShowLikeCommentShare from "../../../../Components/ShowLikeCommentShare";
import {
  handleLike,
  handleShare,
  timeDifference,
  FlatListItemSeparator,
} from "../../../../Components/NewsFeedList/Functions";

import { ICONS } from "../../../../Constants/Icons";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import {
  tags,
  privacy,
} from "../../../../../Utils/PickerDataStatus/privacyData";
import { showImgFunc } from "../../../../../Utils/Data";

import {
  likeItem,
  unLikeItem,
  fetchComments,
  showGalleryPosts,
} from "../../../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../../../Redux/action-types";
import SimpleToast from "react-native-simple-toast";
import LinearGradient from "react-native-linear-gradient";

const Feed = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedTabData, setFeedTabData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isModell, setIsModel] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [isPictureModell, setIsPictureModell] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);

  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [postGalleryIndexShare, setPostGalleryIndexShare] = useState(0);
  const [isPictureModellShare, setIsPictureModellShare] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);
  const [currentDimensions, setCurrentDimensions] = useState();

  const [postIndex, setPostIndex] = useState();
  const [data_target, setData_target] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    getFeedData();
  }, [page]); // done

  const getFeedData = () => {
    const url = `${BASE_URL}/groups/feed_group?page=${page}`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          setLoadingMore(false);

          if (res?.responseCode == 200) {
            setLastPage(res?.payload?.data?.singlePost?.last_page);

            if (page == 1) setFeedTabData(res?.payload?.data?.singlePost?.data);
            else {
              const data = [
                ...feedTabData,
                ...res?.payload?.data?.singlePost?.data,
              ];
              setFeedTabData(data);
            }
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      console.log("tryCatchError: ", error);
    }
  }; // done

  const renderFooter = () => {
    return loadingMore ? (
      <Loader />
    ) : feedTabData?.length == 0 ? (
      <View style={styles.noPostsContainer}>
        <Text style={{ fontSize: 23, color: "Gray" }}>{t("No posts yet")}</Text>
      </View>
    ) : page >= lastPage ? (
      <View style={styles.noPostsContainer}>
        <Text style={{ fontSize: 23, color: "Gray" }}>
          {t("No more posts")}
        </Text>
      </View>
    ) : (
      <Loader />
    );
  }; // done

  const imageModelShow = (item, index, myIndex) => {
    setPostGalleryIndex(myIndex);
    setIsPictureModell(!isPictureModell);
  };

  const openProfileFromFreinds = (userName, id) => {
    navigation.navigate("ProfileScreen", {
      id: id,
      userName: userName,
    });
  }; // done

  const openGroupOnNamePress = (group) => {
    navigation.navigate("GroupsTL", { id: group?.encrypted_id });
  }; // done

  const openPageOnNamePress = (group) => {
    SimpleToast.show(
      "This feature is in development stage. Please use this feature on the website."
    );
  }; // done

  const onPressTaggedPerson = (item) => {
    openProfileFromFreinds(item.name, item.id);
  }; // done

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  }; // done

  const getIdAndDispatch = (id, postid, data_target) => {
    setData_target(data_target);
    setIsModel((prevState) => !prevState);

    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  }; // done

  const likeItemFunc = async (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");

    dispatch(likeItem({ token, formData }));

    let feed = [...feedTabData];
    let post = feed[index];

    post.reaction = {
      reaction_type_id: 1,
    };

    post.post_reactions_count = reactChk(
      post.post_reactions_count,
      post.localReacted
    );

    post.localReacted = true;

    feed[index] = post;
    setFeedTabData(feed);
  }; // done

  const unLikeItemFunc = (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    dispatch(unLikeItem({ token, formData }));

    let feed = [...feedTabData];
    let post = feed[index];

    if (post?.reaction.reaction_type_id == 1) {
      let like = post?.like?.filter((i) => i.user_id != userData.id);
      post.like = like;
    }

    if (post?.reaction.reaction_type_id == 2) {
      let heart = post?.heart?.filter((i) => i.user_id != userData.id);
      post.heart = heart;
    }

    if (post?.reaction.reaction_type_id == 3) {
      let haha = post?.haha?.filter((i) => i.user_id != userData.id);
      post.haha = haha;
    }

    if (post?.reaction.reaction_type_id == 4) {
      let wow = post?.wow?.filter((i) => i.user_id != userData.id);
      post.wow = wow;
    }

    if (post?.reaction.reaction_type_id == 5) {
      let sad = post?.sad?.filter((i) => i.user_id != userData.id);
      post.sad = sad;
    }

    if (post?.reaction.reaction_type_id == 6) {
      let angry = post?.angry?.filter((i) => i.user_id != userData.id);
      post.angry = angry;
    }

    post.reaction = null;
    post.localReacted = false;
    post.post_reactions_count = post.post_reactions_count - 1;

    feed[index] = post;
    setFeedTabData(feed);
  }; // done

  const imageModelShowShare = (item, index, myIndex) => {
    setPostGalleryIndexShare(myIndex);

    setIsPictureModellShare(!isPictureModellShare);
  };

  const reactionType = (id, item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");

    dispatch(likeItem({ token, formData }));

    let feed = [...feedTabData];
    let post = feed[index];

    post.post_reactions_count = reactChk(
      post.post_reactions_count,
      post.localReacted,
      post.reaction
    );

    post.reaction = {
      reaction_type_id: id,
    };

    post.localReacted = true;

    feed[index] = post;
    setFeedTabData(feed);
  }; // done

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

  const renderTL = ({ item, index }) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.timelineContainer}>
          <View style={styles.upperTab}>
            <View style={styles.imgAndStatus}>
              <TouchableOpacity
                onPress={() =>
                  openProfileFromFreinds(item?.user?.name, item?.user?.id)
                }
              >
                <FastImage
                  style={styles.timelineDp}
                  source={
                    item?.user?.profile_picture != null
                      ? {
                          uri: SITE_URL + item?.user?.profile_picture,
                        }
                      : IMAGES.blankDP
                  }
                />
              </TouchableOpacity>

              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={styles.name}
                    onPress={() =>
                      openProfileFromFreinds(item?.user?.name, item?.user?.id)
                    }
                  >
                    {item?.user?.first_name} {item?.user?.last_name}{" "}
                    {item?.post_type !== "shared_post" && (
                      <>
                        {ICONS.antDesign("caretright", COLORS.lightGray)}{" "}
                        <Text
                          onPress={() => openGroupOnNamePress(item?.groups[0])}
                        >
                          {item?.groups[0]?.name}
                        </Text>
                      </>
                    )}{" "}
                    {item.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {t("is")} {item.feeling_action + " "}
                          {item.feeling_value} {showImgFunc(item.feeling_value)}
                        </Text>
                      </>
                    )}
                    {item?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!item.feeling_action && "is "}
                          {t("with")}
                          <Text
                            onPress={() =>
                              onPressTaggedPerson(item?.tagged_users?.[0])
                            }
                            style={{
                              fontWeight: "bold",
                              color: COLORS.primary,
                            }}
                          >
                            {" "}
                            {item?.tagged_users?.[0]?.first_name}{" "}
                            {item?.tagged_users?.[0]?.last_name}{" "}
                          </Text>
                          {item?.tagged_users.length > 1 && (
                            <Text>
                              {t("and")}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: COLORS.primary,
                                }}
                                onPress={() =>
                                  onPressTaggedOthers(item?.tagged_users)
                                }
                              >
                                {" "}
                                {item?.tagged_users.length - 1} {t("other")}
                                {item?.tagged_users.length - 1 > 1 ? "s" : null}
                              </Text>
                            </Text>
                          )}
                        </Text>
                      </>
                    )}
                    {item.post_type === "group_cover_picture_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {t("updated the group cover photo")}
                      </Text>
                    ) : item.post_type === "shared_post" ? (
                      <Text style={styles.action}>
                        {t("has shared a post")}{" "}
                        <Text onPress={() => null}>
                          {item?.groups[0]?.name
                            ? `to `
                            : item?.pages[0]?.name
                            ? ` in `
                            : item?.rooms[0]?.name
                            ? `in `
                            : item?.shared_user_post?.name
                            ? `with `
                            : null}
                        </Text>
                        <Text
                          style={styles.name}
                          onPress={() => openGroupOnNamePress(item?.groups[0])}
                        >
                          {item?.groups[0]?.name
                            ? `${item?.groups[0]?.name}`
                            : item?.pages[0]?.name
                            ? `${item?.pages[0]?.name}`
                            : item?.rooms[0]?.name
                            ? `${item?.rooms[0]?.name}`
                            : item?.shared_user_post?.name
                            ? `${item?.shared_user_post?.name}`
                            : null}
                        </Text>
                      </Text>
                    ) : item.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        at {item.post_map}
                      </Text>
                    ) : item.post_type == "timeline" &&
                      item?.user.id !== item?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}>{t("posted on")}</Text>

                        <Text style={styles.name}>
                          {item?.wall_user?.first_name}{" "}
                          {item?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.time}>
                      {timeDifference(item.created_at)}
                    </Text>
                    {privacy(item.post_privacy)}
                  </View>
                </View>
              </View>
            </View>

            <PostMenuModel item3={item} isAdmin={false} isTimeLine={false} />
          </View>

          {item.post_text != null ? (
            <View
              style={{
                flex: 0.7,
                paddingHorizontal: 16,
                paddingBottom: 7,
              }}
            >
              {item?.pattern ? null : <NewsFeedText txt={item?.post_text} />}
            </View>
          ) : null}

          {item?.post_type === "shared_post" ? (
            item?.post_shared !== null ? (
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: COLORS.cocoGrey,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}
              >
                {item?.post_shared?.post_type == "page_post" ? (
                  <View style={styles.upperTab}>
                    <TouchableOpacity onPress={openPageOnNamePress}>
                      <FastImage
                        style={styles.timelineDp}
                        source={
                          item?.post_shared?.pages[0]?.page_picture != null
                            ? {
                                uri:
                                  SITE_URL +
                                  item?.post_shared?.pages[0]?.page_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginLeft: 10 }}>
                          <Text
                            style={styles.name}
                            onPress={openPageOnNamePress}
                          >
                            {item?.post_shared?.pages[0]?.page_name}
                          </Text>
                          {item?.post_shared?.feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {t("is")} {item?.post_shared?.feeling_action}{" "}
                                {item?.post_shared?.feeling_value}{" "}
                                {showImgFunc(item?.post_shared?.feeling_value)}
                              </Text>
                            </>
                          )}
                          {item?.post_shared?.tagged_users?.length > 0 && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {!item?.post_shared?.feeling_action && "is "}
                                {t("with")}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: COLORS.primary,
                                  }}
                                  onPress={() =>
                                    onPressTaggedPerson(
                                      item?.post_shared?.tagged_users?.[0]
                                    )
                                  }
                                >
                                  {" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.first_name
                                  }{" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.last_name
                                  }{" "}
                                </Text>
                                {item?.post_shared?.tagged_users?.length >
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
                                          item?.post_shared?.tagged_users
                                        )
                                      }
                                    >
                                      {" "}
                                      {item?.post_shared?.tagged_users.length -
                                        1}{" "}
                                      {t("other")}
                                      {item?.post_shared?.tagged_users.length -
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
                          "group_cover_picture_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {t("updated the group cover photo")}
                            </Text>
                          ) : item?.post_shared?.post_type === "shared_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
                              {t("has shared a post")}{" "}
                              {item?.post_shared?.groups[0]?.name
                                ? `to ${item?.post_shared?.groups[0]?.name}`
                                : item?.post_shared?.pages[0]?.name
                                ? `in ${item?.post_shared?.pages[0]?.name}`
                                : item?.post_shared?.rooms[0]?.name
                                ? `in ${item?.post_shared?.rooms[0]?.name}`
                                : item?.post_shared?.shared_user_post?.name
                                ? `with ${item?.post_shared?.shared_user_post?.name}`
                                : null}
                            </Text>
                          ) : item?.post_shared?.post_map ? (
                            <Text onPress={() => null} style={styles.mapaction}>
                              {" "}
                              at {item?.post_shared?.post_map}
                            </Text>
                          ) : item?.post_shared?.post_type == "timeline" &&
                            item?.post_shared?.user?.id !==
                              item?.post_shared?.wall_user?.id ? (
                            <>
                              <Text style={styles.action}>
                                {" "}
                                {t("posted on ")}
                              </Text>

                              <Text style={styles.name}>
                                {item?.post_shared?.wall_user?.first_name}{" "}
                                {item?.post_shared?.wall_user?.last_name}
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
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.time}>
                          {timeDifference(item?.post_shared?.created_at)}
                        </Text>
                        {privacy(item?.post_shared?.post_privacy)}
                      </View>
                    </View>
                  </View>
                ) : item?.post_shared?.post_type == "group_post" ? (
                  <View style={styles.upperTab}>
                    <TouchableOpacity
                      onPress={() =>
                        openProfileFromFreinds(
                          item?.post_shared?.user?.name,
                          item?.post_shared?.user?.id
                        )
                      }
                    >
                      <FastImage
                        style={styles.timelineDp}
                        source={
                          item?.user?.profile_picture != null
                            ? {
                                uri: SITE_URL + item?.user?.profile_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginLeft: 10 }}>
                          <Text
                            style={styles.name}
                            onPress={() =>
                              openProfileFromFreinds(
                                item?.post_shared?.user?.name,
                                item?.post_shared?.user?.id
                              )
                            }
                          >
                            {item?.post_shared?.user?.first_name}{" "}
                            {item?.post_shared?.user?.last_name}
                          </Text>{" "}
                          <Text style={styles.name}>
                            {ICONS.antDesign("caretright", COLORS.lightGray)}{" "}
                            <Text
                              onPress={() =>
                                openGroupOnNamePress(
                                  item?.post_shared?.groups[0]
                                )
                              }
                            >
                              {item?.post_shared?.groups[0]?.name}
                            </Text>{" "}
                          </Text>
                          {item?.post_shared?.feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {t("is")} {item?.post_shared?.feeling_action}{" "}
                                {item?.post_shared?.feeling_value}{" "}
                                {showImgFunc(item?.post_shared?.feeling_value)}
                              </Text>
                            </>
                          )}
                          {item?.post_shared?.tagged_users?.length > 0 && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {!item?.post_shared?.feeling_action && "is "}
                                {t("with")}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: COLORS.primary,
                                  }}
                                  onPress={() =>
                                    onPressTaggedPerson(
                                      item?.post_shared?.tagged_users?.[0]
                                    )
                                  }
                                >
                                  {" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.first_name
                                  }{" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.last_name
                                  }{" "}
                                </Text>
                                {item?.post_shared?.tagged_users?.length >
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
                                          item?.post_shared?.tagged_users
                                        )
                                      }
                                    >
                                      {" "}
                                      {item?.post_shared?.tagged_users.length -
                                        1}{" "}
                                      {t("other")}
                                      {item?.post_shared?.tagged_users.length -
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
                          "group_cover_picture_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {t("updated the group cover photo")}
                            </Text>
                          ) : item?.post_shared?.post_type === "shared_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
                              {t("has shared a post")}{" "}
                              {item?.post_shared?.groups[0]?.name
                                ? `to ${item?.post_shared?.groups[0]?.name}`
                                : item?.post_shared?.pages[0]?.name
                                ? `in ${item?.post_shared?.pages[0]?.name}`
                                : item?.post_shared?.rooms[0]?.name
                                ? `in ${item?.post_shared?.rooms[0]?.name}`
                                : item?.post_shared?.shared_user_post?.name
                                ? `with ${item?.post_shared?.shared_user_post?.name}`
                                : null}
                            </Text>
                          ) : item?.post_shared?.post_map ? (
                            <Text onPress={() => null} style={styles.mapaction}>
                              {" "}
                              at {item?.post_shared?.post_map}
                            </Text>
                          ) : item?.post_shared?.post_type == "timeline" &&
                            item?.post_shared?.user?.id !==
                              item?.post_shared?.wall_user?.id ? (
                            <>
                              <Text style={styles.action}>
                                {" "}
                                {t("posted on ")}
                              </Text>

                              <Text style={styles.name}>
                                {item?.post_shared?.wall_user?.first_name}{" "}
                                {item?.post_shared?.wall_user?.last_name}
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
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.time}>
                          {timeDifference(item?.post_shared?.created_at)}
                        </Text>
                        {privacy(item?.post_shared?.post_privacy)}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.upperTab}>
                    <TouchableOpacity
                      onPress={() =>
                        openProfileFromFreinds(
                          item?.post_shared?.user?.name,
                          item?.post_shared?.user?.id
                        )
                      }
                    >
                      <FastImage
                        style={[styles.timelineDp, { marginLeft: 10 }]}
                        source={
                          item?.post_shared?.user?.profile_picture != null
                            ? {
                                uri:
                                  SITE_URL +
                                  item?.post_shared?.user?.profile_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ marginLeft: 10 }}>
                          <Text
                            style={styles.name}
                            onPress={() =>
                              openProfileFromFreinds(
                                item?.post_shared?.user?.name,
                                item?.post_shared?.user?.id
                              )
                            }
                          >
                            {item?.post_shared?.user?.first_name}{" "}
                            {item?.post_shared?.user?.last_name}
                          </Text>

                          {item?.post_shared?.feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {t("is")} {item?.post_shared?.feeling_action}{" "}
                                {item?.post_shared?.feeling_value}{" "}
                                {showImgFunc(item?.post_shared?.feeling_value)}
                              </Text>
                            </>
                          )}
                          {item?.post_shared?.tagged_users?.length > 0 && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                {!item?.post_shared?.feeling_action && "is "}
                                {t("with")}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: COLORS.primary,
                                  }}
                                  onPress={() =>
                                    onPressTaggedPerson(
                                      item?.post_shared?.tagged_users?.[0]
                                    )
                                  }
                                >
                                  {" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.first_name
                                  }{" "}
                                  {
                                    item?.post_shared?.tagged_users?.[0]
                                      ?.last_name
                                  }{" "}
                                </Text>
                                {item?.post_shared?.tagged_users.length > 1 && (
                                  <Text>
                                    {t("and")}
                                    <Text
                                      style={{
                                        fontWeight: "bold",
                                        color: COLORS.primary,
                                      }}
                                      onPress={() =>
                                        onPressTaggedOthers(
                                          item?.post_shared?.tagged_users
                                        )
                                      }
                                    >
                                      {" "}
                                      {item?.post_shared?.tagged_users.length -
                                        1}{" "}
                                      {t("other")}
                                      {item?.post_shared?.tagged_users.length -
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
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
                              {t("updated profile picture")}
                            </Text>
                          ) : item?.post_shared?.post_type === "shared_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
                              {t("has shared a post")}{" "}
                              {item?.post_shared?.groups[0]?.name
                                ? `to ${item?.post_shared?.groups[0]?.name}`
                                : item?.post_shared?.pages[0]?.name
                                ? `in ${item?.post_shared?.pages[0]?.name}`
                                : item?.post_shared?.rooms[0]?.name
                                ? `in ${item?.post_shared?.rooms[0]?.name}`
                                : item?.post_shared?.shared_user_post?.name
                                ? `with ${item?.post_shared?.shared_user_post?.name}`
                                : null}
                            </Text>
                          ) : item?.post_shared?.post_map ? (
                            <Text onPress={() => null} style={styles.mapaction}>
                              {" "}
                              at {item?.post_shared?.post_map}
                            </Text>
                          ) : item?.post_shared?.post_type == "timeline" &&
                            item?.post_shared?.user?.id !==
                              item?.post_shared?.wall_user?.id ? (
                            <>
                              <Text style={styles.action}>
                                {" "}
                                {t("posted on ")}
                              </Text>

                              <Text
                                style={styles.name}
                                onPress={() =>
                                  openProfileFromFreinds(
                                    item?.post_shared?.wall_user?.name,
                                    item?.post_shared?.wall_user?.id
                                  )
                                }
                              >
                                {item?.post_shared?.wall_user?.first_name}{" "}
                                {item?.post_shared?.wall_user?.last_name}
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
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.time}>
                          {timeDifference(item?.post_shared?.created_at)}
                        </Text>
                        {privacy(item?.post_shared?.post_privacy)}
                      </View>
                    </View>
                  </View>
                )}

                {item?.post_shared?.post_text != null ? (
                  <View style={styles.psted_text}>
                    {item?.post_shared?.pattern ? null : (
                      <>
                        <NewsFeedText txt={item?.post_shared?.post_text} />
                      </>
                    )}
                  </View>
                ) : null}

                {item?.post_shared?.media?.length ? (
                  <>
                    <ImageGrid
                      data={item?.post_shared?.media}
                      item3={item}
                      isModell={isModell}
                      setIsModel={setIsModel}
                      handleLike={handleLike}
                      handleShare={handleShare}
                      // onRefresh={onRefresh}
                      imageModelShow={(item, imgIndex) =>
                        imageModelShowShare(item, imgIndex, index)
                      }
                      fetchApiForGrid={() =>
                        fetchApiForGrid(item?.post_shared?.encrypted_id)
                      }
                      shared={true}
                      profile={true}
                    />

                    <>
                      {isPictureModellShare &&
                      postGalleryIndexShare == index ? (
                        <ImageShowSingle
                          key={item.id}
                          isSinglePictureModell={isPictureModellShare}
                          setIsSinglePictureModell={setIsPictureModellShare}
                          index={index}
                          postData={item?.post_shared}
                          currentDimensions={currentDimensions}
                        />
                      ) : null}
                    </>
                  </>
                ) : null}

                {item?.post_shared?.pattern ? (
                  <View style={styles.postedView}>
                    {item?.post_shared?.pattern?.type == "image" ? (
                      <ImageBackground
                        source={{
                          uri:
                            SITE_URL +
                            "frontend/img/" +
                            item?.post_shared?.pattern?.background_image,
                        }}
                        resizeMode="cover"
                        style={styles.imageShared}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              color: item?.post_shared?.pattern?.text_color,
                            },
                          ]}
                        >
                          {item?.post_shared?.post_text}
                        </Text>
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={[
                          item?.post_shared?.pattern?.background_color_1,
                          item?.post_shared?.pattern?.background_color_2,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.colorPostShared]}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              color: item?.post_shared?.pattern?.text_color,
                            },
                          ]}
                        >
                          {item?.post_shared?.post_text}
                        </Text>
                      </LinearGradient>
                    )}
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.noContent}>
                {ICONS.antDesign("infocirlce", COLORS.grey, 20)}
                <Text style={{ padding: 5 }}>
                  {t("This content is not available!")}
                </Text>
              </View>
            )
          ) : null}

          {item?.media?.length ? (
            <View>
              <ImageGrid
                data={item.media}
                item3={item}
                isModell={isModell}
                setIsModel={setIsModel}
                handleLike={handleLike}
                handleShare={handleShare}
                // onRefresh={onRefresh}
                imageModelShow={(item, imgIndex) => {
                  imageModelShow(item, imgIndex, index);
                }}
                fetchApiForGrid={() => fetchApiForGrid(item?.encrypted_id)}
              />

              {isPictureModell && postGalleryIndex == index ? (
                <ImageShowSingle
                  key={item.id}
                  isSinglePictureModell={isPictureModell}
                  setIsSinglePictureModell={setIsPictureModell}
                  index={index}
                  postData={item}
                  currentDimensions={currentDimensions}
                />
              ) : null}
            </View>
          ) : null}

          {item.pattern ? (
            <View style={styles.otherImg}>
              {item?.pattern?.type == "image" ? (
                <ImageBackground
                  source={{
                    uri:
                      SITE_URL +
                      "frontend/img/" +
                      item?.pattern?.background_image,
                  }}
                  resizeMode="cover"
                  style={styles.image}
                >
                  <Text
                    style={[styles.text, { color: item?.pattern?.text_color }]}
                  >
                    {item.post_text}
                  </Text>
                </ImageBackground>
              ) : (
                <LinearGradient
                  colors={[
                    item.pattern.background_color_1,
                    item.pattern.background_color_2,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.colorPost]}
                >
                  <Text
                    style={[styles.text, { color: item?.pattern?.text_color }]}
                  >
                    {item.post_text}
                  </Text>
                </LinearGradient>
              )}
            </View>
          ) : null}

          <ShowLikeCommentShare
            postId={item.id}
            reaction={item.reaction}
            post_reactions_count={item.post_reactions_count}
            comments_count={item.comments_count + item.replies_count}
            shared_post_count={item.shared_post_count}
            like={item.like}
            heart={item.heart}
            haha={item.haha}
            wow={item.wow}
            sad={item.sad}
            angry={item.angry}
            fontColor={"black"}
            pressfunction={() => {
              getIdAndDispatch(item.encrypted_id, item.id, "comment");
              setPostIndex(index);
            }}
          />

          <LikeComShare
            hideShare={item?.groups[0]?.privacy == "private" ? true : false}
            likePress={() => {
              likeItemFunc(item, index);
            }}
            unLikePress={() => {
              unLikeItemFunc(item, index);
            }}
            commentPress={() => {
              setInputFocus(true);

              getIdAndDispatch(item.encrypted_id, item.id, "comment");
              setPostIndex(index);
            }}
            sharePress={() => {
              setShareModel(!shareModel), setPostIndex(index);
            }}
            likesCount={item.post_reactions_count}
            commentsCount={item.comments_count + item.replies_count}
            shareCount={item.shared_post_count}
            color={COLORS.primary}
            liked={item.reaction != null ? true : false}
            reactionID={item?.reaction?.reaction_type_id}
            reactionType={(id) => reactionType(id, item, index)}
          />

          {isModell && postIndex == index ? (
            <ComentModel
              inputFocus={inputFocus}
              setInputFocus={setInputFocus}
              isModell={isModell}
              setIsModel={(data) => {
                setIsModel(data);
                onRefresh(true);
              }}
              item3={item}
              data_target={data_target}
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

          {shareModel && postIndex == index ? (
            <ShareModel
              shareModel={shareModel}
              setShareModel={setShareModel}
              postId={item.id}
            />
          ) : null}

          {taggedPeopleModel ? (
            <TaggedPeopleModal
              isVisible={taggedPeopleModel}
              close={() => setTaggedPeopleModel(false)}
              taggedPeopleList={taggedPeopleList}
            />
          ) : null}

          <FirstComment data={item.comments} />
        </View>
      </SafeAreaView>
    );
  }; // done

  const handleLoadMore = () => {
    if (!loadingMore && page < lastPage) {
      setLoadingMore(true);
      setPage((prevState) => prevState + 1);
    }
  }; // done

  const onRefresh = (fromCover) => {
    if (!fromCover) setRefreshing(true);

    setPage(1);
    getFeedData();
    setRefreshing(false);
  }; // done

  return (
    <View style={styles.container}>
      {!loading ? (
        <FlatList
          data={feedTabData}
          renderItem={renderTL}
          style={styles.friendFlatlist}
          onEndReached={handleLoadMore}
          keyExtractor={(_, index) => index}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => renderFooter()}
          ItemSeparatorComponent={() => FlatListItemSeparator()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        />
      ) : (
        <View style={{ marginTop: "50%" }}>
          <Loader />
        </View>
      )}
    </View>
  );
};

export default Feed;
