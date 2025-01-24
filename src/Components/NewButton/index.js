import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

export default function Button({
  buttonstyle,
  icon,
  text,
  textstyle,
  iconStyle,
  pressFunction,
  loading,
  disabled,
  disabledButtonStyle, // New prop for disabled button style
  disabledTextStyle,
}) {
  const buttonStyles = disabled
    ? [buttonstyle, disabledButtonStyle]
    : buttonstyle;
  const textStyles = disabled ? [textstyle, disabledTextStyle] : textstyle;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[buttonStyles]}
      onPress={() => {
        pressFunction();
      }}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <>
          {ICONS.ionIcons(icon, COLORS.primary, 15, iconStyle)}

          <Text style={textStyles}>{text}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
