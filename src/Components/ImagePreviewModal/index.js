import React from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";

import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import BackButtonTwo from "../BackButton/index2";
import { SITE_URL } from "../../Services/Constants";
import GallerySwiper from "react-native-gallery-swiper";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";

const ImagePreviewModal = ({
  modalVisible,
  showImagePath,
  setModalVisible,
}) => {
  const deviceTypeImage = showImagePath?.type;
  const fileType = showImagePath?.post_file_type;

  const sourceUri =
    deviceTypeImage === "image" && fileType !== "palsome_ai"
      ? SITE_URL + showImagePath?.image
      : fileType === "image" || fileType === "palsome_ai"
      ? SITE_URL + showImagePath?.path
      : fileType === "post"
      ? showImagePath?.path
      : deviceTypeImage
      ? showImagePath?.uri
      : showImagePath;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <BackButtonTwo
            goBack={() => setModalVisible(false)}
            tintColor={{ tintColor: COLORS.white }}
          />
        </View>
        <GallerySwiper
          images={[
            sourceUri ? { uri: sourceUri } : { source: IMAGES.blankCover },
          ]}
          onSwipeUpReleased={() => setModalVisible(false)}
          onSwipeDownReleased={() => setModalVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 0 : getHeight(6),
  },
  backButtonContainer: {
    width: "100%",
    alignItems: "flex-start",
    backgroundColor: COLORS.black,
    padding: getWidth(2),
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: "90%",
    marginBottom: getHeight(5),
  },
});
