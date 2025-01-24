import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, SafeAreaView } from "react-native";

import { useSelector } from "react-redux";
import SimpleToast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";

import TopTabs from "./Components/Tabs";
import Header from "./Components/Header";
import EventCard from "./Components/EventCard";
import CreateEventModal from "./Components/CreateEventModal";

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

  const [selectedTab, setSelectedTab] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleBack = () => navigation.goBack();

  const handleSearch = () =>
    navigation.navigate("SearchEvents", { index: selectedTab });

  const handleTabPress = (index) => setSelectedTab(index);
  const handleCreateEvent = () => setShowCreateModal(true);

  const createEvent = (formData) => {
    const url = `${BASE_URL}/events/store`;

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
          if (res?.responseCode == 200) {
            setForceRefresh(true);
            SimpleToast.show("Event created successfully");
          } else {
            SimpleToast.show(`${res?.message}`);
          }
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
        handleBack={handleBack}
        handleSearch={handleSearch}
        handleCreateEvent={handleCreateEvent}
      />

      <TopTabs handleTabPress={handleTabPress} />

      {selectedTab == 0 ? (
        <EventCard
          endpoint="explore"
          emptyDataText={t("No events created so far")}
        />
      ) : selectedTab == 1 ? (
        <EventCard
          endpoint="interested"
          emptyDataText={t("You have no responded events")}
        />
      ) : selectedTab == 2 ? (
        <EventCard
          endpoint="invitations"
          emptyDataText={t("You have no invitations")}
        />
      ) : (
        <EventCard
          emptyDataText={t("You have not created any event")}
          emptyDataSubText={t("Created events will appear here.")}
          forceRefresh={forceRefresh}
          setForceRefresh={setForceRefresh}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          createEvent={createEvent}
          setShowCreateGroupModal={setShowCreateModal}
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
