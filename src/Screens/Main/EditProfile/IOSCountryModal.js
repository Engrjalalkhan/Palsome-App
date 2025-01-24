import { Picker as SelectPicker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Modal } from "react-native";
import { useSelector } from "react-redux";

import { WP } from "../../../../Utils/Resposive";

import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

const IOSCountryModal = (props) => {
  // const navigation = useNavigation();
  const PickerData = (data) => {
    // console.log("data - - ", data);
    if (data) {
      return data.map((val, index) => (
        <SelectPicker.Item
          label={val.title}
          value={val.value ? val.value : val.title}
          key={index}
        />
      ));
    }
    // else {
    //   navigation.navigate("SessionExpiredScreen");
    // }
  };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={props.visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 8,
                marginHorizontal: 10,
              }}
              onPress={props.hideVisible}
            >
              {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
            </TouchableOpacity>
            <SelectPicker
              // mode="dialog"
              style={{ height: 50, width: "100%" }}
              // selectedValue={props.selectedValue}
              onValueChange={
                (itemValue, itemIndex) => props.setValueFunc(itemValue)
                // console.log("the data is" + itemValue)
              }
            >
              {PickerData(props.data)}
            </SelectPicker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    width: "100%",
    height: "40%",
    position: "absolute",
    bottom: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: COLORS.magendaPink,
  },
  buttonClose: {
    backgroundColor: COLORS.skyBlue,
  },
  textStyle: {
    color: COLORS.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default IOSCountryModal;
