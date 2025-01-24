import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import { useTranslation } from "react-i18next";
import { Divider } from "react-native-elements";
import FastImage from "react-native-fast-image";
import SimpleToast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";

// import MentorshipTab from "./MentorshipTab";
import Settings from "./Components/Settings";
import Loader from "../Rooms/components/Loader";
import NewPost from "../../../Components/NewPost";
import RenderAlbums from "./Components/AlbumsGroupTL";
import RenderVideos from "./Components/VideosGroupTL";
import ButtonCom from "../Rooms/components/ButtonCom";
import ViewGroupTabs from "./Components/ViewGroupTabs";
import styles from "../Rooms/components/RoomsTLStyles";
import ShareModel from "../../../Components/ShareModel";
import ComentModel from "../../../Components/ComentModel";
import FirstComment from "../../../Components/FirstComment";
import LikeComShare from "../../../Components/LikeComShare";
import EditPostModal from "../../../Components/EditPostModal";
import RenderMembers from "../Rooms/components/RenderMembers";
import InviteMemberModal from "./Components/InviteMemberModal";
import AddMemberModal from "../Rooms/components/AddMemberModal";
import ImageShowSingle from "../../../Components/ImageShowSingle";
import ExpiresAt from "../../../Components/NewsFeedList/ExpiresAt";
import ImageGrid from "../../../Components/ImageGridFlatlist/index";
import TaggedPeopleModal from "../../../Components/TaggedPeopleModal";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import PostMenuModel from "../../../Components/NewsFeedList/PostMenuModel";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";

import {
  editPost,
  likeItem,
  unLikeItem,
  deletePost,
  fetchComments,
  showGalleryPosts,
} from "../../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../../Redux/action-types";

import { HP } from "../../../../Utils/Resposive";
import { showImgFunc } from "../../../../Utils/Data";
import { getHeight } from "../../../../Utils/NewResponsive";
import { privacy } from "../../../../Utils/PickerDataStatus/privacyData";

import { BASE_URL, SITE_URL } from "../../../Services/Constants";
import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis";

import {
  handleLike,
  handleShare,
  timeDifference,
  FlatListItemSeparator,
} from "../../../Components/NewsFeedList/Functions";

import { ICONS } from "../../../Constants/Icons";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import LogoutUserComponent from "../../../Components/LogoutUserComponent";
import { isRTL } from "../../../../Utils/IsRTL";
import { getGroupsList } from "../../../Redux/actions/EventActions";
import SavePostFeed from "../../../Components/SavePost/SavePostFeed";
import LogoutModal from "../../../Components/LogoutModal";
import { deleteApiData } from "../ReminderScreen/Components/remindersApiCall";

const GroupsTL = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  let { id, invitation, pendingApproval, fromSplash, focusMembers } =
    route.params;

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);

  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [isModell, setIsModel] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [isPictureModell, setIsPictureModell] = useState(false);
  const [isPictureModellShare, setIsPictureModellShare] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [postIndex, setPostIndex] = useState();

  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [postGalleryIndexShare, setPostGalleryIndexShare] = useState(0);
  const [encrypted_id, setEncrypted_id] = useState("");
  const [currentDimensions, setCurrentDimensions] = useState();
  const [data_target, setData_target] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [localCover, setLocalCover] = useState("");
  const [saved_post, setSavedPost] = useState("");
  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [groupTLData, setGroupTLData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [fromPending, setFromPending] = useState(pendingApproval);
  const [fromInvitation, setFromInvitation] = useState(invitation);

  const [admins, setAdmins] = useState([]);
  const [others, setOthers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [groupMembersData, setGroupMembersData] = useState(null);

  const [myVideoIndex, setmyVideoIndex] = useState(0);
  const [homeVisible, setHomeVisible] = useState(false);
  const [albumsVisible, setAlbumsVisible] = useState(false);
  const [videosVisible, setVideosVisible] = useState(false);
  const [membersVisible, setMembersVisible] = useState(false);
  const [mentorshipTabVisible, setMentorshipTabVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const [iniviteMemberModalVisible, setIniviteMemberModalVisible] =
    useState(false);
  const [joinBtnPress, setJoinBtnPress] = useState(false);

  const group_Id_no = groupTLData[0]?.group?.id;
  const isMember = groupTLData[0]?.isGroupMember;
  const gropuPrivacy = groupTLData[0]?.group?.privacy;
  const isAdmin = groupTLData[0]?.profileHeaderData?.data?.hasPermission;
  const adminCount = groupTLData[0]?.profileHeaderData?.data?.admins_count;

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    const navListener =
      Platform.OS == "ios" && token
        ? navigation.addListener("blur", (e) => {
            fromSplash &&
              navigation.reset({
                index: 0,
                routes: [{ name: "MyTopTabs" }],
              });
          })
        : Platform.OS == "android" && token
        ? navigation.addListener("gestureEnd", () => {
            goBack();
            return true;
          })
        : navigation.addListener("blur", () => {
            navigation.replace("Intro");
          });

    return () => {
      backhandler.remove();
      // handleBack();

      navListener();
    };
  }, []);
  useEffect(() => {
    onHomePressed();
  }, []); // done

  useEffect(() => {
    getTimelineData();
    getMembersList();
  }, []); // done

  useEffect(() => {
    getTimelineData();
  }, [page]); // done

  const getTimelineData = () => {
    const url = `${BASE_URL}/groups/${id}?page=${page}`;
    setLoadingMore(true);

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
          if (res?.responseCode == 200) {
            if (page == 1) {
              setGroupTLData([res?.payload?.data]);
              setLastPage(res?.payload?.data?.singlePost?.last_page);

              setLoading(false);
              setRefreshing(false);
              setLoadingMore(false);
            } else {
              let data = { ...groupTLData[0] };
              let newData = { ...res?.payload?.data };

              let dataArray = [...data?.singlePost?.data];
              let newDataArray = [...newData?.singlePost?.data];
              let combinedDataArray = [...dataArray, ...newDataArray];

              let combinedData = [
                {
                  ...newData,
                  singlePost: {
                    data: combinedDataArray,
                  },
                },
              ];

              setGroupTLData(combinedData);

              setLoading(false);
              setRefreshing(false);
              setLoadingMore(false);
            }
          } else {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);

            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      console.log("timelineDataError: ", error);
    }
  }; // done

  const getMembersList = () => {
    const url = `${BASE_URL}/groups/${id}/members?page=${page}`;

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
          setRefreshing(false);
          setLoadingMore(false);

          if (res?.responseCode == 200) {
            setAdmins(res?.payload?.data?.admins);
            setFriends(res?.payload?.data?.friends);
            setOthers(res?.payload?.data?.otherMembers);
            setGroupMembersData(res?.payload?.data?.my_user_data);
            setPendingRequests(res?.payload?.data?.pendingRequests);
          } else {
            console.log("error: group is private");
          }
        })
        .catch((error) => {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      console.log("timelineDataError: ", error);
    }
  }; // done

  const searchMembers = (text) => {
    const url = `${BASE_URL}/groups/${id}/members/search?search_member=${text}`;

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
          if (res?.responseCode == 200) {
            setGroupMembersData(res?.payload?.data?.my_user_data);
            setAdmins(res?.payload?.data?.admins);
            setFriends(res?.payload?.data?.friends);
            setOthers(res?.payload?.data?.otherMembers);
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("timelineDataError: ", error);
    }
  }; // done

  const setMemberSearch = (text) => {
    setKeyword(text);
    searchMembers(text);
  }; // done

  const handleLoadMore = () => {
    if (!loadingMore && page < lastPage) {
      setPage(page + 1);
    }
  }; // done

  const deleteMyPost = (id) => {
    dispatch(deletePost({ id, token, refresh: () => onRefresh(true) }));
  }; // done

  const showConfirmDialog = (id) => {
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this post?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            deleteMyPost(id);
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  }; //done

  const editMyPost = (id) => {
    dispatch(editPost({ id, token, refresh: () => onRefresh(true) }));
    setTimeout(() => {
      setEditPostVisibility(true);
    }, 500);
  }; // done

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

      const updatedData = groupTLData?.map((item) => {
        if (
          item?.singlePost?.data?.[0]?.encrypted_id === saved_post?.encrypted_id
        ) {
          return {
            ...item,
            singlePost: {
              ...item.singlePost,
              data: [
                {
                  ...item.singlePost.data[0],
                  saved_post: [],
                },
              ],
            },
          };
        }
        return item;
      });

      setGroupTLData(updatedData);
    }
  };

  const openProfileFromFreinds = (userName, id) => {
    navigation.navigate("ProfileScreen", {
      id: id,
      userName: userName,
    });
  }; // done

  const openGroupOnNamePress = (group) => {
    // if (group?.id == group_Id_no) console.log("hello");
    navigation.push("GroupsTL", { id: group?.encrypted_id });
  }; // done

  const openPageOnNamePress = (group) => {
    SimpleToast.show(
      "This feature is in development stage. Please use this feature on the website."
    );
  }; // done

  const imageModelShow = (item, index, myIndex) => {
    setPostGalleryIndex(myIndex);
    setIsPictureModell(!isPictureModell);
  };

  const imageModelShowShare = (item, index, myIndex) => {
    setPostGalleryIndexShare(myIndex);
    setIsPictureModellShare(!isPictureModellShare);
  };

  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  }; // done

  const likeItemFunc = async (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");

    dispatch(likeItem({ token, formData }));

    let feed = [...groupTLData];
    let post = feed[0];

    let singlePost = { ...post?.singlePost };
    let singlePostData = [...singlePost?.data];
    let selectedPostData = singlePostData[index];

    selectedPostData.reaction = {
      reaction_type_id: 1,
    };

    selectedPostData.post_reactions_count = reactChk(
      selectedPostData.post_reactions_count,
      selectedPostData.localReacted
    );

    selectedPostData.localReacted = true;

    singlePostData[index] = selectedPostData;
    singlePost.data = singlePostData;
    post.singlePost = singlePost;

    feed[0] = post;
    setGroupTLData(feed);
  }; // done

  const unLikeItemFunc = (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    dispatch(unLikeItem({ token, formData }));

    let feed = [...groupTLData];
    let post = feed[0];

    let singlePost = { ...post?.singlePost };
    let singlePostData = [...singlePost?.data];
    let selectedPostData = singlePostData[index];

    if (selectedPostData?.reaction.reaction_type_id == 1) {
      let like = selectedPostData?.like?.filter(
        (i) => i.user_id != userData.id
      );
      selectedPostData.like = like;
    }

    if (selectedPostData?.reaction.reaction_type_id == 2) {
      let heart = selectedPostData?.heart?.filter(
        (i) => i.user_id != userData.id
      );
      selectedPostData.heart = heart;
    }

    if (selectedPostData?.reaction.reaction_type_id == 3) {
      let haha = selectedPostData?.haha?.filter(
        (i) => i.user_id != userData.id
      );
      selectedPostData.haha = haha;
    }

    if (selectedPostData?.reaction.reaction_type_id == 4) {
      let wow = selectedPostData?.wow?.filter((i) => i.user_id != userData.id);
      selectedPostData.wow = wow;
    }

    if (selectedPostData?.reaction.reaction_type_id == 5) {
      let sad = selectedPostData?.sad?.filter((i) => i.user_id != userData.id);
      selectedPostData.sad = sad;
    }

    if (selectedPostData?.reaction.reaction_type_id == 6) {
      let angry = selectedPostData?.angry?.filter(
        (i) => i.user_id != userData.id
      );
      selectedPostData.angry = angry;
    }

    selectedPostData.reaction = null;
    selectedPostData.localReacted = false;
    selectedPostData.post_reactions_count =
      selectedPostData.post_reactions_count - 1;

    singlePostData[index] = selectedPostData;
    singlePost.data = singlePostData;
    post.singlePost = singlePost;

    feed[0] = post;
    setGroupTLData(feed);
  }; // done

  const reactionType = (id, item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");

    dispatch(likeItem({ token, formData }));

    let feed = [...groupTLData];
    let post = feed[0];

    let singlePost = { ...post?.singlePost };
    let singlePostData = [...singlePost?.data];
    let selectedPostData = singlePostData[index];

    selectedPostData.post_reactions_count = reactChk(
      selectedPostData.post_reactions_count,
      selectedPostData.localReacted,
      selectedPostData.reaction
    );

    selectedPostData.reaction = {
      reaction_type_id: id,
    };

    selectedPostData.localReacted = true;

    singlePostData[index] = selectedPostData;
    singlePost.data = singlePostData;
    post.singlePost = singlePost;

    feed[0] = post;
    setGroupTLData(feed);
  }; // done

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setData_target(data_target);
    setIsModel(!isModell);

    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  }; // done

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  }; // done

  const sendCoverToServer = async (image, crop) => {
    const coverImg = image.assets[0];
    const formData = new FormData();

    formData.append("pos", 0);
    formData.append("cover", {
      uri: coverImg.uri,
      type: coverImg.type,
      name: coverImg.fileName,
    });

    try {
      const res = await postStatusApiCall({
        route: `groups/${id}/re_cover`,
        verb: "POST",
        token: token,
        body: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in sendCoverToServer ... ", res);
      } else if (res.responseCode === 200) {
        dispatch(getGroupsList(true));
        setLocalCover(coverImg.uri);
        SimpleToast.show("Cover picture added successfully");

        onRefresh(true);
      }
    } catch (error) {
      console.log("err", error);
    }
  }; // done

  const changeCover = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        quality: 1,
        cropperCircleOverlay: true,
      },
      (image) => {
        if (!image.didCancel && !image.error) {
          setLocalCover(image.uri);
          sendCoverToServer(image);
          SimpleToast.show(t("Uploading..."));
        }
      }
    );
  }; // done

  const onPressTaggedPerson = (item) => {
    openProfileFromFreinds(item.name, item.id);
  }; // done

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  }; // done

  const onHomePressed = () => {
    setMembersVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setMentorshipTabVisible(false);
    setHomeVisible(true);
  }; // done

  const onAlbumsPressed = () => {
    setHomeVisible(false);
    setMembersVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setMentorshipTabVisible(false);
    setAlbumsVisible(true);
  }; // done

  const onVideosPressed = () => {
    setHomeVisible(false);
    setMembersVisible(false);
    setAlbumsVisible(false);
    setSettingsVisible(false);
    setMentorshipTabVisible(false);
    setVideosVisible(true);
  }; // done

  const onMemberPressed = () => {
    setHomeVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setMentorshipTabVisible(false);
    setMembersVisible(true);
  }; // done

  const onMentorshipPressed = () => {
    setHomeVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setMembersVisible(false);
    setSettingsVisible(false);
    setMentorshipTabVisible(true);
  }; // done

  const onSettingsPressed = () => {
    setHomeVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setMembersVisible(false);
    setMentorshipTabVisible(false);
    setSettingsVisible(true);
  }; // done

  const onMuseumPressed = (item) => {
    navigation.navigate("Museum", {
      id: id,
      moduleType: "groups",
      moduleName: item?.group?.name,
    });
  };
  const onGalleryPressed = (item) => {
    navigation.navigate("Museum", {
      id: id,
      gallery: true,
      moduleType: "groups",
      moduleName: item?.group?.name,
    });
  };

  const onRefresh = (fromCover) => {
    if (videosVisible) {
      setForceRefresh(true);
    } else {
      if (!fromCover) setRefreshing(true);

      setPage(1);
      getTimelineData();
      getMembersList();
    }
  }; // done

  const onCoverPressed = (item) => {
    if (item?.group?.cover_full) {
      navigation.navigate("ImageShowScreen", {
        url: SITE_URL + item?.group?.cover_full,
      });
    }
  }; // done

  const goBack = () => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  }; // done

  const onViewableItemsChanged = ({ viewableItems, changed }) => {
    setmyVideoIndex(changed?.[0]?.key);
  }; // done

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 80,
  }; // done

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]); // done

  const handleOnPresReply = (item, item3, index) => {
    setReplyingName(item.user?.first_name + " " + item.user?.last_name);
    setCommentId(item?.id);
    onPressCommentOpen(item3);
    setIsReplying(true);
    setInputFocus(true);
    getIdAndDispatch(item3?.encrypted_id, item3?.id, index, "comment");
    setFromNewsFeed(true);
  };

  const onPressCommentOpen = useCallback(
    (item) => {
      setCommentCurrentItem(item);
      setIsModel(!isModell);
    },
    [isModell]
  );

  const renderTL = ({ item, index }) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.timelineContainer}>
          <EditPostModal
            visible={editPostVisibility}
            goBack={() => setEditPostVisibility(false)}
            group
            id={group_Id_no}
            encrypted_ID={id}
            gropuPrivacy={gropuPrivacy}
            onRefresh={() => onRefresh(true)}
          />

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
                    {item.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          is {item.feeling_action + " "}
                          {item.feeling_value + " "}
                          {showImgFunc(item.feeling_value)}
                        </Text>
                      </>
                    )}
                    {item?.tagged_users?.length > 0 && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {!item.feeling_action && "is "}
                          with
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
                      <Text style={styles.action} onPress={() => null}>
                        {t("has shared a post")}{" "}
                        {item?.groups[0]?.name
                          ? `to ${item?.groups[0]?.name}`
                          : item?.pages[0]?.name
                          ? ` in ${item?.pages[0]?.name}`
                          : item?.rooms[0]?.name
                          ? `in ${item?.rooms[0]?.name}`
                          : item?.shared_user_post?.name
                          ? `with ${item?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : item.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        at {item.post_map}
                      </Text>
                    ) : item.post_type == "timeline" &&
                      item?.user.id !== item?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}>{t("posted on ")}</Text>

                        <Text style={styles.name}>
                          {item?.wall_user?.first_name}{" "}
                          {item?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}
                    {item?.expires_at && item?.user?.id == userData?.id && (
                      <ExpiresAt time={item?.expires_at} />
                    )}
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

            {userData?.id == item?.user?.id && (
              <PostMenuModel
                showConfirmDialog={showConfirmDialog}
                editMyPost={editMyPost}
                item3={item}
                savePost={onPressSavedPost}
                unSavePost={onPressUnSavePost}
              />
            )}
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
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
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
                                is {item?.post_shared?.feeling_action}{" "}
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
                                with
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
                              {" "}
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
                      onPress={() => {
                        openProfileFromFreinds(
                          item?.post_shared?.user?.name,
                          item?.post_shared?.user?.id
                        );
                      }}
                    >
                      <FastImage
                        style={styles.timelineDp}
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
                            onPress={() => {
                              openProfileFromFreinds(
                                item?.post_shared?.user?.name,
                                item?.post_shared?.user?.id
                              );
                            }}
                          >
                            {item?.post_shared?.user?.first_name}{" "}
                            {item?.post_shared?.user?.last_name}
                          </Text>
                          <Text style={styles.name}>
                            {ICONS.antDesign("caretright", COLORS.lightGray)}{" "}
                            <Text
                              onPress={() => {
                                openGroupOnNamePress(
                                  item?.post_shared?.groups[0]
                                );
                              }}
                            >
                              {item?.post_shared?.groups[0]?.name}
                            </Text>{" "}
                          </Text>
                          {item?.post_shared?.feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                is {item?.post_shared?.feeling_action}{" "}
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
                                with
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
                              {" "}
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
                          {item?.post_shared?.expires_at &&
                            item?.post_shared?.user?.id == userData?.id && (
                              <ExpiresAt time={item?.expires_at} />
                            )}
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
                      onPress={() => {
                        openProfileFromFreinds(
                          item?.post_shared?.user?.name,
                          item?.post_shared?.user?.id
                        );
                      }}
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
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ marginLeft: 10 }}>
                          <Text
                            style={styles.name}
                            onPress={() => {
                              openProfileFromFreinds(
                                item?.post_shared?.user?.name,
                                item?.post_shared?.user?.id
                              );
                            }}
                          >
                            {item?.post_shared?.user?.first_name}{" "}
                            {item?.post_shared?.user?.last_name}
                          </Text>
                          {item?.post_shared?.feeling_action && (
                            <>
                              <Text style={styles.action} onPress={() => null}>
                                {" "}
                                is {item?.post_shared?.feeling_action}{" "}
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
                                with
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
                          "group_cover_picture_post" ? (
                            <Text style={styles.action} onPress={() => null}>
                              {" "}
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
                                {t("posted on")}
                              </Text>

                              <Text
                                style={styles.name}
                                onPress={() => {
                                  openProfileFromFreinds(
                                    item?.post_shared?.wall_user?.name,
                                    item?.post_shared?.wall_user?.id
                                  );
                                }}
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
                      imageModelShow={(item, imgIndex) =>
                        imageModelShowShare(item, imgIndex, index)
                      }
                      fetchApiForGrid={() =>
                        fetchApiForGrid(item?.post_shared?.encrypted_id)
                      }
                      shared={true}
                      profile={true}
                      group
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
                myVideoIndex={myVideoIndex}
                imageModelShow={(item, imgIndex) => {
                  imageModelShow(item, imgIndex, index);
                }}
                fetchApiForGrid={() => fetchApiForGrid(item.encrypted_id)}
                group
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
              getIdAndDispatch(item.encrypted_id, item.id, index, "comment");
              setPostIndex(index);
              onPressCommentOpen(item);
            }}
          />

          <LikeComShare
            hideShare={gropuPrivacy == "private" ? true : false}
            likePress={() => {
              likeItemFunc(item, index);
            }}
            unLikePress={() => {
              unLikeItemFunc(item, index);
            }}
            commentPress={() => {
              setInputFocus(true);
              setFromNewsFeed(false);
              onPressCommentOpen(item);

              getIdAndDispatch(item.encrypted_id, item.id, index, "comment");
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

          <FirstComment
            data={item.comments}
            data_target={data_target}
            handleOnPresReply={(e) => handleOnPresReply(e, item)}
          />
        </View>
      </SafeAreaView>
    );
  }; // done

  const renderHeader = () => {
    const item = groupTLData[0];
    const groupType = item?.group?.type?.type;
    const requested =
      item?.profileHeaderData?.data?.group_request_status?.request_status == -1;

    return (
      <View>
        <TouchableOpacity onPress={() => onCoverPressed(item)}>
          <ImageBackground
            style={styles.coverPhoto}
            source={
              localCover
                ? { uri: localCover }
                : item?.group?.cover_full
                ? {
                    uri: SITE_URL + item?.group?.cover_full,
                  }
                : IMAGES.blankCover
            }
            resizeMode="cover"
          >
            <TouchableOpacity style={styles.backButtonWrapper} onPress={goBack}>
              {ICONS.antDesign(
                isRTL ? "arrowright" : "arrowleft",
                null,
                getHeight(3.5)
              )}
            </TouchableOpacity>
          </ImageBackground>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.backButtonWrapper, styles.cameraIcon]}
            onPress={() => changeCover()}
          >
            {ICONS.materialCommunityIcons("camera", COLORS.black, 30, {
              alignSelf: "center",
            })}
          </TouchableOpacity>
        )}

        <View style={styles.topButtonsCon}>
          {!fromInvitation ? (
            <>
              {gropuPrivacy == "private" && isAdmin ? (
                <ButtonCom title={t("Invite")} invite onPress={onInvitePress} />
              ) : (
                gropuPrivacy == "public" &&
                (isAdmin || isMember) && (
                  <ButtonCom
                    title={t("Invite")}
                    invite
                    onPress={onInvitePress}
                  />
                )
              )}
              {fromPending ? (
                <ButtonCom
                  title="Cancel"
                  cancelRequest
                  onPress={onPressCancel}
                />
              ) : isAdmin || isMember ? (
                <ButtonCom title={t("Leave")} leave onPress={onPressLeave} />
              ) : !joinBtnPress && !requested ? (
                <ButtonCom
                  title={t("Join")}
                  join
                  onPress={onPressJoin}
                  loading={statusLoading}
                />
              ) : (
                <ButtonCom
                  title="Cancel"
                  cancelRequest
                  onPress={onPressCancel}
                  loading={statusLoading}
                />
              )}
            </>
          ) : (
            <>
              {item?.isGroupMember == false && (
                <ButtonCom title={t("Accept")} join onPress={onPressAccept} />
              )}
              {item?.isGroupMember == true ? (
                <ButtonCom title={t("Leave")} leave onPress={onPressLeave} />
              ) : (
                <ButtonCom
                  title={t("Reject")}
                  cancelRequest
                  onPress={onPressReject}
                />
              )}
            </>
          )}
        </View>

        <TouchableOpacity style={styles.roomNameAndTabsCon}>
          <Text style={styles.roomNameText}>{item?.group?.name}</Text>

          {item?.group?.privacy == "public" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome5("globe", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>
                {t("Public")} . {item?.group?.group_members} {t("members")}
              </Text>
            </View>
          ) : (
            <View style={styles.roomMembersCon}>
              {ICONS.ionIcons("lock-closed", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>
                {t("Private")} . {item?.group?.group_members} {t("members")}
              </Text>
            </View>
          )}

          {groupType == "General" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome("users", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : groupType == "Buy and sell" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome5("store", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : groupType == "Gaming" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome("gamepad", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : groupType == "Social learning" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome5("graduation-cap", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : groupType == "Jobs" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome("briefcase", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : groupType == "Parenting" ? (
            <View style={styles.roomMembersCon}>
              {ICONS.fontAwesome5("user-friends", COLORS.black, HP(1.6))}
              <Text style={styles.memberText}>{t(groupType)}</Text>
            </View>
          ) : null}
        </TouchableOpacity>

        <FlatListItemSeparator />

        <ViewGroupTabs
          onHomePressed={onHomePressed}
          onAlbumsPressed={onAlbumsPressed}
          onVideosPressed={onVideosPressed}
          onMemberPressed={onMemberPressed}
          onMentorshipPressed={onMentorshipPressed}
          onSettingsPressed={onSettingsPressed}
          onMuseumPressed={() => {
            onMuseumPressed(item);
          }}
          onGalleryPressed={() => onGalleryPressed(item)}
          isAdmin={isAdmin}
          focusMembers={focusMembers}
        />

        <FlatListItemSeparator />
      </View>
    );
  }; // done

  const renderFooter = () => {
    return groupTLData[0]?.singlePost?.data?.length == 0 ? (
      <View style={styles.noPostsContainer}>
        <Text style={{ fontSize: 23, color: "Gray" }}>{t("No posts yet")}</Text>
      </View>
    ) : page >= lastPage && !loadingMore ? (
      <View style={styles.noPostsContainer}>
        <Text style={{ fontSize: 23, color: "Gray" }}>
          {t("No more posts")}
        </Text>
      </View>
    ) : loadingMore ? (
      <Loader loaderStyle={{ marginVertical: 10, marginTop: 10 }} />
    ) : null;
  }; // done

  const onInvitePress = () => {
    setIniviteMemberModalVisible(true);
  }; // done

  const joinLeaveCancelRequest = async () => {
    setStatusLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `groups/${id}/join`,
        verb: "GET",
        token: token,
      });

      setLoading(false);

      if (res.responseCode !== 200) {
        console.log("error: ", res.errors);
      } else if (res.responseCode == 200) {
        setStatusLoading(false);
        onRefresh();

        dispatch(getGroupsList(true));

        if (res?.payload?.data?.data?.message == "sent") {
          showMessage({
            message: t(
              "Your request to join this group has been sent successfully"
            ),
            type: "success",
          });
        } else if (res?.payload?.data?.data?.message == "request_cancelled") {
          showMessage({
            message: t("Your request to join this group has been cancelled"),
            type: "success",
          });
        } else if (res?.payload?.data?.data?.message == "left") {
          showMessage({
            message: t("You have left the group"),
            type: "success",
          });

          goBack();
        }
      }
    } catch (error) {
      console.log("inviteMembersError: ", error);
    }
  }; // done

  const onPressJoin = () => {
    // setLoading(true);
    // setJoinBtnPress(true);
    joinLeaveCancelRequest();
  }; // done

  const onPressCancel = () => {
    // setLoading(true);
    // setJoinBtnPress(false);
    joinLeaveCancelRequest();
    fromPending && setFromPending((prevState) => !prevState);
  }; // done

  const onPressLeave = () => {
    if (adminCount > 1 || !isAdmin) {
      Alert.alert(
        t("Leave Group"), // Title
        t("Are you sure you want to leave this group?"), // Message
        [
          {
            text: "Cancel",
            onPress: () => null,
          },
          {
            text: "Leave",
            onPress: () => {
              // setLoading(true);
              joinLeaveCancelRequest();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        t("You can't leave this group"), // Title
        t("First, You must make another admin of the group"), // Message
        [
          {
            text: t("Ok"),
            onPress: () => null,
          },
        ]
      );
    }
  };
  // done

  const acceptDeclineRequest = async (formData, declined) => {
    try {
      const res = await withoutStringiApiCall2({
        params: formData,
        route: `groups/${id}/request/accept`,
        verb: "POST",
        token: token,
      });

      if (res.responseCode !== 200) {
        setLoading(false);
        console.log("error: ", res.errors);
      } else if (res.responseCode == 200) {
        dispatch(getGroupsList(true));
        showMessage({
          message: res.message,
          type: "success",
        });

        if (declined) {
          setLoading(false);
          goBack();
        } else onRefresh(true);
      }
    } catch (error) {
      console.log("inviteMembersError: ", error);
    }
  }; // done

  const onPressAccept = () => {
    const formData = new FormData();
    formData.append("action", "accept");

    setLoading(true);
    acceptDeclineRequest(formData);
    setFromInvitation((prevState) => !prevState);
  }; // done

  const onPressReject = () => {
    const formData = new FormData();
    formData.append("action", "decline");

    setLoading(true);
    acceptDeclineRequest(formData, true);
    setFromInvitation((prevState) => !prevState);
  }; // done

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loader />
      ) : groupTLData?.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          onEndReached={!loadingMore ? handleLoadMore : null}
          keyExtractor={(item, index) => index}
          // numColumns={3}
          data={groupTLData}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ItemSeparatorComponent={() => {
            return <View style={styles.ItemSeparator} />;
          }}
          renderItem={({ item, index }) => {
            return (
              <View>
                {renderHeader()}
                {homeVisible && isMember && (
                  <NewPost
                    placeholder={
                      t("What's on your mind, ") + userData?.first_name
                    }
                    group
                    gropuPrivacy={gropuPrivacy}
                    group_id={group_Id_no}
                    group_encrypted_id={id}
                    onRefresh={onRefresh}
                    newsFeed
                  />
                )}
                <FlatListItemSeparator />

                {homeVisible && (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={item?.singlePost?.data}
                    listKey={(item, index) => index.toString()}
                    style={styles.friendFlatlist}
                    ItemSeparatorComponent={() => FlatListItemSeparator()}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => {
                      !loadingMore ? handleLoadMore() : null;
                    }}
                    ListFooterComponent={() => renderFooter()}
                    renderItem={renderTL}
                    viewabilityConfigCallbackPairs={
                      viewabilityConfigCallbackPairs.current
                    }
                    ListEmptyComponent={
                      item?.group?.privacy == "private" &&
                      !isAdmin &&
                      !isMember &&
                      item?.isGroupMember == false && (
                        <View style={styles.noPostsContainer}>
                          <Text
                            style={{
                              fontSize: 23,
                              color: "Gray",
                              textAlign: "center",
                            }}
                          >
                            {t("Please join to view the contents of")}{" "}
                            {item?.group?.name}
                          </Text>
                        </View>
                      )
                    }
                  />
                )}

                {albumsVisible && (
                  <>
                    {gropuPrivacy == "public" || isAdmin || isMember ? (
                      <RenderAlbums
                        isAdmin={isAdmin}
                        group_encrypted_id={id}
                        gropuPrivacy={gropuPrivacy}
                      />
                    ) : (
                      <View style={styles.noPostsContainer}>
                        <Text
                          style={{
                            fontSize: 23,
                            color: "Gray",
                            textAlign: "center",
                          }}
                        >
                          {t("Please join to view the contents of")}{" "}
                          {item?.group?.name}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {videosVisible && (
                  <>
                    {gropuPrivacy == "public" || isAdmin || isMember ? (
                      <RenderVideos
                        isAdmin={isAdmin}
                        group_id={id}
                        gropuPrivacy={gropuPrivacy}
                        forceRefresh={forceRefresh}
                        setForceRefresh={setForceRefresh}
                      />
                    ) : (
                      <View style={styles.noPostsContainer}>
                        <Text
                          style={{
                            fontSize: 23,
                            color: "Gray",
                            textAlign: "center",
                          }}
                        >
                          {t("Please join to view the contents of")}{" "}
                          {item?.group?.name}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {membersVisible && (
                  <View>
                    {gropuPrivacy == "public" || isAdmin || isMember ? (
                      <>
                        <View style={styles.memberListheader}>
                          <Text style={styles.membersHeading}>
                            {t("Members")}
                          </Text>
                          <View style={styles.searchMemberCon}>
                            {ICONS.fontAwesome(
                              "search",
                              COLORS.grey,
                              HP(2),
                              styles.searchMemberIcon
                            )}
                            <TextInput
                              value={keyword}
                              style={styles.searchMemberInput}
                              placeholder={t("Search Members")}
                              placeholderTextColor={COLORS.grey}
                              onChangeText={(text) => {
                                setMemberSearch(text);
                              }}
                            />
                          </View>
                        </View>

                        <Divider style={styles.divider} />

                        {groupMembersData && (
                          <TouchableOpacity
                            style={styles.myUserDataProfile}
                            onPress={() => {
                              navigation.navigate("ProfileScreen", {
                                id: groupMembersData?.id,
                              });
                            }}
                          >
                            <Image
                              source={{
                                uri: `${SITE_URL}${groupMembersData?.profile_picture}`,
                              }}
                              style={styles.myUserDataProfileImage}
                            />

                            <View>
                              <Text style={styles.myUserDataName}>
                                {groupMembersData?.first_name}{" "}
                                {groupMembersData?.last_name}
                              </Text>
                              {isAdmin ? (
                                <Text style={styles.marginLeft15}>
                                  {t("Admin")}
                                </Text>
                              ) : (
                                <Text style={styles.marginLeft15}>
                                  {t("Me")}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        )}

                        {isAdmin && (
                          <>
                            <Divider style={styles.divider} />
                            <FlatList
                              keyboardShouldPersistTaps="handled"
                              data={pendingRequests}
                              listKey={(item, index) => index.toString()}
                              style={{ flex: 1 }}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item, index }) => (
                                <RenderMembers
                                  item={item}
                                  isAdmin={isAdmin}
                                  group_encrypted_id={id}
                                  handle={t("Waiting Approval")}
                                  onRefresh={() => onRefresh(true)}
                                />
                              )}
                            />
                          </>
                        )}

                        <Divider style={styles.divider} />
                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          data={admins}
                          listKey={(item, index) => index.toString()}
                          style={{ flex: 1 }}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => (
                            <RenderMembers
                              item={item}
                              isAdmin={isAdmin}
                              group_encrypted_id={id}
                              handle="Admin"
                              onRefresh={() => onRefresh(true)}
                            />
                          )}
                        />

                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          data={friends}
                          listKey={(item, index) => index.toString()}
                          style={{ flex: 1 }}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => (
                            <RenderMembers
                              item={item}
                              isAdmin={isAdmin}
                              group_encrypted_id={id}
                              handle={t("Friend")}
                              onRefresh={() => onRefresh(true)}
                            />
                          )}
                        />
                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          data={others}
                          listKey={(item, index) => index.toString()}
                          style={{ flex: 1 }}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => (
                            <RenderMembers
                              item={item}
                              isAdmin={isAdmin}
                              group_encrypted_id={id}
                              onRefresh={() => onRefresh(true)}
                            />
                          )}
                        />
                      </>
                    ) : (
                      <View style={styles.noPostsContainer}>
                        <Text
                          style={{
                            fontSize: 23,
                            color: "Gray",
                            textAlign: "center",
                          }}
                        >
                          {t("Please join to view the members of")}{" "}
                          {item?.group?.name}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* {mentorshipTabVisible && <MentorshipTab />} */}

                {settingsVisible && (
                  <Settings
                    group_id={id}
                    callback={onRefresh}
                    groupName={groupTLData[0]?.group?.name}
                    privacy={groupTLData[0]?.group?.privacy}
                    visibility={groupTLData[0]?.group?.visible}
                    groupDescription={groupTLData[0]?.group?.description}
                  />
                )}
              </View>
            );
          }}
        />
      ) : loading && token ? (
        <Loader />
      ) : (
        !token && <LogoutUserComponent navigation={navigation} />
      )}

      {isModell ? (
        <ComentModel
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          isModell={isModell}
          setIsModel={setIsModel}
          item3={currentCommentItem}
          data_target={data_target}
          encrypted_id={encrypted_id}
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

      <AddMemberModal
        isVisible={addMemberModalVisible}
        setAddMemberModalVisible={setAddMemberModalVisible}
        groupId={id}
      />

      {iniviteMemberModalVisible && (
        <InviteMemberModal
          isVisible={iniviteMemberModalVisible}
          setAddMemberModalVisible={setIniviteMemberModalVisible}
          groupID={id}
        />
      )}
      {isSavePostModalVisible && (
        <SavePostFeed
          isModalVisible={isSavePostModalVisible}
          setIsSavePostModalVisible={setIsSavePostModalVisible}
          savePost={saved_post}
          data={groupTLData}
          setData={setGroupTLData}
          group={true}
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
    </SafeAreaView>
  );
};
export default GroupsTL;
