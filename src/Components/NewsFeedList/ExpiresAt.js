import React from "react";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import moment from "moment/moment";
import { showMessage } from "react-native-flash-message";
import AntDesign from "react-native-vector-icons/AntDesign";

import { COLORS } from "../../Constants/Colors";

const ExpiresAt = ({ time }) => {
  const { t } = useTranslation();

  const expiryTime = moment(time, "YYYYMMDD").endOf("day").fromNow();

  const onPress = () => {
    showMessage({
      message: `${t("This post will expire")} ${expiryTime} ${t("from now")}`,
      type: "info",
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingLeft: 3,
        justifyContent: "flex-end",
      }}
    >
      <AntDesign name="clockcircle" size={12} color={COLORS.darkGray} />
    </TouchableOpacity>
  );
};

export default ExpiresAt;
