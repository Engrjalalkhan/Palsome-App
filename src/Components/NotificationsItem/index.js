import { useTranslation } from "react-i18next";
import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { HP, WP } from "../../../Utils/Resposive";
import { Styles } from "./styles";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";

import messaging from "@react-native-firebase/messaging";

import { useNavigation } from "@react-navigation/core";
import FastImage from "react-native-fast-image";
import { timeDifference } from "../NewsFeedList/Functions";
import { postStatusApiCall, withoutStringiApiCall2 } from "../../Services/Apis";
import styles from "../NewsFeedList/styles";
import { useScrollToTop, useIsFocused } from "@react-navigation/native";
import { BASE_URL, SITE_URL } from "../../Services/Constants";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import EditDeleteModal from "../../Screens/Main/Rooms/components/EditDeleteModal";
import LogoutModal from "../LogoutModal";
import { isRTL } from "../../../Utils/IsRTL";

const ItemSeparatorComponent = () => {
  return <View style={{ borderBottomWidth: HP(0.03) }}></View>;
};

const NotificationComponent = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);
  const myStoryData = useSelector((state) => state.newsF.myStories);

  const [reelData, setReelData] = useState();
  const [urlNew, setUrlNew] = useState("");
  const [remoteState, setRemoteState] = useState(null);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);

  const [deleteNotification, setDeleteNotification] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const flatlistRef = useRef();

  useScrollToTop(flatlistRef);
  const Focused = useIsFocused();

  useEffect(() => {
    Focused ? props.onRefresh() : null;
  }, [Focused]);

  const fetchUrl = async (id) => {
    const formData = new FormData();
    formData.append("notification_id", id);
    try {
      const res = await withoutStringiApiCall2({
        route: `notification/read`,
        verb: "Post",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
      } else if (res.responseCode == 200) {
      }
    } catch (e) {
      console.log("Notification read error -- ", e.toString());
    }
  };

  useEffect(() => {
    const onNotificationOpened = (remoteMessage) => {
      fetchUrl(remoteMessage?.data?.id);
      props.onRefresh("ignoreNumOfNots");
      if (remoteMessage) {
        setRemoteState(remoteMessage?.data);
      }
    };

    const unsubscribe =
      messaging().onNotificationOpenedApp(onNotificationOpened);

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    selectedReelAPI();
  }, []);

  const selectedReelAPI = async (urlNew) => {
    const response = await withoutStringiApiCall2({
      route: `reel/${urlNew}`,
      verb: "GET",
      token: token,
    });

    if (response?.responseCode == 200) {
      const myDATA = response?.payload?.data?.reels;
      myDATA.notify = true;
      setReelData(myDATA);
    } else {
      return null;
    }
  };

  const onModalDeletePress = async () => {
    setShowEditDeleteModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 0);
    // showMessage({
    //   message: "",
    //   description: descriptionComponent,
    //   type: "default",
    //   color: "white",
    //   style: {
    //     borderRadius: 8,
    //     padding: 16,
    //     backgroundColor: COLORS.grey,
    //   },
    // });
  };

  const onYesPress = async () => {
    setDeleteModal(false);
    const res = await withoutStringiApiCall2({
      route: `notification/${deleteNotification}/destroy`,
      verb: "DELETE",
      token: token,
    });
    if (res?.responseCode === 200) {
      props.onRefresh();
      Toast.show("Notification removed", Toast.LONG);
    } else {
      console.log("Error in deleting notification");
    }
  };

  const onPressNotification = async (item) => {
    const nodeUrl = item?.node_url;
    const newUrl = nodeUrl?.replace("/reel/", "");
    const reminderNode = nodeUrl?.split("/");
    const encrypted_id_reminder = reminderNode[reminderNode?.length - 1];

    setUrlNew(newUrl);
    const url = item?.url?.replace(
      SITE_URL + "news_feed",
      BASE_URL + "/news_feed"
    );

    if (item?.seen == 0) {
      fetchUrl(item?.id);
      props.onRefresh("ignoreNumOfNots");
    }

    if (item?.action == "friend_add" || item?.action === "birthday") {
      navigation.navigate("ProfileScreen", {
        id: item?.user_id,
      });
    } else if (item?.action == "friend_accept") {
      navigation.navigate("ProfileScreen", {
        id: item?.user_id,
      });
    } else if (
      item?.action == "verification_request" ||
      item?.action == "page_verified" ||
      item?.action == "page_verification_rejected" ||
      item?.action == "page_job_application" ||
      item?.action == "page_admin_request" ||
      item?.action == "page_admin_addation" ||
      item?.action == "page_invitation"
    ) {
      Toast.show("Please check the website to view the detail", Toast.LONG);
    } else if (
      item?.action == "event_invitation" ||
      item?.action == "event_invitation_response"
    ) {
      navigation.navigate("Events", {
        screen: "EventTL",
        params: { id: item?.node_url },
      });
    } else if (
      item?.action == "group_invitation" ||
      item?.action == "group_join" ||
      item?.action == "group_add" ||
      item?.action == "group_accept" ||
      item?.action == "group_admin_addation" ||
      item?.action == "group_post_pending" ||
      item?.action == "group_post_approval" ||
      item?.action == "group_mentorship_request" ||
      item?.action == "group_mentorship_update" ||
      item?.action == "group_mentorship_approved"
    ) {
      if (item?.action == "group_join") {
        navigation.navigate("Groups", {
          screen: "GroupsTL",
          params: {
            focusMembers: true,
            id: item?.node_url,
          },
        });
      } else if (item?.action == "group_invitation") {
        navigation.navigate("Groups", {
          screen: "GroupsTL",
          params: {
            invitation: true,
            id: item?.node_url,
          },
        });
      } else {
        navigation.navigate("Groups", {
          screen: "GroupsTL",
          params: { id: item?.node_url },
        });
      }
    } else if (
      // item?.action == "react_like" ||
      item?.action == "react_heart" ||
      item?.action == "react_haha" ||
      item?.action == "react_yay" ||
      item?.action == "react_wow" ||
      item?.action == "react_sad" ||
      item?.action == "react_angry" ||
      item?.action == "post_reply" ||
      item?.action == "comment_reply" ||
      // item?.action == "comment" ||
      item?.action == "share" ||
      item?.action == "convert_video" ||
      item.action == "tag_user" ||
      item.action == "share_with_specific_friends" ||
      item?.action === "share_friend_timeline"
    ) {
      navigation.navigate("SinglePost", { url });
    } else if (
      (item?.action === "react_like" &&
        item?.node_type === "in_wall_post_user") ||
      (item?.action === "timeline_friend_post" &&
        item?.message === "Posted on your timeline") ||
      (item?.action === "react_like" && item?.node_type === "photo") ||
      (item?.action === "react_like" && item?.node_type === "in_wall_post") ||
      item?.action === "birthday_wall_wish"
    ) {
      navigation.navigate("SinglePost", { url });
    } else if (
      (item?.action == "comment" &&
        item?.message === "Commented on your post") ||
      (item?.action == "comment" && item?.node_type === "photo") ||
      (item?.action == "comment" && item?.node_type === "in_wall_post_user")
    ) {
      navigation.navigate("SinglePost", { url });
    } else if (
      (item?.action === "react_like" &&
        item?.message === "Reacted to your post") ||
      (item?.action === "react_like" && item?.node_type === "post_reply") ||
      (item?.action === "react_like" && item?.node_type === "post_comment")
    ) {
      navigation.navigate("SinglePost", { url });
    } else if (item?.action === "processed_story" && myStoryData?.length > 0) {
      navigation.navigate("myStory", {
        myStoryData: myStoryData,
        index: 0,
      });
    } else if (
      item?.action === "reminder-friend" ||
      item?.action === "reminder" ||
      item?.action === "send-reminder-tofriend"
    ) {
      navigation.navigate("RemindersDetailScreen", {
        id: encrypted_id_reminder,
        selectedTab:
          item?.action === "reminder-friend" ||
          item?.action === "send-reminder-tofriend"
            ? "Friends Reminders"
            : "Reminders",
      });
    } else if (
      item?.action === "processed_story" &&
      myStoryData?.length === 0
    ) {
      Toast.show("Story deleted");
    } else if (
      (item?.action === "comment" &&
        item?.message === "Commented on your clip") ||
      (item?.action === "react_like" && item?.node_type === "reel") ||
      (item?.action === "share" && item?.message === "Shared your reel") ||
      item?.message === "Your clip has been uploaded"
    ) {
      const response = await withoutStringiApiCall2({
        route: `reel/${newUrl}`,
        verb: "GET",
        token: token,
      });
      if (response?.responseCode == 200) {
        const myDATA = [response?.payload?.data?.reels];

        if (myDATA.length > 0) {
          myDATA[0].notify = true;

          navigation.navigate("ReelsNav", {
            screen: "ReelsIndex",
            params: { item: myDATA[0] },
          });
        }
      } else {
        return null;
      }
      // navigation.navigate("SingleReel", { newUrl });
    } else if (
      item?.action === "room_member_added" ||
      item?.action === "room_member_removed" ||
      item?.action == "room_admin_selected" ||
      item?.action == "room_admin_removed"
    ) {
      navigation.navigate("ViewRoom", { id: newUrl, alert: true });
    } else {
      // navigation.navigate("SinglePost", { url });
    }
  };

  const notificationRenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          Styles.itemContainer,
          item.seen == 1 ? Styles.read : Styles.unRead,
        ]}
        onPress={() => onPressNotification(item)}
        onLongPress={() => {
          setShowEditDeleteModal(true);

          setDeleteNotification(item?.encrypted_id);
        }}
      >
        {item.seen == 0 ? <View style={Styles.blackCircle}></View> : null}
        <FastImage
          source={
            item.profile_picture != null
              ? {
                  uri: SITE_URL + item.profile_picture,
                }
              : IMAGES.blankDP
          }
          style={Styles.img}
        />
        <View style={Styles.txtContainer}>
          <Text
            numberOfLines={1}
            style={{
              // fontSize: 16,
              fontSize: WP(4.1),
              fontWeight: "bold",
              maxWidth: WP(85),
              textAlign: "left",
              // backgroundColor: "red",
            }}
          >
            {item.first_name} {item.last_name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: WP(3.6),
              maxWidth: WP(72),
              textAlign: "left",
            }}
          >
            {t(item.message)}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontSize: WP(3), maxWidth: WP(72), textAlign: "left" }}
          >
            {timeDifference(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        data={props.data || remoteState?.seen}
        ref={flatlistRef}
        onEndReached={() => {
          props.paginationEnable
            ? props.setNotsPaginationNumber(props.notsPaginationNumber + 10)
            : null;
          console.log("end reach");
        }}
        onEndReachedThreshold={0.01}
        ListEmptyComponent={
          <View style={styles.noPostsContainer}>
            <Text style={{ fontSize: 23, color: COLORS.grey }}>
              {t("You have no notifications to show")}
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {props.pagingLoader ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginVertical: 10 }}
              />
            ) : null}
            <View style={{ height: HP(5) }}></View>
          </>
        }
        renderItem={({ item }) => notificationRenderItem({ item })}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => ItemSeparatorComponent()}
        refreshControl={
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={() => props.onRefresh()}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />
      {showEditDeleteModal && (
        <EditDeleteModal
          modalVisible={showEditDeleteModal}
          setModalVisible={setShowEditDeleteModal}
          onDeletePress={onModalDeletePress}
        />
      )}
      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          setIsVisible={setDeleteModal}
          // title="Delete Photo"
          message={t("You want to delete this notification?")}
          onYesPress={onYesPress}
        />
      )}
    </>
  );
};

export default NotificationComponent;
