import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";

const NoGroups = ({ heading, subHeading }) => {
  return (
    <View style={styles.container}>
      <Image source={IMAGES.groupDark} style={styles.icon} />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  heading: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.grey,
    marginTop: 10,
    textAlign: "center",
  },
  icon: { width: 50, height: 50, resizeMode: "contain" },
});

export default NoGroups;
