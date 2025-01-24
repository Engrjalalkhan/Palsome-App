import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL, SITE_URL } from "../../Services/Constants";
import FastImage from "react-native-fast-image";
import { ICONS } from "../../Constants/Icons";
import { WP } from "../../../Utils/Resposive";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

const BirthdayCard = ({
  first_name,
  last_name,
  profile_picture,
  dob,
  today,
  onSendBirthdayWish,
  birthdayMessage,
  setBirthdayMessage,
  defaultValue,
}) => {
  const { t } = useTranslation();

  const cardStyle = Platform.OS === "ios" ? styles.iosCard : styles.androidCard;

  const formatDate = (inputDate) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const parts = inputDate.split("/");

    //first month then day then year
    if (parts.length === 3) {
      const day = parseInt(parts[1], 10);
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return `${day} ${months[month - 1]} `;
        }
      }
    }

    return "Invalid Date";
  };

  return (
    <View style={[styles.container, cardStyle, { height: today ? 120 : 75 }]}>
      <View style={styles.row}>
        <FastImage
          source={
            profile_picture != null
              ? {
                  // uri: SITE_URL + events?.event_cover_picture,
                  uri: SITE_URL + profile_picture,
                }
              : IMAGES.blankDP
          }
          style={styles.image}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name} numberOfLines={1}>
            {first_name} {last_name}
          </Text>
          <Text style={{ textAlign: "left" }}>{formatDate(dob)}</Text>

          {today && (
            <View style={styles.inputContainerStyle}>
              <TextInput
                style={[styles.input, { color: COLORS.black }]}
                placeholder={t("Wish Birthday...")}
                placeholderTextColor={COLORS.darkGray}
                // onChangeText={text => onChangeText(text)}
                value={birthdayMessage}
                onChangeText={setBirthdayMessage}
                defaultValue={defaultValue}
              />

              <TouchableOpacity
                style={styles.sendCon}
                onPress={onSendBirthdayWish}
              >
                {ICONS.fontAwesome("send", "red", 20, { marginLeft: 15 })}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View>
        {ICONS.materialCommunityIcons("cake", "red", 20, {
          marginLeft: 15,
          position: "absolute",
          right: 0,
          top: -10,
          zIndex: 1000,
          width: 20,
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginTop: 10,
    padding: 7,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iosCard: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 12,
  },
  androidCard: {
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },

  image: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    width: WP(55),
    textAlign: "left",
  },
  row: { flexDirection: "row" },
  inputContainerStyle: {
    height: 40,
    // borderColor: "gray",
    // borderWidth: 1,
    // padding: 10,
    width: Platform.OS === "ios" ? WP(57) : WP(50),
    marginTop: 10,
  },
  sendCon: {
    position: "absolute",
    right: 7,
    top: 8,
    height: 30,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "grey",
    backgroundColor: "white",
    borderWidth: 1,
    paddingRight: 35,
    padding: 10,
    borderRadius: 7,
  },
});

export default BirthdayCard;
