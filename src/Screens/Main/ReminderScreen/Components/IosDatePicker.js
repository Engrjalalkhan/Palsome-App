import React from "react";
import DatePicker from "react-native-date-picker";
import { COLORS } from "../../../../Constants/Colors";

const IosDatePicker = (props) => {
  const { date, mode, visible, hideVisible, minimumDate, onIosDateChange } =
    props;

  return (
    <DatePicker
      modal
      locale="en-US"
      date={date}
      mode={mode}
      title={null}
      theme="light"
      open={visible}
      onCancel={hideVisible}
      is24hourSource="device"
      textColor={COLORS.black}
      minimumDate={minimumDate}
      androidVariant="iosClone"
      onConfirm={(e) => {
        onIosDateChange(e);
        hideVisible();
      }}
    />
  );
};

export default React.memo(IosDatePicker);
