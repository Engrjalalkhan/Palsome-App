import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import moment from "moment";
import { Header } from "../Components";
import useReminderState from "../Hooks";
import { COLORS } from "../../../../Constants/Colors";
import {
  textBottomTopStyle,
  textBottomTopContainerStyle,
} from "../Components/RemindersStyle";
import Toast from "react-native-simple-toast";
import { size } from "../../../../styles/fonts";
import AppStyle from "../../../../styles/AppStyle";
import { ICONS } from "../../../../Constants/Icons";
import { SITE_URL } from "../../../../Services/Constants";
import LogoutModal from "../../../../Components/LogoutModal";
import useUserToken from "../../../../../Utils/useUserToken";
import { formatDateTime } from "../Components/DateTimeFormate";
import {
  deleteApiData,
  getReminderDetailApiCall,
  postApiCall,
} from "../Components/remindersApiCall";
import {
  deleteFriendFromReminder,
  deleteReminder,
} from "../../../../Redux/actions/Reminders";
import FastImage from "react-native-fast-image";
import BottomSheetComponent from "../Components/BottomSheetComponent";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import CreateReminderModal from "../Components/CreateReminderModal";
import {
  getReminderCoverPicture,
  getUserInitials,
} from "../../../../../Utils/Reminder/ReminderCover";
import { showMessage } from "react-native-flash-message";
import { IMAGES } from "../../../../Constants/Images";

const RemindersDetailScreen = ({ navigation, route }) => {
  const bottomSheetRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData);
  const fromSplash = route?.params?.fromSplash;

  const {
    friends,
    editModal,
    setFriends,
    actionType,
    deleteModal,
    setEditModal,
    onPressGoBack,
    titleForModal,
    setActionType,
    selectedFriend,
    setDeleteModal,
    setTitleForModal,
    activeBottomSheet,
    setSelectedFriend,
    reminderDetailData,
    setActiveBottomSheet,
    setReminderDetailData,
    detailLoading,
    setDetailLoading,
    setUpdatingItem,
    setIsCompleted,
    isCompleted,
    subTitleForModal,
    setSubTitleForModal,
  } = useReminderState(navigation, fromSplash);

  const token = useUserToken();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedTab = route?.params?.selectedTab;
  const reminderEncrypted_id = route?.params?.id;

  const id = reminderDetailData?.id;
  const encrypted_id = reminderDetailData?.encrypted_id;

  const textTopStyle = useMemo(() => textBottomTopStyle("top"), []);
  const topStyle = useMemo(() => textBottomTopContainerStyle("top"), []);
  const textBottomStyle = useMemo(() => textBottomTopStyle("bottom"), []);
  const bottomStyle = useMemo(() => textBottomTopContainerStyle("bottom"), []);

  const newDate = new Date();
  const formattedDate = moment(newDate).format("YYYY-MM-DD");

  const reminderCoverPicture = getReminderCoverPicture(reminderDetailData);
  const [firstInitial, lastInitial] = getUserInitials(
    reminderDetailData,
    selectedTab,
    userData
  );

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    const navListener =
      Platform.OS == "ios" && token
        ? navigation.addListener("blur", (e) => {
            fromSplash &&
              navigation.reset({
                index: 0,
                routes: [{ name: "MyTopTabs" }],
              });
          })
        : Platform.OS == "android" && token
        ? navigation.addListener("gestureEnd", () => {
            handleBack();
            return true;
          })
        : navigation.addListener("blur", () => {
            navigation.replace("Intro");
          });

    return () => {
      backhandler.remove();
      // handleBack();

      navListener();
    };
  }, []);

  const handleBack = () => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getReminderDetailApi();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const getReminderDetailApi = async () => {
    setDetailLoading(true);
    let apiRoute;
    try {
      apiRoute = `reminders/details/${reminderEncrypted_id}`;
      const detail = await getReminderDetailApiCall(apiRoute, token);
      if (detail?.responseCode === 200) {
        setReminderDetailData(detail?.payload?.data?.reminder);
        setFriends(detail?.payload?.data?.reminder?.friends);
        // console.log("get reminder detail successfully");
      } else {
        console.log("Failed get reminder detail", detail);
      }
    } catch (error) {
      console.error("Error getting reminder detail:", error.toString());
    } finally {
      setDetailLoading(false);
    }
  };

  const handleModal = (title, action) => {
    setTitleForModal(title);
    if (action === "complete") {
      setSubTitleForModal("You can undo this action");
    } else if (action === "delete") {
      setSubTitleForModal("You can't undo this action");
    } else {
      setSubTitleForModal("You can't undo this action");
    }
    setActionType(action);
    bottomSheetRef.current?.close();
    setDeleteModal(true);
  };

  const openBottomSheet = useCallback(() => {
    setActiveBottomSheet(false);
    bottomSheetRef.current?.present();
  }, []);

  const onPressOpenFriendBottomSheet = useCallback((item) => {
    setSelectedFriend(item);
    setActiveBottomSheet(true);
    bottomSheetRef.current?.present();
  }, []);

  const onPressProfile = useCallback((id) => {
    navigation.navigate("ProfileScreen", { id: id });
  }, []);

  const snapPoints = useMemo(
    () =>
      !activeBottomSheet && selectedTab == t("Reminders")
        ? ["25%", "25%"]
        : !activeBottomSheet && selectedTab === t("Completed Reminders")
        ? ["20%", "20%"]
        : ["15%", "15%"],
    [activeBottomSheet]
  );

  const onPressComplete = useCallback(() => {
    handleModal(t("Are you sure you want to complete this?"), "complete");
  }, []);

  const onPressEdit = useCallback((item) => {
    if (item === "complete") {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    bottomSheetRef.current?.close();
    setEditModal(true);
  }, []);
  const onPressDelete = useCallback(() => {
    handleModal(t("Are you sure you want to delete this?"), "delete");
  }, []);

  const onYesPress = async () => {
    let apiRoute;
    let verb;
    const formData = new FormData();
    formData.append("id", encrypted_id);
    setDeleteModal(false);

    if (actionType === "complete") {
      apiRoute = `reminders/complete/${encrypted_id}`;
      verb = "GET";
    } else if (actionType === "delete") {
      apiRoute = `reminders/${encrypted_id}`;
      verb = "DELETE";
    }
    if (actionType === "leave") {
      try {
        apiRoute = `reminders/leave`;
        const leaveReminderData = await postApiCall(apiRoute, formData, token);
        if (leaveReminderData?.responseCode === 200) {
          // console.log("Leave reminder successfully");
          // Toast.show("Leave reminder successfully");
          showMessage({
            message: t(`Reminder left successfully`),
            type: "info",
          });
          dispatch(deleteReminder(id));
          navigation.goBack();
        } else {
          console.log("Failed to leave reminder", leaveReminderData);
        }
      } catch (error) {
        console.error("Error leaving reminder:", error.toString());
      }
    } else {
      try {
        const deleteReminderData = await deleteApiData(apiRoute, token, verb);
        if (deleteReminderData?.responseCode === 200) {
          // console.log("Reminder deleted successfully");
          // Toast.show("Reminder deleted successfully");
          showMessage({
            message: t(`Reminder ${actionType}d successfully`),
            type: "info",
          });
          dispatch(deleteReminder(id));
          navigation.goBack();
        } else {
          console.log("Failed to delete reminder", deleteReminderData);
        }
      } catch (error) {
        console.error("Error deleting reminder:", error.toString());
      }
    }
  };

  const onPressRemoveFriend = async () => {
    bottomSheetRef.current?.close();
    const formData = new FormData();
    formData.append("reminder_id", reminderEncrypted_id);
    formData.append("user_id", selectedFriend?.encrypted_id);
    let apiRoute = "";

    try {
      apiRoute = `reminders/remove/tagged_friend`;
      const deleteReminderData = await postApiCall(apiRoute, formData, token);
      if (deleteReminderData?.responseCode === 200) {
        // console.log("Remove Friend successfully");
        // Toast.show("Remove Friend successfully");
        showMessage({
          message: t(`Friend removed successfully`),
          type: "info",
        });
        setFriends(
          friends.filter((friend) => friend.id !== selectedFriend?.id)
        );
        dispatch(deleteFriendFromReminder(id, selectedFriend?.id));
      } else {
        console.log("Failed to remove friend", deleteReminderData);
      }
    } catch (error) {
      console.error("Error removing friends:", error.toString());
    }
  };

  const onPressLeaveReminder = async () => {
    handleModal(t("Are you sure you want to leave this reminder?"), "leave");
  };

  const renderFriend = ({ item }) => (
    <View style={styles.tagContainer}>
      <TouchableOpacity
        style={AppStyle.row}
        onPress={() => onPressProfile(item.id)}
      >
        <FastImage
          source={
            item?.profile_picture
              ? { uri: SITE_URL + item?.profile_picture }
              : IMAGES.blankDP
          }
          style={styles.tagUsersDp}
        />
        <View style={AppStyle.ml15}>
          <Text
            numberOfLines={1}
            style={[size.medium, styles.friendsNameTextStyle]}
          >
            {item.first_name} {item.last_name}
          </Text>
          <Text>{item?.pivot?.seen == "0" ? t("Unseen") : t("Seen")}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onPressOpenFriendBottomSheet(item)}
      >
        {ICONS.entypo("dots-three-vertical", COLORS.grey, 24)}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        onPressBack={onPressGoBack}
        title={reminderDetailData?.reminder_name}
      />
      {detailLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={[AppStyle.aiCenter, styles.cardContainer]}>
            <ImageBackground
              source={reminderCoverPicture}
              style={styles.imageBackground}
            >
              {!reminderDetailData?.reminder_cover_picture && (
                <View style={styles.reminderCoverNameText}>
                  <Text style={[styles.reminderCoverText, styles.firstInitial]}>
                    {reminderDetailData?.reminder_owner?.first_name.charAt(0)}
                  </Text>
                  <Text style={[styles.reminderCoverText, styles.lastInitial]}>
                    {reminderDetailData?.reminder_owner?.last_name.charAt(0)}
                  </Text>
                </View>
              )}
              <View style={topStyle}>
                {selectedTab === t("Friends Reminders") ? (
                  <View style={textTopStyle}>
                    <Text style={styles.leftTopText}>
                      {reminderDetailData?.reminder_owner?.first_name}{" "}
                      {reminderDetailData?.reminder_owner?.last_name}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[textTopStyle, { backgroundColor: "transparent" }]}
                  ></View>
                )}

                {reminderDetailData?.upcomming_notify_date_time &&
                selectedTab !== t("Completed Reminders") ? (
                  moment(reminderDetailData?.upcomming_notify_date_time).format(
                    "YYYY-MM-DD"
                  ) > formattedDate && (
                    <View style={textBottomStyle}>
                      <Text style={styles.rightText}>{t("Upcoming")}</Text>
                    </View>
                  )
                ) : selectedTab === t("Completed Reminders") ? (
                  <View
                    style={[textBottomStyle, { backgroundColor: "yellow" }]}
                  >
                    <Text style={[styles.rightText, { color: "black" }]}>
                      {t("Completed")}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={bottomStyle}>
                <View style={AppStyle.column}>
                  <Text style={[styles.leftText, { fontSize: 18 }]}>
                    {reminderDetailData?.reminder_name}
                  </Text>
                  <Text style={styles.leftText}>
                    {reminderDetailData?.upcomming_notify_date_time ? (
                      <Text style={styles.leftText}>
                        {formatDateTime(
                          reminderDetailData?.upcomming_notify_date_time
                        )}
                      </Text>
                    ) : null}
                  </Text>
                </View>
                <View style={styles.rightColumn}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={openBottomSheet}
                  >
                    {ICONS.entypo("dots-three-vertical", COLORS.white, 24)}
                  </TouchableOpacity>
                  <Text
                    style={[styles.rightText, styles.locationText]}
                    numberOfLines={1}
                  >
                    {reminderDetailData?.location !== "null"
                      ? reminderDetailData?.location
                      : null}
                  </Text>

                  {reminderDetailData?.repeat !== "null" &&
                  reminderDetailData?.repeat !== "" ? (
                    <Text style={[styles.rightText, styles.locationText]}>
                      {t("Repeat")}: {t(reminderDetailData?.repeat)}
                    </Text>
                  ) : null}
                </View>
              </View>
            </ImageBackground>
          </View>
          {reminderDetailData?.description &&
          reminderDetailData?.description !== "null" ? (
            <View style={AppStyle.m10}>
              <Text style={[{ paddingVertical: 10 }, size.medium]}>
                {t("Description")}
              </Text>
              <Text style={(AppStyle.pt10, size.small)}>
                {reminderDetailData?.description}
              </Text>
            </View>
          ) : null}
          {selectedTab !== t("Friends Reminders") && (
            <View style={AppStyle.m10}>
              <Text style={(AppStyle.pt10, size.medium)}>
                {t("Tagged Friends")}
              </Text>
              {friends?.length == 0 && (
                <View style={styles.noFriendsContainer}>
                  <Text style={{ fontSize: 18 }}>
                    {t("No Tagged Friends!")}
                  </Text>
                </View>
              )}

              <FlatList
                data={friends}
                renderItem={renderFriend}
                keyExtractor={(item) => item?.id?.toString()}
                style={[AppStyle.mt15, styles.tagUserScrollContainer]}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </ScrollView>
      )}

      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        activeBottomSheet={activeBottomSheet}
        snapPoints={snapPoints}
        onPressComplete={onPressComplete}
        onPressEdit={onPressEdit}
        onPressDelete={onPressDelete}
        onPressRemoveFriend={onPressRemoveFriend}
        selectedTab={selectedTab}
        onPressLeaveReminder={onPressLeaveReminder}
      />
      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          onYesPress={onYesPress}
          setIsVisible={setDeleteModal}
          title={titleForModal}
          message={t(subTitleForModal)}
        />
      )}
      {editModal && (
        <CreateReminderModal
          setShowCreateGroupModal={setEditModal}
          reminderModal={editModal}
          currentItem={reminderDetailData}
          edit={true}
          setReminderDetailData={setReminderDetailData}
          setFriends={setFriends}
          friends={friends}
          setUpdatingItem={setUpdatingItem}
          isCompleted={isCompleted}
          fromDetailScreen={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageBackground: {
    height: 300,
    width: getWidth(96),
    resizeMode: "contain",
    justifyContent: "center",
  },
  leftText: {
    color: "white",
    fontSize: 13,
    padding: 5,
    width: getWidth(45),
  },
  leftTopText: {
    color: COLORS.black,
    fontSize: 14,
  },
  rightText: {
    color: "white",
    fontSize: 13,
    padding: 5,
  },
  tagUserScrollContainer: {
    height: getHeight(20),
  },
  tagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  tagUsersDp: {
    height: 40,
    width: 40,
    borderRadius: 125,
    resizeMode: "contain",
  },
  threeDots: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  iconButton: {
    padding: 5,
    width: 50,
    alignItems: "center",
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  friendsNameTextStyle: {
    color: COLORS.primary,
    fontWeight: "500",
    width: getWidth(60),
  },
  locationText: {
    width: getWidth(45),
  },
  noFriendsContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  userInitials: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  reminderCoverNameText: {
    alignItems: "center",
    marginBottom: 70,
    flexDirection: "row",
    justifyContent: "center",
  },
  reminderCoverText: { fontSize: 50, color: "gray", fontWeight: "bold" },
  firstInitial: { color: COLORS.secondary },
  lastInitial: { color: COLORS.secondary },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

export default RemindersDetailScreen;
