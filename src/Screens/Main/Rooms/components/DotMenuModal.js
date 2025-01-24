import React from "react";
import { useTranslation } from "react-i18next";
import GestureRecognizer from "react-native-swipe-gestures";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { HP, WP } from "../../../../../Utils/Resposive";
import { isRTL } from "../../../../../Utils/IsRTL";

const DotMenuModal = ({
  modalVisible,
  setModalVisible,
  onPressMakeAdmin,
  makeSilentObserver,
  removeRoomMember,
  isMute,
  room_Admin,
  removeAdmin,
  removeSilentObserver,
  room_encrypted_id,
  showActionsMenu,
  onPressAccept,
  onPressReject,
}) => {
  const { t } = useTranslation();

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
        <View>
          <TouchableOpacity
            style={styles.topView}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.dividerView}>
            <View style={styles.dividerLine} />
          </View>

          {showActionsMenu ? (
            <View style={styles.bottomView}>
              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={onPressAccept}
              >
                {ICONS.ionIcons("person", COLORS.blue, 24)}
                <Text style={styles.modalText}>{t("Accept Join Request")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={onPressReject}
              >
                {ICONS.ionIcons("person-remove", COLORS.red, 24)}
                <Text style={styles.modalText}>
                  {t("Decline Join Request")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.bottomView}>
              {!room_Admin ? (
                <>
                  {!isMute ? (
                    <TouchableOpacity
                      style={styles.IconTextContainer}
                      onPress={onPressMakeAdmin}
                    >
                      {ICONS.ionIcons("person", COLORS.blue, 24)}
                      <Text style={styles.modalText}>{t("Make Admin")}</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : (
                <TouchableOpacity
                  style={styles.IconTextContainer}
                  onPress={removeAdmin}
                >
                  {ICONS.ionIcons("person", COLORS.blue, 24)}

                  <Text style={styles.modalText}>{t("Remove Admin")}</Text>
                </TouchableOpacity>
              )}
              {!room_Admin &&
                (!isMute && room_encrypted_id ? (
                  <TouchableOpacity
                    style={styles.IconTextContainer}
                    onPress={makeSilentObserver}
                  >
                    {ICONS.fontAwesome5("volume-mute", COLORS.red, 24)}
                    <Text style={styles.modalText}>
                      {t("Make Silent Observer")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  room_encrypted_id && (
                    <TouchableOpacity
                      style={styles.IconTextContainer}
                      onPress={removeSilentObserver}
                    >
                      {ICONS.fontAwesome5("volume-mute", COLORS.red, 24)}
                      <Text style={styles.modalText}>
                        {t("Remove Silent Observer")}
                      </Text>
                    </TouchableOpacity>
                  )
                ))}

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={removeRoomMember}
              >
                {ICONS.ionIcons("person-remove", COLORS.red, 24)}
                <Text style={styles.modalText}>{t("Remove")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topView: {
    height: HP(80),
    backgroundColor: "black",
    opacity: 0.7,
  },
  bottomView: {
    backgroundColor: "white",
    padding: isRTL ? 5 : 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: HP(22),
    // justifyContent: "space-around",
  },
  dividerLine: {
    height: 5,
    backgroundColor: "white",
    width: WP(20),
    alignSelf: "center",
    marginTop: -25,
    borderRadius: 10,
  },
  dividerView: {
    backgroundColor: "black",
    marginBottom: -13,
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
  IconTextContainer: { flexDirection: "row", padding: 12 },
});
export default DotMenuModal;
