import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../Redux/actions/AuthActions";
import { COLORS } from "../../../Constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

const ForgetPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorTxt, setPasswordErrorTxt] = useState("");

  const [Newpassword, setNewPassword] = useState("");
  const [NewpasswordError, setNewPasswordError] = useState(false);
  const [NewpasswordErrorTxt, setNewPasswordErrorTxt] = useState("");

  const [CNewpassword, setCNewPassword] = useState("");
  const [CNewpasswordError, setCNewPasswordError] = useState(false);
  const [CNewpasswordErrorTxt, setCNewPasswordErrorTxt] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNPassword, setShowNPassword] = useState(false);
  const [showCNPassword, setShowCNPassword] = useState(false); // For Confirm Password field

  const ResetPasswordFunction = async () => {
    const params = {
      Newpassword: Newpassword,
      CNewpassword: CNewpassword,
      password: password,
    };

    if (CNewpassword && Newpassword && password) {
      setPasswordError(false);
      setNewPasswordError(false);
      setCNewPasswordError(false);
      if (Newpassword != CNewpassword) {
        setCNewPasswordError(true);
        setCNewPasswordErrorTxt(t("Confirm Password not matched"));
      } else {
        console.log("everything fine!");
        let formData = new FormData();
        formData.append("old_password", password);
        formData.append("password", Newpassword);
        formData.append("password_confirmation", CNewpassword);
        dispatch(changePassword({ formData, token }));
      }
    } else {
      if (!password) {
        setPasswordError(true);
        setPasswordErrorTxt(t("Password is Required"));
      } else {
        setPasswordError(false);
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
    } else if (field === "nPassword") {
      setShowNPassword(!showNPassword);
    } else if (field === "cNPassword") {
      setShowCNPassword(!showCNPassword);
    }
  };

  return (
    <SafeAreaView style={styles.statusBarContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackButton goBack={navigation.goBack} style={{ top: 20 }} />
        <View style={styles.textmain}>
          <Header>{t("Change Your Password")}!</Header>
          <View style={styles.textsub}>
            {/* <TextInput
              label="Old Password"
              returnKeyType="done"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Old Password")}
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

            {/* <TextInput
              label="New Password"
              returnKeyType="done"
              secureTextEntry
              value={Newpassword}
              onChangeText={setNewPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("New Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showNPassword}
                value={Newpassword}
                onChangeText={setNewPassword}
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
              label="Confirm New Password"
              returnKeyType="done"
              secureTextEntry
              value={CNewpassword}
              onChangeText={setCNewPassword}
            /> */}
            <View style={styles.containerTextInput}>
              <TextInput
                label={t("Confirm New Password")}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showCNPassword}
                value={CNewpassword}
                onChangeText={setCNewPassword}
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
            <Button
              mode="contained"
              //  onPress={() => navigation.navigate("Main")}
              onPress={() =>
                ResetPasswordFunction({ password, Newpassword, CNewpassword })
              }
            >
              {t("Change Password")}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ForgetPassword;
