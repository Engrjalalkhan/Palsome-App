import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import {
  getUserPhotos,
  setUserPhotos,
} from "../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../Services/Constants";

import UploadModal from "./UploadModal";
import EditDeleteModal from "../Main/Rooms/components/EditDeleteModal";
import LogoutModal from "../../Components/LogoutModal";
import { deletePhotoRequest } from "../../Redux/actions/RoomActions";

const PhotosTab = ({ route }) => {
  const { t } = useTranslation();
  // console.log("photo props", route?.params?.userName);
  const currentUserName = route?.params?.userName;
  const userData = useSelector((state) => state.auth.userData);

  const showAdd = route?.params?.showAdd;

  const token = useSelector((state) => state.auth.userToken);
  const userPhotos = useSelector((state) => state.blackNewsF.userPhotos);
  const createAlbumLoading = useSelector(
    (state) => state?.blackNewsF?.createAlumPostLoading
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [disablePagination, setDisablePagination] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  const [confirmModal, setconfirmModal] = useState("close");
  const [deleteModal, setDeleteModal] = useState(false);

  isAdmin = userData?.id;

  const onPressAdd = () => {
    setShowUploadModal(true);
  };

  const OnPressImage = (index) => {
    navigation.navigate("AlbumPhotoSwiper", {
      data: data,
      initialIndex: showAdd ? index : index,
    });
  };

  const onLongPressImage = (index, item) => {
    setShowEditDeleteModal(true);
    setPhotoId(item?.encrypted_id);
  };

  const onModalDeletePress = () => {
    setShowEditDeleteModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 0);
  };

  const getPhotos = () => {
    dispatch(
      getUserPhotos({
        userName: currentUserName,
        token,
        setIsLoading: setIsLoading,
        currentPage: currentPage,
      })
    );
  };
  const onRefresh = () => {
    dispatch(
      getUserPhotos({
        userName: currentUserName,
        token,
        setIsLoading: setRefreshLoading,
        currentPage: currentPage,
      })
    );
  };

  useEffect(() => {
    dispatch(
      getUserPhotos({
        userName: currentUserName,
        token,
        currentPage: currentPage,
      })
    );
  }, [createAlbumLoading]);

  const photodelete = () => {
    dispatch(
      deletePhotoRequest({
        token: token,
        photo_id: photoId,
      })
    );
    onRefresh();

    setDeleteModal(false);
  };
  useEffect(() => {
    getPhotos();
    return () => dispatch(setUserPhotos({}));
  }, [currentPage]);

  useEffect(() => {
    // console.log("inuseeff photos", userPhotos);

    if (userPhotos?.photos) {
      // console.log("inuseeff", userPhotos?.photos);
      showAdd && currentPage == 1
        ? setData([{}, ...userPhotos?.photos?.data])
        : setData([...data, ...userPhotos?.photos?.data]);
    }
    if (currentPage > userPhotos?.photos?.last_page) {
      setDisablePagination(true);
    }
  }, [userPhotos]);
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
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
        // onEndReachedThreshold={0.0000000000001}

        ListFooterComponent={
          <>
            {isLoading && currentPage > 1 ? (
              <View style={{ margin: 5 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : null}
          </>
        }
        onEndReached={handelOnEndReached}
        refreshing={refreshLoading}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <View style={styles.noPostsContainer}>
                <Text style={{ fontSize: 23, color: "Gray" }}>
                  {t("No photos to show")}
                </Text>
              </View>
            )}
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
                  <Text style={styles.addTxt}>{t("Photos")}</Text>
                  <FastImage
                    resizeMode="cover"
                    style={styles.addBtn}
                    source={IMAGES.bluePlusCircle}
                  />
                </TouchableOpacity>
              );
          }
          return (
            <TouchableOpacity
              onPress={() => OnPressImage(index)}
              onLongPress={() => {
                isAdmin === item?.user_id
                  ? onLongPressImage(index, item)
                  : null;
              }}
            >
              <FastImage
                source={{
                  uri: SITE_URL + item.path,
                }}
                style={styles.imgContainerStyle}
              />
            </TouchableOpacity>
          );
        }}
      />
      {showUploadModal && (
        <UploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"photo"}
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
          message="You want to delete this photo?"
          onYesPress={photodelete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  imgContainerStyle: {
    height: WP(30.7),
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
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
export default PhotosTab;
