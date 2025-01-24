import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  Platform,
  BackHandler,
} from "react-native";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useScrollToTop } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { showImgFunc } from "../../../Utils/Data";
import { HP, WP } from "../../../Utils/Resposive";
import { privacy, tags } from "../../../Utils/PickerDataStatus/privacyData";

import { postStatusApiCall, settingsApiCall } from "../../Services/Apis";
import { BASE_URL, SITE_URL } from "../../Services/Constants";

import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

import {
  editPost,
  likeItem,
  setMyStory,
  setStories,
  unLikeItem,
  deletePost,
  fetchComments,
  showGalleryPosts,
} from "../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../Redux/action-types";
import { getReelsDataRequest } from "../../Redux/actions/ReelsActions";
import { updateProfilePicture } from "../../Redux/actions/ProfileActions";

import Dp from "./Dp";
import styles from "./styles";
import ExpiresAt from "./ExpiresAt";
import TitleName from "./TitleName";
import ShareModel from "../ShareModel";
import ComentModel from "../ComentModel";
import NewsFeedText from "./NewsFeedText";
import LikeComShare from "../LikeComShare";
import FirstComment from "../FirstComment";
import PostMenuModel from "./PostMenuModel";
import EditPostModal from "../EditPostModal";
import ImageGrid from "../ImageGridFlatlist";
import ImageShowSingle from "../ImageShowSingle";
import TaggedPeopleModal from "../TaggedPeopleModal";
import ShowLikeCommentShare from "../ShowLikeCommentShare";
import SuggestedFriendsFlatlist from "../SuggestedFriendFlatList";
import timelineStyles from "../../Screens/ProfileScreen/timelineStyles";

import {
  handleLike,
  handleShare,
  timeDifference,
  FlatListItemSeparator,
} from "./Functions";
import SkeletonLoader from "../SkeletonLoader";
import Toast from "react-native-simple-toast";
import { alignment } from "../../styles/TextAlignment";
import SavePostFeed from "../SavePost/SavePostFeed";
import LogoutModal from "../LogoutModal";
import { deleteApiData } from "../../Screens/Main/ReminderScreen/Components/remindersApiCall";
import { showMessage } from "react-native-flash-message";

const NewsfComponent = (props) => {
  const reelNavigation = props.ReelNavigation;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const token = useSelector((state) => state?.auth?.userToken);
  const userName = useSelector((state) => state?.auth?.userData);
  const userData = useSelector((state) => state?.auth?.userData);
  const switchUser = useSelector((state) => state.auth.switchUserData);

  const editPostLoading = useSelector(
    (state) => state.blackNewsF.editPostLoading
  );

  const editPostId = useSelector((state) => state?.blackNewsF?.editPostId);
  const statusPost = useSelector((state) => state?.blackNewsF?.statusPosted);

  const pushNotificationEvent = useSelector(
    (state) => state?.newsF?.getNotificationEvent
  );

  const [updatedAt, setUpdatedAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [isModell, setIsModel] = useState(false);
  const [noPosts, setNoPosts] = useState(false);
  const [noPostText, setNoPostText] = useState("No posts yet");
  const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);

  const [isSinglePictureModellShare, setIsSinglePictureModellShare] =
    useState(false);

  const [getNew, setGetNew] = useState(false);
  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [postUid, setpostUid] = useState();
  const [shareModel, setShareModel] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [data_target, setData_target] = useState("");
  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [postGalleryIndexShare, setPostGalleryIndexShare] = useState(0);
  const [currentDimensions, setCurrentDimensions] = useState();
  const [inputFocus, setInputFocus] = useState(false);
  const [myVideoIndex, setmyVideoIndex] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [noMore, setNoMore] = useState(false);
  const [media, setMedia] = useState();
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [isAtTop, setIsAtTop] = useState(true); // To track if user is at the top

  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [saved_post, setSavedPost] = useState("");
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [currentShareItem, setCurrentShareItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);
  const [savePostTime, setSavePostTime] = useState("");

  const handleBackButtonClick = () => {
    if (isFocused) {
      if (isAtTop) {
        BackHandler.exitApp(); // Exit app if already at top
      } else {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        setIsAtTop(true);
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, [isFocused, isAtTop]);

  useEffect(() => {
    userData == null || switchUser?.length == 0 || switchUser == undefined
      ? dispatch({ type: ACTIONS.LOGOUT })
      : null;
  }, []);

  const getData = async (getNew) => {
    let url;

    if (!props?.hashtag) {
      // url = `${BASE_URL}/news_feed?page=${currentPage}`;
      const cursorValue =
        currentPage > 1 ? `&cursor_column_value=${savePostTime}` : "";
      url = `${BASE_URL}/news_feed?page=${currentPage}${cursorValue}`;
    } else {
      url = `${BASE_URL}/hashtag/${props?.hashtag}?page=${currentPage}`;
    }

    let options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(url, options);
      const responseJson = await response.json();

      if (responseJson?.responseCode !== 200) {
        setIsLoading(false);
        setNoPosts(true);
        setNoPostText(responseJson?.message);
        setData(null);

        if (responseJson?.payload?.data?.session_expired === true) {
          navigation.navigate("SessionExpiredScreen");
        }
      } else if (props?.hashtag) {
        if (currentPage === 1) {
          setData(responseJson?.payload?.data?.singlePost?.data);
        } else {
          setData((prevData) =>
            prevData.concat(responseJson?.payload?.data?.singlePost?.data)
          );
        }
        setLastPage(responseJson.payload.data.singlePost.last_page);
        setIsLoading(false);
      } else {
        if (getNew === "loadNew") {
          // if (currentPage === 1) {
          //   const updatedAtValues =
          //     responseJson?.payload?.data?.singlePost?.data.map((post) =>
          //       console.log("=====", post?.updated_at)
          //     );
          //   setUpdatedAt(updatedAtValues);
          // }
          setData(responseJson?.payload?.data?.singlePost?.data);
          setNoPosts(
            responseJson?.payload?.data?.singlePost?.data?.length === 0
          );
        } else {
          if (data.length == 0) {
            if (currentPage === 1) {
              setSavePostTime(
                responseJson?.payload?.data?.singlePost?.data[0]?.updated_at
              );
            }
            setData(responseJson?.payload?.data?.singlePost?.data);
            setNoPosts(
              responseJson?.payload?.data?.singlePost?.data?.length === 0
            );
            return;
          }
          setData((prevData) =>
            prevData.concat(responseJson?.payload?.data?.singlePost?.data)
          );
        }
        setIsLoading(false);
        setGetNew(false);
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    loadStories();
  }, [pushNotificationEvent]);

  const loadStories = async () => {
    try {
      const res = await settingsApiCall({
        route: "story",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
      } else if (res.responseCode === 200) {
        const stories = res?.payload?.data?.stories;
        const myStory = res?.payload?.data?.my_story;
        dispatch(setStories(stories));
        dispatch(setMyStory(myStory));
      }
    } catch (error) {
      console.log("saga loadStories error -- ", error.toString());
    }
  };

  const getProfileImageBackground = async () => {
    if (token) {
      const getProfileImage = await AsyncStorage.getItem("image");
      if (getProfileImage) {
        dispatch(updateProfilePicture(getProfileImage));
        await AsyncStorage.removeItem("image");
      }
    }
  };

  useEffect(() => {
    getProfileImageBackground();
  }, [token]);

  const onRefresh = () => {
    {
      !reelNavigation && getReelsDataApi();
    }

    loadStories();
    setGetNew(true);

    currentPage == 1 ? getData("loadNew") : null;
    setCurrentPage(1);
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
  const imageModelShow = (item, index, myIndex) => {
    setPostGalleryIndex(myIndex);
    setIsSinglePictureModell(!isSinglePictureModell);
  };

  const imageModelShowShare = (item, index, myIndex) => {
    setPostGalleryIndexShare(myIndex);
    setIsSinglePictureModellShare(!isSinglePictureModellShare);
  };

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

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
                (user) => user?.id !== userData?.id
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
      const filteredPosts = data?.filter((post) => post?.encrypted_id !== id);
      if (filteredPosts?.length > 0) {
        setData(filteredPosts);
        return;
      }
      setData([]);
    }
  };

  const editMyPost = (id) => {
    setpostUid(id);
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
    }
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setData_target(data_target);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  };

  const onPressCommentOpen = useCallback(
    (item) => {
      setCommentCurrentItem(item);
      setIsModel(!isModell);
    },
    [isModell]
  );

  const onPressShareModal = useCallback(
    (item) => {
      setCurrentShareItem(item);
      setShareModel(!shareModel);
    },
    [shareModel]
  );

  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };

  const likeItemFunc = async (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3?.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));
    setData((prevData) => {
      const newData = [...prevData];
      const updatedItem = newData.find((itm) => itm === item3);
      if (updatedItem) {
        updatedItem.reaction = {
          reaction_type_id: 1,
        };
        updatedItem.post_reactions_count = reactChk(
          updatedItem.post_reactions_count,
          updatedItem.localReacted
        );
        updatedItem.localReacted = true;
      }
      return newData;
    });
  };

  const unLikeItemFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3?.id);
    dispatch(unLikeItem({ token, formData }));
    setData((prevData) => {
      const newData = [...prevData];
      const updatedItem = newData.find((itm) => itm === item3);
      if (updatedItem) {
        const { reaction, like, heart, haha, wow, sad, angry } = updatedItem;
        const reactionTypeId = reaction?.reaction_type_id;
        if (reactionTypeId === 1) {
          const updatedLike = like?.filter((i) => i.user_id !== userName.id);
          updatedItem.like = updatedLike;
        } else if (reactionTypeId === 2) {
          const updatedHeart = heart?.filter((i) => i.user_id !== userName.id);
          updatedItem.heart = updatedHeart;
        } else if (reactionTypeId === 3) {
          const updatedHaha = haha?.filter((i) => i.user_id !== userName.id);
          updatedItem.haha = updatedHaha;
        } else if (reactionTypeId === 4) {
          const updatedWow = wow?.filter((i) => i.user_id !== userName.id);
          updatedItem.wow = updatedWow;
        } else if (reactionTypeId === 5) {
          const updatedSad = sad?.filter((i) => i.user_id !== userName.id);
          updatedItem.sad = updatedSad;
        } else if (reactionTypeId === 6) {
          const updatedAngry = angry?.filter((i) => i.user_id !== userName.id);
          updatedItem.angry = updatedAngry;
        }
        updatedItem.reaction = null;
        updatedItem.localReacted = false;
        updatedItem.post_reactions_count = updatedItem.post_reactions_count - 1;
      }
      return newData;
    });
  };

  const reactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3?.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    setData((prevData) => {
      const newData = [...prevData];
      const updatedItem = newData.find((itm) => itm === item3);
      if (updatedItem) {
        const { reaction, like, heart, haha, wow, sad, angry } = updatedItem;
        const reactionTypeId = reaction?.reaction_type_id;
        if (reactionTypeId === 1) {
          const updatedLike = like?.filter((i) => i.user_id !== userName.id);
          updatedItem.like = updatedLike;
        } else if (reactionTypeId === 2) {
          const updatedHeart = heart?.filter((i) => i.user_id !== userName.id);
          updatedItem.heart = updatedHeart;
        } else if (reactionTypeId === 3) {
          const updatedHaha = haha?.filter((i) => i.user_id !== userName.id);
          updatedItem.haha = updatedHaha;
        } else if (reactionTypeId === 4) {
          const updatedWow = wow?.filter((i) => i.user_id !== userName.id);
          updatedItem.wow = updatedWow;
        } else if (reactionTypeId === 5) {
          const updatedSad = sad?.filter((i) => i.user_id !== userName.id);
          updatedItem.sad = updatedSad;
        } else if (reactionTypeId === 6) {
          const updatedAngry = angry?.filter((i) => i.user_id !== userName.id);
          updatedItem.angry = updatedAngry;
        }

        updatedItem.post_reactions_count = reactChk(
          updatedItem.post_reactions_count,
          updatedItem.localReacted,
          updatedItem.reaction
        );

        updatedItem.reaction = {
          reaction_type_id: id,
        };
        updatedItem.localReacted = true;
      }
      return newData;
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsLoading(true);
      if (!getNew) {
        getData();
      } else {
        getData("loadNew");
      }
    }

    return () => (mounted = false);
  }, [currentPage]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setData([]);
      setIsLoading(true);
      getData();
    }
    return () => (mounted = false);
  }, [props?.hashtag]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setStatusPostInData();
    }
    return () => (mounted = false);
  }, [statusPost]);

  const setStatusPostInData = () => {
    if (statusPost.length !== 0) {
      setData([statusPost].concat(data));
    }
  };

  useEffect(() => {
    onRefresh();
    getProfileImageBackground();
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [editPostId, editPostLoading]);

  const onPressTaggedPerson = (item) => {
    navigation.navigate("ProfileScreen", {
      id: item?.id,
    });
  };

  const getReelsDataApi = useCallback(() => {
    dispatch(
      getReelsDataRequest({
        token,
        currentPage: 1,
      })
    );
  });

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setRefreshing(false);
    }
    return () => (mounted = false);
  }, [media]);

  const handleLoadMore = () => {
    if (props?.hashtag) {
      if (!isLoading && currentPage < lastPage) {
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      }
    } else if (!isLoading) {
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    }
  };

  const flatListRef = useRef();
  useScrollToTop(flatListRef);

  const NewsFeedItem = ({ item: item3, index }) => {
    // setMedia(index == 0);
    const expiryTime = moment(item3?.post_shared?.expires_at, "YYYYMMDD")
      .endOf("day")
      .fromNow()
      .includes("ago");

    const tags = (id) => {
      if (id == 1) {
        return t("General");
      } else if (id == 2) {
        return t("Religious");
      } else if (id == 3) {
        return t("Political");
      } else if (id == 4) {
        return t("Social");
      } else if (id == 5) {
        return t("Educational");
      }
    };

    const handleOnPresReply = (item) => {
      setReplyingName(item?.user?.first_name + " " + item?.user?.last_name);
      setCommentId(item?.id);
      setIsReplying(true);
      onPressCommentOpen(item3);
      setInputFocus(true);
      getIdAndDispatch(item3?.encrypted_id, item3?.id, index, "comment");
      setFromNewsFeed(true);
    };

    return (
      <View style={styles.container}>
        {index == 2 && !props?.hashtag ? <SuggestedFriendsFlatlist /> : null}
        {editPostVisibility && item3?.encrypted_id == postUid ? (
          <EditPostModal
            visible={editPostVisibility}
            goBack={() => setEditPostVisibility(false)}
          />
        ) : null}
        <>
          {item3?.suggested_post ? (
            <View>
              <Text style={({ marginLeft: 15 }, alignment.left)}>
                {t("Suggested For You")}
              </Text>
            </View>
          ) : null}
          <View style={styles.upperTab}>
            <View style={styles.imgAndStatus}>
              <Dp
                user={item3?.user}
                pages={item3?.pages?.[0]}
                groups={item3?.groups?.[0]}
                rooms={item3?.rooms?.[0]}
                events={item3?.events}
                shared_page_post={item3?.shared_page_post}
              />

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ marginLeft: 10, textAlignVertical: "center" }}>
                    <TitleName
                      item={item3}
                      user={item3?.user}
                      pages={item3?.pages?.[0]}
                      groups={item3?.groups?.[0]}
                      rooms={item3?.rooms?.[0]}
                      events={item3?.events}
                      shared_page_post={item3?.shared_page_post}
                      promote_page={item3?.promote_page}
                    />
                    {item3?.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          is {item3?.feeling_action} {item3?.feeling_value}{" "}
                          {showImgFunc(item3?.feeling_value)}
                        </Text>
                      </>
                    )}
                    {item3?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!item3?.feeling_action && "is "}
                          with
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: COLORS.primary,
                              fontSize: 16,
                            }}
                            onPress={() =>
                              onPressTaggedPerson(item3?.tagged_users?.[0])
                            }
                          >
                            {" "}
                            {item3?.tagged_users?.[0]?.first_name}{" "}
                            {item3?.tagged_users?.[0]?.last_name}{" "}
                          </Text>
                          {item3?.tagged_users.length > 1 && (
                            <Text>
                              {t("and")}
                              <Text
                                onPress={() =>
                                  onPressTaggedOthers(item3?.tagged_users)
                                }
                                style={{
                                  fontWeight: "bold",
                                  color: COLORS.primary,
                                }}
                              >
                                {" "}
                                {item3?.tagged_users.length - 1} {t("other")}
                                {item3?.tagged_users.length - 1 > 1
                                  ? "s"
                                  : null}
                              </Text>
                            </Text>
                          )}
                        </Text>
                      </>
                    )}
                    {item3?.post_type === "profile_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated profile picture")}
                      </Text>
                    ) : item3?.post_type === "profile_cover_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated cover picture")}
                      </Text>
                    ) : item3?.post_type === "shared_post" ? (
                      <Text style={styles.action}>
                        {t(" shared a post")}{" "}
                        {item3?.groups[0]?.name
                          ? `in ${"a group"}`
                          : item3?.pages[0]?.name
                          ? `in ${item3?.pages[0]?.name}`
                          : item3?.rooms[0]?.name
                          ? `in ${"a room"}`
                          : item3?.shared_post_user
                          ? [
                              "with ",
                              <Text
                                style={timelineStyles.name}
                                key="first_name"
                                onPress={() =>
                                  navigation.navigate("ProfileScreen", {
                                    id: item3?.shared_post_user?.id,
                                  })
                                }
                              >
                                {item3?.shared_post_user?.first_name}{" "}
                                {item3?.shared_post_user?.last_name}
                              </Text>,
                            ]
                          : null}
                      </Text>
                    ) : item3?.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        {" "}
                        at {item3?.post_map}
                      </Text>
                    ) : item3?.post_type == "timeline" &&
                      item3?.user.id !== item3?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              id: item3?.wall_user?.id,
                            })
                          }
                          style={styles.name}
                        >
                          {item3?.wall_user?.first_name}{" "}
                          {item3?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}{" "}
                    {item3?.expires_at && item3?.user?.id == userData?.id && (
                      <ExpiresAt time={item3?.expires_at} />
                    )}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "wrap", // Wrap the content if it overflows
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 10,
                      width: 200,
                    }}
                  >
                    {item3?.post_type == "ad_post" ? (
                      <Text style={styles.time}>{t("Sponsored")}</Text>
                    ) : (
                      <Text style={styles.time}>
                        {timeDifference(item3?.created_at)}
                      </Text>
                    )}
                    {privacy(item3?.post_privacy)}

                    {item3?.post_type !== "ad_post" ? (
                      <Text style={styles.tagTxt}>
                        {tags(t(item3?.post_tag_id))}
                      </Text>
                    ) : null}
                    {item3?.updated_at !== item3?.created_at && (
                      <View style={styles.iconContainer}>
                        {ICONS.fontAwesome5("pen", null, 12)}
                      </View>
                    )}
                  </View>

                  {/* ================ changes come from ateeq====== */}

                  <PostMenuModel
                    showConfirmDialog={showConfirmDialog}
                    editMyPost={editMyPost}
                    item3={item3}
                    isAdmin={item3?.user?.id == userData?.id ? true : false}
                    isTimeLine={item3?.wall_id == userData?.id}
                    savePost={onPressSavedPost}
                    unSavePost={onPressUnSavePost}
                  />
                  {/* ======== end changes================= */}
                </View>
              </View>
            </View>
          </View>
          {item3?.post_text != null ? (
            <View
              style={{
                flex: 1,
                padding: 5,
                marginRight: 10,
                // alignSelf: "flex-start",
                // backgroundColor: "red",
              }}
            >
              {item3?.pattern ? null : (
                <NewsFeedText txt={item3?.post_text} textStyle={{}} />
              )}
            </View>
          ) : null}
        </>
        {/* ------------shared start---------------------  */}
        {/* if(item3 && item3.post_shared && item3.post_shared == undefined ){} */}
        {/* {item3 && item3.post_shared && item3.post_shared == undefined ? (
          <Text>==================</Text>
        ) : null} */}

        {item3?.post_shared?.post_type == "reel" ? (
          <View style={styles.sharePostReel}>
            <View style={styles.upperTabReel}>
              <Dp
                user={item3?.post_shared?.user}
                pages={item3?.post_shared?.pages?.[0]}
                groups={item3?.post_shared?.groups?.[0]}
                rooms={item3?.post_shared?.rooms?.[0]}
                events={item3?.post_shared?.events}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>
                    <TitleName
                      user={item3?.post_shared?.user}
                      pages={item3?.post_shared?.pages?.[0]}
                      groups={item3?.post_shared?.groups?.[0]}
                      rooms={item3?.post_shared?.rooms?.[0]}
                      events={item3?.post_shared?.events}
                      color={COLORS.white}
                      promote_page={item3?.promote_page}
                    />
                    {/* <SharedReelHeader
                      voumeUp={muteVoume}
                      muteVoume={muteVoume}
                      mute={mute}
                      // name={firstName[1] + " " + lastName[1]}
                      // profilePic={item?.reel_audio?.[0]?.user?.profile_picture}
                      // onPressMenuModal={onPressMenuModal}
                      // isAdmin={isAdmin}
                    /> */}

                    {item3?.post_shared?.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          is {item3?.post_shared?.feeling_action}{" "}
                          {item3?.post_shared?.feeling_value}{" "}
                          {showImgFunc(item3?.post_shared?.feeling_value)}
                        </Text>
                      </>
                    )}

                    {item3?.post_shared?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!item3?.post_shared?.feeling_action && "is "}with
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: COLORS.primary,
                              fontSize: 16,
                            }}
                            onPress={() =>
                              onPressTaggedPerson(
                                item3?.post_shared?.tagged_users?.[0]
                              )
                            }
                          >
                            {" "}
                            {
                              item3?.post_shared?.tagged_users?.[0]?.first_name
                            }{" "}
                            {item3?.post_shared?.tagged_users?.[0]?.last_name}{" "}
                          </Text>
                          {item3?.post_shared?.tagged_users?.length && (
                            <Text>
                              {t("and")}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  // color: COLORS.primary,
                                }}
                                onPress={() =>
                                  onPressTaggedOthers(
                                    item3?.post_shared?.tagged_users
                                  )
                                }
                              >
                                {" "}
                                {item3?.post_shared?.tagged_users?.length -
                                  1}{" "}
                                {t("other")}
                                {item3?.post_shared?.tagged_users?.length - 1 >
                                1
                                  ? "s"
                                  : null}
                              </Text>
                            </Text>
                          )}
                        </Text>
                      </>
                    )}
                    {item3?.post_shared?.post_type === "profile_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated profile picture")}
                      </Text>
                    ) : item3?.post_shared?.post_type === "shared_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("has shared a post")}{" "}
                        {item3?.post_shared?.groups[0]?.name
                          ? `to ${item3?.post_shared?.groups[0]?.name}`
                          : item3?.post_shared?.pages[0]?.name
                          ? `in ${item3?.post_shared?.pages[0]?.name}`
                          : item3?.post_shared?.rooms[0]?.name
                          ? `in ${item3?.post_shared?.rooms[0]?.name}`
                          : item3?.post_shared?.shared_user_post?.name
                          ? `with ${item3?.post_shared?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : item3?.post_shared?.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        {" "}
                        at {item3?.post_shared?.post_map}
                      </Text>
                    ) : item3?.post_shared?.post_type == "timeline" &&
                      item3?.post_shared?.user?.id !==
                        item3?.post_shared?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              id: item3?.post_shared?.wall_user?.id,
                            })
                          }
                          style={styles.name}
                        >
                          {item3?.post_shared?.wall_user?.first_name}{" "}
                          {item3?.post_shared?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.time}>
                    {timeDifference(item3?.post_shared?.created_at)}
                  </Text>
                </View>
              </View>
            </View>

            {/* {item3?.post_shared?.post_text != null ? (
              <View
                style={{
                  paddingBottom: 7,
                  paddingHorizontal: 16,
                  // position: "absolute",
                  // marginTop: 40,
                  // flexDirection: "column-reverse",
                  // alignItems: "flex-end",
                  // alignSelf: "",
                  // justifyContent: "",
                }}
              >
                {item3?.post_shared?.pattern ? null : (
                  <NewsFeedText txt={item3?.post_shared?.post_text} />

                )}
              </View>
            ) : null} */}
            {item3?.post_shared?.media?.length ? (
              <>
                <ImageGrid
                  data={item3?.post_shared?.media}
                  item3={item3}
                  isModell={isModell}
                  setIsModel={setIsModel}
                  handleLike={handleLike}
                  handleShare={handleShare}
                  onRefresh={onRefresh}
                  imageModelShow={(item, imgIndex) =>
                    imageModelShowShare(item3, imgIndex, index)
                  }
                  fetchApiForGrid={() =>
                    fetchApiForGrid(item3?.post_shared?.encrypted_id)
                  }
                  shared={true}
                  myVideoIndex={myVideoIndex}
                  NewsFeedIndex={index}
                />

                <>
                  {isSinglePictureModellShare &&
                  postGalleryIndexShare == index ? (
                    <ImageShowSingle
                      key={item3?.id}
                      isSinglePictureModell={isSinglePictureModellShare}
                      setIsSinglePictureModell={setIsSinglePictureModellShare}
                      index={index}
                      postData={item3?.post_shared}
                      currentDimensions={currentDimensions}
                      onRefresh={onRefresh}
                    />
                  ) : null}
                </>
              </>
            ) : null}
            {item3?.post_shared?.pattern ? (
              <View style={styles.postedView}>
                {item3?.post_shared?.pattern?.type == "image" ? (
                  <ImageBackground
                    source={{
                      uri:
                        SITE_URL +
                        "frontend/img/" +
                        item3?.post_shared?.pattern?.background_image,
                    }}
                    resizeMode="cover"
                    style={styles.imageShare}
                  >
                    <Text
                      style={[
                        styles.text,
                        { color: item3?.post_shared?.pattern?.text_color },
                      ]}
                    >
                      {item3?.post_shared?.post_text}
                    </Text>
                  </ImageBackground>
                ) : (
                  <LinearGradient
                    colors={[
                      item3?.post_shared?.pattern?.background_color_1,
                      item3?.post_shared?.pattern?.background_color_2,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.colorPost]}
                  >
                    <Text
                      style={[
                        styles.text,
                        { color: item3?.post_shared?.pattern?.text_color },
                      ]}
                    >
                      {item3?.post_shared?.post_text}
                    </Text>
                  </LinearGradient>
                )}
              </View>
            ) : null}
          </View>
        ) : item3.post_shared !== null &&
          !expiryTime &&
          item3?.post_type === "shared_post" ? (
          <View style={styles.sharePost}>
            <View style={styles.upperTab}>
              <Dp
                user={item3?.post_shared?.user}
                pages={item3?.post_shared?.pages?.[0]}
                groups={item3?.post_shared?.groups?.[0]}
                rooms={item3?.post_shared?.rooms?.[0]}
                events={item3?.post_shared?.events}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>
                    <TitleName
                      user={item3?.post_shared?.user}
                      pages={item3?.post_shared?.pages?.[0]}
                      groups={item3?.post_shared?.groups?.[0]}
                      rooms={item3?.post_shared?.rooms?.[0]}
                      events={item3?.post_shared?.events}
                      promote_page={item3?.promote_page}
                    />
                    {item3?.post_shared?.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          is {item3?.post_shared?.feeling_action}{" "}
                          {item3?.post_shared?.feeling_value}{" "}
                          {showImgFunc(item3?.post_shared?.feeling_value)}
                        </Text>
                      </>
                    )}
                    {item3?.post_shared?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!item3?.post_shared?.feeling_action && "is "}with
                          <Text
                            style={{ fontWeight: "bold", color: "#DF4B38" }}
                            onPress={() =>
                              onPressTaggedPerson(
                                item3?.post_shared?.tagged_users?.[0]
                              )
                            }
                          >
                            {" "}
                            {
                              item3?.post_shared?.tagged_users?.[0]?.first_name
                            }{" "}
                            {item3?.post_shared?.tagged_users?.[0]?.last_name}{" "}
                          </Text>
                          {item3?.post_shared?.tagged_users.length && (
                            <Text>
                              {t("and")}
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: "#DF4B38",
                                }}
                                onPress={() =>
                                  onPressTaggedOthers(
                                    item3?.post_shared?.tagged_users
                                  )
                                }
                              >
                                {" "}
                                {item3?.post_shared?.tagged_users.length -
                                  1}{" "}
                                {t("other")}
                                {item3?.post_shared?.tagged_users.length - 1 > 1
                                  ? "s"
                                  : null}
                              </Text>
                            </Text>
                          )}
                        </Text>
                      </>
                    )}
                    {item3?.post_shared?.post_type === "profile_picture" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("updated profile picture")}
                      </Text>
                    ) : item3?.post_shared?.post_type === "shared_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("has shared a post")}{" "}
                        {item3?.post_shared?.groups[0]?.name
                          ? `to ${item3?.post_shared?.groups[0]?.name}`
                          : item3?.post_shared?.pages[0]?.name
                          ? `in ${item3?.post_shared?.pages[0]?.name}`
                          : item3?.post_shared?.rooms[0]?.name
                          ? `in ${item3?.post_shared?.rooms[0]?.name}`
                          : item3?.post_shared?.shared_user_post?.name
                          ? `with ${item3?.post_shared?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : item3?.post_shared?.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        {" "}
                        at {item3?.post_shared?.post_map}
                      </Text>
                    ) : item3?.post_shared?.post_type == "timeline" &&
                      item3?.post_shared?.user?.id !==
                        item3?.post_shared?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}> {t("posted on ")} </Text>

                        <Text
                          onPress={() =>
                            navigation.navigate("ProfileScreen", {
                              id: item3?.post_shared?.wall_user?.id,
                            })
                          }
                          style={styles.name}
                        >
                          {/* -------------------------------------------- */}
                          {item3?.post_shared?.wall_user?.first_name}{" "}
                          {item3?.post_shared?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}{" "}
                    {item3?.post_shared?.expires_at &&
                      item3?.post_shared?.user?.id == userData?.id && (
                        <ExpiresAt time={item3?.post_shared?.expires_at} />
                      )}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.time}>
                    {timeDifference(item3?.post_shared?.created_at)}
                  </Text>
                  {privacy(item3?.post_privacy)}

                  {item3?.post_shared?.pages?.length === 0 ? (
                    <Text style={styles.tagTxt}>
                      {tags(item3?.post_shared?.post_tag_id)}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
            {item3?.post_shared?.post_text != null ? (
              <View style={{ paddingBottom: 7, paddingHorizontal: 16 }}>
                {item3?.post_shared?.pattern ? null : (
                  <>
                    <NewsFeedText txt={item3?.post_shared?.post_text} />
                  </>
                )}
              </View>
            ) : null}
            {item3?.post_shared?.media?.length ? (
              <>
                <ImageGrid
                  data={item3?.post_shared?.media}
                  item3={item3}
                  isModell={isModell}
                  setIsModel={setIsModel}
                  handleLike={handleLike}
                  handleShare={handleShare}
                  onRefresh={onRefresh}
                  imageModelShow={(item, imgIndex) =>
                    imageModelShowShare(item3, imgIndex, index)
                  }
                  fetchApiForGrid={() =>
                    fetchApiForGrid(item3?.post_shared?.encrypted_id)
                  }
                  shared={true}
                  myVideoIndex={myVideoIndex}
                  NewsFeedIndex={index}
                />

                <>
                  {isSinglePictureModellShare &&
                  postGalleryIndexShare == index ? (
                    <ImageShowSingle
                      key={item3?.id}
                      isSinglePictureModell={isSinglePictureModellShare}
                      setIsSinglePictureModell={setIsSinglePictureModellShare}
                      index={index}
                      postData={item3?.post_shared}
                      currentDimensions={currentDimensions}
                      onRefresh={onRefresh}
                    />
                  ) : null}
                </>
              </>
            ) : null}
            {item3?.post_shared?.pattern ? (
              <View style={styles.postedView}>
                {item3?.post_shared?.pattern?.type == "image" ? (
                  <ImageBackground
                    source={{
                      uri:
                        SITE_URL +
                        "frontend/img/" +
                        item3?.post_shared?.pattern?.background_image,
                    }}
                    resizeMode="cover"
                    style={styles.imageShare}
                  >
                    <Text
                      style={[
                        styles.text,
                        { color: item3?.post_shared?.pattern?.text_color },
                      ]}
                    >
                      {item3?.post_shared?.post_text}
                    </Text>
                  </ImageBackground>
                ) : (
                  <LinearGradient
                    colors={[
                      item3?.post_shared?.pattern?.background_color_1,
                      item3?.post_shared?.pattern?.background_color_2,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.colorPost]}
                  >
                    <Text
                      style={[
                        styles.text,
                        { color: item3?.post_shared?.pattern?.text_color },
                      ]}
                    >
                      {item3?.post_shared?.post_text}
                    </Text>
                  </LinearGradient>
                )}
              </View>
            ) : null}
          </View>
        ) : item3?.post_type === "shared_post" &&
          (item3?.post_shared === null || expiryTime) ? (
          <View style={styles.noContent}>
            {ICONS.antDesign("infocirlce", COLORS.grey, 20)}
            <Text style={{ padding: 5 }}>
              {t("This content is not available!")}
            </Text>
          </View>
        ) : item3?.post_shared == "null" ? null : null}

        {/* ------------shared end---------------------  */}

        {item3?.media?.length > 0 ? (
          <>
            <ImageGrid
              data={item3?.media}
              item3={item3}
              isModell={isModell}
              setIsModel={setIsModel}
              handleLike={handleLike}
              handleShare={handleShare}
              onRefresh={onRefresh}
              imageModelShow={(item, imgIndex) =>
                imageModelShow(item3, imgIndex, index)
              }
              fetchApiForGrid={() => fetchApiForGrid(item3?.encrypted_id)}
              myVideoIndex={myVideoIndex}
              NewsFeedIndex={index}
            />

            {isSinglePictureModell && postGalleryIndex == index ? (
              <ImageShowSingle
                key={item3?.id}
                isSinglePictureModell={isSinglePictureModell}
                setIsSinglePictureModell={setIsSinglePictureModell}
                index={index}
                postData={item3}
                currentDimensions={currentDimensions}
                onRefresh={onRefresh}
              />
            ) : null}
          </>
        ) : null}
        {item3?.pattern ? (
          <View
            style={{
              marginTop: HP(1),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item3?.pattern.type == "image" ? (
              <ImageBackground
                source={{
                  uri:
                    SITE_URL +
                    "frontend/img/" +
                    item3?.pattern.background_image,
                }}
                resizeMode="cover"
                style={styles.image}
              >
                <Text
                  style={[styles.text, { color: item3?.pattern.text_color }]}
                >
                  {item3?.post_text}
                </Text>
              </ImageBackground>
            ) : (
              <LinearGradient
                colors={[
                  item3?.pattern.background_color_1,
                  item3?.pattern.background_color_2,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.colorPost, { width: WP(100) }]}
              >
                <Text
                  style={[styles.text, { color: item3?.pattern.text_color }]}
                >
                  {item3?.post_text}
                </Text>
              </LinearGradient>
            )}
          </View>
        ) : null}

        <ShowLikeCommentShare
          postId={item3?.id}
          reaction={item3?.reaction}
          post_reactions_count={item3?.post_reactions_count}
          comments_count={item3?.comments_count + item3?.replies_count}
          shared_post_count={item3?.shared_post_count}
          like={item3?.like}
          heart={item3?.heart}
          haha={item3?.haha}
          wow={item3?.wow}
          sad={item3?.sad}
          angry={item3?.angry}
          fontColor={"black"}
          pressfunction={() => {
            getIdAndDispatch(item3?.encrypted_id, item3?.id, index, "comment");
            onPressCommentOpen(item3);
            setFromNewsFeed(false);
          }}
        />
        <LikeComShare
          likePress={() => {
            likeItemFunc(item3, index);
          }}
          unLikePress={() => {
            unLikeItemFunc(item3, index);
          }}
          commentPress={() => {
            setInputFocus(true);
            getIdAndDispatch(item3?.encrypted_id, item3?.id, index, "comment");
            onPressCommentOpen(item3);
            setFromNewsFeed(false);
          }}
          sharePress={() => {
            onPressShareModal(item3);
          }}
          likesCount={item3?.post_reactions_count}
          commentsCount={item3?.comments_count + item3?.replies_count}
          shareCount={item3?.shared_post_count}
          color={COLORS.primary}
          liked={item3?.reaction != null ? true : false}
          reactionID={item3?.reaction?.reaction_type_id}
          reactionType={(id) => reactionType(id, item3, index)}
          hideShare={
            item3?.post_type == "ad_post" ||
            item3?.post_type === "room_post" ||
            item3?.post_privacy !== "public"
          }
        />

        {taggedPeopleModel ? (
          <TaggedPeopleModal
            isVisible={taggedPeopleModel}
            close={() => setTaggedPeopleModel(false)}
            taggedPeopleList={taggedPeopleList}
          />
        ) : null}
        <FirstComment
          data={item3?.comments}
          data_target={data_target}
          handleOnPresReply={handleOnPresReply}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View>
        {!isLoading && noMore ? (
          <View style={styles.noPostsContainer}>
            <Text style={{ fontSize: 23, color: "grey" }}>No more posts</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 60 }}>
            <SkeletonLoader isLoading={isLoading} layoutType={"feed"} />
          </View>
        )}
      </View>
    );
  };

  const onViewableItemsChanged = ({ viewableItems, changed }) => {
    setmyVideoIndex(changed?.[0]?.key);
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 80,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsAtTop(offsetY <= 0); // Check if user is at the top
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handleed"
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        onScroll={handleScroll}
        windowSize={5}
        data={data}
        renderItem={({ item, index }) =>
          NewsFeedItem({
            item,
            index,
          })
        }
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={() => handleLoadMore()}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReachedThreshold={0.9}
        ItemSeparatorComponent={() => FlatListItemSeparator()}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        ListHeaderComponent={props.Header}
        ListEmptyComponent={
          <>
            {!isLoading && data?.length === 0 ? ( // Only show the message if data is empty
              <View style={styles.noPostsContainer}>
                <Text style={{ fontSize: 23, color: COLORS.darkGray }}>
                  {noPostText}
                </Text>
              </View>
            ) : null}
          </>
        }
      />

      {isModell ? (
        <ComentModel
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          isModell={isModell}
          setIsModel={setIsModel}
          item3={currentCommentItem}
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
      {shareModel ? (
        <ShareModel
          shareModel={shareModel}
          setShareModel={setShareModel}
          onRefresh={onRefresh}
          item={currentShareItem}
          postId={
            currentShareItem?.post_shared?.id
              ? currentShareItem?.post_shared?.id
              : currentShareItem?.id
          }
        />
      ) : null}
      {isSavePostModalVisible && (
        <SavePostFeed
          isModalVisible={isSavePostModalVisible}
          setIsSavePostModalVisible={setIsSavePostModalVisible}
          savePost={saved_post}
          data={data}
          setData={setData}
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
    </>
  );
};

export default React.memo(NewsfComponent);
