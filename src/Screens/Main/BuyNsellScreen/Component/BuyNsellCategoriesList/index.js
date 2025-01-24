import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { IMAGES } from "../../../../../Constants/Images";

const CategoriesList = ({ data, onPressHandle }) => {
  const { t } = useTranslation();

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onPressHandle(data);
        }}
      >
        <Text style={styles.text}>{t(data?.name)}</Text>
        <Image source={IMAGES.buyNsellCategoriesArrow} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  image: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
});

export default CategoriesList;
