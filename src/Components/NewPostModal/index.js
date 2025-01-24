import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  View,
  Text,
  Platform,
  Keyboard,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Pressable,
} from "react-native";

import mime from "mime";
import moment from "moment/moment.js";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import BottomSheet from "reanimated-bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import FlashMessage from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";

import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import {
  postStatusNf,
  fetchColoredPatterns,
} from "../../Redux/actions/NewsFeedActions";
import { showRoomRequest } from "../../Redux/actions/RoomActions";

import MapBox from "../MapBox";
import Button from "../NewButton";
import DiscardModal from "../DiscardModal";
import BackButtonTwo from "../BackButton/index2";
import { WidthScreen } from "../TopBar/Dimensions";
import ImagePickerModal from "../ImagePickerModal";
import ColoredPatterns from "../ColoredPatterns.js";
import SpecificFriendModal from "../SpecificFriendModal";
import IosDatePicker from "../IosDatePicker/IosDatePicker";
import CustomPicker from "../CustomPickers/CustomPickerIos";
import ImageStatus from "../StatusComponents.js/ImageStatus";
import ActivityAndFeeling from "../ActivityAndFeeling/index";
import ColoredStatus from "../StatusComponents.js/ColoredStatus";
import SimpleStatus from "../StatusComponents.js/SimpleStatus.js";

import { HP, WP } from "../../../Utils/Resposive";
import { imgRegex } from "../../../Utils/Regexes/imgVideoRegex";
import { useKeyboard } from "../../../Utils/Hooks/KeyBoardHeight";
import { requestCameraPermission } from "../../../Utils/ImageAndCamera";
import {
  tags,
  tagsData,
  privacyData,
  privacyNewPost,
} from "../../../Utils/PickerDataStatus/privacyData";

import { SITE_URL } from "../../Services/Constants";
import { withoutStringiApiCall2 } from "../../Services/Apis";

import { ICONS } from "../../Constants/Icons";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { getHeight, getWidth } from "../../../Utils/NewResponsive.js";
import { useNavigation } from "@react-navigation/native";
import ImagePreviewModal from "../ImagePreviewModal/index.js";
import { isRTL } from "../../../Utils/IsRTL/index.js";
import CustomPickerPrivacy from "../PrivacyModel/index.js";
import { Dropdown } from "react-native-element-dropdown";
import { getExpiryData } from "../../Screens/Main/ReminderScreen/Constant/ReminderLocalData/index.js";

const NewPostModal = (props) => {
  const {
    visible,
    goBack,
    dataOfPostOntimeline,
    room,
    newsFeed,
    room_id,
    room_encrypted_id,
    changePlaceholderString,
    textToPost,
    group,
    group_id,
    onRefresh,
    gropuPrivacy,
    event,
    event_id,
    eventType,
    item,
    setItem,
  } = props;

  let flashRef = React.useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const expiry = getExpiryData(t);

  const token = useSelector((state) => state.auth.userToken);
  const myPatterns = useSelector((state) => state.newsF.coloredPatterns);

  const [postText, setPostText] = useState(textToPost || "");
  const [disable, setDisable] = useState(true);
  const [showColors, setShowColors] = useState(false);
  const [colorPat, setColorPat] = useState();
  const [value, setValue] = useState("");

  const [pattern, setPattern] = useState();
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [multipleImages, setMultipleImages] = useState([]);
  const [myVisible, setMyVisible] = useState(false);
  const [myVisiblePrivacy, setMyVisiblePrivacy] = useState(false);
  const [privacyPickerValue, setPrivacyPickerValue] = useState("public");
  const [tagPickerValue, setTagPickerValue] = useState(1);
  const [colorVisibility, setColorVisibility] = useState(false);
  const [imageVideoVisibility, setImageVideoVisibility] = useState(false);
  const [CheckIn, setCheckIn] = useState(false);
  const [Feeling, setFeeling] = useState(false);
  const [snapURI, setSnapURI] = useState("");
  const [location_label, setLocation_label] = useState();
  const [feelingFlatList, setFeelingFlatList] = useState(false);
  const [feeling_action, setFeeling_action] = useState("");
  const [feeling_value, setFeeling_value] = useState("");
  const [isFocus, setisFocus] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const { keyboardHeight, keyboardVisible } = useKeyboard();
  const [specificFrndModal, setSpecificFrndModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const [userNameValue, setUserNameValue] = useState("");
  const [searchedFriends, setSearchedFriends] = useState(false);
  const [specificFriends, setSpecificFriends] = useState([]);
  const [isBar, setisBar] = useState(false);
  const [showNonSelectedFriendList, setShowNonSelectedFriendList] = useState(
    []
  );

  const selection = "selection";
  const feeling = "feeling";
  const location = "location";
  const TagPeople = "TagPeople";
  const ExpiryDate = "ExpiryDate";

  const [page, setPage] = useState(selection);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);
  const [tagFriendsList, setTagFriendsList] = useState([]);
  const [selectedTagFriends, setSelectedTagFriends] = useState([]);
  const [addSelectedTagFriends, setAddSelectedTagFriends] = useState([]);

  const bottomSheetRef = useRef(null);
  const userName = useSelector((state) => state.auth.userData.name);
  const imagePickingLimit = 6;
  const snapPoints = useMemo(() => ["30%", "1%"], []);
  const insets = useSafeAreaInsets();

  const [lineHeight, setLineHeight] = useState(0);
  const [linesUsed, setLinesUsed] = useState(0);
  const [expiryTime, setExpiryTime] = useState(true);
  const [expirytext, setExpirytext] = useState("");
  const [expirytextFromNow, setExpirytextFromNow] = useState("");
  const [tempDate, setTempDate] = useState();
  const [expiryTemptextFromNow, setExpiryTemptextFromNow] = useState("");
  const [expiryTempText, setExpiryTempText] = useState();
  const [expiryTempTime, setExpiryTempTime] = useState(true);

  const [date, setDate] = useState(new Date());
  const [expriyDateModal, setExpriyDateModal] = useState(false);
  const [expiryDateDesign, setExpiryDateDesign] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showImagePath, setShowImagePath] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (item) {
      setColorVisibility(true);
    }
  }, [item]);

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
    setExpiryTempText(fDate);
    setExpiryDateDesign(true);
    setExpirytextFromNow(
      moment(currentDate, "YYYYMMDD").endOf("day").fromNow()
    );
  };

  useEffect(() => {
    setDefaultExpiryTime();
  }, []);

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
      setExpiryDateDesign(true);
      // setExpirytextFromNow(moment(tempDate, "YYYYMMDD").endOf("day").fromNow());
      setExpiryTemptextFromNow(
        moment(tempDate, "YYYYMMDD").endOf("day").fromNow()
      );
    } else setExpriyDateModal(false);
  };

  useEffect(() => {
    visible ? getLastSpecificFriends() : null;
  }, [visible]);

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
    const getAndFilterFriends = async () => {
      await GetAllFriends("");
      if (friends?.length > 0) {
        setShowNonSelectedFriendList(
          friends?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          )
        );
      }
    };

    getAndFilterFriends();

    return () => {
      if (friends && selectedTagFriends) {
        setShowNonSelectedFriendList(
          friends?.filter(
            (o1) => !selectedTagFriends?.some((o2) => o1.id === o2.id)
          ) || []
        );
      }
    };
  }, []);

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
    multipleImages?.length || item ? null : setColorVisibility(false);
    multipleImages?.length >= imagePickingLimit
      ? setImageVideoVisibility(true)
      : imageVideoVisibility == false
      ? null
      : setImageVideoVisibility(false);
  }, [multipleImages]);

  useEffect(() => {
    linesUsed > 7 ? onLinesIncreased() : onLinesDecreased();
  }, [linesUsed]);

  const memoizedCallback = useCallback(() => {
    if (
      postText ||
      multipleImages?.length ||
      feeling_value ||
      selectedTagFriends?.length ||
      location_label ||
      item
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

  const getLastSpecificFriends = async (val) => {
    try {
      const res = await withoutStringiApiCall2({
        route: `post/last/specific-friends`,

        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in getLastSpecificFriends ... ", res);
      } else if (res.responseCode == 200) {
        // console.log(
        //   "reponse from getLastSpecificFriends",
        //   res?.payload?.data?.lastSpecificFriends
        // );
        setSpecificFriends(res?.payload?.data?.lastSpecificFriends);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  const submitStatus = () => {
    let hasVideo = false;
    setDisable(true);

    const formData = new FormData();
    formData.append("privacy", privacyPickerValue);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    newsFeed
      ? formData.append("handle", "post")
      : formData.append("handle", "timeline");
    privacyPickerValue == "specific_friends"
      ? specificFriends?.map((item, index) => {
          formData.append(`specific_users_ids[${index}]`, item.id);
        })
      : null;
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
    {
      item?.type === "image" &&
        formData.append("palsome_ai_img_url", item?.image);
    }

    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });

    formData.append("tag", tagPickerValue);
    formData.append("colored_pattern", colorPat ? colorPat : 0);
    formData.append("handle", "post"); // can be change

    formData.append("textarea", postText);
    formData.append("location_img_url", snapURI);

    feeling_action != "" && feeling_value !== ""
      ? formData.append("feeling_action", feeling_action)
      : null;

    feeling_value != ""
      ? formData.append("feeling_value", feeling_value)
      : null;

    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;
    if (dataOfPostOntimeline?.encrypted_id) {
      formData.append("handle", "timeline");
      formData.append("id", dataOfPostOntimeline.encrypted_id);
    }

    dispatch(postStatusNf({ formData, token, postHasVideo: hasVideo }));

    Toast.show(t("uploading...."));
    onPressDiscard();
  };

  const submitRoomPost = () => {
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", "private");
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    formData.append("handle", "room_post");
    formData.append("textarea", postText);
    formData.append("id", room_id);
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });
    formData.append("colored_pattern", colorPat ? colorPat : 0);
    feeling_action != "" && feeling_value !== ""
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != ""
      ? formData.append("feeling_value", feeling_value)
      : null;
    formData.append("location_img_url", snapURI);
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;
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
    console.log("Post Data are -----  >>>>" + Object.values(formData));

    dispatch(postStatusNf({ formData, token, postHasVideo: hasVideo }));

    Toast.show(t("uploading...."));

    dispatch(
      showRoomRequest({
        id: room_encrypted_id,
        token,
      })
    );
    onPressDiscard();
  };

  const submitGroupPost = () => {
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", gropuPrivacy);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    formData.append("handle", "group_post");
    formData.append("textarea", postText);
    formData.append("id", group_id);
    formData.append("colored_pattern", colorPat ? colorPat : 0);
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });
    feeling_action != "" && feeling_value !== ""
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != ""
      ? formData.append("feeling_value", feeling_value)
      : null;
    formData.append("location_img_url", snapURI);
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;
    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
      if (
        item.type == "mov" ||
        item?.type == "video/mp4" ||
        item?.type == "video/quicktime"
      ) {
        hasVideo = true;
      }
    });

    dispatch(
      postStatusNf({
        formData,
        token,
        postHasVideo: hasVideo,
        refresh: () => onRefresh(true),
      })
    );

    Toast.show(t("uploading...."));

    onPressDiscard();
  };

  const submitEventPost = () => {
    let hasVideo = false;
    const formData = new FormData();
    formData.append("privacy", eventType);
    formData.append(
      "expires_at",
      !expiryTime ? "" : expirytext ? expirytext : ""
    );
    formData.append("handle", "event_post");
    formData.append("textarea", postText);
    formData.append("id", event_id);
    formData.append("colored_pattern", colorPat ? colorPat : 0);
    selectedTagFriends?.map((item, index) => {
      formData.append(`tagged_users_ids[${index}]`, item.id);
    });
    feeling_action != "" && feeling_value !== ""
      ? formData.append("feeling_action", feeling_action)
      : null;
    feeling_value != ""
      ? formData.append("feeling_value", feeling_value)
      : null;
    formData.append("location_img_url", snapURI);
    location_label != undefined
      ? formData.append("location_label", location_label)
      : null;
    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
      if (
        item.type == "mov" ||
        item?.type == "video/mp4" ||
        item?.type == "video/quicktime"
      ) {
        hasVideo = true;
      }
    });

    dispatch(
      postStatusNf({
        formData,
        token,
        postHasVideo: hasVideo,
        refresh: () => onRefresh(true),
      })
    );

    Toast.show(t("uploading...."));

    onPressDiscard();
  };

  const handleColorPat = (item) => {
    if (lineHeight < 175 && textToPost?.length) {
      setPattern(item);
      setColorPat(item.id);
      snapURI ? setSnapURI("") : null;
    } else if (lineHeight > 175 && !textToPost?.length) {
      Toast.show(
        t(
          "Text must not be more than more than 7 lines to fit in the color post."
        ),
        Toast.SHORT
      );
      return;
    } else if (!textToPost?.length) {
      setPattern(item);
      setColorPat(item.id);
      snapURI ? setSnapURI("") : null;
    } else {
      Toast.show(
        t(
          "Text must not be more than more than 7 lines to fit in the color post."
        ),
        Toast.SHORT
      );
    }
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
      videoQuality: "high",
      durationLimit: 30,
    };

    let isCameraPermitted = await requestCameraPermission();

    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          if (multipleImages.length > 0) {
            setColorVisibility(true);
          } else {
            setColorVisibility(false);
          }
          return;
        } else if (response.errorCode == "camera_unavailable") {
          setColorVisibility(false);
          return;
        } else if (response.errorCode == "permission") {
          setColorVisibility(false);
          return;
        } else if (response.errorCode == "others") {
          setColorVisibility(false);
          return;
        }

        setPickerModalVisibile(false);

        if (response.assets.length) {
          setMultipleImages((prev) => {
            afterMediaSelected(response.assets);
            let newImgs = response.assets.map((item, index) => {
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
            return prev.concat(newImgs);
          });
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
        // console.log("User cancelled camera picker");
        if (multipleImages.length > 0) {
          setColorVisibility(true);
        } else {
          setColorVisibility(false);
        }
        return;
      } else if (response.errorCode == "camera_unavailable") {
        // console.log("Camera not available on device");
        setColorVisibility(false);
        return;
      } else if (response.errorCode == "permission") {
        // console.log("Permission not satisfied");
        setColorVisibility(false);
        return;
      } else if (response.errorCode == "others") {
        // console.log(response.errorMessage);
        setColorVisibility(false);
        return;
      }

      setPickerModalVisibile(false);

      if (response.assets.length) {
        setMultipleImages((prev) => {
          const newImgs = response.assets.map((item, index) => {
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

          if (newImgs.length + prev.length > imagePickingLimit) {
            Toast.show(
              `only ${imagePickingLimit} media items are allowed`,
              Toast.SHORT
            );
            return prev;
          }

          afterMediaSelected(response.assets);
          return prev.concat(newImgs);
        });

        // snapURI ? setSnapURI("") : null;
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

    if (img && vid) changePlaceholderString(t("Say something about this..."));
    else if (multipleImages.length) {
      let hasImages = await multipleImages.some((el) => {
        const type = mime.getType(el.uri).split("/")[0];
        return type == "image";
      });

      let hasVideos = await multipleImages.some((el) => {
        const type = mime.getType(el.uri).split("/")[0];
        return type == "video";
      });

      if (hasImages && hasVideos)
        changePlaceholderString(t("Say something about this..."));
      else if (img && hasImages)
        changePlaceholderString(t("Say something about these images..."));
      else if (vid && hasVideos)
        changePlaceholderString(t("Say something about these videos..."));
      else changePlaceholderString(t("Say something about this..."));
    } else {
      if (img && media.length == 1)
        changePlaceholderString(t("Say something about this image..."));
      else if (img && media.length > 1)
        changePlaceholderString(t("Say something about these images..."));
      else if (vid && media.length == 1)
        changePlaceholderString(t("Say something about this video..."));
      else if (vid && media.length > 1)
        changePlaceholderString(t("Say something about these videos..."));
      else changePlaceholderString("");
    }
  };

  const setPrivacyPicker = (val) => {
    setPrivacyPickerValue(val);
  };

  const setFellingAction = (val) => {
    setFeeling_action(val);
  };

  const setFellingValue = (val) => {
    setFeeling_value(val);
  };

  const onPressCheckIn = () => {
    setPage(location);
    setCheckIn(true);
  };

  const deleteItem = (uri, map) => {
    if (map === "map") {
      setSnapURI("");
    } else if (uri?.type === "image") {
      setItem("");
    }
    const media = multipleImages?.filter((i) => i?.uri !== uri?.uri);
    setMultipleImages(media);

    let hasImages = media?.some((el) => {
      const type = mime?.getType(el.uri).split("/")[0];
      return type == "image";
    });

    let hasVideos = media?.some((el) => {
      const type = mime?.getType(el.uri).split("/")[0];
      return type == "video";
    });

    if (hasImages && hasVideos)
      changePlaceholderString(t("Say something about this..."));
    else if (hasImages && media.length == 1)
      changePlaceholderString(t("Say something about this image..."));
    else if (hasImages && media.length > 1)
      changePlaceholderString(t("Say something about these images..."));
    else if (hasVideos && media.length == 1)
      changePlaceholderString(t("Say something about this video..."));
    else if (hasVideos && media.length > 1)
      changePlaceholderString(t("Say something about these videos..."));
    else changePlaceholderString("");
  };

  const onPressImage = (item) => {
    setShowImagePath(item);
    setModalVisible(true);
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

  const onPressBack = () => {
    if (page == feeling) {
      setPage(selection);
    } else if (page == TagPeople) {
      setPage(selection);
    } else if (page == location) {
      setPage(selection);
      setCheckIn(false);
    } else if (page === ExpiryDate) {
      setPage(selection);
    } else {
      setisBar(false);

      if (
        postText ||
        multipleImages?.length ||
        feelingFlatList ||
        Feeling ||
        CheckIn ||
        location_label ||
        showColors ||
        selectedTagFriends?.length ||
        item
      ) {
        setDiscardModalVisible(true);
      } else goBack();
    }
  };

  const onPressCloseColorPatterns = () => {
    setShowColors(false);
    setPattern(),
      //  setPostBackgroundColor();
      setColorPat(false);
    setImageVideoVisibility(false);
  };

  const onPressDiscard = () => {
    setDiscardModalVisible(false);
    setPostText("");
    setPrivacyPickerValue("public");
    setTagPickerValue(1);
    setMultipleImages([]);
    setSnapURI("");
    setLocation_label();
    setCheckIn(false);
    setFeelingFlatList(false);
    setFeeling_action("");
    setFeeling_value("");
    setFeeling(false);
    setShowColors(false);
    setPattern(),
      //  setPostBackgroundColor();
      setColorPat(false);
    setColorVisibility(false);
    setImageVideoVisibility(false);
    setisBar(false);
    setLinesUsed(0);
    setLineHeight(0);
    setSelectedTagFriends([]);
    setAddSelectedTagFriends([]);
    setShowNonSelectedFriendList([]);
    goBack();
  };

  const hideFeelings = () => {
    setFeeling(false);
    setFeelingFlatList(false);
    setisFocus(false);
    setPage(selection);
  };

  const onCloseBottomSheet = () => {
    setisBar(true);
    // bottomSheetRef.current.snapTo(1);
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
    // colorVisibility ? setColorVisibility(false) : null;
    showColors ? setShowColors(false) : null;
    pattern ? setPattern() : null,
      // postBackgroundColor ? setPostBackgroundColor() : null;
      colorPat ? setColorPat(false) : null;
  };

  const onLinesDecreased = () => {
    // setImageVideoVisibility(false);
    // setShowColors(false);
    // setPattern(),setPostBackgroundColor();
    // setColorPat(false);
    // setColorVisibility(false);
  };

  const getFriends = async (val) => {
    setUserNameValue(val);
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        route: room
          ? `users/get-friends/for-tag-in-post?handle=room_post&id=${room_id}&limit=${10}&query=${val}`
          : group
          ? `users/get-friends/for-tag-in-post?handle=group_post&id=${group_id}&limit=${10}&query=${val}`
          : event
          ? `users/get-friends/for-tag-in-post?handle=event_post&id=${event_id}&limit=${10}&query=${val}`
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
          ? `users/get-friends/for-tag-in-post?handle=room_post&id=${room_id}&page=${currentPage}&limit=${10}`
          : group
          ? `users/get-friends/for-tag-in-post?handle=group_post&id=${group_id}&page=${currentPage}&limit=${10}`
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

  const onEndReached = () => {
    setCurrentPage(currentPage + 1);
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
      const filteredFriends = tagFriendsList.filter(
        (friend) =>
          !selectedTagFriends.some(
            (selectedFriend) => friend.id === selectedFriend.id
          )
      );
      setShowNonSelectedFriendList(filteredFriends);
    }
  }, [tagFriendsList, selectedTagFriends]);
  useEffect(() => {
    if (friends.length > 0) {
      const filteredFriends = friends.filter(
        (friend) =>
          !selectedTagFriends.some(
            (selectedFriend) => friend.id === selectedFriend.id
          )
      );
      setShowNonSelectedFriendList(filteredFriends);
    }
  }, [friends, selectedTagFriends]);

  useEffect(() => {
    if (searchedFriends.length > 0) {
      const filteredFriends = searchedFriends.filter(
        (friend) =>
          !selectedTagFriends.some(
            (selectedFriend) => friend.id === selectedFriend.id
          )
      );
      setShowNonSelectedFriendList(filteredFriends);
    }
  }, [friends, selectedTagFriends, searchedFriends]);

  const onPressTagPeople = () => {
    setPage(TagPeople);
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

  const onPressAddExpiry = () => {
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

  const setExpiryFunc = () => {
    setPage(ExpiryDate);
    setTempDate(date);
    setExpiryTemptextFromNow(expirytextFromNow);
    setExpiryTempText(expirytext);
    setExpiryTempTime(expiryTime);

    const pickerValue = getPickerValueFromDate(date, expiryTime);
    setValue(pickerValue);

    if (!expirytext) {
      setDefaultExpiryTime();
    }
  };

  const calculateExpiryDate = (monthsToAdd) => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
    return currentDate;
  };

  useEffect(() => {
    setValue(t("3")); // Default to 3 months on first load
  }, []);

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

      const currentDate = new Date();
      setTempDate(currentDate);
      setExpiryDateDesign(false);

      if (Platform.OS === "android") {
        onChange({ type: "set" }, currentDate);
      } else {
        onIosDateChange(currentDate);
      }

      return;
    }

    const newDate = monthsMap[itemValue]
      ? calculateExpiryDate(monthsMap[itemValue])
      : new Date();

    setTempDate(newDate);
    if (Platform.OS === "android") {
      onChange({ type: "set" }, newDate);
    } else {
      onIosDateChange(newDate);
    }
  };

  const onPressDoneExpiry = () => {
    setDate(tempDate);
    setExpirytextFromNow(expiryTemptextFromNow);
    setExpirytext(expiryTempText);
    setExpiryTime(expiryTempTime);

    const pickerValue = getPickerValueFromDate(tempDate, expiryTempTime);
    setValue(pickerValue);

    setPage(selection);
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
      height: 45,
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

    btn: {
      width: WP(20),
      height: HP(6),
      backgroundColor: "#D3D3D3",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      // alignContent: "center",
      borderRadius: 5,
      // paddingHorizontal: WP(1),
      // paddingVertical: WP(2),
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
    feelContainer: {
      flex: 1,
      width: WP(100),
    },
    postBtnView: {
      borderBottomWidth: 1,
      borderBottomColor: "#D3D3D3",
      height: HP(3),
      backgroundColor: "#D3D3D3",
    },
    belowsContainer: {
      // marginTop: HP(0.1),
      width: "100%",
      justifyContent: "space-around",
      flexDirection: "row",
      height: HP(8),
    },
    headerTitle: {
      fontWeight: "bold",
      fontSize: 20,
      color: "#DF4B38",
    },
    colorShow: {
      height: 60,
      marginTop: HP(1),

      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row-reverse",
    },
    iosviewPickerGen: {
      borderColor: "#000",
      borderWidth: 0.5,
      justifyContent: "space-between",
      width: WP(25),
      height: HP(3),
      borderRadius: 5,
      paddingHorizontal: WP(3),

      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
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
    iosviewPicker: {
      borderColor: "#000",
      borderWidth: 0.5,
      justifyContent: "space-between",
      minWidth: WP(25),

      height: HP(3),
      borderRadius: 5,
      paddingHorizontal: WP(3),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
    },

    headerTitleView: {
      alignSelf: "center",
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
      borderColor: "black",
      justifyContent: "center",
      width: WP(38),
      height: HP(4),
      borderRadius: 5,
      backgroundColor: "#F5F5F5",
      marginRight: 5,
    },

    picker: {
      backgroundColor: "red",
      color: "blue",
      fontFamily: "Ebrima",
      fontSize: 1,
      color: "#DF4B38",
    },

    txt: {
      fontWeight: "bold",
      marginLeft: WP(1),
      fontSize: 12,
      flexWrap: "wrap",
      color: "black",
      flex: 1,
      textAlign: "left",
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

    disableTxt: {
      fontWeight: "bold",
      marginLeft: WP(1),
      fontSize: 12,
      flexWrap: "wrap",
      flex: 1,
      color: "#F5F5F5",
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

      backgroundColor: "white",
      borderRadius: 20,
      paddingHorizontal: 35,
      // alignItems: "center",
      shadowColor: "#000",
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

      backgroundColor: "#DF4B38",
    },
    addButton: {
      marginTop: 20,
      borderRadius: 10,
      padding: 10,
      elevation: 2,

      backgroundColor: COLORS.primary,
    },
    DisButton: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,

      backgroundColor: "#cccccc",
    },
    addDisButton: {
      marginTop: 10,
      borderRadius: 10,
      padding: 10,
      elevation: 2,

      backgroundColor: COLORS.cocoGrey,
    },

    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    keyboardDismissButton: {
      backgroundColor: "#D3D3D3",
      position: "absolute",
      zIndex: 100,
      right: 0,
      paddingHorizontal: 10,
      shadowColor: "#000",
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
      backgroundColor: "#E6ECF5",
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
      color: "#8C91AB",
    },
    pickerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginLeft: 5,
      marginTop: 5,
      // backgroundColor: "red",
      width: "90%",
    },

    roomPickerContainer: {
      flexDirection: "row",
      marginLeft: 5,
      marginTop: 5,
      // backgroundColor: "red",
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
    bottomBarIconWrapper: {
      paddingVertical: HP(1.7),
      paddingHorizontal: WP(3),
      bottom: 5,
      // backgroundColor: "red",
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
      backgroundColor: "white",
      width: "80%",
      alignSelf: "center",
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,

      elevation: 8,
    },
    taggedPersonBox: {
      backgroundColor: "#C0C0C0",
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
      marginRight: 50,
      borderRadius: 10,
      maxWidth: WP(45.5),
      marginRight: 5,
      marginTop: 5,
    },
    txtInput2: {
      // height: HP(5),
      fontSize: WP(5),
      backgroundColor: "#C0C0C0",
      marginVertical: 10,
      paddingVertical: HP(1.1),
      paddingHorizontal: 10,
      justifyContent: "center",

      borderRadius: 10,
    },

    iosRoomViewPicker: {
      borderColor: "#D3D3D3",
      borderWidth: 0.5,
      justifyContent: "space-between",
      width: WP(25),
      height: HP(3),
      borderRadius: 5,
      paddingHorizontal: WP(3),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#D3D3D3",
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

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => onPressBack()}
      visible={visible}
      style={{ margin: 0 }}
      avoidKeyboard
      propagateSwipe
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { marginTop: insets?.top }]}>
          {page == selection ? (
            <View style={[styles.container]}>
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
                        backgroundColor: "white",
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

                        <Text style={styles.txt}>{t("Feelings/Activity")}</Text>
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
                                colorVisibility ? styles.disableTxt : styles.txt
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
                ></BottomSheet>
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
                  <Text style={styles.headerTitle}>{t("Create Post")}</Text>
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
                  <Text style={styles.textStyle}>{t("Post")}</Text>
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
                      uri={
                        SITE_URL + "frontend/img/" + pattern.background_image
                      }
                      value={postText}
                      timelinePlaceholder={
                        dataOfPostOntimeline?.timelinePlaceholder
                      }
                      loc={location_label}
                      onLayout={(e) => onLayout(e)}
                      feeling_action={feeling_action}
                      feeling_value={feeling_value}
                      onFocus={() => {
                        setisBar(true);
                      }}
                      onPressFeeling={() => setPage(feeling)}
                      onPressTagged={() => {
                        // getFriends("");
                        setPage(TagPeople);
                      }}
                      onPressLocation={onPressCheckIn}
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
                            <TouchableOpacity
                              disabled={room}
                              style={[
                                styles.iosviewPicker,
                                {
                                  height:
                                    Platform.OS == "android" ? HP(4) : null,
                                  maxWidth:
                                    Platform.OS == "android" ? HP(20) : null,
                                },
                              ]}
                              onPress={() => setMyVisiblePrivacy(true)}
                            >
                              {privacyNewPost(
                                privacyPickerValue,
                                "black",
                                true
                              )}
                              <Text style={{}}>
                                {selectedPrivacyOption
                                  ? t(selectedPrivacyOption.title)
                                  : ""}
                              </Text>
                              {ICONS.fontAwesome5("caret-down", COLORS.primary)}
                            </TouchableOpacity>
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

                            {Platform.OS == "android" ? (
                              <>
                                <TouchableOpacity
                                  disabled={room || group || event}
                                  style={[
                                    room || group || event
                                      ? styles.iosRoomViewPicker
                                      : styles.androidViewPickerGen,
                                  ]}
                                  onPress={() => setMyVisible(true)}
                                >
                                  <Text style={{ paddingRight: 5 }}>
                                    {tags(tagPickerValue)}
                                  </Text>
                                  <Icon name="caret-down" color="#DF4B38" />
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
                                  setValueFunc={(val) => setTagPickerValue(val)}
                                  data={tagsData}
                                  hideVisible={() => setMyVisible(false)}
                                />
                              </>
                            )}
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
                      timelinePlaceholder={
                        dataOfPostOntimeline?.timelinePlaceholder
                      }
                      loc={location_label}
                      feeling_action={feeling_action}
                      feeling_value={feeling_value}
                      onPressFeeling={() => setPage(feeling)}
                      onPressLocation={onPressCheckIn}
                      onLayout={(e) => onLayout(e)}
                      onPressTagged={() => {
                        setPage(TagPeople);
                      }}
                      onFocus={() => {
                        setisBar(true);
                      }}
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
                            {!room && !group && !event && (
                              <>
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
                                    "black",
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
                                  hideVisible={() => setMyVisiblePrivacy(false)}
                                />
                              </>
                            )}

                            {Platform.OS == "android" ? (
                              <>
                                <TouchableOpacity
                                  disabled={room || group || event}
                                  style={[
                                    room || group || event
                                      ? styles.iosRoomViewPicker
                                      : styles.androidViewPickerGen,
                                  ]}
                                  onPress={() => setMyVisible(true)}
                                >
                                  <Text style={{ paddingRight: 5 }}>
                                    {tags(tagPickerValue)}
                                  </Text>
                                  <Icon name="caret-down" color="#DF4B38" />
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
                                {!room && !group && !event && (
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
                                )}
                              </>
                            )}
                          </>
                        )}
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
                    loc={location_label}
                    tags={addSelectedTagFriends}
                    value={postText}
                    timelinePlaceholder={
                      dataOfPostOntimeline?.timelinePlaceholder
                    }
                    deleteItem={deleteItem}
                    onPressImage={onPressImage}
                    multipleImages={multipleImages}
                    AiImage={item}
                    handleText={setMyPostText}
                    snapURI={snapURI}
                    setSnapURI={setSnapURI}
                    feeling_action={feeling_action}
                    feeling_value={feeling_value}
                    onLayout={(e) => onLayout(e)}
                    onFocus={() => {
                      setisBar(true);
                    }}
                    onPressFeeling={() => setPage(feeling)}
                    onPressTagged={() => {
                      setPage(TagPeople);
                    }}
                    onPressLocation={onPressCheckIn}
                  >
                    <View
                      style={[
                        room || group || event
                          ? styles.roomPickerContainer
                          : styles.pickerContainer,
                      ]}
                    >
                      {!room && !group && !event ? (
                        <>
                          <TouchableOpacity
                            disabled={room}
                            style={[
                              room
                                ? styles.iosRoomViewPicker
                                : styles.iosviewPicker,
                              {
                                height: Platform.OS == "android" ? HP(4) : null,
                                maxWidth:
                                  Platform.OS == "android" ? HP(20) : null,
                              },
                            ]}
                            onPress={() => setMyVisiblePrivacy(true)}
                          >
                            {privacyNewPost(privacyPickerValue, "black", true)}
                            <Text style={{ paddingHorizontal: 5 }}>
                              {selectedPrivacyOption
                                ? t(selectedPrivacyOption.title)
                                : ""}
                            </Text>
                            {ICONS.fontAwesome5("caret-down", COLORS.primary)}
                          </TouchableOpacity>
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
                      ) : (group && gropuPrivacy == "public") ||
                        (event && eventType == "public") ? (
                        ICONS.fontAwesome5("globe", COLORS.primary, 18, {
                          marginHorizontal: 10,
                          marginVertical: 3,
                        })
                      ) : (
                        <Icon
                          name="lock"
                          size={18}
                          color={"#DF4B38"}
                          style={{ marginHorizontal: 10, marginVertical: 3 }}
                        />
                      )}

                      {!room && !group && !event ? (
                        Platform.OS == "android" ? (
                          <>
                            <TouchableOpacity
                              disabled={room || group || event}
                              style={[
                                room || group || event
                                  ? styles.iosRoomViewPicker
                                  : styles.androidViewPickerGen,
                              ]}
                              onPress={() => setMyVisible(true)}
                            >
                              <Text style={{ paddingRight: 5 }}>
                                {tags(tagPickerValue)}
                              </Text>
                              <Icon name="caret-down" color="#DF4B38" />
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
                            <TouchableOpacity
                              disabled={room || group || event}
                              style={[
                                room || group || event
                                  ? styles.iosRoomViewPicker
                                  : styles.iosviewPickerGen,
                              ]}
                              onPress={() => setMyVisible(true)}
                            >
                              <Text style={{ paddingRight: 5 }}>
                                {tags(tagPickerValue)}
                              </Text>
                              <Icon name="caret-down" color="#DF4B38" />
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
                      ) : null}
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
                      <AntDesign
                        name="closecircleo"
                        style={{
                          color: "red",
                        }}
                        size={23}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                  <ColoredPatterns handleColorPat={handleColorPat} />
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
                feelingValue={feeling_value}
                setisFocus={setisFocus}
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
                    setPage(selection);
                  }}
                  onPressCross={() => {
                    setPage(selection);
                    setCheckIn(false);
                    setLocation_label();
                    setSnapURI("");
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
                    style={[styles.textStyle, { color: "black", fontSize: 15 }]}
                  >
                    {t("Tag People")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPressIn={onPressAddTags}
                >
                  <Text style={styles.textStyle}>{t("Done")}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginHorizontal: WP(3) }}>
                <TextInput
                  style={styles.txtInput2}
                  require={true}
                  onChangeText={(val) => getFriends(val)}
                  placeholder={`${t("Search")}${t("...")}`}
                />
                <View
                  style={{
                    justifyContent: "center",
                    maxHeight: 300,
                  }}
                >
                  <FlatList
                    data={selectedTagFriends}
                    keyExtractor={(i) => i.id}
                    numColumns={2}
                    ListHeaderComponent={
                      <>
                        {selectedTagFriends.length > 0 ? (
                          <View
                            style={{
                              alignItems: "flex-end",
                              paddingHorizontal: 5,
                            }}
                          >
                            <AntDesign
                              name="closecircleo"
                              style={{
                                color: "red",
                              }}
                              size={23}
                              color="white"
                              onPress={handleOnPressCrossSelectedTags}
                            />
                          </View>
                        ) : null}
                      </>
                    }
                    renderItem={({ item }) => (
                      <View style={[styles.taggedPersonBox]}>
                        <Text
                          adjustsFontSizeToFit
                          style={{ fontWeight: "bold", fontSize: WP(3.5) }}
                        >
                          {item?.first_name + " " + item?.last_name}
                        </Text>
                        <Icon
                          name="times-circle"
                          size={WP(5)}
                          color="red"
                          style={{ marginLeft: 2 }}
                          onPress={() => handleOnPressTagFriendsItemCross(item)}
                        />
                      </View>
                    )}
                  />
                </View>
                <FlatList
                  keyExtractor={(_item, index) => index}
                  style={{ flex: 1 }}
                  data={
                    userNameValue
                      ? showNonSelectedFriendList?.length > 0
                        ? showNonSelectedFriendList
                        : searchedFriends?.length === selectedTagFriends?.length
                        ? []
                        : searchedFriends
                      : showNonSelectedFriendList?.length > 0
                      ? showNonSelectedFriendList
                      : friends?.length === selectedTagFriends?.length
                      ? []
                      : friends
                  }
                  onEndReached={onEndReached}
                  ListFooterComponent={<></>}
                  ListEmptyComponent={() =>
                    loadingFriendsList ? (
                      <ActivityIndicator
                        animating={true}
                        size="large"
                        color={COLORS.primary}
                      />
                    ) : (
                      <>
                        {tagFriendsList?.length ||
                        (friends?.length >= 0 && []) ? (
                          <View style={styles.listEmptyBox}>
                            <Text style={{ fontSize: 23, color: "grey" }}>
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
                                    uri: SITE_URL + item?.profile_picture,
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
                  }}
                  outerStyle={styles.backButtonOuter}
                />
                <View
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: "white",
                      elevation: 0,
                    },
                  ]}
                >
                  <Text
                    style={[styles.textStyle, { color: "black", fontSize: 15 }]}
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
                        {expiryTempText ? expiryTempText : t("Set Expiry Date")}
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

                    {/* <Button
                      text={t("Clear")}
                      buttonstyle={[
                        styles.btn,
                        { height: Platform.OS == "ios" ? HP(5) : HP(6) },
                      ]}
                      textstyle={[
                        styles.txt,
                        { marginLeft: isRTL ? WP(1) : WP(5), fontSize: 15 },
                      ]}
                      pressFunction={() => {
                        setExpirytext("");
                        setDate(new Date());
                        setExpirytextFromNow("");
                        setExpiryDateDesign(false);
                      }}
                    /> */}
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
      {page == selection ? (
        <>
          {isBar && (
            <View style={styles.bottombar}>
              {!imageVideoVisibility ? (
                <TouchableOpacity
                  style={styles.bottomBarIconWrapper}
                  onPress={() => setPickerModalVisibile(true)}
                >
                  <FastImage
                    source={IMAGES.camera}
                    style={{ height: WP(5.1), width: WP(7) }}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.bottomBarIconWrapper}
                onPress={onPressTagPeople}
              >
                <FastImage source={IMAGES.userTag} style={styles.optionImage} />
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
                  onPress={() => (colorVisibility ? null : showColorsFunc())}
                  style={styles.bottomBarIconWrapper}
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
                {ICONS.antDesign("upcircleo", COLORS.black, 25)}
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
                    { bottom: 5 }
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      ) : null}

      {discardModalVisible && (
        <DiscardModal
          isVisible={discardModalVisible}
          setIsVisible={setDiscardModalVisible}
          onDiscard={onPressDiscard}
        ></DiscardModal>
      )}
      {specificFrndModal && (
        <SpecificFriendModal
          specFrndModal={specificFrndModal}
          setSpecFrndModal={setSpecificFrndModal}
          specificFriends={specificFriends}
          setSpecificFriends={setSpecificFriends}
          setPrivacyPicker={setPrivacyPicker}
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
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        showImagePath={showImagePath}
        multipleImages={multipleImages}
      />
    </Modal>
  );
};

export default NewPostModal;
