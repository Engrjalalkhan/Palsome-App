import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const DynamicBottomSheet = ({
  bottomSheetRef,
  snapPoints,
  actions = [],
  selectedValue,
  onActionPress,
  onClose,
  backgroundColor = "white",
  textStyle = {},
  iconContainerStyle = {},
  tickIcon,
}) => {
  const renderBackDrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        backgroundStyle={{ backgroundColor }}
        onDismiss={onClose}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={{ flex: 1 }}>
            {actions.map((action, index) => (
              <TouchableOpacity
                disabled={selectedValue === action.value}
                key={index}
                style={[styles.iconContainer, iconContainerStyle]}
                onPress={() => onActionPress && onActionPress(action.label)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  {action.icon}
                  <Text style={[styles.textStyle, textStyle]}>
                    {action.label}
                  </Text>
                </View>
                {selectedValue === action.value && tickIcon}
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 20,
    bottom: 10,
  },
  textStyle: { fontSize: 20, padding: 10 },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default memo(DynamicBottomSheet);
