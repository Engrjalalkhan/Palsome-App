import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { HP, WP } from "../../../../../Utils/Resposive";
import { useDispatch, useSelector } from "react-redux";
import { SITE_URL } from "../../../../Services/Constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import NoRooms from "./NoRooms";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import { resetRoomList } from "../../../../Redux/actions/EventActions";
import { RefreshControl } from "react-native";

const RoomsList = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [noRoom, setNoRoom] = useState(true);
  const [last_page, setLast_page] = useState();
  const [loading, setLoading] = useState(false);
  const [noMyRoom, setNoMyRoom] = useState(true);
  const [myRoomData, setMyRoomData] = useState([]);
  const [current_page, setCurrent_page] = useState(1);
  const [myRoomPage, setMyRoomPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lastMyRoomPage, setLastMyRoomPage] = useState();

  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const token = useSelector((state) => state.auth.userToken);
  const myRoomsData = useSelector((state) => state.roomsRed.myRooms);
  const joinedRooms = useSelector((state) => state.roomsRed.joinedRooms);
  const isEdited = useSelector((state) => state.eventsRed.roomsListIsRefresh);

  const renderItem = ({ item }, navigation) => {
    return (
      <TouchableOpacity
        style={[styles.container, styles.aligment]}
        onPress={() =>
          navigation.navigate("ViewRoom", { id: item?.encrypted_id })
        }
      >
        <Image
          source={
            item?.cover_photo
              ? { uri: `${SITE_URL}${item.cover_photo}` }
              : IMAGES.blankCover
          }
          style={styles.image}
          resizeMode="cover"
        />
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>
        <Text style={styles.members}>
          {t("Members")}: {item.members_count}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (joinedRooms?.data?.length > 0) {
      setNoRoom(false);
    }
    if (myRoomsData?.data?.length > 0) {
      setNoMyRoom(false);
    }
  }, []);

  const joinedRoomsReq = async () => {
    if (current_page === 1) {
      setLoading(true);
    }
    try {
      const res = await withoutStringiApiCall2({
        route: `rooms/joined_rooms?page=${current_page}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("Error in joinRooms", res?.errors);
        setLoading(false);
      } else if (res.responseCode === 200) {
        setLast_page(res?.payload?.data?.joinedRooms?.last_page);
        if (res?.payload?.data?.joinedRooms?.data?.length > 0) {
          setData([...data, ...res?.payload?.data?.joinedRooms?.data]);
        } else {
          setNoMoreData(true);
        }
        setLoading(false);
        setLoadingMoreData(false);
      }
    } catch (e) {
      console.log("GetJoinRoom error -- ", e.toString());
    }
  };
  useEffect(() => {
    joinedRoomsReq();
  }, [current_page]);

  const myRoomsReq = async () => {
    if (myRoomPage === 1) {
      setLoading(true);
    }
    try {
      const res = await withoutStringiApiCall2({
        route: `rooms?page=${myRoomPage}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        console.log("Error in saga", res.errors);
      } else if (res.responseCode == 200) {
        setLastMyRoomPage(res?.payload?.data?.myRooms?.last_page);
        if (myRoomPage === 1) {
          setMyRoomData(res?.payload?.data?.myRooms?.data);
        } else {
          const newData = res?.payload?.data?.myRooms?.data.filter(
            (item) =>
              !myRoomData.some((existingItem) => existingItem.id === item.id)
          );
          const data = [...myRoomData, ...newData];
          setMyRoomData(data);
        }
        setLoading(false);
        setLoadingMoreData(false);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
      setLoading(false);
      setLoadingMoreData(false);
    }
  };

  useEffect(() => {
    if (isEdited) {
      setMyRoomPage(1);
      myRoomsReq();
      dispatch(resetRoomList());
    }
  }, [isEdited]);

  useEffect(() => {
    myRoomsReq();
  }, [myRoomPage]);

  const renderFooter = useCallback(() => {
    return (
      <View style={styles.footer}>
        {loadingMoreData && <ActivityIndicator color="red" size={"large"} />}
      </View>
    );
  }, [loadingMoreData]);

  const loadMoreData = useCallback(() => {
    if (current_page < last_page) {
      setLoadingMoreData(true);
      setCurrent_page(current_page + 1);
    }
  }, [current_page, last_page]);

  const loadMoreDataMyRoom = useCallback(() => {
    if (myRoomPage < lastMyRoomPage) {
      setLoadingMoreData(true);
      setMyRoomPage(myRoomPage + 1);
    }
  }, [myRoomPage, lastMyRoomPage]);

  const onRefresh = () => {
    setRefreshing(true);
    setMyRoomPage(1);
    myRoomsReq();
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          <FlatList
            numColumns={2}
            bounces={false}
            data={props.myRooms ? myRoomData : data}
            onEndReached={props.myRooms ? loadMoreDataMyRoom : loadMoreData}
            onEndReachedThreshold={0.8}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={(item) => renderItem(item, navigation)}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              props.myRooms ? (
                noMyRoom && <NoRooms myRoom={true} />
              ) : noRoom ? (
                <NoRooms myRoom={false} />
              ) : (
                <NoRooms />
              )
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: HP(1),
    marginHorizontal: WP(2.5),
    backgroundColor: COLORS.white,
  },
  image: {
    width: WP(42),
    height: HP(22),
    borderRadius: 15,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    width: WP(42),
    textAlign: "center",
  },
  members: {
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.8,
  },
  footer: {
    // height: HP(10),
    width: WP(100),
    marginBottom: 20,
  },
  aligment: { alignItems: "center", justifyContent: "center" },
});
export default RoomsList;
