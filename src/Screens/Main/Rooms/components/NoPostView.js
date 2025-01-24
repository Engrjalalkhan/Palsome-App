import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PostIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../../Constants/Colors";
const NoPostView = (props) => {
  return (
    <View style={styles.container}>
      {/* <Image /> */}
      <PostIcon name="post-outline" size={40} color={COLORS.black} />
      <Text style={styles.text}>No post yet </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 18, fontWeight: "bold" },
});
export default NoPostView;
