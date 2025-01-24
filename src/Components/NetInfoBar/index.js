import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { useNetInfo } from "@react-native-community/netinfo";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { useTranslation } from "react-i18next";

const NetInfoBar = (props) => {
  const { t } = useTranslation();
  const netInfo = useNetInfo();
  const [offline, setOffline] = useState(true);
  // const offline = netInfo
  //   ? netInfo?.isConnected && netInfo?.isInternetReachable
  //   : true;
  useEffect(() => {
    const status = netInfo?.isConnected && netInfo?.isInternetReachable;

    status == null ? null : setOffline(status);
  }, [netInfo]);

  return (
    <>
      {!offline ? (
        <View style={styles.container}>
          {ICONS.materialCommunityIcons(
            "wifi-off",
            COLORS.primary,
            getWidth(5)
          )}
          <Text style={styles.text}>{t("You are currently offline")}</Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: COLORS.black,
    position: "absolute",
    bottom: getHeight(10),
    zIndex: 1000,
    marginHorizontal: getWidth(5),
    borderRadius: getWidth(3),
    padding: getWidth(4),
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: COLORS.primary,
    fontWeight: "bold",
    marginLeft: getWidth(3),
    fontSize: getWidth(4),
  },
});
export default NetInfoBar;
