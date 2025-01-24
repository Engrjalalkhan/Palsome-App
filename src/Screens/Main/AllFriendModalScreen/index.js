import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../../Services/Constants";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../../../Utils/IsRTL";

const AllFriendModalScreen = ({ route, hideheader }) => {
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  const [userId, setUserId] = useState(route.params.id);
  console.log("setUserId" + userId);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedAllFriends, setLoadedAllFriends] = useState(false);

  const onclose = () => {
    setSearchText("");
  };

  const mySearch = async (val) => {
    setSearchText(val);
    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/${userId}/friends/search?search_friends=${val}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
      } else if (res.responseCode == 200) {
        setFriends(res.payload.data.friends);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  const GetAllFriends = async () => {
    setloading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/${userId}/friends?page=${currentPage}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);

        setloading(false);
      } else if (res.responseCode == 200) {
        if (
          res.payload.data.friends.current_page <=
          res.payload.data.friends.last_page
        ) {
          setFriends(friends.concat(res.payload.data.friends.data));

          setCurrentPage(currentPage + 1);
        } else {
          setLoadedAllFriends(true);
        }

        setloading(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };

  const onEndReached = () => {
    loadedAllFriends ? null : GetAllFriends();
  };

  useEffect(() => {
    GetAllFriends();
  }, []);
  const currentRoute = useRoute()?.name;
  // console.log("currentRoute", currentRoute);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!hideheader && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {ICONS.antDesign(isRTL ? "arrowright" : "arrowleft", null, 35, {
              fontWeight: "bold",
            })}
          </TouchableOpacity>
        )}
        {/* <View style={styles.inputView}>
          <TextInput
            value={searchText}
            style={styles.input}
            placeholder="Search"
            onChangeText={(val) => mySearch(val)}
          />
          <TouchableOpacity onPress={() => onclose()} style={styles.iconTouch}>
            {ICONS.antDesign("closecircleo", COLORS.black, 23, {
              color: "red",
            })}
          </TouchableOpacity>
        </View> */}
      </View>

      <FlatList
        style={{ flex: 1 }}
        nestedScrollEnabled
        data={friends}
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => GetAllFriends()}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        ListFooterComponent={
          <>
            {friends.length ? (
              <ActivityIndicator
                animating={loading}
                size="large"
                color={COLORS.primary}
                // style={{ height: 300 }}
              />
            ) : (
              <View
              // style={{ height: 300, width: 100, backgroundColor: "red" }}
              ></View>
            )}
          </>
        }
        ListEmptyComponent={
          <>
            {loading ? (
              <View style={styles.loaderStyle}>
                <ActivityIndicator size={"large"} color={COLORS.primary} />
              </View>
            ) : friends?.length == 0 ? (
              <View style={styles.noPostsContainer}>
                <Text style={{ fontSize: 23, color: "Gray" }}>
                  {t("No friends yet")}
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.push(
                  currentRoute === "AllFriendModalScreenSettings"
                    ? "ProfileScreenSettings"
                    : "ProfileScreen",
                  {
                    id: item.id,
                  }
                );
              }}
            >
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
                      }}
                    >
                      {item.first_name} {item.last_name}
                    </Text>
                    {item.mutual_friends > 0 ? (
                      <Text style={{ textAlign: "left" }}>
                        {item.mutual_friends} {t("Mutual Friends")}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {ICONS.antDesign(isRTL ? "arrowleft" : "arrowright", null, 25, {
                  fontWeight: "bold",
                  alignSelf: "center",
                  paddingRight: 10,
                })}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default AllFriendModalScreen;
