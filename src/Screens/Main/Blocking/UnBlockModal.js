import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";

import { WP, HP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

const sizeIcon = WP(18);
const UnBlockModal = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={props?.isVisible}
      transparent={true}
      style={styles.mtwoStyle}
      animationType="slide"
    >
      <View
        style={{
          flex: 1,
          width: WP(100),
          height: HP(100),
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            alignItems: "center",
            width: WP(90),
            paddingVertical: 20,
            borderRadius: 30,
            borderWidth: 1,
          }}
        >
          <View style={styles.excelStyle}>
            {ICONS.antDesign("exclamationcircleo", COLORS.yellow, sizeIcon)}
          </View>
          <View style={styles.surestyle}>
            <Text style={styles.SureText}>{t("Are you sure?")}</Text>
            <Text style={styles.delTex}>
              {t("You want to unblock")} {props?.userToUnBlock?.first_name}{" "}
              {props?.userToUnBlock?.last_name}
            </Text>
          </View>
          <View style={styles.modalbuttonStyle}>
            <TouchableOpacity
              onPress={() => props?.setIsVisibleUnBlockModal(false)}
              style={styles.canStyle}
            >
              <Text style={styles.canText}>{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props?.onUnblock()}
              style={styles.deleteButton}
            >
              <Text style={styles.delTxtStyle}>{t("Unblock")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mtwoStyle: {
    flex: 1,
    height: HP(40),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    top: HP(30),
    borderRadius: 15,
    width: WP(85),
    position: "absolute",
    zIndex: 1000,
    backgroundColor: COLORS.white,
  },
  excelStyle: {
    width: sizeIcon,
    height: sizeIcon,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    shadowColor: COLORS.black,
    shadowOpacity: 0.7,
    elevation: 8,
    shadowRadius: 15,
    shadowOffset: { width: 2, height: 13 },
  },
  surestyle: {
    width: WP(53),
    marginTop: HP(3),
    // height: HP(12),
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },
  SureText: {
    color: COLORS.black,
    fontWeight: "800",
    fontSize: 21,
  },
  delTex: {
    color: COLORS.primary,
    fontWeight: "400",
    fontSize: 14,
    marginVertical: HP(1),
  },
  modalbuttonStyle: {
    width: "50%",
    // height: HP(10),
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  deleteButton: {
    width: WP(19),
    height: HP(6),
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  delTxtStyle: { color: COLORS.white, fontWeight: "600" },
  canStyle: {
    width: WP(19),
    height: HP(6),
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.tooLightGrey,
  },
  canText: { color: COLORS.blue, fontWeight: "600" },
});
export default UnBlockModal;
