import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const ICONS = {
  ionIcons: (name, color, size, style, onPress) => (
    <Ionicons
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
    />
  ),
  fontAwesome: (name, color, size, style, onPress) => (
    <FontAwesome
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
    />
  ),
  antDesign: (name, color, size, style, onPress) => (
    <AntDesign
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
    />
  ),
  materialIcons: (name, color, size, style, onPress) => (
    <MaterialIcons
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
    />
  ),
  fontAwesome5: (name, color, size, style, onPress, solid) => (
    <FontAwesome5
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
  entypo: (name, color, size, style, onPress, solid) => (
    <Entypo
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
  materialCommunityIcons: (name, color, size, style, onPress, solid) => (
    <MaterialCommunityIcons
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
  simpleLineIcons: (name, color, size, style, onPress, solid) => (
    <SimpleLineIcon
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
  feather: (name, color, size, style, onPress, solid) => (
    <Feather
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
  octicons: (name, color, size, style, onPress, solid) => (
    <Octicons
      name={name}
      color={color}
      size={size}
      style={style}
      onPress={onPress}
      solid={solid}
    />
  ),
};
