import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Text } from "react-native-paper";
import Toast from "react-native-simple-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import styles from "./styles";
import Header from "../../../Components/Header";
import ButtonWithTimer from "../Otp/ButtonWithTimer";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";

import { COLORS } from "../../../Constants/Colors";
import { withoutStringiApiCall2 } from "../../../Services/Apis/index";

const ResetPassword = ({ navigation, route }) => {
  const email = route.params;
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpErrorTxt, setOtpErrorTxt] = useState("");

  const [Newpassword, setNewPassword] = useState("");
  const [NewpasswordError, setNewPasswordError] = useState(false);
  const [NewpasswordErrorTxt, setNewPasswordErrorTxt] = useState("");

  const [CNewpassword, setCNewPassword] = useState("");
  const [CNewpasswordError, setCNewPasswordError] = useState(false);
  const [CNewpasswordErrorTxt, setCNewPasswordErrorTxt] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false); // For Confirm Password field

  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [attemptTimeLeft, setAttemptTimeLeft] = useState(0);

  const leftAttemptsCallback = () => setAttemptsLeft(5);

  const apiCall = async (val) => {
    setLoading(true);
    console.log(val);

    try {
      const res = await withoutStringiApiCall2({
        route: "save_reset_password",
        verb: "POST",

        params: val,
      });

      if (res.responseCode !== 200) {
        setLoading(false);

        if (res?.message == "Invalid OTP.") {
          if (attemptsLeft > 1) {
            attemptTimeLeft > 0 && setAttemptTimeLeft(0);
            setAttemptsLeft((prevState) => prevState - 1);

            Alert.alert(
              t("The OTP you entered is incorrect. Please try again.")
            );
          } else {
            setAttemptTimeLeft(60);
            setAttemptsLeft((prevState) => prevState - 1);

            Alert.alert(t("OTP wrong, Please wait for 59 seconds"));
          }
        } else {
          Toast.show(res?.message);
          attemptTimeLeft > 0 && setAttemptTimeLeft(0);
        }
      } else if (res.responseCode == 200) {
        setLoading(false);
        Toast.show(res?.message);
        navigation.goBack();
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };

  const ResetPasswordFunction = async () => {
    const params = {
      Newpassword: Newpassword,
      CNewpassword: CNewpassword,
      otp: otp,
    };

    if (CNewpassword && Newpassword && otp) {
      setOtpError(false);
      setNewPasswordError(false);
      setCNewPasswordError(false);
      if (Newpassword != CNewpassword) {
        setCNewPasswordError(true);
        setCNewPasswordErrorTxt(t("Confirm Password not matched"));
      } else {
        let formData = new FormData();
        formData.append("email", email);

        formData.append("pin", otp);
        formData.append("password", Newpassword);
        formData.append("passwordconfirm", CNewpassword);
        apiCall(formData);
      }
    } else {
      if (!otp) {
        setOtpError(true);
        setOtpErrorTxt(t("OTP is Required"));
      } else {
        setOtpError(false);
      }
      if (!Newpassword) {
        setNewPasswordError(true);
        setNewPasswordErrorTxt(t("New Password is Required"));
      } else {
        setNewPasswordError(false);
      }
      if (!CNewpassword) {
        setCNewPasswordError(true);
        setCNewPasswordErrorTxt(t("Confirm New Password is Required"));
      } else {
        setCNewPasswordError(false);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "cPassword") {
      setShowCPassword(!showCPassword);
    }
  };

  return (
    <SafeAreaView
      style={{ alignItems: "center", flex: 1, backgroundColor: COLORS.white }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackButton goBack={navigation.goBack} />
        <SafeAreaView style={styles.textmain}>
          <Header>{t("Reset Password")}</Header>
          <View style={styles.btnmain}>
            <Text style={styles.text2}>
              {t(
                "Please enter your OTP below that has been sent to your email"
              )}
            </Text>
          </View>
          <View style={styles.textsub}>
            <TextInput
              label={t("Enter OTP")}
              returnKeyType="done"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
            {otpError ? (
              <View>
                <Text style={styles.error}>{otpErrorTxt}</Text>
              </View>
            ) : null}

            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Enter New Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={Newpassword}
                onChangeText={setNewPassword}
                style={styles.textInput}
              />
              {Newpassword ? (
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
            {NewpasswordError ? (
              <View>
                <Text style={styles.error}>{NewpasswordErrorTxt}</Text>
              </View>
            ) : null}

            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Enter Confirm New Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showCPassword}
                value={CNewpassword}
                onChangeText={setCNewPassword}
                style={styles.textInput}
              />
              {CNewpassword ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    togglePasswordVisibility("cPassword");
                  }}
                >
                  <View>
                    <Ionicons
                      name={showCPassword ? "eye" : "eye-off"}
                      size={22}
                      color={COLORS.black}
                    />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            {CNewpasswordError ? (
              <View>
                <Text style={styles.error}>{CNewpasswordErrorTxt}</Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text>
              {t("Attempts left")}:{attemptsLeft}
            </Text>
          </View>

          <View style={styles.textsub}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} size={"large"} />
            ) : (
              <ButtonWithTimer
                onPress={() =>
                  ResetPasswordFunction({ otp, Newpassword, CNewpassword })
                }
                initialTime={attemptTimeLeft}
                sendOtpLoading={loading}
                callback={leftAttemptsCallback}
                title={t("Save New Password")}
              />
            )}
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
