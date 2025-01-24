import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { WP, HP } from "../../../../Utils/Resposive";

import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import FastImage from "react-native-fast-image";
import { handleFriendRequest } from "../../../Redux/actions/ProfileActions";
import FriendPrivacySettingModal from "../../../Components/FriendPrivacySettingModal";
import {
  getFriendRequestList,
  setFriendRequestList,
} from "../../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../../Services/Constants";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { useTranslation } from "react-i18next";

const FriendRequestsScreen = ({
  hideheader = false,
  isFocused,
  setFocusedTabIndex,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null); // State to store the friend to be removed

  const [friends, setFriends] = useState();
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.userData);
  const friendRequestsList = useSelector(
    (state) => state.blackNewsF.friendRequestsList
  );
  // const [userName, setUserName] = useState(route.params.userName);
  const [isModal, setIsModal] = useState(false);
  const [friendId, setFriendId] = useState();
  const dispatch = useDispatch();
  const onclose = () => {
    setSearchText("");
  };

  // const mySearch = async (val) => {
  //   setSearchText(val);
  //   try {
  //     const res = await withoutStringiApiCall2({
  //       route: `timeline/${userName}/friends/search?search_friends=${val}`,
  //       verb: "GET",
  //       token: token,
  //     });

  //     if (res.responseCode !== 200) {
  //       console.log("res !== 200 in postgetFriends ... ", res);
  //     } else if (res.responseCode == 200) {
  //       setFriends(res.payload.data.friends);
  //     }
  //   } catch (e) {
  //     console.log("Post get Friend error -- ", e.toString());
  //   }
  // };

  const GetAllFriends = async () => {
    // console.log("🚀🚀🚀🚀🚀🚀🚀 FriendRequestsScreen", getFriendRequestList({ token, setIsLoading: setIsLoading, navigation }));
    dispatch(
      getFriendRequestList({ token, setIsLoading: setIsLoading, navigation })
    );
  };

  const onModalClose = () => {
    if (friendToRemove) {
      // Remove the friend from the list
      dispatch(
        setFriendRequestList(
          friendRequestsList.filter((i) => i.id !== friendToRemove.id)
        )
      );

      setFriendToRemove(null); // Reset the friendToRemove state
    }
  };
  const handleOnPressFriendRequest = (item, action) => {
    const formData = new FormData();
    if (action === "friend-accept") {
      // Store the friend to be removed in the state
      setFriendToRemove(item);
      setIsModal(true);
    } else if (action === "friend-decline") {
      setTimeout(() => {
        dispatch(
          setFriendRequestList(
            friendRequestsList.filter((i) => i.id !== item.id)
          )
        );
      }, 1000);
    }

    formData.append("uid", user.id);
    formData.append("do", action);
    formData.append("u_id", item.user_id);
    setFriendId(item.user_id);
    dispatch(
      handleFriendRequest({
        token,
        formData: formData,
        do: action,
        setIsModal: setIsModal,
        // refresh: GetAllFriends,
      })
    );
  };
  useEffect(() => {
    if (isFocused) {
      GetAllFriends();
    }
  }, [isFocused, dispatch]);
  // const currentRoute = useRoute();
  // console.log("currentRoute", currentRoute.name);
  return (
    <>
      <SafeAreaView style={styles.container}>
        {!hideheader && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {ICONS.antDesign("arrowleft", null, 35, { fontWeight: "bold" })}
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
              {t("Requests")}
            </Text>
          </View>
        )}

        <FlatList
          style={{ flex: 1 }}
          nestedScrollEnabled
          data={friendRequestsList}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          refreshing={isLoading}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => GetAllFriends()}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <>
              {isLoading ? (
                // <ActivityIndicator
                //   animating={isLoading}
                //   size="large"
                //   color=COLORS.primary
                //   // style={{ height: 300 }}
                // />
                <></>
              ) : friendRequestsList?.length == 0 ? (
                <TouchableOpacity
                  onPress={() => setFocusedTabIndex(1)}
                  style={styles.noPostsContainer}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      // marginBottom: 10,
                      textAlign: "center",
                      color: COLORS.grey,
                      // fontWeight: "bold",
                    }}
                  >
                    {t("No new requests")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      // marginBottom: 10,
                      textAlign: "center",
                      color: COLORS.grey,
                      // fontWeight: "bold",
                    }}
                  >
                    {t(
                      "When people send you friend requests, they'll appear here."
                    )}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push("ProfileScreen", {
                    id: item?.user_id,
                  });
                }}
                style={styles.placeItemView}
              >
                <FastImage
                  resizeMode="cover"
                  style={styles.logo2}
                  source={
                    item?.profile_picture
                      ? {
                          uri: SITE_URL + item.profile_picture,
                        }
                      : IMAGES.blankDP
                  }
                />
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.userNames}>
                    {item?.first_name} {item?.last_name}
                  </Text>
                  {item?.mutual_friends_count ? (
                    <Text style={{ fontSize: WP(3.2) }}>
                      {t("Mutual Friends")}: {item?.mutual_friends_count}
                    </Text>
                  ) : null}
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        handleOnPressFriendRequest(item, "friend-accept");
                      }}
                      style={[
                        styles.button,
                        {
                          marginRight: WP(5),
                          backgroundColor: COLORS.primary,
                          paddingHorizontal: 20,
                        },
                      ]}
                    >
                      <Text style={[styles.buttonText]}>{t("Confirm")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleOnPressFriendRequest(item, "friend-decline");
                      }}
                      style={[
                        styles.button,
                        {
                          backgroundColor: "#rgb(246,42,86)",
                          paddingHorizontal: 20,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.buttonText, { color: COLORS.white }]}
                      >
                        {t("Decline")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
      <FriendPrivacySettingModal
        isModal={isModal}
        setIsModal={setIsModal}
        userId={friendId}
        onClose={onModalClose} // Pass the onClose function to the modal
      />
    </>
  );
};

export default React.memo(FriendRequestsScreen);
