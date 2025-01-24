import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import NoEvents from "./NoEvents";
import Loader from "../../../../Components/Loader";

import { ICONS } from "../../../../Constants/Icons";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import { HP, WP } from "../../../../../Utils/Resposive";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";
import {
  getEventsList,
  resetEventList,
} from "../../../../Redux/actions/EventActions";

const EventCard = (props) => {
  const {
    endpoint,
    forceRefresh,
    setForceRefresh,
    emptyDataText,
    emptyDataSubText,
  } = props;

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const isEdited = useSelector((state) => state.eventsRed.eventsListIsRefresh);

  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    getExploreData();
  }, [endpoint]);

  useEffect(() => {
    if (isEdited) {
      setPage(1);
      setLoading(true);
      getExploreData();
      dispatch(resetEventList());
    }
  }, [isEdited]);

  useEffect(() => {
    if (forceRefresh) {
      setPage(1);
      setLoading(true);

      getExploreData();
      setForceRefresh(false);
    }
  }, [forceRefresh]);

  useEffect(() => {
    if (page != 1) getMoreExploreData();
  }, [page]);

  const getExploreData = () => {
    const url = endpoint
      ? `${BASE_URL}/events/${endpoint}`
      : `${BASE_URL}/events`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);

          if (res?.responseCode == 200) {
            setEvents(res?.payload?.events?.data);
            setLastPage(res?.payload?.events?.last_page);
          } else {
            showMessage({
              message: res?.message,
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      console.log("tryCatchError: ", error);
    }
  };

  const getMoreExploreData = () => {
    const url = endpoint
      ? `${BASE_URL}/events/${endpoint}?page=${page}`
      : `${BASE_URL}/events?page=${page}`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoadingMore(false);

          if (res?.responseCode == 200) {
            setLastPage(res?.payload?.events?.last_page);

            const data = [...events, ...res?.payload?.events?.data];
            setEvents(data);
          } else {
            showMessage({
              message: res?.message,
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoadingMore(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoadingMore(false);
      console.log("tryCatchError: ", error);
    }
  };

  const onRefresh = () => {
    setPage(1);
    setRefreshing(true);
    getExploreData();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (!loadingMore && page < lastPage) {
      setLoadingMore(true);
      setPage((prevState) => prevState + 1);
    }
  };

  const openEvent = (id) => navigation.navigate("EventTL", { id });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => openEvent(item?.encrypted_id)}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {moment(item.dates[0].start_date).format("DD-MMM-YYYY")}{" "}
            {item.dates[0].end_date &&
              item.dates[0].start_date != item.dates[0].end_date && (
                <Text style={styles.dateText}>
                  to {moment(item.dates[0].end_date).format("DD-MMM-YYYY")}
                </Text>
              )}
          </Text>
        </View>

        <FastImage
          resizeMode="cover"
          style={styles.coverImage}
          source={
            item?.event_cover_picture
              ? { uri: `${SITE_URL}${item?.event_cover_picture}` }
              : IMAGES.blankCover
          }
        />

        <View style={styles.infoCardTop}>
          <View>
            <Text numberOfLines={1} style={styles.nameText}>
              {item.event_name}
            </Text>
          </View>

          {item.event_type == "public"
            ? ICONS.fontAwesome5("globe", COLORS.white, HP(2))
            : ICONS.fontAwesome5("lock", COLORS.white, HP(2))}
        </View>

        <View style={styles.infoCardBottom}>
          <View style={styles.locationContainer}>
            {ICONS.ionIcons("location-outline", COLORS.black, HP(2), {
              marginRight: 5,
            })}

            <Text numberOfLines={1} style={styles.locatoinText}>
              {item.event_location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        keyExtractor={(_, index) => index}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <NoEvents heading={emptyDataText} subHeading={emptyDataSubText} />
        }
        ListFooterComponentStyle={styles.footer}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          ) : (
            <View />
          )
        }
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

export default EventCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 3,
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  cardWrapper: {
    margin: WP(3),
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },

  coverImage: {
    height: HP(25),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  infoCardTop: {
    padding: WP(2),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
  },

  nameText: {
    fontSize: 15,
    width: WP(75),
    fontWeight: "600",
    color: COLORS.white,
  },

  dateContainer: {
    zIndex: 1,
    borderRadius: 20,
    paddingVertical: WP(1),
    paddingHorizontal: WP(2),
    backgroundColor: COLORS.white,

    position: "absolute",
    top: 10,
    left: 10,
  },

  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.black,
  },

  infoCardBottom: {
    padding: WP(2),
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  locationContainer: {
    marginVertical: 2,
    alignItems: "center",
    flexDirection: "row",
  },

  locatoinText: {
    fontSize: 14,
    width: WP(85),
    fontWeight: "600",
    color: COLORS.black,
  },

  footer: {
    height: HP(10),
    marginBottom: 20,
  },
});
