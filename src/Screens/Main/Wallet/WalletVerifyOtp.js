import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis/index";
import Toast from "react-native-simple-toast";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../Services/Constants";

const WalletVerifyOtp = ({ navigation, route }) => {
  const { t } = useTranslation();
  const email = route.params;
  const token = useSelector((state) => state.auth.userToken);

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

  // const apiCall = async () => {
  //   const formData = new FormData();
  //   // formData.append("email", email);

  //   formData.append("otp", otp);
  //   formData.append("wallet_new_password", Newpassword);
  //   formData.append("wallet_password_confirmation", CNewpassword);
  //   console.log("formData>>>>>>>> otpppppppppp", formData);

  //   const res = await postStatusApiCall({
  //     route: "wallet/reset/password",
  //     verb: "POST",
  //     token: token,
  //     body: formData,
  //     // params: val,
  //   });

  //   if (res.responseCode !== 200) {
  //     console.log("res !== 200 ... ", res);
  //     setLoading(false);
  //     // Toast.show(res?.message);
  //     Toast.show("Please enter valid OTP");
  //   } else if (res.responseCode == 200) {
  //     console.log("response", res);
  //     // setLoading(false);
  //     console.log("response////////////", res);
  //     // Toast.show(res?.message);
  //     // navigation.goBack();
  //   }
  //   } catch (e) {
  //     console.log("saga deletePost error -- ", e.toString());
  //   }
  // };

  const apiCall = async () => {
    // replace with your API token

    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("wallet_new_password", Newpassword);
    formData.append("wallet_password_confirmation", CNewpassword);

    const url = `${BASE_URL}/wallet/reset/password`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, options);
      const responseJson = await response.json();
      if (responseJson.responseCode !== 200) {
        console.log("res !== 200 ... ", responseJson);
        setLoading(false);
        // Toast.show(res?.message);
        Toast.show("Please enter valid OTP");
      } else if (responseJson.responseCode == 200) {
        console.log("response", responseJson);
        setLoading(true);
        Toast.show(responseJson?.message);
        navigation.navigate("WalletSignin");
      }
    } catch (error) {
      console.error(error);
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
        console.log("everything fine!");

        apiCall();
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

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BackButton goBack={navigation.goBack} />
      <SafeAreaView style={styles.textmain}>
        <Header>{t("Verify OTP")}</Header>
        <View style={styles.btnmain}>
          <Text style={styles.text2}>
            {t("Please enter your OTP below that has been sent to your email")}
          </Text>
        </View>
        <View style={styles.textsub}>
          <TextInput
            label={t("Enter OTP")}
            returnKeyType="done"
            secureTextEntry
            value={otp}
            onChangeText={setOtp}
          />
          {otpError ? (
            <View>
              <Text style={styles.error}>{otpErrorTxt}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("Enter New Password")}
            returnKeyType="done"
            secureTextEntry
            value={Newpassword}
            onChangeText={setNewPassword}
          />
          {NewpasswordError ? (
            <View>
              <Text style={styles.error}>{NewpasswordErrorTxt}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("Enter Confirm New Password")}
            returnKeyType="done"
            secureTextEntry
            value={CNewpassword}
            onChangeText={setCNewPassword}
          />
          {CNewpasswordError ? (
            <View>
              <Text style={styles.error}>{CNewpasswordErrorTxt}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.textsub}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size={"large"} />
          ) : (
            <Button
              mode={t("contained")}
              //  onPress={() => navigation.navigate("Main")}
              onPress={() =>
                // ResetPasswordFunction({ otp, Newpassword, CNewpassword })
                apiCall()
              }
            >
              {t("Save New Password")}
            </Button>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default WalletVerifyOtp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
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
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: heightPercentageToDP("1"),
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  textmain: {
    flex: 1,
    width: widthPercentageToDP("80%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("22"),
    // justifyContent: 'center'
  },
  textsub: {
    flexDirection: "column",
    marginTop: widthPercentageToDP("9"),
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    fontSize: 18,
  },
  image: {
    height: widthPercentageToDP("12"),
    width: widthPercentageToDP("12"),
  },
  img: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: widthPercentageToDP("26"),
    marginRight: widthPercentageToDP("26"),
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: widthPercentageToDP("8"),
  },
  text2: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
});
