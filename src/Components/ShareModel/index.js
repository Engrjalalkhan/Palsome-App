import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Share from "react-native-share";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import ModalDropdown from "react-native-modal-dropdown";
import Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

import styles from "./styles";
import Button from "../NewButton";
import DiscardModal from "../DiscardModal";
import CustomPicker from "../CustomPickers/CustomPickerIos";

import { WP } from "../../../Utils/Resposive";
import { getHeight } from "../../../Utils/NewResponsive";

import { withoutStringiApiCall2 } from "../../Services/Apis";
import { SHARE_URL, SITE_URL } from "../../Services/Constants";
import { PostShare } from "../../Redux/actions/NewsFeedActions";
import { useTranslation } from "react-i18next";

import { ICONS } from "../../Constants/Icons";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

const ShareModel = React.memo((props) => {
  const {
    postId,
    setShareModel,
    shareModel,
    item,
    onRefresh = () => {},
  } = props;
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData.name);

  const [postOnPickerValue, setPostOnPickerValue] = useState("timeline");
  const [myVisible, setMyVisible] = useState(false);

  const [Items, setItems] = useState([]);
  const [selectectedItems, setSelectectedItems] = useState();
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);

  const [post_share_text, setPost_share_text] = useState("");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const [friends, setFriends] = useState([]);

  const pickerArray = ["timeline", "friend", "group", "room"];
  const privacyData = [
    { id: 1, title: t("My Timeline"), value: "timeline" },
    {
      id: 2,
      title: t("Friend's Timeline"),
      value: "friend",
    },
    // {
    //   id: 3,
    //   title: "Page",
    //   value: "page",
    // },
    {
      id: 4,
      title: t("Select Group"),
      value: "group",
    },
    {
      id: 5,
      title: t("Select Room"),
      value: "room",
    },
  ];

  const getGroups = async (val) => {
    setSelectectedItems();
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        route: val ? `fetch-groups?term=${val}` : `fetch-groups`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        setLoadingFriendsList(false);
      } else if (res.responseCode == 200) {
        setShowFriendsList(true);
        setLoadingFriendsList(false);
        setItems(
          res?.payload?.data?.groups
            ? res?.payload?.data?.groups
            : res?.payload?.data
        );
      }
    } catch (e) {
      console.log("Post get Room error -- ", e.toString());
    }
  };

  const getFriends = async (val) => {
    setSelectectedItems();
    setLoadingFriendsList(true);
    const res = await withoutStringiApiCall2({
      route: `timeline/${userName}/friends`,
      verb: "GET",
      token: token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in postgetFriends ... ", res);
      setLoadingFriendsList(false);
    } else if (res.responseCode == 200) {
      setShowFriendsList(true);
      setLoadingFriendsList(false);
      setFriends(res.payload.data.friends?.data);
    }
  };

  const getSearchFriends = async (val) => {
    setSelectectedItems();
    setLoadingFriendsList(true);
    const res = await withoutStringiApiCall2({
      route: `timeline/${userName}/friends/search?search_friends=${val}`,
      verb: "GET",
      token: token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in postgetFriends ... ", res);
      setLoadingFriendsList(false);
    } else if (res.responseCode == 200) {
      setShowFriendsList(true);
      setLoadingFriendsList(false);
      setFriends(res.payload.data.friends);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userName, token]);

  const getRooms = async (val) => {
    setSelectectedItems();
    setLoadingFriendsList(true);
    try {
      const res = await withoutStringiApiCall2({
        route: val ? `fetch-rooms?term=${val}` : `fetch-rooms`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        setLoadingFriendsList(false);
      } else if (res.responseCode == 200) {
        setShowFriendsList(true);
        setLoadingFriendsList(false);
        setItems(
          res.payload.data?.rooms ? res.payload.data.rooms : res.payload.data
        );
      }
    } catch (e) {
      console.log("Post get Room error -- ", e.toString());
    }
  };

  const getPages = async () => {
    try {
      const res = await withoutStringiApiCall2({
        route: "fetch-pages",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetPage ... ", res);
      } else if (res.responseCode == 200) {
        console.log(res.payload.data);
        setItems(res.payload.data);
      }
    } catch (e) {
      console.log("Post get Page error -- ", e.toString());
    }
  };

  const SharePost = async () => {
    console.log("id", postId);
    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("share_origin", "news_feed");
    formData.append("post_type", "news_feed");
    formData.append("share_target", postOnPickerValue);
    formData.append("post_share_text", post_share_text);
    formData.append("page_post", selectectedItems);
    formData.append("group_post", selectectedItems);
    formData.append("room_post", selectectedItems);
    formData.append("friend_post", selectectedItems);
    console.log("formdata", postOnPickerValue, selectectedItems);
    if (postOnPickerValue == "friend" && selectectedItems == undefined) {
      Toast.show("Please select a friend", Toast.SHORT);
    } else if (postOnPickerValue == "room" && selectectedItems == undefined) {
      Toast.show("Please select a Room", Toast.SHORT);
    } else {
      dispatch(PostShare({ token, formData }));
      setShareModel(false);
      onRefresh();
    }
  };

  const setPickerValue = (itemValue, value) => {
    itemValue == "page"
      ? getPages()
      : itemValue == "group"
      ? getGroups()
      : itemValue == "room"
      ? getRooms()
      : itemValue == "friend"
      ? getFriends(value)
      : null;

    setPostOnPickerValue(itemValue);
  };

  const handleOnPressFriendsItem = (item) => {
    if (item.id == selectectedItems) {
      setSelectectedItems();
    } else {
      setSelectectedItems(item.id);
      setShowFriendsList(false);
      inputRef.current.clear();
      inputRef.current.blur();
    }
  };

  const onPressDiscard = () => {
    setPost_share_text("");
    setPostOnPickerValue("timeline");
    setDiscardModalVisible(false);
    setShareModel(false);
  };

  const showFriend = () => {
    const i = friends
      .filter((itm) => itm.id == selectectedItems)
      .map((itm) => itm.first_name + " " + itm.last_name);
    return i.length ? i : setSelectectedItems();
  };

  const showRoom = () => {
    const i = Items.filter((itm) => itm.id == selectectedItems).map(
      (itm) => itm.name
    );

    return i.length ? i : setSelectectedItems();
  };
  const showGroup = () => {
    const i = Items.filter((itm) => itm.id == selectectedItems).map(
      (itm) => itm.name
    );

    return i.length ? i : setSelectectedItems();
  };

  const sharePost = async (item) => {
    try {
      const shareOptions = {
        title: "Palsome",
        social: Share.Social.FACEBOOK_STORIES,
        message: `${SHARE_URL}/en/news_feed/post/${item?.encrypted_id}`,
      };
      const result = await Share.open(shareOptions);
      setShareModel(false);
    } catch (error) {
      setShareModel(false);
      console.log("Error sharing:", error.message);
    }
  };

  return (
    <Modal
      propagateSwipe
      avoidKeyboard={postOnPickerValue !== "timeline" ? false : true}
      key={postId}
      backdropOpacity={0.3}
      isVisible={shareModel}
      onBackdropPress={() => {
        post_share_text == "" && postOnPickerValue == "timeline"
          ? setShareModel(false)
          : setDiscardModalVisible(true);
      }}
      swipeDirection={["down"]}
      style={styles.bottomView}
      onRequestClose={() => {
        post_share_text == "" && postOnPickerValue == "timeline"
          ? setShareModel(false)
          : setDiscardModalVisible(true);
      }}
      onSwipeComplete={() => {
        post_share_text == "" && postOnPickerValue == "timeline"
          ? setShareModel(false)
          : setDiscardModalVisible(true);
      }}
      statusBarTranslucent={postOnPickerValue !== "timeline" ? true : false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: WP(10),
            }}
          >
            <Text style={styles.headerText}>{t("Share Post")}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              sharePost(item);
            }}
            style={{ right: 15 }}
          >
            {ICONS.antDesign("sharealt", COLORS.primary, 30)}
          </TouchableOpacity>
        </View>

        <View style={{ padding: getHeight(3) }}>
          <TextInput
            style={styles.txtInput}
            multiline
            numberOfLines={1}
            value={post_share_text}
            require={true}
            onChangeText={(val) => setPost_share_text(val)}
            placeholder={t("What's going on? #Hashtag..")}
          />

          {Platform.OS == "android" ? (
            <View style={styles.pickerView}>
              <ModalDropdown
                showsVerticalScrollIndicator={false}
                defaultValue={
                  postOnPickerValue == "timeline"
                    ? t("My Timeline")
                    : postOnPickerValue == "friend"
                    ? t("Friend's Timeline")
                    : postOnPickerValue == "group"
                    ? t("Select Group")
                    : t("Select Room")
                }
                options={[
                  t("My Timeline"),
                  t("Friend's Timeline"),
                  t("Select Group"),
                  t("Select Room"),
                ]}
                onSelect={(index) => {
                  setPickerValue(pickerArray[index], " ");
                }}
                textStyle={{
                  color: "black",
                  fontSize: 15,
                  textTransform: "capitalize",
                }}
                dropdownStyle={styles.dropStyle}
                dropdownTextStyle={{
                  textTransform: "capitalize",
                  fontSize: 15,
                  color: "black",
                }}
                style={styles.andrioPicker}
                renderSeparator={() => null}
                renderRightComponent={() => (
                  <AntDesign
                    name="caretdown"
                    size={10}
                    color="#DF4B38"
                    style={{ position: "absolute", right: 0 }}
                  />
                )}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.iosPicker}
                onPress={() => setMyVisible(true)}
              >
                <Text>
                  {
                    privacyData.filter(
                      (itm) => itm.value == postOnPickerValue
                    )[0].title
                  }
                </Text>
                <Icon name="caret-down" color="#DF4B38" />
              </TouchableOpacity>

              <CustomPicker
                visible={myVisible}
                selectedValue={postOnPickerValue}
                setValueFunc={(val) => {
                  setPickerValue(val);
                  setMyVisible(false);
                }}
                data={privacyData}
                hideVisible={() => setMyVisible(false)}
              />
            </>
          )}

          {postOnPickerValue == "friend" ? (
            <>
              <View style={{ paddingTop: getHeight(2) }}>
                {selectectedItems ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.mytext}>
                      Your {postOnPickerValue == "friend" ? "Friend" : ""}:{" "}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#C0C0C0",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={styles.mytext}>{showFriend()}</Text>
                      <Icon
                        name="times-circle"
                        size={17}
                        color="red"
                        style={{ marginLeft: WP(1) }}
                        onPress={() => {
                          setSelectectedItems();
                          setItems([]);
                          setShowFriendsList(true);
                          getFriends();
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.mytext, { marginVertical: 5 }]}>
                    {t("Select")}{" "}
                    {postOnPickerValue == "friend" ? t("Friend") : ""}:{" "}
                  </Text>
                )}

                <TextInput
                  style={styles.txtInput2}
                  require={true}
                  ref={inputRef}
                  editable={selectectedItems ? false : true}
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  onChangeText={(val) => getSearchFriends(val)}
                  placeholder={`${t("Search")}...`}
                />
              </View>
              <View style={{ height: getHeight(43), marginTop: 10 }}>
                {showFriendsList ? (
                  <FlatList
                    keyExtractor={(item, index) => index}
                    style={{ flex: 1 }}
                    data={[...friends]}
                    ListEmptyComponent={() =>
                      loadingFriendsList ? (
                        <View style={styles.listEmptyBox}>
                          <ActivityIndicator
                            animating={true}
                            size="large"
                            color="#DF4B38"
                          />
                        </View>
                      ) : (
                        <>
                          {friends?.length == 0 ? (
                            <View style={styles.listEmptyBox}>
                              <Text>{t("No Results")}</Text>
                            </View>
                          ) : null}
                        </>
                      )
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleOnPressFriendsItem(item)}
                          style={[
                            styles.box,
                            {
                              backgroundColor:
                                item.id == selectectedItems
                                  ? COLORS.primary
                                  : COLORS.white,
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={
                                item?.profile_picture != null
                                  ? {
                                      uri: SITE_URL + item?.profile_picture,
                                    }
                                  : IMAGES.blankDP
                              }
                              style={styles.friendsDp}
                            />

                            <Text
                              style={{
                                color:
                                  item.id == selectectedItems
                                    ? COLORS.white
                                    : COLORS.black,
                                fontWeight: "bold",
                              }}
                            >
                              {item.first_name + " " + item.last_name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : null}
              </View>
            </>
          ) : null}

          {postOnPickerValue == "room" ? (
            <>
              <View style={{ paddingTop: getHeight(2) }}>
                {selectectedItems ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.mytext}>
                      Your {postOnPickerValue == "room" ? "Room" : ""}:{" "}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#C0C0C0",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={styles.mytext}>{showRoom()}</Text>
                      <Icon
                        name="times-circle"
                        size={17}
                        color="red"
                        style={{ marginLeft: WP(1) }}
                        onPress={() => {
                          setSelectectedItems();
                          setItems([]);
                          setShowFriendsList(true);
                          getRooms();
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.mytext, { marginVertical: 5 }]}>
                    {t("Select")} {postOnPickerValue == "room" ? t("Room") : ""}
                    :{" "}
                  </Text>
                )}

                <TextInput
                  style={styles.txtInput2}
                  require={true}
                  ref={inputRef}
                  editable={selectectedItems ? false : true}
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  onChangeText={(val) => getRooms(val)}
                  placeholder={`${t("Search")}...`}
                />
              </View>

              <View style={{ height: getHeight(43), marginTop: 10 }}>
                {showFriendsList ? (
                  <FlatList
                    keyExtractor={(item, index) => index}
                    style={{ flex: 1 }}
                    data={Items}
                    ListEmptyComponent={() =>
                      loadingFriendsList ? (
                        <View style={styles.listEmptyBox}>
                          <ActivityIndicator
                            animating={true}
                            size="large"
                            color="#DF4B38"
                          />
                        </View>
                      ) : (
                        <>
                          {Items?.length == 0 ? (
                            <View style={styles.listEmptyBox}>
                              <Text>{t("No Results")}</Text>
                            </View>
                          ) : null}
                        </>
                      )
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleOnPressFriendsItem(item)}
                          style={[
                            styles.box,
                            {
                              backgroundColor:
                                item.id == selectectedItems
                                  ? "#DF4B38"
                                  : "white",
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={
                                item?.cover_photo != null
                                  ? {
                                      uri: SITE_URL + item?.cover_photo,
                                    }
                                  : IMAGES.blankDP
                              }
                              style={styles.friendsDp}
                            />

                            <Text
                              style={{
                                color:
                                  item.id == selectectedItems
                                    ? "white"
                                    : "black",
                                fontWeight: "bold",
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : null}
              </View>
            </>
          ) : null}

          {postOnPickerValue == "group" ? (
            <>
              <View style={{ paddingTop: getHeight(2) }}>
                {selectectedItems ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.mytext}>
                      {t("Your")}{" "}
                      {postOnPickerValue == "group" ? t("Group") : ""}:{" "}
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#C0C0C0",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={styles.mytext}>{showGroup()}</Text>
                      <Icon
                        name="times-circle"
                        size={17}
                        color="red"
                        style={{ marginLeft: WP(1) }}
                        onPress={() => {
                          setSelectectedItems();
                          setItems([]);
                          setShowFriendsList(true);
                          getGroups();
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.mytext, { marginVertical: 5 }]}>
                    {t("Select")}{" "}
                    {postOnPickerValue == "group" ? t("Group") : ""}:{" "}
                  </Text>
                )}

                <TextInput
                  style={styles.txtInput2}
                  require={true}
                  ref={inputRef}
                  editable={selectectedItems ? false : true}
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  onChangeText={(val) => getGroups(val)}
                  placeholder={`${t("Search")}...`}
                />
              </View>

              <View style={{ height: getHeight(43), marginTop: 10 }}>
                {showFriendsList ? (
                  <FlatList
                    keyExtractor={(item, index) => index}
                    style={{ flex: 1 }}
                    data={Items}
                    ListEmptyComponent={() =>
                      loadingFriendsList ? (
                        <View style={styles.listEmptyBox}>
                          <ActivityIndicator
                            animating={true}
                            size="large"
                            color="#DF4B38"
                          />
                        </View>
                      ) : (
                        <>
                          {Items?.length == 0 ? (
                            <View style={styles.listEmptyBox}>
                              <Text>{t("No Results")}</Text>
                            </View>
                          ) : null}
                        </>
                      )
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleOnPressFriendsItem(item)}
                          style={[
                            styles.box,
                            {
                              backgroundColor:
                                item.id == selectectedItems
                                  ? "#DF4B38"
                                  : "white",
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={
                                item?.cover_photo != null
                                  ? {
                                      uri: SITE_URL + item?.cover_photo,
                                    }
                                  : IMAGES.blankDP
                              }
                              style={styles.friendsDp}
                            />

                            <Text
                              style={{
                                color:
                                  item.id == selectectedItems
                                    ? "white"
                                    : "black",
                                fontWeight: "bold",
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : null}
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.btnmain}>
          <Button
            buttonstyle={styles.btn}
            textstyle={styles.btnText}
            text={t("Cancel")}
            pressFunction={() => {
              post_share_text == "" && postOnPickerValue == "timeline"
                ? setShareModel(false)
                : setDiscardModalVisible(true);
            }}
          />
          <Button
            buttonstyle={
              postOnPickerValue !== "timeline" && selectectedItems == undefined
                ? styles.disbtn
                : styles.btn
            }
            textstyle={styles.btnText}
            text={t("Share")}
            pressFunction={() => SharePost()}
          />
        </View>
      </View>
      {discardModalVisible && (
        <DiscardModal
          isVisible={discardModalVisible}
          setIsVisible={setDiscardModalVisible}
          onDiscard={onPressDiscard}
          // onSave={() => goBack()}
        />
      )}
    </Modal>
  );
});

export default ShareModel;
