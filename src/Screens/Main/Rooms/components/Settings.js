import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Keyboard,
  Platform,
} from "react-native";
import { Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";

import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Checkbox } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import { WP, HP } from "../../../../../Utils/Resposive";
import ButtonCom from "./ButtonCom";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRoomRequest,
  myRoomsRequest,
  showRoomRequest,
  updateRoomSettingsRequest,
} from "../../../../Redux/actions/RoomActions";
import { COLORS } from "../../../../Constants/Colors";
import { useNavigation } from "@react-navigation/native";

const Settings = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [roomName, setRoomName] = useState(props.roomName);
  const [roomDescription, setRoomDescription] = useState("");
  const [mediaPost, setMediaPost] = useState(
    props?.roomData[0]?.room?.post_text_only == 1
  );
  const [onlyAdmin, setOnlyAdmin] = useState(
    props?.roomData[0]?.room?.admin_post_only == 1
  );
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.userToken);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const marginBottomValue = Platform.OS === "ios" && keyboardStatus ? 100 : 0;

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
    if (props.roomDescription == null) {
      setRoomDescription("");
    } else {
      setRoomDescription(props.roomDescription);
    }
  }, [props.roomDescription]);

  const refreshPage = () => {
    dispatch(
      showRoomRequest({
        token: token,
        id: props.room_id,
        setLoading: setLoading,
      })
    );
    dispatch(
      myRoomsRequest({
        token: token,
        setLoading: setLoading,
      })
    );
  };

  const onPressSave = () => {
    const formData = new FormData();
    formData.append("room_name", roomName);
    formData.append("room_description", roomDescription);
    if (mediaPost) {
      formData.append("post_text_only", "1");
    }
    if (onlyAdmin) {
      formData.append("admin_post_only", "1");
    }

    dispatch(
      updateRoomSettingsRequest({
        token: token,
        room_id: props.room_id,
        formData: formData,
        setLoading: setLoading,
        refreshPage: refreshPage,
      })
    );
  };

  const deleteRoom = () => {
    Alert.alert(
      t("Delete Room"),
      t("Are you sure you want to Delete this room?"),
      [
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          onPress: () => {
            dispatch(
              deleteRoomRequest({
                token: token,
                room_id: props.room_id,
                setLoading: setLoading,
                navigation: navigation,
              })
            );
            dispatch(
              myRoomsRequest({
                token: token,
                setLoading: setLoading,
              })
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  console.log("Loading in settings::>>>", loading);

  return (
    <View style={[styles.container, { marginBottom: marginBottomValue }]}>
      <View style={styles.iconsAndHeadingCon}>
        <View style={styles.headingContainer}>
          <FontAwesome name="cog" size={18} color={COLORS.black} />
          <Text style={styles.heading}>{t("Room Settings")}</Text>
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
        <Text style={styles.roomNameText}>{t("Room Name")}</Text>
        <TextInput
          style={styles.roomNameInput}
          onChangeText={setRoomName}
          value={roomName}
        />
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.roomDescriptionText}>{t("Room Description")}</Text>
        <TextInput
          multiline
          style={styles.roomDescriptionInput}
          onChangeText={setRoomDescription}
          value={roomDescription}
        />
      </View>

      <View style={styles.decisionContainer}>
        <View style={styles.textAndBoxContainer}>
          <Text style={styles.optionText}>
            {t("Turn off media post for this room")}
          </Text>
          <CheckBox
            disabled={false}
            value={mediaPost}
            onValueChange={() => setMediaPost(!mediaPost)}
            boxType="square"
            tintColor="lightgray"
            onTintColor="lightgray"
            onCheckColor={COLORS.primary}
            onFillColor={COLORS.white}
            offAnimationType="fade"
            onAnimationType="stroke"
            tintColors={{ true: COLORS.primary }}
            style={{ height: WP(6), width: WP(6), marginRight: WP(1) }}
          />
        </View>
      </View>

      <View style={styles.decisionContainer}>
        <View style={styles.textAndBoxContainer}>
          <Text style={styles.optionText}>
            {t("Only admin can post in this room")}
          </Text>
          <CheckBox
            disabled={false}
            value={onlyAdmin}
            onValueChange={() => setOnlyAdmin(!onlyAdmin)}
            boxType="square"
            tintColor={COLORS.lightGray}
            onTintColor={COLORS.lightGray}
            onCheckColor={COLORS.primary}
            onFillColor={COLORS.white}
            offAnimationType="fade"
            onAnimationType="stroke"
            tintColors={{ true: COLORS.primary }}
            style={{ height: WP(6), width: WP(6), marginRight: WP(1) }}
          />
        </View>
      </View>
      <View style={{ alignSelf: "center", marginVertical: 30 }}>
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
    marginHorizontal: 25,
    marginTop: 15,
  },
  textAndBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { fontSize: 14, marginRight: 10 },
  iconsAndHeadingCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
    alignItems: "center",
  },
});
export default Settings;
