import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Modal from "react-native-modal";

import { launchCamera } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../Utils/ImageAndCamera";
import { WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { setMyStory } from "../../../Redux/actions/NewsFeedActions";
import { postStatusApiCall, settingsApiCall } from "../../../Services/Apis";

export default function CameraScreen({ route }) {
  // const [{cameraRef}, {takePicture}] = useCamera(null);
  // form my previos project
  const selectedvalue = ["public", "friends_only", "only_me"];
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const token = useSelector((state) => state.auth.userToken);

  const messageTime = 5;
  const camera = useRef(null);
  const circularProgress = useRef(null);
  const [checkPause, setCheckPause] = useState(false);
  const [revert, setRevert] = useState(false);
  const [flash, setFlash] = useState(true);
  const [modal, setmodal] = useState(false);
  const [imageTopost, setImageTopost] = useState();
  const [value, setvalue] = useState();
  // const [isModalVisible, setModalVisible] = useState(false);
  const [CameraData, setCameraData] = useState();
  const [fillTime, setFillTime] = useState(0);
  const [storyprivacy, setStoryprivacy] = useState("public");
  const [load, setload] = useState(false);
  const [cameraIsOpen, setCameraIsOpen] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [isScreenEnabled, setIsScreenEnabled] = useState(true);
  const [myStoryData, setmyStoryData] = useState();

  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    try {
      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      if (isCameraPermitted) {
        const resData = await launchCamera(options);

        if (resData?.didCancel) {
          navigation.pop(2);
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
          console.log(resData, "RESDATAaaaaaa");
          setImageTopost({
            uri: resData?.assets[0]?.uri,
            type: resData?.assets[0]?.type
              ? resData?.assets[0]?.type
              : "video/mp4",
            name: resData?.assets[0]?.fileName,
          });

          setmodal(true);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    captureImage(route.params.type);
  }, []);
  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  const formatTime = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // const readyToPost = async () => {
  //   setload(true);
  //   var myHeaders = new Headers();
  //   myHeaders.append("Accept", "application/json");
  //   myHeaders.append("Authorization", "Bearer" + " " + token);
  //   const formData = new FormData();
  //   formData.append("files[0]", imageTopost);
  //   formData.append("story_text", `"${value}"`);
  //   formData.append("story_privacy", storyprivacy);
  //   formData.append("temporary_story", 0);
  //   console.log("apiURL====>", apiURL);
  //   console.log(
  //     "formdata==>              jjj",
  //     JSON.stringify(formData, null, 2)
  //   );
  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: formData,
  //   };
  //   await fetch(BASE_URL + `/story`, requestOptions)
  //     .then((response) => {
  //       // response.json();
  //       console.log("resssssssssss", response);
  //     })
  //     .then((result) => {
  //       console.log("Respons media Story", result);
  //       Toast.show("Upload Successfully", Toast.LONG);
  //       if (result.responseCode === 200) {
  //         setload(false);
  //         console.log("resssulttt", result);
  //         // dispatch(setMyStory());
  //         console.log("textstory api response ===>", result);
  //         Toast.show("Upload Successfully", Toast.LONG);
  //       } else {
  //         console.log("textstory api response on error ===>", result);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("media Post error", error);
  //     });
  // };
  const loadStories = async () => {
    // alert('2nd');
    console.log("llllll");
    try {
      const res = await settingsApiCall({
        route: "story",
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        // alert('done');
        console.log("res !== 200 in fetch Stories ===>junaid", res);
      } else if (res.responseCode == 200) {
        console.log("res in fetch friends  ===>junaid", res.payload.data);
        // alert('second load stories');
        console.log(
          "load my story",
          JSON.stringify(res.payload.data.stories),
          null,
          2
        );
        setmyStoryData(res.payload.data.my_story);
        // alert('updated again');

        dispatch(setMyStory(res.payload.data.stories));
      }
    } catch (error) {
      console.log("saga login error -- ", error.toString());
    }
  };

  useEffect(() => {
    navigation.navigate("NewsFeed");
  }, [myStoryData]);

  const readyToPost = async () => {
    setload(true);

    const formData = new FormData();
    formData.append("files[0]", imageTopost);
    formData.append("story_text", `"${value}"`);
    formData.append("story_privacy", storyprivacy);
    formData.append("temporary_story", 0);
    console.log(
      "formdata==>              jjj",
      JSON.stringify(formData, null, 2)
    );

    const response = await postStatusApiCall({
      route: "story",
      verb: "POST",
      token: token,
      body: formData,
    });

    if (response.responseCode !== 200) {
      Toast.show("Please Try Again", Toast.LONG);
      console.log("post story api response on error ===>", response);
      navigation.navigate("NewsFeed");
    } else {
      loadStories();
      Toast.show("Story Posted Successfully", Toast.LONG);
      console.log("Story Posted Successfully");
      // navigation.navigate("NewsFeed");
    }
  };

  const startRecord = async () => {
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setCurrentTime((currentTime) => currentTime + 1);
    }, 1000);
    const options = { maxDuration: 16 };
    const data = await camera.current.recordAsync(options);
    console.log("///////////", data);
    setIsRecording(false);
    setCameraData(data?.uri);
    setmodal(true);
    const uri = data?.uri;
    const type = "video/mp4";
    const name = data?.uri;
    const MyObject = { uri, type, name };
    setImageTopost(MyObject);
    setCameraIsOpen(false);
    clearInterval(timerRef?.current);
    setCurrentTime(0);
  };

  const Stop = () => {
    camera?.current.stopRecording();

    setCheckPause(false);
  };

  const Pause = () => {
    setCheckPause(true);
    clearInterval(messageTime);
    camera?.current.pauseRecording();
    clearInterval(timerRef.current);
    // setIsRecording(false);
  };
  // const Resume = () => {
  //   camera?.current.resumeRecording();
  //   timerRef?.current = setInterval(() => {
  //     setCurrentTime((currentTime) => currentTime + 1);
  //   }, 1000);
  //   setIsRecording(true);
  //   setCheckPause(false);
  // };

  const PendingView = () => {
    <View
      style={{
        flex: 1,
        backgroundColor: "lightgreen",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Waiting</Text>
    </View>;
  };

  const takePictureTow = async (camera) => {
    // alert('before camera');
    if (camera) {
      const options = { quality: 0.2, base64: false };
      const data = await camera.takePictureAsync(options);
      setCameraData(data.uri);
      setmodal(true);
      const uri = data.uri;
      const type = "image/jpg";
      const name = data.uri;
      const MyObject = { uri, type, name };
      setImageTopost(MyObject);
      setCameraIsOpen(false);

      // toggleModal();
      // navigation.goBack();
      // navigation.navigate('ReviewPost');

      // navigation.navigate('ReviewPost', {
      //   // SelectedData: CameraData,
      // });
    }
  };
  // const captureHandle = async () => {
  //   try {
  //     const data = await takePicture();
  //     console.log(data.uri);
  //     const filePath = data.uri;
  //     const newFilePath = RNFS.DocumentDirectoryPath + '/MyTest.jpg';
  //     RNFS.moveFile(filePath, newFilePath)
  //       .then(() => {
  //         console.log('image moved', filePath, '--to--', newFilePath);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log('erro', error);
  //   }
  // };

  const closeModal = () => {
    setmodal(false);
    setCameraIsOpen(true);
  };
  return (
    <SafeAreaView style={[styles.body, { opacity: 0.5 }]}>
      {/* {cameraIsOpen && (
        <RNCamera
          ref={camera}
          camera={true}
          // mirrorImage={RNCamera.Constants.Orientation.auto}
          // type={RNCamera.Constants.Type.front}
          videoStabilizationMode={true}
          captureAudio={true}
          type={
            revert
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={
            flash
              ? RNCamera.Constants.FlashMode.off
              : RNCamera.Constants.FlashMode.on
          }
          androidCameraPermissionOptions={{
            title: "Permision to use Camera",
            message: "Palsome want to access your camera for recording story",
            buttonPositive: "ok",
            buttonNegative: "Cancel",
          }}
          // onGoogleVisionBarcodesDetected={({barcodes}) => {
          // }}
          androidRecordAudioPermissionOptions={{
            title: "Permissions to use Audio recording",
            message: "Palsome wants to access your microphone for recording ",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
          style={[styles.Preview]}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== "READY") return PendingView();
            return (
              <View style={styles.cameraContainer}>
                <TouchableOpacity activeOpacity={1}>
                  <View style={styles.secondView}>
                    <TouchableOpacity
                      onPress={() => navigation.pop(2)}
                      style={styles.rvtStyle}
                    >
                      {ICONS.ionIcons("close", COLORS.white, hp(5))}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setFlash(!flash)}
                      style={styles.btnFlash}
                    >
                      {flash
                        ? ICONS.ionIcons(
                            "flash-off-outline",
                            COLORS.white,
                            hp(4)
                          )
                        : ICONS.ionIcons("flash-outline", COLORS.white, hp(4))}
                    </TouchableOpacity>
                    {isRecording && (
                      <Text
                        style={{
                          position: "absolute",
                          marginLeft: WP(45),
                          width: WP(15),
                          marginTop: HP(10),
                          fontSize: 24,
                          color: "white",
                        }}
                      >
                        {formatTime(currentTime)}
                      </Text>
                    )}

                    {!checkPause && !isRecording && (
                      <TouchableOpacity
                        onPress={() => setRevert(!revert)}
                        style={styles.rvtStyle}
                      >
                        {ICONS.ionIcons(
                          "ios-camera-reverse-outline",
                          COLORS.white,
                          hp(4)
                        )}
                      </TouchableOpacity>
                    )}
                  </View>

                 

                  <View style={styles.saveView}>
                    {route.params.type == "image" && (
                      <TouchableOpacity
                        // onPress={() => captureHandle(camera)}
                        onPress={() => takePictureTow(camera)}
                        style={styles.capture1}
                      >
                        {ICONS.fontAwesome(
                          "dot-circle-o",
                          COLORS.white,
                          HP(10)
                        )}
                      </TouchableOpacity>
                    )}
                    {route.params.type == "video" &&
                      !checkPause &&
                      !isRecording && (
                        <TouchableOpacity
                          onPress={() => startRecord()}
                          style={styles.capture1}
                        >
                          {ICONS.fontAwesome(
                            "dot-circle-o",
                            COLORS.white,
                            HP(10)
                          )}
                        </TouchableOpacity>
                      )}
                    {isRecording && (
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => Stop()}
                          style={styles.capture1}
                        >
                          {ICONS.fontAwesome(
                            "stop-circle-o",
                            COLORS.red,
                            HP(10)
                          )}
                        </TouchableOpacity>
                        {!checkPause && (
                          <TouchableOpacity
                            onPress={() => Pause()}
                            style={styles.capture1}
                          >
                            {ICONS.fontAwesome(
                              "pause-circle-o",
                              COLORS.white,
                              HP(10)
                            )}
                          </TouchableOpacity>
                        )}
                        {checkPause && (
                          <TouchableOpacity
                            onPress={() => Resume()}
                            style={styles.capture1}
                          >
                            {ICONS.fontAwesome(
                              "play-circle-o",
                              COLORS.white,
                              HP(10)
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      )} */}
      <View style={[styles.imageView, { opacity: 0.1 }]}>
        <Modal isVisible={modal} style={styles.modalStyle}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}
            style={styles.modalFirstView}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: Platform.OS == "ios" ? hp(2) : hp(0.5),
              }}
            >
              {/* <View style={styles.crossStyle}> */}
              <TouchableOpacity
                disabled={load}
                onPress={() =>
                  Alert.alert("Are you sure?", "You really want to discard?", [
                    {
                      text: "Yes",
                      onPress: () => {
                        navigation.pop(2);
                      },
                    },

                    {
                      text: "No",
                    },
                  ])
                }
                style={[
                  styles.btnStyle,
                  {
                    postion: "absolute",
                    zIndex: 1,
                  },
                ]}
              >
                {ICONS.entypo("cross", load ? "gray" : COLORS.white, 28)}
              </TouchableOpacity>
              {/* </View> */}
              {/* <View style={styles.modalView}> */}
              {/* <View style={styles.iconView}>
                        {storyprivacy == "public"
                          ? ICONS.fontAwesome5("globe-africa", COLORS.white, 19)
                          : storyprivacy == "friends_only"
                          ? ICONS.fontAwesome5(
                              "user-friends",
                              COLORS.white,
                              14,
                              styles.newPostIcon
                            )
                          : ICONS.fontAwesome5(
                              "user-alt",
                              COLORS.white,
                              14,
                              styles.newPostIcon
                            )}
                      </View> */}
              {/* <ModalDropdown
                        showsVerticalScrollIndicator={false}
                        defaultValue="public"
                        options={["public", "friends only", "only me"]}
                        onSelect={(index, option) => {
                          setStoryprivacy(selectedvalue[index]);
                          console.log("val", selectedvalue[index]);
                        }}
                        textStyle={{
                          color: COLORS.white,
                          textTransform: "capitalize",
                          fontSize: 15,
                        }}
                        dropdownTextStyle={{
                          textTransform: "capitalize",
                        }}
                        dropdownStyle={styles.dropStyle}
                        defaultTextStyle={styles.defText}
                        style={styles.andrioPicker}
                        renderRightComponent={() => (
                          <View style={styles.rightStyle}>
                            {ICONS.antDesign("caretdown", COLORS.white, 14, {
                              paddingLeft: wp(1),
                            })}
                          </View>
                        )}
                      /> */}
              {/* </View> */}
            </View>
            {load == true ? (
              <View style={styles.indicatStyle}>
                <ActivityIndicator size={45} color={COLORS.primary} />
              </View>
            ) : null}
            {/* <TouchableWithoutFeedback> */}
            {console.log("urllllldlldl", imageTopost)}
            <View style={styles.imgStyle}>
              {route?.params?.type == "video" && (
                <TouchableOpacity
                  disabled={load}
                  onPress={() => {
                    setPaused(!paused);
                    Keyboard.dismiss();
                  }}
                >
                  {/* <Video
                    source={{ uri: imageTopost?.uri }}
                    resizeMode={"cover"}
                    style={{
                      width: wp(100),
                      // flex: 1,
                      height: hp(73),
                      borderRadius: wp(3),
                      // backgroundColor: 'blue',
                    }}
                    repeat={true}
                    paused={paused}
                  /> */}
                  <Video
                    source={{ uri: imageTopost?.uri, type: imageTopost?.type }}
                    ref={(ref) => console.log(ref, "REF")}
                    onBuffer={(onBuf) => console.log(onBuf, "onBuffer")}
                    onError={(onErr) => console.log(onErr, "onError")}
                    onEnd={(nEnd) => console.log(nEnd, "onEnd")}
                    style={styles.videoStyle}
                  />
                </TouchableOpacity>
              )}
              {route.params.type == "image" && (
                <ImageBackground
                  source={{ uri: imageTopost?.uri }}
                  // style={styles.imgback}
                  resizeMode={"cover"}
                  style={{
                    width: wp(100),
                    // flex: 1,
                    height: hp(73),
                    borderRadius: wp(3),
                    // backgroundColor: 'blue',
                  }}
                />
              )}
              {Platform.OS == "android" ? (
                <KeyboardAvoidingView
                  style={[styles.inputcontainer, { width: wp(100) }]}
                >
                  <View style={[styles.imgView, { width: wp(80) }]}>
                    <TextInput
                      // key={index}
                      editable={!load}
                      value={value}
                      onChangeText={(val) => setvalue(val)}
                      style={[
                        styles.inputStyle,
                        { color: load ? COLORS.secondary : "gray" },
                      ]}
                      multiline
                      placeholder="Enter message..."
                    />
                  </View>
                  <TouchableOpacity
                    disabled={load}
                    onPress={async () => {
                      try {
                        setPaused(true);
                        Keyboard.dismiss();
                        readyToPost();
                        setTimeout(() => {
                          Toast.show(
                            "Story is uploading in the background",
                            Toast.LONG
                          );
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
                    ]}
                  >
                    {ICONS.ionIcons("md-send-sharp", COLORS.white, 25)}
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              ) : null}
              {/* </Video> */}
            </View>
            {/* </TouchableWithoutFeedback> */}
            {Platform.OS == "ios" ? (
              <KeyboardAvoidingView
                style={{ backgroundColor: "red" }}
                keyboardVerticalOffset={hp(3)}
                behavior={"position"}
              >
                <View style={[styles.inputcontainer, { width: wp(100) }]}>
                  <View style={[styles.inputView, { width: wp(80) }]}>
                    <TextInput
                      // key={index}
                      value={value}
                      onChangeText={(val) => setvalue(val)}
                      style={styles.inputStyle}
                      multiline
                      placeholder="Enter message..."
                      onPress={() => alert("junaid")}
                    />
                  </View>
                  <TouchableOpacity
                    disabled={load}
                    onPress={() => {
                      readyToPost();
                      Keyboard.dismiss();
                      setIsScreenEnabled(false);
                    }}
                    style={[
                      styles.sendStyle,
                      { backgroundColor: load ? "gray" : COLORS.primary },
                    ]}
                  >
                    {ICONS.ionIcons("ios-send", COLORS.white, 20)}
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            ) : null}
            {/* <Text>I am the modal content!</Text> */}
          </TouchableOpacity>

          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    // backgroundColor: "#000",
  },
  Preview: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // transform: [{ scaleX: -1 }],
  },
  modalFirstView: {
    // width: wp(100),
    // height: hp(100),
    flex: 1,
    backgroundColor: "Gray",
    // justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: "center",
  },
  imgStyle: {
    // width: wp(100),
    // height: hp(90),
    flex: 1,
    // backgroundColor: 'green',
    justifyContent: "center",
    alignItems: "center",
  },
  imgback: {
    width: wp(100),
    height: hp(80),
    flex: 1,
    borderRadius: wp(3),
  },
  cameraContainer: {
    // flex: 1,
    width: wp(100),
    height: hp(100),
    // justifyContent: 'center',
  },
  circleStyle: {
    backgroundColor: "transparent",
    justifyContent: "center",
    marginLeft: wp(10),
  },
  secondView: {
    flexDirection: "row",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    width: "100%",
    // height: hp(10),
    justifyContent: "space-between",
    opacity: 0.8,
    paddingHorizontal: WP(2),
    // marginBottom: hp(58),
    paddingTop: Platform.OS == "ios" ? hp(4) : hp(3),
    // backgroundColor: "red",
  },
  rvtStyle: {
    // backgroundColor: 'green',
    width: wp(10),
    height: hp(6),
    // marginLeft: wp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  btnFlash: {
    width: wp(9),
    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  buttonStyles: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  modalStyle: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    // width: wp(100),
    // height: wp(100),
  },
  btnStyle: {
    width: wp(12),
    height: hp(5),
    borderRadius: 12,
    // backgroundColor: 'blue',
    justifyContent: "center",
    alignItems: "center",
  },
  sendStyle: {
    width: WP(14),
    height: WP(14),

    borderColor: COLORS.white,
    borderWidth: 0.5,
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",

    borderRadius: WP(20),

    right: WP(1),
  },
  inputStyle: {
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 18,
    color: COLORS.secondary,
  },
  saveView: {
    alignSelf: "center",

    width: wp(40),
    height: hp(10),
    marginTop: Platform.OS == "ios" ? hp(76) : hp(80),

    // backgroundColor: "blue",
  },
  saveStyle: {
    // marginTop: hp(8),
    width: wp(12),
    height: hp(4),
    borderRadius: hp(1),
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginRight: hp(5),
  },
  progressStyle: {
    backgroundColor: "transparent",
    justifyContent: "center",
    marginLeft: wp(5),
  },
  capture1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: hp(3),
  },
  capture: {
    flex: 0,
    backgroundColor: "#108DAA",
    borderColor: COLORS.white,
    borderWidth: 3,
    borderRadius: 50,
    padding: 25,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: COLORS.error,

    alignSelf: "center",
  },
  lastImg: {
    width: wp(19),
    height: hp(12),
    borderRadius: wp(3),
  },
  inputcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: hp(0.1),
    // maxHeight: 100,
    padding: 5,
  },
  inputView: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 2,
    padding: Platform.OS == "ios" ? hp(1.2) : hp(0.5),
  },
  imgView: {
    backgroundColor: COLORS.white,

    borderRadius: 10,
    elevation: 2,
  },
  dropStyle: {
    backgroundColor: "transparent",
    height: hp(15.2),
    width: wp(28),
  },
  andrioPicker: {
    // backgroundColor: COLORS.primary,
    width: wp(24),
    justifyContent: "center",
    alignContent: "center",
    marginRight: hp(3),
    marginLeft: wp(2),
    // height: hp(5),
    // marginTop: hp(1),
  },
  rightStyle: {
    width: wp(7),
    flexDirection: "row",
    height: hp(3),
    position: "absolute",
    zIndex: 1000,
    // right: 0,
    top: 4,
    left: 80,
  },
  mainView: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.primary,
    marginRight: hp(2),
  },
  modalView: {
    width: wp(36),
    height: hp(5),
    paddingTop: Platform.OS == "ios" ? hp(2) : hp(0),
    // position:'absolute',

    alignItems: "center",
    right: wp(3),
    top: Platform.OS == "ios" ? hp(1) : hp(0),
    // backgroundColor: COLORS.primary,
    flexDirection: "row",
    zIndex: 1000,
    position: "absolute",
  },
  iconView: {
    justifyContent: "center",
    alignItems: "center",
    top: Platform.OS == "ios" ? hp(0.5) : hp(0),
    paddingLeft: wp(0.5),
  },
  deftex: {
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    fontSize: 16,
    marginLeft: wp(1),
  },
  indicatStyle: {
    flex: 1,
    width: wp(20),
    height: hp(10),
    // backgroundColor: "tra",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: hp(40),
    left: wp(40),
    zIndex: 1000,
    borderRadius: 40,
  },
  lastView: {
    width: wp(20),
    height: hp(12),
    borderRadius: wp(3),
    backgroundColor: "Gray",
    position: "absolute",
    bottom: hp(3),
    left: WP(5),
    justifyContent: "center",
    alignItems: "center",
  },
  imageView: {
    backgroundColor: "#000000",
    flex: 1,
  },
  videoStyle: {
    width: wp(100),
    height: hp(87),
    justifyContent: "center",
    alignItems: "center",
  },
  // crossStyle: {
  //   // backgroundColor: "rgba(52, 52, 52, 0.8)",
  //   backgroundColor: "#000000",
  //   width: "100%",
  //   // height: hp(10),
  //   justifyContent: "space-between",
  //   opacity: 0.8,
  //   paddingHorizontal: WP(2),
  //   // marginBottom: hp(58),
  //   paddingTop: Platform.OS == "ios" ? hp(4) : hp(3),
  // },
});
