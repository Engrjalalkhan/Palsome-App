import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";

import Modal from "react-native-modal";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { HP, WP } from "../../../Utils/Resposive";

const ProfileImagePickerModal = (props) => {
  const { t } = useTranslation();

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={props.visible}
      onBackdropPress={() => props.hideVisible()}
      onSwipeComplete={() => props.hideVisible()}
      swipeDirection={["down"]}
      style={styles.bottomView}
      onRequestClose={() => props.hideVisible()}
    >
      <View style={styles.centerContent}>
        <View style={styles.headLine} />
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.click} onPress={props.cameraImage}>
          {ICONS.fontAwesome5("camera-retro", COLORS.primary, 25)}
          <Text style={styles.modalText}>{t("Open Camera")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.click} onPress={props.galleryImage}>
          {ICONS.fontAwesome5("photo-video", COLORS.primary, 25)}
          <Text style={styles.modalText}>{t("Choose From Gallery")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", padding: 12 }}
          onPress={() => props.hideVisible()}
        >
          {ICONS.materialIcons("cancel", COLORS.primary, 32)}
          <Text style={styles.modalText}>{t("Cancel")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Contanier: {
    flex: 1,
  },
  ModelContanier: {
    backgroundColor: COLORS.white,
    height: HP(30),
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  img: {
    height: HP(3),
    width: WP(6),
    resizeMode: "stretch",
  },
  buttons: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    marginLeft: 20,
  },
  reaction: {
    paddingHorizontal: WP(5),
    flexDirection: "row",
  },
  scene: {
    flex: 1,
  },
  txt: {
    color: COLORS.primary,
  },
  noLabel: {
    display: "none",
    height: 0,
  },
  bubble: {},
  img: {
    height: 20,
    width: 20,
  },
  tabStyle: {
    backgroundColor: COLORS.primary,
  },
  textBtn: {
    fontSize: 25,
    marginLeft: 20,
  },
  closebuttons: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1,
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.white,

    marginBottom: 5,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 230,
    justifyContent: "space-around",
  },
  click: { flexDirection: "row", padding: 12 },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
});

export default ProfileImagePickerModal;
