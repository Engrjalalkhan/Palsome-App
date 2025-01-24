import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HP, WP } from "../../../../../Utils/Resposive";
import GestureRecognizer from "react-native-swipe-gestures";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const EditDeleteModal = ({
  group,
  modalVisible,
  setModalVisible,
  onDeletePress,
  onEditPress,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

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
              style={[styles.topView, { height: group ? HP(86) : HP(89) }]}
              onPress={() => setModalVisible(false)}
            />

            <View style={styles.dividerView}>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.bottomView}>
              {group && (
                <TouchableOpacity
                  style={styles.IconTextContainer}
                  onPress={onEditPress}
                >
                  {ICONS.antDesign("edit", COLORS.blue, 24)}
                  <Text style={styles.modalText}>{t("Edit")}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={onDeletePress}
              >
                {ICONS.antDesign("delete", COLORS.red, 24)}
                <Text style={styles.modalText}>{t("Delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
  },

  topView: {
    height: HP(86),
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: HP(22),
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
export default EditDeleteModal;
