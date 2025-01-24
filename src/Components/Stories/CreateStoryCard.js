import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import sharedStyles from "./sharedStyles";
import { useSelector } from "react-redux";
import { SITE_URL } from "../../Services/Constants";

const CreateStoryCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const profileDP = useSelector((state) => state.prof.profilePicture);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <View style={sharedStyles.storiesBgImg}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate("PostStory")}
      >
        <Image
          source={
            profileDP
              ? { uri: profileDP }
              : userData?.profile_picture
              ? { uri: SITE_URL + userData.profile_picture }
              : IMAGES.blankDP
          }
          style={{
            flex: 1,
            width: 90,
            height: 50,
          }}
        />
        <View style={styles.createStoryInnerBox}>
          <Image
            resizeMode="cover"
            style={styles.addBtn}
            source={IMAGES.bluePlusCircle}
          />
          <Text style={[sharedStyles.userNameStyle]}>{t("Create Story")}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  createStoryInnerBox: {
    flex: 0.5,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    width: 28,
    height: 28,
    position: "absolute",
    top: -13,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
export default CreateStoryCard;
