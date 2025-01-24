import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, ActivityIndicator } from "react-native";

import Modal from "react-native-modal";
import styles from "./styles";

import { getHeight, getWidth } from "../../../Utils/NewResponsive";

import Button from "../NewButton";

import { withoutStringiApiCall2 } from "../../Services/Apis";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../Constants/Colors";

const ForgetPasswordModal = React.memo((props) => {
  const { t } = useTranslation();

  const { setModelVisible, modelVisible, value } = props;
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const apiCall = async (val) => {
    const formData = new FormData();
    formData.append("email", email);
    setLoading(true);

    try {
      const res = await withoutStringiApiCall2({
        route: "forgot_password",
        verb: "POST",

        params: formData,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);
        setLoading(false);
        Toast.show(res?.message);
      } else if (res.responseCode == 200) {
        setLoading(false);
        navigation.navigate("ResetPassword", email);
        setModelVisible(false);
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };
  const navigation = useNavigation();
  const onPressNext = () => {
    if (!email.length) {
      Toast.show(t("Please enter email"));
      return;
    }
    if (!email.toLowerCase().match(emailRegex)) {
      Toast.show(t("Email address is not valid"));

      return;
    }

    apiCall(email);
  };

  return (
    <Modal
      propagateSwipe
      avoidKeyboard={true}
      backdropOpacity={0.3}
      isVisible={modelVisible}
      onBackdropPress={() => setModelVisible(false)}
      swipeDirection={["down"]}
      style={styles.bottomView}
      onRequestClose={() => {
        setModelVisible(false);
      }}
      onSwipeComplete={() => {
        setModelVisible(false);
      }}
      //   statusBarTranslucent={postOnPickerValue !== "timeline" ? true : false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t("Find your account")}</Text>
        </View>
        <View style={{ padding: getHeight(3) }}>
          <TextInput
            style={styles.txtInput}
            multiline
            numberOfLines={1}
            value={email}
            require={true}
            autoCorrect={false}
            onChangeText={(val) => setEmail(val)}
            placeholder={t("Enter Your Email")}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.btnmain}>
          {loading ? (
            <ActivityIndicator
              color={COLORS.primary}
              size={"large"}
              style={{ marginVertical: getHeight(0.6) }}
            />
          ) : (
            <>
              <Button
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                text={t("Cancel")}
                pressFunction={() => setModelVisible(false)}
              />
              <Button
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                text={t("Next")}
                pressFunction={() => onPressNext()}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
});

export default ForgetPasswordModal;
