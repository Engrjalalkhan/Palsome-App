import React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-date-picker";
import { COLORS } from "../../../../Constants/Colors";

const IosDatePicker = (props) => {
  const { t } = useTranslation();

  const { date, mode, visible, hideVisible, minimumDate, onIosDateChange } =
    props;

  return (
    <DatePicker
      modal
      locale="us"
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
      confirmText={t("Confirm")}
      cancelText={t("Cancel")}
    />
  );
};

export default React.memo(IosDatePicker);
