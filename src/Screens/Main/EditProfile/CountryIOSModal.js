import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { HP, WP } from "../../../../Utils/Resposive";
// import { BASE_URL } from "../../Services/Constants";
// import { IMAGES } from "../../Constants/Images";

import { SITE_URL } from "../../../Services/Constants";
import Modal from "react-native-modal";
// import Button from "../NewButton";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import EnTypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { FlatListItemSeparator } from "../../NewsFeedList/Functions";
import axios from "axios";

const CountryIOSModal = ({
  data,
  isModal,
  setIsModal,
  setCityValue,
  setStateValue,
  cityValue,
  stateValue,
  countryValue,
  setCountryValue,
  // setCountryFunc,
  allCity,
  allState,
  setAllCity,
  setAllState,
  setCountryId,
  setStateId,
  setCityId,
  setcityDisable,
}) => {
  const token = useSelector((state) => state.auth.userToken);

  const statesData = async (id) => {
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
    let response = await fetch(
      `https://testing.palsome.com/api/getStates?country_id=${id}`,
      options
    );
    response = await response.json();
    response = response.payload.data;
    setAllState(response);
    setcityDisable(true);
    console.log("these are states", response);
    // for (let i = 0; i < response.length; i++) {
    //   console.log(response[i].title);
    // }
  };

  return (
    <View style={styles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          backdropOpacity={0.3}
          isVisible={isModal}
          //   onBackdropPress={() => setIsModal(false)}
          //   onSwipeComplete={() => setIsModal(false)}
          swipeDirection={["down"]}
          style={styles.bottomView}
          //   onRequestClose={() => setIsModal(false)}
        >
          {/* <FlatList
            data={data}
            // horizontal
            vertical
            contentContainerStyle={styles.contentContainerStyle}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => ( */}
          <Text
            style={[
              styles.button,
              {
                height: 50,
                width: "100%",
                backgroundColor: "gray",
                top: "80%",
                zIndex: 100,
                // opacity: 0.8,
              },
            ]}
          >
            {" "}
            {countryValue}
          </Text>
          <View style={styles.modalView}>
            <ScrollView style={styles.contentContainerStyle}>
              {data?.map((item, key) => {
                return (
                  <TouchableOpacity
                    //   style={{ backgroundColor: "white" }}

                    onPress={(e) => {
                      // statRefresh();
                      setCityValue("Select City");
                      setStateValue("Select State");

                      // setStateFunc(null);
                      setCountryValue(item.title);
                      setCountryId(item.id);
                      setIsModal(false);
                      statesData(item.id);

                      // setCountryFunc(item.title);
                    }}
                  >
                    <View
                      // style={{
                      //   // justifyContent: "center",
                      //   alignContent: "flex-start",
                      //   // padding: 5,
                      //   // paddingLeft: WP(10),
                      //   margin: 15,

                      //   // alignItems: "flex-start",
                      // }}
                      style={{
                        height: 50,
                        margin: 5,
                        padding: 5,
                        width: "100%",
                      }}
                    >
                      <Text>{item.title} </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* )}
          /> */}
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center" },
  bottomView: {
    // justifyContent: "flex-end",
    // justifyContent: "center",
    // backgroundColor: "white",
    // margin: HP(5),
    // flex: 1,
    // padding: HP(1),
    // paddingLeft: WP(1),
    // marginBottom: HP(10),
  },
  modalView: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: "red",
    backgroundColor: "white",
    width: "100%",
    height: "40%",
    position: "absolute",

    bottom: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    position: "absolute",
  },
  contentContainerStyle: {
    flex: 1,
    // paddingLeft: WP(8),
    // paddingTop: HP(5),
    // borderWidth: 1,
    // borderRadius: 20,
    // marginBottom: HP(20),
  },
});
export default CountryIOSModal;
