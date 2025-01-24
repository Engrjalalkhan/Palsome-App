import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";

import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Toast from "react-native-simple-toast";
import { WP, HP } from "../../../Utils/Resposive";
import { theme } from "../../Core/theme";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import Video from "react-native-video";
import { ICONS } from "../../Constants/Icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  privacyData,
  privacyNewPost,
} from "../../../Utils/PickerDataStatus/privacyData";
import CustomPicker from "../../Components/CustomPickers/CustomPickerIos";
import FastImage from "react-native-fast-image";
import ImagePickerModal from "../../Components/ImagePickerModal";
import PostModalImgsVidz from "../../Components/PostModalImgVidz";
import { imgRegex, videoRegex } from "../../../Utils/Regexes/imgVideoRegex";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../Utils/ImageAndCamera";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadAlbum,
  uploadPhoto,
  uploadVideo,
} from "../../Redux/actions/NewsFeedActions";
import {
  getAlbumsDataRequest,
  getPhotosData,
  getVideosReq,
  uploadAlbumReq,
  uploadPhotoReq,
  uploadVideoReq,
} from "../../Redux/actions/RoomActions";
import { uploadReelRequest } from "../../Redux/actions/ReelsActions";
import { COLORS } from "../../Constants/Colors";
import CustomPickerPrivacy from "../../Components/CustomPickers/CustomPickerPrivacy";
const UploadModal = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [inputText, setInputText] = useState("");
  const [multipleImages, setMultipleImages] = useState([]);
  const [imageVideoToShow, setImageVideoToShow] = useState();
  const token = useSelector((state) => state.auth.userToken);
  const [VisiblePrivacy, setVisiblePrivacy] = useState(false);
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [privacyPickerValue, setPrivacyPickerValue] = useState(t("public"));

  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 60,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        // console.log("Response = ", response);

        if (response.didCancel) {
          // console.log("User cancelled camera picker");

          return;
        } else if (response.errorCode == "camera_unavailable") {
          // console.log("Camera not available on device");

          return;
        } else if (response.errorCode == "permission") {
          // console.log("Permission not satisfied");

          return;
        } else if (response.errorCode == "others") {
          // console.log(response.errorMessage);

          return;
        }
        let uri = response?.assets[0]?.uri;
        let type = response?.assets[0]?.type
          ? response?.assets[0]?.type
          : "video/mp4";
        let name = response?.assets[0]?.fileName;
        if (
          props.uploadModalType == "photo" ||
          props.uploadModalType == "video"
        ) {
          setImageVideoToShow();

          setImageVideoToShow({ uri, type, name });

          setPickerModalVisibile(false);
        } else {
          if (response?.assets?.length) {
            // console.log("many images");
            setMultipleImages((prev) => {
              let newImgs = response?.assets?.map((item, index) => {
                return {
                  uri: item?.uri,
                  type: item?.type ? item?.type : "video/mp4",
                  name: item?.fileName,
                };
              });
              return prev.concat(newImgs);
            });
            //   snapURI ? setSnapURI("") : null;
            // console.log("multipleImages", multipleImages);
          }
          setPickerModalVisibile(false);
        }
      });
    }
  };

  // -----------------------------------------
  const deleteItem = (uri) => {
    setMultipleImages(multipleImages.filter((i) => i.uri !== uri.uri));
  };

  const chooseImageGallery = () => {
    let options = {
      mediaType:
        props.uploadModalType == "album" ? "mixed" : props.uploadModalType,
      quality: 1,
      noData: true,
      selectionLimit: props.uploadModalType == "album" ? 6 : 1,
      videoDurationLimit: 60,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode == "camera_unavailable") {
        return;
      } else if (response.errorCode == "permission") {
        return;
      } else if (response.errorCode == "others") {
        return;
      } else if (props.reel) {
        if (response.assets[0]?.duration > 60) {
          // Check if selected video duration is more than 60 seconds
          alert(t("Clip duration must be less than 60 seconds.")); // Provide feedback to the user
          return;
        }
      }

      let uri = response?.assets[0]?.uri;
      let type =
        props.uploadModalType == "photo"
          ? response?.assets[0]?.type
          : "video/mp4";
      let name =
        props.uploadModalType == "photo"
          ? response?.assets[0]?.fileName + ".jpg"
          : response?.assets[0]?.fileName + ".mp4";
      if (
        props.uploadModalType == "photo" ||
        props.uploadModalType == "video"
      ) {
        setImageVideoToShow();
        setImageVideoToShow({ uri, type, name });
        setPickerModalVisibile(false);
      } else {
        if (response.assets.length) {
          setMultipleImages((prev) => {
            const newImgs = response?.assets?.map((item, index) => {
              return {
                uri: item?.uri,
                type: item?.type ? item.type : "video/mp4",
                name: item?.uri.match(imgRegex)
                  ? item?.fileName
                  : item?.fileName + ".mp4",
              };
            });
            return prev.concat(newImgs);
          });
        }
      }
      setPickerModalVisibile(false);
    });
  };

  const refreshImages = () => {
    dispatch(
      getPhotosData({
        room_id: props?.room_encrypted_id,
        token: token,
      })
    );
  };

  const refreshAlbums = () => {
    dispatch(
      getAlbumsDataRequest({
        token,
        room_id: props?.room_encrypted_id,
      })
    );
  };

  const refreshVideos = () => {
    dispatch(
      getVideosReq({
        token,
        room_id: props?.room_id,
      })
    );
  };

  const onPressSubmit = () => {
    const formData = new FormData();
    formData.append("privacy", privacyPickerValue);
    if (props.uploadModalType == "photo") {
      formData.append("media_text", inputText);
      if (imageVideoToShow) {
        formData.append("photos", imageVideoToShow);

        if (props?.room) {
          dispatch(
            uploadPhotoReq({
              token,
              room_id: props?.room_encrypted_id,
              formData,
              refresh: refreshImages(),
            })
          );
        } else {
          dispatch(uploadPhoto({ formData, token }));
        }
        props?.setShowUploadModal(false);
      } else {
        // Toast.show("Select Photo to Upload", Toast.LONG);
        Alert, alert(t("Select Photo to Upload"));
      }
    }
    if (props.uploadModalType == "video") {
      formData.append("media_text", inputText);
      if (imageVideoToShow) {
        setTimeout(() => {
          Toast.show(
            t(
              "Your video is being processed. We'll let you know when it's ready"
            ),
            Toast.LONG
          );
        }, 1000);
        formData.append("videos", imageVideoToShow);
        console.log(formData);
        if (props?.room) {
          dispatch(
            uploadVideoReq({
              token,
              room_id: props?.room_id,
              formData,
              refresh: refreshVideos(),
            })
          );
        } else {
          dispatch(uploadVideo({ formData, token }));
        }
        props?.setShowUploadModal(false);
      } else {
        // Toast.show("Select Video to Upload", Toast.LONG);
        Alert.alert(t("Select Video to Upload"));
      }
    }
    if (props.uploadModalType == "album") {
      if (multipleImages.length && inputText.length) {
        multipleImages?.map((item, index) => {
          formData.append(`album[${index}]`, item);
        });
        formData.append("album_name", inputText);
        console.log(formData);
        const videosOnly = multipleImages.filter((item) => {
          if (item?.type === "video/mp4") {
            setTimeout(() => {
              Toast.show(
                t(
                  "Your video is being processed. We'll let you know when it's ready"
                ),
                Toast.LONG
              );
            }, 1000);
          }
          return item;
        });

        if (props?.room) {
          dispatch(
            uploadAlbumReq({
              formData,
              token,
              room_id: props?.room_encrypted_id,
              refresh: refreshAlbums(),
            })
          );
        } else {
          dispatch(uploadAlbum({ formData, token }));
        }
        props?.setShowUploadModal(false);
      } else {
        // setTimeout(() => {
        //   Toast.show("Select Media and Enter Name to Upload", Toast.LONG);
        // }, 500);
        Alert.alert(t("Select Media and Enter Name to Upload"));
      }
    }
  };

  const onSubmitReel = () => {
    const formData = new FormData();
    if (imageVideoToShow) {
      setTimeout(() => {
        Toast.show(
          t("Your clip is being processed. We'll let you know when it's ready"),
          Toast.LONG
        );
      }, 1000);
      formData.append("file", imageVideoToShow);
      formData.append("privacy", privacyPickerValue);
      formData.append("description", inputText);
      dispatch(uploadReelRequest({ formData, token }));
      props?.setShowUploadModal(false);
    } else {
      Toast.show("Select Video to Upload", Toast.LONG);
    }
  };

  const onPressImage = () => {
    console.log("pressed");
  };

  const selectedPrivacyOption = privacyData.find(
    (i) => i.value === privacyPickerValue
  );
  return (
    <Modal
      isVisible={props.showUploadModal}
      transparent={true}
      style={styles.mtwoStyle}
      animationType="slide"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? -120 : 0}
        style={{
          flex: 1,
          width: WP(100),
          height: HP(100),
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <View
            style={{
              backgroundColor: COLORS.white,
              alignItems: "center",
              width: WP(90),
              paddingVertical: 20,
              borderRadius: 10,
              borderWidth: 1,
            }}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                {t("Upload")}{" "}
                {props.reel == true ? t("clip") : t(props.uploadModalType)}
              </Text>
              <View>
                {Platform.OS == "android" ? (
                  <View style={styles.pickerView}>
                    <Picker
                      mode="dropdown"
                      style={{ color: COLORS.black }}
                      itemStyle={styles.picker}
                      dropdownIconColor={COLORS.primary}
                      selectedValue={privacyPickerValue}
                      onValueChange={(itemValue) =>
                        setPrivacyPickerValue(itemValue)
                      }
                    >
                      <Picker.Item
                        label={t("Public")}
                        value="public"
                        color={COLORS.black}
                      />
                      <Picker.Item
                        label={t("Friends")}
                        value="friends_only"
                        color={COLORS.black}
                      />
                      <Picker.Item
                        label={t("Only Me")}
                        value="only_me"
                        color={COLORS.black}
                      />
                    </Picker>
                    <Text
                      style={{
                        width: "100%",
                        height: 60,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                      }}
                    >
                      {" "}
                    </Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        props?.room
                          ? styles.iosViewRoomPicker
                          : styles.iosviewPicker,
                      ]}
                      disabled={props.room ? true : false}
                      onPress={() => setVisiblePrivacy(true)}
                    >
                      {privacyNewPost(privacyPickerValue, COLORS.black, true)}
                      <Text style={{}}>
                        {selectedPrivacyOption
                          ? t(selectedPrivacyOption.title)
                          : ""}
                      </Text>
                      {ICONS.fontAwesome5("caret-down", COLORS.primary)}
                    </TouchableOpacity>
                    <CustomPickerPrivacy
                      visible={VisiblePrivacy}
                      selectedValue={privacyPickerValue}
                      setValueFunc={(val) => setPrivacyPickerValue(val)}
                      data={privacyData}
                      hideVisible={() => setVisiblePrivacy(false)}
                    />
                  </>
                )}
              </View>
            </View>
            <View style={styles.body}>
              {props.uploadModalType == "photo" ? (
                <>
                  {imageVideoToShow ? (
                    <FastImage
                      source={{
                        uri: imageVideoToShow?.uri,
                      }}
                      resizeMode="contain"
                      style={styles.imageToUpload}
                    />
                  ) : (
                    <View
                      style={[
                        styles.imageToUpload,
                        styles.imageToUploadPlaceHolder,
                      ]}
                    ></View>
                  )}
                </>
              ) : null}
              {props.uploadModalType == "video" ? (
                <>
                  {imageVideoToShow ? (
                    <Video
                      resizeMode={"contain"}
                      style={{
                        height: HP(25),
                      }}
                      source={{
                        uri: imageVideoToShow?.uri,
                      }}
                      automaticallyWaitsToMinimizeStalling={true}
                      controls={true}
                      paused={true}
                    />
                  ) : (
                    <View
                      style={[
                        styles.imageToUpload,
                        styles.imageToUploadPlaceHolder,
                      ]}
                    ></View>
                  )}
                </>
              ) : null}
              {props.uploadModalType == "album" ? (
                <>
                  {multipleImages?.length ? (
                    <View style={{ height: HP(15) }}>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={multipleImages}
                        renderItem={({ item }) =>
                          PostModalImgsVidz(item, deleteItem, onPressImage)
                        }
                        horizontal={true}
                        style={{ flex: 1 }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.imageToUpload,
                        styles.imageToUploadPlaceHolder,
                        { height: HP(15) },
                      ]}
                    ></View>
                  )}
                </>
              ) : null}

              {imageVideoToShow === undefined &&
                multipleImages.length === 0 && (
                  // <View >
                  <TouchableOpacity
                    style={[
                      styles.plusIcon,
                      {
                        marginTop: props.uploadModalType == "album" ? -55 : -20,
                      },
                    ]}
                    onPress={() => setPickerModalVisibile(true)}
                  >
                    <Ionicons
                      name="ios-add-circle-outline"
                      size={HP(7.5)}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                  // </View>
                )}
            </View>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              style={styles.input}
              placeholderTextColor={COLORS.grey}
              placeholder={
                props.uploadModalType == "album"
                  ? t("Album Name")
                  : `${t("Enter text for the")} ${
                      props.reel == true ? t("clip") : t(props.uploadModalType)
                    }`
              }
            />
            <View style={styles.modalbuttonStyle}>
              <TouchableOpacity
                onPress={() => props?.setShowUploadModal(false)}
                style={styles.canStyle}
              >
                <Text style={styles.canText}>{t("Cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPickerModalVisibile(true)}
                style={styles.deleteButton}
              >
                <Text style={styles.delTxtStyle}>{t("Choose")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={props?.reel ? onSubmitReel : onPressSubmit}
                style={styles.deleteButton}
              >
                <Text style={styles.delTxtStyle}>{t("Submit")}</Text>
              </TouchableOpacity>
            </View>
            <ImagePickerModal
              visible={pickerModalVisibile}
              hideVisible={() => setPickerModalVisibile(false)}
              galleryImage={() => chooseImageGallery()}
              cameraVideo={() => captureImage("video")}
              cameraImage={() => captureImage("image")}
              showOpenVidcamera={
                props.uploadModalType == "video" ||
                props.uploadModalType == "album"
              }
              showOpenImgcamera={
                props.uploadModalType == "photo" ||
                props.uploadModalType == "album"
              }
              showImgCam={props.uploadModalType == "photo" ? true : false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mtwoStyle: {
    flex: 1,
    height: HP(40),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    top: HP(30),
    // borderRadius: 5,
    width: WP(85),
    position: "absolute",
    zIndex: 1000,
    backgroundColor: COLORS.white,
  },

  body: {
    width: "90%",
    marginVertical: HP(1),
  },

  modalbuttonStyle: {
    width: "80%",
    // height: HP(10),
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  deleteButton: {
    width: WP(19),
    height: HP(6),
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  delTxtStyle: { color: COLORS.white, fontWeight: "600" },
  canStyle: {
    width: WP(19),
    height: HP(6),
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.wildSand,
  },
  canText: { color: "blue", fontWeight: "600" },
  titleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "red",
    width: "90%",
  },
  titleText: { fontWeight: "bold", fontSize: 18 },
  bulletContainer: { paddingHorizontal: WP(5), marginVertical: HP(1) },
  iosviewPicker: {
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

  iosViewRoomPicker: {
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

  pickerView: {
    borderWidth: 0.5,
    borderColor: COLORS.black,
    justifyContent: "center",
    width: WP(40),
    height: HP(4),
    borderRadius: 5,
    backgroundColor: COLORS.wildSand,
  },
  picker: {
    backgroundColor: "red",
    color: "blue",
    fontFamily: "Ebrima",
    fontSize: 1,
    color: COLORS.primary,
  },
  imageToUpload: {
    height: HP(25),
    width: "100%",
    backgroundColor: COLORS.black,
  },
  imageToUploadPlaceHolder: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    // marginTop: HP(1),
    borderRadius: 5,
    paddingHorizontal: 5,
    marginBottom: 10,
    paddingVertical: Platform.OS == "android" ? 0 : HP(1),
  },
  plusIcon: {
    position: "absolute",
    borderRadius: 50,
    padding: 5,
    zIndex: 1,
    // marginBottom: HP(20),
    marginTop: -20,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
    alignSelf: "center",
    top: HP(10),
  },
});
export default UploadModal;
