import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import FastImage from "react-native-fast-image";
import SimpleToast from "react-native-simple-toast";
import { showMessage } from "react-native-flash-message";
import Clipboard from "@react-native-clipboard/clipboard";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";
import { useRoute, useNavigation } from "@react-navigation/native";

import styles from "../Rooms/components/RoomsTLStyles";
import { useTranslation } from "react-i18next";

import DotsMenu from "./Components/DotsMenu";
import Loader from "../../../Components/Loader";
import NewPost from "../../../Components/NewPost";
import ActionsMenu from "./Components/ActionsMenu";
import ShareModel from "../../../Components/ShareModel";
import ComentModel from "../../../Components/ComentModel";
import LikeComShare from "../../../Components/LikeComShare";
import FirstComment from "../../../Components/FirstComment";
import CreateEventModal from "./Components/CreateEventModal";
import ImageGrid from "../../../Components/ImageGridFlatlist";
import EditPostModal from "../../../Components/EditPostModal";
import InviteStatusModal from "./Components/InviteStatusModal";
import IllustrationModal from "./Components/IllustrartionsModal";
import ImageShowSingle from "../../../Components/ImageShowSingle";
import ExpiresAt from "../../../Components/NewsFeedList/ExpiresAt";
import ImagePickerModal from "../../../Components/ImagePickerModal";
import TaggedPeopleModal from "../../../Components/TaggedPeopleModal";
import InviteMemberModal from "../Groups/Components/InviteMemberModal";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import PostMenuModel from "../../../Components/NewsFeedList/PostMenuModel";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";

import {
  FlatListItemSeparator,
  handleLike,
  handleShare,
  timeDifference,
} from "../../../Components/NewsFeedList/Functions";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import { IMAGES } from "../../../Constants/Images";

import { HP, WP } from "../../../../Utils/Resposive";
import { showImgFunc } from "../../../../Utils/Data";
import { privacy } from "../../../../Utils/PickerDataStatus/privacyData";

import { postStatusApiCall } from "../../../Services/Apis";
import { BASE_URL, SHARE_URL, SITE_URL } from "../../../Services/Constants";

import {
  editPost,
  likeItem,
  deletePost,
  unLikeItem,
  fetchComments,
  showGalleryPosts,
} from "../../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../../Redux/action-types";
import { isRTL } from "../../../../Utils/IsRTL";
import { getEventsList } from "../../../Redux/actions/EventActions";
import SavePostFeed from "../../../Components/SavePost/SavePostFeed";
import LogoutModal from "../../../Components/LogoutModal";
import { deleteApiData } from "../ReminderScreen/Components/remindersApiCall";

const EventTL = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const id = route?.params?.id;
  const fromSplash = route?.params?.fromSplash;
  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [event, setEvent] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [guestsList, setGuestsList] = useState([]);
  const [categories, setCategories] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [myInvitation, setMyInvitatio] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDotsModal, setShowDotsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [duplicateEvent, setDuplicateEvent] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [showInviteStatusModal, setShowInviteStatusModal] = useState(false);
  const [showIllustrationsModal, setShowIllustrationsModal] = useState(false);

  const [postIndex, setPostIndex] = useState();
  const [isModell, setIsModel] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [isPictureModell, setIsPictureModell] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [editPostVisibility, setEditPostVisibility] = useState(false);

  const [localCover, setLocalCover] = useState("");
  const [data_target, setData_target] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [myVideoIndex, setmyVideoIndex] = useState(0);
  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [saved_post, setSavedPost] = useState("");
  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [encrypted_id, setEncrypted_id] = useState("");

  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const [iniviteMemberModalVisible, setIniviteMemberModalVisible] =
    useState(false);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goBack();
        return true;
      }
    );

    const navListener =
      Platform.OS == "ios"
        ? navigation.addListener("blur", (e) => {
            {
              fromSplash &&
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MyTopTabs" }],
                });
            }
          })
        : navigation.addListener("gestureEnd", () => {
            goBack();
            return true;
          });

    return () => {
      backhandler.remove();
      navListener();
    };
  }, []);

  useEffect(() => {
    getEventData();
  }, [page]);

  const getEventData = () => {
    const url = `${BASE_URL}/events/${id}?page=${page}`;
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
            if (page === 1) {
              setPosts(res?.payload?.singlePost?.data);
              setEvent(res?.payload?.event);
              setCreator(res?.payload?.user);
              setCategories(res?.payload?.categories);

              setMyInvitatio(res?.payload?.my_invitation);
              setGuestsList(res?.payload?.event_guest_list);
              setLastPage(res?.payload?.singlePost?.last_page);
              setIsAdmin(res?.payload?.user?.id == userData?.id);
              setLoading(false);
              setLoadingMore(false);
            } else {
              setEvent(res?.payload?.event);
              setCreator(res?.payload?.user);
              setCategories(res?.payload?.categories);
              let data = [...posts, ...res?.payload?.singlePost?.data];
              setPosts(data);
              setMyInvitatio(res?.payload?.my_invitation);
              setGuestsList(res?.payload?.event_guest_list);
              setLastPage(res?.payload?.singlePost?.last_page);
              setIsAdmin(res?.payload?.user?.id == userData?.id);
              setLoading(false);
              setLoadingMore(false);
            }
          } else {
            navigation.goBack();
            setLoading(false);
            showMessage({
              message: res?.message,
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
  };

  const goBack = () => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  };

  const openProfile = (id) => navigation.navigate("ProfileScreen", { id });

  const onRefresh = (fromCover) => {
    if (!fromCover) setRefreshing(true);

    setPage(1);
    if (page === 1) {
      getEventData();
    }
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (!loadingMore && page < lastPage) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  const onCoverPressed = () => {
    if (event?.event_cover_full) {
      navigation.navigate("ImageShowScreen", {
        url: SITE_URL + event?.event_cover_full,
      });
    } else if (event?.event_cover_picture) {
      navigation.navigate("ImageShowScreen", {
        url: SITE_URL + event?.event_cover_picture,
      });
    }
  };

  const sendCoverToServer = async (image, url = undefined) => {
    const coverImg = image?.assets[0] || url;
    const formData = new FormData();

    formData.append("pos", 0);

    if (url) {
      formData.append("cover_image", url);
    } else {
      formData.append("cover", {
        uri: coverImg.uri,
        type: coverImg.type,
        name: coverImg.fileName,
      });
    }

    try {
      const res = await postStatusApiCall({
        route: `events/${id}/re_cover`,
        verb: "POST",
        token: token,
        body: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in sendCoverToServer ... ", res);
      } else if (res.responseCode === 200) {
        dispatch(getEventsList(true));
        setLocalCover(coverImg?.uri || url);
        SimpleToast.show("Cover picture added successfully");
        onRefresh(true);
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const changeCover = () => {
    setShowImagePickerModal(false);
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
  };

  const onChooseIllustrationPress = () => {
    setShowImagePickerModal(false);
    setTimeout(() => setShowIllustrationsModal(true), 500);
  };

  const onEditPress = () => {
    setShowEditModal(true), setDuplicateEvent(false);
  };
  const onDotsPress = () => setShowDotsModal(true);
  const onActionsPress = () => setShowActionsModal(true);
  const onCameraPress = () => setShowImagePickerModal(true);
  const onSeeAllPress = () => setShowInviteStatusModal(true);
  const onInvitePress = () => setIniviteMemberModalVisible(true);

  const onDuplicatePress = () => {
    setDuplicateEvent(true);
    setTimeout(() => {
      setShowEditModal(true);
    }, 0);
  };

  const editEvent = (formData) => {
    if (duplicateEvent) {
      createDuplicateEvent(formData);
      return;
    }

    const url = `${BASE_URL}/events/${id}/update`;

    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            onRefresh(true);
            SimpleToast.show("Event updated successfully");
            dispatch(getEventsList(true));
          } else {
            SimpleToast.show(`${res?.message}`);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("tryCatchError: ", error);
    }
  };

  const createDuplicateEvent = (formData) => {
    const url = `${BASE_URL}/events/store`;
    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            dispatch(getEventsList(true));
            SimpleToast.show("Event created successfully");
            goBack();
          } else {
            SimpleToast.show(`${res?.message}`);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("tryCatchError: ", error);
    }
  };

  const deleteEvent = () => {
    const url = `${BASE_URL}/events/${id}/destroy`;

    try {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res: ", res);
          if (res?.responseCode == 200) {
            SimpleToast.show("Event deleted successfully");
            dispatch(getEventsList(true));

            goBack();
          } else {
            SimpleToast.show(`${res?.message}`);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("tryCatchError: ", error);
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to delete this event?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            deleteEvent();
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };

  const onShareLinkPress = () => {
    let url = `${SHARE_URL}/en/event/${event?.encrypted_id}`;

    Clipboard.setString(url);
    SimpleToast.show("Link copied");
  };

  const inviteResponse = (status) => {
    const url = `${BASE_URL}/events/${id}/invite/response`;

    const formData = new FormData();
    formData.append("status", status);

    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            dispatch(getEventsList(true));
            onRefresh(true);
            SimpleToast.show("Invite status updated");
          } else {
            SimpleToast.show(`${res?.message}`);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("tryCatchError: ", error);
    }
  };

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  const imageModelShow = (item, index, myIndex) => {
    setPostGalleryIndex(myIndex);
    setIsPictureModell(!isPictureModell);
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

  const deleteMyPost = (id) => {
    dispatch(deletePost({ id, token, refresh: () => onRefresh(true) }));
  };

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
  };

  const editMyPost = (id) => {
    dispatch(editPost({ id, token, refresh: () => onRefresh(true) }));
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

      const updatedData = posts.map((item) => {
        if (item?.encrypted_id === saved_post.encrypted_id) {
          return {
            ...item,
            saved_post: [],
          };
        }
        return item;
      });
      setPosts(updatedData);
    }
  };

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

    dispatch(likeItem({ token, formData }));

    let feed = [...posts];
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
    setPosts(feed);
  };

  const unLikeItemFunc = (item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    dispatch(unLikeItem({ token, formData }));

    let feed = [...posts];
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
    setPosts(feed);
  };

  const reactionType = (id, item, index) => {
    const formData = new FormData();
    formData.append("post_id", item.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");

    dispatch(likeItem({ token, formData }));

    let feed = [...posts];
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
    setPosts(feed);
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setData_target(data_target);
    setIsModel(!isModell);

    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  };

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

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

  const renderCover = () => (
    <View>
      <View style={localStyles.topWrapper}>
        <TouchableOpacity style={localStyles.topContainer} onPress={goBack}>
          {ICONS.entypo(
            isRTL ? "chevron-thin-right" : "chevron-thin-left",
            COLORS.black,
            HP(2)
          )}
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={localStyles.topContainer}
            onPress={onCameraPress}
          >
            {ICONS.materialCommunityIcons("camera", COLORS.black, HP(2))}
          </TouchableOpacity>
        )}
      </View>

      <View style={localStyles.bottomWrapper}>
        <View style={localStyles.bottomContainerButton}>
          <Text style={localStyles.topText}>
            {event?.event_type == "public" ? t("Public") : t("Private")}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          {(isAdmin || myInvitation) && (
            <TouchableOpacity
              onPress={onInvitePress}
              style={[
                localStyles.bottomContainerButton,
                { backgroundColor: COLORS.primary },
              ]}
            >
              {ICONS.fontAwesome5("user-plus", COLORS.white, WP(3), {
                marginRight: 5,
              })}

              <Text style={localStyles.topTextWhite}>{t("Invite")}</Text>
            </TouchableOpacity>
          )}

          {isAdmin && <View style={{ marginHorizontal: WP(2) }} />}

          {isAdmin && (
            <TouchableOpacity
              onPress={onEditPress}
              style={[
                localStyles.bottomContainerButton,
                { backgroundColor: COLORS.tooLightGrey },
              ]}
            >
              {ICONS.antDesign("edit", COLORS.black, WP(4), { marginRight: 5 })}
              <Text style={localStyles.topText}>{t("Edit")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={onCoverPressed}>
        <FastImage
          resizeMode="cover"
          style={localStyles.coverImage}
          source={
            localCover
              ? { uri: localCover }
              : event?.event_cover_picture
              ? { uri: `${SITE_URL}${event?.event_cover_picture}` }
              : IMAGES.blankCover
          }
        />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    const inviteResponseId = myInvitation?.response;
    const invitedCount =
      guestsList["-1"]?.length +
      guestsList["0"]?.length +
      guestsList["1"]?.length +
      guestsList["2"]?.length;

    const category = categories?.find(
      (el) => el.category_order == event?.event_category
    )?.category_name;

    return (
      <View>
        {renderCover()}

        <View style={localStyles.infoCardTop}>
          <View>
            <Text numberOfLines={1} style={localStyles.nameText}>
              {event?.event_name}
            </Text>

            <Text numberOfLines={1} style={localStyles.categoryText}>
              {t(category)}
            </Text>
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={localStyles.moreButton}
              onPress={onDotsPress}
            >
              {ICONS.entypo("dots-three-vertical", COLORS.black, 16)}
            </TouchableOpacity>
          )}
        </View>

        <View style={localStyles.infoCardBottom}>
          <View style={localStyles.locationContainer}>
            {ICONS.fontAwesome5("user", "#686868", WP(3), {
              marginRight: 5,
            })}

            <Text numberOfLines={1} style={localStyles.locatoinText}>
              {t("Event By")}{" "}
              <Text
                style={{ color: COLORS.primary }}
                onPress={() => openProfile(creator?.id)}
              >{`${creator?.first_name} ${creator?.last_name}`}</Text>
            </Text>
          </View>

          <View style={localStyles.locationContainer}>
            {ICONS.ionIcons("location-outline", "#686868", HP(2), {
              marginRight: 5,
            })}

            <Text numberOfLines={1} style={localStyles.locatoinText}>
              {event?.event_location}
            </Text>
          </View>

          {event?.dates &&
            event?.dates.map((date, index) => (
              <View key={index} style={localStyles.locationContainer}>
                {index == 0 ? (
                  <FastImage
                    resizeMode="cover"
                    style={localStyles.clock}
                    source={IMAGES.clock}
                  />
                ) : (
                  <View style={localStyles.clock} />
                )}

                <Text numberOfLines={1} style={localStyles.locatoinText}>
                  {moment(date?.start_date).format("DD MMM")}
                  {" at "}
                  {moment(date?.start_date + " " + date?.start_time).format(
                    "hh:mm A"
                  )}{" "}
                  {date?.end_date && date?.start_date != date?.end_date && (
                    <Text>
                      to {moment(date?.end_date).format("DD MMM")}
                      {" at "}
                      {moment(date?.end_date + " " + date?.end_time).format(
                        "hh:mm A"
                      )}
                    </Text>
                  )}
                </Text>
              </View>
            ))}
        </View>

        {myInvitation && (
          <>
            {inviteResponseId == -1 ? (
              <View style={localStyles.infoCardTop}>
                <TouchableOpacity
                  style={localStyles.interestedButton}
                  onPress={() => inviteResponse(0)}
                >
                  <Text style={localStyles.interestedButtonText}>
                    {t("Going")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={localStyles.otherButtons}
                  onPress={() => inviteResponse(1)}
                >
                  <Text style={localStyles.otherButtonsText}>{t("Maybe")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={localStyles.otherButtons}
                  onPress={() => inviteResponse(2)}
                >
                  <Text style={localStyles.otherButtonsText}>
                    {t("Not Interested")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={localStyles.actionsButton}
                onPress={onActionsPress}
              >
                <Text style={localStyles.interestedButtonText}>
                  {inviteResponseId == 0
                    ? t("Going")
                    : inviteResponseId == 1
                    ? t("Maybe")
                    : inviteResponseId == 2
                    ? t("Not Interested")
                    : ""}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Divider bold style={{ marginVertical: HP(1) }} />

        <View style={{ marginHorizontal: WP(2) }}>
          <View style={localStyles.infoCardTop}>
            <Text style={localStyles.inviteStatusText}>
              {t("Invite Status")}
            </Text>
            <Text style={localStyles.otherButtonsText} onPress={onSeeAllPress}>
              {t("See All")}
            </Text>
          </View>

          <View style={{ marginTop: HP(1) }}>
            <View style={localStyles.inviteStatsWrapper}>
              <Text style={localStyles.inviteStatText}>
                {guestsList["0"]?.length}
              </Text>

              <Text style={localStyles.inviteStatText}>
                {guestsList["1"]?.length}
              </Text>

              <Text style={localStyles.inviteStatText}>
                {guestsList["2"]?.length}
              </Text>

              <Text style={localStyles.inviteStatText}>{invitedCount}</Text>
            </View>

            <View style={localStyles.inviteStatsWrapperBottom}>
              <Text style={localStyles.inviteStatTitleText}>{t("Going")}</Text>
              <Text style={localStyles.inviteStatTitleText}>{t("Maybe")}</Text>
              <Text style={localStyles.inviteStatTitleText}>
                {t("Not Interested")}
              </Text>
              <Text style={localStyles.inviteStatTitleText}>
                {t("Invited")}
              </Text>
            </View>
          </View>
        </View>

        <Divider bold style={{ marginVertical: HP(1) }} />

        {event?.event_description && (
          <>
            <View style={{ marginHorizontal: WP(2) }}>
              <View style={localStyles.infoCardTop}>
                <Text style={localStyles.inviteStatusText}>
                  {t("Description")}
                </Text>
              </View>

              <View style={localStyles.dexcriptionContainer}>
                <Text>{event?.event_description}</Text>
              </View>
            </View>

            <Divider bold style={{ marginVertical: HP(2) }} />
          </>
        )}

        {(isAdmin || myInvitation) && (
          <>
            <NewPost
              event
              event_id={event?.id}
              onRefresh={onRefresh}
              event_encrypted_id={id}
              eventType={event?.event_type}
              placeholder={t("What's on your mind, ") + userData?.first_name}
              newsFeed
            />

            <Divider bold style={{ marginVertical: HP(2) }} />
          </>
        )}
      </View>
    );
  };

  const renderTL = ({ item, index }) => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.timelineContainer}>
          <EditPostModal
            visible={editPostVisibility}
            goBack={() => setEditPostVisibility(false)}
            event
            id={event?.id}
            encrypted_ID={id}
            eventType={event?.event_type}
            onRefresh={() => onRefresh(true)}
          />

          <View style={styles.upperTab}>
            <View style={styles.imgAndStatus}>
              <TouchableOpacity onPress={() => openProfile(item?.user?.id)}>
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
                    onPress={() => openProfile(item?.user?.id)}
                  >
                    {item?.user?.first_name} {item?.user?.last_name}{" "}
                    {item.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          {t("is")} {item.feeling_action + " "}
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
                          {t("with")}
                          <Text
                            onPress={() =>
                              openProfile(item?.tagged_users?.[0]?.id)
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
              />

              {isPictureModell && postGalleryIndex == index ? (
                <ImageShowSingle
                  key={item.id}
                  isSinglePictureModell={isPictureModell}
                  setIsSinglePictureModell={setIsPictureModell}
                  index={index}
                  postData={item}
                  currentDimensions={""}
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
            }}
          />

          <LikeComShare
            hideShare={event?.event_type == "public" ? false : true}
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
  };

  const renderFooter = () => {
    return posts?.length == 0 ? (
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
      <Loader />
    ) : null;
  };

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={localStyles.container}>
      <FlatList
        data={posts}
        renderItem={renderTL}
        onEndReachedThreshold={0.1}
        onEndReached={handleEndReached}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        listKey={(_, index) => index.toString()}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => FlatListItemSeparator()}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />

      {showImagePickerModal && (
        <ImagePickerModal
          showOpenImgcamera={false}
          showOpenVidcamera={false}
          galleryImage={changeCover}
          showOpenIllustrations={true}
          visible={showImagePickerModal}
          hideVisible={setShowImagePickerModal}
          illustrationImage={onChooseIllustrationPress}
        />
      )}

      {showIllustrationsModal && (
        <IllustrationModal
          hideVisible={setShowIllustrationsModal}
          changeCover={sendCoverToServer}
        />
      )}

      {showInviteStatusModal && (
        <InviteStatusModal
          guestsList={guestsList}
          openProfile={openProfile}
          hideVisible={setShowInviteStatusModal}
        />
      )}

      {showDotsModal && (
        <DotsMenu
          modalVisible={showDotsModal}
          onDeletePress={onDeletePress}
          setModalVisible={setShowDotsModal}
          onDuplicatePress={onDuplicatePress}
          onShareLinkPress={onShareLinkPress}
        />
      )}

      {showActionsModal && (
        <ActionsMenu
          modalVisible={showActionsModal}
          inviteResponse={inviteResponse}
          setModalVisible={setShowActionsModal}
        />
      )}

      {showEditModal && (
        <CreateEventModal
          event={event}
          edit={!duplicateEvent}
          createEvent={editEvent}
          duplicateEvent={duplicateEvent}
          setShowCreateGroupModal={setShowEditModal}
        />
      )}

      {iniviteMemberModalVisible && (
        <InviteMemberModal
          event
          eventId={id}
          isVisible={iniviteMemberModalVisible}
          setAddMemberModalVisible={(state) => {
            setIniviteMemberModalVisible(state);
            onRefresh(true);
          }}
        />
      )}

      {isModell ? (
        <ComentModel
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          isModell={isModell}
          setIsModel={(data) => {
            setIsModel(data);
            onRefresh(true);
          }}
          data_target={data_target}
          encrypted_id={encrypted_id}
          item3={currentCommentItem}
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

      {isSavePostModalVisible && (
        <SavePostFeed
          isModalVisible={isSavePostModalVisible}
          setIsSavePostModalVisible={setIsSavePostModalVisible}
          savePost={saved_post}
          data={posts}
          setData={setPosts}
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

export default EventTL;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  coverImage: {
    height: HP(35),
  },

  topWrapper: {
    zIndex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",

    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
  },

  bottomWrapper: {
    zIndex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",

    left: 10,
    right: 10,
    bottom: 10,
    position: "absolute",
  },

  bottomContainerButton: {
    width: WP(20),
    padding: WP(2),
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  topContainer: {
    borderRadius: 20,
    paddingVertical: WP(2),
    paddingHorizontal: WP(2),
    backgroundColor: COLORS.white,
  },

  topText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },

  topTextWhite: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },

  infoCardTop: {
    padding: WP(2),
    alignItems: "center",
    flexDirection: "row",
    marginVertical: HP(1),
    marginHorizontal: WP(2),
    justifyContent: "space-between",
  },

  nameText: {
    fontSize: 18,
    maxWidth: WP(80),
    fontWeight: "600",
    color: COLORS.primary,
  },

  moreButton: {
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: COLORS.tooLightGrey,
  },

  categoryContainer: {
    maxWidth: WP(40),
    borderRadius: 20,
    paddingVertical: WP(2),
    paddingHorizontal: WP(2),
    backgroundColor: COLORS.tooLightGrey,
  },

  categoryText: {
    fontSize: 12,
    maxWidth: WP(80),
    marginTop: WP(1),
    fontWeight: "600",
    color: COLORS.black,
  },

  infoCardBottom: {
    padding: WP(1),
    alignItems: "center",
    marginHorizontal: WP(2),
    paddingHorizontal: WP(2),
  },

  locationContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: WP(1),
  },

  locatoinText: {
    fontSize: 14,
    width: WP(85),
    fontWeight: "600",
    color: "#686868",
  },

  clock: {
    width: 12,
    height: 12,
    marginRight: 5,
  },

  interestedButton: {
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: WP(8),
    backgroundColor: COLORS.primary,
  },

  interestedButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },

  otherButtons: {
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: WP(8),
    backgroundColor: COLORS.tooLightGrey,
  },

  otherButtonsText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.black,
  },

  actionsButton: {
    width: WP(35),
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    marginVertical: HP(1),
    marginHorizontal: WP(4),
    backgroundColor: COLORS.primary,
  },

  inviteStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },

  inviteStatsWrapper: {
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },

  inviteStatsWrapperBottom: {
    padding: WP(2),
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inviteStatText: {
    fontSize: 16,
    width: WP(21),
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.white,
    marginHorizontal: WP(1),
  },

  inviteStatTitleText: {
    fontSize: 11,
    width: WP(21),
    fontWeight: "400",
    textAlign: "center",
    color: COLORS.black,
    marginHorizontal: WP(1),
  },

  dexcriptionContainer: {
    marginHorizontal: WP(2),
    paddingHorizontal: WP(2),
  },

  // Timeline
  noPostsContainer: {
    padding: 10,
    width: "80%",
    marginTop: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,

    elevation: 8,
    shadowRadius: 4.65,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
