import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import Button from "../../../Components/Button";
import { COLORS } from "../../../Constants/Colors";

const ButtonWithTimer = ({
  onPress,
  initialTime,
  sendOtpLoading,
  callback,
  title,
}) => {
  const { t } = useTranslation();

  const [Timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  function secondsToTime(e) {
    const h = Math.floor(e / 3600)
        .toString()
        .padStart(2, "0"),
      m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, "0");

    return h + ":" + m + ":" + s;
  }

  useEffect(() => {
    let ti = null;
    if (isRunning) {
      ti = setInterval(() => {
        setTimer((Timer) => {
          if (Timer == 0) {
            clearInterval(ti);
            setIsRunning(false);
            callback();
            return 0;
          }
          return Timer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(ti);
  }, [isRunning]);

  useEffect(() => {
    if (initialTime > 0) {
      setTimer(initialTime);
      !isRunning ? setIsRunning(true) : null;
    } else {
      setIsRunning(false);
    }

    return (cleanUp = () => {});
  }, [initialTime]);

  const handleOnPress = () => {
    onPress();
  };

  return sendOtpLoading ? (
    <ActivityIndicator color={COLORS.primary} size={"large"} />
  ) : (
    <Button
      disabled={isRunning}
      mode="contained"
      style={{ marginTop: 20 }}
      onPress={handleOnPress}
    >
      {isRunning ? secondsToTime(Timer) : title || t("Continue")}
    </Button>
  );
};

export default ButtonWithTimer;
