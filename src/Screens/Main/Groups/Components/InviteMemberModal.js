import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";

import ButtonCom from "../../Rooms/components/ButtonCom";
import InputField from "../../Rooms/components/InputField";
import NoSearchResults from "../../../../Components/NoSearchResults";

import { HP } from "../../../../../Utils/Resposive";
import { getHeight } from "../../../../../Utils/NewResponsive";

import { SITE_URL } from "../../../../Services/Constants";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";

import { ICONS } from "../../../../Constants/Icons";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { showMessage } from "react-native-flash-message";

const InviteMemberModal = ({
  isVisible,
  setAddMemberModalVisible,
  groupID,
  event,
  eventId,
}) => {
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const [added_ids, setAdded_ids] = useState([]);
  const [disableCreate, setDisableCreate] = useState(true);
  const [friendslistData, setFriendslistData] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);

  useEffect(() => {
    searchFriend("");
  }, []);

  useEffect(() => {
    if (added_ids.length > 0) {
      setDisableCreate(false);
    } else {
      setDisableCreate(true);
    }
  }, [added_ids]);

  // clear modal data
  useEffect(() => {
    if (!isVisible) {
      setFriendslistData([]);
      setSelectedFriends([]);
      setAdded_ids([]);
    }
  }, [isVisible]);

  const searchFriend = async (text) => {
    setLoadingFriendsList(true);
    let url = "";

    if (event) {
      url = text
        ? `events/${eventId}/guest/search?search_guest=${text}&added_ids[0]=-1`
        : `events/${eventId}/guest/search?added_ids[0]=-1`;
    } else {
      url = text
        ? `groups/${groupID}/guest/search?search_guest=${text}`
        : `groups/${groupID}/guest/search`;
    }

    try {
      const res = await withoutStringiApiCall2({
        route: url,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("Error in search Friend::> ", res.errors);
      } else if (res.responseCode == 200) {
        const fetchedFriends = res?.payload?.data.guests;
        const filteredFriends = fetchedFriends.filter(
          (friend) => !added_ids.includes(friend.id)
        );
        setFriendslistData(filteredFriends);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    } finally {
      setLoadingFriendsList(false);
    }
  };

  const handleOnPressFriendsItem = (item) => {
    if (added_ids.includes(item.id)) {
      const newAdded_ids = added_ids.filter((id) => id !== item.id);
      setAdded_ids(newAdded_ids);
      const newSelectedFriends = selectedFriends.filter(
        (friend) => friend.id !== item.id
      );
      setSelectedFriends(newSelectedFriends);
      setFriendslistData((prevFriends) => [...prevFriends, item]);
    } else {
      const obj = {
        birth_place: item.birth_place,
        cover_picture: item.cover_picture,
        email: item.email,
        first_name: item.first_name,
        gender: item.gender,
        id: item.id,
        isInvited: item.isInvited,
        last_name: item.last_name,
        name: item.name,
        profile_picture: item.profile_picture,
        user_last_seen: item.user_last_seen,
        user_online_status: item.user_online_status,
      };

      setSelectedFriends((prevSelectedFriends) => [
        ...prevSelectedFriends,
        obj,
      ]);
      setAdded_ids((prevAdded_ids) => [...prevAdded_ids, item.id]);
      setFriendslistData((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== item.id)
      );
      inputRef.current.clear();
      inputRef.current.blur();
    }
  };

  const selectedFriendsItem = ({ item }) => {
    return (
      <View style={styles.selectedFriendsItemCon}>
        <Image
          source={
            item?.profile_picture !== null
              ? { uri: `${SITE_URL}${item?.profile_picture}` }
              : IMAGES.blankDP
          }
          style={styles.selectedFriendsItemImage}
        />
        <Text style={styles.selectedFriendsItemText}>
          {item?.first_name + " " + item?.last_name}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const filtered = selectedFriends.filter(
              (friend) => friend.id !== item.id
            );
            setSelectedFriends(filtered);
            const filteredIds = added_ids.filter((id) => id !== item.id);
            setAdded_ids(filteredIds);

            setFriendslistData((prevFriends) => [item, ...prevFriends]);
          }}
          style={styles.selectedFriendsItemClose}
        >
          {ICONS.entypo("circle-with-cross", COLORS.red, getHeight(2))}
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchFriendsItem = ({ item }) => {
    return (
      <TouchableOpacity
        disabled={item?.isInvited ? true : false}
        onPress={() => handleOnPressFriendsItem(item)}
        style={[
          styles.searchFriendsItemContainer,
          { opacity: item?.isInvited ? 0.5 : 1 },
        ]}
      >
        <Image
          source={
            item?.profile_picture !== null
              ? { uri: `${SITE_URL}${item?.profile_picture}` }
              : IMAGES.blankDP
          }
          style={styles.searchFriendsItemImage}
        />
        <View style={styles.searchFriendsItemTextContainer}>
          <Text style={styles.searchFriendsItemText}>
            {item?.first_name} {item?.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onCancelPress = () => {
    setAddMemberModalVisible(false);
  };

  const inviteMember = async () => {
    const url = event ? `events/${eventId}/invite` : `groups/${groupID}/invite`;

    try {
      const formData = new FormData();
      added_ids.forEach((item) => {
        formData.append("invited_guest[]", item);
      });

      const res = await withoutStringiApiCall2({
        params: formData,
        route: url,
        verb: "POST",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("error: ", res.errors);
      } else if (res.responseCode == 200) {
        console.log("res: ", res);
        showMessage({
          message: "Invitation sent successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.log("inviteMembersError: ", error);
    }
  };

  const addMember = async () => {
    showMessage({
      message: "Sending invitation",
      type: "info",
    });

    inviteMember();
    setTimeout(() => {
      setAddMemberModalVisible(false);
    }, 500);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <TouchableOpacity
        style={styles.topView}
        onPress={() => setAddMemberModalVisible(false)}
      ></TouchableOpacity>
      <View style={styles.bottomView}>
        <Text style={styles.heading}>{t("Invite Member")}</Text>

        <Divider style={styles.divider} />

        <View style={styles.searchFieldCon}>
          <InputField
            placeholder={t("Search")}
            search
            onChangeText={(val) => searchFriend(val)}
            inputRef={inputRef}
          />
        </View>

        <View style={styles.selectedFriendsCon}>
          <FlatList
            data={selectedFriends}
            keyExtractor={(item) => item.id.toString()}
            renderItem={selectedFriendsItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Divider style={styles.marginTop} />

        {loadingFriendsList ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={friendslistData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSearchFriendsItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoSearchResults />}
          />
        )}

        <View style={styles.buttonCon}>
          <ButtonCom title={t("Cancel")} onPress={onCancelPress} />
          <ButtonCom
            title={t("Invite")}
            create={!disableCreate}
            disable={disableCreate}
            onPress={addMember}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topView: {
    height: HP(20),
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    height: HP(80),
    backgroundColor: COLORS.white,
    paddingVertical: 20,
  },
  heading: {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: COLORS.black,
    height: 1,
    marginVertical: 10,
  },
  marginTop: { marginTop: 25 },
  searchFriendsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchFriendsItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  searchFriendsItemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchFriendsItemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedFriendsCon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
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
  selectedFriendsItemClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  buttonCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  searchFieldCon: {
    marginVertical: 10,
  },
  loader: { flex: 1 },
});
export default InviteMemberModal;
