import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import NewPostModal from "../NewPostModal";

import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

import { HP, WP } from "../../../Utils/Resposive";
import { ACTIONS } from "../../Redux/action-types";
import { SITE_URL } from "../../Services/Constants";
import { useTranslation } from "react-i18next";
import { ICONS } from "../../Constants/Icons";
import { getWidth } from "../../../Utils/NewResponsive";

const NewPost = memo((props) => {
  const newsFeed = props.newsFeed;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userData = useSelector((state) => state.auth.userData);
  const visibility = useSelector((state) => state.prof.visibility);
  const profileDP = useSelector((state) => state.prof.profilePicture);

  const [visible, setVisible] = useState(false);
  const [Placeholder, setPlaceholder] = useState(
    props?.userdataTimeine
      ? props?.userdataTimeine?.id == userData.id
        ? `${t("What's on your mind, ")}${userData?.first_name}`
        : `${t("Write something on ")} ${
            props?.userdataTimeine?.first_name
          }'${t("'s timeline")}`
      : `${t("What's on your mind, ")}${userData?.first_name}`
  );

  const room_id = props?.room_id;
  const room_encrypted_id = props?.room_encrypted_id;

  const group_id = props?.group_id;
  const group_encrypted_id = props?.group_encrypted_id;

  const event_id = props?.event_id;
  const event_encrypted_id = props?.event_encrypted_id;

  const turnOffModal = () => {
    dispatch({ type: ACTIONS.OPEN_MODAL, visibility: false });
    setVisible(false);
    changePlaceholderString("");
  };

  const changePlaceholderString = (text) => {
    if (text) setPlaceholder(text);
    else
      setPlaceholder(
        props?.userdataTimeine
          ? props?.userdataTimeine?.id == userData.id
            ? `${t("What's on your mind, ")} ${userData?.first_name}`
            : `${t("Write something on")} ${
                props?.userdataTimeine?.first_name
              }'${t("'s timeline")}`
          : `${t("What's on your mind, ")} ${userData?.first_name}`
      );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            props?.userdataTimeine?.id !== userData.id &&
            navigation.push("ProfileScreen", {
              id: userData?.id,
            })
          }
        >
          <Image
            style={styles.profileImag}
            source={
              userData?.profile_picture != null
                ? {
                    uri:
                      profileDP == null
                        ? SITE_URL + userData?.profile_picture
                        : profileDP,
                  }
                : profileDP !== null
                ? { uri: profileDP }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingVertical: HP(2),
            paddingRight: WP(5),
            zIndex: 1000,
            flexDirection: "row",
            alignItems: "center",
            width: getWidth(85),
            justifyContent: "space-between",
          }}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.txt}>
            {newsFeed
              ? `${t("Tap to start your post,")} ${userData?.first_name}`
              : props?.placeholder
              ? props.placeholder
              : Placeholder}
          </Text>

          {ICONS.ionIcons("create-outline", COLORS.primary, 25)}
        </TouchableOpacity>
      </View>

      {(visibility || visible) && (
        <NewPostModal
          room_encrypted_id={room_encrypted_id}
          navigation={props.navigation}
          room_id={room_id}
          newsFeed={props?.newsFeed}
          room={props?.room}
          gropuPrivacy={props?.gropuPrivacy}
          group_id={group_id}
          group_encrypted_id={group_encrypted_id}
          group={props?.group}
          eventType={props?.eventType}
          event_id={event_id}
          event_encrypted_id={event_encrypted_id}
          event={props?.event}
          onRefresh={props?.onRefresh}
          visible={visibility || visible}
          goBack={() => turnOffModal()}
          changePlaceholderString={changePlaceholderString}
          dataOfPostOntimeline={{
            timelinePlaceholder: Placeholder,
            encrypted_id: props?.userdataTimeine?.encrypted_id,
          }}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height: HP(9),
    paddingVertical: HP(1.5),
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  profileImag: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  txt: { color: COLORS.darkGray, marginLeft: 10 },
});

export default NewPost;
