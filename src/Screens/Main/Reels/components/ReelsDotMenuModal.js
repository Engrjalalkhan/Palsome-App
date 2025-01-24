import React, { useState } from "react";
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
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ReelsDotMenuModal = ({
  modalVisible,
  setModalVisible,
  onDeletePress,
  onEditPress,
  onCopyLinkPress,
  item,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const user_id = useSelector((state) => state.auth.userData.id);

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
          <>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.topView]}
                onPress={() => setModalVisible(false)}
              ></TouchableOpacity>
              <View style={styles.dividerView}>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={styles.IconTextContainer}
                  onPress={onCopyLinkPress}
                >
                  {ICONS.fontAwesome5("copy", COLORS.blue, 24)}
                  <Text style={styles.modalText}>{t("Copy Link")}</Text>
                </TouchableOpacity>
                {user_id === item?.user_id && (
                  <>
                    <TouchableOpacity
                      style={styles.IconTextContainer}
                      onPress={onEditPress}
                    >
                      {ICONS.fontAwesome5("edit", COLORS.blue, 22)}
                      <Text style={styles.modalText}>{t("Edit Clip")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.IconTextContainer, { right: 1 }]}
                      onPress={onDeletePress}
                    >
                      {ICONS.antDesign("delete", COLORS.red, 22)}
                      <Text style={styles.modalText}>{t("Delete Clip")}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </>
        )}
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topView: {
    flex: 1,
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    // justifyContent: "space-evenly",
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
export default ReelsDotMenuModal;
