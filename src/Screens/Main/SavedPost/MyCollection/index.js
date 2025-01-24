import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  deleteApiData,
  getApiDataWithParams,
} from "../../ReminderScreen/Components/remindersApiCall";

import { Header, Hooks } from "../Components";
import { useTranslation } from "react-i18next";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import SavedItemCard from "../Components/SavedItemCard";
import { showMessage } from "react-native-flash-message";
import { BASE_URL } from "../../../../Services/Constants";
import LogoutModal from "../../../../Components/LogoutModal";
import BottomSheetSavedPost from "../Components/BottomSheetSavedPost";
import { resetSavedList } from "../../../../Redux/actions/EventActions";

const MyCollection = ({ route, navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const bottomSheetRef = useRef(null);
  const { onPressGoBack } = Hooks(navigation);
  const headerTitle = route?.params?.item?.title;
  const folderId = route?.params?.item?.encrypted_id;

  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedPost, setSelectedPost] = useState("");
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const token = useSelector((state) => state?.auth?.userToken);
  const isUnsaved = useSelector((state) => state.eventsRed.savedListIsRefresh);

  const snapPoints = useMemo(() => ["15%", "15%"], []);

  useEffect(() => {
    getSavePosts();
  }, [page]);

  const getSavePosts = async () => {
    let apiRoute = `collections/saved_posts?id=${folderId}&page=${page}`;
    const savePosts = await getApiDataWithParams(
      apiRoute,
      token,
      setLoading,
      page
    );
    let newCollections = savePosts?.savedPosts?.data;

    setLastPage(savePosts?.savedPosts?.last_page);
    setCollections((prevCollections) => [
      ...prevCollections,
      ...newCollections,
    ]);
    setLoadingMore(false);
  };

  const onPressItem = (item) => {
    navigation.navigate("SinglePost", {
      url: `${BASE_URL + "/news_feed/post/" + item?.encrypted_id}`,
      fromSavedPost: true,
    });
  };

  const onPressThreeDots = (item) => {
    setSelectedPost(item);
    bottomSheetRef.current?.present();
  };

  const onPressUnSave = () => {
    bottomSheetRef.current?.close();
    setUnSavedPostModal(true);
  };

  const onPressUnSavePostConfirm = async () => {
    setUnSavedPostModal(false);
    let apiRoute;
    let verb = "DELETE";
    apiRoute = `collections/post?post_id=${selectedPost.encrypted_id}&collection_id=${folderId}`;
    let unSavePost = await deleteApiData(apiRoute, token, verb);
    if (unSavePost?.responseCode === 200) {
      showMessage({
        message: t(`${unSavePost?.message}`),
        type: "info",
        position: "bottom",
      });

      setCollections((prevCollections) =>
        prevCollections.filter((post) => post.id !== selectedPost?.id)
      );
    }
  };

  const onRefresh = () => {
    setPage(1);
    setCollections([]);
    if (page == 1) {
      getSavePosts();
    }
  };
  useEffect(() => {
    if (isUnsaved) {
      onRefresh();
      dispatch(resetSavedList());
    }
  }, [isUnsaved]);

  const renderFooter = () => {
    return (
      <>
        {loadingMore && (
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        )}
      </>
    );
  };

  const loadMoreData = useCallback(() => {
    if (page < lastPage) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, lastPage]);

  return (
    <View style={styles.container}>
      <Header onPressBack={onPressGoBack} title={headerTitle} />
      <View style={{ flex: 1, alignItems: "center" }}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator color={COLORS.primary} size={"large"} />
          </View>
        )}
        {collections?.length === 0 ? (
          <View style={[styles.loader]}>
            {ICONS.feather("bookmark", COLORS.primary, 50)}
            <Text style={styles.noPosts}>
              You do not have any saved items in this
            </Text>
            <Text style={styles.noPosts}>collection.</Text>
          </View>
        ) : (
          <SavedItemCard
            data={collections}
            onPressItem={onPressItem}
            onRefresh={onRefresh}
            refreshing={false}
            renderFooter={renderFooter}
            loadMoreData={loadMoreData}
            onPressThreeDots={onPressThreeDots}
            headerTitle={headerTitle}
          />
        )}
        <BottomSheetSavedPost
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          selectedTab={0}
          onPressUnSave={onPressUnSave}
        />

        {unSavedPostModal && (
          <LogoutModal
            isVisible={unSavedPostModal}
            setIsVisible={setUnSavedPostModal}
            // title="Delete Photo"
            message={t("You want to unsave this post?")}
            onYesPress={onPressUnSavePostConfirm}
          />
        )}
      </View>
    </View>
  );
};

export default MyCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  noPosts: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "500",
    textAlign: "center",
  },
});
