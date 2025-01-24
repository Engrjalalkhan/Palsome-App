import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";
// import Header from "../../../Components/Header";

import { useTranslation } from "react-i18next";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { useDispatch, useSelector } from "react-redux";
import { walletSetSignInData } from "../../../Redux/actions/WalletActions";
import { heightPercentageToDP as HP } from "react-native-responsive-screen";
import BackButton from "../../../Components/BackButton";

import {
  widthPercentageToDP,
  // heightPercentageToDP,
} from "react-native-responsive-screen";
import { theme } from "../../../Core/theme";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../Constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const WalletSignin = ({}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorTxt, setPasswordErrorTxt] = useState("");
  const [myLoginError, setMyLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const walletLogin = async () => {
    const formdata = new FormData();
    formdata.append("password", password);

    if (password === "" || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorTxt(t("Please enter a valid password"));
      return;
    } else {
      setPasswordError(false);
      setPasswordErrorTxt("");
      dispatch(
        walletSetSignInData({
          params: formdata,
          token: token,
          setLoading: setLoading,
          navigation,
        })
      );
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text === "") {
      setPasswordError(false);
      setPasswordErrorTxt("");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton goBack={navigation.goBack} />
        <SafeAreaView style={styles.textmain}>
          <Text style={styles.text}>
            {t("Please verify your wallet password to continue")}
          </Text>
          <View style={styles.textsub}>
            {/* <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => handlePasswordChange(text)}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handlePasswordChange(text)}
                style={styles.textInput}
              />
              {password ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    togglePasswordVisibility("password");
                  }}
                >
                  <View>
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={22}
                      color={COLORS.black}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            {passwordError ? (
              <View>
                <Text style={styles.error}>{passwordErrorTxt}</Text>
              </View>
            ) : null}
          </View>
          {myLoginError ? (
            <View>
              <Text style={styles.error}>
                {t("Email or password is wrong")}
              </Text>
            </View>
          ) : null}
          <View style={styles.textsub}>
            {loading ? (
              <ActivityIndicator size={HP(8)} color={COLORS.primary} />
            ) : (
              <Button mode="contained" onPress={() => walletLogin()}>
                {t("Verify")}
              </Button>
            )}
          </View>
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate("WalletForgotPassword")}
            >
              <Text style={styles.forgot}>{t("Forgot Password")}?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("WalletChangePassword")}
            >
              <Text style={styles.forgot}>{t("Change Password")}?</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  error: {
    color: "red",
    // alignSelf: "flex-end",
  },
  forgotPassword: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "",
    marginBottom: 24,
  },

  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },

  textmain: {
    flex: 1,
    width: widthPercentageToDP("80%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("40"),
  },
  textsub: {
    flexDirection: "column",
    marginTop: widthPercentageToDP("9"),
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    fontSize: 25,
  },
  containerTextInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1, // Take up remaining space
    paddingRight: 25,
  },
  iconContainer: {
    marginRight: 30,
    marginLeft: -28,
    marginTop: 18,
    // Adjust the margin as needed
  },
});
export default WalletSignin;
