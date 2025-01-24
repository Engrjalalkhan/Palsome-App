import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

import SearchHeader from "../Rooms/components/SearchHeader";
import NoSearchResults from "../../../Components/NoSearchResults";

import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { BASE_URL, SITE_URL } from "../../../Services/Constants";

const SearchEvents = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { index } = route.params;
  const { userToken } = useSelector((state) => state?.auth);

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  const searchData = (key, endpoint) => {
    const url = `${BASE_URL}/events/search_modules?search_value=${key}&search_handle=${endpoint}`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + userToken,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.responseCode == 200) {
            setData(res?.payload?.data?.events);
          } else {
            showMessage({
              message: "Something is wrong",
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      console.log("tryCatchError: ", error);
    }
  };

  const searchFilterFunction = (text) => {
    setSearch(text);
    const endpoint =
      index == 0
        ? "explore_event"
        : index == 1
        ? "interested_event"
        : index == 2
        ? "invite_event"
        : "my_event";

    if (text) {
      searchData(text, endpoint);
    } else {
      setData(null);
      setSearch(text);
    }
  };

  const openEvent = (id) => navigation.navigate("EventTL", { id });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => openEvent(item?.encrypted_id)}
      >
        {item?.event_cover_picture === null ? (
          <Image style={styles.itemImage} source={IMAGES.blankCover} />
        ) : (
          <Image
            source={{ uri: SITE_URL + item?.event_cover_picture }}
            style={styles.itemImage}
          />
        )}
        <View style={styles.itemTxtContainer}>
          <Text style={styles.itemTxt}>{item?.event_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressCross = () => {
    setData(null);
    setSearch("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        search={search}
        setSearch={(text) => searchFilterFunction(text)}
        onPressCross={onPressCross}
        placeHolder={t("Search events...")}
      />
      {search ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoSearchResults />}
        />
      ) : (
        <NoSearchResults noInputText={true} />
      )}
    </SafeAreaView>
  );
};

export default SearchEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
