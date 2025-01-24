import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Video from "react-native-video";
import { HP } from "../../../../Utils/Resposive";
import { BASE_URL, SITE_URL } from "../../../Services/Constants";
import { useSelector, useDispatch } from "react-redux";

import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { showMessage } from "react-native-flash-message";
import { deleteVideoProfile } from "../../../Redux/actions/ProfileActions";
import CustomVideoSwiper from "../../../Components/CustomVideoSwaper";
import { getHeight } from "../../../../Utils/NewResponsive";

const VideoFullViewScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const item = route?.params;
  const userName = item?.userName;
  const videoIndex = item?.videoIndex;
  const userVideos = item?.data;

  const navigation = useNavigation();

  const [vidLoading, setVidLoading] = useState(true);
  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);

  const id = item?.item?.albumId
    ? item?.item?.encrypted_id
    : item?.item?.encrypted_id;

  const deleteGroupVideo = () => {
    const url = item?.item?.albumId
      ? `${BASE_URL}/groups/delete_album_photo/${item?.item?.albumId}?id[album_id]=${item?.item?.media[0]?.encrypted_id}`
      : `${BASE_URL}/user/video/${item?.item?.media[0]?.encrypted_id}`;

    try {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res: ", res);
          if (res?.responseCode == 200) {
            navigation.goBack();

            showMessage({
              message: "Video deleted",
              type: "success",
            });
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("albumsDataError: ", error);
    }
  };

  const onPressDelete = () => {
    Alert.alert(
      t("Delete Post"),
      t("Are you sure you want to delete this post?"),
      [
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("OK"),
          onPress: () => {
            if (item?.item?.fromGroup) {
              deleteGroupVideo();
            } else {
              dispatch(
                deleteVideoProfile({
                  token: token,
                  id: item?.isProfile ? id : item?.encrypted_id,
                  navigation: navigation,
                })
              );
              // navigation.goBack();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        {ICONS.materialIcons("cancel", COLORS.grey, 35)}
      </TouchableOpacity>

      {item?.isProfile ? (
        userData?.id === item?.item?.user_id && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onPressDelete}>
            {ICONS.antDesign("delete", COLORS.primary, 28)}
          </TouchableOpacity>
        )
      ) : item?.item?.fromGroup && item?.item?.isAdmin ? (
        <TouchableOpacity style={styles.deleteBtn} onPress={onPressDelete}>
          {ICONS.antDesign("delete", COLORS.primary, 28)}
        </TouchableOpacity>
      ) : (
        userData?.id === item?.media[0]?.user_id && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onPressDelete}>
            {ICONS.antDesign("delete", COLORS.primary, 28)}
          </TouchableOpacity>
        )
      )}

      {item?.isProfile ? (
        <CustomVideoSwiper
          userVideos={userVideos}
          userName={userName}
          initialIndex={videoIndex}
          item={item}
        />
      ) : (
        <>
          <Video
            source={{
              uri: item?.isProfile
                ? SITE_URL + item?.item?.path
                : item?.item?.fromGroup && item?.item?.path
                ? `${SITE_URL}${item?.item?.path}`
                : item?.item?.fromGroup && !item?.item?.path
                ? SITE_URL + "/" + item?.item?.media[0]?.path
                : SITE_URL +
                  "converted_videos/" +
                  item?.media[0]?.stream_path240,
            }}
            style={{
              height: HP(45),
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
            onReadyForDisplay={() => setVidLoading(false)}
            controls={true}
            resizeMode={"contain"}
            paused={false}
            poster={
              SITE_URL + "converted_videos/thumbnails/" + item?.thumb_path
            }
          ></Video>
          <ActivityIndicator
            animating={vidLoading}
            size={"large"}
            color={COLORS.primary}
            style={{
              alignSelf: "center",
              marginTop: HP(18),
              position: "absolute",
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    right: 18,
    top: getHeight(6),
    zIndex: 1000,
  },

  deleteBtn: {
    position: "absolute",
    right: 65,
    top: getHeight(6.2),

    zIndex: 1000,
  },
});
export default VideoFullViewScreen;
