import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Divider } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";

import ButtonCom from "../../Rooms/components/ButtonCom";
import InputField from "../../Rooms/components/InputField";
import CustomPickerAndroid from "../../../../Components/CustomPickers/CustomPickerAndroid";
import CustomPickerPrivacy from "../../../../Components/CustomPickers/CustomPickerPrivacy";
import Icon from "react-native-vector-icons/FontAwesome5";

import { useTranslation } from "react-i18next";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { HP, WP } from "../../../../../Utils/Resposive";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getWidth } from "../../../../../Utils/NewResponsive";

const CreateGroupModal = ({ createGroup, setShowCreateGroupModal }) => {
  const { t } = useTranslation();

  const [groupName, setGroupName] = useState("");
  const [disableCreate, setDisableCreate] = useState(true);
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState(t("Public"));
  const [openPrivacyPicker, setOpenPrivacyPicker] = useState(false);

  useEffect(() => {
    if (groupName.length > 0 && selectedPrivacy.length > 0) {
      setDisableCreate(false);
    }
  }, [groupName]);

  const pickerData = [
    { id: 1, title: t("Public") },
    { id: 2, title: t("Private") },
  ];

  const onCancelPress = () => {
    setShowCreateGroupModal(false);
  };

  const onCreatePress = () => {
    createGroup(groupName, selectedPrivacy, groupDescription);
    onCancelPress();
  };

  return (
    <GestureRecognizer
      onSwipeDown={() => setShowCreateGroupModal(false)}
      style={styles.container}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          setShowCreateGroupModal(false);
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => setShowCreateGroupModal(false)}>
              <Image source={IMAGES.leftArrow} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{t("Create Group")}</Text>
          </View>

          <Divider />

          <View style={styles.topView}>
            <InputField
              placeholder={t("Group Name")}
              value={groupName}
              onChangeText={(val) => setGroupName(val)}
            />

            <Text
              style={{
                color: "red",
                marginTop: -HP(5),
                display: groupName === "" ? "flex" : "none",
                marginLeft: WP(36),
                fontSize: 16,
              }}
            >
              *
            </Text>
          </View>

          <View style={styles.headingCon}>
            <Text style={styles.heading}>{t("Group Privacy")}</Text>
          </View>

          <Pressable
            style={styles.borderContainer}
            onPress={() => setOpenPrivacyPicker(true)}
          >
            {Platform.OS === "ios" ? (
              <>
                <Text style={{ marginLeft: 10 }}>{selectedPrivacy}</Text>

                <Icon
                  name="caret-down"
                  color="#DF4B38"
                  size={18}
                  style={{
                    position: "absolute",
                    left: getWidth(80),
                    right: 0,
                  }}
                />

                {openPrivacyPicker && (
                  <CustomPickerPrivacy
                    data={pickerData}
                    selectedValue={selectedPrivacy}
                    setValueFunc={setSelectedPrivacy}
                    closeOnSelect={false}
                    visible={openPrivacyPicker}
                    hideVisible={() => setOpenPrivacyPicker(false)}
                  />
                )}
              </>
            ) : (
              <CustomPickerAndroid
                data={pickerData}
                selectedValue={selectedPrivacy}
                setValueFunc={setSelectedPrivacy}
                closeOnSelect={false}
                hideVisible={() => {}}
              />
            )}
          </Pressable>

          <Divider style={styles.marginTop} />

          <View style={styles.descriptionCon}>
            <InputField
              placeholder={t("Description")}
              description
              onChangeText={(text) => setGroupDescription(text)}
            />
          </View>

          <View style={styles.buttonCon}>
            <ButtonCom title={t("Cancel")} onPress={onCancelPress} />
            <ButtonCom
              title={t("Create")}
              create={!disableCreate}
              disable={disableCreate}
              onPress={onCreatePress}
            />
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: "85%",
    width: "100%",
    backgroundColor: COLORS.white,
  },
  image: { width: 37, height: 15, resizeMode: "cover" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 15,
  },
  headerText: { marginLeft: WP(24), fontSize: 18, fontWeight: "bold" },
  topView: {
    marginTop: 30,
  },
  headingCon: {
    marginTop: 30,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  searchFieldCon: {
    marginTop: 20,
    marginBottom: 10,
  },
  buttonCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 40,
  },
  descriptionCon: { marginTop: 25 },
  marginTop: { marginTop: 20 },
  searchFriendsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },

  friendsListCon: {
    position: "absolute",
    top: 270,
    width: "100%",
    height: "60%",
    backgroundColor: COLORS.white,
    zIndex: 1,
  },
  searchFriendsItemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFriendsItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  searchFriendsItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedFriendsItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  selectedFriendsItemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedFriendsItemCon: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedFriendsCon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedFriendsItemClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  listEmptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    // padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  borderContainer: {
    borderColor: COLORS.grey,
    borderWidth: 0.6,
    borderRadius: 5,
    width: WP("90%"),
    height: HP("6%"),
    alignSelf: "center",
    justifyContent: "center",
  },
});
export default CreateGroupModal;
