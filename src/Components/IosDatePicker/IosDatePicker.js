import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-date-picker";
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from "react-native";

import { WP } from "../../../Utils/Resposive";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { Text } from "react-native";
import { getFontSize, getWidth } from "../../../Utils/NewResponsive";
import FlashMessage from "react-native-flash-message";
import AntDesign from "react-native-vector-icons/AntDesign";

const IosDatePicker = (props) => {
  let flashRef = React.useRef();
  const { t } = useTranslation();

  const minimumDate = props?.setExpiry
    ? new Date()
    : props?.fromDate
    ? new Date("1900-01-01")
    : new Date("1900-01-01");
  const maximumDate = props?.setExpiry
    ? null
    : props?.fromDate
    ? new Date()
    : new Date(new Date().setFullYear(new Date().getFullYear() - 5));

  const onPress = () => {
    flashRef?.current?.showMessage({
      message: `${t("Expiry date should not be less than current date")}`,
      type: "info",
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {props?.setExpiry ? (
            <View style={styles.expiryContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={onPress}>
                <AntDesign
                  name="infocirlce"
                  size={22}
                  color={COLORS.darkGray}
                  style={{ left: 5 }}
                />
              </TouchableOpacity>
              <View style={styles.expiryTextContainer}>
                <Text style={{ fontSize: getFontSize(2) }}>
                  {t("Set Expiry Date")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={props.hideVisible}
              >
                {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.closeButton, styles.noExpiryCloseButton]}
              onPress={props.hideVisible}
            >
              {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
            </TouchableOpacity>
          )}

          <DatePicker
            maximumDate={maximumDate}
            minimumDate={minimumDate} // Set the minimum date to 1900-01-01
            is24hourSource="device"
            locale="us"
            date={props.date}
            onDateChange={(e) => props.onIosDateChange(e)}
            // onDateChange={(selectedDate) => {
            //   const currentDate = new Date();
            //   const selectedDateWithoutTime = new Date(
            //     selectedDate.getFullYear(),
            //     selectedDate.getMonth(),
            //     selectedDate.getDate()
            //   );
            //   const currentDateWithoutTime = new Date(
            //     currentDate.getFullYear(),
            //     currentDate.getMonth(),
            //     currentDate.getDate()
            //   );

            //   if (props?.setExpiry) {
            //     if (selectedDateWithoutTime < currentDateWithoutTime) {
            //       console.log("Alert condition met");
            //       Alert.alert("Expiry date cannot be less than current date");
            //     } else {
            //       console.log("Alert condition not met");
            //       props.onIosDateChange(selectedDate);
            //     }
            //   } else {
            //     props.onIosDateChange(selectedDate);
            //   }
            // }}
            mode="date"
            androidVariant="nativeAndroid"
            textColor={COLORS.black}
          />
        </View>
      </View>
      <FlashMessage
        ref={flashRef}
        position="bottom"
        floating
        duration={3000}
        icon="auto"
        style={{
          alignItems: "center",
          backgroundColor: COLORS.secondary,
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  modalView: {
    borderWidth: 3,
    borderRadius: 30,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    width: "100%",
    height: "30%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    padding: 10,
  },
  closeButton: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  expiryContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // width: getWidth(100),
    marginTop: 8,
  },
  expiryTextContainer: {
    width: getWidth(85),
    alignItems: "center",
    left: getWidth(2),
  },
  noExpiryCloseButton: {
    width: getWidth(95),
    marginTop: 8,
    justifyContent: "flex-end",
  },
});

export default React.memo(IosDatePicker);
