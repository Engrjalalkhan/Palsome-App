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

import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import NoGroups from "./NoGroups";

import { HP, WP } from "../../../../../Utils/Resposive";
import { useTranslation } from "react-i18next";

import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { resetGroupList } from "../../../../Redux/actions/EventActions";

const ExploreGroups = (props) => {
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
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);
  const isEdited = useSelector((state) => state.eventsRed.groupsListIsRefresh);

  const [page, setPage] = useState(1);
  const [groups, setGroups] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
      dispatch(resetGroupList());
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
      ? `${BASE_URL}/groups/${endpoint}`
      : `${BASE_URL}/groups`;

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
            setGroups(res?.payload?.data?.groups?.data);
            setLastPage(res?.payload?.data?.groups?.last_page);
          } else {
            showMessage({
              message: "Something is wrong",
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
      ? `${BASE_URL}/groups/${endpoint}?page=${page}`
      : `${BASE_URL}/groups?page=${page}`;

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
            setLastPage(res?.payload?.data?.groups?.last_page);

            const data = [...groups, ...res?.payload?.data?.groups?.data];
            setGroups(data);
          } else {
            showMessage({
              message: "Something is wrong",
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

  const openGroup = (id) => {
    if (endpoint == "invitations")
      navigation.navigate("GroupsTL", { id, invitation: true });
    else if (endpoint == "pending_approval")
      navigation.navigate("GroupsTL", { id, pendingApproval: true });
    else navigation.navigate("GroupsTL", { id });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.container, styles.aligment]}
        onPress={() => openGroup(item?.encrypted_id)}
      >
        <FastImage
          source={
            item?.cover_photo
              ? { uri: `${SITE_URL}${item?.cover_photo}` }
              : IMAGES.blankCover
          }
          style={styles.image}
        />

        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        <Text numberOfLines={1} style={styles.members}>
          {t("Members")}: {item.group_members}
        </Text>
      </TouchableOpacity>
    );
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

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  ) : (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 40 }}
        data={groups}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(_, index) => index}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        ListEmptyComponent={
          <NoGroups heading={emptyDataText} subHeading={emptyDataSubText} />
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

export default ExploreGroups;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    marginVertical: HP(1),
    marginHorizontal: WP(3),
    backgroundColor: COLORS.white,
  },

  aligment: {
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: WP(42),
    height: HP(22),
    borderRadius: 15,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    width: WP(42),
    textAlign: "center",
  },

  members: {
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.8,
  },

  footer: {
    height: HP(10),
    marginBottom: 20,
  },
});
