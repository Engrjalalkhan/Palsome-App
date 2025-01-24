import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import styles from "./styles";
import CityModal from "./CityModal";
import StateModal from "./StateModal";
import CountryModal from "./CountryModal";
import Button from "../../../Components/Button";
import MyHeader from "../../../Components/MyHeader";
import TextInput from "../../../Components/TextInput";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IosDatePicker from "../../../Components/IosDatePicker/IosDatePicker";
import CustomPicker from "../../../Components/CustomPickers/CustomPickerIos";
import CustomPickerAndroid from "../../../Components/CustomPickers/CustomPickerAndroid";

import {
  fetchCities,
  fetchEditProf,
  fetchStates,
  updateProfileData,
} from "../../../Redux/actions/ProfileActions";

import {
  Genders,
  MaritalStatus,
} from "../../../../Utils/Gender&StatusData/GenderMaritalData";

import { WP, HP } from "../../../../Utils/Resposive";

import { COLORS } from "../../../Constants/Colors";
import { BASE_URL } from "../../../Services/Constants";
import { getTimeline } from "../../../Redux/actions/NewsFeedActions";

const Editprofile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.userToken);
  const profData = useSelector((state) => state.prof.editProfData);

  const userId = useSelector((state) => state.auth.userData?.id);

  let allStates = useSelector((state) => state.prof.states);
  let allCities = useSelector((state) => state.prof.cities);

  const dob = profData?.params?.user?.dob;
  const initialDate = dob ? new Date(dob) : new Date();

  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 5);

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [allCity, setAllCity] = useState([]);
  const [username, setUsername] = useState("");
  const [allState, setAllState] = useState([]);
  const [fbAccount, setFbAccount] = useState("");
  const [country, setCountry] = useState("Country");
  const [twitterAccount, setTwitterAccount] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [concatTimelineData, setConcatTimelineData] = useState([]);
  const [PaginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [isTimelineData, setIsTimelineData] = useState(false);

  const [date, setDate] = useState(initialDate);
  const [cityDisplay, setCityDisplay] = useState();
  const [isModal, setIsModal] = useState(false);
  const [isModal1, setIsModal1] = useState(false);
  const [isModal2, setIsModal2] = useState(false);

  const [show, setShow] = useState(false);
  const [text, setText] = useState(t("Select Date of Birth"));

  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState();
  const [countryValue, setCountryValue] = useState();

  const [genderValue, setGenderValue] = useState("");

  const [maritalStatusValue, setMaritalStatusValue] = useState("");

  const [countries, setCountries] = useState();
  const [genderPickerVisible, setGenderPickerVisible] = useState(false);
  const [maritalPickerVisible, setMaritalPickerVisible] = useState(false);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [iosDate, setIosDate] = useState(initialDate);
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [updateLoader, setUpdateLoader] = useState(false);
  const [getDataLoader, setGetDataLoader] = useState(false);
  const [initial, setInitial] = useState(false);
  const [cityDisable, setcityDisable] = useState(false);
  const [stateDisable, setStateDisable] = useState(false);
  const [updateDob, setUpdateDob] = useState(new Date());
  const [dateError, setDateError] = useState(false);
  const [dateErrorText, setDateErrorText] = useState("");
  const [disabledField, setDisabledField] = useState(
    profData?.params?.user?.country_name
  );

  const disabledFields = () => {
    if (disabledField === null) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    dispatch(
      fetchEditProf({
        token: userToken,
        name: userData.name,
        setLoading: setGetDataLoader,
      })
    );
  };

  useEffect(() => {
    setUserData();
  }, [profData]);

  useEffect(() => {
    if (countryValue !== null && countryValue !== undefined) {
      setDisabledField("false");
    }
  }, [countryValue]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateError(false);
      setDateErrorText("");
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setDate(currentDate);
      setUpdateDob(currentDate);

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
    const currentDate = selectedDate || iosDate;
    setDateError(false);
    setDateErrorText("");
    setIosDate(currentDate);
    setUpdateDob(currentDate);
    let tempDate = new Date(currentDate);

    let fDate =
      ("0" + (tempDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + tempDate.getDate()).slice(-2) +
      "/" +
      tempDate.getFullYear();

    setText(fDate);
  };

  const setUserData = () => {
    if (profData) {
      setGenderValue(
        profData?.params?.user?.gender
          ? profData?.params?.user?.gender === "other"
            ? "Other"
            : profData?.params?.user?.gender === "female"
            ? "Female"
            : "Male"
          : "Select Gender"
      );
      setMaritalStatusPickerValue(
        profData?.params?.user?.marital_status
          ? MaritalStatus.find(
              (status) =>
                status.title.toLowerCase() ===
                profData?.params?.user?.marital_status.toLowerCase()
            )?.title
          : MaritalStatus[0].title
      );
      setAllCity(allCities);
      setAllState(allStates);
      setIosDate(initialDate);
      setDate(initialDate);
      setCountryValue(profData?.params?.user?.country_name);
      setStateValue(profData?.params?.user?.state_name);
      setCityList(stateValue);
      setCityValue(profData?.params?.user?.city_name);
      setFName(profData?.params?.user?.first_name);
      setLName(profData?.params?.user?.last_name);
      setEmail(profData?.params?.user?.email);
      setUsername(profData?.params?.user?.name);
      setStatList(countryValue);
      setPhone(profData?.params?.user?.phone_number);
      setCountry(profData?.params?.user?.country?.code);
      setFbAccount(profData?.params?.user?.facebook_profile_link);
      setTwitterAccount(profData?.params?.user?.twitter_profile_link);

      if (
        profData?.params?.user?.country_id != "" ||
        (profData?.params?.user?.country_id != null &&
          profData?.params?.user?.state_id == "") ||
        (profData?.params?.user?.state_id == null &&
          profData?.params?.user?.city_id == "") ||
        profData?.params?.user?.city_id == null
      ) {
        setAllState("");
      }
      setCountryId(profData?.params?.user?.country_id);
      setStateId(profData?.params?.user?.state_id);
      setCityId(profData?.params?.user?.city_id);

      setText(profData?.params?.user?.dob ? profData?.params?.user?.dob : "");
      setCountries(profData?.params?.countries);

      setGetDataLoader(false);

      if (profData?.params?.user?.city_name === null) {
        setCityDisplay(false);
      }
      cityValue === null ? setCityDisplay(false) : setCityDisplay(true);
    }
  };

  const formatDateInput = (inputText) => {
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

  const UserUpdate = async () => {
    const params = {
      first_name: fname,
      last_name: lname,
      name: username,
      dob: text,
      web_site: "",
      phone_number: phone,
      country: countryId,
      state: stateId,
      city: cityId,
      profile_description: "",
      gender:
        genderValue === "Other"
          ? "other"
          : genderValue === "Female"
          ? "female"
          : "male",
      religious_beliefs: "",
      birth_place: "",
      occupation: "",
      marital_status: maritalStatusValue,
      political_invcline: "",
      facebook_profile_link: fbAccount,
      twitter_profile_link: twitterAccount,
    };

    if (allState === "") {
    } else if (stateId === "" && params.state == null) {
      alert("Please Select a State");
      return;
    } else if (cityId === "" && params.city == null) {
      Alert.alert("Error", "The city field is required.");
      return;
    }
    if (!validateTextDateUpdate(text)) {
      Alert.alert("Error", "Please enter a valid date");
      return;
    }
    setDateError(false);
    setDateErrorText("");

    dispatch(
      updateProfileData({
        params: params,
        token: userToken,
        setUpdateLoader: setUpdateLoader,
      })
    );
    dispatch(
      getTimeline({
        userId,
        token,
        currentPage,
        concatTimelineData,
        setConcatTimelineData,
        setIsTimelineData,
        setPaginationData,
      })
    );
  };

  const validateTextDateUpdate = (text) => {
    const maxYear = new Date().getFullYear() - 5;
    {
      if (text?.length == 0) {
        return false;
      } else {
        if (text?.length > 10 || text?.length < 10) {
          return false;
        } else {
          if (parseInt(text.substring(0, 2)) > 12) {
            return false;
          } else if (parseInt(text.substring(3, 5)) > 31) {
            return false;
          } else if (parseInt(text.substring(6, 10)) < 1900) {
            return false;
          } else if (isFiveYearsAgo(text)) {
            return false;
          } else if (parseInt(text.substring(6, 10)) > maxYear) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  };

  const setGenderPickerValue = (val) => {
    if (val !== "Select Gender") setGenderValue(val);
  };

  const setMaritalStatusPickerValue = (val) => {
    if (val !== "Select Marital Status") setMaritalStatusValue(val);
  };

  const setCountryPickerValue = (val) => {
    if (val) {
      if (val !== "Select Country") {
        let conID = countries?.find((itm, ind) => itm.title == val)?.id;
        setCountryId(conID);

        dispatch(
          fetchStates({
            token: userToken,
            con_id: conID,
          })
        );
      }
    }

    setCountryValue(val);
  };

  const statesData = async (ids) => {
    let countryID = countries.find((itm, ind) => itm.title == ids)?.id;
    setCountryId(countryID);
    let options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        v: 1,
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let response = await fetch(
      `${BASE_URL}/getStates?country_id=${countryID}`,
      options
    );
    response = await response.json();
    response = response.payload.data;
    setAllState(response);
    setStateDisable(false);
    setcityDisable(true);
    console.log("these are states", response);
    setCityId("");
  };

  const citiesData = async (name) => {
    if (name != "Select State") {
      let stateID = allState?.find((itm, ind) => itm.title == name)?.id;
      setStateId(stateID);
      let options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          v: 1,
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      };
      let response = await fetch(
        `${BASE_URL}/getCities?state_id=${stateID}`,
        options
      );
      response = await response.json();
      response = response.payload.data;
      setAllCity(response);
      setInitial(true);
      setcityDisable(false);
      console.log("these are states", response);
    }
  };

  const setCityList = async (sname) => {
    if (sname !== "Select State") {
      let stateID = allState?.find((itm, ind) => itm.title == sname)?.id;
      setStateId(stateID);
      let options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          v: 1,
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      };

      if (stateID) {
        let response = await fetch(
          `${BASE_URL}/getCities?state_id=${stateID}`,
          options
        );
        response = await response.json();
        response = response.payload.data;
        setAllCity(response);
      }
    }
  };

  const setStatList = async (cname) => {
    try {
      if (cname !== "Select Country") {
        let conID = countries?.find((itm, ind) => itm.title == cname)?.id;
        setCountryId(conID);
        let options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            v: 1,
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        };
        if (conID) {
          let response = await fetch(
            `${BASE_URL}/getStates?country_id=${conID}`,
            options
          );
          response = await response.json();
          response = response.payload.data;
          setAllState(response);
        }
      }
    } catch (error) {
      console.log("these are states", error);
    }
  };

  const setStatePickerValue = (val) => {
    if (val) {
      let stID = allState?.find((itm, ind) => itm.title == val)?.id;
      setStateId(stID);

      dispatch(
        fetchCities({
          token: userToken,
          id: stID,
        })
      );
    }

    setStateValue(val);
  };

  const setCityPickerValue = (val) => {
    if (val) {
      setCityId(allCity?.find((itm, ind) => itm.title == val)?.id);
    }
    setCityValue(val);
  };

  const setCountryFunc = (val) => {
    setCountryPickerValue(val);
    statesData(val);
    setStateId("");
    setStateValue("Select State");
    setCityId("");
    setCityValue();
  };

  const setStateFunc = (val) => {
    setStatePickerValue(val);
    citiesData(val);

    setCityId("");
    setCityValue();
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

  const validateTextDate = (text, android = false) => {
    const maxYear = new Date().getFullYear() - 5;
    {
      if (text?.length == 0) {
        setDateError(false);
        !android && setIosDatePickerVisible(true);
      } else {
        setDateError(false);
        if (text?.length > 10 || text?.length < 10) {
          if (parseInt(text.substring(0, 2)) > 12) {
            setDateError(true);
            setDateErrorText("Invalid month");
            !android && setIosDatePickerVisible(true);
          } else if (parseInt(text.substring(3, 5)) > 31) {
            setDateError(true);
            setDateErrorText("Invalid day");
            !android && setIosDatePickerVisible(true);
          } else if (parseInt(text.substring(6, 10)) < 1900) {
            setDateError(true);
            setDateErrorText("Invalid year");
            !android && setIosDatePickerVisible(true);
          } else {
            setDateError(true);
            setDateErrorText("Invalid date format");
            !android && setIosDatePickerVisible(true);
          }
        } else {
          if (isFiveYearsAgo(text)) {
            setDateError(true);
            setDateErrorText(
              "You are too young to proceed. Minimum age requirement is 5 years."
            );
            !android && setIosDatePickerVisible(true);
          } else if (parseInt(text.substring(6, 10)) > maxYear) {
            setDateError(true);
            setDateErrorText("Date of birth cannot exceed current date");
            !android && setIosDatePickerVisible(true);
          } else {
            setDateError(false);
            setDateErrorText("Invalid date format");
            !android && setIosDatePickerVisible(true);
          }
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: keyboardStatus ? 30 : 0,
      }}
    >
      {Platform === "ios" ? (
        <View
          style={{ height: 50, width: WP(100), backgroundColor: "white" }}
        ></View>
      ) : null}

      {lname == "" || lname ? (
        <View style={{ flex: 1 }}>
          {!getDataLoader ? (
            <View style={{ flex: 1 }}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
              >
                <SafeAreaView style={{ flex: 1, width: "100%" }}>
                  <MyHeader
                    goBack={navigation.goBack}
                    heading={t("Personal Information")}
                  />
                  <View style={styles.textmain}>
                    <TextInput
                      label={
                        <Text>
                          {t("First Name")}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                      }
                      returnKeyType="next"
                      value={fname}
                      onChangeText={setFName}
                      maxLength={30}
                    />
                    <TextInput
                      label={
                        <Text>
                          {t("Last Name")}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                      }
                      returnKeyType="next"
                      value={lname}
                      onChangeText={setLName}
                      maxLength={30}
                    />
                    <TextInput
                      label={
                        <Text>
                          {t("Your Email")}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                      }
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoCompleteType="email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      editable={false}
                      value={email}
                      onChangeText={setEmail}
                    />
                    <TextInput
                      label={
                        <Text>
                          {t("Username")}
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                      }
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      maxLength={50}
                    />
                    <TextInput
                      label={t("Phone Number")}
                      value={phone}
                      onChangeText={setPhone}
                      returnKeyType="done"
                      keyboardType="number-pad"
                    />
                    <View style={styles.txtinputBoxforFBids}>
                      <FontAwesome
                        name="facebook-f"
                        color="#2F5B9D"
                        size={WP(5)}
                        style={{ marginHorizontal: WP(3) }}
                      />

                      <TextInput
                        label={t("Your Facebook Account")}
                        value={fbAccount}
                        onChangeText={setFbAccount}
                        returnKeyType="done"
                      />
                    </View>
                    <View style={styles.txtinputBoxforFBids}>
                      <FontAwesome
                        name="twitter"
                        color="#38BFF1"
                        size={WP(5)}
                        style={{ marginHorizontal: WP(2.3) }}
                      />

                      <TextInput
                        label={t("Your Twitter Account")}
                        value={twitterAccount}
                        onChangeText={setTwitterAccount}
                        returnKeyType="done"
                      />
                    </View>

                    <View
                      style={
                        Platform.OS == "android"
                          ? [styles.dob, { justifyContent: "space-between" }]
                          : styles.dob
                      }
                    >
                      <Text
                        style={
                          Platform.OS == "android"
                            ? styles.dobtext
                            : styles.dobtextIos
                        }
                      >
                        {t("Date of Birth")}:
                      </Text>

                      {Platform.OS === "android" ? (
                        <View
                          keyboardShouldPersistTaps="always"
                          style={styles.datePicker}
                          // onPress={() => setShow(true)}
                        >
                          <TextInput
                            maxLength={10}
                            containerStyle={{
                              alignItems: "flex-start",
                              marginLeft: 5,
                            }}
                            mode="outlined"
                            style={{ width: "83%" }}
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
                              validateTextDate(text, true);
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
                              value={date}
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
                          <View style={{ flexDirection: "row", flex: 1 }}>
                            <View>
                              <TextInput
                                maxLength={10}
                                mode="outlined"
                                style={{
                                  marginLeft: 10,
                                  height: 35,
                                  width: WP(50),
                                }}
                                keyboardType="number-pad"
                                placeholder="MM/DD/YYYY"
                                value={text}
                                onChangeText={(newText) => {
                                  if (newText.length <= 7) {
                                    setText(formatDateInput(newText));
                                  } else {
                                    setText(newText);
                                  }
                                }}
                              />
                            </View>

                            <TouchableOpacity
                              style={styles.datePicker}
                              onPress={() => validateTextDate(text)}
                            >
                              <Icon
                                name="calendar"
                                size={19}
                                color="#DF4B38"
                                style={{ marginRight: 20 }}
                              />
                            </TouchableOpacity>

                            <IosDatePicker
                              onIosDateChange={onIosDateChange}
                              // date={text ? new Date(text) : iosDate}
                              date={
                                text.length == 10
                                  ? new Date(text)?.toString() == "Invalid Date"
                                    ? iosDate
                                    : new Date(text)
                                  : iosDate
                              }
                              visible={iosDatePickerVisible}
                              hideVisible={() => setIosDatePickerVisible(false)}
                            />
                          </View>
                        </>
                      )}
                    </View>

                    {dateError && (
                      <Text style={styles.dateErrorStyle}>{dateErrorText}</Text>
                    )}

                    <View style={styles.detail}>
                      {/* //--------------- countries picker -----------------// */}
                      <View>
                        {Platform.OS === "ios" ? (
                          <>
                            <View style={styles.IosPicker}>
                              <TouchableOpacity
                                onPress={() => {
                                  setIsModal(true);
                                }}
                                style={styles.countryPickerIos}
                              >
                                <Text style={styles.subtext}>
                                  {countryValue
                                    ? countryValue
                                    : t("Select Country")}
                                </Text>
                                <Icon
                                  name="caret-down"
                                  color="#DF4B38"
                                  size={18}
                                />
                              </TouchableOpacity>
                            </View>

                            <CustomPicker
                              visible={isModal}
                              selectedValue={countryValue}
                              setValueFunc={setCountryFunc}
                              data={countries}
                              closeOnSelect={true}
                              hideVisible={() => setIsModal(false)}
                            />
                          </>
                        ) : (
                          <TouchableOpacity
                            style={[
                              styles.stateStyle,
                              {
                                width: Platform.OS === "ios" ? WP(90) : WP(80),
                              },
                            ]}
                            onPress={() => {
                              setIsModal(true);
                            }}
                          >
                            <Text
                              style={{
                                width: Platform.OS === "ios" ? WP(75) : WP(65),
                                color: "black",
                                fontWeight: "500",
                                fontSize: 16,
                                paddingLeft: 2,
                                marginLeft: Platform.OS === "ios" ? 8 : -10,
                              }}
                            >
                              {countryValue
                                ? countryValue
                                : t("Select Country")}
                            </Text>
                            <Icon
                              name="caret-down"
                              // style={{ marginLeft: 12 }}
                              color="#DF4B38"
                              size={Platform.OS === "ios" ? 18 : 15}
                            />
                          </TouchableOpacity>
                        )}

                        {/* 
                        <IOSCountryModal
                          data={countries}
                          isModal={isModal}
                          setIsModal={setIsModal}
                          setCityValue={setCityValue}
                          setStateValue={setStateValue}
                          cityValue={cityValue}
                          stateValue={stateValue}
                          countryValue={countryValue}
                          setCountryValue={setCountryValue}
                          // setCountryFunc={setCountryFunc}
                          
                          allCity={allCity}
                          allState={allState}
                          setAllCity={setAllCity}
                          setAllState={setAllState}
                          setCountryId={setCountryId}
                          setStateId={setStateId}
                          setCityId={setCityId}
                          setcityDisable={setcityDisable}
                          visible={isModal}
                          selectedValue={setCountryValue}
                          hideVisible={() => setIsModal(false)}
                        /> */}

                        {Platform.OS != "ios" && isModal ? (
                          <CountryModal
                            data={countries}
                            isModal={isModal}
                            setIsModal={setIsModal}
                            setCityValue={setCityValue}
                            setStateValue={setStateValue}
                            cityValue={cityValue}
                            stateValue={stateValue}
                            countryValue={countryValue}
                            setCountryValue={setCountryValue}
                            // setCountryFunc={setCountryFunc}
                            allCity={allCity}
                            allState={allState}
                            setAllCity={setAllCity}
                            setAllState={setAllState}
                            setCountryId={setCountryId}
                            setStateId={setStateId}
                            setCityId={setCityId}
                            setcityDisable={setcityDisable}
                            setStateDisable={setStateDisable}
                          />
                        ) : null}
                      </View>

                      {/* //------------------ states picker --------------------// */}

                      {Platform.OS != "ios" && isModal1 ? (
                        <StateModal
                          data={allState}
                          isModal={isModal1}
                          setIsModal={setIsModal1}
                          setCityValue={setCityValue}
                          setStateValue={setStateValue}
                          cityValue={cityValue}
                          stateValue={stateValue}
                          countryValue={countryValue}
                          setCountryValue={setCountryValue}
                          // setCountryFunc={setCountryFunc}
                          allCity={allCity}
                          allState={allState}
                          setAllCity={setAllCity}
                          setAllState={setAllState}
                          setCountryId={setCountryId}
                          setStateId={setStateId}
                          setCityId={setCityId}
                          setInitial={setInitial}
                          setcityDisable={setcityDisable}
                          setStateDisable={setStateDisable}
                          setCityDisplay={setCityDisplay}
                        />
                      ) : null}

                      {Platform.OS === "ios" ? (
                        <>
                          {console.log(disabledFields(), "disabledFields()")}
                          <View style={styles.IosPicker}>
                            <TouchableOpacity
                              onPress={() => setIsModal1(true)}
                              // disabled={stateDisable === false ? false : true}
                              disabled={disabledFields()}
                              style={[styles.countryPickerIos]}
                            >
                              <Text
                                style={[
                                  styles.subtext,
                                  {
                                    color: disabledFields()
                                      ? "#d3d3d3"
                                      : "black",
                                  },
                                ]}
                              >
                                {stateValue ? stateValue : t("Select State")}
                              </Text>
                              <Icon
                                name="caret-down"
                                color={cityDisable ? "#d3d3d3" : "#DF4B38"}
                                size={18}
                              />
                            </TouchableOpacity>
                          </View>

                          <CustomPicker
                            visible={isModal1}
                            selectedValue={stateValue}
                            setValueFunc={setStateFunc}
                            data={allState}
                            closeOnSelect={true}
                            hideVisible={() => setIsModal1(false)}
                          />
                        </>
                      ) : (
                        <View>
                          <TouchableOpacity
                            disabled={stateDisable === false ? false : true}
                            style={[
                              styles.stateStyle,
                              {
                                display: allState != "" ? "flex" : "none",
                                width: Platform.OS === "ios" ? WP(90) : WP(80),
                                borderWidth: stateDisable ? 0 : 1,
                              },
                            ]}
                            onPress={() => {
                              statesData(countryValue);
                              setIsModal1(true);
                            }}
                          >
                            <Text
                              style={{
                                width: Platform.OS === "ios" ? WP(75) : WP(65),
                                fontWeight: "500",

                                color: stateDisable ? "gray" : "black",
                                fontSize: 16,
                                paddingLeft: 2,
                                marginLeft: Platform.OS === "ios" ? 8 : -10,
                              }}
                            >
                              {stateValue ? stateValue : t("Select State")}
                            </Text>
                            <Icon
                              name="caret-down"
                              style={{ marginLeft: 12 }}
                              color={stateDisable ? "#d3d3d3" : "#DF4B38"}
                              size={Platform.OS === "ios" ? 18 : 15}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View style={{ alignItems: "center" }}>
                      {Platform.OS === "ios" ? (
                        <>
                          <View
                            style={[
                              styles.IosPicker2,
                              { borderWidth: cityDisable ? 0.4 : 1 },
                            ]}
                          >
                            <TouchableOpacity
                              // disabled={cityDisable === false ? false : true}
                              disabled={disabledFields()}
                              onPress={() => {
                                if (!initial) {
                                  setCityList(stateValue);
                                }
                                setIsModal2(true);
                              }}
                              style={styles.countryPickerIos}
                            >
                              <Text
                                style={[
                                  styles.subtext,
                                  {
                                    color: disabledFields()
                                      ? "#d3d3d3"
                                      : COLORS.black,
                                  },
                                ]}
                              >
                                {cityValue ? cityValue : t("Select City")}
                              </Text>
                              <Icon
                                name="caret-down"
                                color={disabledFields() ? "#d3d3d3" : "#DF4B38"}
                                size={18}
                              />
                            </TouchableOpacity>
                          </View>

                          <CustomPicker
                            visible={isModal2}
                            selectedValue={cityValue}
                            setValueFunc={(val) => setCityPickerValue(val)}
                            data={allCity}
                            closeOnSelect={true}
                            hideVisible={() => setIsModal2(false)}
                          />
                        </>
                      ) : (
                        <TouchableOpacity
                          disabled={cityDisable === false ? false : true}
                          style={[
                            styles.stateStyle,
                            {
                              display:
                                allState == ""
                                  ? "none"
                                  : allCity == ""
                                  ? "none"
                                  : cityDisplay
                                  ? "flex"
                                  : cityValue === null
                                  ? "none"
                                  : "flex",
                              width: Platform.OS === "ios" ? WP(90) : WP(80),
                              marginBottom: 2,
                              borderWidth: cityDisable ? 0.4 : 1,
                            },
                          ]}
                          onPress={() => {
                            if (!initial) {
                              setCityList(stateValue);
                            }
                            setIsModal2(true);
                          }}
                        >
                          <Text
                            style={{
                              width: Platform.OS === "ios" ? WP(75) : WP(65),
                              fontWeight: "500",
                              color: cityDisable ? "gray" : "black",
                              fontSize: 16,
                              paddingLeft: 2,
                              marginLeft: Platform.OS === "ios" ? 8 : -10,
                            }}
                          >
                            {cityValue ? cityValue : t("Select  City")}
                          </Text>
                          <Icon
                            name="caret-down"
                            style={{ marginLeft: 12 }}
                            color={cityDisable ? "gray" : "#DF4B38"}
                            size={Platform.OS === "ios" ? 18 : 15}
                          />
                        </TouchableOpacity>
                      )}
                      {Platform.OS != "ios" && isModal2 ? (
                        <CityModal
                          data={allCity}
                          isModal2={isModal2}
                          setIsModal2={setIsModal2}
                          setCityValue={setCityValue}
                          setStateValue={setStateValue}
                          cityValue={cityValue}
                          stateValue={stateValue}
                          countryValue={countryValue}
                          setCountryValue={setCountryValue}
                          // setCountryFunc={setCountryFunc}
                          allCity={allCity}
                          allState={allState}
                          setAllCity={setAllCity}
                          setAllState={setAllState}
                          setCountryId={setCountryId}
                          setStateId={setStateId}
                          setCityId={setCityId}
                        />
                      ) : null}
                    </View>

                    {/* ------------gender ----------------- */}
                    <View style={styles.detail}>
                      {Platform.OS === "ios" ? (
                        <>
                          <View style={styles.IosPicker2}>
                            <TouchableOpacity
                              onPress={() => setGenderPickerVisible(true)}
                              style={styles.countryPickerIos}
                            >
                              <Text style={styles.subtext}>
                                {t(genderValue)}
                              </Text>
                              <Icon
                                name="caret-down"
                                color="#DF4B38"
                                size={18}
                              />
                            </TouchableOpacity>
                          </View>
                          <CustomPicker
                            visible={genderPickerVisible}
                            selectedValue={genderValue}
                            setValueFunc={(val) => setGenderPickerValue(val)}
                            data={Genders}
                            hideVisible={() => setGenderPickerVisible(false)}
                          />
                        </>
                      ) : (
                        <View style={styles.city}>
                          <CustomPickerAndroid
                            selectedValue={genderValue}
                            setValueFunc={(val) => setGenderPickerValue(val)}
                            data={Genders}
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
                      {/* ---------------- Marital -------------- */}
                      {Platform.OS === "ios" ? (
                        <>
                          <View style={styles.IosPicker3}>
                            <TouchableOpacity
                              onPress={() => setMaritalPickerVisible(true)}
                              style={styles.countryPickerIos}
                            >
                              <Text style={styles.subtext}>
                                {!maritalStatusValue
                                  ? t("Select Marital Status")
                                  : t(maritalStatusValue)}
                              </Text>
                              <Icon
                                name="caret-down"
                                color="#DF4B38"
                                size={18}
                              />
                            </TouchableOpacity>
                          </View>
                          <CustomPicker
                            visible={maritalPickerVisible}
                            selectedValue={maritalStatusValue}
                            setValueFunc={(val) =>
                              setMaritalStatusPickerValue(val)
                            }
                            data={MaritalStatus}
                            hideVisible={() => setMaritalPickerVisible(false)}
                          />
                        </>
                      ) : (
                        <View style={styles.city}>
                          <CustomPickerAndroid
                            selectedValue={maritalStatusValue}
                            setValueFunc={(val) =>
                              setMaritalStatusPickerValue(val)
                            }
                            data={MaritalStatus}
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
                    </View>

                    {!updateLoader ? (
                      <View style={styles.btnmain}>
                        <Button
                          mode="contained"
                          style={styles.btnStyle}
                          // style="small
                          onPress={() => {
                            UserUpdate();
                          }}
                        >
                          {t("Update")}
                        </Button>
                      </View>
                    ) : null}
                    {updateLoader ? (
                      <ActivityIndicator
                        size="large"
                        color="#DF4B38"
                        style={{ marginVertical: HP(2.5) }}
                      />
                    ) : null}
                  </View>
                </SafeAreaView>
              </KeyboardAwareScrollView>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#DF4B38" />
            </View>
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};
export default Editprofile;
