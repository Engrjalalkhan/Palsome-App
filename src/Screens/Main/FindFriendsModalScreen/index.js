import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Button from "../../../Components/NewButton";
import FriendPrivacySettingModal from "../../../Components/FriendPrivacySettingModal";

import { HP, WP } from "../../../../Utils/Resposive";
import { BASE_URL, SITE_URL } from "../../../Services/Constants";
import { handleFriendRequest } from "../../../Redux/actions/ProfileActions";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import { isRTL } from "../../../../Utils/IsRTL";

//setData, data
const Item = ({ item, index, onPressCross, setData, data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);
  const timelineData = useSelector((state) => state.blackNewsF.timelineData);

  const [count, setCount] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [addFriendStats, setAddFriendStats] = useState("");
  const [myTimelineData, setMyTimeLineData] = useState([]);

  useEffect(() => {
    if (timelineData) {
      setMyTimeLineData(timelineData);
    }
  }, [timelineData]);

  useEffect(() => {
    setMyTimeLineData(item);
  }, [timelineData]);

  const handleOnPressFriendRequest = (props) => {
    const formData = new FormData();
    formData.append("uid", user.id);
    formData.append("do", props.do);
    formData.append("u_id", myTimelineData[0]?.user?.user_id);

    dispatch(
      handleFriendRequest({
        token,
        formData: formData,
        do: props.do,
        setIsModal: setIsModal,
      })
    );
  };

  const deleteSuggestedFriend = async (id) => {
    let arr = [];
    data.filter((obj) => {
      if (obj.id != id) {
        arr.push(obj);
      }
    });
    setData(arr);
  };

  const handleRemoveFriend = () => {
    Alert.alert(
      t("Are you sure?"),
      `${t("You want to unfriend")} ${timelineData?.user?.first_name}`,
      [
        {
          text: t("Unfriend"),
          onPress: () =>
            handleOnPressFriendRequest({
              do: "friend-remove",
            }),
        },
        {
          text: t("Cancel"),
          onPress: () => console.log("cancelled"),
        },
      ]
    );
  };

  const handleRespondRequest = () => {
    Alert.alert(
      `${t("Respond to")} ${myTimelineData?.[0]?.user?.first_name}s ${t(
        "request"
      )}`,
      "",
      [
        {
          text: t("Accept"),
          onPress: () => {
            handleOnPressFriendRequest({
              do: "friend-accept",
            });
          },
        },
        {
          text: t("Decline"),
          onPress: () =>
            handleOnPressFriendRequest({
              do: "friend-decline",
            }),
        },
      ]
    );
  };

  const userRelations = async (id) => {
    setCount(!count);
    if (count == true) {
      setIsModal(true);
      setAddFriendStats(t("Cancel Request"));
    } else {
      setAddFriendStats(t("Add Friend"));
    }
    try {
      const url = `${BASE_URL}/users/connect_friends`;

      let option = {
        method: "POST",
        body: JSON.stringify({
          uid: user.id,
          do: count == true ? "friend-add" : "friend-cancel",
          u_id: id,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      let response = await fetch(url, option);
      if (response) {
        response = await response.json();
        if (count == true) {
          Toast.show(t("Friend Request Sent"), Toast.SHORT);
        } else {
          Toast.show(t("Friend request cancelled successfully"), Toast.SHORT);
        }

        return response;
      } else {
        return response;
      }
    } catch (e) {
      return e.toString();
    }
  };

  return (
    <SafeAreaView>
      <FriendPrivacySettingModal
        isModal={isModal}
        setIsModal={setIsModal}
        onClose={() => {
          isModal;
        }}
        userId={item?.id}
      />

      <View style={styles.viewContainer}>
        <TouchableOpacity
          onPress={() => {
            navigate.push("ProfileScreen", { id: item.id });
            console.log(item.id);
          }}
          style={styles.itemContainer}
        >
          <View
            style={{
              flexDirection: "row",
              paddingLeft: 20,
              paddingVertical: 5,
            }}
          >
            <FastImage
              source={
                item?.profile_picture != null
                  ? {
                      uri: SITE_URL + item?.profile_picture,
                    }
                  : require("../../../Assets/images/blankDP.jpg")
              }
              style={styles.dpStyle}
            />

            <Text style={styles.itemTxt} numberOfLines={2}>
              {item.first_name + " " + item.last_name}
            </Text>
          </View>

          <View>
            {item?.friendship_staus == "request" ? (
              <Button
                text={t("request")}
                icon={"checkmark-outline"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRemoveFriend}
              />
            ) : item?.friendship_staus == "received" ? (
              <Button
                text={t("Respond")}
                icon={"person-add-sharp"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRespondRequest}
              />
            ) : item?.friendship_staus == "cancel" ? (
              <Button
                text={count == false ? t("Cancel Request") : addFriendStats}
                icon={count == false ? "arrow-forward" : "person-add-sharp"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={() => {
                  if (item?.friendship_staus == "cancel") {
                    setCount(true);
                  }

                  userRelations(item.id);
                }}
              />
            ) : item.friendship_staus == "add" ? (
              <Button
                text={addFriendStats == "" ? t("Add Friend") : addFriendStats}
                icon={
                  addFriendStats == "" || addFriendStats == t("Add Friend")
                    ? "person-add-sharp"
                    : "checkmark-outline"
                }
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={() => userRelations(item.id)}
              />
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  marginRight: WP(5),
                  backgroundColor: COLORS.lightGray,
                  paddingHorizontal: 20,
                },
              ]}
              onPress={() => deleteSuggestedFriend(item.id)}
            >
              <Text style={styles.buttonText}>{t("Remove")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SuggestedFriendsFlatlist = ({ backArrow }) => {
  const navigate = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState(null);
  const [lastpage, setLastpage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageLoading, setNextPageLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [page]);

  const fetchUsers = () => {
    setPage(1);
    setOrder(null);
    setRefreshing(true);
    getData();
    setRefreshing(false);
  };

  const getData = async () => {
    const url = order
      ? `${BASE_URL}/friends/suggestions?page=${page}&_order=${order}`
      : `${BASE_URL}/friends/suggestions?page=${page}`;

    let options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    await fetch(url, options)
      .then((response) => response?.json())
      .then((responseJson) => {
        setNextPageLoading(false);
        setOrder(responseJson?.payload?.data?._order);
        setLastpage(responseJson?.payload?.data?.friendsSuggestions?.last_page);

        if (page == 1)
          setData(responseJson?.payload?.data?.friendsSuggestions?.data);
        else
          setData((prevState) => [
            ...prevState,
            ...responseJson?.payload?.data?.friendsSuggestions?.data,
          ]);
      })
      .catch((e) => {});
    setIsLoading(false);
  };

  const handleEndReached = () => {
    if (page < lastpage && nextPageLoading == false) {
      setNextPageLoading(true);
      setPage((prevState) => prevState + 1);
    }
  };

  const onPressCross = (v) => {
    deleteSuggestedFriend(v);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color={COLORS.primary}
        />
      ) : data?.length == 0 || data?.length > 0 ? (
        <View style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            {!backArrow && (
              <TouchableOpacity
                onPress={() => navigate.goBack()}
                style={{
                  width: 80,
                  marginLeft: 5,
                }}
              >
                {ICONS.antDesign(
                  isRTL ? "arrowright" : "arrowleft",
                  null,
                  35,
                  styles.headerIcon
                )}
              </TouchableOpacity>
            )}
          </View>

          {data?.length === 0 && (
            <TouchableOpacity style={styles.noPostsContainer}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  color: COLORS.grey,
                }}
              >
                {t("No more suggestions")}
              </Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={data}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.8}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
                refreshing={refreshing}
                onRefresh={fetchUsers}
              />
            }
            renderItem={({ item, index }) => (
              <Item
                setData={setData}
                item={item}
                index={index}
                onPressCross={onPressCross}
                data={data}
              />
            )}
            ListFooterComponent={() =>
              nextPageLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : null
            }
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default React.memo(SuggestedFriendsFlatlist);

const styles = StyleSheet.create({
  contentContainerStyle: { paddingLeft: WP(2), paddingTop: WP(2) },

  container: { flex: 1 },
  containerTxt: { fontFamily: "Roboto", fontWeight: "bold", marginLeft: WP(2) },
  itemContainer: {
    width: WP(100),
    borderRadius: WP(1),
  },
  noPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 10,
    padding: 10,
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

  suggestionTextContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: "bold",
  },
  viewContainer: {
    flexDirection: "column",
    borderRadius: 10,
    margin: 5,
    backgroundColor: COLORS.white,
    height: HP(14),
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -4, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemCovPic: {
    height: "22%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",

    alignItems: "flex-end",
    padding: WP(1),
    borderRadius: 10,
  },
  ItemProfPicBox: {
    height: "50%",
    marginTop: "-15%",
    paddingTop: 90,
  },
  itemTxt: {
    fontFamily: "Roboto",
    alignItems: "center",
    fontWeight: "bold",
    padding: 10,
    marginTop: 5,
  },
  dpStyle: {
    height: HP(12),
    width: HP(12),
    borderRadius: HP(7),
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 5,
    paddingTop: 10,
  },
  crossIconWraps: {
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    height: HP(4),
    width: HP(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginTop: 5,
  },
  btn: {
    backgroundColor: "#DF4B38",
    width: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: WP(1),
    paddingVertical: WP(2),
    marginTop: -55,
    alignSelf: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
  },
  iconStyle: {
    color: "white",
  },
  button: {
    paddingHorizontal: isRTL ? 0 : WP(3.5),
    paddingVertical: isRTL ? 0 : WP(1.5),
    marginTop: isRTL ? -38 : -32,
    alignSelf: "flex-end",
    borderRadius: WP(1),
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    height: isRTL ? 36 : null,
  },
  buttonText: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
