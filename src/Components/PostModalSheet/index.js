import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { COLORS } from "../../Constants/Colors";

const PostModalSheet = () => {
  // ref
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["100%", "50%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <View style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.grey,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
});

export default PostModalSheet;
