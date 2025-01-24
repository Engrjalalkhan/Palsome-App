import { Picker as SelectPicker } from "@react-native-picker/picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../Constants/Colors";

const CustomPickerAndroid = (props) => {
  const { t } = useTranslation();

  const PickerData = (data) => {
    if (data) {
      return data.map((val, index) => (
        <SelectPicker.Item label={t(val.title)} value={val.title} key={index} />
      ));
    }
  };

  return (
    <SelectPicker
      dropdownIconColor={COLORS.primary}
      mode="dialog"
      style={{ flex: 1 }}
      selectedValue={props.selectedValue}
      onValueChange={(itemValue, itemIndex) => props.setValueFunc(itemValue)}
      onTouchCancel={() => console.log("cancelled")}
    >
      {PickerData(props.data)}
    </SelectPicker>
  );
};

export default CustomPickerAndroid;
