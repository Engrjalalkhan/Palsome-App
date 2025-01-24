import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import ButtonCom from "./ButtonCom";
import InputField from "./InputField";
import { Divider } from "react-native-paper";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { useDispatch, useSelector } from "react-redux";
import { HP, WP } from "../../../../../Utils/Resposive";
import { SITE_URL } from "../../../../Services/Constants";
import { getHeight } from "../../../../../Utils/NewResponsive";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import { myRoomsRequest } from "../../../../Redux/actions/RoomActions";
import { createRoomRequest } from "../../../../Redux/actions/RoomActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateRoomModal = ({ setShowCreateRoomModal }) => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [disableCreate, setDisableCreate] = useState(true);
  const [friendslistData, setFriendslistData] = useState([]);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [selectectedItems, setSelectectedItems] = useState([]);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added_ids, setAdded_ids] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const inputRef = useRef(null);
  const privacyData = [
    { id: 1, title: "My Timeline", value: "timeline" },
    {
      id: 2,
      title: "Friends",
      value: "friend",
    },
  ];

  const onCancelPress = () => {
    setShowCreateRoomModal(false);
  };

  const searchFriend = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      setLoadingFriendsList(true);
      setShowFriendsList(true);
      try {
        const res = await withoutStringiApiCall2({
          route: text
            ? `rooms/user/search?term=${text}&added_ids[]=${added_ids}`
            : `rooms/user/search?term=&added_ids[]=`,
          verb: "GET",
          token: token,
        });
        // console.log("search api res -- ", JSON.stringify(res));
        if (res.responseCode !== 200) {
          setLoadingFriendsList(false);
          console.log("Error in saga", res?.errors);
        } else if (res.responseCode == 200) {
          setFriendslistData(res?.payload?.data);

          setLoadingFriendsList(false);
        }
      } catch (e) {
        console.log("saga error -- ", e.toString());
      }
    } else {
      setFriendslistData([]);
      setLoadingFriendsList(false);
      setShowFriendsList(false);
    }
  };

  const handleOnPressFriendsItem = (item) => {
    {
      const obj = {
        id: item.id,
        name: item.first_name,
        image: item?.profile_picture,
      };

      setSelectedFriends([...selectedFriends, obj]);
      setAdded_ids([...added_ids, obj.id]);
      setShowFriendsList(false);
      inputRef.current.clear();
      inputRef.current.blur();
    }
  };

  const renderSearchFriendsItem = ({ item }) => {
    return item.first_name != undefined ? (
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
            {item?.first_name + " " + item?.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <Text>{t("No Result")}</Text>
    );
  };

  const selectedFriendsItem = ({ item }) => {
    return (
      <View style={styles.selectedFriendsItemCon}>
        <Image
          source={
            item?.image !== null
              ? { uri: `${SITE_URL}${item?.image}` }
              : IMAGES.blankDP
          }
          style={styles.selectedFriendsItemImage}
        />
        <Text style={styles.selectedFriendsItemText}>{item?.name}</Text>

        <TouchableOpacity
          onPress={() => {
            const filtered = selectedFriends.filter(
              (friend) => friend.id !== item.id
            );
            setSelectedFriends(filtered);
            const filteredIds = added_ids.filter((id) => id !== item.id);
            setAdded_ids(filteredIds);
          }}
          style={styles.selectedFriendsItemClose}
        >
          {ICONS.entypo("circle-with-cross", COLORS.red, getHeight(2))}
        </TouchableOpacity>
      </View>
    );
  };

  const createRoom = async () => {
    const formData = new FormData();
    formData.append("name", roomName);
    formData.append("ids", added_ids.toString());
    formData.append("description", roomDescription);

    dispatch(
      createRoomRequest({
        formData,
        token,
        setLoading,
      })
    );
    dispatch(myRoomsRequest({ token }));
    setTimeout(() => {
      setShowCreateRoomModal(false);
    }, 2000);
  };

  useEffect(() => {
    if (roomName.length > 0 && added_ids.length > 0) {
      setDisableCreate(false);
    }
  }, [roomName, added_ids]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        setShowCreateRoomModal(false);
      }}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setShowCreateRoomModal(false)}>
            <Image source={IMAGES.leftArrow} style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t("Create Room")}</Text>
        </View>

        <Divider />
        <KeyboardAwareScrollView style={{ flex: 1, marginBottom: 10 }}>
          <View style={styles.topView}>
            <InputField
              placeholder={t("Room Name")}
              value={roomName}
              onChangeText={(val) => setRoomName(val)}
            />
            <Text
              style={{
                color: "red",
                marginTop: Platform.OS === "ios" ? -HP(3.6) : -HP(4.5),
                display: roomName === "" ? "flex" : "none",
                marginLeft: Platform.OS === "ios" ? WP(32) : WP(39),
                fontSize: 16,
              }}
            >
              *
            </Text>
          </View>

          <View style={styles.headingCon}>
            <Text style={styles.heading}>{t("Add Friends")}</Text>
          </View>

          <View
          // style={
          //   ([styles.searchFieldCon],
          //   { justifyContent: "center", flexDirection: "row" })
          // }
          >
            <InputField
              placeholder={t("Search")}
              search
              onChangeText={(val) => searchFriend(val)}
              inputRef={inputRef}
            />
          </View>

          {/* ---Friends list--- */}
          {showFriendsList && friendslistData.length > 0 ? (
            <View style={styles.friendsListCon}>
              {loadingFriendsList ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <FlatList
                  data={friendslistData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSearchFriendsItem}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          ) : (
            inputRef.current?.isFocused() &&
            searchText?.length > 0 && (
              <View style={styles.listEmptyBox}>
                <Text style={{ fontSize: 23, color: "Gray" }}>
                  {t("No Results")}
                </Text>
              </View>
            )
          )}

          {/* ---Selected Friends--- */}
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

          <View style={styles.descriptionCon}>
            <InputField
              placeholder={t("Description")}
              multiline={true}
              description
              onChangeText={(text) => setRoomDescription(text)}
            />
          </View>

          <View style={styles.buttonCon}>
            <ButtonCom title={t("Cancel")} onPress={onCancelPress} />
            <ButtonCom
              title={t("Create")}
              create={!disableCreate}
              disable={disableCreate}
              onPress={createRoom}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>

      {loading && (
        <ActivityIndicator
          size={"large"}
          color={COLORS.red}
          style={{ flex: 1 }}
        />
      )}
    </Modal>
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
    top: Platform.OS === "ios" ? 190 : 170,
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
    marginVertical: 10,
  },
  selectedFriendsCon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedFriendsItemClose: {
    position: "absolute",
    right: 0,
    top: -4,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  listEmptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    height: getHeight(5),
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
});
export default CreateRoomModal;
