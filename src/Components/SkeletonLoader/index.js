import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Skeleton from "react-native-reanimated-skeleton";
import { COLORS } from "../../Constants/Colors";
import { getLayout } from "./Layout";

const SkeletonLoader = ({ isLoading, layoutType }) => {
  return (
    <View style={styles.container}>
      <Skeleton
        containerStyle={{ flex: 1, width: 300 }}
        // boneColor="#121212"
        highlightColor={COLORS.primary}
        animationDirection="horizontalRight"
        animationType="shiver"
        layout={getLayout(layoutType)}
        isLoading={isLoading}
      />
    </View>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  container: { marginBottom: 100 },
});
