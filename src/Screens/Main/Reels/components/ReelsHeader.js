import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import { HP, WP } from "../../../../../Utils/Resposive";
import { SITE_URL } from "../../../../Services/Constants";
import { IMAGES } from "../../../../Constants/Images";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../Constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import UploadModal from "../../../ProfileScreen/UploadModal";
import { ICONS } from "../../../../Constants/Icons";
import { useSelector } from "react-redux";
import { isRTL } from "../../../../../Utils/IsRTL";
const ReelsHeader = ({
  muteVoume,
  mute,
  name,
  profilePic,
  onPressMenuModal,
  onPress,
  onPressBack,
  isAdmin,
  reelPrivacy,
  item,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const user_id = useSelector((state) => state.auth.userData.id);

  const handleCameraPress = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <AntDesign
        name={isRTL ? "arrowright" : "arrowleft"}
        color={"white"}
        size={24}
        onPress={onPressBack}
        style={styles.iconStyle}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => onPress()}>
          {profilePic === null ? (
            <Image source={IMAGES.blankDP} style={styles.profilePic} />
          ) : (
            <Image
              source={{ uri: SITE_URL + profilePic }}
              style={styles.profilePic}
            />
          )}
        </TouchableOpacity>

        <View style={styles.leftMargin}>
          <TouchableOpacity onPress={() => onPress()}>
            <Text style={styles.text} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
          {reelPrivacy == "public" && (
            <View style={styles.publicCon}>
              <FontAwesome5 name="globe" size={15} color={COLORS.white} />
              <Text style={[styles.text, { marginLeft: 5 }]}>
                {t("Public")}
              </Text>
            </View>
          )}
          {reelPrivacy == "friends_only" && (
            <View style={styles.publicCon}>
              {ICONS.fontAwesome5("users", COLORS.white, 15)}

              <Text style={[styles.text, { marginLeft: 5 }]}>
                {t("Friends")}
              </Text>
            </View>
          )}
          {reelPrivacy == "only_me" && (
            <View style={styles.publicCon}>
              {ICONS.fontAwesome5("user-alt", COLORS.white, 12)}
              <Text style={[styles.text, { marginLeft: 5 }]}>
                {t("Only me")}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.controlsCon}>
        <TouchableOpacity
          style={{
            // backgroundColor: COLORS.primary,
            paddingHorizontal: 5,
            borderRadius: 20,
            flexDirection: "row",
            marginLeft: -42,
          }}
          onPress={() => {
            if (setModalVisible) {
              setModalVisible(true);
            }
          }}
        >
          <Ionicons
            style={{ paddingHorizontal: 5 }}
            name="ios-camera"
            size={HP(3)}
            color={COLORS.white}
          />
          {/* <Text
            style={{
              color: COLORS.white,
              alignSelf: "center",
              paddingRight: 5,
            }}
          >
            Create
          </Text> */}
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ marginRight: 20, padding: 5 }}>
          {!mute ? (
            <Feather
              name="volume-2"
              size={24}
              color={COLORS.white}
              onPress={muteVoume}
            />
          ) : (
            <Feather
              name="volume-x"
              size={24}
              color={COLORS.white}
              onPress={muteVoume}
            />
          )}
        </TouchableOpacity> */}

        <View style={{ right: 10 }}>
          <Entypo
            name="dots-three-horizontal"
            size={20}
            color="white"
            onPress={onPressMenuModal}
          />
        </View>
      </View>
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
  container: {
    // marginTop: -22,
    // paddingVertical: 20,
    // position: "absolute",
    // paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: COLORS.black,
    opacity: 0.9,
    alignItems: "center",
    zIndex: 1,
  },
  controlsCon: {
    flexDirection: "row",
    // paddingRight: 10,
    width: WP(20),
    justifyContent: "space-evenly",
    alignItems: "center",
    // right: Platform.OS === "ios" ? 0 : 20,
  },
  row: { flexDirection: "row" },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  publicCon: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  leftMargin: {
    marginLeft: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    width: WP(55),
    textAlign: "left",
  },
  iconStyle: {
    margin: 10,
  },
});
export default ReelsHeader;
