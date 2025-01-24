import * as React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import HeightScreen from "./Dimensions/index";
import WidthScreen from "./Dimensions/index";
// import {color} from 'react-native-reanimated';
import { heightPercentageToDP } from "react-native-responsive-screen";
import { getStatusBarHeight, isIPhone12 } from "react-native-status-bar-height";
import { memo } from "react";
import DeviceInfo from "react-native-device-info";
import { COLORS } from "../../Constants/Colors";

const TopBar = memo(({ title }) => {
  const [isIphone14, setIsIphone14] = React.useState(false);

  React.useEffect(() => {
    const getDeviceModal = DeviceInfo.getModel();
    getDeviceModal.startsWith("iPhone 15")
      ? setIsIphone14(true)
      : setIsIphone14(false);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          height:
            Platform.OS == "ios"
              ? isIphone14
                ? heightPercentageToDP("9")
                : heightPercentageToDP("8.5")
              : heightPercentageToDP("3.5"),
        },
      ]}
    >
      <Text style={styles.textStyle}>{title}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: WidthScreen,
    // marginTop: Platform.OS == "ios"? 31:null,
    color: COLORS.primary,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: COLORS.white,
    fontSize: 17,
    marginBottom: heightPercentageToDP("0.5"),
    fontWeight: "700",
  },
});

export default TopBar;
