import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import AppStyle from "../../../../styles/AppStyle";
import {
  textBottomTopContainerStyle,
  textBottomTopStyle,
} from "./RemindersStyle";
import { RefreshControl } from "react-native";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "./DateTimeFormate";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { getWidth } from "../../../../../Utils/NewResponsive";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  getReminderCoverPicture,
  getUserInitials,
} from "../../../../../Utils/Reminder/ReminderCover";

const RemindersCard = ({
  data,
  onRefresh,
  refreshing,
  friends,
  reminders,
  loadMoreData,
  renderFooter,
  onPressThreeDots,
  onPressNavigation,
  selectedTab,
}) => {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.auth.userData);

  const textTopStyle = useMemo(() => textBottomTopStyle("top"), []);
  const topStyle = useMemo(() => textBottomTopContainerStyle("top"), []);
  const textBottomStyle = useMemo(() => textBottomTopStyle("bottom"), []);
  const bottomStyle = useMemo(() => textBottomTopContainerStyle("bottom"), []);

  const renderItems = ({ item }) => {
    const currentDateTime = moment();

    const notifyDateTime = item?.upcomming_notify_date_time
      ? moment(item?.upcomming_notify_date_time)
      : null;

    const reminderCoverPicture = getReminderCoverPicture(item);
    const [firstInitial, lastInitial] = getUserInitials(
      item,
      reminders,
      userData
    );

    return (
      <Pressable
        style={styles.container}
        onPress={() => onPressNavigation(item)}
      >
        <ImageBackground
          source={reminderCoverPicture}
          style={styles.imageBackground}
        >
          {!item?.reminder_cover_picture && (
            <View style={styles.reminderCoverNameText}>
              <Text style={[styles.reminderCoverText, styles.firstInitial]}>
                {firstInitial}
              </Text>
              <Text style={[styles.reminderCoverText, styles.lastInitial]}>
                {lastInitial}
              </Text>
            </View>
          )}
          <View style={topStyle}>
            {friends ? (
              <View style={textTopStyle}>
                <Text style={styles.leftTopText}>
                  {item?.reminder_owner?.first_name}{" "}
                  {item?.reminder_owner?.last_name}
                </Text>
              </View>
            ) : (
              <View
                style={[textTopStyle, { backgroundColor: "transparent" }]}
              ></View>
            )}

            {item?.upcomming_notify_date_time &&
            selectedTab !== t("Completed Reminders") ? (
              item?.status == "1" ? (
                <View style={[textBottomStyle, { backgroundColor: "yellow" }]}>
                  <Text style={[styles.rightText, { color: "black" }]}>
                    {t("Complete")}
                  </Text>
                </View>
              ) : notifyDateTime >= currentDateTime ? (
                <View style={textBottomStyle}>
                  <Text style={styles.rightText}>{t("Upcoming")}</Text>
                </View>
              ) : (
                <View style={[textBottomStyle, { backgroundColor: "red" }]}>
                  <Text style={[styles.rightText, { color: "white" }]}>
                    {t("Missed")}
                  </Text>
                </View>
              )
            ) : selectedTab === t("Completed Reminders") ? (
              <View style={[textBottomStyle, { backgroundColor: "yellow" }]}>
                <Text style={[styles.rightText, { color: "black" }]}>
                  {t("Completed")}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={bottomStyle}>
            <View style={[AppStyle.column, styles.leftColumn]}>
              <Text style={[styles.leftText, { fontSize: 18 }]}>
                {item?.reminder_name}
              </Text>
              {item?.upcomming_notify_date_time ? (
                <Text style={styles.leftText}>
                  {formatDateTime(item?.upcomming_notify_date_time)}
                </Text>
              ) : null}
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onPressThreeDots(item)}
              >
                {ICONS.entypo("dots-three-vertical", COLORS.white, 24)}
              </TouchableOpacity>

              <Text
                style={[styles.rightText, styles.locationText]}
                numberOfLines={1}
              >
                {item?.location !== "null" ? item?.location : null}
              </Text>
              {item?.repeat !== "null" && item?.repeat !== "" ? (
                <Text style={[styles.rightText]}>
                  {t("Repeat")}: {t(item?.repeat)}
                </Text>
              ) : null}
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={AppStyle.flex1}>
      <FlatList
        data={data}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.id}
        onEndReached={loadMoreData}
        refreshing={refreshing}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

export default React.memo(RemindersCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageBackground: {
    height: 300,
    width: getWidth(95),
    resizeMode: "contain",
    justifyContent: "center",
  },
  leftText: {
    color: "white",
    fontSize: 13,
    padding: 5,
  },
  leftTopText: {
    color: COLORS.black,
    fontSize: 16,
  },
  rightText: {
    color: "white",
    fontSize: 13,
    padding: 5,
  },
  locationText: {
    width: 170,
    textAlign: "right",
    paddingRight: 8,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  iconButton: {
    padding: 5,
    width: 50,
    alignItems: "center",
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
});
