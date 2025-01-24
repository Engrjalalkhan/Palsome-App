import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Linking,
  FlatList,
  ScrollView,
  BackHandler,
  SafeAreaView,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { Divider, colors } from "react-native-elements";
import FastImage from "react-native-fast-image";
import SimpleToast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Permissions from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import { launchImageLibrary } from "react-native-image-picker";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import timelineStyles from "./timelineStyles";
import Toast from "react-native-simple-toast";
import NewPost from "../../Components/NewPost";
import Button from "../../Components/NewButton";
import { SITE_URL } from "../../Services/Constants";
import ShareModel from "../../Components/ShareModel";
import ComentModel from "../../Components/ComentModel";
import LikeComShare from "../../Components/LikeComShare";
import FirstComment from "../../Components/FirstComment";
import EditPostModal from "../../Components/EditPostModal";
import ImageShowSingle from "../../Components/ImageShowSingle";
import ExpiresAt from "../../Components/NewsFeedList/ExpiresAt";
import ImageGrid from "../../Components/ImageGridFlatlist/index";
import TaggedPeopleModal from "../../Components/TaggedPeopleModal";
import NewsFeedText from "../../Components/NewsFeedList/NewsFeedText";
import PostMenuModel from "../../Components/NewsFeedList/PostMenuModel";
import ShowLikeCommentShare from "../../Components/ShowLikeCommentShare";
import ProfileImagePickerModal from "../../Components/ProfileImagePickerModal";
import FriendPrivacySettingModal from "../../Components/FriendPrivacySettingModal";

import {
  handleLike,
  handleShare,
  timeDifference,
  FlatListItemSeparator,
} from "../../Components/NewsFeedList/Functions";

import {
  editPost,
  likeItem,
  unLikeItem,
  deletePost,
  getTimeline,
  fetchComments,
  showGalleryPosts,
} from "../../Redux/actions/NewsFeedActions";

import {
  handleFriendRequest,
  updateProfilePicture,
} from "../../Redux/actions/ProfileActions";
import { ACTIONS } from "../../Redux/action-types";

import { HP, WP } from "../../../Utils/Resposive";
import { showImgFunc } from "../../../Utils/Data";
import { privacy, tags } from "../../../Utils/PickerDataStatus/privacyData";
import { getFontSize, getHeight, getWidth } from "../../../Utils/NewResponsive";

import { postStatusApiCall } from "../../Services/Apis";

import { ICONS } from "../../Constants/Icons";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import styles from "../../Components/NewsFeedList/styles";
import LogoutUserComponent from "../../Components/LogoutUserComponent";
import SeeStoryProfileModel from "../../Components/SeeStoryProfileModel";
import StoryModel from "../../Components/Stories/InstaStory/src/components/StoryModel";
import { StoryDataSorting } from "../../../Utils/StoryDataSorting";
import { isRTL } from "../../../Utils/IsRTL";
import { deleteApiData } from "../Main/ReminderScreen/Components/remindersApiCall";
import { showMessage } from "react-native-flash-message";
import SavePostFeed from "../../Components/SavePost/SavePostFeed";
import LogoutModal from "../../Components/LogoutModal";
import { onPressTouchBase } from "../../../Utils/TouchBaseNavigation";

const ProfileScreen = ({ route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userId = route.params.id || route?.params;
  const fromSplash = route?.params?.fromSplash;
  const fromTouchbase = route?.params?.fromTouchbase;

  const user = useSelector((state) => state.auth.userData);
  const userData = useSelector((state) => state.auth.userData);
  const timelineData = useSelector((state) => state.blackNewsF.timelineData);

  // console.log("timeLineData===========>>>>", timelineData);

  const token = useSelector((state) => state.auth.userToken);
  const storyData = useSelector((state) => state.newsF.stories);
  const deletePostId = useSelector((state) => state.blackNewsF.deletePostId);
  const my_storyData = useSelector((state) => state.blackNewsF?.setStories);

  const deletePostLoading = useSelector(
    (state) => state.blackNewsF.deletePostLoading
  );
  const editPostLoading = useSelector(
    (state) => state.blackNewsF.editPostLoading
  );
  const createPostLoading = useSelector(
    (state) => state.blackNewsF.createPostLoading
  );

  const editPostId = useSelector((state) => state.blackNewsF.editPostId);
  const [editPostVisibility, setEditPostVisibility] = useState(false);

  const [isModell, setIsModel] = useState(false);

  const [shareModel, setShareModel] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [isPictureModell, setIsPictureModell] = useState(false);
  const [isPictureModellShare, setIsPictureModellShare] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);

  const [postIndex, setPostIndex] = useState();
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [myTimelineData, setmyTimelineData] = useState([]);
  const [concatTimelineData, setConcatTimelineData] = useState([]);
  const [isTimelineData, setIsTimelineData] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [postGalleryIndexShare, setPostGalleryIndexShare] = useState(0);
  const [encrypted_id, setEncrypted_id] = useState("");
  const [currentDimensions, setCurrentDimensions] = useState();
  const [data_target, setData_target] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [inputFocus, setInputFocus] = useState(false);
  const [localDp, setLocalDp] = useState("");
  const [localCover, setLocalCover] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [myVideoIndex, setmyVideoIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPostPrivacyEnabled, setIsPostPrivacyEnabled] = useState(false);
  const [allUserData, setAllDataOfUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserStories, setCurrentUserStories] = useState([]);
  const [saved_post, setSavedPost] = useState("");
  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);
  const [creating, setCreating] = useState(false);

  const userStories = storyData.filter((story) => story.user_id === userId);

  const data = my_storyData?.length > 0 ? my_storyData[0]?.items : null;
  const allSeen = data?.every((item) => item?.seen);

  const [PaginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
  });

  const handleCreateConservation = async (item) => {
    setCreating(true);
    const id = item?.user?.user_id;
    const formData = new FormData();
    formData.append("friend_id", id);
    const res = await postStatusApiCall({
      route: "chat/conversation",
      verb: "POST",
      token: token,
      body: formData,
    });

    if (res.responseCode === 200) {
      onPressTouchBase(item?.user, userData?.id, false, navigation);
      setCreating(false);
    } else {
      setCreating(false);
    }
    return res;
  };

  useEffect(() => {
    setConcatTimelineData([]);
    setCurrentPage(1);
    setmyTimelineData([]);
    dispatch({ type: ACTIONS.CLEAR_TIMELINE });

    dispatch(
      getTimeline({
        userId,
        token,
        currentPage,
        concatTimelineData: [],
        setConcatTimelineData,
        setIsTimelineData,
        setPaginationData,
      })
    );
  }, [userId]);

  useEffect(() => {
    if (deletePostId || editPostId || editPostLoading) {
      onRefresh();
    }
  }, [deletePostId, editPostId, editPostLoading]);

  useEffect(() => {
    onRefresh();
  }, [createPostLoading]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     onRefresh();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    const indexArray = viewableItems.map((viewableItem) => viewableItem?.index);
    setmyVideoIndex(indexArray);
  }, []);

  const _viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const onRefresh = useCallback(() => {
    if (!fromTouchbase) {
      if (isUploading == true) {
        return;
      }
      setRefreshing(true);

      dispatch(
        getTimeline({
          userId,
          token,
          currentPage,
          concatTimelineData,
          setConcatTimelineData,
          setIsTimelineData,
          setPaginationData,
        })
      );
      setRefreshing(false);
    }
  }, [setRefreshing]);

  const currentRoute = useRoute()?.name;

  const handleLoadMore = async () => {
    setIsLoading(true);
    if (PaginationData.current_page < PaginationData.last_page) {
      // If there are more pages to load
      try {
        const nextPage = PaginationData.current_page + 1;
        await dispatch(
          getTimeline({
            userId,
            token,
            currentPage: nextPage,
            concatTimelineData,
            setConcatTimelineData,
            setIsTimelineData,
            setPaginationData,
          })
        );
      } catch (error) {
        console.log("error ", error);
      }
      setIsLoading(false);
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else if (Platform.OS === "android") {
      Linking.openSettings();
    }
  };

  const captureImage = async () => {
    try {
      const result = await Permissions.request(
        Platform.OS === "android"
          ? Permissions.PERMISSIONS.ANDROID.CAMERA
          : Permissions.PERMISSIONS.IOS.CAMERA
      );

      if (result === "blocked") {
        navigation.navigate("CameraBlocked");
        setPickerModalVisibile(false);
      } else if (
        result === "granted" ||
        result === "blocked" ||
        result === "denied" ||
        result === "limited" ||
        result === "unavailable"
      ) {
        ImagePicker.openCamera({
          // cropping: true,
        })
          .then((image) => {
            setLocalDp(image.path);
            let uri = image.path;
            let type = image.mime;
            let ImgName = uri.replace(
              "file:///storage/emulated/0/Android/data/com.palsome/files/Pictures/",
              "camera-image/"
            );
            let name = ImgName;
            const myObject = { uri, type, name };
            const crop = {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            };

            setPickerModalVisibile(false);
            SimpleToast.show(t("Uploading..."));
            sendDpToServer(myObject, crop);
          })
          .catch((error) => {
            if (error.code === "E_PICKER_CANCELLED") {
              return false;
            }
            console.log("Error:", error);
          });
      } else {
        SimpleToast.show("Please enable camera permissions");
        console.log("Camera permission denied");
        openAppSettings();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const sendDpToServer = async (image, crop) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", image);
    formData.append("width", crop.width);
    formData.append("height", crop.height);
    formData.append("x", crop.x);
    formData.append("y", crop.y);
    try {
      const res = await postStatusApiCall({
        route: "crop_avatar",
        verb: "POST",
        token: token,
        body: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in sendDpToServer ... ", res);
      } else if (res.responseCode == 200) {
        console.log("res in sendDpToServer - -", res);
        const changeProfilePicture = res.payload.data.avatar_full;
        dispatch(updateProfilePicture(changeProfilePicture));
        SimpleToast.show(t("Profile picture added successfully"));
        onRefresh();
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const changeDP = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      noData: true,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode === "camera_unavailable") {
        return;
      } else if (response.errorCode === "permission") {
        return;
      } else if (response.errorCode === "others") {
        return;
      } else if (!response.assets || response.assets.length === 0) {
        return;
      }

      console.log("response", response);
      const image = response.assets[0];
      const myObject = {
        uri: image.uri,
        type: image.type,
        name: image.fileName || "image.jpg",
      };
      const crop = {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      };
      setPickerModalVisibile(false);

      SimpleToast.show(t("Uploading..."));
      sendDpToServer(myObject, crop);
      setLocalDp(image.uri);
    });
  };

  const sendCoverToServer = async (image, crop) => {
    setIsUploading(true);
    SimpleToast.show(t("Uploading..."));
    const coverImg = image.assets[0];
    const formData = new FormData();
    formData.append("cover", {
      uri: coverImg.uri,
      type: coverImg.type,
      name: coverImg.fileName,
    });
    formData.append("pos", 0);
    try {
      const res = await postStatusApiCall({
        route: "re_cover",
        verb: "POST",
        token: token,
        body: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in sendCoverToServer ... ", res);
      } else if (res.responseCode === 200) {
        console.log("res in sendCoverToServer - -", res);
        setLocalCover(coverImg.uri);
        SimpleToast.show(t("Cover picture added successfully"));

        onRefresh();
      }
    } catch (error) {
      console.log("err", error);
    }
  };

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
        }
      }
    );
  };

  // const deleteMyPost = (id) => {
  //   dispatch(deletePost({ id, token }));
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
      Toast.show(t("You have been successfully untagged from this post"));
    }
    return res;
  };

  const deleteMyPost = async (id, tag) => {
    if (tag) {
      let filter = concatTimelineData?.find((post) => {
        return post?.encrypted_id === id;
      });
      const res = await unTagUsers(id);
      if (res.responseCode === 200) {
        if (filter) {
          const filteredPosts = concatTimelineData?.filter(
            (post) => post?.encrypted_id !== id
          );
          if (filteredPosts) {
            setConcatTimelineData(filteredPosts);
            return;
          }
        }
      }
    } else {
      dispatch(deletePost({ id, token }));
      const filteredPosts = concatTimelineData?.filter(
        (post) => post?.encrypted_id !== id
      );
      if (filteredPosts) {
        setConcatTimelineData(filteredPosts);
        return;
      }
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

      const updatedData = concatTimelineData.map((item) => {
        if (item?.encrypted_id === saved_post.encrypted_id) {
          return {
            ...item,
            saved_post: [],
          };
        }
        return item;
      });
      setConcatTimelineData(updatedData);
    }
  };

  const openProfileFromFreinds = (userId) => {
    navigation.push(
      currentRoute === "ProfileScreenSettings"
        ? "ProfileScreenSettings"
        : "ProfileScreen",
      {
        id: userId,
      }
    );
  };

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
  };

  const likeItemFunc = async (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...concatTimelineData];
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
    setConcatTimelineData(myArray);
  };

  const unLikeItemFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...concatTimelineData];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
        if (itm?.reaction.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != userId);
          itm.like = like;
        }
        if (itm?.reaction.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != userId);
          itm.heart = heart;
        }
        if (itm?.reaction.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != userId);
          itm.haha = haha;
        }
        if (itm?.reaction.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != userId);
          itm.wow = wow;
        }
        if (itm?.reaction.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != userId);
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
    setConcatTimelineData(myArray);
  };

  const reactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...concatTimelineData];
    let myIndex = myArray.indexOf(item3);

    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
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
    setConcatTimelineData(myArray);
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    console.log("getIDAndDispatch function called", data_target);
    setData_target(data_target);
    setIsModel(!isModell);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  };

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

  const handleOnPressFriendRequest = (props) => {
    const formData = new FormData();
    formData.append("uid", user.id);
    formData.append("do", props.do);
    formData.append(
      "u_id",
      fromTouchbase
        ? timelineData[0]?.user?.user_id
        : myTimelineData[0]?.user?.user_id
    );

    dispatch(
      handleFriendRequest({
        token,
        formData: formData,
        do: props.do,
        setIsModal: setIsModal,
      })
    );

    dispatch(
      getTimeline({
        userId,
        token,
        currentPage,
        concatTimelineData,
        setConcatTimelineData,
        setIsTimelineData,
        setPaginationData,
      })
    );
    setIsTimelineData(false);
    setIsPostPrivacyEnabled(true);
  };

  const handleRemoveFriend = () => {
    Alert.alert(
      t("Are you sure?"),
      `${t("You want to unfriend")} ${timelineData[0]?.user?.first_name}`,
      [
        {
          text: t("Unfriend"),
          onPress: () =>
            handleOnPressFriendRequest({
              do: "friend-remove",
            }),
        },
        {
          text: t("Cancel"),
          onPress: () => console.log("cancelled"),
        },
      ]
    );
  };

  const handleRespondRequest = () => {
    Alert.alert(
      `${t("Respond to")} ${
        fromTouchbase
          ? timelineData?.[0]?.user?.first_name
          : myTimelineData?.[0]?.user?.first_name
      }'${t("s request")}`,
      "",
      [
        {
          text: t("Accept"),
          onPress: () => {
            handleOnPressFriendRequest({
              do: t("friend-accept"),
            });
          },
        },
        {
          text: t("Decline"),
          onPress: () =>
            handleOnPressFriendRequest({
              do: "friend-decline",
            }),
        },
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  };

  useEffect(() => {
    if (!fromTouchbase) {
      dispatch(
        getTimeline({
          userId,
          token,
          currentPage,
          concatTimelineData,
          setConcatTimelineData,
          setIsTimelineData,
          setPaginationData,
        })
      );
    }
  }, [userId, currentPage]);

  useEffect(() => {
    setmyTimelineData(timelineData);
  }, [isTimelineData, userId, newUserName]);

  const onPressTaggedPerson = (item) => {
    openProfileFromFreinds(item.id);
  };

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setmyTimelineData([]);
    }
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
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
            handleBack();
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

  const handleBack = () => {
    if (fromSplash || fromTouchbase) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  };

  const seeProfile = (item) => {
    setModalVisible(false);
    navigation.navigate("ImageshowScreen", {
      url: localDp || SITE_URL + item?.user?.avatar_full,
    });
  };
  const seeStory = (user_id) => {
    setModalVisible(false);
    if (userData?.id === user_id) {
      if (my_storyData?.length) {
        navigation.navigate("myStory", {
          myStoryData: my_storyData,
          index: 0,
        });
      }
    } else {
      const currentUserStory = StoryDataSorting(storyData, user_id);
      const userStories = currentUserStory.filter(
        (story) => story.user_id === user_id
      );

      if (userStories.length > 0) {
        setCurrentUserStories(currentUserStory);
        setTimeout(() => {
          setIsModalOpen(true);
        }, 0);
      }
    }
  };

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

  return (
    <SafeAreaView style={timelineStyles.container}>
      {creating && (
        <View style={timelineStyles.creating}>
          <ActivityIndicator color={COLORS.white} />
          <Text style={timelineStyles.txt}>
            Checking for existing messages (if any)...
          </Text>
        </View>
      )}
      {createPostLoading && (
        <View style={timelineStyles.loading}>
          <Text style={timelineStyles.txt}>{t("Creating your post...")} </Text>
          <ActivityIndicator color={COLORS.white} />
        </View>
      )}
      {editPostLoading && (
        <View style={timelineStyles.loading}>
          <Text style={timelineStyles.txt}>{t("Updating your post...")} </Text>
          <ActivityIndicator color={COLORS.white} />
        </View>
      )}

      {deletePostLoading && (
        <View style={timelineStyles.loading}>
          <Text style={timelineStyles.txt}>{t("Deleting your post...")} </Text>
          <ActivityIndicator color={COLORS.white} />
        </View>
      )}

      <View style={timelineStyles.userNameContainer}>
        <View style={timelineStyles.arrowLeftContainer}>
          <TouchableOpacity
            style={timelineStyles.backButtonWrapper}
            onPress={handleBack}
          >
            <AntDesign
              size={getHeight(3.8)}
              name={isRTL ? "arrowright" : "arrowleft"}
            />
          </TouchableOpacity>
        </View>
        {myTimelineData.length > 0 && (
          <Text style={timelineStyles.userNameText} numberOfLines={1}>
            {fromTouchbase
              ? timelineData[0]?.user?.first_name
              : myTimelineData[0]?.user?.first_name}{" "}
            {fromTouchbase
              ? timelineData[0]?.user?.last_name
              : myTimelineData[0]?.user?.last_name}{" "}
          </Text>
        )}
        <TouchableOpacity
          disabled
          style={{ width: getWidth(15) }}
          onPress={() => {
            navigation.navigate("SearchComponent");
          }}
        >
          {/* {ICONS.ionIcons("search", COLORS.darkGray, 30)} */}
        </TouchableOpacity>
      </View>

      {timelineData.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          data={fromTouchbase ? timelineData : myTimelineData}
          refreshControl={
            <RefreshControl
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ItemSeparatorComponent={() => {
            return <View style={timelineStyles.ItemSeparator} />;
          }}
          renderItem={({ item, index }) => {
            return (
              <>
                {item?.user?.user_id == userId && (
                  <View style={{ flex: 1 }}>
                    <View style={{ height: HP(15) }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ImageshowScreen", {
                            url:
                              localCover || SITE_URL + item?.user?.cover_full,
                          })
                        }
                        disabled={!localCover && !item?.user?.cover_full}
                      >
                        <ImageBackground
                          style={timelineStyles.coverPhoto}
                          source={
                            localCover
                              ? { uri: localCover }
                              : item?.user?.cover_full
                              ? {
                                  uri: SITE_URL + item?.user?.cover_picture,
                                }
                              : IMAGES.blankCover
                          }
                        ></ImageBackground>
                      </TouchableOpacity>
                      {item?.user?.user_id == user?.id ? (
                        <View style={timelineStyles.coverCamera}>
                          <ProfileImagePickerModal
                            visible={pickerModalVisibile}
                            hideVisible={() => setPickerModalVisibile(false)}
                            galleryImage={() => changeDP()}
                            cameraImage={() => captureImage("image")}
                          />
                          <TouchableOpacity onPress={() => changeCover()}>
                            <Icon
                              name="camera"
                              style={{
                                alignSelf: "center",
                              }}
                              size={30}
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                    <View style={timelineStyles.dpContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          const userHasStory = storyData.some(
                            (story) => story.user_id === item?.user?.user_id
                          );

                          if (userData?.id === item?.user?.user_id) {
                            if (my_storyData?.length) {
                              setModalVisible(true);
                            } else {
                              navigation.navigate("ImageshowScreen", {
                                url:
                                  localDp || SITE_URL + item?.user?.avatar_full,
                              });
                            }
                          } else {
                            if (userHasStory) {
                              setModalVisible(true);
                            } else {
                              navigation.navigate("ImageshowScreen", {
                                url:
                                  localDp || SITE_URL + item?.user?.avatar_full,
                              });
                            }
                          }
                        }}
                        // disabled={!localDp && !item?.user?.avatar_full}
                        disabled={
                          userData?.id === item?.user?.user_id
                            ? !localDp &&
                              !item?.user?.avatar_full &&
                              !(my_storyData?.length > 0)
                            : !localDp &&
                              !item?.user?.avatar_full &&
                              !(
                                userStories?.length > 0 &&
                                item?.friendship_status !== "not_friends"
                              )
                        }
                      >
                        <Image
                          style={[
                            timelineStyles.dp,
                            {
                              borderColor:
                                userData?.id === item?.user?.user_id
                                  ? my_storyData?.length
                                    ? allSeen
                                      ? COLORS.grey
                                      : COLORS.primary
                                    : COLORS.white
                                  : userStories?.length &&
                                    !storyData.some(
                                      (story) =>
                                        story.user_id === userId && story.seen
                                    )
                                  ? COLORS.primary
                                  : userStories?.length &&
                                    !storyData.some(
                                      (story) =>
                                        story.user_id === userId && !story.seen
                                    )
                                  ? COLORS.grey
                                  : COLORS.white,
                            },
                          ]}
                          source={
                            localDp
                              ? { uri: localDp }
                              : item?.user?.avatar_full
                              ? {
                                  uri: SITE_URL + item?.user?.avatar_full,
                                }
                              : IMAGES.blankDP
                          }
                        />
                      </TouchableOpacity>

                      {modalVisible && (
                        <SeeStoryProfileModel
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          onPressStory={() => seeStory(item?.user?.user_id)}
                          onPressSeeProfile={() => seeProfile(item)}
                          item={item}
                        />
                      )}

                      {item?.user?.user_id == user?.id ? (
                        <View style={timelineStyles.profileCamera}>
                          <TouchableOpacity
                            onPress={() => setPickerModalVisibile(true)}
                          >
                            <Icon
                              name="camera"
                              style={{
                                alignSelf: "center",
                              }}
                              size={30}
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                    <View style={timelineStyles.userName}>
                      <Text style={timelineStyles.usertext}>
                        {fromTouchbase
                          ? timelineData[0]?.user?.first_name
                          : myTimelineData[0]?.user?.first_name}{" "}
                        {fromTouchbase
                          ? timelineData[0]?.user?.last_name
                          : myTimelineData[0]?.user?.last_name}
                      </Text>
                    </View>
                    {item?.user?.user_id == user.id ? (
                      <View style={{ height: HP(1) }} />
                    ) : (
                      <View style={timelineStyles.btncontaner}>
                        <FriendPrivacySettingModal
                          onClose={() => {
                            isModal;
                          }}
                          isModal={isModal}
                          setIsModal={setIsModal}
                          userId={item?.user?.user_id}
                        />
                        {item?.friendship_status == "friends" ? (
                          <Button
                            text={t("Friends")}
                            icon={"checkmark-outline"}
                            buttonstyle={timelineStyles.btn}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={handleRemoveFriend}
                          />
                        ) : item?.friendship_status == "received" ? (
                          <Button
                            text={t("Respond")}
                            icon={"person-add-sharp"}
                            buttonstyle={timelineStyles.btn}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={handleRespondRequest}
                          />
                        ) : item?.friendship_status == "sent" ? (
                          <Button
                            text={t("Requested")}
                            icon={"arrow-forward"}
                            buttonstyle={timelineStyles.btn}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={() =>
                              handleOnPressFriendRequest({
                                do: "friend-cancel",
                              })
                            }
                          />
                        ) : item.friendship_status == "not_friends" ? (
                          <Button
                            text={t("Add Friend")}
                            icon={"person-add-sharp"}
                            buttonstyle={timelineStyles.btn}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={() => {
                              handleOnPressFriendRequest({
                                do: "friend-add",
                              });
                            }}
                          />
                        ) : null}
                        {item?.friendship_status == "friends" && (
                          <Button
                            text={t("Message")}
                            // icon={"mail"}
                            buttonstyle={[timelineStyles.btn]}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={() => handleCreateConservation(item)}
                          />
                        )}

                        {item?.friendship_status === "friends" ||
                        item?.friendship_status == "sent" ? (
                          <Button
                            text={t("Post Privacy Settings")}
                            // icon={"mail"}
                            buttonstyle={[timelineStyles.btn]}
                            textstyle={timelineStyles.btnText}
                            iconStyle={timelineStyles.iconStyle}
                            pressFunction={() => {
                              console.log("message");
                              setIsModal(true);
                            }}
                          />
                        ) : (
                          item?.friendship_status === "not_friends" ||
                          (isPostPrivacyEnabled ? (
                            <Button
                              text={t("Post Privacy Settings")}
                              // icon={"mail"}
                              buttonstyle={[timelineStyles.btn]}
                              textstyle={timelineStyles.btnText}
                              iconStyle={timelineStyles.iconStyle}
                              pressFunction={() => {
                                console.log("message");
                                setIsModal(true);
                              }}
                            />
                          ) : null)
                        )}
                      </View>
                    )}
                    <Divider />
                    <View style={timelineStyles.aboutProfile}>
                      {item?.user?.gender || myTimelineData[0]?.user?.gender ? (
                        <View
                          style={{ flexDirection: "row", marginTop: HP(1) }}
                        >
                          <Icon
                            name="account-group"
                            style={{ paddingHorizontal: getWidth(2) }}
                            size={20}
                            color="black"
                          />
                          <Text style={{ textTransform: "capitalize" }}>
                            {t("Gender")}:{" "}
                            {t(
                              fromTouchbase
                                ? timelineData[0]?.user?.gender
                                : myTimelineData[0]?.user?.gender
                            )}
                          </Text>
                        </View>
                      ) : null}
                      {item?.user?.marital_status ||
                      timelineData[0]?.user?.marital_status ? (
                        <View
                          style={{ flexDirection: "row", marginTop: HP(1) }}
                        >
                          <Icon
                            name="human-male-female"
                            style={{ paddingHorizontal: getWidth(2) }}
                            size={20}
                            color="black"
                          />
                          <Text style={{ textTransform: "capitalize" }}>
                            {t("Marital Status")}:
                            {t(
                              fromTouchbase
                                ? timelineData[0]?.user?.marital_status
                                : myTimelineData[0]?.user?.marital_status
                            )}
                          </Text>
                        </View>
                      ) : null}

                      {item?.user?.user_id == user?.id ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            buttonstyle={timelineStyles.fullbtn}
                            textstyle={timelineStyles.fullbtnText}
                            text={t("Edit Public Details")}
                            pressFunction={() =>
                              navigation.navigate("ProfileSetting")
                            }
                          />
                        </View>
                      ) : null}
                    </View>
                    <Divider />
                    <View>
                      <View style={timelineStyles.friendContainer}>
                        <View>
                          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            {t("Friends")}
                          </Text>
                          <Text>
                            {item?.friends_count == 0
                              ? t("No friends")
                              : item?.friends_count == 1
                              ? `1 ${t("friend")}`
                              : `${item?.friends_count} ${t("friends")}`}
                          </Text>
                        </View>
                        {item?.user?.user_id == user?.id && (
                          <Button
                            pressFunction={() => {
                              navigation.push(
                                currentRoute === "ProfileScreenSettings"
                                  ? "FindFriendsModalScreenSettings"
                                  : "FindFriendsModalScreen",
                                {
                                  id: userId,
                                }
                              );
                            }}
                            buttonstyle={timelineStyles.fbtn}
                            textstyle={{ color: "white" }}
                            text={t("Find Friends")}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          justifyContent: "space-around",
                          flexDirection: "row",
                        }}
                      >
                        {/* {
                        / -----------------------------friends FlatList-------------------- /
                      } */}
                        <FlatList
                          listKey={item.id}
                          style={timelineStyles.friendFlatlist}
                          numColumns={3}
                          data={item?.friends}
                          ItemSeparatorComponent={() => {
                            return (
                              <View style={timelineStyles.ItemSeparator} />
                            );
                          }}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => openProfileFromFreinds(item.id)}
                                style={timelineStyles.friend}
                              >
                                <FastImage
                                  style={timelineStyles.friendImg}
                                  source={
                                    item.profile_picture
                                      ? {
                                          uri: SITE_URL + item?.profile_picture,
                                        }
                                      : IMAGES.blankDP
                                  }
                                />
                                <Text style={timelineStyles.text}>
                                  {item?.first_name} {item?.last_name}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                      {item?.friends_count !== 0 && (
                        <View style={{ padding: HP(2) }}>
                          <Button
                            buttonstyle={timelineStyles.fullbtn}
                            textstyle={timelineStyles.fullbtnText}
                            text={t("See all friends")}
                            pressFunction={() => {
                              navigation.push(
                                currentRoute === "ProfileScreenSettings"
                                  ? "AllFriendModalScreenSettings"
                                  : currentRoute === "ProfileScreen"
                                  ? "AllFriendModalScreenFriendStack"
                                  : "ProfileScreen",
                                {
                                  id: userId,
                                }
                              );
                            }}
                          />
                        </View>
                      )}
                    </View>
                    <>
                      <Divider />
                      {item?.friendship_status !== "not_friends" && (
                        <View style={timelineStyles.mainview}>
                          <NewPost
                            userdataTimeine={{
                              first_name: item?.user?.first_name,
                              encrypted_id: item?.user?.encrypted_id,
                              id: item?.user?.user_id,
                              profile_Image: item?.user?.avatar_full,
                            }}
                            newsFeed
                          />
                        </View>
                      )}

                      <FlatListItemSeparator />
                    </>
                    <>
                      <View style={timelineStyles.BulletContainer}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <TouchableOpacity
                            style={timelineStyles.tabBullet}
                            onPress={() =>
                              navigation.navigate("UserPhotosScreen", {
                                user: item?.user,
                              })
                            }
                          >
                            <Text style={timelineStyles.tabBulletTxt}>
                              {t("Albums")}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={timelineStyles.tabBullet}
                            onPress={() =>
                              navigation.navigate("UserClipScreen", {
                                user: item?.user,
                              })
                            }
                          >
                            <Text style={timelineStyles.tabBulletTxt}>
                              {t("Clips")}{" "}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={timelineStyles.tabBullet}
                            onPress={() =>
                              navigation.navigate("Museum", {
                                user: item?.user,
                              })
                            }
                          >
                            <Text style={timelineStyles.tabBulletTxt}>
                              {t("Museum")}{" "}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={timelineStyles.tabBullet}
                            onPress={() =>
                              navigation.navigate("Museum", {
                                user: item?.user,
                                gallery: true,
                              })
                            }
                          >
                            <Text style={timelineStyles.tabBulletTxt}>
                              {t("Gallery")}{" "}
                            </Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                      <FlatListItemSeparator />
                    </>
                    {/* {
                    / -------------------- timeline flatlist ------------------ /
                  } */}

                    <FlatList
                      keyboardShouldPersistTaps="handled"
                      onViewableItemsChanged={_onViewableItemsChanged}
                      viewabilityConfig={_viewabilityConfig}
                      data={concatTimelineData}
                      listKey={(item, index) => index.toString()}
                      style={timelineStyles.timelineFlatlist}
                      ItemSeparatorComponent={() => FlatListItemSeparator()}
                      keyExtractor={(item, index) => index.toString()}
                      onEndReachedThreshold={0.1}
                      onEndReached={() => handleLoadMore()}
                      ListFooterComponent={
                        PaginationData?.current_page &&
                        PaginationData.last_page >
                          PaginationData.current_page ? (
                          <ActivityIndicator size="large" color={"#DF4B38"} />
                        ) : (
                          <View style={timelineStyles.noPostsContainer}>
                            <Text style={{ fontSize: 23, color: "grey" }}>
                              {t("No more posts")}
                            </Text>
                          </View>
                        )
                      }
                      renderItem={({ item, index }) => {
                        const expiryTime = moment(
                          item?.post_shared?.expires_at,
                          "YYYYMMDD"
                        )
                          .endOf("day")
                          .fromNow()
                          .includes("ago");
                        return (
                          <View
                            style={{
                              flex: 1,
                              marginVertical: 9,
                              marginHorizontal:
                                item &&
                                item.post_shared &&
                                item.post_shared.post_type == "reel"
                                  ? 10
                                  : item.post_type == "reel"
                                  ? 16
                                  : null,
                              backgroundColor:
                                item.post_type == "reel" ? "black" : null,
                            }}
                          >
                            {editPostVisibility && (
                              <EditPostModal
                                visible={editPostVisibility}
                                goBack={() => setEditPostVisibility(false)}
                              />
                            )}

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor:
                                  item.post_type == "reel"
                                    ? COLORS.black
                                    : null,
                              }}
                            >
                              <View
                                style={[
                                  timelineStyles.imgAndStatus,
                                  {
                                    marginLeft:
                                      item.post_type !== "shared_post"
                                        ? -4
                                        : null,
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    if (userData?.id !== item.user?.id) {
                                      navigation.push("ProfileScreen", {
                                        id: item?.user?.id,
                                      });
                                    }
                                  }}
                                >
                                  <FastImage
                                    style={[
                                      timelineStyles.timelineDp,
                                      {
                                        marginLeft:
                                          item?.post_shared?.post_type !==
                                          "reel"
                                            ? 25
                                            : null,
                                      },
                                    ]}
                                    source={
                                      item?.user?.profile_picture != null
                                        ? {
                                            uri:
                                              SITE_URL +
                                              item?.user?.profile_picture,
                                          }
                                        : IMAGES.blankDP
                                    }
                                  />
                                </TouchableOpacity>

                                <View
                                  style={{
                                    flex: 1,
                                    paddingTop: 10,
                                    paddingBottom: -10,
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      width: "95%",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color:
                                          item.post_type == "reel"
                                            ? COLORS.white
                                            : null,
                                        marginLeft: 10,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textAlignVertical: "center",
                                      }}
                                      onPress={() => {
                                        if (userData?.id !== item.user?.id) {
                                          navigation.push("ProfileScreen", {
                                            id: item?.user?.id,
                                          });
                                        }
                                      }}
                                    >
                                      {item?.user?.first_name}{" "}
                                      {item?.user?.last_name}
                                      {item.feeling_action && (
                                        <>
                                          <Text
                                            style={timelineStyles.action}
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
                                            style={timelineStyles.action}
                                            onPress={() => null}
                                          >
                                            {" "}
                                            {!item.feeling_action && "is "}
                                            {t("with")}
                                            <Text
                                              onPress={() =>
                                                onPressTaggedPerson(
                                                  item?.tagged_users?.[0]
                                                )
                                              }
                                              style={{
                                                fontWeight: "bold",
                                                color: "#DF4B38",
                                              }}
                                            >
                                              {" "}
                                              {
                                                item?.tagged_users?.[0]
                                                  ?.first_name
                                              }{" "}
                                              {
                                                item?.tagged_users?.[0]
                                                  ?.last_name
                                              }{" "}
                                            </Text>
                                            {item?.tagged_users.length > 1 && (
                                              <Text>
                                                {t("and")}
                                                <Text
                                                  style={{
                                                    fontWeight: "bold",
                                                    color: "#DF4B38",
                                                  }}
                                                  onPress={() =>
                                                    onPressTaggedOthers(
                                                      item?.tagged_users
                                                    )
                                                  }
                                                >
                                                  {" "}
                                                  {item?.tagged_users.length -
                                                    1}{" "}
                                                  {t("other")}
                                                  {item?.tagged_users.length -
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
                                      {item.post_type === "profile_picture" ? (
                                        <Text
                                          style={timelineStyles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          {t("updated profile picture")}
                                        </Text>
                                      ) : item.post_type ===
                                        "profile_cover_picture" ? (
                                        <Text
                                          style={timelineStyles.action}
                                          onPress={() => null}
                                        >
                                          {" "}
                                          {t("updated cover picture")}
                                        </Text>
                                      ) : item.post_type === "shared_post" ? (
                                        <Text
                                          style={timelineStyles.action}
                                          onPress={() => null}
                                        >
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
                                      ) : item?.post_map ? (
                                        <Text
                                          onPress={() => null}
                                          style={timelineStyles.mapaction}
                                        >
                                          {" "}
                                          at {item?.post_map}
                                        </Text>
                                      ) : item.post_type == "timeline" ||
                                        item?.post_type === "birthday_post" ? (
                                        item?.user.id !==
                                        item?.wall_user?.id ? (
                                          <>
                                            <Text style={timelineStyles.action}>
                                              {" "}
                                              {t("posted on ")}
                                            </Text>

                                            <Text style={timelineStyles.name}>
                                              {" "}
                                              {item?.wall_user?.first_name}{" "}
                                              {item?.wall_user?.last_name}
                                            </Text>
                                            <Text style={timelineStyles.action}>
                                              {t("'s timeline")}
                                            </Text>
                                          </>
                                        ) : null
                                      ) : null}{" "}
                                      {item?.expires_at &&
                                        item?.user?.id == userData?.id && (
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
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        marginRight: 10,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: COLORS.black,
                                          marginLeft: 10,
                                          color:
                                            item.post_type == "reel"
                                              ? COLORS.white
                                              : null,
                                        }}
                                      >
                                        {timeDifference(item.created_at)}
                                      </Text>

                                      {privacy(item.post_privacy)}
                                      <Text
                                        style={{
                                          color:
                                            item.post_type == "reel"
                                              ? COLORS.black
                                              : COLORS.primary,
                                          left: getWidth(2.5),
                                          textDecorationLine: "underline",
                                        }}
                                      >
                                        {tags(item.post_tag_id)}
                                      </Text>
                                    </View>

                                    {userData.id == item.user.id &&
                                    // item?.post_type == "birthday_post" &&
                                    item.post_type !== "reel" ? (
                                      <View style={{ marginRight: 10 }}>
                                        <PostMenuModel
                                          showConfirmDialog={showConfirmDialog}
                                          editMyPost={editMyPost}
                                          savePost={onPressSavedPost}
                                          unSavePost={onPressUnSavePost}
                                          item3={item}
                                          isProfileCover={
                                            item?.post_type ||
                                            item?.profile_picture
                                          }
                                        />
                                      </View>
                                    ) : item.post_type !== "reel" ? (
                                      <View
                                        style={{
                                          marginRight: 10,
                                        }}
                                      >
                                        <PostMenuModel
                                          showConfirmDialog={showConfirmDialog}
                                          editMyPost={editMyPost}
                                          savePost={onPressSavedPost}
                                          unSavePost={onPressUnSavePost}
                                          item3={item}
                                          isProfileCover={
                                            item?.post_type ||
                                            item?.profile_picture
                                          }
                                          birthday={true}
                                          isAdmin={
                                            item?.user?.id == userData?.id
                                              ? true
                                              : false
                                          }
                                          isTimeLine={
                                            item?.wall_id == userData?.id
                                          }
                                        />
                                      </View>
                                    ) : null}
                                  </View>
                                </View>
                              </View>
                            </View>

                            {item.post_text != null ? (
                              <View
                                style={{
                                  flex: 0.7,
                                  paddingHorizontal: 16,
                                  padding: 5,
                                  paddingLeft: 11,
                                  paddingBottom: 7,
                                  backgroundColor:
                                    item.post_type == "reel"
                                      ? COLORS.black
                                      : null,
                                }}
                              >
                                {item?.pattern == null ? (
                                  <NewsFeedText
                                    color={
                                      item.post_type == "reel"
                                        ? COLORS.white
                                        : null
                                    }
                                    txt={item?.post_text}
                                  />
                                ) : null}
                              </View>
                            ) : null}

                            {item.post_shared !== null &&
                            !expiryTime &&
                            item.post_type === "shared_post" ? (
                              <View
                                style={{
                                  borderWidth: 0.5,
                                  borderColor: "#C0C0C0",
                                  marginRight:
                                    item.post_type === "shared_post" &&
                                    item &&
                                    item.post_shared &&
                                    item.post_shared.post_type !== "reel"
                                      ? 20
                                      : null,
                                  paddingTop: 10,
                                  marginTop: 10,
                                  marginLeft:
                                    item &&
                                    item.post_shared &&
                                    item.post_shared.post_type !== "reel"
                                      ? 20
                                      : null,
                                  backgroundColor:
                                    item &&
                                    item.post_shared &&
                                    item.post_shared.post_type == "reel"
                                      ? COLORS.black
                                      : null,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginLeft: 10,
                                    paddingBottom: 8,
                                    backgroundColor:
                                      item &&
                                      item.post_shared &&
                                      item.post_shared.post_type == "reel"
                                        ? COLORS.black
                                        : null,
                                    marginTop:
                                      item &&
                                      item.post_shared &&
                                      item.post_shared.post_type == "reel"
                                        ? -10
                                        : null,
                                    marginRight:
                                      item.post_type === "shared_post" &&
                                      item &&
                                      item.post_shared &&
                                      item.post_shared.post_type !== "reel"
                                        ? 0
                                        : null,
                                  }}
                                >
                                  {item?.post_shared.post_type ==
                                  "page_post" ? (
                                    <TouchableOpacity
                                      onPress={() =>
                                        SimpleToast.show(
                                          "To view pages, check the website."
                                        )
                                      }
                                    >
                                      <FastImage
                                        style={timelineStyles.timelineDp}
                                        source={
                                          item?.post_shared?.pages?.[0]
                                            ?.page_picture == null
                                            ? IMAGES.blankDP
                                            : {
                                                uri:
                                                  SITE_URL +
                                                  item?.post_shared?.pages?.[0]
                                                    ?.page_picture,
                                              }
                                        }
                                      />
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        openProfileFromFreinds(
                                          item?.post_shared?.user?.id
                                        )
                                      }
                                    >
                                      <FastImage
                                        style={timelineStyles.timelineDp}
                                        source={
                                          item?.post_shared?.user
                                            ?.profile_picture == null
                                            ? IMAGES.blankDP
                                            : {
                                                uri:
                                                  SITE_URL +
                                                  item?.post_shared?.user
                                                    ?.profile_picture,
                                              }
                                        }
                                      />
                                    </TouchableOpacity>
                                  )}

                                  <View style={{ flex: 1 }}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          marginLeft: 10,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 16,
                                            color:
                                              item &&
                                              item.post_shared &&
                                              item.post_shared.post_type ==
                                                "reel"
                                                ? COLORS.white
                                                : COLORS.black,
                                            marginLeft: 10,
                                            fontWeight: "bold",
                                          }}
                                          onPress={() => {
                                            if (
                                              item?.post_shared.post_type !==
                                              "page_post"
                                            ) {
                                              openProfileFromFreinds(
                                                item?.post_shared?.user?.id
                                              );
                                            } else {
                                              SimpleToast.show(
                                                "To view pages, check the website."
                                              );
                                            }
                                          }}
                                        >
                                          {/* ----------------------------------------------------------------------------------------------------- */}
                                          {item?.post_shared?.post_type ==
                                          "page_post"
                                            ? item?.post_shared?.pages?.[0]
                                                ?.page_name
                                            : item?.post_shared?.user
                                                ?.first_name +
                                              " " +
                                              item?.post_shared?.user
                                                ?.last_name}
                                        </Text>
                                        {item?.post_shared?.feeling_action && (
                                          <>
                                            <Text
                                              style={timelineStyles.action}
                                              onPress={() => null}
                                            >
                                              {" "}
                                              {t("is")}{" "}
                                              {
                                                item?.post_shared
                                                  ?.feeling_action
                                              }{" "}
                                              {item?.post_shared?.feeling_value}{" "}
                                              {showImgFunc(
                                                item?.post_shared?.feeling_value
                                              )}
                                            </Text>
                                          </>
                                        )}
                                        {item?.post_shared?.tagged_users
                                          ?.length > 0 && (
                                          <>
                                            <Text
                                              style={[timelineStyles.action]}
                                              onPress={() => null}
                                            >
                                              {" "}
                                              {!item?.post_shared
                                                ?.feeling_action && "is "}
                                              {t("with")}
                                              <Text
                                                style={{
                                                  fontWeight: "bold",
                                                  color: "#DF4B38",
                                                }}
                                                onPress={() =>
                                                  onPressTaggedPerson(
                                                    item?.post_shared
                                                      ?.tagged_users?.[0]
                                                  )
                                                }
                                              >
                                                {" "}
                                                {
                                                  item?.post_shared
                                                    ?.tagged_users?.[0]
                                                    ?.first_name
                                                }{" "}
                                                {
                                                  item?.post_shared
                                                    ?.tagged_users?.[0]
                                                    ?.last_name
                                                }{" "}
                                              </Text>
                                              {item?.post_shared?.tagged_users
                                                .length > 1 && (
                                                <Text>
                                                  {t("and")}
                                                  <Text
                                                    style={{
                                                      fontWeight: "bold",
                                                      color: "#DF4B38",
                                                    }}
                                                    onPress={() =>
                                                      onPressTaggedOthers(
                                                        item?.post_shared
                                                          ?.tagged_users
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    {item?.post_shared
                                                      ?.tagged_users.length -
                                                      1}{" "}
                                                    {t("other")}
                                                    {item?.post_shared
                                                      ?.tagged_users.length -
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
                                            style={[timelineStyles.action]}
                                            onPress={() => null}
                                          >
                                            {" "}
                                            {t("updated profile picture")}
                                          </Text>
                                        ) : item?.post_shared?.post_type ===
                                          "shared_post" ? (
                                          <Text
                                            style={timelineStyles.action}
                                            onPress={() => null}
                                          >
                                            {" "}
                                            {t("has shared a post")}{" "}
                                            {item?.post_shared?.groups[0]?.name
                                              ? `to ${item?.post_shared?.groups[0]?.name}`
                                              : item?.post_shared?.pages[0]
                                                  ?.name
                                              ? `in ${item?.post_shared?.pages[0]?.name}`
                                              : item?.post_shared?.rooms[0]
                                                  ?.name
                                              ? `in ${item?.post_shared?.rooms[0]?.name}`
                                              : item?.post_shared
                                                  ?.shared_user_post?.name
                                              ? `with ${item?.post_shared?.shared_user_post?.name}`
                                              : null}
                                          </Text>
                                        ) : item?.post_shared?.post_map ? (
                                          <Text
                                            onPress={() => null}
                                            style={timelineStyles.mapaction}
                                          >
                                            {" "}
                                            at {item?.post_shared?.post_map}
                                          </Text>
                                        ) : item?.post_shared?.post_type ==
                                            "timeline" &&
                                          item?.post_shared?.user?.id !==
                                            item?.post_shared?.wall_user?.id ? (
                                          <>
                                            <Text style={timelineStyles.action}>
                                              {" "}
                                              {t("posted on ")}
                                            </Text>

                                            <Text style={timelineStyles.name}>
                                              {
                                                item?.post_shared?.wall_user
                                                  ?.first_name
                                              }{" "}
                                              {
                                                item?.post_shared?.wall_user
                                                  ?.last_name
                                              }
                                            </Text>
                                            <Text style={timelineStyles.action}>
                                              {t("'s timeline")}
                                            </Text>
                                          </>
                                        ) : null}{" "}
                                        {item?.post_shared?.expires_at &&
                                          item?.post_shared?.user?.id ==
                                            userData?.id && (
                                            <ExpiresAt
                                              time={
                                                item?.post_shared?.expires_at
                                              }
                                            />
                                          )}
                                      </Text>
                                    </View>
                                    {item &&
                                    item.post_shared &&
                                    item.post_shared.post_type == "reel" ? (
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: COLORS.white,
                                            marginLeft: 10,
                                          }}
                                        >
                                          {timeDifference(
                                            item?.post_shared?.created_at
                                          )}
                                        </Text>
                                      </View>
                                    ) : (
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Text style={timelineStyles.time}>
                                          {timeDifference(
                                            item?.post_shared?.created_at
                                          )}
                                        </Text>
                                        {item?.post_shared?.pages[0] ? (
                                          <>
                                            {privacy(
                                              item?.post_shared?.post_privacy
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {privacy(
                                              item?.post_shared?.post_privacy
                                            )}
                                            <Text style={timelineStyles.tagTxt}>
                                              {tags(
                                                item?.post_shared?.post_tag_id
                                              )}
                                            </Text>
                                          </>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                </View>
                                {item?.post_shared?.post_text != null ? (
                                  <View style={timelineStyles.psted_text}>
                                    {item?.post_shared?.pattern ? null : (
                                      <NewsFeedText
                                        txt={item?.post_shared?.post_text}
                                      />
                                    )}
                                  </View>
                                ) : null}

                                {item?.post_shared?.media?.length > 0 ? (
                                  <View style={{ paddingBottom: 10 }}>
                                    <ImageGrid
                                      data={item?.post_shared?.media}
                                      item3={item}
                                      isModell={isModell}
                                      setIsModel={setIsModel}
                                      handleLike={handleLike}
                                      handleShare={handleShare}
                                      imageModelShow={(item, imgIndex) =>
                                        imageModelShowShare(
                                          item,
                                          imgIndex,
                                          index
                                        )
                                      }
                                      fetchApiForGrid={() =>
                                        fetchApiForGrid(
                                          item?.post_shared?.encrypted_id
                                        )
                                      }
                                      myVideoIndex={myVideoIndex}
                                      NewsFeedIndex={index}
                                      shared={true}
                                      profile={true}
                                    />

                                    <>
                                      {isPictureModellShare &&
                                      postGalleryIndexShare == index ? (
                                        <ImageShowSingle
                                          key={item.id}
                                          isSinglePictureModell={
                                            isPictureModellShare
                                          }
                                          setIsSinglePictureModell={
                                            setIsPictureModellShare
                                          }
                                          index={index}
                                          postData={item?.post_shared}
                                          currentDimensions={currentDimensions}
                                        />
                                      ) : null}
                                    </>
                                  </View>
                                ) : null}

                                {item?.post_shared?.pattern ? (
                                  <View style={timelineStyles.postedView}>
                                    {item?.post_shared?.pattern?.type ==
                                    "image" ? (
                                      <ImageBackground
                                        source={{
                                          uri:
                                            SITE_URL +
                                            "frontend/img/" +
                                            item?.post_shared?.pattern
                                              ?.background_image,
                                        }}
                                        resizeMode="cover"
                                        style={timelineStyles.imageShared}
                                      >
                                        <Text
                                          style={[
                                            timelineStyles.text,
                                            {
                                              color:
                                                item?.post_shared?.pattern
                                                  ?.text_color,
                                            },
                                          ]}
                                        >
                                          {item?.post_shared?.post_text}
                                        </Text>
                                      </ImageBackground>
                                    ) : (
                                      <LinearGradient
                                        colors={[
                                          item?.post_shared?.pattern
                                            ?.background_color_1,
                                          item?.post_shared?.pattern
                                            ?.background_color_2,
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[timelineStyles.colorPostShared]}
                                      >
                                        <Text
                                          style={[
                                            timelineStyles.text,
                                            {
                                              color:
                                                item?.post_shared?.pattern
                                                  ?.text_color,
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
                            ) : item?.post_type === "shared_post" &&
                              (item.post_shared === null || expiryTime) ? (
                              <View style={timelineStyles.noContent}>
                                {ICONS.antDesign("infocirlce", COLORS.grey, 20)}
                                <Text style={{ padding: 5 }}>
                                  {t("This content is not available!")}
                                </Text>
                              </View>
                            ) : item?.post_shared == "null" ? null : null}

                            {item?.media?.length > 0 ? (
                              <>
                                <ImageGrid
                                  data={item.media}
                                  item3={item}
                                  isModell={isModell}
                                  setIsModel={setIsModel}
                                  handleLike={handleLike}
                                  handleShare={handleShare}
                                  imageModelShow={(item, imgIndex) => {
                                    imageModelShow(item, imgIndex, index);
                                  }}
                                  fetchApiForGrid={() =>
                                    fetchApiForGrid(item.encrypted_id)
                                  }
                                  myVideoIndex={myVideoIndex}
                                  NewsFeedIndex={index}
                                />

                                {isPictureModell &&
                                postGalleryIndex == index ? (
                                  <ImageShowSingle
                                    key={item.id}
                                    isSinglePictureModell={isPictureModell}
                                    setIsSinglePictureModell={
                                      setIsPictureModell
                                    }
                                    index={index}
                                    postData={item}
                                    currentDimensions={currentDimensions}
                                  />
                                ) : null}
                              </>
                            ) : null}
                            {item?.pattern ? (
                              <View
                                style={{
                                  marginTop: HP(1),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {item?.pattern.type == "image" ? (
                                  <ImageBackground
                                    source={{
                                      uri:
                                        SITE_URL +
                                        "frontend/img/" +
                                        item?.pattern.background_image,
                                    }}
                                    resizeMode="cover"
                                    style={styles.image}
                                  >
                                    <Text
                                      style={[
                                        styles.text,
                                        { color: item?.pattern.text_color },
                                      ]}
                                    >
                                      {item?.post_text}
                                    </Text>
                                  </ImageBackground>
                                ) : (
                                  <LinearGradient
                                    colors={[
                                      item?.pattern.background_color_1,
                                      item?.pattern.background_color_2,
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[
                                      styles.colorPost,
                                      { width: WP(100) },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.text,
                                        { color: item?.pattern.text_color },
                                      ]}
                                    >
                                      {item?.post_text}
                                    </Text>
                                  </LinearGradient>
                                )}
                              </View>
                            ) : null}
                            {item?.post_type !== "reel" && (
                              <>
                                <ShowLikeCommentShare
                                  postId={item.id}
                                  reaction={item.reaction}
                                  post_reactions_count={
                                    item.post_reactions_count
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
                                  fontColor={"black"}
                                  pressfunction={() => {
                                    getIdAndDispatch(
                                      item.encrypted_id,
                                      item.id,
                                      index,
                                      "comment"
                                    );
                                    setPostIndex(index);
                                    onPressCommentOpen(item);
                                  }}
                                />
                                <View
                                  style={{
                                    backgroundColor:
                                      item.post_type == "reel" ? "white" : null,
                                    paddingVertical:
                                      item.post_type == "reel" ? 10 : null,
                                  }}
                                >
                                  <LikeComShare
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
                                      getIdAndDispatch(
                                        item.encrypted_id,
                                        item.id,
                                        index,
                                        "comment"
                                      );
                                      setPostIndex(index);
                                    }}
                                    sharePress={() => {
                                      setShareModel(!shareModel),
                                        setPostIndex(index);
                                    }}
                                    likesCount={item.post_reactions_count}
                                    commentsCount={
                                      item.comments_count + item.replies_count
                                    }
                                    shareCount={item.shared_post_count}
                                    color={"#DF4B38"}
                                    liked={item.reaction != null ? true : false}
                                    reactionID={
                                      item?.reaction?.reaction_type_id
                                    }
                                    reactionType={(id) =>
                                      reactionType(id, item, index)
                                    }
                                  />
                                </View>
                              </>
                            )}

                            {shareModel && postIndex == index ? (
                              <ShareModel
                                shareModel={shareModel}
                                setShareModel={setShareModel}
                                postId={
                                  item?.post_shared?.id
                                    ? item?.post_shared?.id
                                    : item?.id
                                }
                                item={item}
                              />
                            ) : null}

                            {taggedPeopleModel ? (
                              <TaggedPeopleModal
                                isVisible={taggedPeopleModel}
                                close={() => setTaggedPeopleModel(false)}
                                taggedPeopleList={taggedPeopleList}
                                onPressTaggedPerson={(i) => {
                                  openProfileFromFreinds(i);
                                }}
                              />
                            ) : null}
                            {item?.post_type !== "reel" && (
                              <FirstComment
                                data={item.comments}
                                data_target={data_target}
                                handleOnPresReply={(e) =>
                                  handleOnPresReply(e, item)
                                }
                              />
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
              </>
            );
          }}
        />
      ) : token ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
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

      <StoryModel
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={currentUserStories}
      />
      {isSavePostModalVisible && (
        <SavePostFeed
          isModalVisible={isSavePostModalVisible}
          setIsSavePostModalVisible={setIsSavePostModalVisible}
          savePost={saved_post}
          data={concatTimelineData}
          setData={setConcatTimelineData}
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
export default ProfileScreen;
