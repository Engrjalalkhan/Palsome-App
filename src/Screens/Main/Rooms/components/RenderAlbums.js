import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HP, WP } from "../../../../../Utils/Resposive";
import TopTabs from "./TopTabs";
import { SITE_URL } from "../../../../Services/Constants";
import {
  deletePhotoRequest,
  deleteAlbumReq,
  showRoomRequest,
  getAlbumsDataRequest,
  getPhotosData,
} from "../../../../Redux/actions/RoomActions";
import FastImage from "react-native-fast-image";
import EditDeleteModal from "./EditDeleteModal";
import LogoutModal from "../../../../Components/LogoutModal";
import UploadModal from "../../../ProfileScreen/UploadModal";
import { timeDifferenceComments } from "../../../../Components/NewsFeedList/Functions";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import RoomModal from "./RoomModal";
import { useTranslation } from "react-i18next";

const RenderAlbums = ({ isAdmin, room_encrypted_id }) => {
  const albumsData = useSelector((state) => state.roomsRed.albumsData);

  const navigation = useNavigation();
  const { t } = useTranslation();

  // console.log("albumsData::>>", albumsData);

  const photosData = useSelector((state) => state.roomsRed.photosData);
  const token = useSelector((state) => state.auth.userToken);
  const createAlbumLoading = useSelector(
    (state) => state?.blackNewsF?.createAlumPostLoading
  );

  const dispatch = useDispatch();

  const [albums, setAlbums] = useState(false);
  const [photos, setPhotos] = useState(false);
  const [photosFlatlistData, setPhotosFlatlistData] = useState([]);
  const [albumsFlatlistData, setAlbumsFlatlistData] = useState([]);
  const [current_page, setCurrentPage] = useState(1);
  const [noOfCols, setNoOfCols] = useState(3);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [photoId, setPhotoId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [albumDelete, setAlbumDelete] = useState(false);
  const [albumId, setAlbumId] = useState(null);

  const albumsArray = albumsData?.data ? albumsData?.data : [];
  const photosArray = photosData?.data ? photosData?.data : [];

  const dispatchAlbum = () => {
    dispatch(
      getAlbumsDataRequest({
        token,
        room_id: room_encrypted_id,
      })
    );
  };

  useEffect(() => {
    dispatchAlbum();
  }, [createAlbumLoading]);

  const dispatchPhoto = () => {
    dispatch(
      getPhotosData({
        room_id: room_encrypted_id,
        token: token,
      })
    );
  };

  useEffect(() => {
    dispatchPhoto();
  }, [createAlbumLoading]);

  useEffect(() => {
    if (isAdmin === true) {
      setPhotosFlatlistData([{}, ...photosArray]);
      setAlbumsFlatlistData([{}, ...albumsArray]);
    } else {
      setPhotosFlatlistData([...photosArray]);
      setAlbumsFlatlistData([...albumsArray]);
    }
  }, [albumsData, photosData]);

  const onPressAddAlbum = () => {
    setShowUploadModal(true);
  };

  const onAlbumsPressed = () => {
    setAlbums(true);
    setPhotos(false);
  };

  const onPhotosPressed = () => {
    setAlbums(false);
    setPhotos(true);
  };

  useEffect(() => {
    setAlbums(true);
  }, []);

  const renderAlbumData = ({ item, index }) => {
    if (isAdmin === true && index === 0) {
      return (
        <TouchableOpacity
          onPress={onPressAddAlbum}
          style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
        >
          <Text style={styles.addTxt}>{t("Create")}</Text>
          <Text style={styles.addTxt}>{t("Albums")}</Text>
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
        onLongPress={() => {
          setShowEditDeleteModal(true);
          setAlbumDelete(true);
          setAlbumId(item.encrypted_id);
        }}
        onPress={() =>
          navigation.navigate("PreviewAlbum", { item, room_encrypted_id })
        }
        style={styles.imgContainerStyle}
      >
        {item?.media?.[0]?.path ? (
          <>
            {item?.media?.length ? (
              <FastImage
                resizeMode="cover"
                style={styles.renderPhotoDataImage}
                source={{ uri: `${SITE_URL}${item?.media?.[0]?.path}` }}
              />
            ) : (
              <Image
                resizeMode="cover"
                style={styles.renderPhotoDataImage}
                source={IMAGES.blankCover}
              />
            )}
          </>
        ) : (
          <View style={{ flex: 1, backgroundColor: COLORS.black }} />
        )}
        <Text numberOfLines={1} style={styles.albumDetTxt1}>
          {item?.album_name}
        </Text>
        <Text numberOfLines={1} style={styles.albumDetTxt2}>
          {t("Last Updated")}: {timeDifferenceComments(item?.updated_at)}
        </Text>
        <Text numberOfLines={1} style={styles.albumDetTxt3}>
          {item?.media?.length} {t("files")}
        </Text>
      </TouchableOpacity>
    );
  };

  const onPressDeleteIcon = (id) => {
    Alert.alert(
      t("Delete"),
      t("Are you sure you want to delete this photo?"),
      [
        {
          text: t("Cancel"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: t("OK"),
          onPress: () => {
            dispatch(deletePhotoRequest({ token, photo_id: id }));
            //close screen
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const OnPressImage = (index, item) => {
    navigation.navigate("ImageShowScreen", {
      url: SITE_URL + item?.media[0]?.path,
      deleteIcon: true,
      deleteImage: () => onPressDeleteIcon(item?.media[0]?.encrypted_id),
    });
  };

  const onLongPressImage = (index, item) => {
    setAlbumDelete(false);
    setShowEditDeleteModal(true);
    setPhotoId(item?.media[0]?.encrypted_id);
  };

  const renderPhotoData = ({ item, index }) => {
    const deletePhoto = () => {
      console.log("Photo Delete");
      dispatch(
        deletePhotoRequest({
          token: token,
          photo_id: photoId,
        })
      );
    };

    const onPressAddPhoto = () => {
      setShowPhotoModal(true);
    };

    if (isAdmin === true && index === 0) {
      return (
        <TouchableOpacity
          onPress={onPressAddPhoto}
          style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
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
      <Pressable
        style={styles.renderPhotoDataContainer}
        onPress={() => OnPressImage(index, item)}
        onLongPress={() => (isAdmin ? onLongPressImage(index, item) : null)}
      >
        <FastImage
          source={{ uri: SITE_URL + item?.media[0]?.path }}
          style={styles.renderPhotoDataImage}
        />
        {/* <TouchableOpacity
          style={styles.deletePhotoContainer}
          onPress={deletePhoto}
        >
          <Entypo name="cross" size={26} color{COLORS.primary} />
        </TouchableOpacity> */}
      </Pressable>
    );
  };

  const onModalDeletePress = () => {
    setShowEditDeleteModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 0);
    setconfirmModal("open");
  };

  // useEffect(() => {
  //   if (confirmModal === "open") {
  //     setDeleteModal(true);
  //   }
  // }, [confirmModal]);

  const photodelete = () => {
    console.log("delete photo");
    dispatch(
      deletePhotoRequest({
        token: token,
        photo_id: photoId,
      })
    );
    dispatchPhoto();
    setDeleteModal(false);
  };

  const deleteAlbum = () => {
    // alert("delete album");

    dispatch(
      deleteAlbumReq({
        token: token,
        album_id: albumId,
      })
    );

    dispatch(
      getAlbumsDataRequest({
        token: token,
        id: room_encrypted_id,
      })
    );
    dispatchAlbum();
    setDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TopTabs
          albums
          onAlbumsPressed={onAlbumsPressed}
          onPhotosPressed={onPhotosPressed}
        />
      </View>

      {albums ? (
        <View>
          {albumsFlatlistData?.length ? (
            <FlatList
              numColumns={noOfCols}
              key={noOfCols}
              data={albumsFlatlistData}
              renderItem={renderAlbumData}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noAlbums}>
              <Text style={styles.noAlbumText}>{t("No Albums to show")}</Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <FlatList
            numColumns={noOfCols}
            key={noOfCols}
            data={photosFlatlistData}
            renderItem={renderPhotoData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.noAlbums}>
                <Text style={styles.noAlbumText}>{t("No Photos to show")}</Text>
              </View>
            )}
          />
        </View>
      )}

      {showEditDeleteModal && (
        <EditDeleteModal
          modalVisible={showEditDeleteModal}
          setModalVisible={setShowEditDeleteModal}
          onDeletePress={onModalDeletePress}
        />
      )}

      {/* {console.log("deleteModal", deleteModal)} */}
      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          setIsVisible={setDeleteModal}
          // title="Delete Photo"
          message={
            albumDelete
              ? "You want to delete this album?"
              : "You don't want to delete this photo"
          }
          onYesPress={albumDelete ? deleteAlbum : photodelete}
        />
      )}

      {showUploadModal && (
        <RoomModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"album"}
          room
          room_encrypted_id={room_encrypted_id}
        />
      )}

      {showPhotoModal && (
        <RoomModal
          showUploadModal={showPhotoModal}
          setShowUploadModal={setShowPhotoModal}
          uploadModalType={"photo"}
          room
          room_encrypted_id={room_encrypted_id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: { backgroundColor: "white" },
  noAlbums: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    marginVertical: 10,
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
  noAlbumText: { fontSize: 23, color: "Gray" },
  renderPhotoDataContainer: {
    marginVertical: HP(1.5),
    marginLeft: 20,
    alignSelf: "center",
    borderWidth: 1,
  },
  renderPhotoDataImage: {
    width: WP(26),
    height: HP(13),
    resizeMode: "cover",
    marginBottom: 5,
  },
  deletePhotoContainer: {
    position: "absolute",
    right: 3,
    top: 3,
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    borderRadius: 50,
  },
  imgContainerStyle: {
    width: WP(28),
    // height: HP(18.8),
    borderWidth: 1,
    marginLeft: 17,
    marginTop: 15,
    borderColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  addNewContainerStyle: { justifyContent: "center", alignItems: "center" },
  addTxt: { fontSize: 14, fontFamily: "Roboto-Bold", textTransform: "none" },

  albumDetTxt1: { fontWeight: "bold", fontSize: WP(3) },
  albumDetTxt2: { fontSize: WP(2), marginVertical: 3 },
  albumDetTxt3: { fontWeight: "bold", fontSize: WP(2.5) },
});
export default RenderAlbums;
