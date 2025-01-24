import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";

const NoEvents = ({ heading, subHeading }) => {
  return (
    <View style={styles.container}>
      <Image source={IMAGES.events} style={styles.icon} />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </View>
  );
};

export default NoEvents;

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    alignItems: "center",
    justifyContent: "center",
  },

  heading: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
  },

  subHeading: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "400",
    color: COLORS.grey,
    textAlign: "center",
  },

  icon: { width: 50, height: 50, resizeMode: "contain" },
});
