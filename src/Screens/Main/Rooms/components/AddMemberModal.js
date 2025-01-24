import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
import { HP } from "../../../../../Utils/Resposive";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import { useSelector, useDispatch } from "react-redux";
import { SITE_URL } from "../../../../Services/Constants";
import { getHeight } from "../../../../../Utils/NewResponsive";
import ButtonCom from "./ButtonCom";
import InputField from "./InputField";
import {
  addMemberRequest,
  roomMembersRequest,
  myRoomsRequest,
  showRoomRequest,
} from "../../../../Redux/actions/RoomActions";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const AddMemberModal = ({ isVisible, setAddMemberModalVisible, roomId }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [added_ids, setAdded_ids] = useState([]);
  const [friendslistData, setFriendslistData] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [disableCreate, setDisableCreate] = useState(true);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);

  const inputRef = useRef(null);
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    searchFriend(" ");
  }, [isVisible]);

  const searchFriend = async (text) => {
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        route: text
          ? `rooms/${roomId}/add-members/search?search_guest=${text}&added_ids[]=${added_ids.toString()}`
          : `rooms/${roomId}/add-members/search?search_guest=&added_ids[]=`,
        verb: "GET",
        token: token,
      });
      // console.log("res", res);
      if (res.responseCode !== 200) {
        console.log("Error in saga", res.errors);
        setLoadingFriendsList(false);
      } else if (res.responseCode == 200) {
        setFriendslistData(res?.payload?.data.guests);
        setLoadingFriendsList(false);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  // useEffect(() => {
  //   searchFriend();
  // }, [friendslistData]);

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
      // inputRef.current.clear();
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
        onPress={() => handleOnPressFriendsItem(item)}
        style={styles.searchFriendsItemContainer}
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

  const addMember = async () => {
    const formData = new FormData();
    added_ids?.map((item) => {
      formData.append("invited_guest[]", item);
    });

    dispatch(
      addMemberRequest({
        room_id: roomId,
        formData,
        token,
        setLoading,
      })
    );

    dispatch(
      roomMembersRequest({
        room_id: roomId,
        token,
      })
    );

    setTimeout(() => {
      setAddMemberModalVisible(false);
    }, 2000);
  };

  // clear modal data
  useEffect(() => {
    if (!isVisible) {
      setFriendslistData([]);
      setSelectedFriends([]);
      setAdded_ids([]);
    }
  }, [isVisible]);

  useEffect(() => {
    if (added_ids.length > 0) {
      setDisableCreate(false);
    }
  }, [added_ids]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <TouchableOpacity
        style={styles.topView}
        onPress={() => setAddMemberModalVisible(false)}
      ></TouchableOpacity>
      <View style={styles.bottomView}>
        <Text style={styles.heading}>{t("Add Member")}</Text>

        <Divider style={styles.divider} />

        <View style={styles.searchFieldCon}>
          <InputField
            placeholder={t("Search")}
            search
            onChangeText={(val) => searchFriend(val, added_ids)}
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
          />
        )}

        <View style={styles.buttonCon}>
          <ButtonCom title={t("Cancel")} onPress={onCancelPress} />
          <ButtonCom
            title={t("Add")}
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
    // backgroundColor: "red",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: COLORS.tooLightGrey,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    height: 45,
    marginLeft: 10,
    fontSize: 16,
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
export default AddMemberModal;
