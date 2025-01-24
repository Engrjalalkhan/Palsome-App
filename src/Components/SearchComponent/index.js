import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";

import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import styles from "./styles";

import FastImage from "react-native-fast-image";
import { BASE_URL, SITE_URL } from "../../Services/Constants";
import NoSearchResults from "../../Components/NoSearchResults";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { isRTL } from "../../../Utils/IsRTL";
import { useBackHandler } from "../../../Utils/backHardwareBackPress/handleHardBackPress";

const SearchComponent = ({ setSearchDisable }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });


  const [searchText, setSearchText] = useState("");
  const [showLoader, setshowLoader] = useState(false);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const token = useSelector((state) => state.auth.userToken);

  const onclose = () => {
    setSearchText("");
    setSearch("");
  };

  const getFriends = async (val) => {
    setshowLoader(true);
    const formData = new FormData();
    formData.append("query", val);
    let res;
    try {
      let response = await fetch(`${BASE_URL}/data/search`, {
        method: "POST",

        headers: {
          Accept: "application/json",

          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      if (response) {
        res = await response.json();
      }

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", response);
        setshowLoader(false);
      } else if (res.responseCode == 200) {
        let xres = res.payload.data?.results;

        setResults(xres?.filter((item) => item?.type == "user"));
        setshowLoader(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
    }
  };
  useEffect(() => {
    getFriends(searchText);
  }, []);

  const filteredData = results.filter((item) => {
    const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {ICONS.antDesign(isRTL ? "arrowright" : "arrowleft", null, 35, {
            fontWeight: "bold",
          })}
        </TouchableOpacity>
        <View style={styles.inputView}>
          <TextInput
            autoFocus={true}
            // value={searchText}
            onChangeText={(text) => setSearch(text)}
            value={search}
            style={styles.input}
            placeholder={t("Search")}
            placeholderTextColor={COLORS.transparent}

            // onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => onclose()} style={styles.iconTouch}>
            {ICONS.antDesign("closecircleo", COLORS.black, 23, {
              color: "red",
            })}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{ flex: 1 }}
        keyExtractor={(result, index) => index.toString()}
        nestedScrollEnabled
        data={filteredData ? filteredData : []}
        ListEmptyComponent={
          <>
            {showLoader ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <NoSearchResults />
            )}
          </>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ProfileScreen", {
                  id: item.id,
                });
              }}
            >
              <View style={styles.placeItemView}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: heightPercentageToDP("1"),
                  }}
                >
                  <FastImage
                    resizeMode="cover"
                    style={styles.logo2}
                    source={
                      item.profile_picture
                        ? {
                            uri: SITE_URL + item.profile_picture,
                          }
                        : IMAGES.blankDP
                    }
                  />
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {item.first_name} {item.last_name}
                    </Text>
                    {item?.mutual_friends ? (
                      <Text>
                        {item.mutual_friends} {t("Mutual Friends")}
                      </Text>
                    ) : null}
                  </View>
                </View>
                {ICONS.antDesign(isRTL ? "arrowleft" : "arrowright", null, 25, {
                  fontWeight: "bold",
                  alignSelf: "center",
                  paddingRight: 10,
                })}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SearchComponent;
