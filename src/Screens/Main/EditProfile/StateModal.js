import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { HP, WP } from "../../../../Utils/Resposive";
// import { BASE_URL } from "../../Services/Constants";
// import { IMAGES } from "../../Constants/Images";

import { BASE_URL, SITE_URL } from "../../../Services/Constants";
import Modal from "react-native-modal";
// import Button from "../NewButton";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import EnTypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { FlatListItemSeparator } from "../../NewsFeedList/Functions";
import axios from "axios";

const StateModal = ({
  data,
  isModal,
  setIsModal,
  setCityValue,
  setStateValue,
  cityValue,
  stateValue,
  countryValue,
  setCountryValue,
  setCountryFunc,
  allCity,
  allState,
  setAllCity,
  setAllState,
  setCountryId,
  setStateId,
  setCityId,
  setInitial,
  setcityDisable,
  setCityDisplay,
}) => {
  const token = useSelector((state) => state.auth.userToken);
  const statRefresh = () => {
    setCityValue("Select City");
    setStateFunc("Select State");
    setCountryValue(item.title);
    setIsModal(false);
  };

  const statesData_ = async (id) => {
    let options = {
      method: "POST",
      // body: JSON.stringify({ friend_id: item.id }),
      //  {
      //   friend_id: item.id,
      // },
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let response = await fetch(`${BASE_URL}/getCities?state_id=${id}`, options);
    response = await response.json();
    response = response.payload.data;
    console.log("cityyyyyyyyyyyy    " + response);

    setAllCity(response);

    setInitial(true);
    setcityDisable(false);
    setCityId("");

    // for (let i = 0; i < response.length; i++) {
    //   console.log(response[i].title);
    // }
    response.length === 0 ? setCityDisplay(false) : setCityDisplay(true);
  };

  return (
    <View style={styles.container}>
      <Modal
        backdropOpacity={0.3}
        isVisible={isModal}
        onBackdropPress={() => setIsModal(false)}
        onSwipeComplete={() => setIsModal(false)}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={() => setIsModal(false)}
      >
        <FlatList
          data={data}
          // horizontal
          vertical
          contentContainerStyle={styles.contentContainerStyle}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{ backgroundColor: "white" }}
              onPress={(e) => {
                // statRefresh();
                // setCityDisplay(false);
                setCityValue("Select City");
                // setCityDisplay(false);
                setStateValue(item.title);
                setStateId(item.id);

                setIsModal(false);
                statesData_(item.id);

                // setCountryFunc(item.title);
              }}
            >
              <View
                style={{
                  // justifyContent: "center",
                  // alignContent: "center",
                  alignItems: "flex-start",
                  margin: 12,
                }}
              >
                <Text>{item.title} </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center" },
  bottomView: {
    justifyContent: "flex-end",
    // justifyContent: "center",
    margin: HP(5),
    backgroundColor: "white",
    // marginLeft: HP(10),
    padding: HP(1),
    flex: 1,
    top: HP(10),

    paddingLeft: WP(1),
    marginBottom: HP(25),
  },
  contentContainerStyle: {
    // paddingLeft: WP(8),
    // paddingTop: HP(5),
    // marginBottom: HP(20),
  },
});
export default StateModal;
