import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import TopTabs from "./TopTabs";
import GroupModal from "./GroupModal";
import { useTranslation } from "react-i18next";
import Loader from "../../Rooms/components/Loader";
import LogoutModal from "../../../../Components/LogoutModal";
import EditDeleteModal from "../../Rooms/components/EditDeleteModal";
import { timeDifferenceComments } from "../../../../Components/NewsFeedList/Functions";

import { HP, WP } from "../../../../../Utils/Resposive";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

const AlbumsGroupTL = ({ isAdmin, group_encrypted_id, gropuPrivacy }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const [photoId, setPhotoId] = useState(null);
  const [albumId, setAlbumId] = useState(null);
  const [albumDelete, setAlbumDelete] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);

  const [albums, setAlbums] = useState(true);
  const [loading, setLoading] = useState(true);
  const [eidtAlbum, setEditAlbum] = useState("");
  const [albumsData, setAlbumsData] = useState([]);
  const [photosData, setPhotosData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAlbums();
  }, [isFocused]);

  const getAlbums = () => {
    const url = `${BASE_URL}/groups/${group_encrypted_id}/album`;

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
            if (isAdmin) {
              setAlbumsData([{}, ...res?.payload?.data?.albums?.data]);
              setPhotosData([{}, ...res?.payload?.data?.photos?.data]);
            } else {
              setAlbumsData(res?.payload?.data?.albums?.data);
              setPhotosData(res?.payload?.data?.photos?.data);
            }
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
      console.log("albumsDataError: ", error);
    }
  };

  const onPressAddAlbum = () => {
    setShowUploadModal(true);
  };

  const onAlbumsPressed = () => {
    setAlbums(true);
  };

  const onPhotosPressed = () => {
    setAlbums(false);
  };

  const renderCreateAlbum = () => (
    <TouchableOpacity
      onPress={onPressAddAlbum}
      style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
    >
      <FastImage
        resizeMode="cover"
        style={styles.addBtn}
        source={IMAGES.bluePlusCircle}
      />

      <Text style={styles.addTxt}>{t("Create an Album")}</Text>
      <Text style={styles.addTxt2}>{t("It only takes a few minutes!")}</Text>
    </TouchableOpacity>
  );

  const renderAlbumData = ({ item, index }) => {
    if (isAdmin === true && index === 0) return renderCreateAlbum();

    return (
      <TouchableOpacity
        onLongPress={() => {
          if (isAdmin) {
            setShowEditDeleteModal(true);
            setAlbumDelete(true);
            setAlbumId(item.encrypted_id);
          }
        }}
        onPress={() => {
          navigation.navigate("PreviewGroupAlbums", {
            isAdmin: isAdmin,
            groupId: group_encrypted_id,
            albumId: item?.encrypted_id,
          });
        }}
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
            setPhotoId(id);
            photodelete(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const OnPressImage = (item) => {
    navigation.navigate("ImageShowScreen", {
      url: SITE_URL + item?.media[0]?.path,
      deleteIcon: isAdmin,
      deleteImage: () => onPressDeleteIcon(item?.media[0]?.encrypted_id),
    });
  };

  const onLongPressImage = (item) => {
    setShowEditDeleteModal(true);
    setPhotoId(item?.media[0]?.encrypted_id);
  };

  const renderPhotoData = ({ item, index }) => {
    const onPressAddPhoto = () => {
      setShowPhotoModal(true);
    };

    if (isAdmin === true && index === 0) {
      return (
        <TouchableOpacity
          onPress={onPressAddPhoto}
          style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
        >
          <FastImage
            resizeMode="cover"
            style={styles.addBtn}
            source={IMAGES.bluePlusCircle}
          />

          <Text style={styles.addTxt}>{t("Add a Photo")}</Text>
          <Text style={styles.addTxt2}>
            {t("It only takes a few minutes!")}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Pressable
        style={styles.renderPhotoDataContainer}
        onPress={() => OnPressImage(item)}
        onLongPress={() => (isAdmin ? onLongPressImage(item) : null)}
      >
        <FastImage
          source={{ uri: SITE_URL + item?.media[0]?.path }}
          style={styles.renderPhotoDataImage}
        />
      </Pressable>
    );
  };

  const onModalEditPress = () => {
    let albumName = albumsData.find(
      (el) => el.encrypted_id == albumId
    )?.album_name;

    setEditAlbum(albumName);
    setShowEditDeleteModal(false);

    setTimeout(() => {
      setShowUploadModal(true);
    }, 100);
  };

  const onModalDeletePress = () => {
    setShowEditDeleteModal(false);
    setconfirmModal("open");
  };

  useEffect(() => {
    if (confirmModal === "open") {
      setDeleteModal(true);
    }
  }, [confirmModal]);

  const refreshAlbumsData = () => {
    getAlbums();
  };

  const photodelete = (goBack = false) => {
    setDeleteModal(false);
    setconfirmModal("close");

    const url = `${BASE_URL}/groups/delete_photo/${photoId}`;

    try {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            setPhotoId(null);
            if (goBack) navigation.goBack();
            else refreshAlbumsData();

            showMessage({
              message: "Photo deleted",
              type: "success",
            });
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("albumsDataError: ", error);
    }
  };

  const deleteAlbum = () => {
    setDeleteModal(false);
    setconfirmModal("close");
    const url = `${BASE_URL}/groups/delete_album/${albumId}`;

    try {
      fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            setAlbumId(null);
            refreshAlbumsData();

            showMessage({
              message: "Album deleted",
              type: "success",
            });
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("albumsDataError: ", error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
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
          {albumsData?.length ? (
            <FlatList
              numColumns={3}
              key={3}
              data={albumsData}
              renderItem={renderAlbumData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              // ListFooterComponent={() => <View style={{ height: HP(5) }} />}
            />
          ) : isAdmin === true ? (
            renderCreateAlbum()
          ) : (
            <View style={styles.noAlbums}>
              <Text style={styles.noAlbumText}>{t("No Albums to show")}</Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <FlatList
            numColumns={3}
            key={3}
            data={photosData}
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
          group={albums}
          modalVisible={showEditDeleteModal}
          setModalVisible={setShowEditDeleteModal}
          onEditPress={onModalEditPress}
          onDeletePress={onModalDeletePress}
        />
      )}

      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          setIsVisible={setDeleteModal}
          message="You want to delete this item?"
          onYesPress={albumDelete ? deleteAlbum : photodelete}
        />
      )}

      {showUploadModal && (
        <GroupModal
          showUploadModal={showUploadModal}
          setShowUploadModal={() => {
            setShowUploadModal(false);
            setEditAlbum("");
          }}
          uploadModalType={"album"}
          group
          group_encrypted_id={group_encrypted_id}
          refreshAlbumsData={refreshAlbumsData}
          eidtAlbum={eidtAlbum}
          albumId={albumId}
          gropuPrivacy={gropuPrivacy}
          showMessage={() => {
            showMessage({
              message: t("Uploading..."),
              type: "info",
            });
          }}
        />
      )}

      {showPhotoModal && (
        <GroupModal
          showUploadModal={showPhotoModal}
          setShowUploadModal={setShowPhotoModal}
          uploadModalType={"photo"}
          group
          group_encrypted_id={group_encrypted_id}
          refreshAlbumsData={refreshAlbumsData}
          eidtAlbum={""}
          gropuPrivacy={gropuPrivacy}
          showMessage={() => {
            showMessage({
              message: t("Uploading..."),
              type: "info",
            });
          }}
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
    marginLeft: 20,
    marginTop: 15,
    borderColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  addBtn: {
    width: 28,
    height: 28,
    borderWidth: 2,
    marginBottom: 5,
    borderRadius: 100,
    borderColor: COLORS.primary,
  },

  addNewContainerStyle: {
    height: HP(18.8),
    alignItems: "center",
    justifyContent: "center",
  },

  addTxt: { fontSize: 14, fontFamily: "Roboto-Bold", textTransform: "none" },

  addTxt2: {
    fontSize: 12,
    marginTop: 3,
    textAlign: "center",
    fontFamily: "Roboto",
  },

  albumDetTxt1: { fontWeight: "bold", fontSize: WP(3) },
  albumDetTxt2: { fontSize: WP(2), marginVertical: 3 },
  albumDetTxt3: { fontWeight: "bold", fontSize: WP(2.5) },
});
export default AlbumsGroupTL;
