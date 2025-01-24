import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, Image } from "react-native";
import Button from "../Button";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

export default function CardView({
  result,
  mode,
  icon,
  onPressDelete,
  onPressUpdate,
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {mode === "education" ? (
        <View>
          <View style={styles.cardContainer}>
            <Image style={styles.image} source={IMAGES.graduationCap} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>{result?.school}</Text>
              <Text style={styles.cardSubText}>
                {result?.degree} - Session: {result?.from_date?.slice(0, 7)}{" "}
                {result.currently_work === 1 ? (
                  <Text style={styles.cardSubText}> - Present </Text>
                ) : (
                  <Text style={styles.cardSubText}>
                    to {result?.to_date?.slice(0, 7)}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.cardContainer}>
            <Image source={IMAGES.job} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>
                {result?.position} at {result?.company}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>{result?.school}</Text>
                <Text style={styles.cardSubText}>
                  {result?.degree} {result?.from_date?.slice(0, 7)}{" "}
                  {result?.currently_work === 1 ? (
                    <Text style={styles.cardSubText}> - Present </Text>
                  ) : (
                    <Text style={styles.cardSubText}>
                      to {result?.to_date ? result?.to_date?.slice(0, 7) : ""}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <View style={styles.btnMain}>
        <Button
          mode="contained"
          style="small"
          icon={"create-outline"}
          labelStyle="tosmall"
          onPress={() => onPressUpdate(result)}
        >
          {t("Update")}
        </Button>

        <Button
          mode="contained"
          style="small"
          icon={"trash-outline"}
          labelStyle="tosmall"
          onPress={() => onPressDelete(result?.id)}
        >
          {t("Delete")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.darkGray,
    borderWidth: 1,
    marginTop: widthPercentageToDP("5"),
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
  btnMain: {
    flexDirection: "row",
    // marginBottom: widthPercentageToDP("10"),
    justifyContent: "space-evenly",

    marginBottom: 4,
    // marginLeft: widthPercentageToDP('2'),
  },
  cardContainer: {
    flexDirection: "row",
    // marginRight: 20,
    marginVertical: heightPercentageToDP("0.8"),
  },
  cardText: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "500",
  },
  cardSubText: {
    color: COLORS.darkGray,
    fontSize: 13,
  },
  image: {
    marginHorizontal: 11,
  },
});
