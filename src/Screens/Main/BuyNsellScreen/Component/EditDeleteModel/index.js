import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../../../../Constants/Colors";

const EditDeleteModal = ({
  modalVisible,
  setModalVisible,
  onPressEditModel,
  onPressMarkAsSold,
  onPressRemoveModal,
  onPressDeActiveModal,
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
              onPressEditModel(item);
            }}
          >
            {/* {ICONS.fontAwesome("copy", COLORS.black, 24)} */}
            <Text style={styles.modalText}>{t("Edit")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", padding: 12 }}
            onPress={() => {
              onPressRemoveModal();
            }}
          >
            {/* {ICONS.antDesign("edit", COLORS.blue, 24)} */}
            <Text style={styles.modalText}>{t("Remove")}</Text>
          </TouchableOpacity>

          {item?.add_in_draft !== 1 && (
            <>
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 12 }}
                onPress={() => {
                  item?.status === "active"
                    ? onPressDeActiveModal()
                    : onPressDeActiveModal("active");
                }}
              >
                {/* {ICONS.antDesign("delete", COLORS.red, 24)} */}

                <Text style={styles.modalText}>
                  {item?.status === "active" ? t("Deactive") : t("Active")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 12 }}
                onPress={() => {
                  onPressMarkAsSold();
                }}
              >
                {/* {ICONS.antDesign("delete", COLORS.red, 24)} */}
                {item?.status === "active" && (
                  <Text style={styles.modalText}>{t("Mark As Sold")}</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default EditDeleteModal;

const styles = StyleSheet.create({
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
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
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    // height: 200,
    justifyContent: "space-evenly",
  },
});
