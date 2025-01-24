import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../../../../Constants/Images";

const SeeMoreReels = ({ reelsSeeMore }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ReelsNav", {
          screen: "ReelsIndex",
          params: { item: reelsSeeMore },
        })
      }
      style={styles.container}
    >
      <Image source={IMAGES.blankCover} style={{ flex: 1 }} />

      <View style={styles.seeMoreContainer}>
        <FontAwesome5 name="arrow-circle-right" size={25} color="white" />
        <Text style={styles.seeMoreText}>{t("See More")}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 90,
    marginLeft: 10,
    borderWidth: 1.8,
    borderRadius: 15,
    borderColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  seeMoreContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "50%",
  },
  seeMoreText: {
    // color: "black",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});
export default React.memo(SeeMoreReels);
