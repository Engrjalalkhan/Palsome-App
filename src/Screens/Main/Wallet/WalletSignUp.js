import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";

import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../../Redux/actions/AuthActions";
import { walletSetSignUpData } from "../../../Redux/actions/WalletActions";

import { heightPercentageToDP as HP } from "react-native-responsive-screen";
import BackButton from "../../../Components/BackButton";

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { theme } from "../../../Core/theme";
import { COLORS } from "../../../Constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const WalletSignUp = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });


  const [loginPassword, setLoginPassword] = useState("");
  const [newWalletPassword, setNewWalletPassword] = useState("");
  const [confWalletPassword, newConfWalletPassword] = useState("");

  const [loginPasswordError, setLoginPasswordError] = useState(false);
  const [newWalletPasswordError, setNewWalletPasswordError] = useState(false);
  const [confWalletPasswordError, setConfWalletPasswordError] = useState(false);

  const [loginPassordText, setLoginPassordText] = useState("");
  const [newWalletPasswordText, setNewWalletPasswordText] = useState("");
  const [confWalletPasswordText, setConfWalletPasswordText] = useState("");

  const [requiredField, setRequiredField] = useState("");

  const [myLoginError, setMyLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNPassword, setShowNPassword] = useState(false);
  const [showCNPassword, setShowCNPassword] = useState(false); // For Confirm Password field

  const walletSignUp = async () => {
    if (loginPassword === "" || loginPassword.length < 6) {
      setLoginPasswordError(true);
      setLoginPassordText(t("Please enter a valid Login password"));
    } else {
      setLoginPasswordError(false);
      setLoginPassordText("");
    }

    if (newWalletPassword === "" || newWalletPassword.length < 6) {
      setNewWalletPasswordError(true);
      setNewWalletPasswordText(t("Please enter a valid new wallet password"));
    } else {
      setNewWalletPasswordError(false);
      setNewWalletPasswordText("");
    }

    if (confWalletPassword === "" || confWalletPassword.length < 6) {
      setConfWalletPasswordError(true);
      setConfWalletPasswordText(
        t("Please enter a valid confirm wallet password")
      );
    } else {
      setConfWalletPasswordError(false);
      setConfWalletPasswordText("");
    }

    if (
      loginPassword === "" ||
      newWalletPassword === "" ||
      confWalletPassword === ""
    ) {
      // At least one password field is empty, display an error message or prevent navigation.
      Alert.alert(t("Please fill in all password fields"));
    } else if (newWalletPassword !== confWalletPassword) {
      setConfWalletPasswordError(true);
      setConfWalletPasswordText(t("New and confirm password doesn't match"));
    } else {
      setConfWalletPasswordError(false);
      setConfWalletPasswordText("");

      const formdata = new FormData();
      formdata.append("login_password", loginPassword);
      formdata.append("password", newWalletPassword);
      formdata.append("confirm_password", confWalletPassword);
      console.log("wallet create>>>>>>>>>>", formdata);

      if (newWalletPassword === confWalletPassword) {
        dispatch(
          walletSetSignUpData({
            params: formdata,
            setLoading: setLoading,
            token: token,
          })
        );
        const res = await withoutStringiApiCall2({
          params: formdata,
          route: "wallet/password",
          verb: "POST",
          token: token,
        });

        if (res.status === 200) {
          navigation.navigate("WalletSignin");
        }
      } else {
        Alert.alert(t("Password does not match"));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "nPassword") {
      setShowNPassword(!showNPassword);
    } else if (field === "cNPassword") {
      setShowCNPassword(!showCNPassword);
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
            {t("Please set password for your wallet to move on")}
          </Text>
          <View style={styles.textsub}>
            {/* <TextInput
              label="Login Password"
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Login Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={loginPassword}
                onChangeText={setLoginPassword}
                style={styles.textInput}
              />
              {loginPassword ? (
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
            {loginPasswordError ? (
              <View>
                <Text style={styles.error}>{loginPassordText}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.textsub}>
            {/* <TextInput
              label="New Wallet Password"
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              value={newWalletPassword}
              onChangeText={setNewWalletPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("New Wallet Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showNPassword}
                value={newWalletPassword}
                onChangeText={setNewWalletPassword}
                style={styles.textInput}
              />
              {newWalletPassword ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    togglePasswordVisibility("nPassword");
                  }}
                >
                  <View>
                    <Ionicons
                      name={showNPassword ? "eye" : "eye-off"}
                      size={22}
                      color={COLORS.black}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            {newWalletPasswordError ? (
              <View>
                <Text style={styles.error}>{newWalletPasswordText}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.textsub}>
            {/* <TextInput
              label="Confirm New Wallet Password"
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              value={confWalletPassword}
              onChangeText={newConfWalletPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Confirm New Wallet Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showCNPassword}
                value={confWalletPassword}
                onChangeText={newConfWalletPassword}
                style={styles.textInput}
              />
              {confWalletPassword ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    togglePasswordVisibility("cNPassword");
                  }}
                >
                  <View>
                    <Ionicons
                      name={showCNPassword ? "eye" : "eye-off"}
                      size={22}
                      color={COLORS.black}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            {confWalletPasswordError ? (
              <View>
                <Text style={styles.error}>{confWalletPasswordText}</Text>
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
              <Button
                mode={t("contained")}
                //  onPress={() => navigation.navigate("Main")}
                onPress={() => walletSignUp()}
              >
                {t("Save")}
              </Button>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  error: {
    color: "red",
    alignSelf: "flex-end",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "center",
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
    marginTop: widthPercentageToDP("35"),
    // justifyContent: 'center'
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
export default WalletSignUp;
