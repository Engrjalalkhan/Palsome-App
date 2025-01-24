import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import MyHeader from "../../../Components/MyHeader";
import Button from "../../../Components/NewButton";
import CheckBox from "@react-native-community/checkbox";
import Toast from "react-native-simple-toast";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import styles from "./styles";
import { Divider } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import { updateExperience } from "../../../Redux/actions/ProfileActions";
import IosDatePicker from "../../../Components/IosDatePicker/IosDatePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import SimpleToast from "react-native-simple-toast";

const EditExperience = ({ navigation, route }) => {
  const { t } = useTranslation();
  const data = route.params.data;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const [company, setCompany] = useState(data.company);
  const [position, setPosition] = useState(data.position);
  const [city, setCity] = useState(data.city);
  const [description, setDescription] = useState(data.description);
  const [isSelected, setSelection] = useState(false);
  const [text, setText] = useState(t("Select Date"));
  const [iosDate, setIosDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [toText, setToText] = useState(t("Select Date"));
  const [toIosDate, setToIosDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [toShow, setToShow] = useState(false);
  const [toIosDatePickerVisible, setToIosDatePickerVisible] = useState(false);
  const [toMonth, setToMonth] = useState();
  const [toYear, setToYear] = useState();
  const [isFormValid, setIsFormValid] = useState();

  const checkFormValidity = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    const selectedIosDate = new Date(iosDate);
    selectedIosDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    const selectedToIosDate = new Date(toIosDate);
    selectedToIosDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    const selectedToDate = new Date(toDate);
    selectedToDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    if (isSelected) {
      setIsFormValid(
        !!company &&
          !!position &&
          !!city &&
          (selectedIosDate.getTime() !== currentDate.getTime() ||
            selectedDate.getTime() !== currentDate.getTime())
      );
    } else {
      setIsFormValid(
        !!company &&
          !!position &&
          !!city &&
          (selectedIosDate.getTime() !== currentDate.getTime() ||
            selectedDate.getTime() !== currentDate.getTime()) &&
          (selectedToIosDate.getTime() !== currentDate.getTime() ||
            selectedToDate.getTime() !== currentDate.getTime())
      );
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [company, position, city, iosDate, date, toIosDate, toDate, isSelected]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    const currentDateObj = new Date(currentDate);
    const endDateObj = new Date(toDate);

    if (currentDateObj <= endDateObj) {
      setDate(currentDate);

      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setMonth(tempDate.getMonth() + 1);
      setYear(tempDate.getFullYear());
      setText(fDate);

      console.log("month", tempDate.getMonth() + 1);
      console.log("year", tempDate.getFullYear());
    } else {
      Alert.alert(
        "",
        t("Start date must be today or a past date."),
        [{ text: t("OK") }],
        { cancelable: false }
      );
    }
  };

  const onToChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setToShow(Platform.OS === "ios");
    const currentDateObj = new Date(currentDate);
    currentDateObj.setHours(0, 0, 0, 0);

    const startDateObj = new Date(date);
    startDateObj.setHours(0, 0, 0, 0);

    const newDate = new Date();
    newDate.setHours(0, 0, 0, 0);
    const currentDateTimestamp = currentDateObj.getTime();
    const newDateTimestamp = newDate.getTime();

    if (
      currentDateObj > startDateObj &&
      currentDateTimestamp !== newDateTimestamp
    ) {
      setToDate(currentDate);

      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "/" +
        (tempDate.getMonth() + 1) +
        "/" +
        tempDate.getFullYear();
      setToText(fDate);

      console.log(tempDate.getMonth() + 1);
      setToMonth(tempDate.getMonth() + 1);
      setToYear(tempDate.getFullYear());
    } else {
      if (currentDateTimestamp == newDateTimestamp) {
        Alert.alert(
          "",
          t("Your end date can't be today date. Please try again."),
          [{ text: t("OK") }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "",
          t(
            "Your end date can't be earlier than your start date. Please try again."
          ),
          [{ text: t("OK") }],
          { cancelable: false }
        );
      }
    }
  };

  const onIosDateChange = (selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || iosDate;
    const currentDateObj = new Date(currentDate);
    const endDateObj = new Date(toIosDate);

    if (currentDateObj <= endDateObj) {
      setIosDate(currentDate);
      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "-" +
        (tempDate.getMonth() + 1) +
        "-" +
        tempDate.getFullYear();
      setText(fDate);

      setMonth(tempDate.getMonth() + 1);
      setYear(tempDate.getFullYear());

      console.log("month - - -", tempDate.getMonth() + 1);
      console.log("year - - -", tempDate.getFullYear());
    } else {
      Alert.alert(
        "",
        t("Start date must be today or a past date."),
        [{ text: t("OK") }],
        { cancelable: false }
      );
    }
  };

  const onToIosDateChange = (selectedDate) => {
    console.log(selectedDate);
    const newDate = new Date();
    newDate.setHours(0, 0, 0, 0);
    const currentDate = selectedDate || toIosDate;
    const currentDateObj = new Date(currentDate);
    currentDateObj.setHours(0, 0, 0, 0);
    const startDateObj = new Date(iosDate);
    startDateObj.setHours(0, 0, 0, 0);

    const currentDateTimestamp = currentDateObj.getTime();
    const newDateTimestamp = newDate.getTime();
    if (
      currentDateObj > startDateObj &&
      currentDateTimestamp !== newDateTimestamp
    ) {
      setToIosDate(currentDate);
      let tempDate = new Date(currentDate);
      let fDate =
        tempDate.getDate() +
        "-" +
        (tempDate.getMonth() + 1) +
        "-" +
        tempDate.getFullYear();
      setToText(fDate);

      setToMonth(tempDate.getMonth() + 1);
      setToYear(tempDate.getFullYear());
      console.log(tempDate.getMonth());
      console.log(tempDate.getFullYear());
    } else {
      if (currentDateTimestamp == newDateTimestamp) {
        Alert.alert(
          "",
          t("Your end date can't be later than today date. Please try again."),
          [{ text: t("OK") }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "",
          t(
            "Your end date can't be earlier than your start date. Please try again."
          ),
          [{ text: t("OK") }],
          { cancelable: false }
        );
      }
    }
  };

  const updateExperiences = async () => {
    if (isSelected) {
      var details = {
        _method: "PUT",
        description: description,
        company: company,
        position: position,
        city: city,
        currently_work: "on",
        from_year: year,
        from_month: month,
        from_date: "17",
        to_nothing: "a",
      };

      var formData = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formData.push(encodedKey + "=" + encodedValue);
      }
      formData = formData.join("&");
      const id = data.id;

      dispatch(updateExperience({ formData, token, id }));
    } else if (!isSelected) {
      var details = {
        _method: "PUT",
        description: description,
        company: company,
        position: position,
        city: city,
        currently_work: "off",
        from_year: year,
        from_month: month,
        from_date: "17",
        to_year: toYear,
        to_month: toMonth,
        to_nothing: "a",
      };
      var formData = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formData.push(encodedKey + "=" + encodedValue);
      }
      formData = formData.join("&");
      const id = data.id;
      dispatch(updateExperience({ formData, token, id }));
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (data.currently_work == 1) {
      setSelection(true);
    }
    if (Platform.OS === "android") {
      setDate(new Date(data.from_date.slice(0, 10)));
      setText(data.from_date.slice(0, 10));
      setYear(data.from_date.slice(0, 4));
      setMonth(data.from_date.slice(5, 7));
      if (data.currently_work != 1) {
        setToDate(new Date(data?.to_date?.slice(0, 10)));
        setToText(data?.to_date?.slice(0, 10));
        setToYear(data?.to_date?.slice(0, 4));
        setToMonth(data?.to_date?.slice(5, 7));
      }
    } else {
      setIosDate(new Date(data.from_date.slice(0, 10)));
      setText(data.from_date.slice(0, 10));
      setYear(data.from_date.slice(0, 4));
      setMonth(data.from_date.slice(5, 7));
      if (data.currently_work != 1) {
        setToIosDate(new Date(data?.to_date?.slice(0, 10)));
        setToText(data?.to_date?.slice(0, 10));
        setToYear(data?.to_date?.slice(0, 4));
        setToMonth(data?.to_date?.slice(5, 7));
      }
    }
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.textmain}>
        <MyHeader goBack={navigation.goBack} heading={t("Your Experience")} />
        <Divider
          style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
        />

        <View style={styles.sub}>
          <TextInput
            label={
              <Text>
                {t("Company")}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            returnKeyType="next"
            value={company}
            onChangeText={setCompany}
          />
          <TextInput
            label={
              <Text>
                {t("Position")}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            returnKeyType="next"
            value={position}
            onChangeText={setPosition}
          />
          <TextInput
            label={
              <Text>
                {t("City/Town")}
                <Text style={{ color: "red" }}>*</Text>
              </Text>
            }
            returnKeyType="next"
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            label={t("Description")}
            returnKeyType="done"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.dob}>
            <Text style={styles.dobtext}>{t("Time Period")}</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              tintColors={{ true: COLORS.primary, false: COLORS.black }}
            />
            <Text style={styles.label}>{t("I currently work here")}</Text>
          </View>
          <View style={styles.boxes}>
            <View style={styles.small}>
              <Text style={styles.boxtext}>{t("From")}</Text>
            </View>
            {!isSelected && (
              <View style={styles.small}>
                <Text style={styles.boxtext}>{t("To")}</Text>
              </View>
            )}
          </View>
          <View style={styles.boxes}>
            {Platform.OS === "android" ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  marginRight: 19,
                }}
                onPress={() => setShow(true)}
              >
                {ICONS.fontAwesome5("angle-up", COLORS.primary, 19)}
                <Text style={{ marginRight: 10 }}>{text}</Text>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={"date"}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  marginRight: 19,
                }}
                onPress={() => setIosDatePickerVisible(true)}
              >
                {ICONS.fontAwesome5("angle-up", COLORS.primary, 19)}

                <Text style={{ marginRight: 10 }}>{text}</Text>
                <IosDatePicker
                  onIosDateChange={(selectedDate) =>
                    onIosDateChange(selectedDate)
                  }
                  keyof="expDat"
                  date={iosDate}
                  visible={iosDatePickerVisible}
                  hideVisible={() => setIosDatePickerVisible(false)}
                  fromDate
                />
              </TouchableOpacity>
            )}
            {!isSelected && (
              <>
                {Platform.OS === "android" ? (
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      flexDirection: "row-reverse",
                      marginRight: 19,
                    }}
                    onPress={() => setToShow(true)}
                  >
                    {ICONS.fontAwesome5("angle-up", COLORS.primary, 19)}

                    <Text style={{ marginRight: 10 }}>{toText}</Text>
                    {toShow && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={toDate}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={onToChange}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      flexDirection: "row-reverse",
                      marginLeft: 10,
                    }}
                    onPress={() => setToIosDatePickerVisible(true)}
                  >
                    {ICONS.fontAwesome5("angle-up", COLORS.primary, 19)}

                    <Text style={{ marginRight: 10 }}>{toText}</Text>
                    <IosDatePicker
                      onIosDateChange={(selectedDate) =>
                        onToIosDateChange(selectedDate)
                      }
                      date={toIosDate}
                      keyof="expDat"
                      visible={toIosDatePickerVisible}
                      hideVisible={() => setToIosDatePickerVisible(false)}
                      fromDate
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          <View style={styles.btnmain}>
            <Button
              buttonstyle={styles.fullbtn}
              textstyle={styles.fullbtnText}
              text={t("Cancel")}
              pressFunction={() => navigation.goBack()}
            />
            {/* <Button
              buttonstyle={styles.fullbtn}
              textstyle={styles.fullbtnText}
              text={"Update"}
              pressFunction={() => updateExperiences()}
            /> */}
            <TouchableOpacity
              style={[
                styles.fullbtn,
                !isFormValid && { backgroundColor: COLORS.grey },
              ]}
              disabled={!isFormValid}
              onPress={() => updateExperiences()}
            >
              <Text style={styles.fullbtnText}>{t("Update")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default EditExperience;
