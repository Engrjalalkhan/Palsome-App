import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import { WP, HP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const BlockModal = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={false}
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
          <View style={styles.titleContainer}>
            <Text numberOfLines={3} style={styles.titleText}>
              {t("Block")} {props.userToBlock.first_name}{" "}
              {props.userToBlock.last_name}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              {props.userToBlock.first_name} {props.userToBlock.last_name}
              {t("will no longer be able to:")}
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bodyText}>
                - {t("See your posts on your timeline")}
              </Text>
              <Text style={styles.bodyText}>- {t("Tag you")}</Text>
              <Text style={styles.bodyText}>
                - {t("Invite you to events or groups")}
              </Text>
              <Text style={styles.bodyText}>- {t("Message you")}</Text>
              <Text style={styles.bodyText}>- {t("Add you as a friend")}</Text>
            </View>
            <Text style={styles.bodyText}>
              {t("If you're friends, blocking")} {props.userToBlock.first_name}{" "}
              {props.userToBlock.last_name} {t("will unfriend him.")}
            </Text>
          </View>
          <View style={styles.modalbuttonStyle}>
            <TouchableOpacity
              onPress={() => props?.setIsVisibleBlockModal(false)}
              style={styles.canStyle}
            >
              <Text style={styles.canText}>{t("Cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={props?.loading}
              onPress={() => props?.onConfirm()}
              style={[
                styles.deleteButton,
                {
                  backgroundColor: props?.loading
                    ? COLORS.grey
                    : COLORS.primary,
                },
              ]}
            >
              {props.loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.delTxtStyle}>{t("Confirm")}</Text>
              )}
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

  body: {
    width: "90%",
    marginVertical: HP(1),
  },
  bodyText: {
    color: theme.colors.secondary,

    fontSize: 15,
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
  delTxtStyle: { color: "white", fontWeight: "600" },
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
  canText: { color: "blue", fontWeight: "600" },
  titleContainer: {},
  titleText: { fontWeight: "bold", fontSize: 18 },
  bulletContainer: { paddingHorizontal: WP(5), marginVertical: HP(1) },
});
export default BlockModal;
