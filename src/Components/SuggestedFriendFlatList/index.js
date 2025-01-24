import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Platform,
} from "react-native";
import Button from "../NewButton";
import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../Constants/Colors";
import { ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import { HP, WP } from "../../../Utils/Resposive";
import { SITE_URL } from "../../Services/Constants";
import { BASE_URL } from "../../Services/Constants";
import { alignment } from "../../styles/TextAlignment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FlatListItemSeparator } from "../NewsFeedList/Functions";
import FriendPrivacySettingModal from "../FriendPrivacySettingModal";
import { handleFriendRequest } from "../../Redux/actions/ProfileActions";

const Item = ({ item, setData, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const token = useSelector((state) => state.auth.userToken);
  const timelineData = useSelector((state) => state.blackNewsF.timelineData);
  const [count, setCount] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [addFriendStats, setAddFriendStats] = useState("");
  const user = useSelector((state) => state.auth.userData);
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
    formData.append("u_id", item?.id);

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

  const connectFriendsApi = async (id) => {
    const url = `${BASE_URL}/users/connect_friends`;
    let option = {
      method: "POST",
      body: JSON.stringify({
        uid: user.id,
        do: count == false ? "friend-add" : "friend-cancel",
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
      if (!count) {
        Toast.show(t("Friend request sent successfully"), Toast.LONG);
      } else {
        Toast.show(t("Friend request cancelled successfully"), Toast.LONG);
      }

      return response;
    } else {
      return response;
    }
  };

  const userRelations = async (id) => {
    setCount(!count);
    connectFriendsApi(id);
  };

  useEffect(() => {
    if (count === true) {
      setIsModal(true);
      setAddFriendStats(t("Cancel Request"));
    } else {
      setAddFriendStats(t("Add Friend"));
    }
  }, [count]);

  return (
    <>
      <FriendPrivacySettingModal
        isModal={isModal}
        onClose={() => {
          isModal;
        }}
        setIsModal={setIsModal}
        userId={item?.id}
      />

      <View style={styles.viewContainer}>
        <View style={styles.itemContainer}>
          <FastImage source={{ uri: item.covimg }} style={styles.itemCovPic}>
            <TouchableOpacity
              style={styles.crossIconWraps}
              onPress={() => {
                deleteSuggestedFriend(item.id);
              }}
            >
              {item?.cover_picture != null ? (
                <ImageBackground
                  source={
                    item?.cover_picture != null
                      ? { uri: SITE_URL + item?.cover_picture }
                      : null
                  }
                  resizeMode="stretch"
                  style={{
                    height: 85,
                    width: WP(60),
                    justifyContent: "center",
                    alignItems: "center",
                    // marginLeft: -HP(7),
                  }}
                >
                  <View
                    style={[
                      styles.crossIconWraps,
                      { marginTop: Platform.OS === "android" ? 21 : 25 },
                    ]}
                  >
                    <Icon name="times" color={"white"} size={HP(3)} />
                  </View>
                </ImageBackground>
              ) : null}
              <Icon name="times" color={"white"} size={HP(3)} />
            </TouchableOpacity>
          </FastImage>
          <Pressable
            onPress={() => {
              navigate.navigate("ProfileScreen", { id: item.id });
              console.log(item.id);
            }}
            style={styles.ItemProfPicBox}
          >
            <FastImage
              source={
                item?.profile_picture != null
                  ? {
                      uri: SITE_URL + item?.profile_picture,
                    }
                  : require("../../Assets/images/blankDP.jpg")
              }
              style={styles.dpStyle}
            />

            <Text style={styles.itemTxt} numberOfLines={2}>
              {item.first_name + " " + item.last_name}
            </Text>
          </Pressable>
          <View
            style={{
              alignItems: "center",
              flex: 1,

              marginTop: "5%",
            }}
          >
            {item?.friendship_status == "request" ? (
              <Button
                text={"request"}
                icon={"checkmark-outline"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRemoveFriend}
              />
            ) : item?.friendship_staus == "received" ? (
              <Button
                text={"Respond"}
                icon={"person-add-sharp"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRespondRequest}
              />
            ) : item?.friendship_staus == "cancel" ? (
              <Button
                text={count == false ? "Cancel Request" : addFriendStats}
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
                text={addFriendStats == "" ? "Add Friend" : addFriendStats}
                icon={
                  addFriendStats == "" || addFriendStats == "Add Friend"
                    ? "person-add-sharp"
                    : "checkmark-outline"
                }
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={() => {
                  userRelations(item.id);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </>
  );
};

const SuggestedFriendsFlatlist = () => {
  const token = useSelector((state) => state.auth.userToken);
  const { t } = useTranslation();
  const navigate = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (getnew) => {
    const url = `${BASE_URL}/news_feed`;
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
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.payload.data.friendsSuggestions.data);
      })
      .catch((e) => {});
  };

  const onPressCross = (v) => {
    deleteSuggestedFriend(v);
  };

  return (
    <>
      {data !== undefined ? (
        <>
          <FlatListItemSeparator />
          {data?.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={styles.container}>
              <Text style={(styles.containerTxt, alignment.left)}>
                {t("People You May Know")}
              </Text>

              <FlatList
                horizontal={true}
                data={data}
                renderItem={({ item, index }) => (
                  <>
                    <Item
                      setData={setData}
                      item={item}
                      index={index}
                      onPressCross={onPressCross}
                      data={data}
                    />

                    {index == data?.length - 1 ? (
                      <Pressable
                        // style={{
                        //   justifyContent: "center",
                        //   alignItems: "center",
                        //   margin: 10,
                        // }}
                        onPress={() => {
                          navigate.navigate("FriendReq", {
                            title: "Suggestions",
                            // focusedTabIndex: 1,
                          });
                        }}
                      >
                        {/* <IconArrow name="arrowright" size={20} color={"red"} /> */}
                        {/* <Text
                      style={{
                        color: "red",
                        justifyContent: "center",
                        fontWeight: "bold",
                        alignItems: "center",
                      }}
                    >
                      See All
                    </Text> */}
                        {/* <SeeMore /> */}
                      </Pressable>
                    ) : null}
                  </>
                )}
              />

              {/* <ScrollView horizontal={true}>
          {data?.map((item, index) => {
            return (
              <>
                <Item
                  setData={setData}
                  item={item}
                  index={index}
                  onPressCross={onPressCross}
                  data={data}
                />

                {index == data.length - 1 ? (
                  //dataObject.data.length  (
                  <Pressable
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                    onPress={() => {
                      navigate.navigate("FriendReq", {
                        title: "Suggestions",
                      });
                    }}
                  >
                    <IconArrow name="arrowright" size={20} color={"red"} />
                    <Text
                      style={{
                        color: "red",
                        justifyContent: "center",
                        fontWeight: "bold",
                        alignItems: "center",
                        // borderWidth: 1,
                      }}
                    >
                      See All
                    </Text>
                  </Pressable>
                ) : null}
              </>
            );
          })}
        </ScrollView> */}

              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "red",
                }}
                onPress={() => {
                  navigate.navigate("FindFriendsModalScreen");
                }}
              >
                <Text
                  style={{
                    color: "red",
                    justifyContent: "center",
                    fontWeight: "bold",
                    // borderWidth: 1,
                    marginTop: 5,
                  }}
                >
                  {t("See All")}
                </Text>
              </Pressable>
            </View>
          )}
          <FlatListItemSeparator />
          <FlatListItemSeparator />
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: { paddingLeft: WP(2), paddingTop: WP(2) },
  container: { paddingVertical: WP(2), width: WP(100), height: HP(37) },
  containerTxt: { fontFamily: "Roboto", fontWeight: "bold", marginLeft: WP(2) },
  itemContainer: {
    height: HP(30),
    flexDirection: "column",
    width: WP(35),
    borderRadius: WP(1),
  },
  viewContainer: {
    flexDirection: "column",
    borderRadius: 10,
    margin: 5,
    backgroundColor: COLORS.white,
    height: HP(28),
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
    justifyContent: "center",
    alignItems: "center",
  },
  itemTxt: {
    fontFamily: "Roboto",
    alignItems: "center",
    fontWeight: "bold",

    padding: 5,
  },
  dpStyle: {
    height: HP(9),
    width: HP(9),
    borderRadius: HP(7),
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 5,
  },
  crossIconWraps: {
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    height: HP(4),
    width: HP(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  btn: {
    backgroundColor: "#DF4B38",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: WP(1.5),
    paddingVertical: WP(2),
    marginTop: 10,
  },
  btnText: {
    color: "white",
    paddingLeft: 5,
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    color: "white",
  },
});
export default React.memo(SuggestedFriendsFlatlist);
