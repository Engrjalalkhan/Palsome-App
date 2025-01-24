import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  BackHandler,
} from "react-native";
import { useDispatch } from "react-redux";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { ACTIONS } from "../../../Redux/action-types";

const index = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
  };
  const navigation = useNavigation();
  function handleBackButtonClick() {
    console.log("nav backed");

    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    navigation.addListener("gestureEnd", handleBackButtonClick);
    return () => {
      BackHandler.remove("hardwareBackPress", handleBackButtonClick);
      navigation.remove("gestureEnd", handleBackButtonClick);
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.sessionTxt}>{t("Session Expired!")}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttontxt}>{t("Sign in again")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionTxt: {
    color: COLORS.primary,
    fontSize: WP(11.5),
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: HP(1.5),
    justifyContent: "center",
    alignItems: "center",
    width: "75%",

    marginTop: HP(30),
    borderRadius: 6,
  },
  buttontxt: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: WP(6.5),
  },
});
export default index;
