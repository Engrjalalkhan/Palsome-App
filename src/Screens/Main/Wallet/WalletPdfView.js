import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import MyHeader from "../../../Components/MyHeader";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import { SITE_URL } from "../../../Services/Constants";
import RNFetchBlob from "rn-fetch-blob";
import { COLORS } from "../../../Constants/Colors";

const WalletPdfView = ({ route }) => {
  const [disableButton, setDisableButton] = useState(false);
  const { file_path } = route.params.item;
  const navigation = useNavigation();
  // console.log("file_path", `${SITE_URL}${file_path}`);

  const onPressDownload = async () => {
    // alert("FIle Downloaded");
    setDisableButton(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: "pdf",
      title: "file.pdf",
      notification: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${file_path}`,
        description: "File downloaded by download manager.",
        mime: "application/pdf",
      },
    })
      .fetch("GET", `${SITE_URL}${file_path}`)
      .then((res) => {
        console.log("Res::>> ", res);
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(res.data);
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
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={`PDF View`}
        rightIconName={"download"}
        onPressRight={onPressDownload}
        disableButton={disableButton}
      />

      <WebView
        scalesPageToFit={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="DF4B38"
            style={{ marginBottom: 20 }}
          />
        )}
        source={{
          // uri: `${SITE_URL}${file_path}`,
          uri:
            Platform.OS === "ios"
              ? `${SITE_URL}${file_path}`
              : `https://drive.google.com/viewerng/viewer?embedded=true&url=${SITE_URL}${file_path}`,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});

export default WalletPdfView;
