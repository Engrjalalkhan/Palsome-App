import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
//import Button from "../../../Components/Button";
import Button from "../../../Components/NewButton";
import CheckBox from "@react-native-community/checkbox";
import Toast from "react-native-simple-toast";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { theme } from "../../../Core/theme";
import { Divider } from "react-native-paper";
import {
  Content,
  ListItem,
  Left,
  Body,
  Right,
  Switch,
  List,
  Thumbnail,
} from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import styles from "./styles";
import { BASE_URL } from "../../../Services/Constants";
import { sendSaveEducation } from "../../../Redux/actions/ProfileActions";
import { useDispatch, useSelector } from "react-redux";
import IosDatePicker from "../../../Components/IosDatePicker/IosDatePicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MyHeader from "../../../Components/MyHeader";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import SimpleToast from "react-native-simple-toast";

const AddEducation = ({ navigation }) => {
  const { t } = useTranslation();
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [description, setDescription] = useState("");
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

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);

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
      console.log("-------------");
      setIsFormValid(
        !!school &&
          !!degree &&
          (selectedIosDate.getTime() !== currentDate.getTime() ||
            selectedDate.getTime() !== currentDate.getTime())
      );
    } else {
      console.log("-------elseee------");
      setIsFormValid(
        !!school &&
          !!degree &&
          (selectedIosDate.getTime() !== currentDate.getTime() ||
            selectedDate.getTime() !== currentDate.getTime()) &&
          (selectedToIosDate.getTime() !== currentDate.getTime() ||
            selectedToDate.getTime() !== currentDate.getTime())
      );
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [school, degree, iosDate, date, toIosDate, toDate, isSelected]);

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
        "Start date must be today or a past date.",
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

    if (currentDateObj < endDateObj) {
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

  const SaveEducation = async () => {
    if (isSelected) {
      let params = {
        education: [
          {
            school: school,
            degree: degree,
            description: description,
            currently_work: "on",
            from_year: year,
            from_month: month,
          },
        ],
      };
      dispatch(sendSaveEducation({ params: params, token: token }));
    } else if (!isSelected) {
      let params = {
        education: [
          {
            school: school,
            degree: degree,
            description: description,
            currently_work: "off",
            from_year: year,
            from_month: month,
            to_year: toYear,
            to_month: toMonth,
          },
        ],
      };
      dispatch(sendSaveEducation({ params: params, token: token }));
    }
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <MyHeader goBack={navigation.goBack} heading={t("Your Education")} />
        <View style={styles.textmain}>
          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />
          <List>
            <ListItem
              avatar
              noBorder
              style={{ marginLeft: widthPercentageToDP("1") }}
            >
              <Left>
                <Image source={IMAGES.vectorPlusIcon} />
              </Left>
              <Body>
                <Text style={{ fontSize: 26 }}>{t("Add Education")}</Text>
              </Body>
            </ListItem>
          </List>
          <View style={styles.sub}>
            <TextInput
              label={
                <Text>
                  {t("School/College/University")}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
              }
              returnKeyType="next"
              value={school}
              onChangeText={setSchool}
            />
            <TextInput
              label={
                <Text>
                  {t("Certificate/Degree")}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
              }
              returnKeyType="next"
              value={degree}
              onChangeText={setDegree}
            />
            <TextInput
              label={t("Description")}
              returnKeyType="next"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.dob}>
              <Text style={styles.dobtext}>{t("Time Period")}</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                boxType="square"
                tintColors={{ true: COLORS.primary, false: COLORS.black }}
                value={isSelected}
                onValueChange={setSelection}
              />
              <Text style={styles.label}>{t("I currently studying here")}</Text>
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
                    date={iosDate}
                    keyof="eduDat"
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
                        keyof="eduDat"
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
              <TouchableOpacity
                style={[
                  styles.fullbtn,
                  !isFormValid && { backgroundColor: COLORS.grey },
                ]}
                disabled={!isFormValid}
                onPress={() => SaveEducation()}
              >
                <Text style={styles.fullbtnText}>{t("Save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default AddEducation;
