import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect } from "react";

import { ActivityIndicator } from "react-native";
import { View, Text, StyleSheet } from "react-native";

import useReminderState from "../Hooks";
import RemindersCard from "./RemindersCard";
import { getApiData } from "./remindersApiCall";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../../../Redux/action-types";
import {
  reminderAlertYes,
  resetReminders,
} from "../../../../Redux/actions/Reminders";

const Content = ({ selectedTab, onPressNavigation, onPressThreeDots }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    page,
    loading,
    setPage,
    totalPages,
    setLoading,
    refreshing,
    loadingMore,
    setTotalPages,
    setRefreshing,
    setLoadingMore,
  } = useReminderState();

  const token = useSelector((state) => state.auth.userToken);
  const ReminderAlert = useSelector((state) => state.reminderRed.reminderAlert);

  const remindersData = useSelector((state) => state.reminderRed.remindersData);
  const completeRemindersData = useSelector(
    (state) => state.reminderRed.completeRemindersData
  );
  const friendsRemindersData = useSelector(
    (state) => state.reminderRed.friendsRemindersData
  );

  const fetchData = async () => {
    let apiRoute = "";
    let actionType = "";

    switch (selectedTab) {
      case t("Reminders"):
        apiRoute = "reminders";
        actionType = ACTIONS.REMINDERS_DATA;
        break;
      case t("Completed Reminders"):
        apiRoute = "reminders/completed_reminder";
        actionType = ACTIONS.COMPLETE_REMINDERS;
        break;
      case t("Friends Reminders"):
        apiRoute = "reminders/friends_reminder";
        actionType = ACTIONS.FRIENDS_REMINDERS;
        break;
      default:
        apiRoute = "reminders";
        actionType = ACTIONS.REMINDERS_DATA;
        break;
    }

    const remindersDataResponse = await getApiData(apiRoute, token, page);
    if (remindersDataResponse) {
      const dataWithPage = remindersDataResponse?.data?.map((item) => ({
        ...item,
        page,
      }));

      dispatch({
        type: actionType,
        data: dataWithPage,
      });
    }

    setTotalPages(remindersDataResponse?.last_page);
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  useEffect(() => {
    const loadInitialData = async () => {
      let data = [];

      switch (selectedTab) {
        case t("Reminders"):
          data = remindersData;
          break;
        case t("Completed Reminders"):
          data = completeRemindersData;
          break;
        case t("Friends Reminders"):
          data = friendsRemindersData;
          break;
        default:
          data = remindersData;
          break;
      }

      if (data.length === 0 && !refreshing) {
        setLoading(true);
      }

      await fetchData(page);
    };

    loadInitialData();
  }, [selectedTab, token, page]);

  useEffect(() => {
    if (ReminderAlert) {
      onRefresh();
      dispatch(reminderAlertYes(false));
    }
  }, [ReminderAlert]);

  const onRefresh = async () => {
    setPage(1);
    setLoading(true);
    setRefreshing(true);
    dispatch(resetReminders());

    let apiRoute = "";
    let actionType = "";

    switch (selectedTab) {
      case t("Reminders"):
        apiRoute = "reminders";
        actionType = ACTIONS.REMINDERS_DATA;
        break;
      case t("Completed Reminders"):
        apiRoute = "reminders/completed_reminder";
        actionType = ACTIONS.COMPLETE_REMINDERS;
        break;
      case t("Friends Reminders"):
        apiRoute = "reminders/friends_reminder";
        actionType = ACTIONS.FRIENDS_REMINDERS;
        break;
      default:
        apiRoute = "reminders";
        actionType = ACTIONS.REMINDERS_DATA;
        break;
    }

    const remindersDataResponse = await getApiData(apiRoute, token, 1); // Fetch the first page of data
    if (remindersDataResponse) {
      setRefreshing(false);
      setLoading(false);
      const dataWithPage = remindersDataResponse?.data?.map((item) => ({
        ...item,
        page: 1,
      }));
      dispatch({ type: actionType, data: dataWithPage });
    } else {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const loadMoreData = useCallback(() => {
    if (page < totalPages) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  }, [totalPages, page]);

  const renderFooter = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        {loadingMore && <ActivityIndicator color="red" size={"large"} />}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="red" size={"large"} />
          {/* <SkeletonLoader isLoading={loading} layoutType={"feed"} /> */}
        </View>
      );
    }

    switch (selectedTab) {
      case t("Reminders"):
        return (
          <>
            {remindersData?.length === 0 ? (
              <View style={styles.noReminderContainer}>
                {ICONS.ionIcons("calendar-outline", COLORS.primary, 64)}
                <Text style={styles.noReminderText}>
                  {t("You have not created any reminder")}
                </Text>
                <Text style={styles.subText}>
                  {t("Created reminder will appear here.")}.
                </Text>
              </View>
            ) : (
              <RemindersCard
                data={remindersData}
                onPressNavigation={onPressNavigation}
                onPressThreeDots={onPressThreeDots}
                loadMoreData={loadMoreData}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderFooter={renderFooter}
                reminders={true}
                selectedTab={selectedTab}
              />
            )}
          </>
        );

      case t("Completed Reminders"):
        return (
          <>
            {completeRemindersData?.length === 0 ? (
              <View style={styles.noReminderContainer}>
                {ICONS.ionIcons("checkmark-done-outline", COLORS.primary, 64)}
                <Text style={styles.noReminderText}>
                  {t("No completed reminders")}
                </Text>
                <Text style={styles.subText}>
                  {t("Completed reminders will appear here")}.
                </Text>
              </View>
            ) : (
              <RemindersCard
                data={completeRemindersData}
                onPressNavigation={onPressNavigation}
                onPressThreeDots={onPressThreeDots}
                loadMoreData={loadMoreData}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderFooter={renderFooter}
                completed={true}
                selectedTab={selectedTab}
              />
            )}
          </>
        );

      case t("Friends Reminders"):
        return (
          <>
            {friendsRemindersData?.length === 0 ? (
              <View style={styles.noReminderContainer}>
                {ICONS.ionIcons("people-outline", COLORS.primary, 64)}
                <Text style={styles.noReminderText}>
                  {t("No friends reminders")}
                </Text>
                <Text style={styles.subText}>
                  {t("Friends reminders will appear here")}.
                </Text>
              </View>
            ) : (
              <RemindersCard
                data={friendsRemindersData}
                onPressNavigation={onPressNavigation}
                onPressThreeDots={onPressThreeDots}
                loadMoreData={loadMoreData}
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderFooter={renderFooter}
                friends={true}
                selectedTab={selectedTab}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return <View style={styles.contentContainer}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noReminderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noReminderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 30,
  },
});

export default Content;
