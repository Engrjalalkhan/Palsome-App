import React from "react";
import { useTranslation } from "react-i18next";

import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { HP, WP } from "../../../Utils/Resposive";

const sizeIcon = WP(18);
const LogoutModal = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={props?.isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.outerModalContainer}>
        <View style={styles.innerModalContainer}>
          <View style={styles.excelStyle}>
            {ICONS.antDesign("exclamationcircleo", COLORS.warning, sizeIcon)}
          </View>
          <View style={styles.surestyle}>
            <Text style={styles.SureText}>
              {props?.title ? props?.title : t("Are you sure?")}
            </Text>
            {props.message ? (
              <Text
                style={[
                  styles.delTex,
                  {
                    color: props?.onSuccessTextColor
                      ? COLORS.grey
                      : COLORS.primary,
                  },
                ]}
              >
                {props?.message}
              </Text>
            ) : (
              <Text style={[styles.delTex]}>{t("You want to logout")}?</Text>
            )}
          </View>
          <View style={styles.modalbuttonStyle}>
            <TouchableOpacity
              onPress={() =>
                props?.onYesPress ? props?.onYesPress() : props?.onDiscard()
              }
              style={[styles.button, { backgroundColor: COLORS.primary }]}
            >
              {props?.onSuccess ? (
                <Text
                  style={[
                    styles.delTex,
                    {
                      color: props?.onSuccessTextColor
                        ? COLORS.white
                        : COLORS.primary,
                    },
                  ]}
                >
                  {props?.onSuccess}
                </Text>
              ) : (
                <Text style={styles.delTxtStyle}>{t("Yes")}</Text>
              )}
            </TouchableOpacity>
            {props?.onSave && (
              <TouchableOpacity
                onPress={() => props?.onSave()}
                style={styles.canStyle}
              >
                <Text style={styles.canText}>{t("Save")}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => props?.setIsVisible(false)}
              style={[
                styles.button,
                { borderWidth: 1, borderColor: COLORS.gray, marginLeft: 10 },
              ]}
            >
              {props?.onCancel ? (
                <Text style={styles.canText}>{props?.onCancel}</Text>
              ) : (
                <Text style={styles.canText}>{t("No")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outerModalContainer: {
    flex: 1,
    width: WP(100),
    height: HP(100),
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  innerModalContainer: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    width: WP(90),
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 1,
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
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: HP(1),
    textAlign: "center",
    width: "130%",
  },
  modalbuttonStyle: {
    width: "50%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginRight: 20,
  },
  button: {
    paddingHorizontal: 10,
    width: WP(25),
    height: HP(6),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  delTxtStyle: { color: COLORS.white, fontWeight: "600" },
  canText: { color: COLORS.blue, fontWeight: "600" },
});
export default LogoutModal;
