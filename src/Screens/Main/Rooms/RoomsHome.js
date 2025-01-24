import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
} from "react-native";
import HomeHeader from "../../../Components/HomeHeader";
import { HP } from "../../../../Utils/Resposive";
import TopTabs from "./components/TopTabs";
import RoomsList from "./components/RoomsList";
import { useNavigation } from "@react-navigation/native";
import CreateRoomModal from "./components/CreateRoomModal";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  joinedRoomsRequest,
  myRoomsRequest,
} from "../../../Redux/actions/RoomActions";
import { COLORS } from "../../../Constants/Colors";
import { ScrollView } from "react-native";
import { RefreshControl } from "react-native";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const RoomsHome = () => {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myRooms, setMyRooms] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const onSearchPress = () => {
    navigation.navigate("SearchRooms");
  };

  const onAddPress = () => {
    setShowCreateRoomModal(true);
  };

  // const joinedRoomData = () => {
  //   dispatch(
  //     joinedRoomsRequest({
  //       token: token,
  //       setLoading: setLoading,
  //     })
  //   );
  // };

  // useEffect(() => {
  //   joinedRoomData();
  // }, []);

  const onJoinedRoomsPress = () => {
    setMyRooms(false);
  };

  const onMyRoomsPressed = () => {
    // dispatch(
    //   myRoomsRequest({
    //     token: token,
    //     setLoading: setLoading,
    //   })
    // );
    setMyRooms(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // joinedRoomData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <HomeHeader
          innerScreensHeader
          searchPlaceholder={t("Search for rooms...")}
          onAddPress={onAddPress}
          onSearchPress={onSearchPress}
          room={true}
        />
      </View>
      <TopTabs
        onMyRoomsPressed={onMyRoomsPressed}
        onJoinedRoomsPress={onJoinedRoomsPress}
      />
      <View style={{ flex: 1 }}>
        <RoomsList myRooms={myRooms} />
      </View>

      {showCreateRoomModal && (
        <CreateRoomModal setShowCreateRoomModal={setShowCreateRoomModal} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContainer: {
    alignItems: "center",
    flex: 1,
    marginBottom: HP(2.5),
  },
  header: {
    marginVertical: HP(2),
  },
  loader: { flex: 1, alignSelf: "center", justifyContent: "center" },
});

export default RoomsHome;
