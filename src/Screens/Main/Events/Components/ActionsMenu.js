import React, { useState } from "react";
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

const ActionsMenu = ({ modalVisible, inviteResponse, setModalVisible }) => {
  const [loading, setLoading] = useState(false);

  const handleInviteResponse = (id) => {
    inviteResponse(id);
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
                onPress={() => handleInviteResponse(0)}
              >
                {ICONS.antDesign("checkcircleo", COLORS.black, 24)}
                <Text style={styles.modalText}>Going</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={() => handleInviteResponse(1)}
              >
                {ICONS.antDesign("questioncircleo", COLORS.blue, 24)}
                <Text style={styles.modalText}>Maybe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.IconTextContainer}
                onPress={() => handleInviteResponse(2)}
              >
                {ICONS.antDesign("closecircleo", COLORS.red, 24)}
                <Text style={styles.modalText}>Not Interested</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </GestureRecognizer>
  );
};

export default ActionsMenu;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
  },

  topView: {
    height: HP(80),
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
