import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { COLORS } from "../../../../Constants/Colors";

const RoomsSearchList = ({ data, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={{ alignSelf: "center" }}>Data found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
export default RoomsSearchList;
