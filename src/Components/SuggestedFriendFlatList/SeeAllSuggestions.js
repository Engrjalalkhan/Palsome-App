import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const SeeMore = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.viewContainer}>
      <View style={styles.itemContainer}>
        <FontAwesome5
          name="arrow-circle-right"
          style={styles.icon}
          size={25}
          color={COLORS.white}
        />
        <Text style={styles.text}>{t("See More")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    backgroundColor: "#e2e2e2",
    height: HP(28),
    width: WP(35),
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -4, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // padding: 5,
  },
  itemContainer: {
    flexDirection: "column",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  icon: {
    alignSelf: "center",
  },
});

export default SeeMore;
