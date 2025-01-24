import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Body, Button, Left, ListItem, Right } from "native-base";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { Switch } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import MyHeader from "../../../Components/MyHeader";

import { ACTIONS } from "../../../Redux/action-types";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { ICONS } from "../../../Constants/Icons";
import { alignment } from "../../../styles/TextAlignment";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const VideosSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const autoPlayVideos = useSelector((state) => state.newsF.autoPlayVideos);

  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const { t } = useTranslation();

  const toggleSwitch = () => {
    dispatch({
      type: ACTIONS.AUTOPLAY_VIDEOS,
      autoPlayVideos: !autoPlayVideos,
    });
  };

  const onPressLanguage = () => {
    navigation.navigate("LanguageScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader goBack={() => navigation.goBack()} heading={t("Preferences")} />

      <ListItem icon noBorder style={styles.listitem}>
        <Left>
          <Button style={{ backgroundColor: COLORS.white }}>
            <FontAwesome5Icon name="play" size={25} color={COLORS.primary} />
          </Button>
        </Left>
        <Body>
          <Text style={[styles.txt, alignment.left]}>
            {t("Auto Play Videos")}
          </Text>
          <Text style={[styles.txt1, alignment.left]}>
            {t("These settings only apply when you use the Palsome App")}
          </Text>
        </Body>
        <Right>
          <Switch
            trackColor={{ false: COLORS.tooLightGrey, true: COLORS.primary }}
            thumbColor={
              autoPlayVideos ? COLORS.tooLightGrey : COLORS.tooLightGrey
            }
            ios_backgroundColor={COLORS.tooLightGrey}
            onValueChange={toggleSwitch}
            value={autoPlayVideos}
          />
        </Right>
      </ListItem>

      <TouchableOpacity
        style={styles.languageContainer}
        onPress={() => {
          onPressLanguage();
        }}
      >
        {ICONS.simpleLineIcons("globe", COLORS.primary, 25)}
        <Text style={[styles.languageText, alignment.left]}>
          {t("Language")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#D3D3D3",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  back: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
  },
  txt: { fontWeight: "bold", fontSize: WP(3.8) },
  txt1: { fontSize: WP(3) },

  languageSelector: {
    margin: 20,
  },
  languageContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 15,
    flexDirection: "row",
  },
  languageText: {
    padding: 15,
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VideosSettings;
