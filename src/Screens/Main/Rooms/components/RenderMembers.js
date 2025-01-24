import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Divider } from "react-native-elements";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import DotMenuModal from "./DotMenuModal";
import { useTranslation } from "react-i18next";

import { HP } from "../../../../../Utils/Resposive";
import { IMAGES } from "../../../../Constants/Images";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import {
  makeAdminReq,
  removeAdminReq,
  removeMemberReq,
  showRoomRequest,
  roomMembersRequest,
  makeSilentObserverReq,
  removeSilentObserverReq,
} from "../../../../Redux/actions/RoomActions";
import { showMessage } from "react-native-flash-message";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import { ACTIONS } from "../../../../Redux/action-types";

const RenderMembers = ({
  item,
  isAdmin,
  room_encrypted_id,
  group_encrypted_id,
  handle,
  onRefresh,
  removeMember,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const isMute = item?.is_mute;
  const user_id = item?.encrypted_id;
  const room_Admin = item?.isRoomAdmin;

  const [showDotMenu, setshowDotMenu] = useState(false);

  const openProfileRoomMembers = () => {
    navigation.navigate("ProfileScreen", {
      params: { userName: item.name, id: item?.id },
      id: item?.id,
    });
  };

  const onPressDotMenu = () => {
    setshowDotMenu(true);
  };

  const refreshData = () => {
    dispatch(
      roomMembersRequest({
        token,
        room_id: room_encrypted_id,
      })
    );

    dispatch(
      showRoomRequest({
        token,
        room_id: room_encrypted_id,
      })
    );
  };

  const makeGroupAdmin = () => {
    const formData = new FormData();
    formData.append("ids[0]", item?.id);

    const url = `${BASE_URL}/groups/${group_encrypted_id}/admin/store`;

    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            onRefresh();
            showMessage({
              message: res?.message,
              type: "success",
            });
          } else {
            console.log("error: group is private", res);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("timelineDataError: ", error);
    }
  };

  const onPressMakeAdmin = () => {
    if (room_encrypted_id) {
      const formData = new FormData();
      formData.append("user_id", user_id);

      dispatch(
        makeAdminReq({
          token,
          room_id: room_encrypted_id,
          formData,
          refresh: refreshData(),
        })
      );
    } else {
      makeGroupAdmin();
    }

    setshowDotMenu(false);
  };

  const removeGroupAdmin = () => {
    const url = `${BASE_URL}/groups/${group_encrypted_id}/admin/${user_id}/delete`;

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
          if (res?.responseCode == 200) {
            onRefresh();
            showMessage({
              message: res?.message,
              type: "success",
            });
          } else {
            console.log("error: group is private", res);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("timelineDataError: ", error);
    }
  };

  const removeAdmin = () => {
    setshowDotMenu(false);
    if (room_encrypted_id) {
      const formData = new FormData();
      formData.append("user_id", user_id);

      dispatch(
        removeAdminReq({
          token,
          room_id: room_encrypted_id,
          formData,
          refresh: refreshData(),
        })
      );
    } else {
      removeGroupAdmin();
    }
  };

  const makeSilentObserver = () => {
    const formData = new FormData();
    formData.append("user_id", user_id);

    dispatch(
      makeSilentObserverReq({
        token,
        room_id: room_encrypted_id,
        formData,
        refresh: refreshData(),
      })
    );
    setshowDotMenu(false);
  };

  const removeSilentObserver = () => {
    const formData = new FormData();
    formData.append("user_id", user_id);

    dispatch(
      removeSilentObserverReq({
        token,
        room_id: room_encrypted_id,
        formData,
        refresh: refreshData(),
      })
    );

    setshowDotMenu(false);
  };

  const removeGroupMember = () => {
    const formData = new FormData();
    formData.append("user_id", user_id);

    const url = `${BASE_URL}/groups/${group_encrypted_id}/member/remove`;

    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            onRefresh();
            showMessage({
              message: res?.message,
              type: "success",
            });
          } else {
            console.log("error: group is private", res);
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("timelineDataError: ", error);
    }
  };

  const removeRoomMember = () => {
    Alert.alert(
      t("Remove Member"),
      t("Are you sure you want to remove this member?"),
      [
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("OK"),
          onPress: () => {
            const formData = new FormData();
            formData.append("user_id", user_id);
            if (room_encrypted_id) {
              dispatch(
                removeMemberReq({
                  token,
                  room_id: room_encrypted_id,
                  formData,
                  // refresh: refreshData(),
                })
              );
              removeMember(user_id);
            } else {
              removeGroupMember();
            }
          },
        },
      ],
      { cancelable: false }
    );
    setshowDotMenu(false);
  };

  const acceptDeclineRequest = async (formData) => {
    try {
      const res = await withoutStringiApiCall2({
        params: formData,
        route: `groups/${group_encrypted_id}/admin/request/accept`,
        verb: "POST",
        token: token,
      });

      console.log("res: ", res);
      if (res.responseCode !== 200) {
        console.log("error: ", res.errors);
      } else if (res.responseCode == 200) {
        onRefresh();
        showMessage({
          message: res.message,
          type: "success",
        });
      }
    } catch (error) {
      console.log("inviteMembersError: ", error);
    }
  };

  const onPressAccept = () => {
    const formData = new FormData();
    formData.append("action", "accept");
    formData.append("user_id", item?.encrypted_id);

    setshowDotMenu(false);
    acceptDeclineRequest(formData);
  };

  const onPressReject = () => {
    const formData = new FormData();
    formData.append("action", "decline");
    formData.append("user_id", item?.encrypted_id);

    setshowDotMenu(false);
    acceptDeclineRequest(formData);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={openProfileRoomMembers}
      >
        <Image
          source={
            item?.profile_picture
              ? {
                  uri: SITE_URL + item?.profile_picture,
                }
              : IMAGES.blankDP
          }
          style={styles.image}
        />

        <View>
          <Text style={styles.nameText}>
            {item?.first_name} {item?.last_name}
          </Text>

          <View style={styles.subContainer}>
            <Text>
              {item?.isRoomAdmin ? "Admin" : handle ? handle : t("Member")}
            </Text>
            {item?.is_mute ? (
              <FontAwesome5
                name="volume-mute"
                size={HP(2)}
                color="Gray"
                style={{ marginLeft: 5 }}
              />
            ) : null}
          </View>
        </View>

        {isAdmin && (
          <Entypo
            name="dots-three-horizontal"
            size={HP(2.5)}
            style={styles.dotIcon}
            onPress={onPressDotMenu}
          />
        )}
      </TouchableOpacity>
      <Divider style={styles.divider} />

      {showDotMenu && (
        <DotMenuModal
          modalVisible={showDotMenu}
          setModalVisible={setshowDotMenu}
          onPressMakeAdmin={onPressMakeAdmin}
          makeSilentObserver={makeSilentObserver}
          removeRoomMember={removeRoomMember}
          isMute={isMute}
          room_Admin={handle == "Admin" || room_Admin}
          removeAdmin={removeAdmin}
          removeSilentObserver={removeSilentObserver}
          room_encrypted_id={room_encrypted_id}
          showActionsMenu={handle == t("Waiting Approval")}
          onPressAccept={onPressAccept}
          onPressReject={onPressReject}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: HP(1),
    marginHorizontal: HP(2),
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  nameText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  subContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  dotIcon: { position: "absolute", top: 10, right: 0 },
});
export default RenderMembers;
