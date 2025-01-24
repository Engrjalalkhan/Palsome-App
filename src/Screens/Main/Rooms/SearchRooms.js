import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import SearchHeader from "./components/SearchHeader";
import NoSearchResults from "../../../Components/NoSearchResults";
// import RoomsSearchList from "./components/RoomsSearchList";
import { useSelector, useDispatch } from "react-redux";
import { SITE_URL } from "../../../Services/Constants";
import {
  joinedRoomsRequest,
  myRoomsRequest,
} from "../../../Redux/actions/RoomActions";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { withoutStringiApiCall2 } from "../../../Services/Apis";

const SearchRooms = (props) => {
  const { t } = useTranslation();
  const [found, setFound] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.userToken);
  const [data, setData] = useState(null);
  const joinedRooms = useSelector((state) => state.roomsRed.joinedRooms);
  const myRoomsData = useSelector((state) => state.roomsRed.myRooms);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(joinedRoomsRequest({ token: token }));
  }, []);

  useEffect(() => {
    dispatch(
      myRoomsRequest({
        token: token,
      })
    );
  }, []);

  useEffect(() => {
    setData(joinedRooms?.data?.concat(myRoomsData?.data));
  }, [joinedRooms, myRoomsData]);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = data?.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setData(newData);
      setSearch(text);
      setFound(true);
    } else {
      setData(joinedRooms?.data?.concat(myRoomsData?.data));
      setSearch(text);
      setFound(false);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ViewRoom", { id: item?.encrypted_id });
        }}
        style={styles.itemContainer}
      >
        {item?.cover_photo === null ? (
          <Image style={styles.itemImage} source={IMAGES.blankCover} />
        ) : (
          <Image
            source={{ uri: SITE_URL + item?.cover_photo }}
            style={styles.itemImage}
          />
        )}
        <View style={styles.itemTxtContainer}>
          <Text style={styles.itemTxt}>{item?.name}</Text>
          {/* <Text style={styles.itemTxt}>{item?.room_description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const onPressCross = () => {
    setSearch("");
    setData(joinedRooms?.data?.concat(myRoomsData?.data));
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        search={search}
        setSearch={(text) => searchFilterFunction(text)}
        onPressCross={onPressCross}
        placeHolder={t("Search Rooms...")}
      />

      <FlatList
        // data={joinedRooms?.data}
        data={data}
        // renderItem={({ item }) => renderItem({ item })}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoSearchResults />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heading: { fontWeight: "bold", fontSize: 18 },
  subHeading: {
    fontSize: 14,
    opacity: 0.7,
    color: COLORS.black,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  itemTxtContainer: {
    flex: 1,
  },
  itemTxt: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: "bold",
  },
});
export default SearchRooms;
