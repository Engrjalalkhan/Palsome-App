import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { Divider } from "react-native-paper";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Text,
  Icon,
  Left,
  Body,
  List,
  Right,
  Content,
  ListItem,
  Thumbnail,
} from "native-base";

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

import styles from "./styles";
import LogoutModal from "../../../Components/LogoutModal";

import { ACTIONS } from "../../../Redux/action-types";
import { deleteWalletToken } from "../../../Redux/actions/WalletActions";
import { getReelsDataRequest } from "../../../Redux/actions/ReelsActions";

import { ICONS } from "../../../Constants/Icons";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { SITE_URL } from "../../../Services/Constants";
import { postStatusApiCall } from "../../../Services/Apis";
import SwitchUsersModel from "../../Authentication/SwithUserLogInScreen/SwitchUsersModel";
import {
  loginRequest,
  setLoginRes,
  setSwitchUsers,
} from "../../../Redux/actions/AuthActions";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Settings = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state?.auth?.userToken);
  const userData = useSelector((state) => state.auth.userData);
  const switchUser = useSelector((state) => state.auth.switchUserData);
  const userPasswords = useSelector((state) => state.auth.saveUserPasswords);

  const profileDP = useSelector((state) => state.prof.profilePicture);
  const reelsData = useSelector((state) => state?.reelsRed?.reelsData);

  const [data, setData] = useState([]);
  const [reelItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inactiveUserData, setInactiveUserData] = useState({});
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const logout = async () => {
    setDiscardModalVisible(true);
  };

  const onPressLogOut = async () => {
    try {
      const res = await postStatusApiCall({
        route: "logout",
        verb: "POST",
        token: token,
      });
    } catch (e) {
      console.log("saga logOut issue error----- ", e.toString());
    }
  };

  const removeItemValue = async () => {
    try {
      await AsyncStorage.removeItem("fcmtoken");
      return true;
    } catch (exception) {
      return false;
    }
  };

  let currentIndex = 0;

  const onPressDiscard = () => {
    if (switchUser?.length === 1) {
      removeItemValue();
      onPressLogOut();
      dispatch({ type: ACTIONS.LOGOUT });
    } else {
      const filteredUsers = userPasswords.find((item) => {
        return item?.email !== undefined && item?.password !== undefined;
      });
      const params = {
        filteredUsers: filteredUsers?.email,
        filter: true,
      };

      const user = switchUser[currentIndex];
      const userEmail = user?.email;
      const userPassword = userPasswords.find(
        (userObj) => userObj?.email === userEmail
      );

      if (userPassword) {
        console.log("User Found:", userPassword);
        props?.navigation.navigate("SwitchUserAnimated", {
          firstName: userData?.first_name,
          lastName: userData?.last_name,
          profile_picture: userData?.profile_picture,
          logOut: true,
        });
        dispatch(setSwitchUsers(userData?.id));
      } else {
        console.log("User not found!");
        navigation.navigate("Signin");
      }

      const nextUsers = userPasswords.filter(
        (userObj) =>
          userObj?.email !== userEmail && userObj?.email !== undefined
      );

      currentIndex++;
      if (currentIndex >= switchUser?.length) {
        currentIndex = 0;
      }
      const paramsData = {
        email: userPassword?.email,
        password: userPassword?.password,
        setLoading: setLoading,
        setInactiveUserData: setInactiveUserData,
      };
      dispatch({ type: ACTIONS.CLEAR_LOGIN_RES });
      dispatch(loginRequest(paramsData));
    }
    setDiscardModalVisible(false);
  };

  const handleOnPressExploreIcons = () => {
    Toast.show(
      "This feature is in development stage. Please use this feature on the website.",
      Toast.SHORT
    );
  };

  const getReelsDataApi = useCallback(() => {
    dispatch(
      getReelsDataRequest({
        token,
        currentPage: 1,
        reel_order: reelsData?.reel_order,
      })
    );
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getReelsDataApi();
    });

    return unsubscribe;
  }, [navigation, reelsData?.reel_order]);

  useEffect(() => {
    if (reelsData?.data?.length > 0) {
      setData(
        [{}].concat(
          reelsData?.data?.map((item) => {
            setItems(item);
            return { ...item };
          })
        )
      );
    }
  }, [reelsData?.data]);

  onPressBuyNsellScreen = () => {
    try {
      navigation.navigate("BuyNSellNav");
    } catch (error) {
      console.log("Navigation error:", error);
    }
  };

  const handleGroupsPress = () => navigation.navigate("Groups");
  const handleEventsPress = () => navigation.navigate("Events");

  const onPressSwitchAccount = () => {
    onPressSwitchUserModelClose();
    dispatch({ type: ACTIONS.CLEAR_LOGIN_RES });
    dispatch(setLoginRes());
    navigation.navigate("SwitchUserStack", {
      screen: "Signin",
      params: {
        fromSwitchUser: true,
      },
    });
  };

  const onPressSwitchUserModel = () => {
    setModalVisible(true);
    dispatch({ type: ACTIONS.CLEAR_LOGIN_RES });
  };
  const onPressSwitchUserModelClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.main}>
      {discardModalVisible && (
        <LogoutModal
          isVisible={discardModalVisible}
          setIsVisible={setDiscardModalVisible}
          onDiscard={onPressDiscard}
        />
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.settingsText}>{t("Settings")}</Text>
        </View>

        <List>
          <ListItem
            avatar
            noBorder
            style={{
              marginLeft: widthPercentageToDP("8"),
            }}
            onPress={() =>
              props.navigation.navigate("ProfileScreenSettings", {
                id: userData?.id,
              })
            }
          >
            <Left>
              <Thumbnail
                source={
                  userData?.profile_picture != null
                    ? {
                        uri:
                          profileDP == null
                            ? SITE_URL + userData?.profile_picture
                            : profileDP,
                      }
                    : profileDP !== null
                    ? { uri: profileDP }
                    : IMAGES.blankDP
                }
              />
            </Left>
            <Body>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {userData?.first_name} {userData?.last_name}
              </Text>
            </Body>

            <TouchableOpacity
              style={styles.switchUserContainer}
              onPress={onPressSwitchUserModel}
            >
              <Image
                source={IMAGES.switchUserDropDown}
                style={styles.switchUserDropDown}
              />
            </TouchableOpacity>
          </ListItem>
        </List>

        <Divider
          style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
        />

        <Content>
          <Text style={styles.exploreText}>{t("Explore")}</Text>
          <View style={styles.cardsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("RoomsNav")}
              style={styles.card}
            >
              <Image source={IMAGES.rooms} style={styles.logoIcon} />
              <Text style={styles.cardsText}>{t("Rooms")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGroupsPress} style={styles.card}>
              <Image source={IMAGES.group} style={styles.logoIcon} />
              <Text style={styles.cardsText}>{t("Groups")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEventsPress} style={styles.card}>
              <Image source={IMAGES.events} style={styles.logoIcon} />
              <Text style={styles.cardsText}>{t("Events")}</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.card}
              onPress={handleOnPressExploreIcons}
            >
              <Image source={IMAGES.pages} style={styles.logoIcon} />
              <Text style={styles.cardsText}>Pages</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => props.navigation.navigate("WalletNav")}
              style={styles.card}
            >
              {ICONS.ionIcons("wallet-outline", COLORS.primary, 30)}
              <Text style={styles.cardsText}>{t("Wallet")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ReelsNav", {
                  screen: "ReelsIndex",
                  params: { item: reelItems },
                })
              }
              style={styles.card}
            >
              <Image source={IMAGES.clips} style={styles.logoIcon} />
              <Text style={styles.cardsText}>{t("Clips")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Birthday")}
              style={styles.card}
            >
              <Image source={IMAGES.birthday} style={styles.birtdayLogo} />
              <Text style={styles.cardsText}>{t("Birthdays")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onPressBuyNsellScreen()}
              // onPress={() => {
              //   handleOnPressExploreIcons();
              // }}
              style={[styles.card]}
            >
              <Image source={IMAGES.marketPlace} style={styles.buyNsellLogo} />
              <Text style={styles.cardsText}>{t("buyNsell")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SingleConversation")}
              style={styles.card}
            >
              <Image source={IMAGES.palsomeAI} style={styles.logoIcon} />
              <Text style={styles.cardsText}>{t("Palsome AI")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RemindersScreen")}
              style={styles.card}
            >
              {ICONS.materialCommunityIcons(
                "bell-ring-outline",
                COLORS.primary,
                30
              )}

              <Text style={styles.cardsText}>{t("Reminders")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("SavedPostsScreen")}
              style={styles.card}
            >
              {ICONS.feather("bookmark", COLORS.primary, 32)}
              <Text style={styles.cardsText}>{t("Saved")}</Text>
            </TouchableOpacity>
          </View>

          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />
          <Text
            style={{
              fontSize: 18,
              color: COLORS.cocoGrey,
              left: widthPercentageToDP("12"),
              textAlign: "left",
            }}
          >
            {t("Account Settings")}
          </Text>
          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />

          <ListItem
            icon
            noBorder
            style={styles.listitem}
            onPress={() => props.navigation.navigate("ProfileSetting")}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.general} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("General")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => props.navigation.navigate("SecurityAndLogin")}
            icon
            noBorder
            style={styles.listitem}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.security} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Security & Login")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => props.navigation.navigate("Privacy")}
            icon
            noBorder
            style={styles.listitem}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.privacy} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Privacy")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => props.navigation.navigate("Tagging")}
            icon
            noBorder
            style={styles.listitem}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.tagging} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Tagging")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => props.navigation.navigate("Blocking")}
            icon
            noBorder
            style={styles.listitem}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.blockUsers} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Blocking")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            onPress={() => props.navigation.navigate("VideosSettings")}
            icon
            noBorder
            style={styles.listitem}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.preferences} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Preferences")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>

          <ListItem
            icon
            noBorder
            style={styles.listitem}
            onPress={() => {
              logout(), dispatch(deleteWalletToken());
            }}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.logout} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Logout")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            icon
            noBorder
            style={styles.listitem}
            onPress={() => props.navigation.navigate("Deactivating")}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.deleteUser} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>
                {t("Deactivating & Deletion")}{" "}
              </Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>

          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />
          <Text
            style={{
              fontSize: 18,
              color: COLORS.cocoGrey,
              left: widthPercentageToDP("12"),
              textAlign: "left",
            }}
          >
            {t("More")}
          </Text>
          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />
          {/* <ListItem
            icon
            noBorder
            style={styles.listitem}
          // onPress={() => props.navigation.navigate("ForTest")}
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.aboutUser} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text>About us</Text>
            </Body>
            <Right>
             <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem> */}

          <ListItem
            icon
            noBorder
            style={styles.listitem}
            onPress={() =>
              props.navigation.navigate(
                "WebViewScreen",
                "https://www.palsome.com/privacy-policy"
              )
            }
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.privacyPolicy} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Privacy Policy")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
          <ListItem
            icon
            noBorder
            style={styles.listitem}
            onPress={() =>
              props.navigation.navigate(
                "WebViewScreen",
                "https://www.palsome.com/term-of-service"
              )
            }
          >
            <Left>
              <View style={styles.imgWrapper}>
                <Image source={IMAGES.termsAndCondition} style={styles.image} />
              </View>
            </Left>
            <Body>
              <Text style={styles.textAlignRtl}>{t("Terms & Conditions")}</Text>
            </Body>
            <Right>
              <Icon
                active
                name={
                  isRTL ? "chevron-back-outline" : "chevron-forward-outline"
                }
              />
            </Right>
          </ListItem>
        </Content>
      </View>

      {modalVisible && (
        <SwitchUsersModel
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPress={onPressSwitchAccount}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

export default Settings;
