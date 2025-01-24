import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Modal from "react-native-modal";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

const SeeStoryProfileModel = ({
  modalVisible,
  setModalVisible,
  onPressStory,
  onPressSeeProfile,
  item,
}) => {
  const { t } = useTranslation();

  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View style={[styles.content]}>
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 12 }}
            onPress={() => {
              onPressStory();
            }}
          >
            {ICONS.materialCommunityIcons("bullseye", COLORS.primary, 25)}
            <Text style={styles.modalText}>{t("View Story")}</Text>
          </TouchableOpacity>
          {item?.user?.avatar_full !== null && (
            <TouchableOpacity
              style={{ flexDirection: "row", padding: 12 }}
              onPress={() => {
                onPressSeeProfile();
              }}
            >
              {ICONS.materialCommunityIcons(
                "account-circle",
                COLORS.primary,
                25
              )}
              <Text style={styles.modalText}>{t("See profile picture")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SeeStoryProfileModel;

const styles = StyleSheet.create({
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
    backgroundColor: "transparent",
  },

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGrey,

    marginBottom: 5,
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },

  content: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    // height: 200,
    justifyContent: "space-evenly",
  },
});
