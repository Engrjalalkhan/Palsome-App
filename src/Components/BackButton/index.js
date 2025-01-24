import React from "react";
import { TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import DeviceInfo from "react-native-device-info";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { isRTL } from "../../../Utils/IsRTL";

export default function BackButton({ goBack, backgroundStyle, style }) {
  const [isIphone14, setIsIphone14] = React.useState(false);

  React.useEffect(() => {
    const getDeviceModal = DeviceInfo.getModel();
    getDeviceModal.startsWith("iPhone 14")
      ? setIsIphone14(true)
      : setIsIphone14(false);
  }, []);

  return (
    <TouchableOpacity
      onPress={goBack}
      style={[
        backgroundStyle && {
          backgroundColor: COLORS.red,
          padding: 5,
          borderRadius: 20,
        },
        styles.container,
        style,
      ]}
    >
      <Image
        style={[
          styles.image,
          {
            marginTop:
              Platform.OS == "ios"
                ? isIphone14
                  ? heightPercentageToDP("2")
                  : null
                : null,
          },
          { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
        ]}
        source={IMAGES.leftArrow}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: getStatusBarHeight(),
    left: widthPercentageToDP("5"),
    // backgroundColor: "red",
    width: 70,
    height: 50,
    // alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
  },
});
