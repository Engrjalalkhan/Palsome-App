import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, SafeAreaView, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { withoutStringiApiCall2 } from "../../../Services/Apis/index";
import Toast from "react-native-simple-toast";
import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { theme } from "../../../Core/theme";
import { COLORS } from "../../../Constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { walletSetSignUpData } from "../../../Redux/actions/WalletActions";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

const WalletChangePassword = ({ navigation, route }) => {
  // const email = route.params;
  // console.log("email>>>>>>", email);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
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
  const [showNPassword, setShowNPassword] = useState(false);
  const [showCNPassword, setShowCNPassword] = useState(false); // For Confirm Password field

  const token = useSelector((state) => state.auth.userToken);

  const apiCall = async (val) => {
    setLoading(true);
    console.log(val);

    try {
      const res = await withoutStringiApiCall2({
        route: "wallet/password",
        verb: "POST",
        token: token,
        params: val,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);
        setLoading(false);
        Toast.show(res?.message);
      } else if (res.responseCode == 200) {
        console.log("response", res);
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
        console.log("everything fine!");
        let formData = new FormData();
        formData.append("isSettingsPage", true);

        formData.append("login_password", otp);
        formData.append("password", Newpassword);
        formData.append("confirm_password", CNewpassword);
        // apiCall(formData);
        dispatch(
          walletSetSignUpData({
            params: formData,
            setLoading: setLoading,
            token: token,
            navigation: navigation,
          })
        );
        // navigation.navigate("WalletSignin");
      }
    } else {
      if (!otp) {
        setOtpError(true);
        setOtpErrorTxt(t("Current Password is Required"));
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

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if (text === "") {
      setNewPasswordError(false);
      setNewPasswordErrorTxt("");
    }
  };
  const handleCNewPasswordChange = (text) => {
    setCNewPassword(text);
    if (text === "") {
      setCNewPasswordError(false);
      setCNewPasswordErrorTxt("");
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
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BackButton goBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.textmain}>
        <Header>{t("Change Wallet Password")}</Header>

        <View style={styles.textsub}>
          {/* <TextInput
            label="Current Password"
            returnKeyType="done"
            secureTextEntry
            value={otp}
            onChangeText={setOtp}
          /> */}
          <View style={styles.containerTextInput}>
            <TextInput
              label={t("Current Password")}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              value={otp}
              onChangeText={setOtp}
              style={styles.textInput}
            />
            {otp ? (
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
          {otpError ? (
            <View>
              <Text style={styles.error}>{otpErrorTxt}</Text>
            </View>
          ) : null}

          {/* <TextInput
            label="Enter New Password"
            returnKeyType="done"
            secureTextEntry
            value={Newpassword}
            onChangeText={(text) => handleNewPasswordChange(text)}
          /> */}
          <View style={styles.containerTextInput}>
            <TextInput
              label={t("Enter New Password")}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showNPassword}
              value={Newpassword}
              onChangeText={(text) => handleNewPasswordChange(text)}
              style={styles.textInput}
            />
            {Newpassword ? (
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

          {NewpasswordError ? (
            <View>
              <Text style={styles.error}>{NewpasswordErrorTxt}</Text>
            </View>
          ) : null}

          {/* <TextInput
            label="Enter Confirm New Password"
            returnKeyType="done"
            secureTextEntry
            value={CNewpassword}
            onChangeText={(text) => handleCNewPasswordChange(text)}
          /> */}
          <View style={styles.containerTextInput}>
            <TextInput
              label={t("Enter Confirm New Password")}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showCNPassword}
              value={CNewpassword}
              onChangeText={(text) => handleCNewPasswordChange(text)}
              style={styles.textInput}
            />
            {CNewpassword ? (
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
              mode="contained"
              //  onPress={() => navigation.navigate("Main")}
              onPress={() =>
                ResetPasswordFunction({ otp, Newpassword, CNewpassword })
              }
            >
              {t("Update")}
            </Button>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
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

export default WalletChangePassword;

// import React, { useEffect, useState } from "react";
// import {
//   TouchableOpacity,
//   View,
//   SafeAreaView,
//   Image,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { Text } from "react-native-paper";

// import Button from "../../../Components/Button";
// import TextInput from "../../../Components/TextInput";

// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

// import { useDispatch, useSelector } from "react-redux";
// import { loginRequest } from "../../../Redux/actions/AuthActions";
// import { walletSetSignUpData } from "../../../Redux/actions/WalletActions";

// import { heightPercentageToDP as HP } from "react-native-responsive-screen";
// import BackButton from "../../../Components/BackButton";

// import {
//   widthPercentageToDP,
//   heightPercentageToDP,
// } from "react-native-responsive-screen";
// import { theme } from "../../../Core/theme";
// import { COLORS } from "../../../Constants/Colors";
// const WalletChangePassword = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.userToken);

//   const [loginPassword, setLoginPassword] = useState("");
//   const [newWalletPassword, setNewWalletPassword] = useState("");
//   const [confWalletPassword, newConfWalletPassword] = useState("");

//   const [loginPasswordError, setLoginPasswordError] = useState(false);
//   const [newWalletPasswordError, setNewWalletPasswordError] = useState(false);
//   const [confWalletPasswordError, setConfWalletPasswordError] = useState(false);

//   const [loginPassordText, setLoginPassordText] = useState("");
//   const [newWalletPasswordText, setNewWalletPasswordText] = useState("");
//   const [confWalletPasswordText, setConfWalletPasswordText] = useState("");

//   const [requiredField, setRequiredField] = useState("");

//   const [myLoginError, setMyLoginError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const WalletChangePassword = async () => {
//     if (loginPassword === "" || loginPassword < 6) {
//       setLoginPasswordError(true);
//       setLoginPassordText("Please enter a valid Login password");
//     } else {
//       setLoginPasswordError(false);
//       setLoginPassordText("");
//     }

//     if (newWalletPassword === "" || newWalletPassword < 6) {
//       setNewWalletPasswordError(true);
//       setNewWalletPasswordText("Please enter a valid New Wallet password");
//     } else {
//       setNewWalletPasswordError(false);
//       setNewWalletPasswordText("");
//     }

//     if (newWalletPassword !== confWalletPassword) {
//       setConfWalletPasswordError(true);
//       setConfWalletPasswordText("Wallet Passwords do not match");
//     } else {
//       setConfWalletPasswordError(false);
//       setConfWalletPasswordText("");
//     }

//     const formdata = new FormData();
//     formdata.append("isSettingsPage", true);
//     formdata.append("login_password", loginPassword);
//     formdata.append("password", newWalletPassword);
//     formdata.append("confirm_password", confWalletPassword);
//     console.log("wallet chnage password>>>>>>>>>>", formdata);

//     if (newWalletPassword === confWalletPassword) {
//       dispatch(
//         walletSetSignUpData({
//           params: formdata,
//           setLoading: setLoading,
//           token: token,
//         })
//       );
//     } else {
//       Alert.alert("Password does not match");
//     }
//     navigation.navigate("WalletSignin");
//   };

//   return (
//     <>
//       <KeyboardAwareScrollView
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <BackButton goBack={navigation.goBack} />

//         <SafeAreaView style={styles.textmain}>
//           <Text style={styles.text}>
//             Please set password for your wallet to move on
//           </Text>
//           <View style={styles.textsub}>
//             <TextInput
//               label="Login Password"
//               returnKeyType="done"
//               autoCapitalize="none"
//               autoCorrect={false}
//               secureTextEntry
//               value={loginPassword}
//               onChangeText={setLoginPassword}
//             />
//             {loginPasswordError ? (
//               <View>
//                 <Text style={styles.error}>{loginPassordText}</Text>
//               </View>
//             ) : null}
//           </View>
//           <View style={styles.textsub}>
//             <TextInput
//               label="New Wallet Password"
//               returnKeyType="done"
//               autoCapitalize="none"
//               autoCorrect={false}
//               secureTextEntry
//               value={newWalletPassword}
//               onChangeText={setNewWalletPassword}
//             />
//             {newWalletPasswordError ? (
//               <View>
//                 <Text style={styles.error}>{newWalletPasswordText}</Text>
//               </View>
//             ) : null}
//           </View>
//           <View style={styles.textsub}>
//             <TextInput
//               label="Confirm New Wallet Password"
//               returnKeyType="done"
//               autoCapitalize="none"
//               autoCorrect={false}
//               secureTextEntry
//               value={confWalletPassword}
//               onChangeText={newConfWalletPassword}
//             />
//             {confWalletPasswordError ? (
//               <View>
//                 <Text style={styles.error}>{confWalletPasswordText}</Text>
//               </View>
//             ) : null}
//           </View>
//           {myLoginError ? (
//             <View>
//               <Text style={styles.error}>Email or password is wrong</Text>
//             </View>
//           ) : null}
//           <View style={styles.textsub}>
//             {loading ? (
//               <ActivityIndicator size={HP(8)} color={COLORS.primary} />
//             ) : (
//               <Button
//                 mode="contained"
//                 //  onPress={() => navigation.navigate("Main")}
//                 onPress={() => WalletChangePassword()}
//               >
//                 Save
//               </Button>
//             )}
//           </View>
//         </SafeAreaView>
//       </KeyboardAwareScrollView>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     // backgroundColor: COLORS.primary,
//     alignItems: "center",
//   },
//   error: {
//     color: "red",
//     alignSelf: "flex-end",
//   },
//   forgotPassword: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 24,
//   },

//   forgot: {
//     fontSize: 13,
//     color: theme.colors.secondary,
//   },

//   textmain: {
//     flex: 1,
//     width: widthPercentageToDP("80%"),
//     flexDirection: "column",
//     marginTop: widthPercentageToDP("35"),
//     // justifyContent: 'center'
//   },
//   textsub: {
//     flexDirection: "column",
//     marginTop: widthPercentageToDP("9"),
//   },
//   text: {
//     fontFamily: "Roboto-Regular",
//     fontWeight: "bold",
//     fontSize: 25,
//   },
// });
// export default WalletChangePassword;
