import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { showMessage } from "react-native-flash-message";

import Loader from "../../../../Components/Loader";

import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import { HP, WP } from "../../../../../Utils/Resposive";
import { BASE_URL } from "../../../../Services/Constants";

const IllustrationModal = (props) => {
  const { hideVisible, changeCover } = props;
  const token = useSelector((state) => state.auth.userToken);

  const categories = [
    { label: "Featured", value: "featured" },
    { label: "Family", value: "family" },
    { label: "Birthday", value: "birthday" },
    { label: "Food and Drink", value: "food_drink" },
    { label: "Seasons", value: "seasons" },
    { label: "Holiday", value: "holiday" },
    { label: "Party", value: "party" },
    { label: "Recreation", value: "recreation" },
    { label: "Travel", value: "travel" },
  ];

  const [loading, setLoading] = useState(true);
  const [illustrations, setIllustrations] = useState([]);
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  useEffect(() => {
    getCategoriesData("birthday");
  }, []);

  const getCategoriesData = (cat) => {
    const url = `${BASE_URL}/events/illustration/${cat}`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);

          if (res?.responseCode == 200) {
            setIllustrations(res?.payload?.data);
          } else {
            showMessage({
              message: res?.message,
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

  const onCancelPress = () => {
    hideVisible(false);
  };

  const labelStyle = (index) => {
    return {
      fontWeight: "bold",
      color: index === focusedTabIndex ? "white" : "black",
    };
  };

  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.primary : COLORS.white,
    };
  };

  const handleTabPress = (ind, cat) => {
    setLoading(true);
    setIllustrations([]);
    setFocusedTabIndex(ind);

    getCategoriesData(cat);
  };

  const handleImagePress = (url) => {
    changeCover(null, url);
    onCancelPress();
  };

  return (
    <View style={styles.wrapper}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onCancelPress}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Illustrations</Text>

            <TouchableOpacity onPress={onCancelPress}>
              <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.bodyContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesWrapper}
            >
              {categories.map((cat, ind) => (
                <TouchableOpacity
                  key={ind}
                  style={[styles.categoryCard, tabBulletStyle(ind)]}
                  onPress={() => handleTabPress(ind, cat?.value)}
                >
                  <Text style={labelStyle(ind)}>{cat?.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              numColumns={2}
              data={illustrations}
              keyExtractor={(_, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity onPress={() => handleImagePress(item)}>
                    <FastImage
                      source={{ uri: item }}
                      style={styles.imageCard}
                    />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                loading ? (
                  <Loader />
                ) : (
                  <View style={styles.emptyBody}>
                    <Text style={styles.headerText}>
                      Nothing found in this category
                    </Text>
                  </View>
                )
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IllustrationModal;

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    right: 0,
    bottom: 0,
    top: HP(8),
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  container: {
    left: 0,
    right: 0,
    top: HP(8),
    bottom: HP(5),
    margin: WP(2),
    borderRadius: 10,
    position: "absolute",
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    height: 60,
    padding: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",

    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  headerText: { fontSize: 18, fontWeight: "bold" },
  crossIcon: { width: 25, height: 25, resizeMode: "contain" },

  bodyContainer: {
    // flex: 0.99,
    marginHorizontal: WP(2),
    paddingHorizontal: WP(2),
  },

  categoriesWrapper: { marginVertical: HP(1.5) },

  emptyBody: {
    height: HP(35),
    alignItems: "center",
    justifyContent: "flex-end",
  },

  categoryCard: {
    elevation: 1,
    height: HP(4),
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 5,
    borderColor: "#ddd",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,

    shadowRadius: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },

  imageCard: {
    margin: 5,
    width: WP(42),
    height: HP(13),
    borderRadius: 10,
  },
});
