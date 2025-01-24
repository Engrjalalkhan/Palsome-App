import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { HP, WP } from "../../../../Utils/Resposive";
import GestureRecognizer from "react-native-swipe-gestures";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWalletRequest,
  refreshWallet,
  setWalletData,
} from "../../../Redux/actions/WalletActions";
import WalletUploadModal from "./WalletUploadModal";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";

const EditDeleteAlbum = ({
  modalVisible,
  setModalVisible,
  item,
  userWalletData,
  setuserWalletData,
  onPressEdit,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  const [responseDeleteApi, setResponseDeleteApi] = useState(null);
  const [itemDeleted, setItemDeleted] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const walletToken = useSelector((state) => state.walletRed.walletToken);
  const walletData = useSelector((state) => state.walletRed.walletData);
  const { encrypted_id } = item;

  const showConfirmDialog = () => {
    dispatch(refreshWallet(false));
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this wallet?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            onDeletePress();
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };

  const onDeletePress = () => {
    !loading
      ? dispatch(
          deleteWalletRequest({
            walletToken: walletToken,
            token: token,
            encrypted_id: encrypted_id,
            setLoading: setLoading,
            setResponseDeleteApi: setResponseDeleteApi,
          })
        )
      : null;
  };
  useEffect(() => {
    if (responseDeleteApi?.payload?.success === true) {
      setuserWalletData(
        userWalletData.filter((item) => item?.encrypted_id !== encrypted_id)
      );
      setModalVisible(false);
    } else if (responseDeleteApi?.payload?.success === false) {
      setModalVisible(false);
    }
  }, [responseDeleteApi]);
  return (
    <GestureRecognizer
      onSwipeDown={() => setModalVisible(false)}
      style={styles.modalContainer}
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
            <View>
              <TouchableOpacity
                style={styles.topView}
                onPress={() => setModalVisible(false)}
              >
                {/* <Text>Hello</Text> */}
              </TouchableOpacity>
              <View style={styles.dividerView}>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.bottomView}>
                <TouchableOpacity
                  style={styles.IconTextContainer}
                  onPress={onPressEdit}
                >
                  {ICONS.antDesign("edit", COLORS.blue, 24)}
                  <Text style={styles.modalText}>{t("Edit")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.IconTextContainer}
                  onPress={showConfirmDialog}
                >
                  {ICONS.antDesign("delete", COLORS.red, 24)}
                  <Text style={styles.modalText}>{t("Delete")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
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
    // height: HP(22),
    justifyContent: "space-around",
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
export default EditDeleteAlbum;
