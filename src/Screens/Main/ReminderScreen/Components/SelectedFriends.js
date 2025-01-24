import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { getHeight } from "../../../../../Utils/NewResponsive";
import { IMAGES } from "../../../../Constants/Images";
import { Image } from "react-native";
import { SITE_URL } from "../../../../Services/Constants";
import { COLORS } from "../../../../Constants/Colors";

const SelectedFriends = ({ item, onDeselect }) => {
  return (
    <ScrollView horizontal>
      <View style={styles.itemContainer}>
        <TouchableOpacity>
          <Image
            source={
              item?.profile_picture
                ? { uri: SITE_URL + item?.profile_picture }
                : IMAGES.blankDP
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          {item?.first_name} {item?.last_name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            onDeselect(item);
          }}
        >
          <Image source={IMAGES.reminderCross} style={styles.reminderCross} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SelectedFriends;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#666699",
    height: getHeight(7),
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  reminderCross: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 10,
  },
});
