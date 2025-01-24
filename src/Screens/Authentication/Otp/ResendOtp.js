import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  resendOtp,
  setResendOtpData,
} from "../../../Redux/actions/AuthActions";

const ResendOtp = ({ email, setLoadingResend, initialTime }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isRunning, setIsRunning] = useState(false);
  const [Timer, setTimer] = useState(10);
  const resendOtpData = useSelector((state) => state.auth.resendOtpData);
  useEffect(() => {
    let ti = null;
    if (isRunning) {
      console.log("useEff");
      ti = setInterval(() => {
        setTimer((Timer) => {
          console.log("timer", Timer);
          if (Timer == 0) {
            clearInterval(ti);
            setIsRunning(false);
            return 0;
          }
          return Timer - 1;
        });
      }, 1000);
      //
    }
    return () => clearInterval(ti);
  }, [isRunning]);

  const onPressResend = (val) => {
    console.log("resend preesesd");
    const body = { email: email };
    dispatch(
      resendOtp({
        body,
        setLoadingResend,
      })
    );
  };
  useEffect(() => {
    console.log("resendOtpData", resendOtpData);
    if (resendOtpData?._opt_resend_time_handle) {
      setTimer(resendOtpData?._opt_resend_time_handle);
      !isRunning ? setIsRunning(true) : null;
      dispatch(setResendOtpData(null));
    }
    return (cleanUp = () => {
      dispatch(setResendOtpData(null));
    });
  }, [resendOtpData]);

  useEffect(() => {
    if (initialTime > 0) {
      setTimer(initialTime);
      !isRunning ? setIsRunning(true) : null;
    }

    return (cleanUp = () => {});
  }, [initialTime]);
  if (initialTime > 60) return null;
  return (
    <>
      {!isRunning ? (
        <TouchableOpacity onPress={onPressResend}>
          <Text style={{ fontWeight: "bold", color: "#rgb(101,145,190)" }}>
            {t("Resend OTP")}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ fontWeight: "bold", color: "#rgb(101,145,190)" }}>
          {Timer}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});
export default ResendOtp;
