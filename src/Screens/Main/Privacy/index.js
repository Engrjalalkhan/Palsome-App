import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Switch } from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";
import { HP, WP } from "../../../../Utils/Resposive";
import MyHeader from "../../../Components/MyHeader";

import { Picker } from "@react-native-picker/picker";
import CustomPicker from "../../../Components/CustomPickers/CustomPickerPrivacy";

import {
  privacyNewPost,
  privacyDataSettings,
} from "../../../../Utils/PickerDataStatus/privacyData";
import {
  settingsApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis";
import Toast from "react-native-simple-toast";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import CustomPickerPrivacy from "../../../Components/CustomPickers/CustomPickerPrivacy";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Privacy = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state.auth.userToken);
  const [receivingFriendReq, setReceivingFriendReq] = useState(false);
  const [profilePicprivacyPickerValue, setProfilePicPrivacyPickerValue] =
    useState(t("public"));
  const [profilePicVisiblePrivacy, setProfilePicVisiblePrivacy] =
    useState(false);

  const [covPicprivacyPickerValue, setCovPicPrivacyPickerValue] = useState(
    t("public")
  );
  const [covPicVisiblePrivacy, setCovPicVisiblePrivacy] = useState(false);

  const [hideFriendsPickerValue, setHideFriendsPickerValue] = useState(
    t("public")
  );
  const [hideFriendsVisible, setHideFriendsVisible] = useState(false);
  const fetchPrivacy = async () => {
    try {
      const res = await settingsApiCall({
        route: "privacy_profile",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);

        Toast.show("Error getting privacy", Toast.SHORT);
      } else if (res.responseCode == 200) {
        console.log("response", res?.payload?.data?.can_receive_friend_request);
        res?.payload?.data?.can_receive_friend_request
          ? setReceivingFriendReq(true)
          : setReceivingFriendReq(false);
        if (res?.payload?.data?.profile_photo_privacy) {
          setProfilePicPrivacyPickerValue(
            res?.payload?.data?.profile_photo_privacy
          );
        }
        if (res?.payload?.data?.cover_photo_privacy) {
          setCovPicPrivacyPickerValue(res?.payload?.data?.cover_photo_privacy);
        }
        if (res?.payload?.data?.friends_list_privacy) {
          setHideFriendsPickerValue(res?.payload?.data?.friends_list_privacy);
        }
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };
  const updatePrivacy = async (val) => {
    const formData = new FormData();
    formData.append(Object.keys(val)[0], Object.values(val)[0]);
    console.log(formData);

    try {
      const res = await withoutStringiApiCall2({
        route: "update_privacy_profile",
        verb: "POST",
        token: token,
        params: formData,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);
        Toast.show("Error getting privacy", Toast.SHORT);
      } else if (res.responseCode == 200) {
        console.log("response", res);
        Toast.show(res?.message, Toast.SHORT);
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };
  useEffect(() => {
    fetchPrivacy();
  }, []);

  const selectedPrivacyOption = privacyDataSettings.find(
    (i) => i.value === profilePicprivacyPickerValue
  );
  const selectedCoverOption = privacyDataSettings.find(
    (i) => i.value === covPicprivacyPickerValue
  );
  const selectedHideOption = privacyDataSettings.find(
    (i) => i.value === hideFriendsPickerValue
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={t("Change Privacy")}
      />
      <View style={styles.item}>
        <Text style={styles.txt}>{t("Make profile picture private")}</Text>
        <View>
          {Platform.OS == "android" ? (
            <View style={styles.pickerView}>
              <Picker
                mode="dropdown"
                style={{ color: COLORS.black }}
                itemStyle={styles.picker}
                dropdownIconColor={COLORS.primary}
                selectedValue={profilePicprivacyPickerValue}
                onValueChange={(itemValue) => {
                  setProfilePicPrivacyPickerValue(itemValue);
                  updatePrivacy({
                    profile_photo_privacy: itemValue,
                  });
                }}
              >
                <Picker.Item label={t("Public")} value="public" color="black" />
                <Picker.Item
                  label={t("Friends")}
                  value="friends_only"
                  color="black"
                />
                <Picker.Item
                  label={t("Only Me")}
                  value="only_me"
                  color="black"
                />
              </Picker>
              <Text
                style={{
                  width: "100%",
                  height: 60,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              >
                {" "}
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.iosviewPicker]}
                onPress={() => setProfilePicVisiblePrivacy(true)}
              >
                {privacyNewPost(profilePicprivacyPickerValue, "black", true)}
                <Text style={{}}>
                  {selectedPrivacyOption ? t(selectedPrivacyOption?.title) : ""}
                </Text>
                {ICONS.fontAwesome5("caret-down", COLORS.primary)}
              </TouchableOpacity>
              <CustomPickerPrivacy
                visible={profilePicVisiblePrivacy}
                selectedValue={profilePicprivacyPickerValue}
                setValueFunc={(val) => {
                  setProfilePicPrivacyPickerValue(val);
                  updatePrivacy({
                    profile_photo_privacy: val,
                  });
                }}
                data={privacyDataSettings}
                hideVisible={() => setProfilePicVisiblePrivacy(false)}
              />
            </>
          )}
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.txt}>{t("Make cover photo private")}</Text>

        <View>
          {Platform.OS == "android" ? (
            <View style={styles.pickerView}>
              <Picker
                mode="dropdown"
                style={{ color: COLORS.black }}
                itemStyle={styles.picker}
                dropdownIconColor={COLORS.primary}
                selectedValue={covPicprivacyPickerValue}
                onValueChange={(itemValue) => {
                  setCovPicPrivacyPickerValue(itemValue);
                  updatePrivacy({
                    cover_photo_privacy: itemValue,
                  });
                }}
              >
                <Picker.Item label={t("Public")} value="public" color="black" />
                <Picker.Item
                  label={t("Friends")}
                  value="friends_only"
                  color="black"
                />
                <Picker.Item
                  label={t("Only Me")}
                  value="only_me"
                  color="black"
                />
              </Picker>
              <Text
                style={{
                  width: "100%",
                  height: 60,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              >
                {" "}
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.iosviewPicker]}
                onPress={() => setCovPicVisiblePrivacy(true)}
              >
                {privacyNewPost(covPicprivacyPickerValue, "black", true)}
                <Text style={{}}>
                  {selectedCoverOption ? t(selectedCoverOption?.title) : ""}
                </Text>
                {ICONS.fontAwesome5("caret-down", COLORS.primary)}
              </TouchableOpacity>
              <CustomPicker
                visible={covPicVisiblePrivacy}
                selectedValue={covPicprivacyPickerValue}
                setValueFunc={(val) => {
                  setCovPicPrivacyPickerValue(val);
                  updatePrivacy({
                    cover_photo_privacy: val,
                  });
                }}
                data={privacyDataSettings}
                hideVisible={() => setCovPicVisiblePrivacy(false)}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{t("Enable receiving friend requests")}</Text>

        <View>
          <Switch
            trackColor={{ false: COLORS.tooLightGrey, true: COLORS.primary }}
            thumbColor={
              receivingFriendReq ? COLORS.tooLightGrey : COLORS.tooLightGrey
            }
            ios_backgroundColor={COLORS.tooLightGrey}
            onValueChange={(val) => {
              setReceivingFriendReq(val);
              updatePrivacy({
                can_receive_friend_request: val == true ? 1 : 0,
              });
            }}
            value={receivingFriendReq}
          />
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.txt}>{t("Hide friends list")}</Text>

        <View>
          {Platform.OS == "android" ? (
            <View style={styles.pickerView}>
              <Picker
                mode="dropdown"
                style={{ color: COLORS.black }}
                itemStyle={styles.picker}
                dropdownIconColor={COLORS.primary}
                selectedValue={hideFriendsPickerValue}
                onValueChange={(itemValue) => {
                  setHideFriendsPickerValue(itemValue);
                  updatePrivacy({
                    friends_list_privacy: itemValue,
                  });
                }}
              >
                <Picker.Item label={t("Public")} value="public" color="black" />
                <Picker.Item
                  label={t("Friends")}
                  value="friends_only"
                  color="black"
                />
                <Picker.Item
                  label={t("Only Me")}
                  value="only_me"
                  color="black"
                />
              </Picker>
              <Text
                style={{
                  width: "100%",
                  height: 60,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              >
                {" "}
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.iosviewPicker]}
                onPress={() => setHideFriendsVisible(true)}
              >
                {privacyNewPost(hideFriendsPickerValue, "black", true)}
                <Text style={{}}>
                  {selectedHideOption ? t(selectedHideOption?.title) : ""}
                </Text>
                {ICONS.fontAwesome5("caret-down", COLORS.primary)}
              </TouchableOpacity>
              <CustomPicker
                visible={hideFriendsVisible}
                selectedValue={hideFriendsPickerValue}
                setValueFunc={(val) => {
                  setHideFriendsPickerValue(val);
                  updatePrivacy({
                    friends_list_privacy: val,
                  });
                }}
                data={privacyDataSettings}
                hideVisible={() => setHideFriendsVisible(false)}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  item: {
    flexDirection: "row",
    paddingHorizontal: WP(4),
    justifyContent: "space-between",
    paddingVertical: HP(1.5),
    alignItems: "center",
  },
  iosviewPicker: {
    borderColor: COLORS.black,
    borderWidth: 0.5,
    justifyContent: "space-between",
    minWidth: WP(25),
    height: HP(3),
    borderRadius: 5,
    paddingHorizontal: WP(3),

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  pickerView: {
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    width: WP(35),
    height: HP(4),
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGrey,
  },
  picker: {
    backgroundColor: COLORS.red,
    color: "blue",
    fontFamily: "Ebrima",
    fontSize: 1,
    color: COLORS.primary,
  },
  txt: { fontWeight: "bold", fontSize: WP(3.8) },
});

export default Privacy;
