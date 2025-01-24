import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import Loader from "../Rooms/components/Loader";
import MyHeader from "../../../Components/MyHeader";
import LogoutModal from "../../../Components/LogoutModal";
import CustomPlayIcon from "../../../Components/CustomPlayIcon";
import EditDeleteModal from "../Rooms/components/EditDeleteModal";

import { WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { BASE_URL, SITE_URL } from "../../../Services/Constants";

const PreviewGroupAlbums = ({ route }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const { isAdmin, groupId, albumId } = route.params;
  const token = useSelector((state) => state.auth.userToken);

  const [data, setData] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo_id, setPhoto_id] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [containsVideo, setcontainsVideo] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);

  useEffect(() => {
    getGroupAlbums();
  }, [isFocused]);

  useEffect(() => {
    if (confirmModal === "open") {
      setDeleteModal(true);
    }
  }, [confirmModal]);

  const getGroupAlbums = () => {
    const url = `${BASE_URL}/groups/${groupId}/album_photos/${albumId}`;

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
          if (res?.responseCode == 200) {
            setLoading(false);
            setAlbum(res?.payload?.data?.album);
            setData(res?.payload?.data?.album_medias?.data);
          } else {
            setLoading(false);
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

  const OnPressImage = (index) => {
    navigation.navigate("AlbumPhotoSwiper", {
      data: data,
      initialIndex: index,
      containsVideo: containsVideo,
    });
  };

  const onPressVideo = (item) => {
    const newItem = {
      ...item,
      fromGroup: true,
      isAdmin: isAdmin,
      albumId: albumId,
    };

    navigation.navigate("VideoFullViewScreen", { item: newItem });
  };

  const longPress = (item) => {
    if (isAdmin) {
      setPhoto_id(item.encrypted_id);
      setShowEditDeleteModal(true);
    }
  };

  const onDeletePress = () => {
    setShowEditDeleteModal(false);
    setconfirmModal("open");
  };

  const deletePhoto = () => {
    const url = `${BASE_URL}/groups/delete_photo/${photo_id}`;

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
            let index = data.findIndex((el) => el.encrypted_id == photo_id);

            let photos = [...data];
            photos.splice(index, 1);

            setData(photos);

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

  const onPressYes = () => {
    setDeleteModal(false);
    setconfirmModal("close");

    deletePhoto();
  };

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={album?.album_name}
      />

      <FlatList
        data={data}
        numColumns={3}
        style={{ flex: 1, marginHorizontal: WP(2) }}
        columnWrapperStyle={styles.columnWrapperStyle}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Photos to show</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          return (
            <>
              {item.post_file_type == "image" ? (
                <TouchableOpacity
                  onLongPress={() => longPress(item)}
                  onPress={() => OnPressImage(index)}
                >
                  <FastImage
                    source={{
                      uri: SITE_URL + item?.path,
                    }}
                    style={styles.imgContainerStyle}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => OnPressImage(index)}>
                  {containsVideo ? null : setcontainsVideo(true)}

                  <FastImage
                    source={{
                      uri:
                        SITE_URL +
                        "converted_videos/thumbnails/" +
                        item?.thumb_path,
                    }}
                    style={styles.imgContainerStyle}
                  >
                    <CustomPlayIcon
                      sizeCicle={WP(10)}
                      sizeIcon={WP(4)}
                      onPress={() => null}
                    />
                  </FastImage>
                </TouchableOpacity>
              )}
            </>
          );
        }}
      />

      {showEditDeleteModal && (
        <EditDeleteModal
          modalVisible={showEditDeleteModal}
          setModalVisible={setShowEditDeleteModal}
          onDeletePress={onDeletePress}
        />
      )}

      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          setIsVisible={setDeleteModal}
          title={"Delete Album"}
          message={"Are you sure you want to delete this Photo?"}
          onYesPress={onPressYes}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  imgContainerStyle: {
    height: WP(30.7),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: WP(50),
  },
  emptyText: { fontSize: 16, fontFamily: "Roboto-Bold" },
});
export default PreviewGroupAlbums;
