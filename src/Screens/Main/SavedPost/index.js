import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../Constants/Colors";
import { Content, Header, Hooks, SaveItemModal, TabBar } from "./Components";
import { BASE_URL } from "../../../Services/Constants";
import BottomSheetSavedPost from "./Components/BottomSheetSavedPost";
import {
  deleteApiData,
  getApiDataWithParams,
  postApiCall,
} from "../ReminderScreen/Components/remindersApiCall";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import LogoutModal from "../../../Components/LogoutModal";
import { useTranslation } from "react-i18next";
import { resetSavedList } from "../../../Redux/actions/EventActions";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const filterDuplicates = (array, key) => {
  const uniqueItems = new Map();
  array.forEach((item) => uniqueItems.set(item[key], item));
  return Array.from(uniqueItems.values());
};

const SavedPostsScreen = ({ navigation }) => {
  const {
    onPressGoBack,
    tabIndex,
    setTabIndex,
    modalVisible,
    setModalVisible,
  } = Hooks(navigation);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const bottomSheetRef = useRef(null);
  const { collectionName, setCollectionName } = Hooks();
  const [cachedCollections, setCachedCollections] = useState({});
  const [savedItems, setSavedItems] = useState([]);
  const [selectedPost, setSelectedPost] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [unSavedPostModal, setUnSavedPostModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [myCollectionsPage, setMyCollectionsPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [createCollectionLoading, setCreateCollectionLoading] = useState(false);

  const [editSavePostModal, setEditSavePostModal] = useState(false);
  const [deleteFolderCollectionModal, setDeleteFolderCollectionModal] =
    useState(false);

  const token = useSelector((state) => state?.auth?.userToken);
  const isUnsaved = useSelector((state) => state.eventsRed.savedListIsRefresh);

  const snapPoints = useMemo(
    () => (tabIndex === 0 ? ["15%", "15%"] : ["20%", "20%"]),
    [tabIndex]
  );

  const fetchData = async () => {
    if (tabIndex === 0) {
      if (myCollectionsPage === 1) {
        setLoading(true);
      }
    } else {
      if (page === 1) {
        setLoading(true);
      }
    }

    let apiRoute =
      tabIndex === 0
        ? `collections/saved_posts?id=Saved_posts&page=${myCollectionsPage}`
        : `collections?page=${page}`;
    const collectionsDataResponse = await getApiDataWithParams(apiRoute, token);

    setLastPage(
      tabIndex == 0
        ? collectionsDataResponse?.savedPosts?.last_page
        : collectionsDataResponse?.collections?.last_page
    );

    let data =
      tabIndex === 0
        ? collectionsDataResponse?.savedPosts?.data
        : collectionsDataResponse?.collections?.data;
    if (tabIndex == 0) {
      setCachedCollections((prev) => ({
        ...prev,
        [tabIndex]:
          myCollectionsPage === 1 ? data : [...(prev[tabIndex] || []), ...data],
      }));
    } else {
      setCachedCollections((prev) => ({
        ...prev,
        [tabIndex]: page === 1 ? data : [...(prev[tabIndex] || []), ...data],
      }));
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const loadMoreData = useCallback(() => {
    if (tabIndex === 0) {
      if (myCollectionsPage < lastPage) {
        setLoadingMore(true);
        setMyCollectionsPage((prevPage) => prevPage + 1);
      }
    } else {
      if (page < lastPage) {
        setLoadingMore(true);
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [page, lastPage, tabIndex, myCollectionsPage]);

  useEffect(() => {
    if (!cachedCollections[tabIndex]) {
      fetchData();
    }
  }, [tabIndex]);

  useEffect(() => {
    fetchData();
  }, [page, myCollectionsPage]);

  const onRefresh = () => {
    setPage(1);
    setMyCollectionsPage(1);
    setCachedCollections({});
    if (tabIndex === 0 && myCollectionsPage == 1) {
      fetchData();
    }
    if (tabIndex === 1 && page === 1) {
      fetchData();
    }
  };

  useEffect(() => {
    if (isUnsaved) {
      onRefresh();
      dispatch(resetSavedList());
    }
  }, [isUnsaved]);

  const onPressAdd = useCallback(() => {
    setModalVisible(true);
  }, [savedItems]);

  const onPressItem = (item) => {
    navigation.navigate("SinglePost", {
      url: `${BASE_URL + "/news_feed/post/" + item?.encrypted_id}`,
      fromSavedPost: true,
    });
  };

  const onPressItemFolder = (item) => {
    navigation.navigate("MyCollection", {
      item: item,
    });
  };

  const onPressCreateCollection = async () => {
    setCreateCollectionLoading(true);
    const formData = new FormData();
    let apiRoute;
    apiRoute = `collections`;
    formData.append("title", collectionName);
    const savePosts = await postApiCall(apiRoute, formData, token);
    if (savePosts?.responseCode === 200) {
      setModalVisible(false);
      setCreateCollectionLoading(false);
      setCollectionName("");
      showMessage({
        message: t(`${savePosts?.message}`),
        type: "info",
        position: "bottom",
      });
      onRefresh();
    } else {
      setCreateCollectionLoading(false);
      setErrorMessage(
        savePosts?.message || "An error occurred. Please try again."
      );
    }
  };

  const onPressThreeDots = (item) => {
    setSelectedPost(item);
    bottomSheetRef.current?.present();
  };

  const onPressThreeDotsFolder = (item) => {
    bottomSheetRef.current?.present();
    setSelectedPost(item);
  };

  const onPressUnSave = () => {
    bottomSheetRef.current?.close();
    setUnSavedPostModal(true);
  };

  const onPressUnSavePostConfirm = async () => {
    let folderId = selectedPost?.saved_post[0]?.encrypted_id;
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

      setCachedCollections((prevCollections) => ({
        ...prevCollections,
        [tabIndex]: prevCollections[tabIndex].filter(
          (post) => post.id !== selectedPost.id
        ),
      }));
    }
  };

  const onPressEdit = () => {
    bottomSheetRef.current?.close();
    setCollectionName(selectedPost.title); // Set the initial collection name to the current one
    setEditSavePostModal(true);
  };

  const onPressUpdate = async () => {
    setCreateCollectionLoading(true);
    const formData = new FormData();
    let apiRoute;
    formData.append("title", collectionName);
    apiRoute = `collections/update/${selectedPost?.encrypted_id}`;
    const savePosts = await postApiCall(apiRoute, formData, token);
    if (savePosts?.responseCode === 200) {
      setEditSavePostModal(false);
      setCreateCollectionLoading(false);
      setCollectionName("");
      showMessage({
        message: t(`${savePosts?.message}`),
        type: "info",
        position: "bottom",
      });
      setCachedCollections((prev) => {
        const updatedCollections = { ...prev };
        const currentTabData = updatedCollections[tabIndex] || [];
        updatedCollections[tabIndex] = currentTabData.map((item) =>
          item.encrypted_id === selectedPost.encrypted_id
            ? { ...item, title: collectionName }
            : item
        );
        return updatedCollections;
      });
    } else {
      setCreateCollectionLoading(false);
      setErrorMessage(
        savePosts?.message || "An error occurred. Please try again."
      );
    }
  };

  const onPressDelete = useCallback(() => {
    bottomSheetRef.current?.close();
    setDeleteFolderCollectionModal(true);
  }, []);

  const onPressDeleteCollectionConfirm = async () => {
    let apiRoute;
    let verb = "DELETE";
    apiRoute = `collections/${selectedPost?.encrypted_id}`;
    setDeleteFolderCollectionModal(false);
    const deleteFolder = await deleteApiData(apiRoute, token, verb);
    if (deleteFolder?.responseCode === 200) {
      showMessage({
        message: t(`${deleteFolder?.message}`),
        type: "info",
        position: "bottom",
      });
      setCachedCollections((prev) => {
        const updatedCollections = { ...prev };
        const currentTabData = updatedCollections[tabIndex] || [];
        updatedCollections[tabIndex] = currentTabData.filter(
          (item) => item.encrypted_id !== selectedPost.encrypted_id
        );
        return updatedCollections;
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        onPressBack={onPressGoBack}
        onPressAddItem={onPressAdd}
        addIcon={true}
        home={true}
      />
      <View style={styles.content}>
        <TabBar selectedTab={tabIndex} setSelectedTab={setTabIndex} />

        <Content
          selectedTab={tabIndex}
          setSelectedTab={setTabIndex}
          savedItems={savedItems}
          onPressItem={onPressItem}
          onPressItemFolder={onPressItemFolder}
          onPressThreeDots={onPressThreeDots}
          onPressThreeDotsFolder={onPressThreeDotsFolder}
          loading={loading}
          onRefresh={onRefresh}
          cachedCollections={cachedCollections}
          loadMoreData={loadMoreData}
          loadingMore={loadingMore}
        />
      </View>
      {modalVisible && (
        <SaveItemModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPressCreateCollection={onPressCreateCollection}
          collectionName={collectionName}
          setCollectionName={setCollectionName}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          createCollectionLoading={createCollectionLoading}
        />
      )}
      {editSavePostModal && (
        <SaveItemModal
          modalVisible={editSavePostModal}
          setModalVisible={setEditSavePostModal}
          onPressUpdate={onPressUpdate}
          edit={true}
          selectedPost={selectedPost}
          collectionName={collectionName}
          setCollectionName={setCollectionName}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          createCollectionLoading={createCollectionLoading}
        />
      )}
      <BottomSheetSavedPost
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        selectedTab={tabIndex}
        onPressUnSave={onPressUnSave}
        onPressEdit={onPressEdit}
        onPressDelete={onPressDelete}
      />
      {deleteFolderCollectionModal && (
        <LogoutModal
          isVisible={deleteFolderCollectionModal}
          setIsVisible={setDeleteFolderCollectionModal}
          message={t("You want to delete this collection?")}
          onYesPress={onPressDeleteCollectionConfirm}
        />
      )}
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
  );
};

export default SavedPostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    height: "85%",
    backgroundColor: "#F7F7F7",
  },
});
