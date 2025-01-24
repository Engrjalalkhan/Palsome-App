import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import styles from "./styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import FindFriendsModalScreen from "../Main/FindFriendsModalScreen";
import FriendRequestsScreen from "../Main/FriendRequestsScreen";
import AllFriendModalScreen from "../Main/AllFriendModalScreen";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import {
  getFriendRequestList,
  setFriendRequestNumber,
} from "../../Redux/actions/NewsFeedActions";
import { COLORS } from "../../Constants/Colors";
import SuggestedFriendsFlatlist from "../../Components/SuggestedFriendFlatList";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

const FriendReq = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // const params = JSON.parse(JSON.stringify(route)).params;
  // const initialTabIndex = params?.initialTabIndex;
  const token = useSelector((state) => state.auth.userToken);
  const friendRequestsNumber = useSelector(
    (state) => state.blackNewsF.friendRequestsNumber
  );
  const dispatch = useDispatch();
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  useEffect(() => {
    dispatch(getFriendRequestList({ token, setNumOfReq: true }));
  }, []);

  const tabNames = [
    { title: t("Friend Requests") },
    { title: t("Suggestions") },
    { title: t("Your Friends") },
  ];
  const userData = useSelector((state) => state.auth.userData);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      friendRequestsNumber > 0 ? dispatch(setFriendRequestNumber(0)) : null;
    }
  }, [isFocused]);
  const scRef = useRef(null);
  const labelStyle = (index) => {
    return {
      fontWeight: "bold",
      color: index === focusedTabIndex ? COLORS.white : COLORS.black,
    };
  };
  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.primary : COLORS.tooLightGrey,
    };
  };
  const setSearchEnable = () => {
    navigation.navigate("SearchComponent");
  };

  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.header1}>
          <Text style={styles.text1}>{tabNames[focusedTabIndex]?.title}</Text>
          <TouchableOpacity
            onPress={() => {
              setSearchEnable();
            }}
          >
            <Ionicons
              name="search-sharp"
              size={25}
              style={[styles.logo, { color: COLORS.black }]}
            />
          </TouchableOpacity>
        </View>
        <Divider />
      </>
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scRef}
        >
          {tabNames.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFocusedTabIndex(index);
                index == 2
                  ? scRef.current.scrollToEnd()
                  : scRef.current.scrollTo({ x: 0 });
              }}
              style={[styles.tabBullet, tabBulletStyle(index)]}
            >
              <Text style={labelStyle(index)}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        {focusedTabIndex == 0 ? (
          <FriendRequestsScreen
            hideheader
            isFocused={isFocused}
            setFocusedTabIndex={setFocusedTabIndex}
          />
        ) : focusedTabIndex == 1 ? (
          <FindFriendsModalScreen hideheader backArrow />
        ) : (
          <AllFriendModalScreen
            route={{ params: { id: userData?.id } }}
            hideheader
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FriendReq;
