import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useMemo, useRef } from "react";

import useReminderState from "./Hooks";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Content, Header, TabBar } from "./Components";

import LogoutModal from "../../../Components/LogoutModal";
import { deleteReminder } from "../../../Redux/actions/Reminders";
import CreateReminderModal from "./Components/CreateReminderModal";
import BottomSheetComponent from "./Components/BottomSheetComponent";
import { deleteApiData, postApiCall } from "./Components/remindersApiCall";
import { showMessage } from "react-native-flash-message";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const RemindersScreen = ({ navigation }) => {
  const {
    editModal,
    actionType,
    deleteModal,
    selectedTab,
    currentItem,
    creatingItem,
    reminderModal,
    titleForModal,
    setEditModal,
    onPressGoBack,
    setDeleteModal,
    setSelectedTab,
    onPressAddItem,
    setCurrentItem,
    setCreatingItem,
    setReminderModal,
    setTitleForModal,
    setActionType,
    isCompleted,
    updatingItem,
    setUpdatingItem,
    setIsCompleted,
    subTitleForModal,
    setSubTitleForModal,
  } = useReminderState(navigation);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });
  const bottomSheetRef = useRef(null);

  const token = useSelector((state) => state.auth.userToken);

  const snapPoints = useMemo(
    () =>
      selectedTab === t("Reminders")
        ? ["25%", "25%"]
        : selectedTab === t("Completed Reminders")
        ? ["20%", "20%"]
        : ["15%", "15%"],
    [selectedTab]
  );

  const handlePressNavigation = (item) => {
    navigation.navigate("RemindersDetailScreen", {
      id: item?.encrypted_id,
      selectedTab: selectedTab,
    });
  };
  const handleModal = (title, action) => {
    setTitleForModal(title);
    if (action === "complete") {
      setSubTitleForModal(t("You can undo this action."));
    } else if (action === "delete") {
      setSubTitleForModal(t("You can't undo this action."));
    } else {
      setSubTitleForModal(t("You can't undo this action."));
    }
    setTitleForModal(title);
    setActionType(action);
    bottomSheetRef.current?.close();
    setDeleteModal(true);
  };

  const openBottomSheet = useCallback((item) => {
    setCurrentItem(item);
    bottomSheetRef.current?.present(item);
  }, []);

  const onPressComplete = useCallback(() => {
    handleModal(t("Are you sure you want to complete this?"), "complete");
  }, []);

  const onPressEdit = useCallback((item) => {
    if (item === "complete") {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
    bottomSheetRef.current?.close();
    setEditModal(true);
  }, []);
  const onPressDelete = useCallback(() => {
    handleModal(t("Are you sure you want to delete this?"), "delete");
  }, []);

  const onYesPress = async () => {
    let apiRoute;
    let verb;
    const formData = new FormData();
    formData.append("id", currentItem?.encrypted_id);
    setDeleteModal(false);

    if (actionType === "complete") {
      apiRoute = `reminders/complete/${currentItem?.encrypted_id}`;
      verb = "GET";
    } else if (actionType === "delete") {
      apiRoute = `reminders/${currentItem?.encrypted_id}`;
      verb = "DELETE";
    }

    if (actionType === "leave") {
      try {
        apiRoute = `reminders/leave`;
        const leaveReminderData = await postApiCall(apiRoute, formData, token);
        if (leaveReminderData?.responseCode === 200) {
          // console.log("Leave reminder successfully");
          // Toast.show("Reminder left successfully");
          showMessage({
            message: t(`Reminder left successfully`),
            type: "info",
          });
          dispatch(deleteReminder(currentItem.id));
        } else {
          // console.log("Failed to leave reminder", leaveReminderData);
        }
      } catch (error) {
        console.error("Error leaving reminder:", error.toString());
      }
    } else {
      try {
        const deleteReminderData = await deleteApiData(apiRoute, token, verb);
        if (deleteReminderData?.responseCode === 200) {
          // console.log(`Reminder ${actionType}d successfully`);
          // Toast.show(`Reminder ${actionType}d successfully`);
          showMessage({
            message: t(`Reminder ${actionType}d successfully`),
            type: "info",
          });

          dispatch(deleteReminder(currentItem.id));
        } else {
          console.log(`Failed to ${actionType} reminder`, deleteReminderData);
        }
      } catch (error) {
        console.error(`Error ${actionType}ing reminder:`, error.toString());
      }
    }
  };

  const onPressLeaveReminder = async () => {
    handleModal(t("Are you sure you want to leave this reminder?"), "leave");
  };

  return (
    <View style={styles.container}>
      <Header
        onPressBack={onPressGoBack}
        onPressAddItem={onPressAddItem}
        addIcon={true}
        home={true}
        creatingItem={creatingItem}
        updatingItem={updatingItem}
      />
      <View style={styles.content}>
        <TabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <Content
          selectedTab={selectedTab}
          onPressNavigation={handlePressNavigation}
          onPressThreeDots={(e) => openBottomSheet(e)}
        />
      </View>

      {reminderModal && (
        <CreateReminderModal
          setShowCreateGroupModal={setReminderModal}
          reminderModal={reminderModal}
          setCreatingItem={setCreatingItem}
        />
      )}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        onPressComplete={onPressComplete}
        onPressEdit={onPressEdit}
        onPressDelete={onPressDelete}
        snapPoints={snapPoints}
        selectedTab={selectedTab}
        onPressLeaveReminder={onPressLeaveReminder}
      />

      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          onYesPress={onYesPress}
          setIsVisible={setDeleteModal}
          title={titleForModal}
          message={t(subTitleForModal)}
        />
      )}

      {editModal && (
        <CreateReminderModal
          setShowCreateGroupModal={setEditModal}
          reminderModal={editModal}
          currentItem={currentItem}
          setCreatingItem={setCreatingItem}
          setUpdatingItem={setUpdatingItem}
          edit={true}
          isCompleted={isCompleted}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
});

export default RemindersScreen;
