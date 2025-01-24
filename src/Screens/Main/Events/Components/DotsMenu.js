import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { HP, WP } from "../../../../../Utils/Resposive";

const DotsMenu = ({
  modalVisible,
  setModalVisible,
  onDeletePress,
  onDuplicatePress,
  onShareLinkPress,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleShareLink = () => {
    onShareLinkPress();
    setModalVisible(false);
  };

  const handleDelete = () => {
    onDeletePress();
    setModalVisible(false);
  };

  const handleDuplicate = () => {
    onDuplicatePress();
    setModalVisible(false);
  };

  return (
    <GestureRecognizer
      onSwipeDown={() => setModalVisible(false)}
      style={styles.container}
    >
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        animationType="slide"
        style={styles.bottomView}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {loading ? (
          <ActivityIndicator size={30} />
        ) : (
          <View>
            <TouchableOpacity
              style={[styles.topView, {}]}
              onPress={() => setModalVisible(false)}
            />

            <View style={styles.dividerView}>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.bottomView}>
              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={handleShareLink}
              >
                {ICONS.fontAwesome("copy", COLORS.black, 24)}
                <Text style={styles.modalText}>{t("Share Link")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={handleDelete}
              >
                {ICONS.antDesign("delete", COLORS.red, 24)}
                <Text style={styles.modalText}>{t("Delete Event")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={handleDuplicate}
              >
                {ICONS.ionIcons("duplicate-outline", COLORS.blue, 24)}
                <Text style={styles.modalText}>{t("Duplicate Event")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </GestureRecognizer>
  );
};

export default DotsMenu;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
  },

  topView: {
    height: HP(75),
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: HP(27),
    justifyContent: "flex-start",
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
  IconTextContainer: { flexDirection: "row", padding: 12 },
});
