import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { HP, WP } from "../../../../../Utils/Resposive";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { COLORS } from "../../../../Constants/Colors";

const NoReels = (props) => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="video-slash" size={50} color={COLORS.white} />
      <Text style={styles.text}>No Reels Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: HP(100),
    width: WP(100),
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: COLORS.white, fontSize: 20, marginTop: 10 },
});
export default NoReels;
