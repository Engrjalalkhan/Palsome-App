import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FlatListItemSeparator } from "../../../../Components/NewsFeedList/Functions";
import { useSelector } from "react-redux";
import { HP, WP } from "../../../../../Utils/Resposive";
import FastImage from "react-native-fast-image";
import { SITE_URL } from "../../../../Services/Constants";
import CustomPlayIcon from "../../../../Components/CustomPlayIcon";
import Loader from "./Loader";
import { useNavigation } from "@react-navigation/native";
import { clearVideosData } from "../../../../Redux/actions/RoomActions";
import { useDispatch } from "react-redux";
import { getVideosReq } from "../../../../Redux/actions/RoomActions";
import DeleteModal from "./EditDeleteModal";
import AlertModal from "../../../../Components/LogoutModal";
import { deletePost } from "../../../../Redux/actions/NewsFeedActions";
import UploadModal from "../../../ProfileScreen/UploadModal";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import RoomModal from "./RoomModal";
import { useTranslation } from "react-i18next";

const RenderVideos = ({ isAdmin, room_id }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const videosData = useSelector((state) => state?.roomsRed?.videosData);

  const [current_page, setCurrentPage] = useState(1);
  const [total_pages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [disablePagination, setDisablePagination] = useState(false);
  const [noOfCols, setNoOfCols] = useState(3);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [confirmModal, setconfirmModal] = useState("close");
  const [post_id, setPostId] = useState(null);

  const token = useSelector((state) => state.auth.userToken);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLongPress = (item) => {
    setPostId(item?.encrypted_id);
    setShowDeleteModal(true);
  };

  const onPressVideo = (item) => {
    navigation?.navigate("VideoFullViewScreen", item);
  };

  const onPressAdd = () => {
    setShowUploadModal(true);
  };

  const onModalDeletePress = () => {
    setShowDeleteModal(false);
    setconfirmModal("open");
  };

  useEffect(() => {
    if (confirmModal === "open") {
      setShowAlertModal(true);
    }
  }, [confirmModal]);

  const getVideoDataAPICall = () => {
    dispatch(
      getVideosReq({
        token: token,
        room_id: room_id,
        setLoading: setLoading,
      })
    );
  };

  useEffect(() => {
    if (!videosData?.videos?.data || videosData.videos.data.length === 0) {
      setIsLoading(true);
      getVideoDataAPICall();
      setIsLoading(false);
    }
  }, []);

  // console.log("viewsData::>>", videosData);

  // console.log("Data::>>", data);

  useEffect(() => {
    if (videosData?.videos?.data && videosData.videos.data.length > 0) {
      if (isAdmin && current_page === 1) {
        setData([{}, ...videosData.videos.data]);
      } else {
        setData([...data, ...videosData.videos.data]);
      }
      setCurrentPage(videosData.videos.current_page);
      setTotalPages(videosData.videos.total);
    } else if (
      videosData?.videos?.data &&
      videosData.videos.data.length === 0
    ) {
      if (isAdmin) {
        setData([{}, ...videosData.videos.data]);
      }
      clearVideosData();
    }
    if (current_page > total_pages) {
      setDisablePagination(true);
    }
    setIsLoading(false);
    setRefreshLoading(false);
  }, [videosData]);

  const handelOnEndReached = () => {
    if (current_page >= total_pages) {
      return;
    }
    if (isLoading) {
      return;
    }
    setCurrentPage(current_page + 1);
  };

  const renderItem = ({
    item,
    index,
    isAdmin,
    onLongPress,
    onPressVideo,
    onPressAdd,
  }) => {
    if (isAdmin && index == 0) {
      return (
        <TouchableOpacity
          onPress={onPressAdd}
          style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
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
      <TouchableOpacity
        onLongPress={() => onLongPress(item)}
        onPress={() => onPressVideo(item)}
      >
        <FastImage
          source={{
            uri:
              SITE_URL +
              "/converted_videos/thumbnails/" +
              item?.media?.[0]?.thumb_path,
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
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={{ flex: 1, backgroundColor: COLORS.white }}
        numColumns={noOfCols}
        renderItem={({ item, index }) =>
          renderItem({
            item,
            index,
            isAdmin,
            onLongPress,
            onPressVideo,
            onPressAdd,
          })
        }
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={FlatListItemSeparator}
        onEndReached={() => handelOnEndReached()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={() => setRefreshLoading(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <View style={styles.noPostsContainer}>
                <Text style={{ fontSize: 23, color: "Gray" }}>
                  {t("No videos to show")}
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          <>{isLoading && current_page > 1 ? <Loader /> : null}</>
        }
      />

      {showDeleteModal && (
        <DeleteModal
          modalVisible={showDeleteModal}
          setModalVisible={setShowDeleteModal}
          onDeletePress={onModalDeletePress}
        />
      )}
      {showAlertModal && (
        <AlertModal
          isVisible={showAlertModal}
          setIsVisible={setShowAlertModal}
          message="You want to delete this video?"
          onYesPress={() => {
            setLoading(true);
            dispatch(
              deletePost({
                token: token,
                id: post_id,
              })
            );
            getVideoDataAPICall();
            setShowAlertModal(false);
            setLoading(false);
          }}
        />
      )}
      {showUploadModal && (
        <RoomModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"video"}
          room
          room_id={room_id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  imgContainerStyle: {
    marginVertical: 5,
    height: WP(28),
    width: WP(28),
    marginLeft: WP(2.4),
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
    paddingVertical: 10,
    marginVertical: 10,
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
export default RenderVideos;
