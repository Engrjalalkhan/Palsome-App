import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

const useReminderState = (navigation, fromSplash) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [actionType, setActionType] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [titleForModal, setTitleForModal] = useState("");
  const [creatingItem, setCreatingItem] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(t("Reminders"));
  const [activeBottomSheet, setActiveBottomSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState();
  const [reminderDetailData, setReminderDetailData] = useState();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(false);
  const [modalPopUpVisible, setModalPopUpVisible] = useState(false);
  const [alertData, setAlertData] = useState();
  const [alertYes, setAlertYes] = useState(false);
  const [subTitleForModal, setSubTitleForModal] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);

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
    reminderModal,
    setReminderModal,
    selectedTab,
    setSelectedTab,
    onPressGoBack,
    onPressAddItem,
    data,
    tabIndex,
    setTabIndex,
    setData,
    loading,
    setLoading,
    currentItem,
    setCurrentItem,
    reminderDetailData,
    isCompleted,
    page,
    setPage,
    totalPages,
    setTotalPages,
    activeBottomSheet,
    setActiveBottomSheet,
    deleteModal,
    setDeleteModal,
    creatingItem,
    setCreatingItem,
    editModal,
    setEditModal,
    refreshing,
    setRefreshing,
    friends,
    setFriends,
    selectedFriend,
    setSelectedFriend,
    titleForModal,
    setTitleForModal,
    actionType,
    setActionType,
    setReminderDetailData,
    setIsCompleted,
    loadingMore,
    setLoadingMore,
    detailLoading,
    setDetailLoading,
    updatingItem,
    setUpdatingItem,
    modalPopUpVisible,
    setModalPopUpVisible,
    alertData,
    setAlertData,
    alertYes,
    setAlertYes,
    subTitleForModal,
    setSubTitleForModal,
    shouldRefresh,
    setShouldRefresh,
  };
};

export default useReminderState;
