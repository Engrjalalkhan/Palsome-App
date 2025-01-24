import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native";
import UploadModal from "./UploadModal";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader";
import { RefreshControl } from "react-native";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import MyHeader from "../../Components/MyHeader";
import { ActivityIndicator } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { SITE_URL } from "../../Services/Constants";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { withoutStringiApiCall2 } from "../../Services/Apis";

const UserClipScreen = ({ route }) => {
  const { t } = useTranslation();
  const NavParams = route?.params;
  const userName = route?.params?.user?.name;

  const navigation = useNavigation();

  const user = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state?.auth?.userToken);

  const [last_page, setLast_page] = useState();
  const [loading, setLoading] = useState(false);
  const [current_page, setCurrent_page] = useState(1);
  const [userReelsData, setUserReelsData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const getUserReelsDataApi = useCallback(async () => {
    try {
      if (current_page === 1) {
        setLoading(true);
      }
      setLoadingMore(true);
      const res = await withoutStringiApiCall2({
        route: `timeline/${userName}/reels?limit=12&page=${current_page}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("Error In UserClip Api", res);
        setLoading(false);
      } else if (res.responseCode == 200) {
        setLast_page(res?.payload?.data?.reels?.last_page);
        let data = [...userReelsData, ...res?.payload?.data?.reels?.data];
        setUserReelsData(data);
        setLoading(false);
        setLoadingMore(false);
      }
    } catch (e) {
      console.log("UserReels error -- ", e.toString());
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      getUserReelsDataApi();
      return () => {};
    }, [current_page])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setCurrent_page(1);
    setUserReelsData([]);
    getUserReelsDataApi();
    setRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (current_page < last_page && !loadingMore) {
      setCurrent_page(current_page + 1);
    }
  };

  const onPressClip = useCallback((item) => {
    navigation.push("ReelsNav", {
      screen: "ReelsIndex",
      params: { item: item, userReels: NavParams?.user?.name },
    });
  });
  const onPressClipUpload = useCallback((item) => {
    setModalVisible(true);
  });

  const renderData = useCallback((item) => {
    return (
      <View style={styles.renderDataContainer}>
        <View style={styles.renderItemCard}>
          <TouchableOpacity
            onPress={() => {
              onPressClip(item);
            }}
          >
            <Image
              source={{ uri: SITE_URL + item?.media[0]?.thumb_path }}
              style={styles.clipThumbnail}
            />
            <View style={[styles.clipCountTextContainer, styles.shadow]}>
              {ICONS.ionIcons("play", COLORS.white, 15)}
              <Text style={styles.clipText}>{item?.reel_user_views_count}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, []);
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={`${NavParams?.user?.first_name}'s ${t("Clips")}`}
        clipUpload={user?.id === NavParams?.user?.user_id && true}
        onPressClipUpload={() => {
          onPressClipUpload();
        }}
      />
      {userReelsData?.length === 0 && !loading && (
        <View style={styles.noUserClipMainContainer}>
          {ICONS.ionIcons("videocam", COLORS.primary, 50)}
          <View style={styles.noUserReelsDataContainer}>
            <Text style={styles.noClipText}>{t("No Clips yet")} </Text>
          </View>
          {user?.id === NavParams?.user?.user_id && (
            <TouchableOpacity
              style={styles.createClipContainer}
              onPress={() => {
                onPressClipUpload();
              }}
            >
              <Text style={{ color: COLORS.white }}>{t("Create Clip")}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={userReelsData}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => renderData(item)}
          numColumns={3}
          onEndReached={!loadingMore ? handleLoadMore : null}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListFooterComponent={renderFooter}
        />
      )}
      {modalVisible && (
        <UploadModal
          showUploadModal={modalVisible}
          setShowUploadModal={setModalVisible}
          uploadModalType={"video"}
          reel
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: 2,
  },
  renderDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
  },
  renderItemCard: {
    backgroundColor: COLORS.primary,
    height: HP(25),
    width: WP(32.9),
  },
  clipThumbnail: {
    height: HP(25),
    width: "100%",
    resizeMode: "cover",
  },
  clipCountTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.95,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clipText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 3,
  },
  noUserReelsDataContainer: {
    // backgroundColor: COLORS.white,
    borderRadius: 8,
    // padding: 16,
    // margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 1,
  },
  noClipText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  noUserClipMainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  createClipContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    height: 50,
    width: 110,
    borderRadius: 10,
    margin: 20,
  },
});

export default UserClipScreen;
