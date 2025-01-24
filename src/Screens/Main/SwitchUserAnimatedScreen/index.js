import { useTranslation } from "react-i18next";
import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Text } from "react-native";
import { Image } from "react-native";
import { View, Animated, StyleSheet } from "react-native";

import { IMAGES } from "../../../Constants/Images";
import { ACTIONS } from "../../../Redux/action-types";
import { SITE_URL } from "../../../Services/Constants";
import { setLoginData } from "../../../Redux/actions/AuthActions";

const SwitchUserAnimated = ({ route, navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const userData = useSelector((state) => state.auth.userRes);

  const logOut = route?.params?.logOut;
  const userProfile = route.params?.profile_picture;
  const userName = `${route.params?.firstName} ${route.params?.lastName} `;

  useEffect(() => {
    fadeInOut();
  }, []);
  useEffect(() => {
    if (userData?.responseCode === 200) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MyTopTabs",
          },
        ],
      });
      dispatch(setLoginData(userData?.payload));
      dispatch({ type: ACTIONS.CLEAR_DP });
    }
  }, [userData]);

  const fadeInOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        fadeInOut();
      });
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Image
          source={
            userProfile !== null
              ? { uri: SITE_URL + userProfile }
              : IMAGES.blankDP
          }
          style={styles.switchUserDp}
        />
      </Animated.View>
      {logOut ? (
        <Text style={styles.switchToText}>{t("logging out")} </Text>
      ) : (
        <Text style={styles.switchToText}>{t("Switching to")} </Text>
      )}
      <Text style={styles.switchToText}>{userName}... </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fadingContainer: {
    padding: 10,
    backgroundColor: "powderblue",
    borderRadius: 125,
  },
  switchToText: { fontSize: 18, fontWeight: "500", alignSelf: "center" },
  switchUserDp: { height: 100, width: 100, borderRadius: 125 },
});

export default SwitchUserAnimated;
