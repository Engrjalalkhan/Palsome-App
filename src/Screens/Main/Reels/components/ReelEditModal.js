import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { Modal } from "react-native";
import { COLORS } from "../../../../Constants/Colors";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import DiscardModal from "../../../../Components/DiscardModal";
import { HP, WP } from "../../../../../Utils/Resposive";
import Button from "../../../../Components/NewButton";
import GestureRecognizer from "react-native-swipe-gestures";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const ReelEditModal = ({
  editModal,
  setEditModal,
  item,
  onPressUpdated,
  updatedText,
}) => {
  const { t } = useTranslation();

  const [clipUpdateText, onClipUpdatedText] = React.useState("");

  React.useEffect(() => {
    onClipUpdatedText(item?.post_text || "");
  }, [item]);

  return (
    <GestureRecognizer
      onSwipeDown={() => setEditModal(false)}
      style={{ flex: 1 }}
    >
      <Modal
        propagateSwipe
        isVisible={editModal}
        onBackdropPress={() => setEditModal(false)}
        onSwipeComplete={() => setEditModal(false)}
        swipeDirection={["down"]}
        animationType="slide"
        style={styles.bottomView}
        transparent={true}
        onRequestClose={() => setEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.topView}
              onPress={() => setEditModal(false)}
            ></TouchableOpacity>
            <View style={styles.dividerView}>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.bottomView}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  onClipUpdatedText(text);
                  updatedText(text);
                }}
                value={clipUpdateText}
                placeholder={t("What's going on? #Hashtag..")}
                keyboardType="default"
              />
              <View style={styles.btnmain}>
                <Button
                  buttonstyle={styles.btn}
                  textstyle={styles.btnText}
                  text={t("Cancel")}
                  pressFunction={() => setEditModal(false)}
                />
                <Button
                  buttonstyle={styles.btn}
                  textstyle={styles.btnText}
                  text={t("Update")}
                  pressFunction={() => {
                    onPressUpdated();
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </GestureRecognizer>
  );
};

export default ReelEditModal;

const styles = StyleSheet.create({
  topView: {
    height: HP(80),
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    position: "absolute",
    bottom: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: HP(22),
    width: WP(100),
  },
  dividerLine: {
    height: 5,
    backgroundColor: COLORS.white,
    width: WP(20),
    alignSelf: "center",
    marginTop: -25,
    borderRadius: 10,
  },
  dividerView: {
    backgroundColor: COLORS.black,
    marginBottom: -13,
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: COLORS.cocoGrey,
    backgroundColor: COLORS.lightGray,
  },
  btnmain: {
    flexDirection: "row",
    marginVertical: HP(3.5),
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  btn: {
    // width: getWidth(40),
    // height: getHeight(7),
    paddingHorizontal: getHeight(3),
    paddingVertical: getHeight(1.5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: getHeight(2),
    fontWeight: "bold",
  },
  IconTextContainer: { flexDirection: "row", padding: 12 },
});
