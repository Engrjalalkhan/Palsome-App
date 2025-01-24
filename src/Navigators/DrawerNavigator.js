import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { createDrawerNavigator } from "@react-navigation/drawer";

import WalletNav from "../Screens/Main/Wallet/WalletNav";
import ReelsNav from "../Screens/Main/Reels/ReelsNav";
import MyTopTabs from "./MaterialTopTab/MaterialTopTab";
import SingleConversation from "../Screens/ChatGPT/SingleConversation";

import { ICONS } from "../Constants/Icons";
import { COLORS } from "../Constants/Colors";
import { HP, WP } from "../../Utils/Resposive";
import { SITE_URL } from "../Services/Constants";
import { IMAGES } from "../Constants/Images";

const Drawer = createDrawerNavigator();

const DrawerContent = (
  dpProfile,
  userData,
  reelsData,
  state,
  navigation,
  t
) => {
  const name = `${userData?.first_name} ${userData?.last_name}`;
  const dpUserData = userData?.profile_picture;
  // const { t } = useTranslation();

  const imageSource = dpProfile
    ? { uri: dpProfile }
    : dpUserData
    ? { uri: SITE_URL + dpUserData }
    : IMAGES.blankDP;

  const handleProfile = () => {
    navigation.navigate("ProfileScreen", { id: userData?.id });
    navigation.closeDrawer();
  };

  const handleHome = () => {
    navigation.navigate("Home");
    navigation.closeDrawer();
  };

  const handleConversation = () => {
    navigation.navigate("SingleConversation");
    navigation.closeDrawer();
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
    navigation.closeDrawer();
  };

  const handleClips = () => {
    navigation.navigate("Birthday");
    navigation.closeDrawer();
  };

  const handleRooms = () => {
    navigation.navigate("RoomsNav");
    navigation.closeDrawer();
  };

  const handleWallet = () => {
    navigation.navigate("WalletNav");
    navigation.closeDrawer();
  };
  const handleGroups = () => {
    navigation.navigate("Groups");
    navigation.closeDrawer();
  };
  onPressBuyNsellScreen = () => {
    navigation.navigate("BuyNsellScreen", { fromDrawer: true });
    navigation.closeDrawer();
  };
  const handleEventsPress = () => {
    navigation.navigate("Events");
    navigation.closeDrawer();
  };
  const onPressReminder = () => {
    navigation.navigate("RemindersScreen");
    navigation.closeDrawer();
  };
  const onPressSaved = () => {
    navigation.navigate("SavedPostsScreen");
    navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }} />

      <View style={styles.userInfoContainer}>
        <TouchableOpacity onPress={handleProfile}>
          <FastImage source={imageSource} style={styles.dp} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfile}>
          <Text style={styles.nameText}>{name}</Text>
        </TouchableOpacity>
        <Text style={styles.profileText} onPress={handleProfile}>
          {t("View profile")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 90 }}
      >
        <View style={styles.screensContainer}>
          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleHome}
          >
            {ICONS.ionIcons("home-outline", COLORS.primary, 28)}
            <Text style={styles.screenNameText}>{t("Home")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleConversation}
          >
            <Image source={IMAGES.palsomeAI} style={styles.logoIcon} />
            <Text style={styles.screenNameText}>{t("Palsome AI")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleGroups}
          >
            <Image source={IMAGES.group} style={styles.logoIcon} />
            <Text style={styles.screenNameText}>{t("Groups")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleRooms}
          >
            <Image source={IMAGES.rooms} style={styles.logoIcon} />
            <Text style={styles.screenNameText}>{t("Rooms")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleWallet}
          >
            {ICONS.ionIcons("wallet-outline", COLORS.primary, 30)}
            <Text style={styles.screenNameText}>{t("Wallet")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleClips}
          >
            <Image source={IMAGES.birthday} style={styles.birtdayLogo} />
            <Text style={styles.screenNameText}>{t("Birthdays")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={handleEventsPress}
          >
            <Image
              source={IMAGES.events}
              style={[styles.birtdayLogo, styles.buyNsellLogo]}
            />
            <Text style={styles.screenNameText}>{t("Events")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={onPressBuyNsellScreen}
          >
            <Image
              source={IMAGES.marketPlace}
              style={[styles.birtdayLogo, styles.buyNsellLogo]}
            />
            <Text style={styles.screenNameText}>{t("buyNsell")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={onPressReminder}
          >
            {ICONS.materialCommunityIcons(
              "bell-ring-outline",
              COLORS.primary,
              30
            )}
            <Text style={styles.screenNameText}>{t("Reminders")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.screenNameContainer}
            onPress={onPressSaved}
          >
            {ICONS.feather("bookmark", COLORS.primary, 30)}
            <Text style={styles.screenNameText}>{t("Saved")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomScreensContainer}>
        <TouchableOpacity
          style={styles.bottomScreenBtn}
          onPress={handleSettings}
        >
          {ICONS.antDesign("setting", COLORS.black, 22, { marginRight: WP(2) })}
          <Text style={styles.screenNameText}>{t("Settings")}</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView />
    </View>
  );
};

const DrawerNavigator = () => {
  const { t } = useTranslation();

  const userData = useSelector((state) => state.auth.userData);
  const dpProfile = useSelector((state) => state?.prof?.profilePicture);
  const reelsData = useSelector((state) => state?.reelsRed?.reelsData);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ swipeEnabled: false }}
      drawerContent={({ state, navigation }) =>
        DrawerContent(dpProfile, userData, reelsData, state, navigation, t)
      }
    >
      <Drawer.Screen name="Home" component={MyTopTabs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tooLightGrey,
  },

  userInfoContainer: {
    padding: WP(5),
    borderBottomWidth: 1,
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.lightGray,
  },

  dp: {
    width: WP(20),
    height: WP(20),
    borderRadius: 100,
  },

  nameText: {
    fontSize: 22,
    marginTop: HP(2),
    fontWeight: "400",
    color: COLORS.white,
  },

  profileText: {
    fontSize: 16,
    marginTop: HP(1),
    color: COLORS.white,
  },

  screensContainer: {
    padding: WP(2),
  },

  screenNameContainer: {
    elevation: 2,
    padding: WP(3),
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: WP(1),
    backgroundColor: COLORS.white,
  },

  screenNameText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: WP(3),
    color: COLORS.black,
  },

  bottomScreensContainer: {
    padding: WP(5),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,

    position: "absolute",
    bottom: HP(2),
    right: 0,
    left: 0,
  },

  bottomScreenBtn: {
    marginVertical: WP(1),
    paddingVertical: WP(1),
    alignItems: "center",
    flexDirection: "row",
  },

  logoIcon: {
    height: 29,
    width: 29,
    resizeMode: "contain",
  },

  birtdayLogo: {
    height: 34,
    width: 30,
  },
  buyNsellLogo: { width: 30, height: 28, resizeMode: "contain" },
});
