import { Platform, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { HP, WP } from "../../../../../../Utils/Resposive";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../../../../Constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomPicker from "../../../../../Components/CustomPickers/CustomPickerIos";
import CountryModal from "../../../EditProfile/CountryModal";
import AndroidPickerModel from "../AndroidPickerModel";
import { getWidth } from "../../../../../../Utils/NewResponsive";

const PickerComponent = ({
  title,
  countries,
  value,
  setCountryPickerValue,
  categories,
}) => {
  const { t } = useTranslation();
  const [isModal, setIsModal] = useState(false);

  return (
    <View>
      {Platform.OS === "ios" ? (
        <>
          <View style={styles.IosPicker}>
            <TouchableOpacity
              onPress={() => {
                setIsModal(true);
              }}
              style={styles.countryPickerIos}
            >
              <Text style={styles.subtext}>{value ? t(value) : t(title)}</Text>
              <Icon name="caret-down" color="#DF4B38" size={18} />
            </TouchableOpacity>
          </View>

          <CustomPicker
            visible={isModal}
            selectedValue={value}
            setValueFunc={setCountryPickerValue}
            data={countries}
            closeOnSelect={true}
            hideVisible={() => setIsModal(false)}
            categories={categories}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[
              styles.stateStyle,
              {
                marginBottom: categories ? 3 : 0,
                marginTop: categories ? 10 : 0,
              },
            ]}
            onPress={() => {
              setIsModal(true);
            }}
          >
            <Text style={styles.selectedTextStyleAndroid}>
              {value ? t(value) : t(title)}
            </Text>
            <Icon
              name="caret-down"
              color="#DF4B38"
              size={15}
              style={styles.dropDownIconStyleAndroid}
            />
          </TouchableOpacity>
          <AndroidPickerModel
            data={countries}
            isModal={isModal}
            setIsModal={setIsModal}
            selectedItem={(e) => {
              setCountryPickerValue(categories ? e.name : e.title);
              setIsModal(false);
            }}
            categories={categories}
          />
        </>
      )}
    </View>
  );
};

export default PickerComponent;

const styles = StyleSheet.create({
  IosPicker: {
    justifyContent: "center",
    borderColor: COLORS.cocoGrey,
    borderWidth: 1,
    marginTop: widthPercentageToDP("5"),
    height: heightPercentageToDP("5.2"),
    borderRadius: 10,
    right: 5,
  },
  countryPickerIos: {
    justifyContent: "space-between",
    paddingHorizontal: widthPercentageToDP("4"),
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: COLORS.black,
    textTransform: "capitalize",
  },
  stateStyle: {
    flexDirection: "row",
    width: WP(88.5),
    height: HP(6.5),
    borderWidth: 1,
    borderColor: "#686868",
    borderRadius: 6,
    marginVertical: 2,
    padding: 2,
    alignSelf: "center",
    alignItems: "center",
    right: 3,
  },
  selectedTextStyleAndroid: {
    color: "black",
    fontWeight: "500",
    fontSize: 16,
    paddingLeft: 2,
    paddingLeft: 5,
  },
  dropDownIconStyleAndroid: {
    position: "absolute",
    left: getWidth(80),
  },
});
