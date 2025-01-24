import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IMAGES } from "../../Constants/Images";
import * as RootNavigation from "../../Navigators/RootNavigation";

import { BASE_URL, SITE_URL } from "../../Services/Constants";
import { postStatusApiCall, withoutStringiApiCall2 } from "../../Services/Apis";

import {
  fetchVideos,
  notificationEvent,
} from "../../Redux/actions/NewsFeedActions";
import { getReelsDataRequest } from "../../Redux/actions/ReelsActions";
import { updateProfilePicture } from "../../Redux/actions/ProfileActions";
import { useIsFocused } from "@react-navigation/native";
import { ACTIONS } from "../../Redux/action-types";


const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();

  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state?.auth?.userToken);
  const getSelectedLanguage = useSelector((state) => state.newsF.saveLanguage);
  const isBackScreen = useSelector(
    (state) => state.constantReducers.isBackScreen
  );

  const [urlNew, setUrlNew] = useState("");
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    if (getSelectedLanguage) {
      i18n.changeLanguage(getSelectedLanguage);
    }
  }, [getSelectedLanguage, i18n]);

  useEffect(() => {
    if (isBackScreen) {
      navigation.replace("MyTopTabs");
      dispatch({ type: ACTIONS.HANDLE_BACK_SPLASH, data: false });
    }
  }, [isFocused]);

  useEffect(() => {
    const notificationListener = async () => {
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log("Notification=========>>", remoteMessage);
        const nodeUrl = remoteMessage?.data?.node_url;
        const reminderNode = nodeUrl?.split("/");
        const encrypted_id_reminder =
          reminderNode && reminderNode.length > 0
            ? reminderNode[reminderNode.length - 1]
            : null;

        const newUrl = nodeUrl?.replace("/reel/", "");
        setUrlNew(newUrl);

        const url = remoteMessage?.data?.url?.replace(
          SITE_URL + "news_feed",
          BASE_URL + "/news_feed"
        );

        if (
          remoteMessage?.data?.action == "verification_request" ||
          remoteMessage?.data?.action == "page_verified" ||
          remoteMessage?.data?.action == "page_verification_rejected" ||
          remoteMessage?.data?.action == "page_job_application" ||
          remoteMessage?.data?.action == "page_admin_request" ||
          remoteMessage?.data?.action == "page_admin_addation" ||
          remoteMessage?.data?.action == "page_invitation"
        ) {
          Toast.show("Please check the website to view the detail", Toast.LONG);
        } else if (
          remoteMessage?.data?.action == "event_invitation" ||
          remoteMessage?.data?.action == "event_invitation_response"
        ) {
          navigation.navigate("Events", {
            screen: "EventTL",
            params: {
              fromSplash: true,
              id: remoteMessage?.data?.node_url,
            },
          });
        } else if (
          remoteMessage?.data?.action === "reminder-friend" ||
          remoteMessage?.data?.action === "reminder" ||
          remoteMessage?.data?.action === "send-reminder-tofriend"
        ) {
          navigation.navigate("RemindersDetailScreen", {
            id: encrypted_id_reminder,
            selectedTab:
              remoteMessage?.data?.action === "reminder-friend" ||
              remoteMessage?.data?.action === "send-reminder-tofriend"
                ? "Friends Reminders"
                : "Reminders",
            notification: true,
          });
        } else if (
          remoteMessage?.data?.action == "group_join" ||
          remoteMessage?.data?.action == "group_add" ||
          remoteMessage?.data?.action == "group_invitation" ||
          remoteMessage?.data?.action == "group_accept" ||
          remoteMessage?.data?.action == "group_admin_addation" ||
          remoteMessage?.data?.action == "group_post_pending" ||
          remoteMessage?.data?.action == "group_post_approval" ||
          remoteMessage?.data?.action == "group_mentorship_request" ||
          remoteMessage?.data?.action == "group_mentorship_update" ||
          remoteMessage?.data?.action == "group_mentorship_approved"
        ) {
          if (remoteMessage?.data?.action == "group_join") {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                focusMembers: true,
                id: remoteMessage?.data?.node_url,
              },
            });
          } else if (remoteMessage?.data?.action == "group_invitation") {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                invitation: true,
                id: remoteMessage?.data?.node_url,
              },
            });
          } else {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                id: remoteMessage?.data?.node_url,
              },
            });
          }
        } else if (
          (remoteMessage?.data?.action == "react_like" &&
            remoteMessage?.data?.node_type !== "reel") ||
          remoteMessage?.data?.action == "react_heart" ||
          remoteMessage?.data?.action == "react_haha" ||
          remoteMessage?.data?.action == "react_yay" ||
          remoteMessage?.data?.action == "react_wow" ||
          remoteMessage?.data?.action == "react_sad" ||
          remoteMessage?.data?.action == "react_angry" ||
          // remoteMessage?.data?.action == "comment" ||
          remoteMessage?.data?.action == "post_reply" ||
          remoteMessage?.data?.action == "comment_reply" ||
          remoteMessage?.data?.action == "share" ||
          remoteMessage?.data?.action == "convert_video" ||
          remoteMessage?.data?.action == "tag_user" ||
          remoteMessage?.data?.action == "share_with_specific_friends"
        ) {
          navigation.navigate("SinglePost", {
            url: BASE_URL + remoteMessage?.data?.node_url,
            fromSplash: true,
          });
        } else if (
          remoteMessage?.data?.type === "user_Profile_update" ||
          remoteMessage?.data?.type === "user_cover_update"
        ) {
          dispatch(updateProfilePicture(remoteMessage?.data?.avatar_full));
          navigation.navigate("ProfileScreen", {
            id: userData?.id,
          });
        } else if (
          remoteMessage?.data?.action === "room_member_added" ||
          remoteMessage?.data?.action === "room_member_removed" ||
          remoteMessage?.data?.action == "room_admin_selected" ||
          remoteMessage?.data?.action == "room_admin_removed"
        ) {
          navigation.navigate("ViewRoom", {
            id: remoteMessage?.data?.node_url,
            alert: true,
          });
        }
        if (
          remoteMessage?.data?.action == "friend_add" ||
          remoteMessage?.data?.action == "birthday" ||
          remoteMessage?.data?.action == "user_cover-update"
        ) {
          navigation.navigate("ProfileScreen", {
            id: remoteMessage?.data?.from_user_id,
          });
        } else if (remoteMessage?.data?.action == "friend_accept") {
          navigation.navigate("ProfileScreen", {
            id: remoteMessage?.data?.from_user_id,
          });
        } else if (
          (remoteMessage?.data?.action == "comment" &&
            remoteMessage?.data?.message === "Commented on your post") ||
          (remoteMessage?.data?.action == "comment" &&
            remoteMessage?.data?.node_type === "photo") ||
          (remoteMessage?.data?.action == "comment" &&
            remoteMessage?.data?.node_type === "in_wall_post_user") ||
          remoteMessage?.data?.action === "birthday_wall_wish" ||
          (remoteMessage?.data?.action === "react_like" &&
            remoteMessage?.data?.node_type === "post") ||
          (remoteMessage?.data?.action === "react_like" &&
            remoteMessage?.data?.node_type === "photo")
        ) {
          navigation.navigate("SinglePost", { url });
        } else if (
          (remoteMessage?.data?.action === "comment" &&
            remoteMessage?.data?.message === "Commented on your clip") ||
          (remoteMessage?.data?.action === "react_like" &&
            remoteMessage?.data?.node_type === "reel") ||
          (remoteMessage?.data?.action === "share" &&
            remoteMessage?.data?.message === "Shared your reel") ||
          remoteMessage?.data?.message === "Your reel has been uploaded"
        ) {
          navigation?.navigate("Notifications");
        }
        //   try {
        //     const response = await withoutStringiApiCall2({
        //       route: `reel/${urlNew}`,
        //       verb: "GET",
        //       token: token,
        //     });

        //     if (response?.responseCode === 200) {
        //       // Commented while resolving conflicts (11/09/2023 3:44 PM)
        //       // const myDATA = [response?.payload?.data?.reels];
        //       // if (myDATA.length > 0) {
        //       //   console.log("Navigating to ReelsNav with item:", myDATA);
        //       //   // myDATA[0].notify = true;
        //       //   // navigation.navigate("ReelsNav", {
        //       //   //   screen: "ReelsIndex",
        //       //   //   params: { item: myDATA[0] },
        //       //   // });
        //       //   navigation.navigate("Notifications");
        //       // }

        //       dispatch(
        //         getReelsDataRequest({
        //           token,
        //           currentPage: 1,
        //         })
        //       );
        //       const myDATA = response?.payload?.data;
        //       reel_data = myDATA["public_reels"]["data"];
        //       console.log("Navigating to ReelsNav with item:", reel_data[0]);
        //       // myDATA[0].notify = true;
        //       navigation.navigate("ReelsNav", {
        //         screen: "ReelsIndex",
        //         params: { item: reel_data[0] },
        //       });
        //       // navigation.navigate("Notifications");
        //     } else {
        //       console.log("Error:========>>>>>>> ", response);
        //     }
        //   } catch (error) {
        //     console.error("Error during API call:", error);
        //   }
        // else {
        //   ("error");
        // }
      });

      const initialNotification = await messaging().getInitialNotification();

      if (initialNotification) {
        const nodeUrl = initialNotification?.data?.node_url;
        const reminderNode = nodeUrl?.split("/");
        const encrypted_id_reminder =
          reminderNode && reminderNode.length > 0
            ? reminderNode[reminderNode.length - 1]
            : null;
        if (
          initialNotification?.data?.action == "verification_request" ||
          initialNotification?.data?.action == "page_verified" ||
          initialNotification?.data?.action == "page_verification_rejected" ||
          initialNotification?.data?.action == "page_job_application" ||
          initialNotification?.data?.action == "page_admin_request" ||
          initialNotification?.data?.action == "page_admin_addation" ||
          initialNotification?.data?.action == "page_invitation"
        ) {
          Toast.show("Please check the website to view the detail", Toast.LONG);
        } else if (
          initialNotification?.data?.action == "event_invitation" ||
          initialNotification?.data?.action == "event_invitation_response"
        ) {
          navigation.navigate("Events", {
            screen: "EventTL",
            params: {
              fromSplash: true,
              id: initialNotification?.data?.node_url,
            },
          });
        } else if (
          initialNotification?.data?.action === "reminder-friend" ||
          initialNotification?.data?.action === "reminder" ||
          initialNotification?.data?.action === "send-reminder-tofriend"
        ) {
          navigation.navigate("RemindersDetailScreen", {
            id: encrypted_id_reminder,
            selectedTab:
              initialNotification?.data?.action === "reminder-friend" ||
              initialNotification?.data?.action === "send-reminder-tofriend"
                ? "Friends Reminders"
                : "Reminders",
            fromSplash: true,
          });
        } else if (
          initialNotification?.data?.action == "group_join" ||
          initialNotification?.data?.action == "group_add" ||
          initialNotification?.data?.action == "group_invitation" ||
          initialNotification?.data?.action == "group_accept" ||
          initialNotification?.data?.action == "group_admin_addation" ||
          initialNotification?.data?.action == "group_post_pending" ||
          initialNotification?.data?.action == "group_post_approval" ||
          initialNotification?.data?.action == "group_mentorship_request" ||
          initialNotification?.data?.action == "group_mentorship_update" ||
          initialNotification?.data?.action == "group_mentorship_approved"
        ) {
          if (initialNotification?.data?.action == "group_join") {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                focusMembers: true,
                id: initialNotification?.data?.node_url,
              },
            });
          } else if (initialNotification?.data?.action == "group_invitation") {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                invitation: true,
                id: initialNotification?.data?.node_url,
              },
            });
          } else {
            navigation.navigate("Groups", {
              screen: "GroupsTL",
              params: {
                fromSplash: true,
                id: initialNotification?.data?.node_url,
              },
            });
          }
        } else if (
          (initialNotification?.data?.action == "react_like" ||
            initialNotification?.data?.action == "react_heart" ||
            initialNotification?.data?.action == "react_haha" ||
            initialNotification?.data?.action == "react_yay" ||
            initialNotification?.data?.action == "react_wow" ||
            initialNotification?.data?.action == "react_sad" ||
            initialNotification?.data?.action == "react_angry" ||
            initialNotification?.data?.action == "comment" ||
            initialNotification?.data?.action == "post_reply" ||
            initialNotification?.data?.action == "comment_reply" ||
            initialNotification?.data?.action == "share" ||
            initialNotification?.data?.action == "convert_video" ||
            initialNotification?.data?.action == "tag_user" ||
            initialNotification?.data?.action === "timeline_friend_post" ||
            initialNotification?.data?.action ==
              "share_with_specific_friends") &&
          initialNotification?.data?.node_type !== "reel"
        ) {
          RootNavigation.navigate("NotificationStackMain", {
            screen: "SinglePost",
            params: {
              url: BASE_URL + initialNotification?.data?.node_url,
              fromSplash: true,
            },
          });
        } else if (
          initialNotification?.data?.action === "room_member_added" ||
          initialNotification?.data?.action === "room_member_removed" ||
          initialNotification?.data?.action == "room_admin_selected" ||
          initialNotification?.data?.action == "room_admin_removed"
        ) {
          navigation.navigate("RoomsNav", {
            screen: "ViewRoom",
            params: {
              id: initialNotification?.data?.node_url,
              alert: true,
              fromSplash: true,
            },
          });
        } else if (
          initialNotification?.data?.type === "user_Profile_update" ||
          initialNotification?.data?.type === "user_cover_update"
        ) {
          dispatch(
            updateProfilePicture(initialNotification?.data?.avatar_full)
          );
          navigation.navigate("ProfileScreen", {
            id: userData?.id,
            fromSplash: true,
          });
        } else if (
          initialNotification?.data?.action == "friend_add" ||
          initialNotification?.data?.action == "birthday" ||
          initialNotification?.data?.action == "user_cover-update"
        ) {
          navigation.navigate("ProfileScreen", {
            id: initialNotification?.data?.from_user_id,
            fromSplash: true,
          });
        } else if (initialNotification?.data?.action == "friend_accept") {
          navigation.navigate("ProfileScreen", {
            id: initialNotification?.data?.from_user_id,
            fromSplash: true,
          });
        } else if (initialNotification?.data?.node_type == "reel") {
          RootNavigation.navigate("NotificationStackMain", {
            screen: "Notifications",
            params: {
              fromSplash: true,
            },
          });
        } else {
          console.log("error");
          navigation.replace("MyTopTabs");
        }
      } else {
        if (token) {
          navigation.replace("MyTopTabs");
        } else {
          navigation.replace("Intro");
        }
      }
    };

    setTimeout(() => {
      notificationListener();
    }, 3000);

    return () => {
      messaging().onNotificationOpenedApp(() => {}); // Remove the listener
    };
  }, [navigation, userData]);

  messaging().onMessage(async (remoteMessage) => {
    // showMessage({
    //   message: remoteMessage?.notification?.title,
    //   description: remoteMessage?.notification?.body,
    //   type: "info",
    //   position: "top",
    //   renderFlashMessageIcon: () => (
    //     <Image source={IMAGES.logo} style={styles.notificationImage} />
    //   ),
    // });
  });

  useEffect(() => {
    handleForegroundMessages();
   
  }, []);

  const handleForegroundMessages = async () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      let getProfile = remoteMessage?.data;
      if (getProfile?.type === "user_Profile_update") {
        dispatch(updateProfilePicture(getProfile?.avatar_full));
      } else {
        console.log("Profile still available");
        dispatch(notificationEvent(remoteMessage?.data?.message));
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (token) {
      dispatch(
        fetchVideos({
          token,
          page: 1,
        })
      );
    }
  }, [token]);

  useEffect(() => {
    getProfileImageBackground();
  }, [token]);

  const getProfileImageBackground = async () => {
    if (token) {
      const getProfileImage = await AsyncStorage.getItem("image");
      if (getProfileImage) {
        dispatch(updateProfilePicture(getProfileImage));
        await AsyncStorage.removeItem("image");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={IMAGES.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  notificationImage: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
});

export default Splash;
