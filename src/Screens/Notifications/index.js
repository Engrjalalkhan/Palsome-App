import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import { BackHandler, Platform, View } from "react-native";

import { Divider } from "react-native-paper";
import { BASE_URL } from "../../Services/Constants";
import { postStatusApiCall } from "../../Services/Apis";
import NotificationComponent from "../../Components/NotificationsItem";
import {
  fetchNewsFeed,
  setNumOfNots,
} from "../../Redux/actions/NewsFeedActions";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const Notifications = ({ route }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const fromSplash = route?.params?.fromSplash;

  const newsFeedData = useSelector((state) => state.newsF.newsFeedData);
  const token = useSelector((state) => state.auth.userToken);
  const numOfNots = useSelector((state) => state.newsF.numOfNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [pagingLoader, setPagingLoader] = useState(false);
  const [notsPaginationNumber, setNotsPaginationNumber] = useState(10);
  const [paginationEnable, setPaginationEnable] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [viewd, setViewd] = useState(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    const navListener =
      Platform.OS == "ios"
        ? navigation.addListener("blur", (e) => {})
        : navigation.addListener("gestureEnd", () => {
            handleBack();
            return true;
          });

    return () => {
      backhandler.remove();
      handleBack();

      navListener();
    };
  }, []);

  const handleBack = () => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    }
  };

  function notificationsApiCall() {
    dispatch(
      fetchNewsFeed({
        token,
        notsPaginationNumber,
        setPagingLoader,
        setPaginationEnable,
        navigation,
      })
    );
  }

  const getData = async () => {
    let url;
    url = `${BASE_URL}/news_feed?page=${1}`;
    let options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    try {
      const response = await fetch(url, options);
      const responseJson = await response.json();
      if (responseJson?.responseCode == 200) {
        dispatch(
          setNumOfNots(responseJson?.payload?.data?.unread_notification_count)
        );
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getNotifications = useCallback(() => {
    const myNots = newsFeedData;
    // console.log("my nots", myNots);
    setNotifications(myNots);
  }, [notifications, newsFeedData]);

  useEffect(() => {
    notificationsApiCall();
  }, []);
  useEffect(() => {
    // console.log("useeff", notsPaginationNumber);
    notificationsApiCall();
  }, [notsPaginationNumber]);

  useEffect(() => {
    getNotifications();
  }, [notifications, newsFeedData]);

  // useEffect(() => {
  //   notifications.length && !viewd
  //     ? dispatch(setNumOfNots(notifications.filter((i) => i.seen == 0).length))
  //     : null;
  // }, [notifications]);

  const onRefresh = () => {
    setRefreshing(true);
    notificationsApiCall();
    getNotifications();
    setRefreshing(false);
  };

  const resetNotifications = async () => {
    const formData = new FormData();
    formData.append("reset", "notifications");
    try {
      const res = await postStatusApiCall({
        route: "data/reset",
        verb: "POST",
        token: token,
        body: formData,
      });
    } catch (e) {
      console.log("saga post status error -- ", e.toString());
    }
  };

  useEffect(() => {
    if (viewd === 1) {
      resetNotifications();
    }
  }, [viewd]);

  useEffect(() => {
    // isFocused ? (numOfNots > 0 ? dispatch(setNumOfNots(0)) : null) : null;
    viewd === 0 ? (isFocused ? setViewd(1) : null) : null;
  }, [isFocused]);
  useEffect(() => {
    viewd === 0
      ? console.log("viewd changed", viewd)
      : numOfNots > 0
      ? dispatch(setNumOfNots(0))
      : null;
  }, [viewd]);
  // console.log("all nots", notifications);
  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.header1}>
          <Text style={styles.text1}>{t("Notifications")}</Text>
        </View>
        <Divider />
      </>
      <View style={{ flex: 1 }}>
        <NotificationComponent
          data={notifications}
          refreshing={refreshing}
          onRefresh={onRefresh}
          setNotsPaginationNumber={setNotsPaginationNumber}
          notsPaginationNumber={notsPaginationNumber}
          pagingLoader={pagingLoader}
          paginationEnable={paginationEnable}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  read: {
    fontWeight: "bold",
    justifyContent: "center",

    fontSize: 13,
  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  text1: { fontSize: 24, fontWeight: "bold" },
});

export default Notifications;
