import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
} from "react-native";
//import MapboxGL from "@react-native-mapbox-gl/maps";

import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";
const access_token =
  "pk.eyJ1IjoiaW5hYW0xIiwiYSI6ImNramtmNmljYzJhMWMycnFwM28zOHE4ZzIifQ.pBIP97q3Us332iKImTP9aQ";

const MapBox = (props) => {
  const { t } = useTranslation();

  const [show, setshown] = useState(false);
  const [suggetions, setSuggetions] = useState();

  const {
    snapURI,
    setSnapURI,
    setLocation_label,
    location_label,
    multipleImages,
    colorPat,
  } = props;

  const getSuggestion = async (val) => {
    if (val) {
      setLocation_label(val);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?access_token=${access_token}`
      )
        .then((response) => response.json())
        .then((data) => {
          data?.features == undefined ? setshown(false) : setshown(true);
          setSuggetions(data?.features);
        });
    } else {
      setLocation_label("");
      setSuggetions();
    }
  };

  const getSnapshotUrl = async (cords) => {
    let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${cords}%5D%7D)/${cords},12/500x400?before_layer=road-label&addlayer=%7B%22id%22%3A%22streets%22%2C%22type%22%3A%22line%22%2C%22source%22%3A%7B%22type%22%3A%22vector%22%2C%22url%22%3A%22mapbox%3A%2F%2Fmapbox.mapbox-streets-v6%22%7D%2C%22source-layer%22%3A%22streets%22%2C%22paint%22%3A%7B%22line-color%22%3A%5B%22match%22%2C%5B%22get%22%2C%22congestion%22%5D%2C%22heavy%22%2C%22%232c7fb8%22%2C%22moderate%22%2C%22%237fcdbb%22%2C%22low%22%2C%22%23edf8b1%22%2C%22white%22%5D%2C%22line-width%22%3A3%7D%7D&access_token=${access_token}`;
    console.log(url);
    multipleImages?.length || colorPat > 0 ? null : setSnapURI(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.txtinputWrapper}>
        <TextInput
          value={location_label}
          style={styles.input}
          placeholder={t("Where are you?")}
          onChangeText={(val) => getSuggestion(val)}
          autoCorrect={false}
        />
        <TouchableOpacity onPress={props.onPressCross} style={{}}>
          {ICONS.antDesign("closecircleo", COLORS.white, 23, {
            color: COLORS.red,
          })}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            location_label ? props.setCheckIn(false) : null;
            props.onPressTick();
          }}
          style={{}}
        >
          {ICONS.materialCommunityIcons(
            "check-circle-outline",
            COLORS.white,
            28,
            {
              color: COLORS.skyBlue,
            }
          )}
        </TouchableOpacity>
      </View>
      {show == true ? (
        <FlatList
          style={{ flex: 1 }}
          nestedScrollEnabled
          data={suggetions}
          ListEmptyComponent={
            <>
              {suggetions?.length == 0 ? (
                <View
                  // onPress={() => setFocusedTabIndex(1)}
                  style={styles.noLocationContainer}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      // marginBottom: 10,
                      color: COLORS.grey,
                    }}
                  >
                    {t("Location not available")}
                  </Text>
                </View>
              ) : null}
            </>
          }
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setshown(false),
                    setLocation_label(item.place_name),
                    getSnapshotUrl(item.geometry.coordinates);
                }}
              >
                <View style={{ padding: 10, backgroundColor: COLORS.white }}>
                  <Text>{item.place_name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}
      {snapURI != "" ? (
        <>
          <Image
            source={{ uri: snapURI }}
            resizeMode="contain"
            style={styles.mapImage}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.white,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  input: {
    height: 40,
    width: "80%",
    color: COLORS.grey,
    backgroundColor: "#C0C0C0",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  mapImage: {
    width: "100%",
    alignSelf: "center",
    resizeMode: "stretch",
    height: 300,
    //margin: 10,
    marginVertical: 10,
    position: "absolute",
    top: HP(7),
    zIndex: -100,
  },
  txtinputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: WP(0.5),
    marginTop: HP(1),
  },
  noLocationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "60%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});

export default MapBox;
