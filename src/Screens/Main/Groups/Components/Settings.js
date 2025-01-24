import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-elements";
import SimpleToast from "react-native-simple-toast";
import RadioButtonRN from "radio-buttons-react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useTranslation } from "react-i18next";
import { WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";
import ButtonCom from "../../Rooms/components/ButtonCom";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import CustomPickerPrivacy from "../../../../Components/CustomPickers/CustomPickerPrivacy";
import CustomPickerAndroid from "../../../../Components/CustomPickers/CustomPickerAndroid";
import { BASE_URL } from "../../../../Services/Constants";
import { showMessage } from "react-native-flash-message";
import Loader from "../../Rooms/components/Loader";
import { getGroupsList } from "../../../../Redux/actions/EventActions";

const Settings = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const { group_id, callback, privacy } = props;
  const data = [{ label: "Visible" }, { label: "Hidden" }];
  const pickerData = [
    { id: 1, title: "Public" },
    { id: 2, title: "Private" },
  ];
  const pickerDataGroupTypes = [
    { id: 1, title: "General" },
    { id: 2, title: "Buy and sell" },
    { id: 3, title: "Gaming" },
    { id: 4, title: "Social learning" },
    { id: 5, title: "Jobs" },
    { id: 6, title: "Parenting" },
  ];

  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedtype] = useState("");
  const [typePickerData, setTypePickerData] = useState([]);
  const [groupName, setGroupName] = useState(props.groupName);
  const [groupDescription, setGoupDescription] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [openTypePicker, setOpenTypePicker] = useState(false);
  const [visibility, setVisibility] = useState(props?.visibility);
  const [selectedPrivacy, setSelectedPrivacy] = useState(privacy);
  const [openPrivacyPicker, setOpenPrivacyPicker] = useState(false);

  const marginBottomValue = Platform.OS === "ios" && keyboardStatus ? 100 : 0;

  useEffect(() => {
    getSettingsData();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (props.groupDescription == null) {
      setGoupDescription("");
    } else {
      setGoupDescription(props.groupDescription);
    }
  }, [props.groupDescription]);

  const getSettingsData = () => {
    const url = `${BASE_URL}/groups/${group_id}/settings`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);

          if (res?.responseCode == 200) {
            setTypePickerData(res?.payload?.data?.groupTypes);
            setSelectedtype(res?.payload?.data?.group?.type?.type);
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      console.log("tryCatchError: ", error);
    }
  };

  const onPressSave = async () => {
    const groupTypeId = typePickerData.find(
      (el) => el.type == selectedType
    )?.id;

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", groupDescription);
    formData.append("privacy", selectedPrivacy);
    formData.append("group_type", groupTypeId);
    formData.append(
      "visible",
      selectedPrivacy.toLowerCase() == "private"
        ? visibility?.label
        : data[0].label
    );

    const res = await withoutStringiApiCall2({
      params: formData,
      route: `groups/${group_id}/settings/update`,
      verb: "POST",
      token: token,
    });

    if (res.responseCode !== 200) {
      console.log("Error in saga", res.errors);
      SimpleToast.show("Something went wrong");
    } else if (res?.responseCode == 200) {
      dispatch(getGroupsList(true));

      callback();
      const msg = "Group settings updated successfully";
      SimpleToast.show(t(msg));
    }
  };

  const deleteGroup = async () => {
    try {
      const res = await withoutStringiApiCall2({
        route: `groups/${group_id}/destroy`,
        verb: "POST",
        token: token,
      });

      console.log("res from deleteGroupReq -- ", res);
      if (res.responseCode !== 200) {
        console.log("Error in saga", res.errors);
        SimpleToast.show("Something went wrong");
      } else if (res?.responseCode == 200) {
        navigation.goBack();
        SimpleToast.show("Group Deleted Successfully");
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  const deleteRoom = () => {
    Alert.alert(
      t("Delete Group"),
      t("Are you sure you want to delete this group?"),
      [
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          onPress: deleteGroup,
        },
      ],
      { cancelable: false }
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <View style={[styles.container, { marginBottom: marginBottomValue }]}>
      <View style={styles.iconsAndHeadingCon}>
        <View style={styles.headingContainer}>
          <FontAwesome name="cog" size={18} color={COLORS.black} />
          <Text style={styles.heading}>{t("Group Settings")}</Text>
        </View>
        <AntDesign
          name="delete"
          size={28}
          color={COLORS.black}
          onPress={deleteRoom}
        />
      </View>
      <Divider style={styles.divider} />

      <View style={styles.nameContainer}>
        <Text style={styles.roomNameText}>{t("Group Name")}</Text>
        <TextInput
          style={styles.roomNameInput}
          onChangeText={setGroupName}
          value={groupName}
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.roomDescriptionText}>{t("Group Description")}</Text>
        <TextInput
          multiline
          style={styles.roomDescriptionInput}
          onChangeText={setGoupDescription}
          value={groupDescription}
        />
      </View>

      <View
        style={[
          styles.nameContainer,
          {
            backgroundColor:
              privacy == "public" ? "transparent" : COLORS.lightGray,
          },
        ]}
      >
        <Text style={styles.roomNameText}>{t("Group Privacy")}</Text>

        {privacy == "public" ? (
          <Pressable
            onPress={() => setOpenPrivacyPicker(true)}
            style={{ flex: 1, justifyContent: "center" }}
          >
            {Platform.OS === "ios" ? (
              <>
                <Text style={{ paddingHorizontal: 10 }}>
                  {selectedPrivacy === "public" ? "Public" : "Private"}
                </Text>
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
        ) : (
          <TextInput
            editable={false}
            style={styles.roomNameInput}
            value={props.privacy === "public" ? "Public" : "Private"}
          />
        )}
      </View>

      {selectedPrivacy.toLowerCase() == "private" ? (
        <Text style={styles.visiblityText}>{t("Group Visibility")}</Text>
      ) : (
        <Text style={styles.visiblityTextRed}>
          * {t("Public groups are always visible")}
        </Text>
      )}

      {selectedPrivacy.toLowerCase() == "private" ? (
        <View style={styles.visibility}>
          <RadioButtonRN
            data={data}
            activeColor={COLORS.primary}
            box={false}
            textStyle={{ fontSize: 14 }}
            initial={props?.visibility == "visible" ? 1 : 2}
            selectedBtn={(selected) => setVisibility(selected)}
          />
        </View>
      ) : null}

      <View style={styles.nameContainer}>
        <Text style={styles.roomNameText}>{t("Group Type")}</Text>

        <Pressable
          onPress={() => setOpenTypePicker(true)}
          style={{ flex: 1, justifyContent: "center" }}
        >
          {Platform.OS === "ios" ? (
            <>
              <Text style={{ paddingHorizontal: 10 }}>{selectedType}</Text>
              {openTypePicker && (
                <CustomPickerPrivacy
                  data={pickerDataGroupTypes}
                  selectedValue={selectedType}
                  setValueFunc={setSelectedtype}
                  closeOnSelect={false}
                  visible={openTypePicker}
                  hideVisible={() => setOpenTypePicker(false)}
                />
              )}
            </>
          ) : (
            <CustomPickerAndroid
              data={pickerDataGroupTypes}
              selectedValue={selectedType}
              setValueFunc={setSelectedtype}
              closeOnSelect={false}
              hideVisible={() => {}}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.saveBtnCon}>
        <ButtonCom
          red
          title={t("Save")}
          onPress={onPressSave}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  divider: {
    marginVertical: 10,
  },
  nameContainer: {
    marginHorizontal: 25,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 55,
    marginTop: 10,
  },
  roomNameInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    padding: 5,
  },
  roomNameText: {
    color: COLORS.grey,
  },
  descriptionContainer: {
    marginHorizontal: 25,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 100,
    marginTop: 10,
  },
  roomDescriptionInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  roomDescriptionText: {
    color: COLORS.grey,
  },
  decisionContainer: {
    marginHorizontal: 30,
    marginTop: 15,
  },
  textAndBoxContainer: {
    flexDirection: "row",
  },
  optionText: { fontSize: 14, marginLeft: 10, marginTop: 12 },
  iconsAndHeadingCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
    alignItems: "center",
  },
  saveBtnCon: { alignSelf: "center", marginVertical: 30 },
  saveButton: { width: WP("40%") },
  visibility: {
    marginHorizontal: 40,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginRight: 10,
    backgroundColor: "red",
  },
  visiblityText: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 30,
    color: COLORS.grey,
  },
  visiblityTextRed: {
    marginTop: 8,
    fontSize: 16,
    marginLeft: 30,
    color: COLORS.info,
  },
});
export default Settings;
