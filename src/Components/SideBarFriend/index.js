import { Text } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { HP, WP } from "../../../Utils/Resposive";
import { BASE_URL } from "../../Services/Constants";
import { IMAGES } from "../../Constants/Images";
import { SITE_URL } from "../../Services/Constants";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { FlatListItemSeparator } from "../NewsFeedList/Functions";
import SideFriendModal from "./SideFriendModal";
import { setSideBarFriendList } from "../../Redux/actions/NewsFeedActions";
import Practice from "../../Services/Socket_Io/practice";
import { COLORS } from "../../Constants/Colors";
import Entypo from "react-native-vector-icons/Entypo";
import { useWebSocket } from "../../socket";

const SideBarFriend = () => {
  const socket = useWebSocket();
  const userId = useSelector((state) => state?.auth?.userData?.id);

  const [onlineFriends, setOnlineFriends] = useState([]);

  global.channel = userId ? socket.join(`Palsome.User.${userId}`) : null;
  const sideBarChannel = useMemo(
    () => socket.private(`users.${userId}.sidebar.friends`),
    [userId, socket]
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const [pinedState, setPinedState] = useState("");
  const token = useSelector((state) => state?.auth?.userToken);
  const idd = useSelector((state) => state?.auth?.userData?.id);
  const Side_friend = useSelector((state) => state?.newsF?.sideBarFriendList);
  const [item, setItem] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const url = `${BASE_URL}/news_feed?`;
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
        dispatch(
          setSideBarFriendList(responseJson?.payload?.data?.sidebar_friends)
        );

        const sidebarfreind = [...responseJson?.payload?.data?.sidebar_friends];
        let sortedarr = [];
        let onlinePined = [];
        let online = [];
        let pined = [];
        let ofline = [];
        const data = sidebarfreind.fillter((obj) => {
          if (obj.user_is_online == "1" && obj.is_pinned == true) {
            onlinePined.push(obj);
          } else if (obj.user_is_online == "1" && obj.is_pinned != true) {
            online.push(obj);
          } else if (obj.user_is_online == "0" && obj.is_pinned == true) {
            pined.push(obj);
          } else if (obj.user_is_online == "0" && obj.is_pinned != true) {
            ofline.push(obj);
          }
          return [...onlinePined, ...online, ...pined, ...ofline];
        });
        sortedarr = [...onlinePined, ...online, ...pined, ...ofline];

        if (sortedarr) {
          setData(sortedarr);
        }
      })
      .catch((e) => {});
  };

  // const userStatusChangeSocket = () => {
  //   channel.listen(".user.status.updated", (msg) => {
  //     setOnlineFriends((prevState) => {
  //       let list = [...prevState];
  //       let ind = list.findIndex((el) => el?.id == msg?.user?.id);

  //       if (ind >= 0) {
  //         list.splice(ind, 1);
  //       } else {
  //         list.push(msg?.user);
  //       }

  //       return list;
  //     });
  //   });
  // };

  useEffect(() => {
    getData();
    sideBarChannel.listen(".update.sidebar.friends", (msg) => {
      dispatch(setSideBarFriendList(msg?.sidebarFriends));
    });

    return () => {
      sideBarChannel.stopListening(".update.sidebar.friends");
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={Side_friend || []}
        horizontal
        contentContainerStyle={styles.contentContainerStyle}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProfileScreen", { id: item.id });
            }}
            onLongPress={() => {
              setItem(item);
              setIsModal(true);
              setPinedState("");
            }}
          >
            <FastImage
              source={
                item?.profile_picture != null
                  ? {
                      uri: SITE_URL + item?.profile_picture,
                    }
                  : IMAGES.blankDP
              }
              style={styles.dpStyle}
            />

            {item?.is_pinned ? (
              <View
                style={[
                  styles.onPinStyle,
                  {
                    color: "black",
                  },
                ]}
              >
                <Entypo
                  size={15}
                  style={[
                    styles.iconStyle,
                    {
                      color: COLORS.grey,
                      padding: -2,
                    },
                  ]}
                  name="pin"
                />
              </View>
            ) : null}

            <View
              style={[
                styles.onLinePointer,
                {
                  backgroundColor:
                    item?.user_online_status == "1" ? "green" : null,
                },
              ]}
            >
              <Text></Text>
            </View>
            {item?.post_seen_count ? (
              <View
                style={[
                  styles.noOfPostPointer,
                  {
                    backgroundColor:
                      item?.post_seen_count != 0 ? "#ff5e3a" : null,
                    height: item?.post_seen_count > 98 ? 20 : 15,
                    width: item?.post_seen_count > 98 ? 25 : 15,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {item?.post_seen_count > 98 ? "99+" : item?.post_seen_count}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      />
      <View>
        <SideFriendModal
          item={item}
          isModal={isModal}
          setIsModal={setIsModal}
          pinedState={pinedState}
          setPinedState={setPinedState}
          getData={getData}
        />
      </View>
      <FlatListItemSeparator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  contentContainerStyle: { paddingLeft: WP(2), paddingTop: WP(2) },
  dpStyle: {
    position: "relative",
    height: HP(9),
    width: HP(9),
    borderRadius: HP(7),
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 5,
    margin: 2,
    // marginTop: -30,
  },
  dpProfileStyle: {
    // position: "relative",
    height: HP(12),
    width: WP(90),
    borderRadius: WP(1),
    borderWidth: 3,
    borderColor: "white",
    // marginBottom: 5,
    margin: 2,
  },
  onPinStyle: {
    height: 20,
    width: 20,
    borderRadius: 25,
    // margin: 45,
    marginLeft: HP(7.5),
    marginTop: HP(6),

    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  onLinePointer: {
    height: 10,
    width: 10,
    borderRadius: 25,
    // margin: 45,
    margin: HP(1),
    position: "absolute",
  },
  noOfPostPointer: {
    height: 15,
    width: 15,
    borderRadius: 25,
    // margin: 45,
    marginLeft: HP(7),
    marginTop: HP(1),

    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1,
  },
  btn: {
    // width: getWidth(35),
    // height: getHeight(5),
    backgroundColor: "#DF4B38",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: WP(1),
    paddingVertical: WP(2),
  },
  btnText: {
    color: "white",
    fontSize: 14,
  },
  iconStyle: {
    color: "white",
    // size: 15,
    marginRight: WP(2),
  },
});
export default React.memo(SideBarFriend);
