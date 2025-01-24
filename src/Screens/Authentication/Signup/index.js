import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { heightPercentageToDP as HP } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import styles from "./styles";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import IosDatePicker from "../../../Components/IosDatePicker/IosDatePicker";
import CustomPicker from "../../../Components/CustomPickers/CustomPickerIos";
import CustomPickerAndroid from "../../../Components/CustomPickers/CustomPickerAndroid";

import { ACTIONS } from "../../../Redux/action-types";
import { signUpRequest } from "../../../Redux/actions/AuthActions";

import { Genders } from "../../../../Utils/Gender&StatusData/GenderMaritalData";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";

const Signup = ({ navigation, route }) => {
  const fromSwitchUser = route?.params?.fromSwitchUser;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const errorText = useSelector((state) => state.auth.errorText);

  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 5);

  const [inactiveUserData, setInactiveUserData] = useState({});
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [iosDateValue, setIosDateValue] = useState("");
  const [iosDate, setIosDate] = useState(new Date());
  const [genderValue, setGenderValue] = useState(t("Select Gender"));
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameNumError, setFirstNameNumError] = useState(false);
  const [lastNameNumError, setLastNameNumError] = useState(false);
  const [firstNameErrorTxt, setFirstNameErrorTxt] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [lastNameError, setLastNameError] = useState("");
  const [lastNameErrorText, setLastNameErrorText] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setpasswordErrorText] = useState("");
  const [genderPickerVisible, setGenderPickerVisible] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [genderErrorText, setGenderErrorText] = useState("");
  const [dobError, setDobError] = useState(true);
  const [dobErrorText, setDobErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIosDatePicker, setShowIosDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false); // For Confirm Password field

  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const userRegister = async () => {
    const params = {
      email: email,
      password: password,
      first_name: fname,
      last_name: lname,
      password_confirmation: password,
      // dob: text,
      dob: Platform.OS === "ios" ? iosDateValue : text,
      gender:
        genderValue === "Other"
          ? "other"
          : genderValue === "Female"
          ? "female"
          : "male",
    };

    if (
      email &&
      password &&
      fname &&
      lname &&
      cpassword &&
      genderValue != "Select Gender" &&
      // text != "Select Date of Birth"
      Platform.OS === "ios"
        ? checkValidDOB()
        : checkValidDOB()
    ) {
      setFirstNameError(false);
      setLastNameError(false);
      setPasswordError(false);
      setEmailError(false);
      setConfirmPasswordError(false);
      setGenderError(false);
      setDobError(false);

      if (!email.toLowerCase().match(emailRegex)) {
        setEmailError(true);
        setEmailErrorText(t("Email is Invalid"));
      }
      if (password.length < 8) {
        setPasswordError(true);
        setpasswordErrorText(t("Password must be 8 characters long"));
      }
      console.log("params", params);
      if (
        email.toLowerCase().match(emailRegex) &&
        password.length > 7 &&
        fname.length >= 3 &&
        lname.length >= 3
      ) {
        dispatch(signUpRequest({ params, setLoading, setInactiveUserData }));
      }
      if (fname == "") {
        setFirstNameError(true);
        setFirstNameErrorTxt(t("First name is required"));
      } else if (fname.length < 3) {
        setFirstNameError(true);
        setFirstNameErrorTxt(t("The first name must be at least 3 characters"));
      }
      if (lname == "") {
        setLastNameError(true);
        setLastNameErrorText(t("Last name is required"));
      } else if (lname.length < 3) {
        setLastNameError(true);
        setLastNameErrorText(t("The last name must be at least 3 characters"));
      }
      if (!password) {
        setPasswordError(true);
        setpasswordErrorText(t("Password is required"));
      }
      if (!email) {
        setEmailError(true);
        setEmailErrorText("Email is required");
      }

      if (genderValue == "Select Gender") {
        setGenderError(true);
        setGenderErrorText(t("Gender is required"));
      }
    } else {
      if (fname == "") {
        setFirstNameError(true);
        setFirstNameErrorTxt(t("First name is required"));
      } else if (fname.length < 3) {
        setFirstNameError(true);
        setFirstNameErrorTxt(t("The first name must be at least 3 characters"));
      }
      if (lname == "") {
        setLastNameError(true);
        setLastNameErrorText(t("Last name is required"));
      } else if (lname.length < 3) {
        setLastNameError(true);
        setLastNameErrorText(t("The last name must be at least 3 characters"));
      }
      if (!password) {
        setPasswordError(true);
        setpasswordErrorText(t("Password is required"));
      }
      if (!email) {
        setEmailError(true);
        setEmailErrorText(t("Email is required"));
      }

      if (genderValue == "Select Gender") {
        setGenderError(true);
        setGenderErrorText(t("Gender is required"));
      }
      if (Platform.OS === "ios") {
        if (iosDateValue == "") {
          console.log("in if section");
          setDobError(true);
          setDobErrorText(t("Date of birth is required"));
        } else if (iosDateValue != "") {
          console.log("in else section");
          checkValidDOB();
        }
      } else {
        if (text == "") {
          console.log("in if section");
          setDobError(true);
          setDobErrorText(t("Date of birth is required"));
        } else if (text != "") {
          console.log("in else section");
          checkValidDOB();
        }
      }
    }
  };

  function isFiveYearsAgo(inputDate) {
    let userDate = new Date(inputDate);
    let currentDate = new Date();

    let fiveYearsAgo = new Date(currentDate);
    fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

    return (
      userDate.getTime() > fiveYearsAgo.getTime() &&
      userDate.getTime() <= currentDate.getTime()
    );
  }

  const checkValidDOB = (cal) => {
    let enteredDate = iosDateValue || text;

    let monthString = enteredDate.split("/")[0];
    let dayString = enteredDate.split("/")[1];
    let yearString = enteredDate.split("/")[2];

    // min year must be 5 years less than current date
    let minyear = new Date().getFullYear() - 5;
    let currentYear = new Date().getFullYear();

    if (
      monthString?.length == 2 &&
      dayString?.length == 2 &&
      yearString?.length == 4
    ) {
      if (monthString > 0 && monthString < 13) {
        if (dayString > 0 && dayString < 32) {
          if (isFiveYearsAgo(enteredDate)) {
            setDobError(true);
            setDobErrorText(
              t(
                "You are too young to proceed. Minimum age requirement is 5 years."
              )
            );

            cal && setShowIosDatePicker(true);
            return false;
          }

          if (yearString > minyear && yearString >= currentYear) {
            setDobError(true);
            setDobErrorText(t("Date of birth cannot exceed current date"));

            cal && setShowIosDatePicker(true);
            return;
          }

          if (yearString < 1900) {
            setDobError(true);
            setDobErrorText(t("Invalid year"));

            cal && setShowIosDatePicker(true);
            return;
          }

          if (yearString >= 1900) {
            setDobError(false);
            setDobErrorText("");

            if (cal) {
              setShowIosDatePicker(true);
            }

            return true;
          } else {
            setDobError(true);
            setDobErrorText(t("Invalid year"));
          }

          if (yearString > minyear) {
            setDobError(true);
            setDobErrorText(
              t(
                "You are too young to proceed. Minimum age requirement is 5 years."
              )
            );
          } else {
            setDobError(false);
            setDobErrorText("");
            if (cal) {
              setShowIosDatePicker(true);
            }
          }
        } else {
          setDobError(true);
          setDobErrorText(t("Invalid day"));

          setShowIosDatePicker(true);
        }
      } else {
        setDobError(true);
        setDobErrorText(t("Invalid month"));

        cal && setShowIosDatePicker(true);
      }
    } else {
      setDobError(true);
      setDobErrorText(t("Invalid date format"));

      cal && setShowIosDatePicker(true);
    }
  };

  const setGenderPickerValue = (val) => {
    setGenderValue(val);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setDate(currentDate);

      let tempDate = new Date(currentDate);

      let fDate =
        ("0" + (tempDate.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + tempDate.getDate()).slice(-2) +
        "/" +
        tempDate.getFullYear();

      setText(fDate);
    } else setShow(false);
  };

  const onIosDateChange = (selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || iosDate;
    setIosDate(currentDate);
    let tempDate = new Date(currentDate);

    let fDate =
      ("0" + (tempDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + tempDate.getDate()).slice(-2) +
      "/" +
      tempDate.getFullYear();

    setIosDateValue(fDate);
    setText(fDate);
  };

  useEffect(() => {
    if (inactiveUserData?.token?.length) {
      navigation.navigate("Otp", {
        email: email,
        password: password,
        inactiveUser: inactiveUserData,
        fromSwitchUser: fromSwitchUser,
      });
    }
  }, [inactiveUserData]);

  useEffect(() => {
    // Clear error state when component unmounts
    errorText ? dispatch({ type: ACTIONS.ERRORS, errorText: "" }) : null;
  }, []);

  const onFocus = () => {
    errorText ? dispatch({ type: ACTIONS.ERRORS, errorText: "" }) : null;
  };

  const firstNameChange = (text) => {
    const regex = /^[a-zA-Z ]*$/;
    if (fname !== "" || fname !== null) {
      if (regex.test(text)) {
        setFName(text);
        setFirstNameNumError(false);
      } else {
        setFirstNameNumError(true);
      }
      setFName(text);
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
  };

  const lastNameChange = (text) => {
    const regex = /^[a-zA-Z ]*$/;
    if (lname !== "" || lname !== null) {
      if (regex.test(text)) {
        setLName(text);
        setLastNameNumError(false);
      } else {
        setLastNameNumError(true);
      }
      setLName(text);
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  };

  const emailChange = (text) => {
    if (email !== "" || email !== null) {
      setEmail(text);
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const passwordChange = (text) => {
    if (password !== "" || password !== null) {
      setPassword(text);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const confirmPasswordChange = (text) => {
    if (cpassword !== "" || cpassword !== null) {
      setCPassword(text);
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const genderValueChange = (text) => {
    if (genderValue !== "" || genderValue !== null) {
      setGenderPickerValue(text);
      setGenderError(false);
    } else {
      setGenderError(true);
    }
  };

  const formatDateInput = (inputText) => {
    if (inputText !== "") {
      setDobError(false);
    }

    const numericText = inputText.replace(/\D/g, "");
    let formattedText = "";

    for (let i = 0; i < numericText.length; i++) {
      if (i === 2 || i === 6) {
        formattedText += `/${numericText[i]}`;
      } else if (i === 4) {
        formattedText += `/${numericText[i]}`;
      } else {
        formattedText += numericText[i];
      }
    }

    return formattedText;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackButton goBack={navigation.goBack} />

        <View style={styles.textmain}>
          <Header>{t("Hi!")}</Header>
          <Text style={styles.text}>{t("Create a new account")}</Text>

          <TextInput
            label={t("First Name")}
            returnKeyType="next"
            value={fname}
            maxLength={30}
            onChangeText={(text) => firstNameChange(text)}
            onFocus={onFocus}
          />

          {firstNameError ? (
            <View>
              <Text style={styles.error}>{firstNameErrorTxt}</Text>
            </View>
          ) : null}

          {firstNameNumError ? (
            <View>
              <Text style={styles.error}>
                {t("This name contains certain characters that aren't allowed")}
              </Text>
            </View>
          ) : null}

          {errorText?.first_name ? (
            <View>
              <Text style={styles.error}>{errorText?.first_name}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("Last Name")}
            returnKeyType="next"
            value={lname}
            maxLength={30}
            onChangeText={(text) => lastNameChange(text)}
            onFocus={onFocus}
          />

          {lastNameError ? (
            <View>
              <Text style={styles.error}>{lastNameErrorText}</Text>
            </View>
          ) : null}

          {lastNameNumError ? (
            <View>
              <Text style={styles.error}>
                {t("This name contains certain characters that aren't allowed")}
              </Text>
            </View>
          ) : null}

          {errorText?.last_name ? (
            <View>
              <Text style={styles.error}>{errorText?.last_name}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("Email")}
            returnKeyType="next"
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            textContentType="emailAddress"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => emailChange(text)}
            onFocus={onFocus}
          />

          {emailError ? (
            <View>
              <Text style={styles.error}>{emailErrorText}</Text>
            </View>
          ) : null}

          {errorText?.email ? (
            <View>
              <Text style={styles.error}>{errorText?.email}</Text>
            </View>
          ) : null}

          {Platform.OS === "ios" ? (
            <View style={styles.IosPicker2}>
              <TouchableOpacity
                onPress={() => setGenderPickerVisible(true)}
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 5,
                }}
              >
                <Text style={styles.subtext}>{t(genderValue)}</Text>
                <CustomPicker
                  visible={genderPickerVisible}
                  selectedValue={genderValue}
                  setValueFunc={(val) => genderValueChange(val)}
                  data={Genders}
                  hideVisible={() => setGenderPickerVisible(false)}
                />
                {ICONS.fontAwesome5("chevron-circle-down", COLORS.primary)}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.city}>
              <CustomPickerAndroid
                selectedValue={genderValue}
                setValueFunc={(val) => genderValueChange(val)}
                data={Genders}
                t={t}
              />
              <Text
                style={{
                  width: "100%",
                  height: 60,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
              >
                {" "}
              </Text>
            </View>
          )}

          <View style={{ borderBottomWidth: 1, marginTop: 20 }} />
          {genderError ? (
            <View>
              <Text style={styles.error}>{genderErrorText}</Text>
            </View>
          ) : null}

          <View style={styles.dob}>
            <Text
              style={
                Platform.OS == "android" ? styles.dobtext : styles.dobtextIos
              }
            >
              {t("Date of Birth")}:
            </Text>

            {Platform.OS === "android" ? (
              <View style={styles.datePicker} onPress={() => setShow(true)}>
                <TextInput
                  maxLength={10}
                  containerStyle={{
                    alignItems: "flex-start",
                    marginLeft: 5,
                  }}
                  mode="outlined"
                  style={{ width: "82%", marginLeft: 0 }}
                  keyboardType="number-pad"
                  placeholder="(MM/DD/YYYY)"
                  value={text}
                  onChangeText={(newText) => {
                    if (newText.length <= 7) {
                      setText(formatDateInput(newText));
                    } else {
                      setText(newText);
                    }
                  }}
                />

                <TouchableOpacity
                  style={styles.calenderStyle}
                  onPress={() => {
                    setShow(true);
                    setDobError(false);
                  }}
                >
                  <Icon
                    name="calendar"
                    size={19}
                    style={{
                      marginRight: 10,
                    }}
                    color="#DF4B38"
                  />
                </TouchableOpacity>

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={
                      text.length == 10
                        ? new Date(text)?.toString() == "Invalid Date"
                          ? maxDate
                          : new Date(text)
                        : maxDate
                    }
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    maximumDate={maxDate}
                  />
                )}
              </View>
            ) : (
              <>
                <TextInput
                  maxLength={10}
                  mode="outlined"
                  style={{ width: "60%", marginLeft: 10, height: 35 }}
                  keyboardType="number-pad"
                  placeholder="MM/DD/YYYY"
                  value={iosDateValue ? iosDateValue : iosDate}
                  onChangeText={(newText) => {
                    if (newText.length <= 7) {
                      setIosDateValue(formatDateInput(newText));
                    } else {
                      setIosDateValue(newText);
                    }
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 0,
                  }}
                  onPress={() => {
                    iosDateValue
                      ? checkValidDOB((cal = 1))
                      : setShowIosDatePicker(true);

                    if (iosDateValue == "") {
                      setDobError(false);
                    }
                  }}
                >
                  <Icon name="calendar" size={19} color="#DF4B38" />
                </TouchableOpacity>

                {showIosDatePicker && (
                  <IosDatePicker
                    onIosDateChange={(selectedDate) =>
                      onIosDateChange(selectedDate)
                    }
                    date={
                      iosDateValue.length == 10
                        ? new Date(iosDateValue)?.toString() == "Invalid Date"
                          ? iosDate
                          : new Date(iosDateValue)
                        : iosDate
                    }
                    visible={showIosDatePicker}
                    hideVisible={() => setShowIosDatePicker(false)}
                  />
                )}
              </>
            )}
          </View>
          <View style={{ borderBottomWidth: 1, marginTop: 20 }} />
          {dobError ? (
            <View>
              <Text style={styles.error}>{dobErrorText}</Text>
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
              onChangeText={(text) => passwordChange(text)}
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
              <Text style={styles.error}>{passwordErrorText}</Text>
            </View>
          ) : null}

          <View style={styles.btnmain}>
            {errorText?.password ? (
              <View>
                <Text style={styles.error}>{errorText?.password}</Text>
              </View>
            ) : null}
            {loading ? (
              <ActivityIndicator size={HP(8)} color={COLORS.primary} />
            ) : (
              <Button
                mode={t("contained")}
                style={{ marginTop: 20 }}
                onPress={() => {
                  userRegister({ fname, lname, email, password, cpassword });
                }}
              >
                {t("SIGN UP")}
              </Button>
            )}
            {!fromSwitchUser && (
              <View style={styles.row}>
                <Text>{t("Already have an account?")}</Text>
                <TouchableOpacity onPress={() => navigation.replace("Signin")}>
                  <Text style={styles.link}>{t("Sign in")} </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Signup;
