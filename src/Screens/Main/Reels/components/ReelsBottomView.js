import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";
import DeviceInfo from "react-native-device-info";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import NewsFeedText from "../../../../Components/NewsFeedList/NewsFeedText";

const ReelsBottomView = ({ title, clipStop, stop }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [deviceModel, setDeviceModel] = useState();

  useEffect(() => {
    const getDeviceModel = DeviceInfo.getModel();
    setDeviceModel(getDeviceModel);
  }, []);

  const bottomPosition = () => {
    const screenHeight = Dimensions.get("window").height;
    switch (deviceModel) {
      case "iPhone 8 Plus":
      case "iPhone 8":
        return screenHeight * 0.13;
      case "iPhone 11":
      case "iPhone 12":
      case "iPhone 13":
        return screenHeight * 0.202;
      default:
        return Platform.OS === "ios"
          ? screenHeight * 0.16
          : screenHeight * 0.12;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: title?.length && COLORS.black },
        { bottom: stop ? bottomPosition() : 50 },
      ]}
    >
      <ScrollView
        style={[styles.scrollContainer]}
        contentContainerStyle={styles.scrollContent}
      >
        <NewsFeedText
          txt={title}
          color={COLORS.white}
          clipStop={() => clipStop()}
          stop={stop}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    width: "100%",
    backgroundColor: COLORS.black,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    marginVertical: 10,
    margin: 5,
    paddingRight: 34,
    maxHeight: 200,
    width: getHeight(43),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default ReelsBottomView;
