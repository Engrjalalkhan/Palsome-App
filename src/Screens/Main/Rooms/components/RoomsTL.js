import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  ImageBackground,
  Dimensions,
  Alert,
  Image,
  RefreshControl,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import moment from "moment/moment";
import styles from "./RoomsTLStyles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  editPost,
  fetchComments,
  likeItem,
  showGalleryPosts,
  unLikeItem,
} from "../../../../Redux/actions/NewsFeedActions";
// import Button from "../../../../Components/NewButton";
import { HP, WP } from "../../../../../Utils/Resposive";
import { Divider } from "react-native-elements";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../../../Services/Constants";
import ImageGrid from "../../../../Components/ImageGridFlatlist/index";
import { ACTIONS } from "../../../../Redux/action-types";
import EditPostModal from "../../../../Components/EditPostModal";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  FlatListItemSeparator,
  handleLike,
  handleShare,
  timeDifference,
} from "../../../../Components/NewsFeedList/Functions";
import {
  privacy,
  tags,
} from "../../../../../Utils/PickerDataStatus/privacyData";
import PostMenuModel from "../../../../Components/NewsFeedList/PostMenuModel";
import ShowLikeCommentShare from "../../../../Components/ShowLikeCommentShare";
import LikeComShare from "../../../../Components/LikeComShare";
import ComentModel from "../../../../Components/ComentModel";
import ShareModel from "../../../../Components/ShareModel";
import FirstComment from "../../../../Components/FirstComment";
import LinearGradient from "react-native-linear-gradient";
import ImageShowSingle from "../../../../Components/ImageShowSingle";
import { useNavigation, useRoute } from "@react-navigation/native";
import { handleFriendRequest } from "../../../../Redux/actions/ProfileActions";
import NewsFeedText from "../../../../Components/NewsFeedList/NewsFeedText";
import ImagePicker from "react-native-image-crop-picker";
import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../../Services/Apis";
import { showImgFunc } from "../../../../../Utils/Data";
import NewPost from "../../../../Components/NewPost";
import TaggedPeopleModal from "../../../../Components/TaggedPeopleModal";
import ButtonCom from "./ButtonCom";
import ViewRoomTabs from "./ViewRoomTabs";
import {
  clearRoomMembersData,
  joinedRoomsRequest,
  leaveRoomRequest,
  myRoomsRequest,
  roomMembersRequest,
  getAlbumsDataRequest,
  clearPhotosData,
  clearAlbumsData,
  getVideosReq,
  clearVideosData,
  showRoomRequest,
} from "../../../../Redux/actions/RoomActions";
import AddMemberModal from "./AddMemberModal";
import RenderMembers from "./RenderMembers";
import { TextInput } from "react-native-gesture-handler";
import Loader from "./Loader";
import RenderAlbums from "./RenderAlbums";
import RenderVideos from "./RenderVideos";
import Settings from "./Settings";
import SimpleToast from "react-native-simple-toast";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";
import { launchImageLibrary } from "react-native-image-picker";
import Dp from "../../../../Components/NewsFeedList/Dp";
import TitleName from "../../../../Components/NewsFeedList/TitleName";
import { WidthScreen } from "../../../../Components/TopBar/Dimensions";
import ExpiresAt from "../../../../Components/NewsFeedList/ExpiresAt";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LogoutUserComponent from "../../../../Components/LogoutUserComponent";
import { isRTL } from "../../../../../Utils/IsRTL";
import { getRoomsList } from "../../../../Redux/actions/EventActions";
import SavePostFeed from "../../../../Components/SavePost/SavePostFeed";
import LogoutModal from "../../../../Components/LogoutModal";
import { deleteApiData } from "../../ReminderScreen/Components/remindersApiCall";
import { showMessage } from "react-native-flash-message";

const RoomsTL = ({ id, alert, fromSplash }) => {
  const room_encrypted_id = id;
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  // console.log('room_encrypted_id', room_encrypted_id);

  const viewRoomData = useSelector((state) => state.roomsRed.showRoomDeatils);
  const createPostLoading = useSelector(
    (state) => state?.blackNewsF?.createPostLoading
  );

  const deletePostLoading = useSelector(
    (state) => state?.blackNewsF?.deletePostLoading
  );
  const editPostLoading = useSelector(
    (state) => state?.blackNewsF?.editPostLoading
  );

  const room_Id_no = viewRoomData[0]?.id;

  const roomMembers = useSelector((state) => state.roomsRed.roomMembers);

  const isAdmin = viewRoomData[0]?.profileHeaderData?.data?.isAdmin;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  //   const userName = route.params.userName;
  const userData = useSelector((state) => state.auth.userData);
  const userName = userData?.first_name;

  const user = useSelector((state) => state.auth.userData);
  const timelineData = useSelector((state) => state.blackNewsF.timelineData);
  const token = useSelector((state) => state.auth.userToken);
  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [isModell, setIsModel] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPictureModell, setIsPictureModell] = useState(false);
  const [isPictureModellShare, setIsPictureModellShare] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const [postIndex, setPostIndex] = useState();
  const [isModal, setIsModal] = useState(false);
  const [myTimelineData, setmyTimelineData] = useState([]);
  const [roomsTLData, setRoomsTLData] = useState([]);
  const [concatTimelineData, setConcatTimelineData] = useState([]);
  const [isTimelineData, setIsTimelineData] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [postGalleryIndex, setPostGalleryIndex] = useState(0);
  const [postGalleryIndexShare, setPostGalleryIndexShare] = useState(0);
  const [encrypted_id, setEncrypted_id] = useState("");
  const [currentDimensions, setCurrentDimensions] = useState();
  const [data_target, setData_target] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [localDp, setLocalDp] = useState("");
  const [localCover, setLocalCover] = useState("");
  const [PaginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const currentRoute = useRoute()?.name;
  const [refreshing, setRefreshing] = useState(false);

  const [homeVisible, setHomeVisible] = useState(false);
  const [albumsVisible, setAlbumsVisible] = useState(false);
  const [videosVisible, setVideosVisible] = useState(false);
  const [membersVisible, setMembersVisible] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [membersFLData, setmembersFLData] = useState(null);
  const [current_page, setCurentPage] = useState(1);
  const [postStatus, setPostStatus] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [saved_post, setSavedPost] = useState("");
  const [isSavePostModalVisible, setIsSavePostModalVisible] = useState(false);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  ///BachHandler///

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
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  };
  {
    token &&
      setTimeout(() => {
        setLoading(false);
        setPostStatus("You are not a member of this room");
      }, 3000);
  }
  const [isSinglePictureModellShare, setIsSinglePictureModellShare] =
    useState(false);

  useEffect(() => {
    if (roomMembers.friends?.concat(roomMembers?.otherMembers)) {
      setmembersFLData(roomMembers.friends?.concat(roomMembers?.otherMembers));
    }
  }, [roomMembers]);

  const setMemberSearch = (text) => {
    if (text === "") {
      setmembersFLData(roomMembers.friends?.concat(roomMembers?.otherMembers));
    }
    if (text.length > 0) {
      const newData = membersFLData.filter((item) => {
        const itemData =
          item?.first_name.toUpperCase() + " " + item?.last_name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setmembersFLData(newData);
    } else {
      setmembersFLData(roomMembers.friends?.concat(roomMembers?.otherMembers));
    }
  };

  useEffect(() => {
    dispatch(
      showRoomRequest({
        token: token,
        id: id,
        setLoading: setLoading,
        setPaginationData: setPaginationData,
        page: current_page,
      })
    );
  }, [createPostLoading]);

  const deleteRoom = () => {
    dispatch(
      leaveRoomRequest({
        id: room_encrypted_id,
        token: token,
        navigation: navigation,
        setLoading,
      })
    );

    //refresing the rooms list
    dispatch(joinedRoomsRequest({ token: token, setLoading }));

    dispatch(myRoomsRequest({ token: token, setLoading }));
  };

  const leaveRoom = () => {
    Alert.alert(
      t("Leave Room"),
      t("Are you sure you want to leave this room?"),
      [
        {
          text: t("Leave"),
          onPress: () => deleteRoom(),
        },
        {
          text: t("Cancel"),
        },
      ]
    );
  };

  const addMember = () => {
    // alert("Add Member");
    setAddMemberModalVisible(true);
  };

  const getData = async () => {
    const res = await withoutStringiApiCall2({
      route: "rooms/" + room_encrypted_id + "?page=" + newPage,
      verb: "GET",
      token: token,
    });
    if (newPage === 1) {
      setData(res.payload.data?.singlePost?.data);
    } else {
      const newData = res?.payload?.data?.singlePost?.data;

      // Filter out posts that are already present in the data array
      const filteredData = newData.filter((newPost) => {
        return !data.some((existingPost) => existingPost.id === newPost.id);
      });

      setData([...data, ...filteredData]);
    }
  };
  useEffect(() => {
    setNewPage(1);
  }, []);
  useEffect(() => {
    getData();
  }, [
    viewRoomData,
    createPostLoading,
    deletePostLoading,
    editPostLoading,
    newPage,
  ]);

  const handleLoadMore = () => {
    if (
      viewRoomData[0]?.singlePost?.current_page !==
      viewRoomData[0]?.singlePost?.last_page
    ) {
      setCurentPage(current_page + 1);

      dispatch(
        showRoomRequest({
          id: room_encrypted_id,
          token: token,
          page: viewRoomData[0]?.singlePost?.current_page + 1,
          // setConcatTimelineData,
        })
      );
    }
  };

  const handleLoadMoreData = () => {
    if (
      viewRoomData[0]?.singlePost?.current_page !==
      viewRoomData[0]?.singlePost?.last_page
    ) {
      setNewPage(newPage + 1);

      dispatch(
        showRoomRequest({
          id: room_encrypted_id,
          token: token,
          page: viewRoomData[0]?.singlePost?.current_page + 1,
          // setConcatTimelineData,
        })
      );
    }
  };

  const sendDpToServer = async (image, crop) => {
    // console.log("image", image);

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
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const deleteMyPost = (id) => {
    dispatch(deletePost({ id, token }));
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

  const openProfileFromFreinds = (userName, id) => {
    // setConcatTimelineData([]);

    setCurrentPage(1);
    // navigation.push(
    //   currentRoute === 'ProfileScreenSettings'
    //     ? 'ProfileScreenSettings'
    //     : 'ProfileScreen',
    //   {
    //     id: id,
    //     userName: userName,
    //   },
    // );
    navigation.navigate("ProfileScreen", {
      id: id,
      userName: userName,
    });

    // setIsTimelineData(false);
  };

  const imageModelShow = (item, index, myIndex) => {
    setPostGalleryIndex(myIndex);

    setIsPictureModell(!isPictureModell);
  };

  const imageModelShowShare = (item, index, myIndex) => {
    setPostGalleryIndexShare(myIndex);
    setIsSinglePictureModellShare(!isSinglePictureModellShare);
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
    console.log("getIDAndDispatch function called");
    setData_target(data_target);
    setIsModel(!isModell);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  };

  const fetchApiForGrid = (id) => {
    console.log("sdsdsdsd");
    dispatch(showGalleryPosts({ token, id }));
  };

  const handleOnPressFriendRequest = (props) => {
    const formData = new FormData();

    formData.append("uid", user.id);
    formData.append("do", props.do);
    formData.append("u_id", myTimelineData[0]?.user?.user_id);

    setIsTimelineData(false);
  };

  const handleRespondRequest = () => {
    Alert.alert(
      `Respond to ${myTimelineData?.[0]?.user?.first_name}s request`,
      "",
      [
        {
          text: "Accept",
          onPress: () => {
            handleOnPressFriendRequest({
              do: "friend-accept",
            });
          },
        },
        {
          text: "Decline",
          onPress: () =>
            handleOnPressFriendRequest({
              do: "friend-decline",
            }),
        },
      ]
    );
  };

  useEffect(() => {
    refreshData();
  }, [createPostLoading, editPostLoading, deletePostLoading]);

  const refreshData = () => {
    dispatch(
      showRoomRequest({
        token,
        id: room_encrypted_id,
      })
    );

    dispatch(
      myRoomsRequest({
        token,
      })
    );
  };

  // route: `rooms/${room_encrypted_id}/re_cover`,

  const sendCoverToServer = async (image, crop) => {
    // setIsUploading(true);
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
        route: `rooms/${room_encrypted_id}/re_cover`,
        verb: "POST",
        token: token,
        body: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in sendCoverToServer ... ", res);
      } else if (res.responseCode === 200) {
        dispatch(getRoomsList(true));
        console.log("res in sendCoverToServer - -", res);
        setLocalCover(coverImg.uri);
        SimpleToast.show("Cover picture added successfully");

        onRefresh();
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  const changeCover = () => {
    console.log("cover");
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        // maxHeight: 100,
        // maxWidth: Dimensions.get("window").width,
        quality: 1,
        // cropping: true,
        cropperCircleOverlay: true,
      },
      (image) => {
        console.log("image - - -", image);
        // SimpleToast.show("Uploading...");
        if (!image.didCancel && !image.error) {
          setLocalCover(image.uri);
          sendCoverToServer(image);
          SimpleToast.show(t("Uploading..."));
        }
      }
    );
  };

  useEffect(() => {
    setmyTimelineData(timelineData);
  }, [isTimelineData, userName, newUserName]);

  useEffect(() => {
    setLoading(true);
    setRoomsTLData(viewRoomData);
  }, [viewRoomData]);

  const onRefresh = () => {
    setRoomsTLData(viewRoomData);
    dispatch(
      showRoomRequest({
        token: token,
        id: id,
        setLoading: setLoading,
        setPaginationData: setPaginationData,
        page: current_page,
      })
    );
  };

  // useLayoutEffect(() => {
  //   Dimensions.addEventListener("change", (e) => {
  //     setCurrentDimensions(e.window);
  //   });
  //   return () => Dimensions.removeEventListener("change");
  // }, [Dimensions]);

  const onPressTaggedPerson = (item) => {
    console.log(item);
    openProfileFromFreinds(item.name);
  };
  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  const onHomePressed = () => {
    setMembersVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setHomeVisible(true);
  };

  const onAlbumsPressed = () => {
    setHomeVisible(false);
    setMembersVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setAlbumsVisible(true);

    dispatch(
      getAlbumsDataRequest({
        token: token,
        room_id: room_encrypted_id,
      })
    );
  };

  const onVideosPressed = () => {
    setHomeVisible(false);
    setMembersVisible(false);
    setAlbumsVisible(false);
    setSettingsVisible(false);
    setVideosVisible(true);
  };

  const onMemberPressed = () => {
    setHomeVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setSettingsVisible(false);
    setMembersVisible(true);

    dispatch(
      roomMembersRequest({
        token,
        room_id: room_encrypted_id,
        setLoading: setLoading,
      })
    );
  };

  const onSettingsPressed = () => {
    setHomeVisible(false);
    setAlbumsVisible(false);
    setVideosVisible(false);
    setMembersVisible(false);
    setSettingsVisible(true);
  };
  const onMuseumPressed = (item) => {
    navigation.navigate("Museum", {
      id: id,
      moduleType: "rooms",
      moduleName: item?.room?.name,
    });
  };
  const onGalleryPressed = (item) => {
    navigation.navigate("Museum", {
      id: id,
      gallery: true,
      moduleType: "rooms",
      moduleName: item?.room?.name,
    });
  };

  useEffect(() => {
    setHomeVisible(true);
    setMembersVisible(false);
  }, []);

  const onCoverPressed = (item) => {
    // console.log("item in onCoverPressed", item?.room?.cover_full);
    if (item?.profileHeaderData?.data?.cover_full !== "") {
      navigation.navigate("ImageshowScreen", {
        url: SITE_URL + item?.room?.cover_full,
      });
    }
  };
  const removeMember = (memberToRemove) => {
    setmembersFLData(
      membersFLData?.filter((member) => member?.encrypted_id !== memberToRemove)
    );
  };

  // useEffect(() => {
  //   setConcatTimelineData(viewRoomData[0]?.singlePost?.data);
  // }, [viewRoomData]);

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
    const expiryTime = moment(item?.post_shared?.expires_at, "YYYYMMDD")
      .endOf("day")
      .fromNow()
      .includes("ago");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.timelineContainer}>
          <EditPostModal
            visible={editPostVisibility}
            goBack={() => setEditPostVisibility(false)}
            room
            id={room_Id_no}
            encrypted_ID={room_encrypted_id}
          />
          <View style={styles.upperTab}>
            <View style={styles.imgAndStatus}>
              <TouchableOpacity
                onPress={() => {
                  openProfileFromFreinds(item?.user?.name, item?.user?.id);
                }}
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
                    {item?.feeling_action && (
                      <>
                        <Text style={styles.action} onPress={() => null}>
                          is {item?.feeling_action}
                          {item.feeling_value}
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
                    {item?.post_type === "room_cover_picture_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {t("updated the room cover photo")}
                      </Text>
                    ) : item?.post_type === "shared_post" ? (
                      <Text style={styles.action} onPress={() => null}>
                        {t("has shared a post")}{" "}
                        {/* Removed the room name condition from here on 21 - 09 - 2023
                        solving the show expiry time and shared post text not appearing bug */}
                        {item?.groups[0]?.name
                          ? `to ${item?.groups[0]?.name}`
                          : item?.pages[0]?.name
                          ? ` in ${item?.pages[0]?.name}`
                          : item?.shared_user_post?.name
                          ? `with ${item?.shared_user_post?.name}`
                          : null}
                      </Text>
                    ) : item?.post_map ? (
                      <Text onPress={() => null} style={styles.mapaction}>
                        at {item?.post_map}
                      </Text>
                    ) : item?.post_type == "timeline" &&
                      item?.user.id !== item?.wall_user?.id ? (
                      <>
                        <Text style={styles.action}>{t("posted on ")}</Text>

                        <Text style={styles.name}>
                          {item?.wall_user?.first_name}{" "}
                          {item?.wall_user?.last_name}
                        </Text>
                        <Text style={styles.action}>{t("'s timeline")}</Text>
                      </>
                    ) : null}{" "}
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
                    <Text style={[styles.time, { flex: 1, textAlign: "left" }]}>
                      {timeDifference(item?.created_at)}
                      {privacy(item?.post_privacy)}
                    </Text>
                    {/* <Text style={[styles.tagTxt, { flex: 1 }]}>
                      {tags(item.post_tag_id)}
                    </Text> */}
                  </View>
                </View>
              </View>
            </View>

            {userData?.id == item?.user?.id && (
              <View
                style={{
                  position: "absolute",
                  right: 20,
                  top: 0,
                  marginTop: 20,
                  // flexDirection: "row",
                }}
              >
                <PostMenuModel
                  showConfirmDialog={showConfirmDialog}
                  editMyPost={editMyPost}
                  item3={item}
                  savePost={onPressSavedPost}
                  unSavePost={onPressUnSavePost}
                />
              </View>
            )}
          </View>
          {item?.post_text != null ? (
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

          {item?.post_shared !== null &&
          !expiryTime &&
          item?.post_type === "shared_post" ? (
            <View style={styles.sharePost}>
              <View style={styles.upperTab}>
                <Dp
                  user={item?.post_shared?.user}
                  pages={item?.post_shared?.pages?.[0]}
                  groups={item?.post_shared?.groups?.[0]}
                  rooms={item?.post_shared?.rooms?.[0]}
                  events={item?.post_shared?.events}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ marginLeft: 10 }}>
                      <TitleName
                        user={item?.post_shared?.user}
                        pages={item?.post_shared?.pages?.[0]}
                        groups={item?.post_shared?.groups?.[0]}
                        rooms={item?.post_shared?.rooms?.[0]}
                        events={item?.post_shared?.events}
                        promote_page={item?.promote_page}
                      />
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
                            {!item?.post_shared?.feeling_action && "is "}with
                            <Text
                              style={{ fontWeight: "bold", color: "#DF4B38" }}
                              onPress={() =>
                                onPressTaggedPerson(
                                  item?.post_shared?.tagged_users?.[0]
                                )
                              }
                            >
                              {" "}
                              {
                                item?.post_shared?.tagged_users?.[0]?.first_name
                              }{" "}
                              {item?.post_shared?.tagged_users?.[0]?.last_name}{" "}
                            </Text>
                            {item?.post_shared?.tagged_users.length && (
                              <Text>
                                {t("and")}
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: "#DF4B38",
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
                                  {item?.post_shared?.tagged_users.length - 1 >
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
                      "room_cover_picture_post" ? (
                        <Text style={styles.action} onPress={() => null}>
                          {" "}
                          {t("updated the room cover photo")}
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
                          <Text style={styles.action}> {t("posted on ")} </Text>

                          <Text
                            onPress={() =>
                              navigation.navigate("ProfileScreen", {
                                id: item?.post_shared?.wall_user?.id,
                              })
                            }
                            style={styles.name}
                          >
                            {/* -------------------------------------------- */}
                            {item?.post_shared?.wall_user?.first_name}{" "}
                            {item?.post_shared?.wall_user?.last_name}
                          </Text>
                          <Text style={styles.action}>{t("'s timeline")}</Text>
                        </>
                      ) : null}{" "}
                      {item?.post_shared?.expires_at &&
                        item?.post_shared?.user?.id == userData?.id && (
                          <ExpiresAt time={item?.post_shared?.expires_at} />
                        )}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.time, { textAlign: "left" }]}>
                      {timeDifference(item?.post_shared?.created_at)}
                    </Text>
                    {privacy(item?.post_privacy)}

                    {item?.post_shared?.pages?.length === 0 ? (
                      <Text style={styles.tagTxt}>
                        {tags(item?.post_shared?.post_tag_id)}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              {item?.post_shared?.post_text != null && (
                <View style={{ paddingBottom: 7, paddingHorizontal: 16 }}>
                  {item?.post_shared?.pattern ? null : (
                    <>
                      <NewsFeedText txt={item?.post_shared?.post_text} />
                    </>
                  )}
                </View>
              )}

              {item?.post_shared?.media?.length ? (
                <>
                  <ImageGrid
                    data={item?.post_shared?.media}
                    item3={item}
                    isModell={isModell}
                    setIsModel={setIsModel}
                    handleLike={handleLike}
                    handleShare={handleShare}
                    onRefresh={onRefresh}
                    imageModelShow={(item, imgIndex) =>
                      imageModelShowShare(item, imgIndex, index)
                    }
                    fetchApiForGrid={() =>
                      fetchApiForGrid(item?.post_shared?.encrypted_id)
                    }
                    shared={true}
                    // myVideoIndex={myVideoIndex}
                    NewsFeedIndex={index}
                    shared_style={styles.sharedPostStyle}
                    room
                  />

                  <>
                    {isSinglePictureModellShare &&
                    postGalleryIndexShare == index ? (
                      <ImageShowSingle
                        key={item?.id}
                        isSinglePictureModell={isSinglePictureModellShare}
                        setIsSinglePictureModell={setIsSinglePictureModellShare}
                        index={index}
                        postData={item?.post_shared}
                        currentDimensions={currentDimensions}
                        onRefresh={onRefresh}
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
                      style={styles.imageShare}
                    >
                      <Text
                        style={[
                          styles.text,
                          { color: item?.post_shared?.pattern?.text_color },
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
                      style={[styles.colorPost]}
                    >
                      <Text
                        style={[
                          styles.text,
                          { color: item?.post_shared?.pattern?.text_color },
                        ]}
                      >
                        {item?.post_shared?.post_text}
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              ) : null}
            </View>
          ) : item?.post_shared?.post_text != null && !expiryTime ? (
            <View style={{ paddingBottom: 7, paddingHorizontal: 16 }}>
              {item?.post_shared?.pattern ? null : (
                <>
                  <NewsFeedText txt={item?.post_shared?.post_text} />
                </>
              )}
            </View>
          ) : item?.post_type === "shared_post" &&
            (item?.post_shared === null || expiryTime) ? (
            <View style={styles.noContent}>
              {ICONS.antDesign("infocirlce", COLORS.grey, 20)}
              <Text style={{ padding: 5 }}>
                {t("This content is not available!")}
              </Text>
            </View>
          ) : item?.post_shared == "null" ? null : null}

          {item?.media?.length ? (
            <View>
              <ImageGrid
                data={item.media}
                room
                item3={item}
                isModell={isModell}
                setIsModel={setIsModel}
                handleLike={handleLike}
                handleShare={handleShare}
                // onRefresh={onRefresh}
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
                  currentDimensions={currentDimensions}
                />
              ) : null}
            </View>
          ) : null}
          {item?.pattern ? (
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
                  style={[styles.colorPost]}
                >
                  <Text
                    style={[styles.text, { color: item?.pattern?.text_color }]}
                  >
                    {item?.post_text}
                  </Text>
                </LinearGradient>
              )}
            </View>
          ) : null}

          <ShowLikeCommentShare
            postId={item?.id}
            reaction={item?.reaction}
            post_reactions_count={item?.post_reactions_count}
            comments_count={item?.comments_count + item?.replies_count}
            shared_post_count={item?.shared_post_count}
            like={item?.like}
            heart={item?.heart}
            haha={item?.haha}
            wow={item?.wow}
            sad={item?.sad}
            angry={item?.angry}
            fontColor={"black"}
            pressfunction={() => {
              getIdAndDispatch(item?.encrypted_id, item?.id, index, "comment");
              setPostIndex(index);
              onPressCommentOpen(item);
            }}
          />

          <LikeComShare
            hideShare
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
              getIdAndDispatch(item.encrypted_id, item?.id, index, "comment");
              setPostIndex(index);
            }}
            sharePress={() => {
              setShareModel(!shareModel), setPostIndex(index);
            }}
            likesCount={item?.post_reactions_count}
            commentsCount={item?.comments_count + item?.replies_count}
            shareCount={item?.shared_post_count}
            color={COLORS.primary}
            liked={item?.reaction != null ? true : false}
            reactionID={item?.reaction?.reaction_type_id}
            reactionType={(id) => reactionType(id, item, index)}
          />

          {shareModel && postIndex == index ? (
            <ShareModel
              shareModel={shareModel}
              setShareModel={setShareModel}
              // onRefresh={onRefresh}
              postId={item.id}
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
          <FirstComment
            data={item?.comments}
            data_target={data_target}
            handleOnPresReply={(e) => handleOnPresReply(e, item)}
          />
        </View>
      </SafeAreaView>
    );
  };

  const renderFooter = () => {
    const singlePost = viewRoomData[0]?.singlePost;

    if (!singlePost || singlePost.total === 0) {
      return (
        <View style={styles.noPostsContainer}>
          <Text style={{ fontSize: 23, color: "Gray" }}>
            {t("No posts yet")}
          </Text>
        </View>
      );
    }
    if (
      singlePost.current_page &&
      singlePost.last_page <= singlePost.current_page &&
      !loading
    ) {
      return (
        <View style={styles.noPostsContainer}>
          <Text style={{ fontSize: 23, color: "Gray" }}>
            {t("No more posts")}
          </Text>
        </View>
      );
    }
    return <ActivityIndicator size={"large"} color={COLORS.primary} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {roomsTLData?.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          onEndReached={() => handleLoadMore()}
          style={{}}
          keyExtractor={(item, index) => index}
          numColumns={3}
          data={roomsTLData}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ItemSeparatorComponent={() => {
            return <View style={styles.ItemSeparator} />;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => onCoverPressed(item)}>
                  {/* room cover image */}
                  <ImageBackground
                    style={styles.coverPhoto}
                    // source={require("../../../../Assets/images/HouseOfCards.png")}
                    source={
                      localCover
                        ? { uri: localCover }
                        : item?.room?.cover_full
                        ? {
                            uri: SITE_URL + item?.room?.cover_photo,
                          }
                        : IMAGES.blankCover
                    }
                    resizeMode="cover"
                  >
                    {/* back Icon */}

                    <TouchableOpacity
                      style={styles.backButtonWrapper}
                      onPress={() => {
                        navigation.goBack();
                        dispatch(clearRoomMembersData());
                        dispatch(clearPhotosData());
                        dispatch(clearAlbumsData());
                        dispatch(clearVideosData());
                      }}
                    >
                      {ICONS.antDesign(
                        isRTL ? "arrowright" : "arrowleft",
                        null,
                        getHeight(3.5)
                      )}
                    </TouchableOpacity>
                  </ImageBackground>
                </TouchableOpacity>
                {/* Change cover Icon */}
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
                {/* Leave and Add Buttons */}
                <View style={styles.topButtonsCon}>
                  {isAdmin && (
                    <ButtonCom title={t("Add")} add onPress={addMember} />
                  )}
                  <ButtonCom title={t("Leave")} leave onPress={leaveRoom} />
                </View>
                {/* Room Name and members */}
                <TouchableOpacity style={styles.roomNameAndTabsCon}>
                  <Text style={styles.roomNameText}>{item?.room?.name}</Text>

                  <View style={styles.roomMembersCon}>
                    {ICONS.ionIcons("lock-closed", COLORS.black, HP(1.6))}
                    <Text style={styles.memberText}>
                      {t("Private")} .{" "}
                      {membersFLData
                        ? membersFLData?.length + 1
                        : item?.room?.members_count}{" "}
                      {t("members")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <FlatListItemSeparator />
                <ViewRoomTabs
                  onHomePressed={onHomePressed}
                  onAlbumsPressed={onAlbumsPressed}
                  onVideosPressed={onVideosPressed}
                  onMemberPressed={onMemberPressed}
                  onSettingsPressed={onSettingsPressed}
                  onMuseumPressed={() => onMuseumPressed(item)}
                  onGalleryPressed={() => onGalleryPressed(item)}
                  isAdmin={isAdmin}
                />
                <FlatListItemSeparator />

                {viewRoomData[0]?.room?.admin_post_only !== 1 &&
                viewRoomData[0]?.is_mute !== 1 &&
                homeVisible &&
                !isAdmin ? (
                  <NewPost
                    placeholder={t("What's on your mind, ") + userName}
                    room
                    room_id={room_Id_no}
                    room_encrypted_id={room_encrypted_id}
                    newsFeed
                  />
                ) : isAdmin && homeVisible ? (
                  <NewPost
                    placeholder={t("What's on your mind, ") + userName}
                    room
                    room_id={room_Id_no}
                    room_encrypted_id={room_encrypted_id}
                    newsFeed
                  />
                ) : viewRoomData[0]?.is_mute == 1 ? (
                  <View style={styles.silentContainer}>
                    <View style={styles.excelStyle}>
                      {ICONS.antDesign(
                        "exclamationcircleo",
                        COLORS.black,
                        (size = 29)
                      )}
                    </View>
                    <Text style={styles.onlyAdminContainer}>
                      {t("You have been muted")}
                    </Text>
                  </View>
                ) : (
                  homeVisible && (
                    <View style={styles.silentContainer}>
                      <View style={styles.excelStyle}>
                        {ICONS.antDesign(
                          "exclamationcircleo",
                          COLORS.black,
                          (size = 29)
                        )}
                      </View>
                      <Text style={styles.onlyAdminContainer}>
                        {t("Only admins can post")}
                      </Text>
                    </View>
                  )
                )}
                <FlatListItemSeparator />
                {/* / -------------------- timeline flatlist ------------------ / */}
                {homeVisible && (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={data}
                    // data={viewRoomData[0]?.singlePost?.data}
                    listKey={(item, index) => index.toString()}
                    style={styles.friendFlatlist}
                    ItemSeparatorComponent={() => FlatListItemSeparator()}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.8}
                    onEndReached={() => handleLoadMoreData()}
                    ListFooterComponent={() => renderFooter()}
                    renderItem={renderTL}
                  />
                )}
                {/* / -------------------- albums ------------------ / */}
                {albumsVisible && (
                  <RenderAlbums
                    isAdmin={isAdmin}
                    room_encrypted_id={room_encrypted_id}
                  />
                )}
                {/* / -------------------- videos flatlist ------------------ / */}
                {videosVisible && (
                  <RenderVideos isAdmin={isAdmin} room_id={room_encrypted_id} />
                )}
                {/* / -------------------- Members flatlist ------------------ / */}

                <>
                  {membersVisible && (
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

                      <View style={styles.myUserDataProfile}>
                        <Image
                          source={{
                            uri: `${SITE_URL}${roomMembers?.my_user_data?.profile_picture}`,
                          }}
                          style={styles.myUserDataProfileImage}
                        />
                        <View>
                          <Text style={styles.myUserDataName}>
                            {roomMembers?.my_user_data?.first_name}{" "}
                            {roomMembers?.my_user_data?.last_name}
                          </Text>
                          {isAdmin ? (
                            <Text style={styles.marginLeft15}>
                              {t("Admin")}
                            </Text>
                          ) : (
                            <Text style={styles.marginLeft15}>{t("Me")}</Text>
                          )}
                        </View>
                      </View>

                      <Divider style={styles.divider} />
                      <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={membersFLData}
                        listKey={(item, index) => index.toString()}
                        style={{ flex: 1 }}
                        // ItemSeparatorComponent={() => FlatListItemSeparator()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <RenderMembers
                            item={item}
                            isAdmin={isAdmin}
                            room_encrypted_id={room_encrypted_id}
                            removeMember={removeMember}
                          />
                        )}
                      />
                    </>
                  )}
                </>

                {/* / -------------------- Settings ------------------ / */}
                {settingsVisible && (
                  <Settings
                    roomName={viewRoomData[0]?.room?.name}
                    roomDescription={viewRoomData[0]?.room?.description}
                    room_id={room_encrypted_id}
                    roomData={viewRoomData}
                  />
                )}
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.noRoomContainer}>
          {/* <Loader /> */}

          {loading && token ? (
            <Loader />
          ) : (
            !token && (
              <LogoutUserComponent
                style={{ bottom: getHeight(18) }}
                navigation={navigation}
              />
            )
          )}
          {roomsTLData?.length === 0 && alert && !loading && (
            <>
              <View style={styles.backButtonWrapperContainer}>
                <View style={styles.backContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.onPressBackStyle}
                  >
                    <Ionicons name="arrow-back" color="white" size={30} />
                  </TouchableOpacity>
                </View>
                <View style={styles.noPostsContainer}>
                  <Text style={styles.noRoomText}>{postStatus}</Text>
                </View>
              </View>
            </>
          )}
        </View>
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
        // close={() => setAddMemberModalVisible(false)}
        roomId={room_encrypted_id}
      />
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
    </SafeAreaView>
  );
};
export default RoomsTL;
