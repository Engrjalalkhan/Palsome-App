import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequest,
  setLoginData,
  setSaveUserPasswords,
} from "../../../Redux/actions/AuthActions";
import { heightPercentageToDP as HP } from "react-native-responsive-screen";
import ForgetPasswordModal from "../../../Components/ForgetPasswordModal";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

import appleAuth, {
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setMyStory,
  setSideBarFriendList,
} from "../../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../../Redux/action-types";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Signin = ({ navigation, route }) => {
  const fromSwitchUser = route?.params?.fromSwitchUser;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const userData = useSelector((state) => state.auth.userRes);

  const [inactiveUserData, setInactiveUserData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorTxt, setEmailErrorTxt] = useState("");
  const [passwordErrorTxt, setPasswordErrorTxt] = useState("");
  const [myLoginError, setMyLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const removeItemValue = async () => {
    try {
      await AsyncStorage.removeItem("fcmtoken");
      return true;
    } catch (exception) {
      return false;
    }
  };
  const handleRemovePreviousFriData = async () => {
    dispatch({ type: ACTIONS.CLEAR_LOGIN_RES_ALL });
    dispatch(setSideBarFriendList([]));
    removeItemValue();
    dispatch(setMyStory([]));
    dispatch(setLoginData([]));
  };

  useEffect(() => {
    if (userData?.responseCode === 200) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
      dispatch(setLoginData(userData));
    } else {
      dispatch({ type: ACTIONS.CLEAR_LOGIN_RES });
    }
  }, [userData]);

  const UserLoginFunction = async () => {
    const params = {
      email: email,
      password: password,
      setLoading: setLoading,
      setInactiveUserData: setInactiveUserData,
    };
    console.log("loginfun");
    if (email && password) {
      setEmailError(false);
      setPasswordError(false);
      setMyLoginError(false);
      if (!email.toLowerCase().match(emailRegex)) {
        // setEmailError(true);
        // setEmailErrorTxt("Email is Invalid");
        setMyLoginError(true);
      }
      if (password.length < 8) {
        // setPasswordError(true);
        // setPasswordErrorTxt("Password must be 8 characters long");
        setMyLoginError(true);
      }
      if (email.toLowerCase().match(emailRegex) && password.length > 7) {
        if (fromSwitchUser && userData) {
          handleRemovePreviousFriData();
          dispatch(loginRequest(params));
        } else {
          dispatch(setSideBarFriendList([]));
          dispatch(loginRequest(params));
          dispatch(setSideBarFriendList([]));
        }
      }
    } else {
      if (!email) {
        setEmailError(true);
        setEmailErrorTxt(t("Email is required"));
      }
      if (email) {
        setEmailError(false);
      }
      if (!password) {
        setPasswordError(true);
        setPasswordErrorTxt(t("Password is required"));
      }
      if (password) {
        setPasswordError(false);
      }
    }
  };

  async function onAppleAuth() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      console.log(
        "APPLE AUTH CODE " + appleAuthRequestResponse.authorizationCode
      );
      ///  write post api for ur db
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // useEffect(() => {
  //   if (loginErrors) {
  //     setMyLoginError(true);
  //   }
  //   return () => {
  //     if (loginErrors) {
  //       setTimeout(() => {
  //         setMyLoginError(false);
  //         console.log("clean up");
  //       }, 1000);
  //     }
  //   };
  // }, [loginErrors]);
  useEffect(() => {
    let inactiveUser = inactiveUserData;
    if (inactiveUser?.token?.length) {
      navigation.navigate("Otp", { email: email, inactiveUser: inactiveUser });
      setInactiveUserData({});
    }
  }, [inactiveUserData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton goBack={navigation.goBack} />

        {/* <Image
          source={IMAGES.palsomeLogo}
          style={{
            alignItems: "center",
            justifyContent: "center",
            resizeMode: "contain",
            marginTop: widthPercentageToDP("2"),
          }}
        /> */}

        <View style={styles.textmain}>
          <Header>{t("Welcome!")}</Header>
          <Text style={styles.text}>{t("Sign in to continue")}</Text>
          <View style={styles.textsub}>
            <TextInput
              label={t("Email")}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? (
              <View>
                <Text style={styles.error}>{emailErrorTxt}</Text>
              </View>
            ) : null}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
              />
              {password ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={togglePasswordVisibility}
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
              <Button
                mode="contained"
                //  onPress={() => navigation.navigate("Main")}
                onPress={() => UserLoginFunction({ email, password })}
              >
                {t("SIGN IN")}
              </Button>
            )}
          </View>
          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => setModelVisible(true)}>
              <Text style={styles.forgot}>{t("Forget Password?")}</Text>
            </TouchableOpacity>
            {/* <View style={styles.line}>
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
              <View>
                <Text style={{ textAlign: "right" }}> or sign in with </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            </View> */}
          </View>
          {/* <View style={[styles.img, { justifyContent: "center" }]}>
            <Image source={IMAGES.facebookICON} style={styles.image} />
            <Image
              source={IMAGES.googleICON}
              style={[styles.image, { marginLeft: 5, marginRight: 5 }]}
            />
            {Platform.OS != "ios" ? (
              <Pressable>
                <Image
                  source={IMAGES.appleIcon2}
                  style={[styles.image, { borderRadius: 20 }]}
                  onPress={onAppleAuth}
                />
              </Pressable>
            ) : null}
          </View> */}
          <View style={styles.row}>
            <Text>{t("New to Palsome?")} </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Signup", {
                  fromSwitchUser: fromSwitchUser,
                })
              }
            >
              <Text style={styles.link}>{t("Join Now")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ForgetPasswordModal
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
      />
    </SafeAreaView>
  );
};

export default Signin;
