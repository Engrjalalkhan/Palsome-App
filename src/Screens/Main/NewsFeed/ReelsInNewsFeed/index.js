import React from "react";
import { View, StyleSheet } from "react-native";
import ReelsFlatList from "./ReelsFlatList";

const index = ({ homeRealApiData }) => {
  return (
    <View style={styles.container}>
      <ReelsFlatList realApiData={homeRealApiData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
});
export default React.memo(index);
