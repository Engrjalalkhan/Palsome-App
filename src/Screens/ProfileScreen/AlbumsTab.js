import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { WP } from "../../../Utils/Resposive";
import { timeDifferenceAlbums } from "../../Components/NewsFeedList/Functions";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import {
  getUserAlbum,
  setUserAlbum,
} from "../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../Services/Constants";
import UploadModal from "./UploadModal";
import { Pressable } from "react-native";
import EditDeleteModal from "../Main/Rooms/components/EditDeleteModal";
import LogoutModal from "../../Components/LogoutModal";
import {
  deleteAlbumReq,
  deletePhotoRequest,
  getAlbumsDataRequest,
} from "../../Redux/actions/RoomActions";
import { Platform } from "react-native";

const AlbumsTab = ({ route }) => {
  const { t } = useTranslation();

  console.log("vid props", route?.params?.userName);
  const currentUserName = route?.params?.userName;
  const showAdd = route?.params?.showAdd;

  const token = useSelector((state) => state.auth.userToken);
  const userAlbum = useSelector((state) => state.blackNewsF.userAlbums);
  const userData = useSelector((state) => state.auth.userData);
  const createAlbumLoading = useSelector(
    (state) => state?.blackNewsF?.createAlumPostLoading
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [disablePagination, setDisablePagination] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [deleteModal, setDeleteModal] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  const [albumDelete, setAlbumDelete] = useState(false);
  const [albumId, setAlbumId] = useState("");

  isAdmin = userData?.id;

  const onPressAdd = () => {
    setShowUploadModal(true);
  };
  const onLongPressImage = (index, item) => {
    setAlbumId(item?.encrypted_id);
    setShowEditDeleteModal(true);
    setPhotoId(item?.media[0]?.encrypted_id);
  };

  const onModalDeletePress = () => {
    setShowEditDeleteModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 0);
    setconfirmModal("open");
  };
  const photodelete = () => {
    console.log("delete photo");
    dispatch(
      deletePhotoRequest({
        token: token,
        photo_id: photoId,
      })
    );
    setDeleteModal(false);
    onRefresh();
  };

  const deleteAlbum = () => {
    dispatch(
      deleteAlbumReq({
        token: token,
        album_id: albumId,
      })
    );
    setDeleteModal(false);
    onRefresh();
  };

  // useEffect(() => {
  //   if (confirmModal === "open") {
  //     setDeleteModal(true);
  //   }
  // }, [confirmModal]);

  const onPressAlbum = (item) => {
    item.user_name = currentUserName;
    navigation.navigate("ShowAlbum", item);
  };
  useEffect(() => {
    // console.log("inuse effe of albums", userAlbum);

    if (Object.keys(userAlbum).length !== 0) {
      let myData = [...userAlbum?.albums?.data];
      if (userAlbum?.coverPic) {
        let coverPicdata = userAlbum?.coverPic;
        coverPicdata.coverPics_count = userAlbum?.coverPics_count;
        myData = [coverPicdata, ...myData];
      }
      if (userAlbum?.profilePic) {
        let profPicdata = userAlbum?.profilePic;
        profPicdata.profilePics_count = userAlbum?.profilePics_count;

        myData = [profPicdata, ...myData];
      }
      if (userAlbum?.timelinePhotosAlbum) {
        let timelinePhotosData = userAlbum?.timelinePhotosAlbum;
        timelinePhotosData.timelinePhotosAlbum_count =
          userAlbum?.timelinePhotosAlbum_count;

        myData = [timelinePhotosData, ...myData];
      }
      showAdd && currentPage == 1
        ? setData([{}, ...myData])
        : setData([...data, ...myData]);
    }
    if (currentPage > userAlbum?.albums?.last_page) {
      setDisablePagination(true);
    }
    // console.log("coverpic", userAlbum?.albums);
  }, [userAlbum]);

  useEffect(() => {
    dispatch(
      getUserAlbum({
        userName: currentUserName,
        token,
        setIsLoading: setIsLoading,
        currentPage: currentPage,
      })
    );
    return () => dispatch(setUserAlbum({}));
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      dispatch(
        getUserAlbum({
          userName: currentUserName,
          token,
          setIsLoading: setIsLoading,
          currentPage: currentPage,
        })
      );
    }
  }, [currentPage]);

  const onRefresh = () => {
    setIsLoading(false);
    setDisablePagination(false);
    setCurrentPage(1);
    setData([]);
    dispatch(
      getUserAlbum({
        userName: currentUserName,
        token,
        setIsLoading: setRefreshLoading,
        currentPage: 1,
      })
    );
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [createAlbumLoading]);

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
        data={data ? data : []}
        numColumns={3}
        refreshing={refreshLoading}
        // onEndReachedThreshold={0.0000000000001}
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
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <>
            {isLoading || refreshLoading ? (
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color={COLORS.primary}
              />
            ) : (
              <>
                {data.length === 0 ? (
                  <View style={styles.noPostsContainer}>
                    <Text style={{ fontSize: 23, color: "Gray" }}>
                      {t("No albums to show")}
                    </Text>
                  </View>
                ) : null}
              </>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {isLoading && currentPage > 1 ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : null}
          </>
        }
        renderItem={({ item, index }) => {
          if (showAdd && index == 0)
            return (
              <TouchableOpacity
                onPress={onPressAdd}
                style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
              >
                <Text style={styles.addTxt}>{t("Create")}</Text>
                <Text style={styles.addTxt}>{t("Album")}</Text>
                <FastImage
                  resizeMode="cover"
                  style={styles.addBtn}
                  source={IMAGES.bluePlusCircle}
                />
              </TouchableOpacity>
            );
          return (
            <TouchableOpacity
              onPress={() => onPressAlbum(item)}
              style={styles.imgContainerStyle}
              onLongPress={() => {
                setAlbumDelete(true);
                isAdmin === item?.media[0]?.user_id
                  ? onLongPressImage(index, item)
                  : null;
              }}
            >
              {item?.media?.[0]?.path ? (
                <FastImage
                  source={{
                    uri: SITE_URL + item?.media?.[0]?.path,
                  }}
                  style={{ flex: 1, backgroundColor: "black" }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ flex: 1, backgroundColor: "black" }} />
              )}

              <View style={styles.albumDetBox}>
                <Text numberOfLines={1} style={styles.albumDetTxt1}>
                  {item?.post_type == "profile_picture"
                    ? "Profile Pictures"
                    : item?.post_type == "profile_cover_picture"
                    ? "Cover Pictures"
                    : item?.album_name
                    ? item?.album_name
                    : "Timeline Pictures"}
                </Text>
                <Text style={styles.albumDetTxt2}>
                  {t("Last Updated")}:{timeDifferenceAlbums(item?.updated_at)}
                </Text>
                <Text style={styles.albumDetTxt3}>
                  {item?.profilePics_count
                    ? item?.profilePics_count
                    : item?.coverPics_count
                    ? item?.coverPics_count
                    : item?.timelinePhotosAlbum_count
                    ? item?.timelinePhotosAlbum_count
                    : item?.media
                    ? item?.media?.length
                    : null}{" "}
                  {t("Files")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {showUploadModal && (
        <UploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"album"}
        />
      )}
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
          message={
            albumDelete
              ? t("You want to delete this album?")
              : t("You want to delete this photo?")
          }
          onYesPress={albumDelete ? deleteAlbum : photodelete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imgContainerStyle: {
    height: WP(45),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
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
  albumDetBox: {
    flex: 0.5,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  albumDetTxt1: { fontWeight: "bold", fontSize: WP(3) },
  albumDetTxt2: { fontSize: WP(2) },
  albumDetTxt3: { fontWeight: "bold", fontSize: WP(2) },
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
export default AlbumsTab;
