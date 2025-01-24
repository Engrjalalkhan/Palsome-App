import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import sharedStyles from "../../../../Components/Stories/sharedStyles";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import FastImage from "react-native-fast-image";
import UploadModal from "../../../ProfileScreen/UploadModal";
import { useSelector } from "react-redux";
import { SITE_URL } from "../../../../Services/Constants";

const CreateReelsCard = ({ source }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const profileDP = useSelector((state) => state.prof.profilePicture);

  // console.log("userData::>>", userData);

  return (
    <View style={sharedStyles.storiesBgImg}>
      <TouchableOpacity
        style={styles.flex1}
        // onPress={() => alert("Create Reels")}
        onPress={() => setModalVisible(true)}
      >
        {userData?.profile_picture !== null &&
        userData?.profile_picture !== "" ? (
          <FastImage
            source={{
              uri:
                profileDP == null
                  ? SITE_URL + userData?.profile_picture
                  : profileDP,
            }}
            style={styles.flex1}
          />
        ) : profileDP !== null ? (
          <FastImage
            source={{
              uri: profileDP,
            }}
            style={styles.flex1}
          />
        ) : (
          <FastImage source={IMAGES.blankDP} style={styles.flex1} />
        )}

        <View style={styles.createStoryInnerBox}>
          <FastImage
            resizeMode="cover"
            style={styles.addBtn}
            source={IMAGES.bluePlusCircle}
          />
          <Text style={[sharedStyles.userNameStyle]}>{t("Create Clip")}</Text>
        </View>
      </TouchableOpacity>

      {modalVisible && (
        <UploadModal
          showUploadModal={modalVisible}
          setShowUploadModal={setModalVisible}
          uploadModalType={"video"}
          reel
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  createStoryInnerBox: {
    flex: 0.5,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    width: 28,
    height: 28,
    position: "absolute",
    top: -13,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  flex1: {
    flex: 1,
  },
});
export default CreateReelsCard;
