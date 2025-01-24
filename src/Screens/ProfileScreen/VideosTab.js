import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import FastImage from "react-native-fast-image";

import { WP } from "../../../Utils/Resposive";
import {
  getUserVideos,
  setUserVideos,
} from "../../Redux/actions/NewsFeedActions";
import UploadModal from "./UploadModal";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";
import CustomPlayIcon from "../../Components/CustomPlayIcon";

const VideosTab = ({ route }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const showAdd = route?.params?.showAdd;
  const currentUserName = route?.params?.userName;

  const token = useSelector((state) => state.auth.userToken);
  const userVideos = useSelector((state) => state.blackNewsF.userVideos);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [disablePagination, setDisablePagination] = useState(false);

  const onPressAdd = () => {
    setShowUploadModal(true);
  };
  const onPressVideo = (item, index) => {
    navigation.navigate("VideoFullViewScreen", {
      item: item,
      isProfile: true,
      userName: currentUserName,
      videoIndex: index,
      data: data,
    });
  };
  const getVideos = () => {
    dispatch(
      getUserVideos({
        userName: currentUserName,
        token,
        setIsLoading: setIsLoading,
        currentPage: currentPage,
      })
    );
  };
  const onRefresh = () => {
    dispatch(
      getUserVideos({
        userName: currentUserName,
        token,
        setIsLoading: setRefreshLoading,
        currentPage: currentPage,
      })
    );
  };
  useEffect(() => {
    getVideos();
    return () => dispatch(setUserVideos({}));
  }, [currentPage]);
  useEffect(() => {
    // console.log("inuseeff user Videos", userVideos);
    if (userVideos?.videos) {
      showAdd && currentPage == 1
        ? setData([{}, ...userVideos?.videos?.data])
        : setData([...data, ...userVideos?.videos?.data]);
    }
    if (currentPage > userVideos?.videos?.last_page) {
      setDisablePagination(true);
    }
  }, [userVideos]);
  const handelOnEndReached = () => {
    disablePagination
      ? null
      : isLoading
      ? null
      : setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1, marginBottom: Platform.OS === "android" ? 10 : 0 }}
        data={data}
        numColumns={3}
        refreshing={refreshLoading}
        onEndReached={handelOnEndReached}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
        ListEmptyComponent={
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <View style={styles.noPostsContainer}>
                <Text style={{ fontSize: 23, color: COLORS.grey }}>
                  {t("No videos to show")}
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {isLoading && currentPage > 1 ? (
              <View style={{ margin: 5 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : null}
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (route?.params?.showAdd) {
            if (index == 0)
              return (
                <TouchableOpacity
                  onPress={onPressAdd}
                  style={[
                    styles.imgContainerStyle,
                    styles.addNewContainerStyle,
                  ]}
                >
                  <Text style={styles.addTxt}>{t("Add")}</Text>
                  <Text style={styles.addTxt}>{t("Videos")}</Text>
                  <FastImage
                    resizeMode="cover"
                    style={styles.addBtn}
                    source={IMAGES.bluePlusCircle}
                  />
                </TouchableOpacity>
              );
          }
          return (
            <TouchableOpacity onPress={() => onPressVideo(item, index)}>
              <FastImage
                source={{
                  uri:
                    SITE_URL +
                    "/converted_videos/thumbnails/" +
                    item.thumb_path,
                }}
                style={styles.imgContainerStyle}
              >
                <CustomPlayIcon
                  sizeCicle={WP(10)}
                  sizeIcon={WP(4)}
                  onPress={() => onPressVideo(item, index)}
                />
              </FastImage>
            </TouchableOpacity>
          );
        }}
      />
      {showUploadModal && (
        <UploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"video"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imgContainerStyle: {
    height: WP(30.7),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: { marginTop: WP(2) },
  columnWrapperStyle: { marginLeft: WP(2), marginBottom: WP(2) },
  addNewContainerStyle: { justifyContent: "center", alignItems: "center" },
  addBtn: {
    width: 28,
    height: 28,

    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  addTxt: { fontSize: 14, fontFamily: "Roboto-Bold", textTransform: "none" },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
export default VideosTab;
