import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import FastImage from "react-native-fast-image";
import { HP, WP } from "../../../Utils/Resposive";
import { FlatListItemSeparator } from "../NewsFeedList/Functions";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../NewButton";
import { useDispatch, useSelector } from "react-redux";
import { handleFriendRequest } from "../../Redux/actions/ProfileActions";
import { SITE_URL } from "../../Services/Constants";
import IconArrow from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FriendPrivacySettingModal from "../FriendPrivacySettingModal";
import { BASE_URL, dataRaw } from "../../Services/Constants";
import { ToastAndroid } from "react-native";

const Item11 = ({ item, setData, data }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.userToken);
  const timelineData = useSelector((state) => state.blackNewsF.timelineData);
  const navigate = useNavigation();
  const [isModal, setIsModal] = useState(false);
  const dispatch = useDispatch();
  const [addFriendStats, setAddFriendStats] = useState("");
  const user = useSelector((state) => state.auth.userData);
  const [myTimelineData, setMyTimeLineData] = useState([]);
  const [count, setCount] = useState(false);

  useEffect(() => {
    if (timelineData) {
      setMyTimeLineData(timelineData);
    }
  }, [timelineData]);

  // useEffect(() => {
  //   "isShow" in item ? null : (item.isShow = true);

  //   console.log("friend======>" + item);
  // }, []);

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
    // item.isShow = false;
    // try {
    //   const url = `${BASE_URL}/friends/suggestions/${id}/remove`;
    //   // let options = Object.assign(
    //   //   { method: "POST" }
    //   //   // params ? { body: JSON.stringify(params) } : null
    //   // );
    //   let option = {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   };
    //   // options.headers = {
    //   //   Accept: "application/json",
    //   //   "Content-Type": "application/json",
    //   //   Authorization: "Bearer " + token,
    //   // };
    //   let response = await fetch(url, option);
    //   if (response) {
    //     response = await response.json();
    //     item.isShow = false;
    //     ToastAndroid.show(response.message, ToastAndroid.SHORT);
    //     return response;
    //   } else {
    //     return response;
    //   }
    // } catch (e) {
    //   return e.toString();
    // }
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
      setAddFriendStats("Cancel Request");
    } else {
      setAddFriendStats("Add Friend");
    }
    try {
      const url = `${BASE_URL}/users/connect_friends`;
      // let options = Object.assign(
      //   { method: "POST" }
      //   // params ? { body: JSON.stringify(params) } : null
      // );

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
      // options.headers = {
      //   Accept: "application/json",
      //   "Content-Type": "application/json",
      //   Authorization: "Bearer " + token,
      // };

      let response = await fetch(url, option);
      if (response) {
        response = await response.json();
        if (count == true) {
          ToastAndroid.show(t("Friend Request Sent"), ToastAndroid.SHORT);
        }
        // response.message

        return response;
      } else {
        return response;
      }
    } catch (e) {
      return e.toString();
    }
  };

  return (
    <>
      <FriendPrivacySettingModal
        isModal={isModal}
        setIsModal={setIsModal}
        onClose={() => {
          isModal;
        }}
        // userId={item?.user?.user_id}
        userId={item?.id}
      />

      {/* {item?.isShow == true ? ( */}
      <View
        style={{
          // display: isSh == true ? "flex" : "none",
          flexDirection: "column",
          // borderWidth: 0.3,
          borderRadius: 10,
          margin: 5,
          backgroundColor: "white",
          height: HP(28),
          elevation: 20,
          // shadowColor: "green",
          shadowColor: "#171717",
          shadowOffset: { width: -4, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 3,

          // padding: 5,
        }}
      >
        {/* <Text style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 5 }}>
          Suggested Friends
        </Text> */}

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
                  <View style={styles.crossIconWraps}>
                    <Icon name="times" color={"white"} size={HP(3)} />
                  </View>
                </ImageBackground>
              ) : null}
              <Icon name="times" color={"white"} size={HP(3)} />
            </TouchableOpacity>
          </FastImage>
          <Pressable
            onPress={() => {
              navigate.navigate("ProfileScreen", { userName: item.name });
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
            {/* <View
              style={{ flexDirection: "row", alignItems: "center", margin: 5 }}
            > */}
            <Text style={styles.itemTxt} numberOfLines={2}>
              {item.first_name + " " + item.last_name}
            </Text>
            {/* </View> */}
          </Pressable>
          <View
            style={{
              alignItems: "center",
              flex: 1,

              marginTop: "5%",
            }}
          >
            {/* <Button
              text={"Add Freind"}
              buttonstyle={styles.btn}
              textstyle={styles.btnText}
              icon={"person-add-sharp"}
              iconStyle={styles.iconStyle}
              pressFunction={() => {
                alert("Some thing wrong, plz try sometime later ");
              }}
            /> */}

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
                  // handleOnPressFriendRequest({
                  //   do: "friend-cancel",
                  // });
                  if (item?.friendship_staus == "cancel") {
                    setCount(true);
                  }
                  // setCount(true);
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
                  // handleOnPressFriendRequest({
                  //   do: "friend-add",
                  // });
                  userRelations(item.id);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
      {/* ) : null} */}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: { paddingLeft: WP(2), paddingTop: WP(2) },
  container: { paddingVertical: WP(2) },
  containerTxt: { fontFamily: "Roboto", fontWeight: "bold", marginLeft: WP(2) },
  itemContainer: {
    height: HP(30),
    flexDirection: "column",
    width: WP(35),
    // height: 200,
    // backgroundColor: "white",
    // borderWidth: 0.1,
    // margin: 5,

    // marginRight: WP(2),
    borderRadius: WP(1),
  },
  seeAll_p: {
    justifyContent: "center",
    alignItems: "center",
  },

  seeallT: {
    color: "red",
    justifyContent: "center",
    fontWeight: "bold",
  },
  itemCovPic: {
    height: "22%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",

    alignItems: "flex-end",
    padding: WP(1),
    // margin: WP(1),
    borderRadius: 10,
  },
  ItemProfPicBox: {
    // backgroundColor: "green",
    height: "50%",
    marginTop: "-15%",
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft: 5,
  },
  itemTxt: {
    fontFamily: "Roboto",
    alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
    fontWeight: "bold",
    // borderWidth: 1,
    padding: 5,
  },
  dpStyle: {
    height: HP(9),
    width: HP(9),
    borderRadius: HP(7),
    borderWidth: 3,
    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: "center",
    borderColor: "white",
    marginBottom: 5,
    // marginLeft: 20,
  },
  crossIconWraps: {
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    // backgroundColor: "green",
    height: HP(4),
    width: HP(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginTop: 5,
  },
  btn: {
    // width: getWidth(35),
    // height: getHeight(5),
    backgroundColor: "#DF4B38",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // alignContent: "center",
    borderRadius: 5,
    paddingHorizontal: WP(1),
    paddingVertical: WP(2),
    marginTop: 10,
    // borderWidth: 1,
  },
  btnText: {
    color: "white",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    color: "white",
    // fontSize: 18,
    // marginRight: WP(1),
  },
});
export default React.memo(Item11);
