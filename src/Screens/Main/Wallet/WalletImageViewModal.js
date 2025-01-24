import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../../Services/Constants";
import Toast from "react-native-simple-toast";
import MyHeader from "../../../Components/MyHeader";
import { useNavigation } from "@react-navigation/native";
import { WP } from "../../../../Utils/Resposive";
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import ReactNativeZoomableView from "../../../Components/Zoom";

const MyFastImage = ({ source }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <FastImage
        style={styles.fastImage}
        source={source}
        resizeMode="contain"
        onLoadEnd={() => setLoading(false)}
      />
      <ActivityIndicator
        animating={loading}
        size={"large"}
        color={COLORS.primary}
        style={styles.activityIndicator}
      />
    </>
  );
};

const WalletImageView = ({ route }) => {
  const [disableButton, setDisableButton] = useState(false);
  const navigation = useNavigation();
  const item = route?.params?.item;
  // console.log("routes", routes);

  console.log("item", `${SITE_URL}${item?.file_path}`);

  // console.log("item", item);

  const downloadImage = async () => {
    setDisableButton(true);
    RNFetchBlob.config({
      fileName: "HelloWorld",
      fileCache: true,
      appendExt: "jpeg" || "png" || "jpg" || "gif",
      title: "file.jpg" || "file.png" || "file.jpeg" || "file.gif",
      notification: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${item?.file_path}`,
        description: "File downloaded by download manager.",
        mime: "image/jpg" || "image/png" || "image/jpeg" || "image/gif",
      },
    })
      .fetch("GET", `${SITE_URL}${item?.file_path}`)
      .then((res) => {
        // console.log("Res::>> ", res);

        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(res.data);
          // RNFetchBlob.ios.openDocument(res.data);
        }

        console.log("The file saved to ", res.path());
      })
      .catch((err) => {
        // alert("Something went wrong");
        Toast.show("Downloading canceled");

        console.log("Error::>> ", err);
      });
    Toast.show("Downloading...");

    setDisableButton(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <MyHeader heading={`Image View`} goBack={() => navigation.goBack()} /> */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => navigation.goBack()}
        >
          {ICONS.materialIcons("cancel", COLORS.grey, 35)}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadIcon}
          disabled={disableButton}
          onPress={downloadImage}
        >
          {ICONS.entypo(
            "download",
            disableButton ? COLORS.maroonBrown : COLORS.primary,
            WP(7)
          )}
        </TouchableOpacity>
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          initialZoom={1}
          bindToBorders={true}
          doubleTapZoomToCenter
          style={styles.zoomableView}
        >
          <MyFastImage
            source={{
              uri: `${SITE_URL}${item?.file_path}`,
            }}
          />
        </ReactNativeZoomableView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fastImage: {
    width: null,
    height: "100%",
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 50,
    zIndex: 1000,
  },
  downloadIcon: {
    position: "absolute",
    right: 70,
    top: 52,
    zIndex: 1000,
  },

  zoomableView: {
    padding: 1,
    backgroundColor: COLORS.black,
  },
});

export default WalletImageView;
