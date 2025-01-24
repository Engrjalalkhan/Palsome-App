import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../../../../Constants/Colors";

const Loader = (props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={[styles.activityIndicator, props?.loaderStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    marginTop: 200,
  },
});
export default Loader;
