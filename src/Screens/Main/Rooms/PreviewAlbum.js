import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteAlbumPhoto,
  previewAlbumReq,
  previewAlbumSuccess,
} from "../../../Redux/actions/RoomActions";
import MyHeader from "../../../Components/MyHeader";
import { useNavigation } from "@react-navigation/native";
import { WP } from "../../../../Utils/Resposive";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../../Services/Constants";
import Loader from "./components/Loader";
import EditDeleteModal from "./components/EditDeleteModal";
import LogoutModal from "../../../Components/LogoutModal";
import { COLORS } from "../../../Constants/Colors";
import CustomPlayIcon from "../../../Components/CustomPlayIcon";

const PreviewAlbum = ({ route }) => {
  const navigation = useNavigation();
  const NavParams = route.params.item;

  const album_id = route.params.item.encrypted_id;
  const room_encrypted_id = route.params.room_encrypted_id;
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [containsVideo, setcontainsVideo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [photo_id, setPhoto_id] = useState(null);
  const { previewAlbumData } = useSelector((state) => state.roomsRed);

  //   console.log("PreviewAlbum::>>", previewAlbumData);

  // const OnPressImage = (item) => {
  //   navigation.navigate("ImageShowScreen", {
  //     url: SITE_URL + item?.path,
  //     // initialIndex: index,
  //     // containsVideo: containsVideo,
  //   });
  // };

  const OnPressImage = (index) => {
    navigation.navigate("AlbumPhotoSwiper", {
      data: data,
      initialIndex: index,
      containsVideo: containsVideo,
    });
  };

  const onPressVideo = (item) => {
    // console.log(item);
    navigation.navigate("VideoFullViewScreen", { item: item, isProfile: true });
  };

  const getAlbums = () => {
    dispatch(
      previewAlbumReq({
        token,
        album_id,
        room_encrypted_id,
        setLoading,
      })
    );
  };

  useEffect(() => {
    getAlbums();

    return () => dispatch(previewAlbumSuccess({}));
  }, []);

  useEffect(() => {
    setData(NavParams?.media);
  }, [previewAlbumData]);

  // const longPress = (item) => {
  //   setPhoto_id(item.encrypted_id);
  //   setShowEditDeleteModal(true);
  // };

  const onDeletePress = () => {
    setShowEditDeleteModal(false);
    setconfirmModal("open");
  };

  useEffect(() => {
    if (confirmModal === "open") {
      setDeleteModal(true);
    }
  }, [confirmModal]);

  const onPressYes = () => {
    setDeleteModal(false);
    setconfirmModal("close");

    dispatch(
      deleteAlbumPhoto({
        token,
        photo_id,
        album_id,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={`${
          NavParams?.post_type == "profile_picture"
            ? "Profile Pictures"
            : NavParams?.post_type == "profile_cover_picture"
            ? "Cover Pictures"
            : NavParams?.album_name
            ? NavParams?.album_name
            : null
        }`}
      />
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          style={{ flex: 1, marginHorizontal: WP(2) }}
          data={data}
          numColumns={3}
          contentContainerStyle={styles.contentContainerStyle}
          columnWrapperStyle={styles.columnWrapperStyle}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Photos to show</Text>
              </View>
            </>
          }
          renderItem={({ item, index }) => {
            return (
              <>
                {item.post_file_type == "image" ? (
                  <TouchableOpacity
                    // onLongPress={() => longPress(item)}
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
                  <TouchableOpacity onPress={() => onPressVideo(item)}>
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
                        onPress={() => onPressVideo(item)}
                      />
                    </FastImage>
                  </TouchableOpacity>
                )}
              </>
            );
          }}
        />
      )}

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
export default PreviewAlbum;
