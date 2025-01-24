import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { COLORS } from "../../../../Constants/Colors";

const ButtonCom = ({
  title,
  onPress,
  red,
  disable,
  leave,
  add,
  create,
  invite,
  join,
  cancelRequest,
  loading,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles.btnSize,
        red && styles.red,
        disable && styles.disable,
        leave && styles.leave,
        add && styles.add,
        create && styles.create,
        invite && styles.invite,
        join && styles.join,
        cancelRequest && styles.leave,
      ]}
      disabled={disable}
      onPress={onPress}
    >
      {leave && (
        <FontAwesome5Icon name="user-minus" size={HP(1.7)} color="white" />
      )}
      {add && (
        <FontAwesome5Icon name="user-plus" size={HP(1.7)} color="white" />
      )}
      {invite && <EntypoIcon name="plus" size={HP(1.7)} color="white" />}
      {join &&
        (loading ? (
          <ActivityIndicator size={"small"} color={COLORS.white} />
        ) : (
          <FontAwesome5Icon name="user-plus" size={HP(1.7)} color="white" />
        ))}
      {cancelRequest &&
        (loading ? (
          <ActivityIndicator size={"small"} color={COLORS.white} />
        ) : (
          <FontAwesome5Icon name="user-plus" size={HP(1.7)} color="white" />
        ))}

      <Text style={[leave && { fontSize: 12 }, styles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cadetBlue,
    width: WP("41"),
    height: HP("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
  },
  btnSize: {
    height: HP("4%"),
    width: WP("23%"),
  },
  text: { color: "white", fontSize: 16, fontWeight: "bold", marginLeft: 5 },
  red: { backgroundColor: COLORS.primary },
  disable: { backgroundColor: COLORS.stormGray },
  leave: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },

  add: {
    backgroundColor: COLORS.skyBlue,
    marginRight: 10,
  },
  create: {
    backgroundColor: COLORS.primary,
  },
  invite: {
    backgroundColor: COLORS.skyBlue,
  },
  join: {
    backgroundColor: COLORS.lightGreen,
    marginLeft: 10,
  },
});
export default ButtonCom;
