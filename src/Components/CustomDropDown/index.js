//import liraries
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { COLORS } from "../../Constants/Colors";

const CustomDropDown = (props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Apple2", value: "apple2" },
    { label: "Banana2", value: "banana2" },
    { label: "Apple3", value: "apple3" },
    { label: "Banana3", value: "banana3" },
    { label: "Apple4", value: "apple4" },
    { label: "Banana4", value: "banana4" },
    { label: "Apple5", value: "apple5" },
    { label: "Banana5", value: "banana5" },
    { label: "Apple6", value: "apple6" },
    { label: "Banana6", value: "banana6" },
  ]);
  return (
    <DropDownPicker
      dropDownStyle={styles.dropDownContainerAndroid}
      zIndex={1000}
      zIndexInverse={2000}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      maxHeight={200}
      dropDownDirection="TOP"
      listMode="SCROLLVIEW"
      placeholder="Country"
      showArrowIcon={true}
      showTickIcon={false}
      arrowIconStyle={{
        width: 15,
        height: 15,
      }}
      style={{ borderColor: COLORS.darkGray, borderRadius: 0 }}
      dropDownContainerStyle={{
        backgroundColor: COLORS.white,
      }}
    />
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropDownContainerAndroid: {
    // display: 'flex',
    flex: 1,
    height: widthPercentageToDP("13"),
    width: widthPercentageToDP("10"),
    justifyContent: "center",
    // fontFamily: 'Assistant-Bold',
  },
});

//make this component available to the app
export default CustomDropDown;
