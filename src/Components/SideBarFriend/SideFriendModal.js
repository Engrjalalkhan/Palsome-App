import { Text } from "native-base";
import { useTranslation } from "react-i18next";
import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { IMAGES } from "../../Constants/Images";
import FastImage from "react-native-fast-image";
import { HP, WP } from "../../../Utils/Resposive";
import { BASE_URL } from "../../Services/Constants";
import { SITE_URL } from "../../Services/Constants";
import { useNavigation } from "@react-navigation/native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SideFriendModal = ({
  item,
  isModal,
  setIsModal,
  pinedState,
  setPinedState,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.userToken);

  async function unpinFriends() {
    setPinedState("PIN");
    console.log("Un Pine friend");
    const url = `${BASE_URL}/unpin_user_friend`;
    let options = {
      method: "POST",
      body: JSON.stringify({ friend_id: item.id }),

      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let response = await fetch(url, options);
    response = await response.json();

    console.log("UNPIN Friends" + response.message);
  }

  async function pinFriends() {
    setPinedState("UNPIN");
    const formData = new FormData();
    formData.append("friend_id", item?.id);
    console.log("Un Pine friend");
    const url = `${BASE_URL}/pin_user_friend`;

    let options = {
      method: "POST",
      body: JSON.stringify({ friend_id: item.id }),

      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let response = await fetch(url, options);
    response = await response.json();

    console.log("UNPIN Friends" + response.message);
  }

  function StringLengthC(a, b) {
    let c = a + " " + b;
    let d;
    if (c.length > 25) {
      d = c.slice(0, 23) + "...";
      return d;
    } else {
      return c;
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        backdropOpacity={0.3}
        isVisible={isModal}
        onBackdropPress={() => setIsModal(false)}
        onSwipeComplete={() => setIsModal(false)}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={() => setIsModal(false)}
      >
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View>
          <View
            style={{
              backgroundColor: "white",
              flexDirection: "column",

              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderRadius: 10,
              borderColor: "white",

              margin: 5,
              paddingTop: 10,
            }}
          >
            <View>
              <ImageBackground
                source={
                  item?.cover_picture != null
                    ? { uri: SITE_URL + item?.cover_picture }
                    : { uri: SITE_URL + item?.user_picture }
                }
                resizeMode="stretch"
                style={{
                  height: 85,
                  width: WP(92),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item?.user_is_online == "1" ? (
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 10,
                        marginLeft: WP(53),
                        marginBottom: -HP(9),
                      }}
                    >
                      {t("Online")}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 10,
                        textAlign: "center",
                        marginLeft: WP(53),
                        marginBottom: -HP(11),
                      }}
                    >
                      {`${t("Last Seen")} ${"\n"}` + item?.user_last_seen}
                    </Text>
                  </View>
                )}
              </ImageBackground>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View>
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
                <View
                  style={[
                    styles.onLinePointer,
                    {
                      backgroundColor:
                        item?.user_is_online == "1" ? "green" : null,
                      position: "absolute",

                      left: WP(4),
                      bottom: HP(8),
                      height: 13,
                      width: 13,
                      borderRadius: 25,
                    },
                  ]}
                >
                  <Text></Text>
                </View>
              </View>
              <View>
                <Text
                  style={
                    ([styles.btnText],
                    { color: "black", margin: 5, marginTop: 1 })
                  }
                >
                  {StringLengthC(item?.first_name, item?.last_name)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", marginBottom: HP(2) }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProfileScreen", {
                    id: item?.id,
                  });
                  setIsModal(false);
                }}
                style={[
                  styles.btn,
                  {
                    height: HP(4.3),
                    marginRight: WP(10),
                    marginTop: HP(0.6),
                    width: WP(30),
                  },
                ]}
              >
                <Text style={styles.btnText}>{t("View Profile")}</Text>
              </TouchableOpacity>
              {item?.is_pinned ? (
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { height: HP(4.3), marginTop: HP(0.6), width: WP(30) },
                  ]}
                  onPress={() => {
                    if (pinedState == "" || pinedState == "UNPIN") {
                      unpinFriends();
                    } else {
                      pinFriends();
                    }
                  }}
                >
                  {pinedState == "" || pinedState == "UNPIN" ? (
                    <MaterialCommunityIcons
                      size={20}
                      style={[styles.iconStyle]}
                      name="pin-off"
                    />
                  ) : (
                    <SimpleLineIcons
                      size={20}
                      name="pin"
                      style={{ marginRight: 5 }}
                      color={"white"}
                    />
                  )}

                  <Text style={styles.btnText}>
                    {pinedState == "" || pinedState == "UNPIN"
                      ? t("Unpin")
                      : t("Pin")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (pinedState == "" || pinedState == "PIN") {
                      pinFriends();
                    } else {
                      unpinFriends();
                    }
                  }}
                >
                  <View
                    style={[
                      styles.btn,
                      { height: HP(4.3), marginTop: HP(0.6), width: WP(30) },
                    ]}
                  >
                    {pinedState == "" || pinedState == "PIN" ? (
                      <SimpleLineIcons
                        size={15}
                        name="pin"
                        style={{ marginRight: 5 }}
                        color={"white"}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        size={15}
                        style={[styles.iconStyle]}
                        name="pin-off"
                      />
                    )}
                    <Text style={[styles.btnText]}>
                      {pinedState == "" || pinedState == "PIN"
                        ? t("Pin")
                        : t("Unpin")}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: -30,
  },
  dpProfileStyle: {
    height: HP(12),
    width: WP(90),
    borderRadius: WP(1),
    borderWidth: 3,
    borderColor: "white",

    margin: 2,
  },
  onPinStyle: {
    height: 20,
    width: 20,
    borderRadius: 25,

    marginLeft: HP(7.5),
    marginTop: HP(6),

    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  noOfPostPointer: {
    height: 15,
    width: 15,
    borderRadius: 25,

    marginLeft: HP(7),
    marginTop: HP(1),

    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },

  btn: {
    backgroundColor: "#DF4B38",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontSize: 14,
  },
  iconStyle: {
    color: "white",
    size: 15,
    marginRight: WP(2),
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: "#EAEAEA",

    marginBottom: 5,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SideFriendModal;
