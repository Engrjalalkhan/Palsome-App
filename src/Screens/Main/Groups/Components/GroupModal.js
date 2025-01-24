import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Modal,
  Text,
  FlatList,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import Video from "react-native-video";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import ImagePickerModal from "../../../../Components/ImagePickerModal";
import PostModalImgsVidz from "../../../../Components/PostModalImgVidz";

import { COLORS } from "../../../../Constants/Colors";
import { BASE_URL } from "../../../../Services/Constants";

import { HP, WP } from "../../../../../Utils/Resposive";
import { imgRegex } from "../../../../../Utils/Regexes/imgVideoRegex";
import { requestCameraPermission } from "../../../../../Utils/ImageAndCamera";

const GroupModal = (props) => {
  const {
    group_encrypted_id,
    refreshAlbumsData,
    eidtAlbum,
    albumId,
    showMessage,
  } = props;
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.userToken);

  const [inputText, setInputText] = useState(eidtAlbum);
  const [multipleImages, setMultipleImages] = useState([]);
  const [imageVideoToShow, setImageVideoToShow] = useState();
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);

  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
    };

    let isCameraPermitted = await requestCameraPermission();

    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == "camera_unavailable") {
          return;
        } else if (response.errorCode == "permission") {
          return;
        } else if (response.errorCode == "others") {
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
          }

          setPickerModalVisibile(false);
        }
      });
    }
  };

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

  const submitPhoto = (formData) => {
    showMessage();
    const url = `${BASE_URL}/groups/${group_encrypted_id}/save_photos`;

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
            refreshAlbumsData();
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
      console.log("albumsDataError: ", error);
    }
  };

  const submitVideo = (formData) => {
    showMessage();
    const url = `${BASE_URL}/groups/${group_encrypted_id}/videos`;

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
            refreshAlbumsData();
            showMessage({
              message: t(
                "Your video is being processed. We'll let you know when it's ready"
              ),
              type: "success",
            });
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
      console.log("albumsDataError: ", error);
    }
  };

  const submitAlbum = (formData) => {
    showMessage();
    if (eidtAlbum != "") {
      formData.append("album_id", albumId);
    }

    const url =
      eidtAlbum == ""
        ? `${BASE_URL}/groups/${group_encrypted_id}/save_album`
        : `${BASE_URL}/groups/update_album`;

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
          console.log("res: ", res);
          if (res?.responseCode == 200) {
            refreshAlbumsData();
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
      console.log("albumsDataError: ", error);
    }
  };

  const onPressSubmit = () => {
    const formData = new FormData();
    formData.append("privacy", props?.gropuPrivacy);

    if (props.uploadModalType == "photo") {
      formData.append("media_text", inputText);
      if (imageVideoToShow) {
        formData.append("photos", imageVideoToShow);
        console.log("formData: ", formData);
        console.log("imageVideoToShow: ", imageVideoToShow);

        submitPhoto(formData);
        props?.setShowUploadModal(false);
        Toast.show("Uploading...", Toast.LONG);
      } else {
        // Toast.show("Select Photo to Upload", Toast.LONG);
        Alert.alert(t("Select Photo to Upload"));
      }
    }

    if (props.uploadModalType == "video") {
      formData.append("media_text", inputText);
      if (imageVideoToShow) {
        formData.append("videos", imageVideoToShow);
        submitVideo(formData);

        props?.setShowUploadModal(false);
      } else {
        // Toast.show("Select Video to Upload", Toast.LONG);
        Alert.alert(t("Select Video to Upload"));
      }
    }

    if (props.uploadModalType == "album") {
      if ((multipleImages.length && inputText.length) || eidtAlbum != "") {
        formData.append("album_name", inputText);
        multipleImages?.map((item, index) => {
          formData.append(`album[${index}]`, item);
        });

        props?.setShowUploadModal(false);
        Toast.show("Uploading...", Toast.LONG);

        submitAlbum(formData);
      } else {
        if (!multipleImages.length) {
          // Toast.show("Please select media to upload", Toast.LONG);
          Alert.alert(t("Please select media to upload"));
        } else if (!inputText.length) {
          // Toast.show("Please enter the album name", Toast.LONG);
          Alert.alert(t("Please enter the album name"));
        }
      }
    }
  };

  const onPressImage = () => {
    console.log("pressed");
  };

  return (
    <Modal
      isVisible={props.showUploadModal}
      transparent={true}
      style={styles.mtwoStyle}
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          width: WP(100),
          height: HP(100),
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              {t("Upload")} {t(props.uploadModalType)}
            </Text>
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

            {imageVideoToShow === undefined && multipleImages.length === 0 && (
              // <View >
              <TouchableOpacity
                style={styles.plusIcon}
                onPress={() => setPickerModalVisibile(true)}
              >
                <Ionicons
                  name="ios-add-circle-outline"
                  size={HP(7.5)}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            placeholder={
              props.uploadModalType == "album"
                ? t("Album Name")
                : `${t("Enter text for the")} ${t(props.uploadModalType)}`
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
              <Text style={styles.delTxtStyle}>
                {multipleImages.length ? t("Choose More") : t("Choose")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressSubmit}
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
            showCamImg={false}
            showOpenImgcamera={
              props.uploadModalType == "photo" ||
              props.uploadModalType == "album"
            }
          />
        </View>
      </View>
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
    justifyContent: "center",
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
    width: WP(35),
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
    marginTop: -50,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
    alignSelf: "center",
    top: HP(10),
  },
});
export default GroupModal;
