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
  ActivityIndicator,
} from "react-native";

import { WP, HP } from "../../../../Utils/Resposive";
import { theme } from "../../../Core/theme";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import Video from "react-native-video";

import Ionicons from "react-native-vector-icons/Ionicons";

import CustomPicker from "../../../Components/CustomPickers/CustomPickerIos";
import FastImage from "react-native-fast-image";
import ImagePickerModal from "../../../Components/ImagePickerModal";
import PostModalImgDocx from "../../../Components/PostModalImgDocx";
import DocumentPicker, { types } from "react-native-document-picker";
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../Utils/ImageAndCamera";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  setNewWalletData,
  // setuserWalletData,
  getWalletData,
  updateWalletRequest,
  updateWalletItems,
  getWalletPreviewData,
} from "../../../Redux/actions/WalletActions";
import { SITE_URL } from "../../../Services/Constants";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import {
  settingsApiCall,
  withoutStringiApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { log } from "react-native-reanimated";
import SimpleToast from "react-native-simple-toast";

const WalletUploadModal = (props) => {
  // console.log("props>>>>>>>>>>>Existing_Files", props.Existing_Files);
  const existFiles = props?.Existing_Files;

  const [walletTitle, setWalletTitle] = useState(
    props?.file_title ? props?.file_title : ""
  );
  // console.log("encrypted iddddddddddddddd>>>>", props.encrypted_id);
  // const [walletDesc, setWalletDesc] = useState(props?.description);
  const defaultWalletDesc = "...";
  const [walletDesc, setWalletDesc] = useState(props?.description || "");
  const [discEmpty, setDiscEmpty] = useState();
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [imageVideoToShow, setImageVideoToShow] = useState();
  const [multipleImages, setMultipleImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filesTitlesArray, setFilesTitlesArray] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [file_title, setFileTitle] = useState([]);
  const [error, setError] = useState(false);
  const [responseUploadApi, setResponseUploadApi] = useState(null);
  const [onlyNewFiles, setOnlyNewFiles] = useState([]);
  const [deleteItemUri, setDeleteItemUri] = useState([]);
  const [successFullyUpdated, setSuccessFullyUpdated] = useState(false);
  const token = useSelector((state) => state.auth.userToken);
  const walletToken = useSelector((state) => state.walletRed.walletToken);
  const walletData = useSelector((state) => state.walletRed.walletData);
  const mywalletData = useSelector((state) => state.walletRed.myWalletData);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const captureImage = async (contentType) => {
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
          return;
        } else if (response.errorCode == "camera_unavailable") {
          return;
        } else if (response.errorCode == "permission") {
          return;
        } else if (response.errorCode == "others") {
          return;
        }
        // let uri = response?.assets[0]?.uri;
        // let type = response?.assets[0]?.type
        //   ? response?.assets[0]?.type
        //   : "video/mp4";
        // let name = response?.assets[0]?.fileName;

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

          //   snapURI ? setSnapURI("") : null;
        }

        //to solve error
        if (response?.assets?.length) {
          setOnlyNewFiles((prev) => {
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
      });
    }
  };

  const typeChecker = (type) => {
    if (type.includes(".jpg")) {
      return "image/jpg";
    } else if (type.includes(".jpeg")) {
      return "image/jpeg";
    } else if (type.includes(".png")) {
      return "image/png";
    } else if (type.includes(".pdf")) {
      return "pdf";
    } else {
      return "doc";
    }
  };

  useEffect(() => {
    if (props?.Existing_Files?.length) {
      let existingFiles = props?.Existing_Files?.map((item, index) => {
        return {
          uri: `${SITE_URL}${item?.file_path}`,
          type: typeChecker(item?.file_path),
          name: item?.file_title,
        };
      });
      setMultipleImages(existingFiles);
    }
  }, []); // remove props?.Existing_Files

  const pickPdf = async () => {
    console.log("pdf picker pressed", types);
    const res = await DocumentPicker.pickMultiple({
      allowMultiSelection: true,
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.docx,
        DocumentPicker.types.doc,
      ],
    });
    console.log("red", res);
    if (res?.length) {
      setMultipleImages((prev) => {
        let newImgs = res?.map((item, index) => {
          let fileType = item?.type.replace("application/", "");

          return {
            uri: item?.uri,
            type: item?.type == "application/pdf" ? "pdf" : "doc",
            name: item?.name,
          };
        });
        return prev.concat(newImgs);
      });
      setFilesTitlesArray((prev) => {
        let newTitle = "";
        return prev.concat(newTitle);
      });
      setPickerModalVisibile(false);
    }

    if (res?.length) {
      setOnlyNewFiles((prev) => {
        let newImgs = res?.map((item, index) => {
          let fileType = item?.type.replace("application/", "");
          return {
            uri: item?.uri,
            type: item?.type == "application/pdf" ? "pdf" : "doc",
            name: item?.name,
          };
        });
        return prev.concat(newImgs);
      });
      setFilesTitlesArray((prev) => {
        let newTitle = "";
        return prev.concat(newTitle);
      });
      setPickerModalVisibile(false);
    }
  };

  const getWalletAlbums = async () => {
    // try {
    const response = await withoutStringiApiCall({
      route: `wallet?wallet_api_token=${walletToken}`,
      verb: "GET",
      token: token,
    });
    console.log(
      "single media response>>>>>> :",
      response.payload.data.wallet.items.map((i) => i.files)
    );
    const res = response.payload.data.wallet.items.map((i) => i.files);
    // let jsonArray = JSON.parse(res)
    for (let i = 0; i < res.length; i++) {
      let encryptedId = res[i].encrypted_id;
      // You can do whatever you want with the encryptedId value here
    }
    // } catch (error) {}
  };

  const chooseImageGallery = () => {
    let options = {
      mediaType: "photo",
      quality: 1,
      noData: true,
      selectionLimit: 6,
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
      console.log("response", response);
      let uri = response?.assets[0]?.uri;

      if (response.assets.length) {
        console.log("response - - - ", response.assets);
        setMultipleImages((prev) => {
          const newImgs = response?.assets?.map((item, index) => {
            return {
              uri: item?.uri,
              type: item?.type ? item.type : "image/jpg",
              name: item?.fileName,
            };
          });
          return prev.concat(newImgs);
        });
        setFilesTitlesArray((prev) => {
          const newTitle = "";
          return prev.concat(newTitle);
        });
      }

      if (response.assets.length) {
        console.log("response - - - ", response.assets);
        setOnlyNewFiles((prev) => {
          const newImgs = response?.assets?.map((item, index) => {
            return {
              uri: item?.uri,
              type: item?.type
                ? item.type
                : "image/jpg" || "image/jpeg" || "image/png",
              name: item?.fileName,
            };
          });
          return prev.concat(newImgs);
        });

        setFilesTitlesArray((prev) => {
          const newTitle = "";
          return prev.concat(newTitle);
        });
      }

      setPickerModalVisibile(false);
    });
    setMultipleImages(multipleImages);
  };

  const onPressSubmit = () => {
    if (walletTitle.length > 0) {
      const formData = new FormData();

      multipleImages?.map((item, index) => {
        if (item.type == "pdf") {
          item.type = "application/pdf";
          formData.append(`album[${index}]`, item);
        } else {
          formData.append(`album[${index}]`, item);
        }
      });
      multipleImages?.map((item, index) => {
        formData.append(`file_title[${index}]`, "");
      });
      formData.append("album_name", walletTitle);
      formData.append("description", walletDesc);

      console.log("formData in Upload Modal::>>", JSON.stringify(formData));

      dispatch(
        setNewWalletData({
          walletToken: walletToken,
          token: token,
          formData: formData,
          setLoading: setLoading,
          setResponseUploadApi: setResponseUploadApi,
        })
      );
      // refresh();
      // console.log(
      //   walletData.data.wallet.items
      // );
      props?.setShowUploadModal(false);
    } else {
      setError(true);
      // alert("Please enter title");
    }
  };

  // console.log("Only New Files", onlyNewFiles);

  // useEffect(() => {
  //   if (responseUploadApi?.payload?.success === true) {
  //     dispatch(
  //       getWalletData({
  //         walletToken: walletToken,
  //         token: token,
  //         setLoading: setLoading,
  //         // setResponseApi: setResponseApi,
  //       })
  //     );
  //     props?.setShowUploadModal(false);
  //   } else if (responseUploadApi?.payload?.success === false) {
  //     props?.setShowUploadModal(false);
  //   }
  // }, [responseUploadApi]);

  const refresh = () => {
    console.log("REFRESH get wallet data in upload modal");
    dispatch(
      getWalletData({
        walletToken: walletToken,
        token: token,
      })
    );
  };

  // const deleteItem = (item, shouldDeleteMedia = false) => {
  //   const URI = item.uri.replace("https://testing.palsome.com/", "");
  //   setDeleteItemUri(URI);
  //   const filtered = multipleImages.filter((i) => i.uri !== item.uri);
  //   setMultipleImages(filtered);
  //   setFilteredImages(filtered);
  //   // setDeleteItemUri("");
  //   item.uri == "";
  // };
  const deleteMultipleMedia = async (encryptedId) => {
    const response = await withoutStringiApiCall2({
      route: `wallet/item/file/${encryptedId}/delete?wallet_api_token=${walletToken}`,
      verb: "DELETE",
      token: token,
      // body: formData,
    });
  };

  const deleteSingleMedia = async (encryptedId) => {
    const response = await withoutStringiApiCall2({
      route: `wallet/item/file/${encryptedId}/delete?wallet_api_token=${walletToken}`,
      verb: "DELETE",
      token: token,
      // body: formData,
    });

    console.log("Delete single media response>>>>>>", response);
    SimpleToast.show("Wallet Updated Successfully");
  };

  // SimpleToast.show("Wallet Updated Successfully");

  const deleteItem = (item, shouldDeleteMedia = false) => {
    const URI = item.uri.replace("https://www.palsome.com/", "");
    // setDeleteItemUri(URI);
    setDeleteItemUri((prev) => [...prev, URI]);

    const filteredMultiple = multipleImages.filter((i) => i.uri !== item.uri);
    setMultipleImages(filteredMultiple);
    setFilteredImages(filteredMultiple);

    const filteredOnlyNew = onlyNewFiles.filter((i) => i.uri !== item.uri);
    setOnlyNewFiles(filteredOnlyNew);

    setFilesTitlesArray((prev) => {
      const newTitle = "";
      return prev.concat(newTitle);
    });
  };

  const onPressUpdate = () => {
    const formData = new FormData();
    formData.append("album_name", walletTitle);
    formData.append("description", walletDesc);

    if (multipleImages?.length > 0) {
      // if (deleteItemUri) {
      //   const existingFile = existFiles?.find(
      //     (file) => file.file_path === deleteItemUri
      //   );
      //   const encryptedId = existingFile?.encrypted_id || null;
      //   deleteSingleMedia(encryptedId);
      // }
      deleteItemUri.forEach(async (uri) => {
        const existingFile = existFiles?.find((file) => file.file_path === uri);
        const encryptedId = existingFile?.encrypted_id || null;

        // Delete each item
        await deleteSingleMedia(encryptedId);
      });

      // Clear the deleteItemUris state after deletion
      setDeleteItemUri([]);
      onlyNewFiles?.map((item, index) => {
        if (item.type === "pdf") {
          item.type = "application/pdf";
          formData.append(`album[${index}]`, item);
        } else {
          formData.append(`album[${index}]`, item);
        }
      });

      multipleImages?.map((item, index) => {
        formData.append(`file_title[${index}]`, "");
      });

      // Check if the deleted item exists in existFiles array

      // Add encrypted_id to formData if exist
      // if (encryptedId) {
      //   formData.append("remove_id", encryptedId);
      // }

      formData.append("album_name", walletTitle);
      formData.append("description", walletDesc);
      formData.append("album_id", props.encrypted_id);

      // console.log("formData in Upload Modal::>>", formData);

      dispatch(
        updateWalletRequest({
          walletToken: walletToken,
          token: token,
          formData: formData,
          setLoading: setLoading,
          setSuccessFullyUpdated: setSuccessFullyUpdated,
          refresh: refresh(),
        })
      );

      props?.setShowUploadModal(false);
    } else {
      alert("Please Add Any New File To Upload");
    }
  };

  const onPressImage = () => {
    console.log("image pressed");
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Modal
        isVisible={props.showUploadModal}
        transparent={true}
        // style={styles.mtwoStyle}
        animationType="slide"
      >
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                  {t(props.uploadModalType)} {t("Wallet Item")}
                </Text>
              </View>
              <View style={styles.body}>
                <>
                  {multipleImages?.length ? (
                    <View style={{ height: HP(15) }}>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={multipleImages}
                        // data={[...existingFile, multipleImages]}
                        renderItem={({ item }) =>
                          PostModalImgDocx(item, deleteItem, onPressImage)
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
                    >
                      <TouchableOpacity
                        style={styles.addIcon}
                        onPress={() => setPickerModalVisibile(true)}
                      >
                        <Ionicons
                          name="ios-add-circle-outline"
                          size={HP(7.5)}
                          color={COLORS.primary}
                        />
                        <Text
                          style={{
                            color: COLORS.grey,
                            size: 40,
                            marginLeft: -4,
                            fontWeight: "600",
                          }}
                        >
                          {t("Choose file")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
                {props?.edit && (
                  <Text style={styles.fieldTitle}>
                    {t("Wallet Item Title")}
                  </Text>
                )}

                {/* <TextInput
              // value={props.addItem ? props.file_title : walletTitle}
              value={props?.addItem ? props.file_title : walletTitle}
              onChangeText={setWalletTitle}
              style={styles.input}
              placeholder={"Wallet Item Title"}
              placeholderTextColor={props.addItem && COLORS.black}
              editable={props.addItem ? (props.edit ? true : false) : true}
            /> */}
                <TextInput
                  value={walletTitle}
                  onChangeText={(text) => {
                    setWalletTitle(text);
                  }}
                  style={styles.input}
                  placeholder={props?.addItem ? "" : t("Wallet Item Title")}
                  placeholderTextColor={COLORS.darkGray}
                  editable={props.addItem ? (props.edit ? true : false) : true}
                />

                {/* {props?.edit && (
                  <Text style={styles.fieldTitle}>Description</Text>
                )} */}
                <TextInput
                  value={walletDesc}
                  onChangeText={(text) => {
                    setWalletDesc(text);
                  }}
                  style={styles.input}
                  placeholder={t("Description")}
                  placeholderTextColor={COLORS.darkGray}
                  editable={props.addItem ? (props.edit ? true : false) : true}
                  // defaultValue={walletDesc == "" ? "Default text" : undefined}
                  // Style the default text with red color
                  // style={walletDesc === "" ? { color: "red" } : undefined}
                />
              </View>

              {error && (
                <Text style={styles.ErorrText}>{t("Please Enter Title")}</Text>
              )}

              {!walletDesc && (
                <Text style={{ color: "white" }}>{defaultWalletDesc}</Text>
              )}
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
                  onPress={props.addItem ? onPressUpdate : onPressSubmit}
                  style={styles.deleteButton}
                >
                  <Text style={styles.delTxtStyle}>
                    {props.file_title ? t("Update") : t("Submit")}
                  </Text>
                </TouchableOpacity>
              </View>
              <ImagePickerModal
                visible={pickerModalVisibile}
                hideVisible={() => setPickerModalVisibile(false)}
                galleryImage={() => chooseImageGallery()}
                cameraImage={() => captureImage("image")}
                pdfPick={() => pickPdf()}
                showOpenVidcamera={false}
                showOpenImgcamera={true}
                showOpenPdf={true}
              />
            </View>
          </ScrollView>
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" style={{ alignSelf: "center" }} />
          </View>
        )}
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WP(100),
    height: HP(100),
    backgroundColor: "transparent",
    // justifyContent: "center",
    marginTop: HP(22),
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: "white",
    alignItems: "center",
    width: WP(90),
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  mtwoStyle: {
    flex: 1,
    height: HP(40),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    top: HP(30),
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
  delTxtStyle: { color: "white", fontWeight: "600" },
  canStyle: {
    width: WP(19),
    height: HP(6),
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.tooLightGrey,
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
    backgroundColor: "white",
  },
  pickerView: {
    borderWidth: 0.5,
    borderColor: "black",
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
  imageToUpload: { height: HP(25), width: "100%", backgroundColor: "black" },
  imageToUploadPlaceHolder: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    marginTop: HP(1),
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: Platform.OS == "android" ? 0 : HP(1),
  },
  ErorrText: { color: "red", marginTop: 10, marginBottom: 10 },
  loaderContainer: {
    position: "absolute",
    width: WP(100),
    height: HP(100),
    backgroundColor: COLORS.transparent,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldTitle: {
    marginVertical: 5,
    marginBottom: -5,
    fontWeight: "bold",
  },
  addIcon: {
    alignSelf: "center",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default WalletUploadModal;

// console.log("iddddddddddddddddddd>>>", props.encrypted_id);
// var array = ["id", "remove_id"];
// var id = { remove_id: props.encrypted_id };
// const formData = new FormData();
// formData.append("id[remove_id]", props.encrypted_id);
// console.log("fooooooooooorm data>>>", formData);
// // formData.append("id", JSON.stringify({ remove_id: props.encrypted_id }));
// try {
//   const response = await withoutStringiApiCall2({
//     route:
//       "wallet/item/file/" +
//       props.encrypted_id +
//       "/delete?" +
//       `wallet_api_token=${walletToken}`,
//     body: formData,
//     verb: "DELETE",
//     token: token,
//   });
//   console.log("single media response>>>>>> :", response);
// } catch (error) {}
// deleteSingleMedia();
// setMultipleImages(multipleImages.filter((i) => i.uri !== uri));
// setMultipleImages(filtered);
// try {
//   const response = await settingsApiCall({
//     route: `wallet/item/file/delete?wallet_api_token=${props}`,
//     verb: "DELETE",
//     params: props,
//     token: token,
//   });
//   console.log("delete iteeeeeeeeeeem", response);
// } catch (error) {}
// const formData = new FormData();
// formData.append(multipleImages);
// dispatch(
//   setNewWalletData({
//     walletToken: walletToken,
//     token: token,
//     formData: formData,
//     // setLoading: setLoading,
//     // setResponseUploadApi: setResponseUploadApi,
//   })
// );
