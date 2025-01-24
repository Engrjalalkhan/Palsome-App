import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

const Hooks = (navigation, fromSplash) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [actionType, setActionType] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const onPressGoBack = useCallback(() => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  const onPressAddItem = useCallback(() => {
    setReminderModal(true);
  }, []);

  return {
    page,
    setPage,
    data,
    setData,
    tabIndex,
    setTabIndex,
    loading,
    setLoading,
    totalPages,
    setTotalPages,
    actionType,
    setActionType,
    refreshing,
    setRefreshing,
    onPressGoBack,
    savedItems,
    setSavedItems,
    modalVisible,
    setModalVisible,
    collectionName,
    setCollectionName,
  };
};

export default Hooks;
