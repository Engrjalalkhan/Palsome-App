import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Modal from "react-native-modal";
import Video from "react-native-video";
import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import MyHeader from "../../../Components/MyHeader";
import { HP, WP } from "../../../../Utils/Resposive";
import { getHeight } from "../../../../Utils/NewResponsive";
import ImagePickerModal from "../../../Components/ImagePickerModal";
import { setMyStory } from "../../../Redux/actions/NewsFeedActions";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import { postStatusApiCall, settingsApiCall } from "../../../Services/Apis";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../Utils/ImageAndCamera";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const MaxScrollViewHeight = hp(14);
const PostStory = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const [value, setValue] = useState([]);
  const [load, setload] = useState(false);
  const [paused, setPaused] = useState(false);
  const [textData, setTextData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalTwo, setmodalTwo] = useState(false);
  const [modalOne, setmodalOne] = useState(false);
  const [imageTopost, setImageTopost] = useState();
  const [multipleImages, setMultipleImages] = useState();
  const [contentHeight, setContentHeight] = useState(null);
  const [imageIsSelect, setImageIsSelect] = useState(true);
  const token = useSelector((state) => state.auth.userToken);
  const [storyprivacy, setStoryprivacy] = useState("public");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
  };
  const scrollViewHeight =
    contentHeight && contentHeight < MaxScrollViewHeight
      ? contentHeight
      : MaxScrollViewHeight;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardOpen(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const readyTwoPost = async () => {
    setload(true);
    setTimeout(() => {
      if (
        imageTopost?.type === "video/quicktime" ||
        imageTopost?.type === "video/mp4"
      ) {
        Toast.show(
          t(
            "Your story is being processed. We'll let you know when it's ready"
          ),
          Toast.LONG
        );
      } else {
        Toast.show("Creating your story...", Toast.LONG);
      }
    }, 3000);

    const formData = new FormData();
    formData.append("files[0]", imageTopost);
    if (Array.isArray(value) && value.length === 0) {
      formData.append("story_text", `["${value}"]`);
    } else {
      formData.append("story_text", `[${value}]`);
    }
    formData.append("story_privacy", storyprivacy);
    formData.append("temporary_story", 0);
    console.log("formdata==>jjj", JSON.stringify(formData, null, 2));

    const response = await postStatusApiCall({
      route: "story",
      verb: "POST",
      token: token,
      body: formData,
    });
    if (response.responseCode !== 200) {
      console.log("post story api response on error ===>", response);
      Toast.show("Please try again", Toast.LONG);
      navigation.navigate("NewsFeed");
    } else {
      loadStories();
      imageTopost == "image/jpeg" && loadStories();
      Toast.show("Story posted successfully", Toast.LONG);
    }
  };

  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
    };
    try {
      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      if (isCameraPermitted) {
        const resData = await launchCamera(options);
        console.log("Response = ", resData);
        if (resData?.didCancel) {
          setPickerModalVisibile(false);
          return;
        } else if (resData?.errorCode) {
          console.log("error in opening camera", resData?.errorCode);
        } else if (resData?.errorMessage) {
          console.log("error in opening camera", resData?.errorMessage);
        } else if (resData.errorCode == "camera_unavailable") {
          console.log("Camera not available on device");
          return;
        } else if (resData.errorCode == "permission") {
          console.log("Permission not satisfied");
          return;
        } else if (resData.errorCode == "others") {
          console.log(resData.errorMessage);
        } else {
          console.log(resData, "RESDATAINCaptue");
          setPickerModalVisibile(false);
          setImageTopost({
            uri: resData?.assets[0]?.uri,
            type: resData?.assets[0]?.type
              ? resData?.assets[0]?.type
              : "video/mp4",
            name: resData?.assets[0]?.fileName,
          });
          setImageIsSelect(false);
          setmodalTwo(true);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const loadStories = async () => {
    try {
      const res = await settingsApiCall({
        route: "story",
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 in fetch Stories ===>junaid", res);
      } else if (res.responseCode == 200) {
        const result = res?.payload?.data?.my_story;
        result == dispatch(setMyStory(res?.payload?.data?.my_story));
        console.log(dispatch(setMyStory(res?.payload?.data?.my_story)));
      }
    } catch (error) {
      console.log("saga loadStories error -- ", error.toString());
    }
  };

  const handleValue = (text) => {
    const sanitizedText = text.replace(/(\r\n|\n|\r)/gm, "\\n");
    setValue((prevArray) => {
      const newArray = [...prevArray];
      newArray[0] = `"${sanitizedText}"`;
      return newArray;
    });
  };

  const handleChange = (text, index) => {
    const formattedTextData = text.replace(/^\"+|\"+$/g, "");

    for (let i = 0; i < multipleImages.length; i++) {
      if (index == i) {
        setTextData((prev) => {
          textData[i] = `"${formattedTextData}"`;
          return textData;
        });
      } else if (index != i && !textData[i]) {
        setTextData((prev) => {
          textData[i] = `"${""}"`;
          return textData;
        });
      }
    }
  };

  const readyToPost = async () => {
    setload(true);
    setTimeout(() => {
      if (
        multipleImages.some(
          (item) =>
            item?.type === "video/mp4" || item?.type === "video/quicktime"
        )
      ) {
        Toast.show(
          t(
            "Your story is being processed. We'll let you know when it's ready"
          ),
          Toast.LONG
        );
      } else {
        Toast.show("Creating your story...", Toast.LONG);
      }
    }, 2000);

    const formData = new FormData();
    multipleImages?.map((item, index) => {
      formData.append(`files[${index}]`, item);
    });
    if (textData.length) {
      formData.append("story_text", `[${textData}]`);
    } else {
      let arr = new Array(multipleImages?.length).fill(`"${""}"`);
      formData.append("story_text", `[${arr}]`);
    }
    formData.append("story_privacy", storyprivacy);
    formData.append("temporary_story", 0);
    setTimeout(async () => {
      const response = await postStatusApiCall({
        route: "story",
        verb: "POST",
        token: token,
        body: formData,
      });
      if (response.responseCode !== 200) {
        Toast.show("Story upload failed, please try again.", Toast.LONG);
        navigation.navigate("NewsFeed");
      } else {
        Toast.show("Story posted successfully", Toast.LONG);
        loadStories();
      }
    }, 2000);

    imageTopost == "image/jpeg" && loadStories();
  };

  const imgRegex = /jpg|png|jpeg/g;
  const videoRegex = /mp4|mov|m4v|mkv/g;
  const chooseImageGallery = () => {
    if (Platform.OS === "ios") {
      setTimeout(() => {
        setLoading(true);
      }, 500);
    }
    // setColorVisibility(true);
    let options = {
      mediaType: "mixed",
      quality: 1,
      noData: true,
      selectionLimit: 6,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera picker");
        setLoading(false);
        return;
      } else if (response.errorCode === "camera_unavailable") {
        console.log("Camera not available on the device");
        setLoading(false);
        Toast.show("Camera not available on the device", Toast.LONG);
        return;
      } else if (response.errorCode === "permission") {
        console.log("Permission not satisfied");
        setLoading(false);
        Toast.show("Permission not satisfied", Toast.LONG);
        return;
      } else if (response.errorCode === "others") {
        console.log(response.errorMessage);
        setLoading(false);
        Toast.show(response.errorMessage, Toast.LONG);
        return;
      }

      if (response.assets.length === 0) {
        setLoading(false);
        return;
      }

      let invalidAssetFound = false;

      response.assets.forEach((asset) => {
        if (asset.duration > 60) {
          invalidAssetFound = true;
          Toast.show(
            "Please select a video of maximum 60 seconds length",
            Toast.LONG
          );
        } else if (asset.fileSize > 120 * 1024 * 1024) {
          invalidAssetFound = true;
          Toast.show(
            "Your file is too big! Max allowed size is: 120MB",
            Toast.LONG
          );
        }
      });

      if (invalidAssetFound) {
        setLoading(false);
        return;
      }

      const selectedImages = response.assets.map((item, index) => {
        return {
          uri: item.uri.match(imgRegex) ? item.uri : item.uri,
          type: item.type ? item.type : "video/mp4",
          name: item.uri.match(imgRegex)
            ? item.fileName
            : item.fileName + ".mp4",
        };
      });
      setMultipleImages(selectedImages);
      setLoading(false);
      setImageIsSelect(false);
      setmodalOne(true);
    });
  };

  const onPressTrash = (item) => {
    if (multipleImages.length > 1) {
      setMultipleImages(multipleImages.filter((it) => it.uri !== item.uri));
    } else setmodalOne(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View style={{ marginTop: getHeight(50) }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          <MyHeader goBack={() => navigation.goBack()} />
          <View style={styles.container}>
            <ImagePickerModal
              showGallery={false}
              visible={pickerModalVisibile}
              hideVisible={() => setPickerModalVisibile(false)}
              cameraVideo={() => captureImage("video")}
              cameraImage={() => captureImage("image")}
            />

            <Modal
              isVisible={modalTwo}
              animationIn={"zoomInUp"}
              animationOut={"zoomOutUp"}
              animationInTiming={700}
              animationOutTiming={1000}
              onBackButtonPress={() => setmodalOne(false)}
              style={{
                flex: 1,
                height: hp(100),
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                width: wp(100),
              }}
            >
              <View
                style={{
                  width: wp(100),
                  height: hp(100),
                  flex: 1,
                  backgroundColor: "black",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: Platform.OS == "ios" ? hp(2) : hp(0.5),
                  }}
                >
                  <TouchableOpacity
                    disabled={load}
                    onPress={() =>
                      Alert.alert(
                        t("Are you sure?"),
                        t("You really want to discard?"),
                        [
                          {
                            text: t("Yes"),
                            onPress: () => {
                              navigation.navigate("NewsFeed");
                            },
                          },

                          {
                            text: t("No"),
                          },
                        ]
                      )
                    }
                    style={styles.crossStyle}
                  >
                    {ICONS.entypo("cross", load ? "gray" : COLORS.white, 28)}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {imageTopost?.type == "video/quicktime" ||
                    imageTopost?.type == "video/mp4" ? (
                      <TouchableWithoutFeedback
                        disabled={load}
                        onPress={() => {
                          setPaused(!paused);
                          Keyboard.dismiss();
                        }}
                      >
                        <Video
                          volume={0.5}
                          rate={1.0}
                          resizeMode="contain"
                          play={false}
                          mute={true}
                          repeat={true}
                          paused={paused}
                          automaticallyWaitsToMinimizeStalling={true}
                          source={{
                            uri: imageTopost?.uri,
                          }}
                          style={styles.videoStyle}
                        />
                      </TouchableWithoutFeedback>
                    ) : (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          Keyboard.dismiss();
                        }}
                      >
                        <ImageBackground
                          source={{ uri: imageTopost?.uri }}
                          resizeMode={"contain"}
                          style={{
                            width: wp(100),
                            flex: 1,
                            height: hp(90),
                            borderRadius: wp(3),
                          }}
                        ></ImageBackground>
                      </TouchableWithoutFeedback>
                    )}

                    {load ? (
                      <View
                        style={{
                          flex: 1,
                          width: wp(20),
                          height: hp(10),

                          position: "absolute",
                          justifyContent: "center",
                          alignItems: "center",
                          top: hp(40),
                          left: wp(40),
                          zIndex: 1000,
                          borderRadius: 40,
                        }}
                      >
                        <ActivityIndicator size={45} color={COLORS.primary} />
                      </View>
                    ) : null}
                    <NewsFeedText />

                    {Platform.OS == "android" ? (
                      <View style={[styles.inputcontainer, { width: wp(100) }]}>
                        <View style={[styles.inputView, { width: wp(80) }]}>
                          <ScrollView
                            onContentSizeChange={handleContentSizeChange}
                            style={{ height: scrollViewHeight }}
                          >
                            <TextInput
                              value={value}
                              snapToAlignment={"start"}
                              textAlignVertical={"auto"}
                              onChangeText={(val) => handleValue(val)}
                              style={styles.inputStyle}
                              placeholderTextColor="Gray"
                              multiline
                              placeholder={t("Enter message...")}
                            />
                          </ScrollView>
                        </View>

                        <TouchableOpacity
                          disabled={load}
                          onPress={async () => {
                            try {
                              setPaused(true);
                              Keyboard.dismiss();
                              readyTwoPost();

                              setTimeout(() => {
                                navigation.navigate("NewsFeed");
                              }, 2000);
                            } catch (error) {
                              console.log(" error in story submit button");
                            }

                            Keyboard.dismiss();
                            setPaused(true);
                          }}
                          style={[
                            styles.sendStyle,
                            {
                              backgroundColor: load ? "gray" : COLORS.primary,
                            },
                            {
                              transform: [
                                { rotate: isRTL ? "180deg" : "0deg" },
                              ],
                            },
                          ]}
                        >
                          {ICONS.ionIcons("md-send-sharp", COLORS.white, 25)}
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <KeyboardAvoidingView
                        keyboardVerticalOffset={hp(8)}
                        behavior={"position"}
                      >
                        <View
                          style={[styles.inputcontainer, { width: wp(100) }]}
                        >
                          <View style={[styles.inputView, { width: wp(80) }]}>
                            <ScrollView
                              onContentSizeChange={handleContentSizeChange}
                              style={{ height: scrollViewHeight }}
                            >
                              <TextInput
                                editable={!load}
                                value={value}
                                snapToAlignment={"start"}
                                textAlignVertical={"auto"}
                                onChangeText={(val) => handleValue(val)}
                                style={styles.inputStyle}
                                placeholderTextColor="Gray"
                                multiline
                                placeholder={t("Enter message...")}
                              />
                            </ScrollView>
                          </View>

                          <TouchableOpacity
                            disabled={load}
                            onPress={() => {
                              setPaused(true);
                              Keyboard.dismiss();
                              readyTwoPost();

                              setTimeout(() => {
                                navigation.navigate("NewsFeed");
                              }, 2000);

                              Keyboard.dismiss();
                              setPaused(true);
                            }}
                            style={[
                              styles.sendStyle,
                              {
                                backgroundColor: load ? "gray" : COLORS.primary,
                              },
                            ]}
                          >
                            {ICONS.ionIcons("ios-send", COLORS.white, 20)}
                          </TouchableOpacity>
                        </View>
                      </KeyboardAvoidingView>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
            {Platform.OS === "android" ? (
              <Modal
                isVisible={modalOne}
                animationIn={"zoomInUp"}
                animationOut={"zoomOutUp"}
                animationInTiming={700}
                animationOutTiming={1000}
                onBackButtonPress={() => setmodalOne(false)}
                style={{
                  flex: 1,
                  height: hp(100),
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  width: wp(100),
                }}
              >
                <View
                  style={{
                    width: wp(100),
                    height: hp(100),
                    flex: 1,
                    backgroundColor: "black",

                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // backgroundColor: COLORS.white,
                      paddingTop: Platform.OS == "ios" ? hp(2) : hp(0.5),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setmodalOne(false)}
                      disabled={load}
                      style={styles.crossStyle}
                    >
                      {ICONS.entypo("cross", load ? "gray" : COLORS.white, 30)}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,

                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FlatList
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      data={multipleImages}
                      style={{ flex: 1 }}
                      renderItem={({ item, index }) => (
                        <>
                          <View
                            style={{
                              borderRadius: 50,
                              padding: 8,
                              backgroundColor: COLORS.lightGray,
                              position: "absolute",
                              right: WP(2.5),
                              top: WP(1),
                              zIndex: 1000,
                            }}
                          >
                            <TouchableOpacity
                              disabled={load}
                              onPress={() => onPressTrash(item)}
                            >
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                color={load ? "gray" : COLORS.white}
                                size={WP(7)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{ flex: 1 }}>
                            {item.type === "video/mp4" ||
                            item.type === "video/webm" ? (
                              <>
                                <Video
                                  repeat={true}
                                  volume={0.5}
                                  rate={1.0}
                                  resizeMode="cover"
                                  play={false}
                                  mute={true}
                                  paused={false}
                                  automaticallyWaitsToMinimizeStalling={true}
                                  source={{
                                    uri: item.uri,
                                  }}
                                  style={styles.videoStyle}
                                />
                              </>
                            ) : (
                              <ImageBackground
                                ImageBackground
                                source={{ uri: item.uri }}
                                resizeMode={"contain"}
                                style={{
                                  width: wp(100),
                                  flex: 1,
                                  height: hp(90),
                                  borderRadius: wp(3),
                                }}
                              ></ImageBackground>
                            )}

                            {load ? (
                              <View
                                style={{
                                  flex: 1,
                                  width: wp(20),
                                  height: hp(10),

                                  position: "absolute",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  top: hp(40),
                                  left: wp(40),
                                  zIndex: 1000,
                                  borderRadius: 40,
                                }}
                              >
                                <ActivityIndicator
                                  size={45}
                                  color={COLORS.primary}
                                />
                              </View>
                            ) : null}
                            <NewsFeedText />

                            {Platform.OS == "android" ? (
                              <View
                                style={[
                                  styles.inputcontainer,
                                  { width: wp(100) },
                                ]}
                              >
                                <View
                                  style={[styles.inputView, { width: wp(80) }]}
                                >
                                  <ScrollView
                                    onContentSizeChange={
                                      handleContentSizeChange
                                    }
                                    style={{ height: scrollViewHeight }}
                                  >
                                    <TextInput
                                      editable={!load}
                                      key={index}
                                      value={value}
                                      snapToAlignment={"start"}
                                      textAlignVertical={"auto"}
                                      // returnKeyType={''}
                                      onChangeText={(val) =>
                                        handleChange(val, index)
                                      }
                                      style={styles.inputStyle}
                                      placeholderTextColor="Gray"
                                      multiline
                                      placeholder={t("Enter message...")}
                                    />
                                  </ScrollView>
                                </View>

                                <TouchableOpacity
                                  onPress={() => {
                                    readyToPost();
                                    setTimeout(() => {
                                      navigation.navigate("NewsFeed");
                                    }, 1000);
                                  }}
                                  style={[
                                    styles.sendStyle,
                                    {
                                      backgroundColor: load
                                        ? "gray"
                                        : COLORS.primary,
                                    },
                                    {
                                      transform: [
                                        { rotate: isRTL ? "180deg" : "0deg" },
                                      ],
                                    },
                                  ]}
                                  disabled={load}
                                >
                                  {ICONS.ionIcons(
                                    "md-send-sharp",
                                    COLORS.white,
                                    25
                                  )}
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <KeyboardAvoidingView
                                keyboardVerticalOffset={hp(8)}
                                behavior={"position"}
                              >
                                <View
                                  style={[
                                    styles.inputcontainer,
                                    { width: wp(100) },
                                  ]}
                                >
                                  <View
                                    style={[
                                      styles.inputView,
                                      { width: wp(80) },
                                    ]}
                                  >
                                    <ScrollView
                                      onContentSizeChange={
                                        handleContentSizeChange
                                      }
                                      style={{ height: scrollViewHeight }}
                                    >
                                      <TextInput
                                        editable={!load}
                                        key={index}
                                        value={value}
                                        snapToAlignment={"start"}
                                        textAlignVertical={"auto"}
                                        onChangeText={(val) =>
                                          handleChange(val, index)
                                        }
                                        style={styles.inputStyle}
                                        placeholderTextColor="Gray"
                                        multiline
                                        placeholder={t("Enter message...")}
                                      />
                                    </ScrollView>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      readyToPost();
                                      setTimeout(() => {
                                        navigation.navigate("NewsFeed");
                                      }, 1000);
                                    }}
                                    style={[
                                      styles.sendStyle,
                                      {
                                        backgroundColor: load
                                          ? "gray"
                                          : COLORS.primary,
                                      },
                                      {
                                        transform: [
                                          { rotate: isRTL ? "180deg" : "0deg" },
                                        ],
                                      },
                                    ]}
                                    disabled={load}
                                  >
                                    {ICONS.ionIcons(
                                      "ios-send",
                                      COLORS.white,
                                      20
                                    )}
                                  </TouchableOpacity>
                                </View>
                              </KeyboardAvoidingView>
                            )}
                          </View>
                        </>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <Modal
                isVisible={modalOne}
                animationIn={"zoomInUp"}
                animationOut={"zoomOutUp"}
                animationInTiming={700}
                animationOutTiming={1000}
                onBackButtonPress={() => setmodalOne(false)}
                style={{
                  // flex: 1,
                  height: hp(100),
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  width: wp(100),
                }}
              >
                <View
                  style={{
                    height: hp(100),
                    backgroundColor: "black",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",

                      paddingTop: Platform.OS == "ios" ? hp(6) : hp(0.5),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setmodalOne(false)}
                      disabled={load}
                      style={styles.crossStyle}
                    >
                      {ICONS.entypo("cross", load ? "gray" : COLORS.white, 30)}
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FlatList
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      data={multipleImages}
                      style={{ flex: 1 }}
                      renderItem={({ item, index }) => (
                        <>
                          <View
                            style={{
                              borderRadius: 50,
                              padding: 8,
                              backgroundColor: COLORS.lightGray,
                              position: "absolute",
                              right: WP(2.5),
                              top: WP(1),
                              zIndex: 1000,
                            }}
                          >
                            <TouchableOpacity
                              disabled={load}
                              onPress={() => onPressTrash(item)}
                            >
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                color={load ? "gray" : COLORS.white}
                                size={WP(7)}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{ flex: 1 }}>
                            {item.type === "video/quicktime" ? (
                              <>
                                <Video
                                  repeat
                                  volume={0.5}
                                  rate={1.0}
                                  resizeMode="cover"
                                  play={false}
                                  mute={true}
                                  paused={false}
                                  automaticallyWaitsToMinimizeStalling={true}
                                  source={{
                                    uri: item.uri,
                                  }}
                                  style={styles.videoStyle}
                                />
                              </>
                            ) : item.type === "video/mp4" ? (
                              <Video
                                volume={0.5}
                                rate={1.0}
                                resizeMode="cover"
                                play={false}
                                mute={true}
                                repeat={true}
                                paused={false}
                                automaticallyWaitsToMinimizeStalling={true}
                                source={{
                                  uri: item.uri,
                                }}
                                style={styles.videoStyle}
                              />
                            ) : item?.type === "image/jpg" ||
                              item?.type === "image/png" ? (
                              <ImageBackground
                                ImageBackground
                                source={{ uri: item.uri }}
                                resizeMode={"contain"}
                                style={{
                                  width: wp(100),

                                  height: hp(87),
                                  borderRadius: wp(3),
                                }}
                              ></ImageBackground>
                            ) : null}

                            {load ? (
                              <View
                                style={{
                                  flex: 1,
                                  width: wp(20),
                                  height: hp(10),

                                  position: "absolute",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  top: hp(40),
                                  left: wp(40),
                                  zIndex: 1000,
                                  borderRadius: 40,
                                }}
                              >
                                <ActivityIndicator
                                  size={45}
                                  color={COLORS.primary}
                                />
                              </View>
                            ) : null}
                            <NewsFeedText />

                            {Platform.OS == "android" ? (
                              <View
                                style={[
                                  styles.inputcontainer,
                                  { width: wp(100) },
                                ]}
                              >
                                <View
                                  style={[styles.inputView, { width: wp(80) }]}
                                >
                                  <ScrollView
                                    onContentSizeChange={
                                      handleContentSizeChange
                                    }
                                    style={{ height: scrollViewHeight }}
                                  >
                                    <TextInput
                                      editable={!load}
                                      key={index}
                                      value={value}
                                      snapToAlignment={"start"}
                                      textAlignVertical={"auto"}
                                      onChangeText={(val) =>
                                        handleChange(val, index)
                                      }
                                      style={styles.inputStyle}
                                      placeholderTextColor="Gray"
                                      multiline
                                      placeholder={t("Enter message...")}
                                    />
                                  </ScrollView>
                                </View>

                                <TouchableOpacity
                                  onPress={() => {
                                    readyToPost();
                                    setTimeout(() => {
                                      navigation.navigate("NewsFeed");
                                    }, 1000);
                                  }}
                                  style={[
                                    styles.sendStyle,
                                    {
                                      backgroundColor: load
                                        ? "gray"
                                        : COLORS.primary,
                                    },
                                    {
                                      transform: [
                                        { rotate: isRTL ? "180deg" : "0deg" },
                                      ],
                                    },
                                  ]}
                                  disabled={load}
                                >
                                  {ICONS.ionIcons(
                                    "md-send-sharp",
                                    COLORS.white,
                                    25
                                  )}
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <KeyboardAvoidingView
                                keyboardVerticalOffset={hp(8)}
                                behavior={"position"}
                              >
                                <View
                                  style={[
                                    styles.inputcontainer,
                                    { width: wp(100), marginBottom: 13 },
                                  ]}
                                >
                                  <View
                                    style={[
                                      styles.inputView,
                                      { width: wp(80) },
                                    ]}
                                  >
                                    <ScrollView
                                      onContentSizeChange={
                                        handleContentSizeChange
                                      }
                                      style={{ height: scrollViewHeight }}
                                    >
                                      <TextInput
                                        editable={!load}
                                        key={index}
                                        value={value}
                                        snapToAlignment={"start"}
                                        textAlignVertical={"auto"}
                                        // returnKeyType={''}
                                        onChangeText={(val) =>
                                          handleChange(val, index)
                                        }
                                        style={[styles.inputStyle]}
                                        placeholderTextColor="Gray"
                                        multiline
                                        placeholder={t("Enter message...")}
                                      />
                                    </ScrollView>
                                  </View>

                                  <TouchableOpacity
                                    onPress={() => {
                                      readyToPost();
                                      setTimeout(() => {
                                        navigation.navigate("NewsFeed");
                                      }, 1000);
                                    }}
                                    style={[
                                      styles.sendStyle,
                                      {
                                        backgroundColor: load
                                          ? "gray"
                                          : COLORS.primary,
                                      },
                                      {
                                        transform: [
                                          { rotate: isRTL ? "180deg" : "0deg" },
                                        ],
                                      },
                                    ]}
                                    disabled={load}
                                  >
                                    {ICONS.ionIcons(
                                      "ios-send",
                                      COLORS.white,
                                      20
                                    )}
                                  </TouchableOpacity>
                                </View>
                              </KeyboardAvoidingView>
                            )}
                          </View>
                        </>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            )}
            <View style={styles.secondView}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => setPickerModalVisibile(true)}
              >
                <Text style={styles.textStyle}>{t("Take from camera")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonStyle, { marginTop: hp(5) }]}
                onPress={() => chooseImageGallery()}
              >
                <Text style={styles.textStyle}>{t("Select from Gallery")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonStyle, { marginTop: hp(5) }]}
                onPress={() => navigation.navigate("ColoredPost")}
              >
                <Text style={styles.textStyle}>{t("Text Story")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalFirstView: {
    backgroundColor: "red",
  },
  modalStyle: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  secondView: {
    width: wp(80),
    height: hp(50),
    alignItems: "center",
  },
  buttonStyle: {
    width: wp(60),
    height: hp(8),
    backgroundColor: COLORS.primary,
    borderRadius: wp(30),
    marginTop: hp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    fontSize: 18,
    flex: 1,
  },
  inputStyle2: {
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 18,
    color: COLORS.secondary,
  },
  indicatStyle: {
    flex: 1,
    width: wp(20),
    height: hp(10),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: hp(40),
    left: wp(40),
    borderRadius: 40,
  },
  deftex: {
    color: "white",
    backgroundColor: COLORS.primary,
    fontSize: 16,
    marginLeft: wp(1),
  },
  inputcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    flex: 1,
    bottom: hp(2),
    padding: 5,
  },
  inputcontainertwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    flex: 1,
    bottom: hp(2),
    padding: 5,
  },
  inputcontainerthree: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: hp(50),
    padding: 5,
  },
  pausedStyle: {
    position: "absolute",
    zIndex: 1000,
    top: hp(45),
    right: hp(25),
    backgroundColor: "Gray",
    borderRadius: 35,
    width: wp(16),
    height: hp(8),
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "white",
  },
  dropStyle: {
    backgroundColor: "white",
    height: hp(15.2),
    width: wp(28),
    textTransform: "capitalize",
  },
  inputView: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    padding: Platform.OS == "ios" ? hp(1.2) : hp(0.5),
  },
  rightStyle: {
    width: wp(7),
    flexDirection: "row",
    height: hp(3),
    position: "absolute",
    zIndex: 1000,
    top: 2,
    left: WP(14),
  },
  btnStyle: {
    width: wp(12),
    height: hp(5),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    top: hp(4),
    left: wp(4),
    position: "absolute",
    right: hp(1),
    marginLeft: hp(1),
    backgroundColor: "red",
  },
  iconStyle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    position: "absolute",
    left: hp(1.5),
    top: Platform.OS == "ios" ? hp(4.5) : hp(1),
  },

  sendStyle: {
    width: WP(14),
    height: WP(14),
    borderColor: "white",
    borderWidth: 0.5,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: WP(20),
    right: WP(1),
  },
  andrioPicker: {
    width: WP(14),
    justifyContent: "center",
    alignContent: "center",
    marginRight: hp(3),
    marginLeft: wp(2),
    height: hp(3.5),
  },
  pickerStyle: {
    backgroundColor: "red",
    color: "blue",
    fontFamily: "Ebrima",
    fontSize: 14,
    color: "#DF4B38",
  },
  modalView: {
    width: wp(36),
    height: hp(5),
    paddingTop: Platform.OS == "ios" ? hp(2) : hp(0.5),
    alignItems: "center",
    right: wp(3),
    top: Platform.OS == "ios" ? hp(1) : hp(0.5),
    flexDirection: "row",
    zIndex: 1000,
    position: "absolute",
  },
  iconView: {
    justifyContent: "center",
    alignItems: "center",
    top: Platform.OS == "ios" ? hp(0.5) : hp(0),
    paddingLeft: wp(3.5),
    height: Platform.OS == "ios" ? HP(5) : HP(6),
    width: Platform.OS == "ios" ? WP(30) : WP(35),
    borderRadius: 10,
    backgroundColor: "#DF4B38",
    flexDirection: "row",
  },
  crossStyle: {
    width: wp(12),
    height: hp(5),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  videoStyle: {
    width: wp(100),
    height: hp(87),
    justifyContent: "center",
    alignItems: "center",
  },
});
export default PostStory;
