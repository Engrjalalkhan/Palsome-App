import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import GroupModal from "./GroupModal";
import { useTranslation } from "react-i18next";
import Loader from "../../Rooms/components/Loader";
import AlertModal from "../../../../Components/LogoutModal";
import DeleteModal from "../../Rooms/components/EditDeleteModal";
import CustomPlayIcon from "../../../../Components/CustomPlayIcon";

import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import { HP, WP } from "../../../../../Utils/Resposive";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";

const VideosGroupTL = (props) => {
  const { isAdmin, group_id, gropuPrivacy, forceRefresh, setForceRefresh } =
    props;

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.userToken);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [post_id, setPostId] = useState(null);
  const [confirmModal, setconfirmModal] = useState("close");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getVideoDataAPICall();
  }, [isFocused]);

  useEffect(() => {
    if (forceRefresh) {
      getVideoDataAPICall();
      setForceRefresh(false);
    }
  }, [forceRefresh]);

  useEffect(() => {
    if (confirmModal === "open") {
      setShowAlertModal(true);
    }
  }, [confirmModal]);

  const getVideoDataAPICall = () => {
    const url = `${BASE_URL}/groups/${group_id}/videos`;

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
            if (isAdmin) setData([{}, ...res?.payload?.data?.videos?.data]);
            else setData(res?.payload?.data?.videos?.data);
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

  const onLongPress = (item) => {
    setPostId(item?.media[0]?.encrypted_id);
    setShowDeleteModal(true);
  };

  const onPressVideo = (item) => {
    const newItem = {
      ...item,
      fromGroup: true,
      isAdmin: isAdmin,
    };

    navigation.navigate("VideoFullViewScreen", { item: newItem });
  };

  const onPressAdd = () => {
    setShowUploadModal(true);
  };

  const onModalDeletePress = () => {
    setShowDeleteModal(false);
    setconfirmModal("open");
  };

  const videodelete = (goBack = false) => {
    setconfirmModal("close");
    const url = `${BASE_URL}/user/video/${post_id}`;

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
            setPostId(null);
            if (goBack) navigation.goBack();
            else getVideoDataAPICall();

            showMessage({
              message: "Video deleted",
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

  const handleRefresh = () => {
    setRefreshLoading(true);
    getVideoDataAPICall();
    setRefreshLoading(false);
  };

  const renderItem = ({ item, index }) => {
    if (isAdmin && index == 0) {
      return (
        <TouchableOpacity
          onPress={onPressAdd}
          style={[styles.imgContainerStyle, styles.addNewContainerStyle]}
        >
          <FastImage
            resizeMode="cover"
            style={styles.addBtn}
            source={IMAGES.bluePlusCircle}
          />

          <Text style={styles.addTxt}>{t("Add a Video")}</Text>
          <Text style={styles.addTxt2}>
            {t("It only takes a few minutes!")}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onLongPress={() => onLongPress(item)}
        onPress={() => onPressVideo(item)}
      >
        <FastImage
          source={
            item?.media?.[0]?.thumb_path
              ? {
                  uri:
                    SITE_URL +
                    "/converted_videos/thumbnails/" +
                    item?.media?.[0]?.thumb_path,
                }
              : IMAGES.blankCover
          }
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
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <>
            {loading ? (
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
          message="You want to delete this Video?"
          onYesPress={() => {
            setLoading(true);
            videodelete();

            getVideoDataAPICall();
            setShowAlertModal(false);
          }}
        />
      )}

      {showUploadModal && (
        <GroupModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"video"}
          group
          group_encrypted_id={group_id}
          refreshAlbumsData={handleRefresh}
          eidtAlbum={""}
          gropuPrivacy={gropuPrivacy}
          showMessage={(obj) => {
            showMessage(
              obj || {
                message: t("Uploading..."),
                type: "info",
              }
            );
          }}
        />
      )}
    </View>
  );
};

export default VideosGroupTL;

const styles = StyleSheet.create({
  container: { flex: 1 },

  imgContainerStyle: {
    width: WP(28),
    marginLeft: 17,
    borderWidth: 1,
    height: HP(18.8),
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  columnWrapperStyle: { marginLeft: WP(2), marginBottom: WP(2) },
  addTxt: { fontSize: 14, fontFamily: "Roboto-Bold", textTransform: "none" },

  addNewContainerStyle: {
    height: HP(18.8),
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

  addTxt2: {
    fontSize: 12,
    marginTop: 3,
    textAlign: "center",
    fontFamily: "Roboto",
  },

  noPostsContainer: {
    flex: 1,
    padding: 10,
    width: "80%",
    marginTop: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,

    elevation: 8,
    shadowRadius: 4.65,
    shadowOpacity: 0.3,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
