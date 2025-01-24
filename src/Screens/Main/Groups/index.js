import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, SafeAreaView } from "react-native";

import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Feed from "./Components/Feed";
import TopTabs from "./Components/Tabs";
import Header from "./Components/Header";
import SimpleToast from "react-native-simple-toast";
import ExploreGroups from "./Components/ExploreGroups";
import CreateGroupModal from "./Components/CreateGroupModal";

import { COLORS } from "../../../Constants/Colors";
import { BASE_URL } from "../../../Services/Constants";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";


const Groups = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state.auth.userToken);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleBack = () => navigation.goBack();
  const onAddPress = () => setShowCreateGroupModal(true);
  const handleSearchPress = () =>
    navigation.navigate("SearchGroups", { index: selectedIndex });

  const createGroup = (groupName, selectedPrivacy, groupDescription) => {
    const url = `${BASE_URL}/groups/store`;

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("privacy", selectedPrivacy);
    formData.append("description", groupDescription);

    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setForceRefresh(true);
          SimpleToast.show("Group created successfully");
        })
        .catch((error) => {
          console.log("catchError: ", error);
        });
    } catch (error) {
      console.log("tryCatchError: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        goBack={handleBack}
        onAddPress={onAddPress}
        showSearch={selectedIndex !== 1}
        handleSearchPress={handleSearchPress}
      />

      <TopTabs handleTabPress={setSelectedIndex} />

      {selectedIndex == 0 ? (
        <ExploreGroups
          endpoint="explore"
          emptyDataText={t("No groups created so far")}
        />
      ) : selectedIndex == 1 ? (
        <Feed />
      ) : selectedIndex == 2 ? (
        <ExploreGroups
          endpoint="invitations"
          emptyDataText={t("You have no invitations")}
        />
      ) : selectedIndex == 3 ? (
        <ExploreGroups
          endpoint="pending_approval"
          emptyDataText={t("You have no pending approvals")}
        />
      ) : selectedIndex == 4 ? (
        <ExploreGroups
          endpoint="joined_groups"
          emptyDataText={t("You have not joined any group")}
          emptyDataSubText={t("Joined groups will appear here.")}
        />
      ) : selectedIndex == 5 ? (
        <ExploreGroups
          endpoint=""
          forceRefresh={forceRefresh}
          setForceRefresh={setForceRefresh}
          emptyDataText={t("You have not created any group")}
          emptyDataSubText={t("Created groups will appear here")}
        />
      ) : null}

      {showCreateGroupModal && (
        <CreateGroupModal
          createGroup={createGroup}
          setShowCreateGroupModal={setShowCreateGroupModal}
        />
      )}
    </SafeAreaView>
  );
};

export default Groups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
