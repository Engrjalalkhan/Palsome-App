import { Text } from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
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
import { COLORS } from "../../../Constants/Colors";

const CityModal = ({
  data,
  isModal2,
  setIsModal2,
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
  setStateId,
  setCountryId,
  setCityId,
}) => {
  const token = useSelector((state) => state.auth.userToken);
  const [bgcolor, setBgColor] = useState("white");
  const [color_, setColor_] = useState("black");

  // const statRefresh = () => {
  //   setCityValue("Select City");
  //   setStateValue("Select State");
  //   setCountryValue(item.title);
  //   setIsModal(false);
  // };

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
      `${BASE_URL}/getStates?country_id=${id}`,
      options
    );
    response = await response.json();
    response = response.payload.data;
    setAllState(response);
    console.log("these are states", response);
    // for (let i = 0; i < response.length; i++) {
    //   console.log(response[i].title);
    // }
  };

  return (
    <View style={[styles.container, { display: isModal2 ? "flex" : "flex" }]}>
      <Modal
        backdropOpacity={0.3}
        isVisible={isModal2}
        onBackdropPress={() => setIsModal2(false)}
        onSwipeComplete={() => setIsModal2(false)}
        swipeDirection={["down"]}
        style={[
          styles.bottomView,
          {
            top:
              data?.length < 3
                ? HP(25)
                : data?.length < 6
                ? HP(20)
                : data?.length < 10
                ? HP(10)
                : HP(5),
            marginBottom:
              data?.length < 3 ? HP(50) : data?.length < 6 ? HP(35) : HP(20),
          },
        ]}
        onRequestClose={() => setIsModal2(false)}
      >
        {data != "" ? (
          <FlatList
            data={data}
            // horizontal
            vertical
            contentContainerStyle={styles.contentContainerStyle}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={(e) => {
                  // statRefresh();
                  setCityValue(item.title);
                  setCityId(item.id);
                  setBgColor("white");
                  setColor_("black");
                  //   setStateValue("Select State");

                  // setStateFunc(null);
                  //   setCountryValue(item.title);
                  setIsModal2(false);
                  //   statesData(item.id);

                  // setCountryFunc(item.title);
                }}
              >
                <View
                  style={{
                    // justifyContent: "center",
                    // alignContent: "center",
                    // marginLeft: WP(5),
                    alignItems: "flex-start",
                    // padding: 5,
                    margin: 12,
                    // backgroundColor: "white",
                  }}
                >
                  <Text color={{ color: COLORS.black }}>{item.title} </Text>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <Text>no data</Text>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 100,

    justifyContent: "center",
    // alignItems: "center",
  },
  bottomView: {
    // justifyContent: "flex-end",
    justifyContent: "center",
    margin: HP(5),
    backgroundColor: "white",
    // opacity: 0.3,
    // top: data.length > 6 ? HP(30) : null,
    flex: 1,
    padding: HP(1),
    paddingLeft: WP(1),
    // marginBottom: HP(60),
    // paddingBottom: HP(40),

    // padding: HP(5),
    // paddingLeft: WP(1),
    // marginBottom: HP(5),
    // marginBottom: HP(30),

    // bottom: "70%",
  },
  contentContainerStyle: {
    // paddingLeft: WP(8),
    // paddingTop: HP(5),
    // borderWidth: 1,
    // borderRadius: 20,
    // marginBottom: HP(20),
    // justifyContent: "center",
    // alignItems: "center",
  },
});
export default CityModal;
