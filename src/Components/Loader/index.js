import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../../Constants/Colors";

const Loader = ({ size = "large", color = COLORS.primary }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Loader;
