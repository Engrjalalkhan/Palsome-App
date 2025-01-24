import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import styles from "./styles";
import ResendOtp from "./ResendOtp";
import Header from "../../../Components/Header";
import ButtonWithTimer from "./ButtonWithTimer";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";

import {
  OtpRequest,
  loginRequest,
  setLoginData,
  setSaveUserPasswords,
} from "../../../Redux/actions/AuthActions";
import { ACTIONS } from "../../../Redux/action-types";

const Otp = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigatiom = useNavigation();
  const { inactiveUser, email, fromSwitchUser, password } =
    props?.route?.params;

  const [otp, setOTP] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpErrorText, setOtpErrorText] = useState("");
  const [loadingResend, setLoadingResend] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [attemptTimeLeft, setAttemptTimeLeft] = useState(0);
  const [erorResponse, setErorResponse] = useState();
  const [sendOtpLoading, setSendOtpLoading] = useState(false);

  const userData = useSelector((state) => state.auth.userRes);

  useEffect(() => {
    if (userData?.responseCode === 200) {
      props?.navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
      dispatch(setLoginData(userData));
    } else {
      dispatch({ type: ACTIONS.CLEAR_LOGIN_RES });
    }
  }, [userData]);

  const sendOtp = async () => {
    if (fromSwitchUser) {
      setOtpError(false);
      const params = {
        otp: otp,
        otp_token: inactiveUser.token,
        email: email,
        setErorResponse: setErorResponse,
        setSendOtpLoading: setSendOtpLoading,
      };
      const paramsPassword = {
        email: email,
        password: password,
        setErorResponse: setErorResponse,
        setSendOtpLoading: setSendOtpLoading,
      };
      dispatch(setSaveUserPasswords(paramsPassword));
      dispatch(OtpRequest(params));
    } else {
      if (otp) {
        setOtpError(false);
        const params = {
          otp: otp,
          otp_token: inactiveUser.token,
          email: email,
          setErorResponse: setErorResponse,
          setSendOtpLoading: setSendOtpLoading,
        };
        const paramsPassword = {
          email: email,
          password: password,
          setErorResponse: setErorResponse,
          setSendOtpLoading: setSendOtpLoading,
        };
        dispatch(setSaveUserPasswords(paramsPassword));
        dispatch(OtpRequest(params));
      } else {
        setOtpError(true);
        setOtpErrorText(t("Please enter OTP"));
      }
    }
  };

  useEffect(() => {
    if (inactiveUser?._opt_resend_time_handle) {
      setResendTimeLeft(inactiveUser?._opt_resend_time_handle);
    }

    if (
      inactiveUser?.user?.otp_attempts &&
      inactiveUser?.otp_attempt_time == null
    ) {
      setAttemptsLeft(inactiveUser?.user?.otp_attempts);
    }
    if (inactiveUser?.otp_attempt_time > 0) {
      setAttemptTimeLeft(inactiveUser?.otp_attempt_time);
      setResendTimeLeft(inactiveUser?.otp_attempt_time);
    }
    return (cleanUp = () => {});
  }, [inactiveUser]);

  useEffect(() => {
    if (erorResponse?.data) {
      if (erorResponse?._opt_resend_time_handle) {
        setResendTimeLeft(erorResponse?._opt_resend_time_handle);
      }

      if (
        erorResponse?.data?.__user?.otp_attempts &&
        erorResponse?.data?._otp_time_handle == null
      ) {
        setAttemptsLeft(erorResponse?.data?.__user?.otp_attempts);
      } else setAttemptsLeft(0);
      if (erorResponse?.data?._otp_time_handle) {
        setResendTimeLeft(erorResponse?.data?._otp_time_handle);
        setAttemptTimeLeft(erorResponse?.data?._otp_time_handle);
      }
    }

    return (cleanUp = () => {});
  }, [erorResponse]);

  const leftAttemptsCallback = () => setAttemptsLeft(5);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BackButton goBack={navigatiom.goBack} />

      <SafeAreaView style={styles.textmain}>
        <Header>{t("Verify Account")}</Header>

        <View style={styles.btnmain}>
          <Text style={styles.text}>{t("Thank you for registration")}</Text>
        </View>

        <View style={styles.btnmain}>
          <Text style={styles.text2}>
            {t("Please enter OTP below that has been sent on your email")}
            <Text style={styles.otpEmailText}> {email}</Text>{" "}
            {t("and press Continue")}
          </Text>
        </View>

        <View style={styles.btnmain}>
          <TextInput
            label={t("Enter OTP")}
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOTP}
          />
        </View>

        {otpError ? (
          <View>
            <Text style={styles.error}>{otpErrorText}</Text>
          </View>
        ) : null}

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
          {loadingResend ? (
            <ActivityIndicator color={"#rgb(101,145,190)"} />
          ) : (
            <ResendOtp
              email={email}
              setLoadingResend={setLoadingResend}
              initialTime={resendTimeLeft}
            />
          )}
        </View>

        <View style={styles.btnmain}>
          <ButtonWithTimer
            onPress={() => sendOtp({ otp, setOTP })}
            initialTime={attemptTimeLeft}
            sendOtpLoading={sendOtpLoading}
            callback={leftAttemptsCallback}
          />
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Otp;
