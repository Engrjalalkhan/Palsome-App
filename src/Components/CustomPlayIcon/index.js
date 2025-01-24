import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { HeightScreen } from "../TopBar/Dimensions";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

const CustomPlayIcon = ({
  sizeIcon = HeightScreen * 0.035,
  sizeCicle = HeightScreen * 0.08,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback onPress={props?.onPress}>
      <View
        style={{
          backgroundColor: "rgba(100,100,100,0.8)",
          height: sizeCicle,
          width: sizeCicle,
          borderRadius: sizeCicle,
          justifyContent: "center",
          alignItems: "center",
          ...props?.style,
        }}
      >
        {ICONS.fontAwesome5(
          "play",
          COLORS.white,
          sizeIcon,
          null,
          props?.onPress
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomPlayIcon;
