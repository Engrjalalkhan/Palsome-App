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
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const BottomSheetComponent = ({
  bottomSheetRef,
  onPressComplete,
  onPressEdit,
  onPressDelete,
  onPressRemoveFriend,
  activeBottomSheet,
  snapPoints,
  selectedTab,
  onPressLeaveReminder,
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
          {activeBottomSheet ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onPressRemoveFriend}
              >
                {ICONS.entypo("remove-user", COLORS.primary, 24)}
                <Text style={styles.textStyle}>{t("Remove")}</Text>
              </TouchableOpacity>
            </View>
          ) : selectedTab === t("Friends Reminders") ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onPressLeaveReminder}
              >
                {ICONS.materialCommunityIcons(
                  "bell-off-outline",
                  COLORS.primary,
                  24
                )}

                <Text style={styles.textStyle}>{t("Leave This Reminder")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {selectedTab !== t("Completed Reminders") && (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={onPressComplete}
                >
                  {ICONS.materialCommunityIcons(
                    "check-circle-outline",
                    COLORS.primary,
                    24
                  )}

                  <Text style={styles.textStyle}>{t("Complete")}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  selectedTab === t("Completed Reminders")
                    ? onPressEdit("complete")
                    : onPressEdit();
                }}
              >
                {ICONS.antDesign("edit", COLORS.primary, 24)}
                <Text style={styles.textStyle}>{t("Edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onPressDelete}
              >
                {ICONS.antDesign("delete", COLORS.primary, 24)}
                <Text style={styles.textStyle}>{t("Delete Reminder")}</Text>
              </TouchableOpacity>
            </View>
          )}
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

export default memo(BottomSheetComponent);
