// BottomSheetComponent.js

import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";

const BottomSheetSavedPost = ({
  bottomSheetRef,
  onPressUnSave,
  snapPoints,
  selectedTab,
  onPressEdit,
  onPressDelete,
}) => {
  const { t } = useTranslation();

  const renderBackDrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    );
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        backgroundStyle={{ backgroundColor: COLORS.white }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={{ flex: 1 }}>
            {selectedTab === 0 ? (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onPressUnSave}
              >
                {ICONS.materialCommunityIcons(
                  "bookmark-off",
                  COLORS.primary,
                  24
                )}
                <Text style={styles.textStyle}>{t("Unsave")}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={onPressEdit}
                >
                  {ICONS.antDesign("edit", COLORS.primary, 24)}
                  <Text style={styles.textStyle}>{t("Edit")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={onPressDelete}
                >
                  {ICONS.antDesign("delete", COLORS.primary, 24)}
                  <Text style={styles.textStyle}>{t("Delete")}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    padding: 14,
    backgroundColor: "white",
  },
  textStyle: { fontSize: 20, padding: 10 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
});

export default memo(BottomSheetSavedPost);
