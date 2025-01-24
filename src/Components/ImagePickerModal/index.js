import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { WP } from "../../../Utils/Resposive";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { useTranslation } from "react-i18next";

const ImagePickerModal = ({
  showGallery = true,
  visible,
  hideVisible,
  galleryImage,
  cameraVideo,
  cameraImage,
  showOpenVidcamera = true,
  showOpenImgcamera = true,
  showImgCam = true,
  showOpenPdf,
  pdfPick,
  showOpenIllustrations,
  illustrationImage,
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.crossContainer}>
              <TouchableOpacity onPress={() => hideVisible(false)}>
                {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: "space-around", flex: 0.85 }}>
              {showGallery && (
                <TouchableOpacity style={styles.boxes} onPress={galleryImage}>
                  {ICONS.fontAwesome5("photo-video", COLORS.primary, 35)}
                  <Text>{t("Choose From Gallery")}</Text>
                </TouchableOpacity>
              )}

              <View style={styles.bottomRow}>
                {showOpenVidcamera && (
                  <TouchableOpacity style={styles.boxes} onPress={cameraVideo}>
                    {ICONS.fontAwesome5("video", COLORS.primary, 35)}
                    <Text>
                      {t("Open Camera")} ({t("Videos")})
                    </Text>
                  </TouchableOpacity>
                )}

                {showImgCam && showOpenImgcamera && (
                  <TouchableOpacity style={styles.boxes} onPress={cameraImage}>
                    {ICONS.fontAwesome5("camera-retro", COLORS.primary, 35)}
                    <Text>
                      {t("Open Camera")} ({t("Images")})
                    </Text>
                  </TouchableOpacity>
                )}

                {showOpenPdf && (
                  <TouchableOpacity style={styles.boxes} onPress={pdfPick}>
                    {ICONS.fontAwesome5("file-pdf", COLORS.primary, 35)}
                    <Text>{t("Choose from Manager")}</Text>
                  </TouchableOpacity>
                )}

                {showOpenIllustrations && (
                  <TouchableOpacity
                    style={styles.boxes}
                    onPress={illustrationImage}
                  >
                    {ICONS.fontAwesome("picture-o", COLORS.primary, 35)}
                    <Text>{t("Choose Illustration")}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },

  boxes: {
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.primary,
    borderLeftColor: COLORS.primary,
    backgroundColor: COLORS.white,
    width: "100%",
    height: "27%",
    position: "absolute",
    bottom: 0,
  },

  crossContainer: {
    marginTop: 8,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ImagePickerModal;
