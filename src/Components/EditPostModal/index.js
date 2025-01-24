import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Keyboard,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";

import mime from "mime";
import Button from "../NewButton";
import { useTranslation } from "react-i18next";
import { HP, WP } from "../../../Utils/Resposive";

import IosDatePicker from "../IosDatePicker/IosDatePicker.js";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Picker, Picker as SelectPicker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchColoredPatterns,
  updatePost,
} from "../../Redux/actions/NewsFeedActions";
import ColoredPatterns from "../ColoredPatterns.js";
import BackButtonTwo from "../BackButton/index2";
import SimpleStatus from "../StatusComponents.js/SimpleStatus.js";
import ColoredStatus from "../StatusComponents.js/ColoredStatus";
import ImageStatus from "../StatusComponents.js/ImageStatus";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../Utils/ImageAndCamera";
import ImagePickerModal from "../ImagePickerModal";

import AntDesign from "react-native-vector-icons/AntDesign";

import {
  privacyNewPost,
  privacyData,
  tags,
  tagsData,
} from "../../../Utils/PickerDataStatus/privacyData";
import { imgRegex } from "../../../Utils/Regexes/imgVideoRegex";
import MapBox from "../MapBox";
import Toast from "react-native-simple-toast";
import { settingsApiCall } from "../../Services/Apis";
import { ACTIONS } from "../../Redux/action-types";
import ActivityAndFeeling from "../ActivityAndFeeling";
import { useKeyboard } from "../../../Utils/Hooks/KeyBoardHeight";
import { WidthScreen } from "../TopBar/Dimensions";
import SpecificFriendModal from "../SpecificFriendModal";

import BottomSheet from "reanimated-bottom-sheet";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { SITE_URL } from "../../Services/Constants";
import FastImage from "react-native-fast-image";
import ModalDropdown from "react-native-modal-dropdown";
import { showRoomRequest } from "../../Redux/actions/RoomActions";
import { IMAGES } from "../../Constants/Images";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import moment from "moment/moment.js";
import FlashMessage from "react-native-flash-message";
import ImagePreviewModal from "../ImagePreviewModal/index.js";
import CustomPickerPrivacy from "../PrivacyModel/index.js";
import { Dropdown } from "react-native-element-dropdown";
import { getExpiryData } from "../../Screens/Main/ReminderScreen/Constant/ReminderLocalData/index.js";

const EditPostModal = (props) => {
  const {
    visible,
    goBack,
    room,
    group,
    event,
    id,
    encrypted_ID,
    onRefresh,
    gropuPrivacy,
    eventType,
  } = props;

  let flashRef = React.useRef();
  const { t } = useTranslation();
  const expiry = getExpiryData(t);

  const editPostData = useSelector((state) => state.blackNewsF.editPostData);
  const userData = useSelector((state) => state.auth.userData);
  const [deletedItems, setDeletedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const [searchedFriends, setSearchedFriends] = useState(false);

  const dispatch = useDispatch();
  const myPatterns = useSelector((state) => state.newsF.coloredPatterns);
  const token = useSelector((state) => state.auth.userToken);
  const privacyValues = [
    "public",
    "friends_only",
    "only_me",
    "specific_friends",
  ];

  const [postText, setPostText] = useState("");
  const [disable, setDisable] = useState(true);
  const [showColors, setShowColors] = useState(false);
  const [colorPat, setColorPat] = useState();
  if (typeof colorPat === "undefined" || colorPat === false) {
    setColorPat([]);
  }
  // const [postBackgroundColor, setPostBackgroundColor] = useState();
  const [expiryTime, setExpiryTime] = useState(false);
  const [expirytext, setExpirytext] = useState("");
  const [expirytextFromNow, setExpirytextFromNow] = useState("");
  const [expriyDateModal, setExpriyDateModal] = useState(false);
  const [date, setDate] = useState();
  const [expiryDateDesign, setExpiryDateDesign] = useState(false);
  const [value, setValue] = useState(t("custom"));
  const [tempDate, setTempDate] = useState();
  const [expiryTemptextFromNow, setExpiryTemptextFromNow] = useState("");
  const [expiryTempText, setExpiryTempText] = useState("");
  const [expiryTempTime, setExpiryTempTime] = useState(false);
  const [local, setLocale] = useState(true);

  const [Placeholder, setPlaceholder] = useState(
    `${t("What's on your mind, ")} ${userData?.first_name}`
  );

  const [pattern, setPattern] = useState();
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [multipleImages, setMultipleImages] = useState();
  const [myVisiblePrivacy, setMyVisiblePrivacy] = useState(false);
  const [myVisible, setMyVisible] = useState(false);
  const [privacyPickerValue, setPrivacyPickerValue] = useState(
    editPostData?.post?.post_privacy
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [tagPickerValue, setTagPickerValue] = useState(
    editPostData?.post?.post_tag?.post_tag
  );

  const [colorVisibility, setColorVisibility] = useState(false);
  const [imageVideoVisibility, setImageVideoVisibility] = useState(false);
  const [CheckIn, setCheckIn] = useState(false);
  const [snapURI, setSnapURI] = useState("");
  const [location_label, setLocation_label] = useState();
  const [myImages, setMyImages] = useState([]);
  const [Feeling, setFeeling] = useState(false);
  const [feelingFlatList, setFeelingFlatList] = useState(false);
  const [feeling_action, setFeeling_action] = useState("");
  const [feeling_value, setFeeling_value] = useState("");
  const [feelingFromBackend, setFeelingFromBackend] = useState(false);
  const [specificFrndModal, setSpecificFrndModal] = useState(false);
  const [specificFriends, setSpecificFriends] = useState([]);
  const [userNameValue, setUserNameValue] = useState("");
  const [showImagePath, setShowImagePath] = useState("");

  const [modalVisiblePreview, setModalVisiblePreview] = useState(false);

  const [isFocus, setisFocus] = useState(false);
  const { keyboardHeight, keyboardVisible } = useKeyboard();

  const [isBar, setisBar] = useState(false);
  const selection = "selection";
  const feeling = "feeling";
  const location = "location";
  const TagPeople = "TagPeople";
  const ExpiryDate = "ExpiryDate";

  const [showNonSelectedFriendList, setShowNonSelectedFriendList] = useState(
    []
  );
  const [addSelectedTagFriends, setAddSelectedTagFriends] = useState([]);

  const [page, setPage] = useState(selection);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);
  const [tagFriendsList, setTagFriendsList] = useState([]);
  const [selectedTagFriends, setSelectedTagFriends] = useState([]);
  const userName = useSelector((state) => state.auth.userData.name);

  const imagePickingLimit = 6;
  const snapPoints = useMemo(() => ["30%", "1%"], []);
  const bottomSheetRef = useRef(null);

  let checkIsExpiryPost = editPostData?.post?.expires_at;

  useEffect(() => {
    let date = editPostData?.post?.expires_at;

    if (date) {
      setExpiryTime(true);
      setExpiryTempTime(true);
      setExpiryDateDesign(true);
      setExpirytext(moment(date).format("MM/DD/YYYY"));
      setExpiryTempText(moment(date).format("MM/DD/YYYY"));
      setExpirytextFromNow(moment(date, "YYYYMMDD").endOf("day").fromNow());
    }
  }, [editPostData]);

  useEffect(() => {
    if (visible) {
      if (Platform.OS === "ios") {
        const timer = setTimeout(() => {
          setModalVisible(true);
        }, 500);

        return () => clearTimeout(timer);
      } else {
        setModalVisible(true);
      }
    } else {
      setModalVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const getAndFilterFriends = async () => {
      await GetAllFriends("");
      if (tagFriendsList?.length > 0) {
        setShowNonSelectedFriendList(
          tagFriendsList?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          )
        );
      }
    };
    getAndFilterFriends();
    return () => {
      if (tagFriendsList && selectedTagFriends) {
        setShowNonSelectedFriendList(
          tagFriendsList?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          ) || []
        );
      }
    };
  }, []);

  useEffect(() => {
    memoizedCallback();
  }, [
    postText,
    multipleImages,
    feeling_value,
    location_label,
    selectedTagFriends,
    pattern,
  ]);

  const memoizedCallback = useCallback(() => {
    if (
      postText ||
      multipleImages?.length ||
      feeling_value ||
      selectedTagFriends?.length ||
      location_label
    ) {
      pattern && postText?.length == 0 ? setDisable(true) : setDisable(false);
    } else {
      setDisable(true);
    }
  }, [
    postText,
    multipleImages,

    feeling_value,
    location_label,
    selectedTagFriends,
    pattern,
  ]);
  const submitStatus = async () => {
    setDisable(true);
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", privacyPickerValue);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    privacyPickerValue == "specific_friends"
      ? specificFriends?.map((item, index) => {
          formData.append(`specific_users_ids[${index}]`, item.id);
        })
      : null;
    myImages?.length
      ? myImages?.map((item, index) => {
          if (!deletedItems.includes(item)) {
            formData.append(`files[${index}]`, item);
            if (
              item.type == "mov" ||
              item?.type == "video/mp4" ||
              item?.type == "video/quicktime"
            ) {
              hasVideo = true;
            }
            // if (hasVideo == false) {
            //   hasVideo = item?.type == "video/mp4";
            // }
          }
        })
      : null;
    // console.log("my Images", myImages.length);
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });
    formData.append("tag", tagPickerValue);
    formData.append("colored_pattern", colorPat ? colorPat : null);
    formData.append("handle", "");
    formData.append("textarea", postText || "");
    formData.append("location_img_url", snapURI);
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;

    feeling_action != "" &&
    feeling_action != null &&
    feeling_value !== "" &&
    feeling_value != null
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != "" && feeling_action != null
      ? formData.append("feeling_value", feeling_value)
      : null;

    if (deletedItems.length > 0) {
      // Call the delete media API for all deleted items
      const deletePromises = deletedItems.map((item) =>
        settingsApiCall({
          route: "post_media/" + item?.encrypted_id + "/remove",
          verb: "DELETE",
          token: token,
        })
      );
      await Promise.all(deletePromises);
    }

    // Submit the form
    dispatch(
      updatePost({
        formData: formData,
        token,
        id: editPostData?.post?.encrypted_id,
        videoAdded: hasVideo,
      })
    );
    Toast.show(t("uploading...."));
    goBack();
  };

  const submitRoomPost = async () => {
    setDisable(true);
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", "private");
    formData.append("id", id);
    formData.append("tag", tagPickerValue);
    formData.append("colored_pattern", colorPat);
    formData.append("handle", "room_post");
    formData.append("textarea", postText || "");
    formData.append("location_img_url", snapURI);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;

    feeling_action != "" &&
    feeling_action != null &&
    feeling_value !== "" &&
    feeling_value != null
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != "" && feeling_action != null
      ? formData.append("feeling_value", feeling_value)
      : null;
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });

    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
      if (
        item.type == "mov" ||
        item?.type == "video/mp4" ||
        item?.type == "video/quicktime"
      ) {
        hasVideo = true;
      }
      // if (hasVideo == false) {
      //   hasVideo = item?.type == "video/mp4";
      // }
    });
    if (deletedItems.length > 0) {
      // Call the delete media API for all deleted items
      const deletePromises = deletedItems.map((item) =>
        settingsApiCall({
          route: "post_media/" + item?.encrypted_id + "/remove",
          verb: "DELETE",
          token: token,
        })
      );
      await Promise.all(deletePromises);
    }

    dispatch(
      updatePost({
        formData: formData,
        token,
        id: editPostData?.post?.encrypted_id,
        videoAdded: hasVideo,
        // postHasVideo: hasVideo,
      })
    );
    Toast.show(t("uploading...."));

    setTimeout(() => {
      dispatch(
        showRoomRequest({
          token: token,
          id: encrypted_ID,
        })
      );
    }, 1000);

    goBack();
  };

  const submitGroupPost = async () => {
    console.log("updating from here");
    setDisable(true);
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", gropuPrivacy);
    formData.append("id", id);
    formData.append("tag", tagPickerValue);
    formData.append("colored_pattern", colorPat);
    formData.append("handle", "group_post");
    formData.append("textarea", postText || "");
    formData.append("location_img_url", snapURI);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;

    feeling_action != "" &&
    feeling_action != null &&
    feeling_value !== "" &&
    feeling_value != null
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != "" && feeling_action != null
      ? formData.append("feeling_value", feeling_value)
      : null;
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });

    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
      if (
        item.type == "mov" ||
        item?.type == "video/mp4" ||
        item?.type == "video/quicktime"
      ) {
        hasVideo = true;
      }
      // if (hasVideo == false) {
      //   hasVideo = item?.type == "video/mp4";
      // }
    });
    if (deletedItems.length > 0) {
      // Call the delete media API for all deleted items
      const deletePromises = deletedItems.map((item) =>
        settingsApiCall({
          route: "post_media/" + item?.encrypted_id + "/remove",
          verb: "DELETE",
          token: token,
        })
      );
      await Promise.all(deletePromises);
    }

    dispatch(
      updatePost({
        formData: formData,
        token,
        id: editPostData?.post?.encrypted_id,
        videoAdded: hasVideo,
        refresh: onRefresh,
      })
    );
    Toast.show(t("uploading...."));
    goBack();
  };

  const submitEventPost = async () => {
    setDisable(true);
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", eventType);
    formData.append("id", id);
    formData.append("tag", tagPickerValue);
    formData.append("colored_pattern", colorPat);
    formData.append("handle", "event_post");
    formData.append("textarea", postText || "");
    formData.append("location_img_url", snapURI);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;

    feeling_action != "" &&
    feeling_action != null &&
    feeling_value !== "" &&
    feeling_value != null
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != "" && feeling_action != null
      ? formData.append("feeling_value", feeling_value)
      : null;
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });

    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
      if (
        item.type == "mov" ||
        item?.type == "video/mp4" ||
        item?.type == "video/quicktime"
      ) {
        hasVideo = true;
      }
      // if (hasVideo == false) {
      //   hasVideo = item?.type == "video/mp4";
      // }
    });
    if (deletedItems.length > 0) {
      // Call the delete media API for all deleted items
      const deletePromises = deletedItems.map((item) =>
        settingsApiCall({
          route: "post_media/" + item?.encrypted_id + "/remove",
          verb: "DELETE",
          token: token,
        })
      );
      await Promise.all(deletePromises);
    }

    dispatch(
      updatePost({
        formData: formData,
        token,
        id: editPostData?.post?.encrypted_id,
        videoAdded: hasVideo,
        refresh: onRefresh,
      })
    );
    Toast.show(t("uploading...."));
    goBack();
  };

  const handleColorPat = (item) => {
    setPattern(item);
    // setPostBackgroundColor(item.background_color_2);
    setColorPat(item.id);
    snapURI ? setSnapURI("") : null;
  };

  const setMyPostText = (val) => {
    setPostText(val);
  };

  const showColorsFunc = () => {
    setImageVideoVisibility(true);
    if (myPatterns !== null) {
      setShowColors(true);
    } else {
      dispatch(fetchColoredPatterns(token));
      setShowColors(true);
    }
  };

  const captureImage = async (contentType) => {
    setColorVisibility(true);
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled camera picker");
          setColorVisibility(false);
          return;
        } else if (response.errorCode == "camera_unavailable") {
          console.log("Camera not available on device");
          setColorVisibility(false);
          return;
        } else if (response.errorCode == "permission") {
          console.log("Permission not satisfied");
          setColorVisibility(false);
          return;
        } else if (response.errorCode == "others") {
          console.log(response.errorMessage);
          setColorVisibility(false);
          return;
        }

        afterMediaSelected(response.assets);
        setPickerModalVisibile(false);

        if (response.assets.length) {
          let temp = response.assets.map((item, index) => {
            return {
              uri: item.uri,
              type:
                Platform.OS === "ios" &&
                response?.assets[0]?.type == "video/quicktime"
                  ? "mov"
                  : Platform.OS === "android" &&
                    response?.assets[0]?.type == "video/mp4"
                  ? "video/mp4"
                  : response?.assets[0]?.type == "image/jpg"
                  ? "jpg"
                  : (Platform.OS === "ios" &&
                      response?.assets[0]?.type == "image/jpg") ||
                    response?.assets[0]?.type == "image/png" ||
                    response?.assets[0]?.type == "heic"
                  ? "heic"
                  : response?.assets[0]?.type,
              name: item.fileName,
            };
          });
          setMultipleImages(multipleImages.concat(temp));
          setMyImages(myImages.concat(temp));

          // snapURI ? setSnapURI("") : null;
        }
      });
    }
  };

  const chooseImageGallery = () => {
    setColorVisibility(true);

    let options = {
      mediaType: "mixed",
      quality: 1,
      noData: true,

      selectionLimit: imagePickingLimit - multipleImages?.length,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera picker");
        setColorVisibility(false);
        return;
      } else if (response.errorCode == "camera_unavailable") {
        console.log("Camera not available on device");
        setColorVisibility(false);
        return;
      } else if (response.errorCode == "permission") {
        console.log("Permission not satisfied");
        setColorVisibility(false);
        return;
      } else if (response.errorCode == "others") {
        console.log(response.errorMessage);
        setColorVisibility(false);
        return;
      }

      setPickerModalVisibile(false);

      if (response.assets.length) {
        let temp = response.assets.map((item, index) => {
          return {
            uri: item.uri.match(imgRegex) ? item.uri : item.uri,
            type:
              Platform.OS === "ios" && item?.type == "video/quicktime"
                ? "mov"
                : Platform.OS === "android" && item?.type == "video/mp4"
                ? "video/mp4"
                : item?.type == "image/jpg"
                ? "jpg"
                : item?.type == "image/png"
                ? "jpg"
                : (Platform.OS === "ios" && item?.type == "image/jpg") ||
                  item?.type == "image/png" ||
                  item?.type == "heic"
                ? "heic"
                : item?.type,
            name: item.uri.match(imgRegex)
              ? item.fileName
              : item.fileName + ".mp4",
          };
        });

        if (temp.length + multipleImages.length > imagePickingLimit) {
          Toast.show(
            `only ${imagePickingLimit} media items are allowed`,
            Toast.SHORT
          );
          return;
        } else {
          afterMediaSelected(response.assets);
          setMultipleImages(multipleImages.concat(temp));

          setMyImages(myImages.concat(temp));
          // snapURI ? setSnapURI("") : null;
        }
      }
    });
  };

  const afterMediaSelected = async (media) => {
    let img = false;
    let vid = false;

    await media.map((med) => {
      let type = med.type.split("/")[0];

      if (type == "image") img = true;
      else if (type == "video") vid = true;
    });

    if (img && vid) setPlaceholder(t("Say something about this..."));
    else if (multipleImages.length) {
      let hasImages = await multipleImages.some((el) => {
        const type = mime.getType(el?.path || el.uri).split("/")[0];
        return type == "image";
      });

      let hasVideos = await multipleImages.some((el) => {
        const type = mime.getType(el?.path || el.uri).split("/")[0];
        return type == "video";
      });

      if (hasImages && hasVideos)
        setPlaceholder(t("Say something about this..."));
      else if (img && hasImages)
        setPlaceholder(t("Say something about these images..."));
      else if (vid && hasVideos)
        setPlaceholder(t("Say something about these videos..."));
      else setPlaceholder(t("Say something about this..."));
    } else {
      if (img && media.length == 1)
        setPlaceholder(t("Say something about this image..."));
      else if (img && media.length > 1)
        setPlaceholder(t("Say something about these images..."));
      else if (vid && media.length == 1)
        setPlaceholder(t("Say something about this video..."));
      else if (vid && media.length > 1)
        setPlaceholder(t("Say something about these videos..."));
      else
        setPlaceholder(`${t("What's on your mind, ")} ${userData?.first_name}`);
    }
  };

  const setPrivacyPicker = (val) => {
    setPrivacyPickerValue(val);
  };

  const deleteItems = (item, map) => {
    if (map === "map") {
      const mapItem = multipleImages.find(
        (item) => item.original_name === "map"
      );
      setDeletedItems([...deletedItems, mapItem]);
      const newImages = multipleImages?.filter(
        (i) => i?.encrypted_id !== mapItem?.encrypted_id
      );
      setMultipleImages(newImages);
      setSnapURI("");
    } else {
      setDeletedItems([...deletedItems, item]);
      const newImages = multipleImages?.filter(
        (i) => i?.encrypted_id !== item?.encrypted_id || i.uri !== item?.uri
      );
      setMultipleImages(newImages);
      setSnapURI("");
      let hasImages = newImages?.some((el) => {
        const type = mime?.getType(el?.uri || el?.path)?.split("/")[0];
        return type == "image";
      });

      let hasVideos = newImages.some((el) => {
        const type = mime?.getType(el?.uri || el?.path)?.split("/")[0];
        return type == "video";
      });

      if (hasImages && hasVideos)
        setPlaceholder(t("Say something about this..."));
      else if (hasImages && newImages.length == 1)
        setPlaceholder(t("Say something about this image..."));
      else if (hasImages && newImages.length > 1)
        setPlaceholder(t("Say something about these images..."));
      else if (hasVideos && newImages.length == 1)
        setPlaceholder(t("Say something about this video..."));
      else if (hasVideos && newImages.length > 1)
        setPlaceholder(t("Say something about these videos..."));
      else
        setPlaceholder(`${t("What's on your mind, ")} ${userData?.first_name}`);
    }
  };

  const onPressImage = (item) => {
    setShowImagePath(item);
    setModalVisiblePreview(true);
  };

  const setAllData = () => {
    // console.log("edit post data", editPostData?.post?.specific_friends);
    setPostText(editPostData?.post?.post_text);
    setMultipleImages(editPostData?.post?.media);
    setInitialPlaceholder(editPostData?.post?.media);
    editPostData?.post?.media.length ? setColorVisibility(true) : null;
    editPostData?.post?.pattern ? setImageVideoVisibility(true) : null;
    setPrivacyPickerValue(editPostData?.post?.post_privacy);
    editPostData?.post?.specific_friends
      ? setSpecificFriends(editPostData?.post?.specific_friends)
      : null;
    setTagPickerValue(editPostData?.post?.post_tag_id);
    editPostData?.post?.feeling_action ? setFeelingFromBackend(true) : null;
    setFeeling_action(editPostData?.post?.feeling_action);
    setFeeling_value(editPostData?.post?.feeling_value);
    setSelectedTagFriends(editPostData?.post?.tagged_users);
    if (editPostData?.post?.media[0]?.post_file_type === "post") {
      setCheckIn(false);
      setSnapURI(editPostData?.post?.media[0]?.path);
      setLocation_label(editPostData?.post?.post_map);
    }
    if (editPostData?.post?.media[0]?.post_file_type !== "post") {
      if (editPostData?.post?.post_map) {
        setCheckIn(false);

        setLocation_label(editPostData?.post?.post_map);
      }
    }

    if (editPostData?.post?.pattern) {
      setShowColors(true);
      setImageVideoVisibility(true);
      if (editPostData?.post?.pattern.type == "image") {
        setPattern(editPostData?.post?.pattern);
        setColorPat(editPostData?.post?.pattern?.id);
      } else {
        // setPostBackgroundColor(editPostData?.post?.pattern?.background_color_2);
        setColorPat(editPostData?.post?.pattern?.id);
        setPattern(editPostData?.post?.pattern);
      }
    }
  };

  const setInitialPlaceholder = (media) => {
    let hasImages = media?.some((el) => {
      const type = mime.getType(el?.path)?.split("/")[0];
      return type == "image";
    });

    let hasVideos = media?.some((el) => {
      const type = mime.getType(el?.path)?.split("/")[0];
      return type == "video";
    });

    if (hasImages && hasVideos)
      setPlaceholder(t("Say something about this..."));
    else if (hasImages && media.length == 1)
      setPlaceholder(t("Say something about this image..."));
    else if (hasImages && media.length > 1)
      setPlaceholder(t("Say something about these images..."));
    else if (hasVideos && media.length == 1)
      setPlaceholder(t("Say something about this video..."));
    else if (hasVideos && media.length > 1)
      setPlaceholder(t("Say something about these videos..."));
    else
      setPlaceholder(`${t("What's on your mind, ")} ${userData?.first_name}`);
  };

  const setFellingAction = (val) => {
    setFeeling_action(val);
  };

  const setFellingValue = (val) => {
    setFeeling_value(val);
  };

  const feelingFlatListTogle = () => {
    setFeelingFlatList(!feelingFlatList);
  };

  const feelingToogle = () => {
    // Feeling ? setFeelingFlatList(false) : setFeelingFlatList(true);
    // setFeeling(!Feeling);
    setPage(feeling);

    setisBar(true);
  };

  const onPressCloseColorPatterns = () => {
    setShowColors(false);
    setPattern(),
      // setPostBackgroundColor();
      setColorPat(false);
    setImageVideoVisibility(false);
  };

  useEffect(() => {
    setAllData();
    return () => {
      setPostText(null);
      setMultipleImages(null);
      setCheckIn(false);
      // setSnapURI("");
      setLocation_label(null);
      setShowColors(false);
      setColorPat();
      // setPostBackgroundColor();
      setPattern();
      setFeeling_action("");
      setFeeling_value("");
    };
  }, [editPostData]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (multipleImages && multipleImages.length) {
      setColorVisibility(true);
      setImageVideoVisibility(multipleImages.length >= imagePickingLimit);
    } else {
      setColorVisibility(false);
    }
  }, [multipleImages, imagePickingLimit]);

  const onPressCheckIn = () => {
    setPage(location);
    setCheckIn(true);
  };

  const hideFeelings = () => {
    // console.log("sd");
    setFeeling(false);
    setFeelingFlatList(false);
    setisFocus(false);
    setPage(selection);
  };

  const onCloseBottomSheet = () => {
    setisBar(true);
    // bottomSheetRef.current.snapTo(1);
  };

  const onPressBack = () => {
    if (page == feeling) {
      setPage(selection);
    } else if (page == TagPeople) {
      setPage(selection);
      // setTagFriendsList([]);
    } else if (page == location) {
      setPage(selection);
      setCheckIn(false);
    } else if (page === ExpiryDate) {
      setPage(selection);
    } else {
      goBack();
      dispatch({ type: ACTIONS.SET_POST, editPostData: null });
    }
  };

  const [lineHeight, setLineHeight] = useState(0);
  const [linesUsed, setLinesUsed] = useState(0);

  const onLayout = (e) => {
    if (lineHeight < e.nativeEvent.layout.height) {
      setLinesUsed(linesUsed + 1);
    }
    if (lineHeight > e.nativeEvent.layout.height) {
      setLinesUsed(linesUsed - 1);
    }
    setLineHeight(e.nativeEvent.layout.height);
  };

  const onLinesIncreased = () => {
    pattern
      ? Toast.show(
          t(
            "Text must not be more than more than 7 lines to fit in the color post."
          ),
          Toast.SHORT
        )
      : null;
    imageVideoVisibility ? setImageVideoVisibility(false) : null;
    showColors ? setShowColors(false) : null;
    pattern ? setPattern() : null,
      // postBackgroundColor ? setPostBackgroundColor() : null;
      colorPat ? setColorPat(false) : null;
    colorVisibility ? setColorVisibility(false) : null;
    console.log("more then 7");
  };

  const onLinesDecreased = () => {
    // setImageVideoVisibility(false);
    // setShowColors(false);
    // setPattern(),setPostBackgroundColor();
    // setColorPat(false);
    // setColorVisibility(false);
    // console.log("less then 7");
  };

  useEffect(() => {
    linesUsed > 7 ? onLinesIncreased() : onLinesDecreased();
  }, [linesUsed]);

  const getFriends = async (val) => {
    setUserNameValue(val);
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        route: room
          ? `users/get-friends/for-tag-in-post?handle=room_post&id=${id}&limit=${10}&query=${val}`
          : group
          ? `users/get-friends/for-tag-in-post?handle=group_post&id=${id}&page=${currentPage}&limit=${10}`
          : event
          ? `users/get-friends/for-tag-in-post?handle=event_post&id=${id}&page=${currentPage}&limit=${10}`
          : `users/get-friends/for-tag-in-post?query=${val}&limit=${100}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ...... ", res);
      } else {
        setSearchedFriends(res?.payload?.data?.users?.data);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    } finally {
      setLoadingFriendsList(false);
    }
  };

  const GetAllFriends = async () => {
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        // route: `timeline/${userData?.id}/friends?page=${currentPage}`,
        route: room
          ? `users/get-friends/for-tag-in-post?handle=room_post&id=${id}&page=${currentPage}&limit=${10}`
          : group
          ? `users/get-friends/for-tag-in-post?handle=group_post&id=${id}&page=${currentPage}&limit=${10}`
          : event
          ? `users/get-friends/for-tag-in-post?handle=event_post&id=${id}&page=${currentPage}&limit=${10}`
          : `users/get-friends/for-tag-in-post?limit=${10}&page=${currentPage}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
        setLoadingFriendsList(false);
      } else if (res.responseCode == 200) {
        if (currentPage == 1) {
          setFriends(res?.payload?.data?.users?.data);
        } else {
          setFriends((prevData) =>
            (prevData || []).concat(res?.payload?.data?.users?.data || [])
          );
          setLoadingFriendsList(false);
        }

        setLoadingFriendsList(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  useEffect(() => {
    GetAllFriends();
  }, [room, group, event, currentPage]);

  useEffect(() => {
    if (page === "TagPeople") {
      getFriends("");
    }
  }, [page, userName, token]);

  useEffect(() => {
    if (tagFriendsList.length > 0) {
      const filteredFriends = tagFriendsList?.filter(
        (friend) =>
          !selectedTagFriends?.some(
            (selectedFriend) => friend.id === selectedFriend.id
          )
      );
      setShowNonSelectedFriendList(filteredFriends);
    }
  }, [tagFriendsList, selectedTagFriends]);

  useEffect(() => {
    const getAndFilterFriends = async () => {
      await GetAllFriends("");
      if (searchedFriends?.length > 0) {
        setShowNonSelectedFriendList(
          friends?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          )
        );
      }
    };

    getAndFilterFriends();

    return () => {
      if (searchedFriends && selectedTagFriends) {
        setShowNonSelectedFriendList(
          friends?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          ) || []
        );
      }
    };
  }, []);
  useEffect(() => {
    if (searchedFriends.length > 0) {
      const filteredFriends = searchedFriends.filter(
        (friend) =>
          !selectedTagFriends?.some(
            (selectedFriend) => friend?.id === selectedFriend?.id
          )
      );
      setShowNonSelectedFriendList(filteredFriends);
    }
  }, [friends, selectedTagFriends, searchedFriends]);

  const onPressTagPeople = () => {
    setPage(TagPeople);
    // getFriends("");
  };

  const onPressAddExpiry = () => {
    setPage(selection);
  };

  const handleOnPressTagFriendsItem = (selectedFriend) => {
    const isFriendSelected = selectedTagFriends.some(
      (friend) => friend.id === selectedFriend.id
    );
    if (isFriendSelected) {
      setSelectedTagFriends((prevSelected) =>
        prevSelected.filter((friend) => friend.id !== selectedFriend.id)
      );
    } else {
      setSelectedTagFriends((prevSelected) => [
        ...prevSelected,
        selectedFriend,
      ]);
    }
  };

  const handleOnPressTagFriendsItemCross = (i) => {
    setSelectedTagFriends(
      selectedTagFriends.filter((item) => item.id !== i.id)
    );
    tagFriendsList.some((e) => e.id == i.id)
      ? null
      : setTagFriendsList([...tagFriendsList, i]);
  };

  const handleOnPressCrossSelectedTags = () => {
    setSelectedTagFriends([]);

    GetAllFriends("");
  };

  const handleSpecificFriends = (value) => {
    if (value == "specific_friends") {
      myVisiblePrivacy ? setMyVisiblePrivacy(false) : null;
      specificFrndModal ? null : setSpecificFrndModal(true);
    }
  };

  const onPressAddTags = () => {
    setAddSelectedTagFriends([...selectedTagFriends]);
    setPage(selection);
    // setTagFriendsList([]);
  };

  useEffect(() => {
    let tempDate = editPostData?.post?.expires_at;
    if (tempDate instanceof Date && !isNaN(tempDate)) {
      setDate(tempDate);
    } else if (typeof tempDate === "string") {
      let dateObject = new Date(tempDate);
      if (!isNaN(dateObject)) {
        setDate(dateObject);
      } else {
        console.error("Invalid date string:", tempDate);
      }
    } else {
      console.error("Invalid date format:", tempDate);
    }
  }, [editPostData]);

  const setDefaultExpiryTime = () => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 3);
    setDate(currentDate);

    currentDate = currentDate.toISOString().split("T")[0];
    let tempDate = new Date(currentDate);
    let fDate =
      ("0" + (tempDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + tempDate.getDate()).slice(-2) +
      "/" +
      tempDate.getFullYear();

    setExpirytext(fDate);
    setExpiryDateDesign(true);

    setExpirytextFromNow(
      moment(currentDate, "YYYYMMDD").endOf("day").fromNow()
    );
  };

  const onChange = (event, selectedDate) => {
    if (event.type == "set") {
      setExpriyDateModal(false);

      let tempDate = new Date(selectedDate);
      let fDate =
        ("0" + (tempDate.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + tempDate.getDate()).slice(-2) +
        "/" +
        tempDate.getFullYear();

      // setExpirytext(fDate);
      setExpiryTempText(fDate);
      // setDate(selectedDate);
      setTempDate(selectedDate);

      setExpiryTemptextFromNow(
        moment(tempDate, "YYYYMMDD").endOf("day").fromNow()
      );
      setExpiryDateDesign(true);
      // setExpirytextFromNow(moment(tempDate, "YYYYMMDD").endOf("day").fromNow());
    } else setExpriyDateModal(false);
  };

  const onIosDateChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    // setDate(currentDate);
    setTempDate(currentDate);

    let tempDate = new Date(currentDate);

    let fDate =
      ("0" + (tempDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + tempDate.getDate()).slice(-2) +
      "/" +
      tempDate.getFullYear();

    // setExpirytext(fDate);
    setExpiryTempText(fDate);

    setExpiryDateDesign(true);
    // setExpirytextFromNow(moment(tempDate, "YYYYMMDD").endOf("day").fromNow());
    setExpiryTemptextFromNow(
      moment(tempDate, "YYYYMMDD").endOf("day").fromNow()
    );
  };
  const getPickerValueFromDate = (expiryDate, expiryTime) => {
    if (!expiryDate || !expiryTime) return t("museum");

    const currentDate = new Date();
    const monthsDifference =
      (expiryDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (expiryDate.getMonth() - currentDate.getMonth());

    const pickerValues = {
      1: t("1"),
      3: t("3"),
      6: t("6"),
      9: t("9"),
      12: t("year"),
    };

    return pickerValues[monthsDifference] || t("custom");
  };

  const calculateExpiryDate = (monthsToAdd) => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
    return currentDate;
  };

  const setExpiryFunc = () => {
    setTempDate(date);
    setExpiryTemptextFromNow(expirytextFromNow);
    setExpiryTempText(expirytext);
    setExpiryTempTime(expiryTime);

    if (!local) {
      const pickerValue = getPickerValueFromDate(date, expiryTime);
      setValue(pickerValue);
    }

    setPage(ExpiryDate);
  };

  useEffect(() => {
    const defaultValue = checkIsExpiryPost === null ? t("museum") : t("custom");
    setValue(defaultValue);
    setExpiryTempTime(checkIsExpiryPost !== null);
  }, [checkIsExpiryPost, editPostData]);

  const onDropdownChange = (itemValue) => {
    setValue(itemValue);

    if (itemValue === t("museum")) {
      setExpiryTempTime(false);
      return;
    }

    setExpiryTempTime(true);

    const monthsMap = {
      [t("1")]: 1,
      [t("3")]: 3,
      [t("6")]: 6,
      [t("9")]: 9,
      [t("year")]: 12,
    };

    if (itemValue === t("custom")) {
      setExpriyDateModal(true);
      setExpiryTempText("");
      setTempDate(date);
      setExpiryDateDesign(false);
      const currentDate = new Date();

      if (Platform.OS === "android") {
        onChange({ type: "set" }, currentDate);
      } else {
        onIosDateChange(currentDate);
      }

      setDefaultExpiryTime();
      return;
    }

    if (monthsMap[itemValue]) {
      const newDate = calculateExpiryDate(monthsMap[itemValue]);
      setLocale(false);

      if (Platform.OS === "android") {
        onChange({ type: "set" }, newDate);
      } else {
        onIosDateChange(newDate);
      }
    } else {
      setExpiryTempText("");
      setTempDate(new Date());
      setExpiryTemptextFromNow("");
      setExpiryDateDesign(false);
    }
  };

  const onPressDoneExpiry = () => {
    setDate(tempDate);
    setExpirytextFromNow(expiryTemptextFromNow);
    setExpirytext(expiryTempText);
    setExpiryTime(expiryTempTime);
    setPage(selection);
  };

  const selectedPrivacyOption = privacyData.find(
    (i) => i.value === privacyPickerValue
  );

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

  return (
    <>
      <Modal
        animationType={Platform.OS === "android" ? "fade" : "fade"}
        onRequestClose={() => onPressBack()}
        visible={modalVisible}
        style={{ margin: 0 }}
        avoidKeyboard
        propagateSwipe
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { marginTop: insets?.top }]}>
            {page == selection ? (
              <View style={styles.container}>
                {!isBar && (
                  <BottomSheet
                    ref={bottomSheetRef}
                    onCloseEnd={onCloseBottomSheet}
                    snapPoints={snapPoints}
                    renderHeader={() => (
                      <TouchableOpacity
                        onPress={onCloseBottomSheet}
                        style={{
                          alignSelf: "center",
                          backgroundColor: COLORS.white,
                          width: "100%",
                          alignItems: "center",
                        }}
                        activeOpacity={1}
                      >
                        {ICONS.antDesign("circledowno", COLORS.black, 25)}
                      </TouchableOpacity>
                    )}
                    renderContent={() => (
                      <View style={styles.contentContainer}>
                        {!imageVideoVisibility ? (
                          <>
                            <TouchableOpacity
                              disabled={imageVideoVisibility}
                              style={styles.belows}
                              onPress={() => setPickerModalVisibile(true)}
                            >
                              <FastImage
                                source={IMAGES.camera}
                                style={{
                                  height: WP(5.1),
                                  width: WP(7),
                                  marginLeft: 10,
                                }}
                              />
                              <Text
                                style={
                                  imageVideoVisibility
                                    ? styles.disableTxt
                                    : styles.txt
                                }
                              >
                                {t("Upload Photos/Videos")}
                              </Text>
                            </TouchableOpacity>
                          </>
                        ) : null}

                        <TouchableOpacity
                          onPress={onPressTagPeople}
                          style={styles.belows}
                        >
                          <FastImage
                            source={IMAGES.userTag}
                            style={[
                              styles.optionImage,
                              {
                                marginLeft: 10,
                              },
                            ]}
                          />

                          <Text style={styles.txt}>{t("Tag People")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.belows}
                          onPress={() => feelingToogle()}
                        >
                          <FastImage
                            source={IMAGES.smile}
                            style={[
                              styles.optionImage,
                              {
                                marginLeft: 10,
                              },
                            ]}
                          />

                          <Text style={styles.txt}>
                            {t("Feelings Activity")}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={onPressCheckIn}
                          style={styles.belows}
                        >
                          <FastImage
                            source={IMAGES.map}
                            style={[
                              styles.optionImage,
                              {
                                marginLeft: 10,
                              },
                            ]}
                          />

                          <Text style={styles.txt}>{t("Check In")}</Text>
                        </TouchableOpacity>

                        {!colorVisibility ? (
                          <>
                            <TouchableOpacity
                              disabled={colorVisibility}
                              style={styles.belows}
                              onPress={() => showColorsFunc()}
                            >
                              <FastImage
                                source={IMAGES.postsColored}
                                style={[
                                  styles.optionImage,
                                  {
                                    marginLeft: 10,
                                  },
                                ]}
                              />
                              <Text
                                style={
                                  colorVisibility
                                    ? styles.disableTxt
                                    : styles.txt
                                }
                              >
                                {t("Colored Post")}
                              </Text>
                            </TouchableOpacity>
                          </>
                        ) : null}

                        <TouchableOpacity
                          onPress={setExpiryFunc}
                          style={styles.belows}
                        >
                          <FastImage
                            source={IMAGES.expiry_timeIcon}
                            style={[
                              styles.optionImage,
                              {
                                marginLeft: 10,
                              },
                            ]}
                          />

                          {/* <Text style={styles.txt}>Set Expiry</Text> */}
                          <View>
                            <Text style={styles.txtSetExpiry}>
                              {t("Set Expiry")}
                            </Text>
                            {expiryTime == true && expirytext != "" && (
                              <Text style={styles.txtExpiryTime}>
                                {expirytextFromNow
                                  ?.split(" ")[1]
                                  ?.replace("a", 1) +
                                  " " +
                                  expirytextFromNow?.split(" ")[2]}
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <BackButtonTwo goBack={() => onPressBack()} />

                  <View style={styles.headerTitleView}>
                    <Text style={styles.headerTitle}>{t("Edit Post")}</Text>
                  </View>

                  <TouchableOpacity
                    disabled={disable}
                    style={disable ? styles.DisButton : styles.button}
                    onPressIn={() =>
                      room
                        ? submitRoomPost()
                        : group
                        ? submitGroupPost()
                        : event
                        ? submitEventPost()
                        : submitStatus()
                    }
                  >
                    <Text style={styles.textStyle}>{t("Update")}</Text>
                  </TouchableOpacity>
                </View>

                {pattern ? (
                  <View style={{}}>
                    {pattern.type === "image" ? (
                      <ImageStatus
                        flashRef={flashRef}
                        expiryTime={expiryTime}
                        expirytext={expirytext}
                        handleText={setMyPostText}
                        placeholderTextColor={pattern.text_color}
                        color={pattern.text_color}
                        tags={selectedTagFriends}
                        timelinePlaceholder={Placeholder}
                        uri={
                          SITE_URL + "frontend/img/" + pattern.background_image
                        }
                        loc={location_label}
                        feeling_action={feeling_action}
                        feeling_value={feeling_value}
                        value={postText}
                        onLayout={(e) => onLayout(e)}
                        onFocus={() => {
                          setisBar(true);
                        }}
                        onPressLocation={onPressCheckIn}
                        onPressFeeling={() => setPage(feeling)}
                        onPressTagged={() => setPage(TagPeople)}
                      >
                        <View style={styles.pickerContainer}>
                          {room ? (
                            ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (group && gropuPrivacy == "private") ||
                            (event && eventType == "private") ? (
                            ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (group && gropuPrivacy == "public") ||
                            (event && eventType == "public") ? (
                            ICONS.fontAwesome5("globe", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (
                            <>
                              {editPostData?.post?.post_type === "room_post"
                                ? ICONS.fontAwesome5(
                                    "lock",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )
                                : editPostData?.post?.post_type ===
                                    "group_post" &&
                                  editPostData?.post?.post_privacy === "private"
                                ? ICONS.fontAwesome5(
                                    "lock",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )
                                : editPostData?.post?.post_type ===
                                    "group_post" &&
                                  editPostData?.post?.post_privacy ===
                                    "public" &&
                                  ICONS.fontAwesome5(
                                    "globe",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )}
                              {editPostData?.post?.post_type !== "room_post" &&
                                editPostData?.post?.post_type !==
                                  "group_post" && (
                                  <>
                                    <TouchableOpacity
                                      style={[
                                        styles.iosviewPicker,
                                        {
                                          height:
                                            Platform.OS == "android"
                                              ? HP(4)
                                              : null,
                                          maxWidth:
                                            Platform.OS == "android"
                                              ? HP(20)
                                              : null,
                                        },
                                      ]}
                                      onPress={() => setMyVisiblePrivacy(true)}
                                    >
                                      {privacyNewPost(
                                        privacyPickerValue,
                                        COLORS.black,
                                        true
                                      )}
                                      <Text style={{}}>
                                        {selectedPrivacyOption
                                          ? t(selectedPrivacyOption.title)
                                          : ""}
                                      </Text>
                                      {ICONS.fontAwesome5(
                                        "caret-down",
                                        COLORS.primary
                                      )}
                                    </TouchableOpacity>
                                    <CustomPickerPrivacy
                                      visible={myVisiblePrivacy}
                                      selectedValue={privacyPickerValue}
                                      setValueFunc={(val) => {
                                        setPrivacyPicker(val);
                                        handleSpecificFriends(val);
                                      }}
                                      data={privacyData}
                                      hideVisible={() =>
                                        setMyVisiblePrivacy(false)
                                      }
                                    />
                                  </>
                                )}
                            </>
                          )}

                          {!room && !group && !event && (
                            <>
                              {editPostData?.post?.post_type !== "room_post" &&
                                editPostData?.post?.post_type !==
                                  "group_post" &&
                                (Platform.OS == "android" ? (
                                  <>
                                    <TouchableOpacity
                                      style={styles.androidViewPickerGen}
                                      onPress={() => setMyVisible(true)}
                                    >
                                      <Text>{tags(tagPickerValue)}</Text>
                                      {ICONS.fontAwesome5(
                                        "caret-down",
                                        COLORS.primary
                                      )}
                                    </TouchableOpacity>
                                    <CustomPickerPrivacy
                                      visible={myVisible}
                                      selectedValue={tagPickerValue}
                                      setValueFunc={(val) =>
                                        setTagPickerValue(val)
                                      }
                                      data={tagsData}
                                      hideVisible={() => setMyVisible(false)}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <TouchableOpacity
                                      style={styles.iosviewPickerGen}
                                      onPress={() => setMyVisible(true)}
                                    >
                                      <Text>{tags(tagPickerValue)}</Text>
                                      {ICONS.fontAwesome5(
                                        "caret-down",
                                        COLORS.primary
                                      )}
                                    </TouchableOpacity>
                                    <CustomPickerPrivacy
                                      visible={myVisible}
                                      selectedValue={tagPickerValue}
                                      setValueFunc={(val) =>
                                        setTagPickerValue(val)
                                      }
                                      data={tagsData}
                                      hideVisible={() => setMyVisible(false)}
                                    />
                                  </>
                                ))}
                            </>
                          )}
                        </View>
                      </ImageStatus>
                    ) : (
                      <ColoredStatus
                        flashRef={flashRef}
                        expiryTime={expiryTime}
                        expirytext={expirytext}
                        color1={pattern.background_color_1}
                        color2={pattern.background_color_2}
                        value={postText}
                        tags={selectedTagFriends}
                        color={pattern.text_color}
                        placeholderTextColor={pattern.text_color}
                        handleText={setMyPostText}
                        loc={location_label}
                        feeling_action={feeling_action}
                        feeling_value={feeling_value}
                        timelinePlaceholder={Placeholder}
                        onPressFeeling={() => setPage(feeling)}
                        onPressLocation={onPressCheckIn}
                        onLayout={(e) => onLayout(e)}
                        onFocus={() => {
                          // bottomSheetRef.current.snapTo(1);
                          // setBottomSheetVisible(false);
                          setisBar(true);
                        }}
                        onPressTagged={() => setPage(TagPeople)}
                      >
                        <View style={styles.pickerContainer}>
                          {room ? (
                            ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (group && gropuPrivacy == "private") ||
                            (event && eventType == "private") ? (
                            ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (group && gropuPrivacy == "public") ||
                            (event && eventType == "public") ? (
                            ICONS.fontAwesome5("globe", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          ) : (
                            <>
                              {editPostData?.post?.post_type === "room_post"
                                ? ICONS.fontAwesome5(
                                    "lock",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )
                                : editPostData?.post?.post_type ===
                                    "group_post" &&
                                  editPostData?.post?.post_privacy === "private"
                                ? ICONS.fontAwesome5(
                                    "lock",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )
                                : editPostData?.post?.post_type ===
                                    "group_post" &&
                                  editPostData?.post?.post_privacy ===
                                    "public" &&
                                  ICONS.fontAwesome5(
                                    "globe",
                                    COLORS.primary,
                                    18,
                                    {
                                      marginHorizontal: 10,
                                      marginVertical: 3,
                                    }
                                  )}

                              {editPostData?.post?.post_type !== "room_post" &&
                                editPostData?.post?.post_type !==
                                  "group_post" && (
                                  <>
                                    <TouchableOpacity
                                      style={[
                                        styles.iosviewPicker,
                                        {
                                          height:
                                            Platform.OS == "android"
                                              ? HP(4)
                                              : null,
                                          maxWidth:
                                            Platform.OS == "android"
                                              ? HP(20)
                                              : null,
                                        },
                                      ]}
                                      onPress={() => setMyVisiblePrivacy(true)}
                                    >
                                      {privacyNewPost(
                                        privacyPickerValue,
                                        COLORS.black,
                                        true
                                      )}
                                      <Text style={{}}>
                                        {selectedPrivacyOption
                                          ? t(selectedPrivacyOption.title)
                                          : ""}
                                      </Text>
                                      {ICONS.fontAwesome5(
                                        "caret-down",
                                        COLORS.primary,
                                        19
                                      )}
                                    </TouchableOpacity>
                                    <CustomPickerPrivacy
                                      visible={myVisiblePrivacy}
                                      selectedValue={privacyPickerValue}
                                      setValueFunc={(val) => {
                                        setPrivacyPicker(val);
                                        handleSpecificFriends(val);
                                      }}
                                      data={privacyData}
                                      hideVisible={() =>
                                        setMyVisiblePrivacy(false)
                                      }
                                    />
                                  </>
                                )}
                            </>
                          )}
                          {!room &&
                            !group &&
                            !event &&
                            (Platform.OS == "android" ? (
                              <>
                                <TouchableOpacity
                                  disabled={room || group || event}
                                  style={
                                    room || group || event
                                      ? styles.iosRoomViewPickerGen
                                      : styles.androidViewPickerGen
                                  }
                                  onPress={() => setMyVisible(true)}
                                >
                                  <Text style={{ paddingRight: 5 }}>
                                    {tags(tagPickerValue)}
                                  </Text>
                                  {ICONS.fontAwesome5(
                                    "caret-down",
                                    COLORS.primary
                                  )}
                                </TouchableOpacity>
                                <CustomPickerPrivacy
                                  visible={myVisible}
                                  selectedValue={tagPickerValue}
                                  setValueFunc={(val) => setTagPickerValue(val)}
                                  data={tagsData}
                                  hideVisible={() => setMyVisible(false)}
                                />
                              </>
                            ) : (
                              <>
                                {editPostData?.post?.post_type !==
                                  "room_post" &&
                                  editPostData?.post?.post_type !==
                                    "group_post" && (
                                    <TouchableOpacity
                                      style={styles.iosviewPickerGen}
                                      onPress={() => setMyVisible(true)}
                                    >
                                      <Text>{tags(tagPickerValue)}</Text>
                                      {ICONS.fontAwesome5(
                                        "caret-down",
                                        COLORS.black
                                      )}
                                    </TouchableOpacity>
                                  )}

                                <CustomPickerPrivacy
                                  visible={myVisible}
                                  selectedValue={tagPickerValue}
                                  setValueFunc={(val) => setTagPickerValue(val)}
                                  data={tagsData}
                                  hideVisible={() => setMyVisible(false)}
                                />
                              </>
                            ))}
                        </View>
                      </ColoredStatus>
                    )}
                  </View>
                ) : (
                  <View>
                    <SimpleStatus
                      flashRef={flashRef}
                      expiryTime={expiryTime}
                      expirytext={expirytext}
                      isBar={isBar}
                      value={postText}
                      loc={location_label}
                      tags={selectedTagFriends}
                      deleteItem={(e) => deleteItems(e)}
                      onPressImage={onPressImage}
                      multipleImages={multipleImages}
                      handleText={setMyPostText}
                      feeling_action={feeling_action}
                      feeling_value={feeling_value}
                      timelinePlaceholder={Placeholder}
                      onFocus={() => {
                        // bottomSheetRef.current.snapTo(1);
                        // setBottomSheetVisible(false);
                        setisBar(true);
                      }}
                      onPressFeeling={() => setPage(feeling)}
                      onPressLocation={onPressCheckIn}
                      onLayout={(e) => onLayout(e)}
                      onPressTagged={() => setPage(TagPeople)}
                    >
                      <View style={styles.pickerContainer}>
                        {editPostData?.post?.post_type === "room_post"
                          ? ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          : editPostData?.post?.post_type === "group_post" &&
                            editPostData?.post?.post_privacy === "private"
                          ? ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })
                          : editPostData?.post?.post_type === "group_post" &&
                            editPostData?.post?.post_privacy === "public" &&
                            ICONS.fontAwesome5("globe", COLORS.primary, 18, {
                              marginHorizontal: 10,
                              marginVertical: 3,
                            })}
                        {editPostData?.post?.post_type !== "room_post" &&
                          editPostData?.post?.post_type !== "group_post" && (
                            <>
                              {room ? (
                                ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                                  marginHorizontal: 10,
                                  marginVertical: 3,
                                })
                              ) : (group && gropuPrivacy == "private") ||
                                (event && eventType == "private") ? (
                                ICONS.fontAwesome5("lock", COLORS.primary, 18, {
                                  marginHorizontal: 10,
                                  marginVertical: 3,
                                })
                              ) : (group && gropuPrivacy == "public") ||
                                (event && eventType == "public") ? (
                                ICONS.fontAwesome5(
                                  "globe",
                                  COLORS.primary,
                                  18,
                                  {
                                    marginHorizontal: 10,
                                    marginVertical: 3,
                                  }
                                )
                              ) : (
                                <TouchableOpacity
                                  style={[
                                    styles.iosviewPicker,
                                    {
                                      height:
                                        Platform.OS == "android" ? HP(4) : null,
                                      maxWidth:
                                        Platform.OS == "android"
                                          ? HP(20)
                                          : null,
                                    },
                                  ]}
                                  onPress={() => setMyVisiblePrivacy(true)}
                                >
                                  {privacyNewPost(
                                    privacyPickerValue,
                                    COLORS.black,
                                    true
                                  )}
                                  <Text style={{ paddingHorizontal: 5 }}>
                                    {selectedPrivacyOption
                                      ? t(selectedPrivacyOption.title)
                                      : ""}
                                  </Text>
                                  {ICONS.fontAwesome5(
                                    "caret-down",
                                    COLORS.primary
                                  )}
                                </TouchableOpacity>
                              )}
                              <CustomPickerPrivacy
                                visible={myVisiblePrivacy}
                                selectedValue={privacyPickerValue}
                                setValueFunc={(val) => {
                                  setPrivacyPicker(val);
                                  handleSpecificFriends(val);
                                }}
                                data={privacyData}
                                hideVisible={() => setMyVisiblePrivacy(false)}
                              />
                            </>
                          )}
                        {editPostData?.post?.post_type !== "room_post" &&
                          editPostData?.post?.post_type !== "group_post" &&
                          (Platform.OS == "android" ? (
                            !room &&
                            !group &&
                            !event && (
                              <>
                                <TouchableOpacity
                                  disabled={room || group || event}
                                  style={
                                    room || group || event
                                      ? styles.iosRoomViewPickerGen
                                      : styles.androidViewPickerGen
                                  }
                                  onPress={() => setMyVisible(true)}
                                >
                                  <Text style={{ paddingRight: 5 }}>
                                    {tags(tagPickerValue)}
                                  </Text>
                                  {ICONS.fontAwesome5(
                                    "caret-down",
                                    COLORS.primary
                                  )}
                                </TouchableOpacity>
                                <CustomPickerPrivacy
                                  visible={myVisible}
                                  selectedValue={tagPickerValue}
                                  setValueFunc={(val) => setTagPickerValue(val)}
                                  data={tagsData}
                                  hideVisible={() => setMyVisible(false)}
                                />
                              </>
                            )
                          ) : (
                            <>
                              {!room && !group && !event && (
                                <TouchableOpacity
                                  disabled={room || group || event}
                                  style={
                                    room || group || event
                                      ? styles.iosRoomViewPickerGen
                                      : styles.iosviewPickerGen
                                  }
                                  onPress={() => setMyVisible(true)}
                                >
                                  <Text style={{ paddingRight: 5 }}>
                                    {tags(tagPickerValue)}
                                  </Text>
                                  {ICONS.fontAwesome5(
                                    "caret-down",
                                    COLORS.primary
                                  )}
                                </TouchableOpacity>
                              )}
                              <CustomPickerPrivacy
                                visible={myVisible}
                                selectedValue={tagPickerValue}
                                setValueFunc={(val) => setTagPickerValue(val)}
                                data={tagsData}
                                hideVisible={() => setMyVisible(false)}
                              />
                            </>
                          ))}
                      </View>
                    </SimpleStatus>
                  </View>
                )}

                {showColors && myPatterns ? (
                  <View style={styles.colorShow}>
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <TouchableOpacity onPress={onPressCloseColorPatterns}>
                        {ICONS.antDesign("closecircleo", COLORS.white, 23, {
                          color: COLORS.red,
                        })}
                      </TouchableOpacity>
                    </View>
                    <ColoredPatterns
                      handleColorPat={handleColorPat}
                      pattern={pattern}
                    />
                  </View>
                ) : null}

                <ImagePickerModal
                  visible={pickerModalVisibile}
                  hideVisible={() => setPickerModalVisibile(false)}
                  galleryImage={() => chooseImageGallery()}
                  cameraVideo={() => captureImage("video")}
                  cameraImage={() => captureImage("image")}
                />
              </View>
            ) : page == feeling ? (
              <View style={styles.feelContainer}>
                <BackButtonTwo
                  goBack={() => {
                    setPage(selection);
                  }}
                  outerStyle={styles.backButtonOuter}
                />

                <ActivityAndFeeling
                  hideFeelings={hideFeelings}
                  feelingFlatList={feelingFlatList}
                  feelingFlatListTogle={feelingFlatListTogle}
                  setFellingAction={setFellingAction}
                  setFellingValue={setFellingValue}
                  setisFocus={setisFocus}
                  feelingValue={feeling_value}
                  onPressTick={() => {
                    setPage(selection);
                  }}
                  onPressClose={() => {
                    setPage(selection);
                    setFeeling(false);
                    setFeelingFlatList(false);
                    setisFocus(false);
                    setFellingAction("");
                    setFellingValue("");
                  }}
                />
              </View>
            ) : page == location ? (
              <View style={[styles.feelContainer, { paddingHorizontal: 10 }]}>
                <BackButtonTwo
                  goBack={() => {
                    setPage(selection);
                    setCheckIn(false);
                  }}
                  outerStyle={{ marginTop: 15 }}
                />
                {CheckIn == true ? (
                  <MapBox
                    location_label={location_label}
                    snapURI={snapURI}
                    setSnapURI={setSnapURI}
                    setLocation_label={setLocation_label}
                    setCheckIn={setCheckIn}
                    // multipleImages={multipleImages}
                    colorPat={colorPat}
                    onPressTick={() => {
                      // bottomSheetRef?.current?.snapTo(1);
                      setPage(selection);
                    }}
                    onPressCross={() => {
                      setPage(selection);
                      setCheckIn(false);
                      setLocation_label();
                      setSnapURI("");
                      deleteItems(multipleImages, "map");
                    }}
                  />
                ) : null}
              </View>
            ) : page == TagPeople ? (
              <View style={styles.feelContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 10,
                  }}
                >
                  <BackButtonTwo
                    goBack={() => {
                      setPage(selection);
                    }}
                    outerStyle={styles.backButtonOuter}
                  />
                  <View
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: "white",
                        padding: 0,
                        elevation: 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textStyle,
                        { color: "black", fontSize: 15 },
                      ]}
                    >
                      {t("Tag People")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: "white",
                        width: WP(9),
                      },
                    ]}
                  ></View>
                </View>
                <View style={{ flex: 1, marginHorizontal: WP(3) }}>
                  <TextInput
                    style={styles.txtInput2}
                    require={true}
                    onChangeText={(val) => getFriends(val)}
                    placeholder={`${t("Search")}${t("...")}`}
                  />
                  <View>
                    <FlatList
                      data={selectedTagFriends}
                      keyExtractor={(i) => i.id}
                      numColumns={2}
                      ListHeaderComponent={
                        <>
                          {selectedTagFriends?.length > 0 ? (
                            <View
                              style={{
                                alignItems: "flex-end",
                                paddingHorizontal: 5,
                              }}
                            >
                              {ICONS.antDesign(
                                "closecircleo",
                                COLORS.white,
                                23,
                                {
                                  color: COLORS.red,
                                },
                                handleOnPressCrossSelectedTags
                              )}
                            </View>
                          ) : null}
                        </>
                      }
                      renderItem={({ item }) => (
                        <View style={styles.taggedPersonBox}>
                          <Text
                            adjustsFontSizeToFit
                            style={{
                              fontWeight: "bold",
                              fontSize: WP(3.5),
                            }}
                          >
                            {item?.first_name + " " + item?.last_name}
                          </Text>
                          {ICONS.fontAwesome5(
                            "times-circle",
                            COLORS.red,
                            WP(5),
                            { marginLeft: 2 },

                            () => handleOnPressTagFriendsItemCross(item)
                          )}
                        </View>
                      )}
                    />
                  </View>

                  <FlatList
                    keyExtractor={(item, index) => index}
                    style={{ flex: 1 }}
                    data={
                      userNameValue
                        ? showNonSelectedFriendList?.length > 0
                          ? showNonSelectedFriendList
                          : searchedFriends?.length ===
                            selectedTagFriends?.length
                          ? []
                          : searchedFriends
                        : showNonSelectedFriendList?.length > 0
                        ? showNonSelectedFriendList
                        : friends?.length === selectedTagFriends?.length
                        ? []
                        : friends
                    }
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    ListEmptyComponent={() =>
                      loadingFriendsList ? (
                        <ActivityIndicator
                          animating={true}
                          size="large"
                          color={COLORS.primary}
                        />
                      ) : (
                        <>
                          {tagFriendsList?.length >= 0 ? (
                            <View style={styles.listEmptyBox}>
                              <Text
                                style={{ fontSize: 23, color: COLORS.grey }}
                              >
                                No Results
                              </Text>
                            </View>
                          ) : null}
                        </>
                      )
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleOnPressTagFriendsItem(item)}
                          style={[styles.box]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <FastImage
                              source={
                                item?.profile_picture != null
                                  ? {
                                      uri: SITE_URL + item.profile_picture,
                                    }
                                  : IMAGES.blankDP
                              }
                              style={styles.friendsDp}
                            />

                            <Text
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              {item?.first_name + " " + item?.last_name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            ) : page == ExpiryDate ? (
              <View style={styles.feelContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 10,
                  }}
                >
                  <BackButtonTwo
                    goBack={() => {
                      setPage(selection);
                      setTagFriendsList([]);
                    }}
                    outerStyle={styles.backButtonOuter}
                  />
                  <View
                    style={[
                      styles.addButton,
                      { backgroundColor: "white", elevation: 0 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textStyle,
                        { color: "black", fontSize: 15 },
                      ]}
                    >
                      {t("Set Expiry")}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPressIn={onPressDoneExpiry}
                    style={styles.addButton}
                  >
                    <Text style={styles.textStyle}>{t("Done")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginHorizontal: WP(3) }}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={expiry}
                    maxHeight={400}
                    labelField="label"
                    valueField="value"
                    placeholder={t("3 Months")}
                    value={value}
                    onChange={(item) => onDropdownChange(item.value)}
                  />
                  {expiryTempTime && (
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        display: expiryTempTime ? "flex" : "none",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.expD,
                          {
                            backgroundColor:
                              value == "custom" ? COLORS.white : "#D3D3D3",
                            borderWidth: value == "custom" ? 1 : 0,
                          },
                        ]}
                        disabled={value !== "custom"}
                        onPress={() => {
                          setExpriyDateModal(true);
                        }}
                      >
                        <Text
                          style={[
                            expiryDateDesign ? styles.txt : styles.btnText,
                            { paddingLeft: 20 },
                          ]}
                        >
                          {expiryTempText
                            ? expiryTempText
                            : t("Set Expiry Date")}
                        </Text>
                        {value === "custom" && (
                          <View
                            style={{
                              alignItems: "flex-end",
                              justifyContent: "flex-end",
                              flexDirection: "row",
                              padding: 10,
                              marginLeft: 70,
                            }}
                          >
                            {ICONS.antDesign("calendar", COLORS.black, 20)}
                          </View>
                        )}

                        {Platform.OS === "ios" ? (
                          <IosDatePicker
                            onIosDateChange={(selectedDate) =>
                              onIosDateChange(selectedDate)
                            }
                            date={tempDate}
                            visible={expriyDateModal}
                            hideVisible={() => setExpriyDateModal(false)}
                            keyof={"expDat"}
                            flashRef={flashRef}
                            setExpiry
                          />
                        ) : expriyDateModal ? (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={tempDate}
                            mode={"date"}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            // maximumDate={new Date("2023/12/31")}
                            minimumDate={new Date()}
                            flashRef={flashRef}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={[styles.minExpD]}>
                    <AntDesign
                      name="infocirlce"
                      size={17}
                      color={COLORS.darkGray}
                      style={{ bottom: 6, right: 3 }}
                    />

                    <Text
                      style={{
                        color: COLORS.black,
                        textAlign: "left",
                      }}
                    >
                      {value == "museum"
                        ? "The post will not expire and images in posts can be accessed in the Museum area in the Profile section"
                        : "The images in posts can be accessed in the Gallery area in the Profile section"}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {page == selection
          ? isBar && (
              <View style={styles.bottombar}>
                {!imageVideoVisibility ? (
                  <TouchableOpacity
                    onPress={() => setPickerModalVisibile(true)}
                    style={styles.bottomBarIconWrapper}
                  >
                    <FastImage
                      source={IMAGES.camera}
                      style={{ height: WP(5.1), width: WP(7) }}
                    />
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={onPressTagPeople}
                  style={styles.bottomBarIconWrapper}
                >
                  <FastImage
                    source={IMAGES.userTag}
                    style={styles.optionImage}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bottomBarIconWrapper}
                  onPress={() => feelingToogle()}
                >
                  <FastImage source={IMAGES.smile} style={styles.optionImage} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bottomBarIconWrapper}
                  onPress={onPressCheckIn}
                >
                  <FastImage source={IMAGES.map} style={styles.optionImage} />
                </TouchableOpacity>

                {!colorVisibility ? (
                  <TouchableOpacity
                    style={styles.bottomBarIconWrapper}
                    onPress={() => (colorVisibility ? null : showColorsFunc())}
                  >
                    <FastImage
                      source={IMAGES.postsColored}
                      style={styles.optionImage}
                    />
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={setExpiryFunc}
                  style={styles.bottomBarIconWrapper}
                >
                  <FastImage
                    source={IMAGES.expiry_timeIcon}
                    style={styles.optionImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!Feeling) {
                      Keyboard.dismiss();
                      setisBar(false);
                    }
                  }}
                  style={styles.bottomBarIconWrapper}
                >
                  {ICONS.antDesign("upcircleo", COLORS.black, 24)}
                </TouchableOpacity>

                {keyboardVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                    }}
                    activeOpacity={1}
                    style={[
                      styles.bottomBarIconWrapper,
                      { backgroundColor: "#D1D4D8", top: 1 },
                    ]}
                  >
                    {ICONS.materialCommunityIcons(
                      "keyboard-close",
                      COLORS.black,
                      25,
                      { bottom: 1 }
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )
          : null}

        {specificFrndModal && (
          <SpecificFriendModal
            specFrndModal={specificFrndModal}
            setSpecFrndModal={setSpecificFrndModal}
            specificFriends={specificFriends}
            setSpecificFriends={setSpecificFriends}
            setPrivacyPicker={setPrivacyPicker}
            editingPost={true}
          />
        )}

        <FlashMessage
          ref={flashRef}
          position="top"
          floating
          duration={3000}
          icon="auto"
          style={{
            alignItems: "center",
            backgroundColor: COLORS.secondary,
          }}
        />
        <ImagePreviewModal
          modalVisible={modalVisiblePreview}
          setModalVisible={setModalVisiblePreview}
          showImagePath={showImagePath}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  expD: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // borderWidth: 1,
    height: 40,
    width: WP(90),
    borderRadius: 25,
    backgroundColor: "#D3D3D3",
    margin: 10,
    marginTop: 20,
  },
  minExpD: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: WP(96),
    marginVertical: 10,

    paddingRight: 20,
  },

  feelContainer: {
    flex: 1,
    width: WP(100),
  },
  postBtnView: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tooLightGray,
    height: HP(3),
    backgroundColor: COLORS.tooLightGray,
  },
  belowsContainer: {
    // marginTop: HP(1),
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    height: HP(8),
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.primary,
    // marginLeft: WP(24),
    // textAlign: "center",
    // alignSelf: "center",
  },
  colorShow: {
    height: 60,
    marginTop: HP(1),
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
  iosviewPickerGen: {
    borderColor: COLORS.black,
    borderWidth: 0.5,
    justifyContent: "space-between",
    width: WP(25),
    height: HP(3),
    borderRadius: 5,
    paddingHorizontal: WP(3),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  androidViewPickerGen: {
    borderColor: "#000",
    borderWidth: 0.5,
    justifyContent: "space-between",
    height: HP(4),
    borderRadius: 5,
    paddingHorizontal: WP(3),

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  iosRoomViewPickerGen: {
    position: "absolute",
    left: WP(10),
    borderColor: COLORS.wildSand,
    borderWidth: 0.5,
    justifyContent: "space-between",
    width: WP(25),
    height: HP(3),
    borderRadius: 5,
    paddingHorizontal: WP(3),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.wildSand,
  },

  iosviewPicker: {
    borderColor: COLORS.black,
    borderWidth: 0.5,
    justifyContent: "space-between",
    minWidth: WP(25),
    height: HP(3),
    borderRadius: 5,
    paddingHorizontal: WP(3),
    // position: "absolute",
    // top: HP(10),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    // left: WP(45),
  },

  headerTitleView: {
    alignSelf: "center",
    // backgroundColor: "green",
    // width: WP(86.5),
    // flex: 1,
    // paddingBottom: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  pickerView: {
    borderWidth: 0.5,
    borderColor: COLORS.black,
    justifyContent: "center",
    width: WP(35),
    height: HP(4),
    borderRadius: 5,
    backgroundColor: COLORS.wildSand,

    // alignSelf: "flex-end",
    // position: "absolute",
    // top: HP(19.8),
  },

  picker: {
    backgroundColor: "Gray",
    color: COLORS.blue,
    fontFamily: "Ebrima",
    fontSize: 17,
    color: COLORS.primary,
  },

  txt: {
    fontWeight: "bold",
    marginLeft: WP(1),
    fontSize: 12,
    flexWrap: "wrap",
    color: COLORS.black,
    flex: 1,
  },

  txtSetExpiry: {
    fontWeight: "bold",
    marginLeft: WP(1),
    fontSize: 12,
    flexWrap: "wrap",
    color: "black",
  },

  txtExpiryTime: {
    fontWeight: "bold",
    marginHorizontal: WP(1),
    fontSize: 12,
    flexWrap: "wrap",
    color: COLORS.primary,
    fontStyle: "italic",
  },

  btn: {
    width: WP(20),
    height: HP(6),
    backgroundColor: "#D3D3D3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // alignContent: "center",
    borderRadius: 5,
    paddingHorizontal: WP(1),
    paddingVertical: WP(2),
    marginTop: 10,
    // borderWidth: 1,
  },
  btnText: {
    color: COLORS.grey,
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  disableTxt: {
    fontWeight: "bold",
    marginLeft: WP(1),
    fontSize: 12,
    flexWrap: "wrap",
    flex: 1,
    color: COLORS.wildSand,
  },
  belows: {
    flexDirection: "row",
    backgroundColor: "#D3D3D3",
    width: WP(40),
    height: HP(6),
    // justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: WP(1),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 0,

    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 35,
    // alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    // width: WP(10),

    // marginTop: HP(1),
    backgroundColor: COLORS.primary,
  },
  DisButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    // width: WP(10),

    // marginTop: HP(1),
    backgroundColor: COLORS.cocoGrey,
  },

  textStyle: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  keyboardDismissButton: {
    backgroundColor: COLORS.wildSand,
    position: "absolute",
    zIndex: 100,
    right: 0,
    paddingHorizontal: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 0.166,
    elevation: 5,
    borderRadius: 5,
    flexDirection: "row",
    width: WidthScreen,
    alignItems: "center",
    justifyContent: "space-around",
  },
  selectedDisplayBox: {
    backgroundColor: COLORS.tooLightGrey,
    borderRadius: 15,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  selectedDisplayTxt: {
    padding: 8,
    fontWeight: "bold",
    color: COLORS.cadetBlue,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 5,
    marginTop: 5,
    // backgroundColor: COLORS.red,
    width: "90%",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: WP(4),
  },
  barscard: {
    width: WidthScreen,
    height: 40,
    borderWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  bottombar: {
    width: WidthScreen,
    position: "absolute",
    backgroundColor: "#E6ECF5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    bottom: 0,
  },
  optionImage: {
    height: WP(6),
    width: WP(6),
  },
  backButtonOuter: { marginLeft: 10, marginTop: 15 },
  box: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    height: HP(7),
    borderBottomWidth: 0.5,
    justifyContent: "space-between",
  },
  friendsDp: {
    height: WP(10),
    width: WP(10),
    marginHorizontal: WP(2),
    borderRadius: WP(10),
  },
  listEmptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  taggedPersonBox: {
    backgroundColor: COLORS.cocoGrey,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    maxWidth: WP(48.5),
    marginRight: 5,
    marginTop: 5,
  },
  txtInput2: {
    // height: HP(5),
    fontSize: WP(5),
    backgroundColor: COLORS.cocoGrey,
    marginVertical: 10,
    paddingVertical: HP(1.1),
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  bottomBarIconWrapper: {
    paddingVertical: HP(1.7),
    paddingHorizontal: WP(3),
    left: 5,
    // backgroundColor: COLORS.red,
  },

  iconView: {
    // justifyContent: "center",
    alignItems: "center",
    paddingLeft: WP(2),
    width: WP(35),
    height: HP(4),
    borderRadius: 5,
    backgroundColor: COLORS.wildSand,
    flexDirection: "row",
    borderWidth: 0.5,
  },

  andrioPicker: {
    // backgroundColor: COLORS.primary,
    width: WP(25),
    justifyContent: "center",
    alignContent: "center",
    // marginRight: HP(3),
    marginLeft: WP(1),
    // height: HP(3.5),
    // left: WP(3),
    // marginTop: HP(1),
  },
  dropStyle: {
    backgroundColor: COLORS.white,
    // height: HP(15.2),
    // width: WP(28),
    textTransform: "capitalize",
    elevation: 5,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    elevation: 2,

    backgroundColor: COLORS.primary,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    width: WP("90%"),
    height: 45,
    marginTop: HP(2),
    alignSelf: "center",
    justifyContent: "center",
    borderColor: COLORS.grey,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  selectedTextStyle: {
    paddingLeft: 10,
    fontSize: 16,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});
export default EditPostModal;
