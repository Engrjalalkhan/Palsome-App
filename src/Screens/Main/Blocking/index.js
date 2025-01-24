import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
} from "react-native";

import { useSelector } from "react-redux";
import { HP, WP } from "../../../../Utils/Resposive";
import MyHeader from "../../../Components/MyHeader";
import { BASE_URL, SITE_URL } from "../../../Services/Constants";
import FastImage from "react-native-fast-image";

import BlockModal from "./BlockModal";
import UnBlockModal from "./UnBlockModal";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Blocking = ({ navigation }) => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const inputRef = useRef();
  const [showDropListLoader, setshowDropListLoader] = useState(false);
  const [blockedUsersLoading, setBlockedUsersLoading] = useState(false);
  const [isVisibleBlockModal, setIsVisibleBlockModal] = useState(false);
  const [isVisibleUnBlockModal, setIsVisibleUnBlockModal] = useState(false);
  const [dropListData, setDropListData] = useState([]);
  const [blockedListData, setBlockedDropListData] = useState([]);
  const [userToBlock, setuserToBlock] = useState({});
  const [userToUnBlock, setuserToUnBlock] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [disablePagination, setdisablePagination] = useState(false);
  const [blockingLoader, setBlockingLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);
  const userName = useSelector((state) => state.auth.userData.name);


  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const mySearch = async (val) => {
    setSearchText(val);
    setshowDropListLoader(true);

    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/${userName}/friends/search?search_friends=${val}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
        setshowDropListLoader(false);
      } else if (res.responseCode == 200) {
        setshowDropListLoader(false);
        console.log("res !== 200 in postgetFriends search ... ", res);

        setDropListData(res.payload.data.friends);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  const GetAllFriends = async () => {
    if (disablePagination || showDropListLoader) return; // Avoid further calls if pagination is disabled or loading

    setshowDropListLoader(true);

    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/${userData?.id}/friends?page=${currentPage}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
        setshowDropListLoader(false);
      } else if (res.responseCode === 200) {
        const newFriends = res?.payload?.data?.friends?.data;
        const lastPage = res?.payload?.data?.friends?.last_page;
        const currentPage = res?.payload?.data?.friends?.current_page;

        setDropListData((prevData) => [...prevData, ...newFriends]); // Concatenate new data
        setdisablePagination(currentPage === lastPage); // Disable if on last page
        setCurrentPage((prevPage) => prevPage + 1); // Increment page

        setshowDropListLoader(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
      setshowDropListLoader(false);
    }
  };

  const getBlockedUsers = async (setLoading) => {
    // setBlockedUsersLoading(true);
    setLoading(true);
    let res;
    try {
      let response = await fetch(`${BASE_URL}/settings/blocking`, {
        method: "GET",

        headers: {
          Accept: "application/json",

          Authorization: "Bearer " + token,
        },
      });
      if (response) {
        res = await response.json();
      }

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", response);
        setLoading(false);
      } else if (res.responseCode == 200) {
        // console.log("res == 200 in postgetFriends ... ", res.payload.data);

        setBlockedDropListData(res?.payload?.data);
        setLoading(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };
  const blockAUser = async () => {
    const formData = new FormData();
    setBlockingLoader(true);
    formData.append("id", userToBlock?.id);
    console.log(formData);
    try {
      const res = await withoutStringiApiCall2({
        route: `user/block`,
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in postgetFriends ... ", res);
        setBlockingLoader(false);
      } else if (res.responseCode == 200) {
        // console.log("res == 200 in postgetFriends ... ", res);
        setIsVisibleBlockModal(false);
        setBlockingLoader(false);

        setDropListData(
          dropListData.filter((item) => item.id !== userToBlock?.id)
        );
        getBlockedUsers(setBlockedUsersLoading);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };
  const UnblockAUser = async () => {
    const formData = new FormData();
    formData.append("id", userToUnBlock?.id);
    console.log(formData);
    try {
      const res = await withoutStringiApiCall2({
        route: `user/unblock`,
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
        // setshowDropListLoader(false);
      } else if (res.responseCode == 200) {
        console.log("res == 200 in postgetFriends ... ", res);
        setIsVisibleUnBlockModal(false);
        getBlockedUsers(setBlockedUsersLoading);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  useEffect(() => {
    getBlockedUsers(setBlockedUsersLoading);
  }, []);

  const onRefresh = React.useCallback(() => {
    getBlockedUsers(setRefreshing);
  }, []);
  const onPressCrossIcon = () => {
    setDropListData([]);
    setCurrentPage(1);
    setdisablePagination(false);
    inputRef.current.clear();
    inputRef.current.blur();
  };

  const onPressBlock = (item) => {
    console.log("it", item);
    setuserToBlock(item);
    setIsVisibleBlockModal(true);
  };
  const onPressUnBlock = (item) => {
    console.log("unblock it", item);
    setuserToUnBlock(item);
    setIsVisibleUnBlockModal(true);
  };
  const handleEndReached = () => {
    disablePagination ? null : setCurrentPage(currentPage + 1);
  };
  useEffect(() => {
    currentPage > 1 ? GetAllFriends() : null;
  }, [currentPage]);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <MyHeader
          goBack={() => navigation.goBack()}
          heading={t("Block Users")}
        />
        <View style={{ marginHorizontal: WP(4), marginBottom: HP(1) }}>
          <Text style={{ fontSize: WP(3), color: COLORS.secondary }}>
            {t(
              "Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to events or groups,start a conversation with you, or add you as a friend. Note: Does not include apps, games or groups you both participate in"
            )}
            .
          </Text>
        </View>
        <View style={styles.header}>
          <View style={styles.inputView}>
            <TextInput
              ref={inputRef}
              value={searchText}
              style={styles.input}
              placeholder={t("Search")}
              onFocus={() => GetAllFriends()}
              placeholderTextColor={COLORS.black}
              onChangeText={mySearch}
            />
            <TouchableOpacity
              onPress={() => onPressCrossIcon()}
              style={styles.iconTouch}
            >
              {ICONS.antDesign("closecircleo", COLORS.black, 23, {
                color: COLORS.red,
              })}
            </TouchableOpacity>
          </View>
          {dropListData.length > 0 && (
            <View style={styles.dropDownContainer}>
              <FlatList
                style={{ flex: 1, borderRadius: 20 }}
                keyExtractor={(result, index) => index.toString()}
                data={dropListData}
                onEndReachedThreshold={0.1}
                onEndReached={handleEndReached}
                ListEmptyComponent={
                  <ActivityIndicator
                    animating={showDropListLoader}
                    size="large"
                    color={COLORS.primary}
                    style={{ marginTop: 20 }}
                  />
                }
                ListFooterComponent={
                  <ActivityIndicator
                    animating={showDropListLoader}
                    size="large"
                    color={COLORS.primary}
                    style={{ marginTop: 20 }}
                  />
                }
                renderItem={({ item }) => {
                  return (
                    <View>
                      <View style={styles.placeItemView}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FastImage
                            resizeMode="cover"
                            style={styles.logo2}
                            source={
                              item.profile_picture
                                ? {
                                    uri: SITE_URL + item.profile_picture,
                                  }
                                : IMAGES.blankDP
                            }
                          />
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                maxWidth: WP(50),
                              }}
                            >
                              {item.first_name} {item.last_name}
                            </Text>
                            {item?.mutual_friends ? (
                              <Text>
                                {item.mutual_friends} {t("Mutual Friends")}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.blockButton}
                          onPress={() => onPressBlock(item)}
                        >
                          <Text style={styles.blocktxt}>{t("Block")}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
              {isVisibleBlockModal && (
                <BlockModal
                  isVisible={isVisibleBlockModal}
                  setIsVisibleBlockModal={setIsVisibleBlockModal}
                  userToBlock={userToBlock}
                  onConfirm={blockAUser}
                  loading={blockingLoader}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.BlockedUsersListContainer}>
          <FlatList
            keyExtractor={(result, index) => index.toString()}
            data={blockedListData}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={[COLORS.primary]}
              />
            }
            ListEmptyComponent={
              <>
                {blockedUsersLoading ? (
                  <ActivityIndicator
                    animating={blockedUsersLoading}
                    size="large"
                    color={COLORS.primary}
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  <View
                    style={{
                      marginTop: HP(20),
                      alignSelf: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        height: HP(8),
                        width: HP(8),
                        borderRadius: HP(8),
                        backgroundColor: COLORS.secondary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {ICONS.fontAwesome("group", COLORS.white, HP(5))}
                    </View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginTop: 10,
                        color: COLORS.secondary,
                      }}
                    >
                      {t("You have no blocked users to show")}
                    </Text>
                  </View>
                )}
              </>
            }
            renderItem={({ item }) => {
              return (
                <View>
                  <View style={styles.placeItemView}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FastImage
                        resizeMode="cover"
                        style={styles.logo2}
                        source={
                          item.profile_picture
                            ? {
                                uri: SITE_URL + item.profile_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            maxWidth: WP(50),
                          }}
                        >
                          {item.first_name} {item.last_name}
                        </Text>
                        {item?.mutual_friends ? (
                          <Text>
                            {item.mutual_friends} {t("Mutual Friends")}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.blockButton}
                      onPress={() => onPressUnBlock(item)}
                    >
                      <Text style={styles.blocktxt}>{t("Unblock")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          {isVisibleUnBlockModal && (
            <UnBlockModal
              isVisible={isVisibleUnBlockModal}
              setIsVisibleUnBlockModal={setIsVisibleUnBlockModal}
              onUnblock={UnblockAUser}
              userToUnBlock={userToUnBlock}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  inputView: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
  },
  input: {
    height: 40,
    paddingLeft: 15,
    width: WP(85),
  },
  iconTouch: {
    justifyContent: "center",
    alignSelf: "center",
    paddingRight: WP(2),
    color: COLORS.red,
  },
  placeItemView: {
    padding: 10,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  logo2: {
    marginHorizontal: WP(3),
    // marginBottom: HP(1),
    width: WP(10),
    height: WP(10),
    borderRadius: 20,
  },
  dropDownContainer: {
    maxHeight: HP(35),
    width: "93%",
    backgroundColor: COLORS.white,
    position: "absolute",
    alignSelf: "center",
    top: 40,
    // top: Platform.OS == "android" ? WP(27) : HP(26),
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: COLORS.primary,
    zIndex: 100,
  },
  blockButton: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: WP(2),
    borderRadius: 5,
    paddingVertical: WP(2),
  },
  blocktxt: { color: COLORS.white, fontWeight: "bold" },
  BlockedUsersListContainer: { flex: 1, zIndex: -100 },
});

export default Blocking;
