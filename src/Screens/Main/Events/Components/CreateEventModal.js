import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import moment from "moment/moment";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import FlashMessage from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import InputField from "./InputField";
import IosDatePicker from "./IosDatePicker";
import Loader from "../../../../Components/Loader";
import CustomPickerAndroid from "../../../../Components/CustomPickers/CustomPickerAndroid";
import CustomPickerPrivacy from "../../../../Components/CustomPickers/CustomPickerPrivacy";

import { ICONS } from "../../../../Constants/Icons";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import { HP, WP } from "../../../../../Utils/Resposive";
import { BASE_URL } from "../../../../Services/Constants";

const CreateEventModal = (props) => {
  let flashRef = useRef();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.userToken);

  const { edit, event, createEvent, duplicateEvent, setShowCreateGroupModal } =
    props;

  const pickerData = [
    { id: 1, title: t("Public") },
    { id: 2, title: t("Private") },
  ];

  const dateStructure = {
    startDate: new Date(),
    startDateText: t("Start Date"),
    startTime: new Date(),
    startTimeText: t("Start Time"),
    startDatePickerVisible: false,
    startTimePickerVisible: false,

    endDate: new Date(),
    endDateText: t("End Date"),
    endTime: new Date(),
    endTimeText: t("End Time"),
    endDatePickerVisible: false,
    endTimePickerVisible: false,
  };

  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [eventDates, setEventDates] = useState([dateStructure]);
  const [openPrivacyPicker, setOpenPrivacyPicker] = useState(false);
  const [openCategoryPicker, setOpenCategoryPicker] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState(t("Event Type"));
  const [selectedCategory, setSelectedCategory] = useState(t("Event Category"));

  useEffect(() => {
    getCategoriesData();

    if (Platform.OS == "android") setSelectedPrivacy("Public");
  }, []);

  useEffect(() => {
    if (!loading && event) {
      const category = categories?.find(
        (el) => el.id == event?.event_category
      )?.title;

      setSelectedPrivacy(event?.event_type);
      setEventName(event?.event_name);
      setEventLocation(event?.event_location);
      setSelectedCategory(category);

      event?.event_description && setGroupDescription(event?.event_description);

      let selectedDates = [];

      for (let index = 0; index < event?.dates?.length; index++) {
        const element = event?.dates[index];
        let newDate = { ...dateStructure };

        newDate.startDate = new Date(element?.start_date);
        newDate.startDateText = moment(newDate?.startDate).format(
          "DD-MMM-YYYY"
        );

        newDate.startTime = new Date(
          `${element?.start_date} ${element?.start_time}`
        );

        newDate.startTimeText = moment(newDate?.startTime).format("hh:mm a");

        if (element?.end_date) newDate.endDate = new Date(element?.end_date);

        if (element?.end_date)
          newDate.endDateText = moment(newDate?.endDate).format("DD-MMM-YYYY");

        newDate.endTime = new Date(`${element?.end_date} ${element?.end_time}`);
        newDate.endTimeText = moment(newDate?.endTime).format("hh:mm a");

        selectedDates.push(newDate);
      }

      setEventDates(selectedDates);
    }
  }, [categories]);

  const getCategoriesData = () => {
    const url = `${BASE_URL}/events/categories/fetch`;

    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);

          if (res?.responseCode == 200) {
            setCategories(res?.payload?.data?.categories);
          } else {
            flashRef.current.showMessage({
              message: res?.message,
              type: "danger",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("catchError: ", error);
        });
    } catch (error) {
      setLoading(false);
      console.log("tryCatchError: ", error);
    }
  };

  const onCancelPress = () => {
    setShowCreateGroupModal(false);
  };

  const toggleIosDatePicker = (index) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.startDatePickerVisible = !date.startDatePickerVisible;

    dates[index] = date;
    setEventDates(dates);
  };

  const toggleIosTimePicker = (index) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.startTimePickerVisible = !date.startTimePickerVisible;

    dates[index] = date;
    setEventDates(dates);
  };

  const toggleIosEndDatePicker = (index) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.endDatePickerVisible = !date.endDatePickerVisible;

    dates[index] = date;
    setEventDates(dates);
  };

  const toggleIosEndTimePicker = (index) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.endTimePickerVisible = !date.endTimePickerVisible;

    dates[index] = date;
    setEventDates(dates);
  };

  const hanldeDateChange = (index, selectedDate) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.startDate = selectedDate;
    date.endDate = selectedDate;

    date.startDateText = moment(selectedDate).format("DD-MMM-YYYY");

    dates[index] = date;
    setEventDates(dates);
  };

  const hanldeTimeChange = (index, selectedDate) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.startTime = selectedDate;
    date.startTimeText = moment(selectedDate).format("hh:mm a");

    dates[index] = date;
    setEventDates(dates);
  };

  const hanldeEndDateChange = (index, selectedDate) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.endDate = selectedDate;
    date.endDateText = moment(selectedDate).format("DD-MMM-YYYY");

    dates[index] = date;
    setEventDates(dates);
  };

  const hanldeEndTimeChange = (index, selectedDate) => {
    let dates = [...eventDates];
    let date = dates[index];

    date.endTime = selectedDate;
    date.endTimeText = moment(selectedDate).format("hh:mm a");

    dates[index] = date;
    setEventDates(dates);
  };

  const handleAddDate = () => {
    let dates = [...eventDates];
    dates.push(dateStructure);

    setEventDates(dates);
  };

  const handleRemoveDate = (index) => {
    let dates = [...eventDates];
    dates.splice(index, 1);

    setEventDates(dates);
  };

  const toggleCategoryPicker = () =>
    setOpenCategoryPicker((prevState) => !prevState);

  const onCreatePress = () => {
    const isValidPrivacy = selectedPrivacy !== "Event Type";
    const isValidName = eventName.length > 0;
    const isValidLocation = eventLocation.length > 0;
    const isValidCategory = selectedCategory !== "Event Category";

    const isValidData =
      isValidPrivacy && isValidName && isValidLocation && isValidCategory;

    if (isValidData) {
      let datesOkay = true;
      const categoryId = categories.find(
        (el) => el.title === selectedCategory
      )?.id;

      const formData = new FormData();
      formData.append("event_name", eventName);
      formData.append("event_location", eventLocation);
      formData.append("event_category", categoryId);
      formData.append("event_description", groupDescription);
      formData.append("event_type", selectedPrivacy.toLowerCase());

      for (let index = 0; index < eventDates.length; index++) {
        const element = eventDates[index];
        const isValidStartDate = element.startDateText !== "Start Date";
        const isValidStartTime = element.startTimeText !== "Start Time";

        if (isValidStartDate && isValidStartTime) {
          formData.append(
            `event_start_date[${index}]`,
            moment(element.startDate).format("YYYY/MM/DD")
          );

          formData.append(
            `event_start_time[${index}]`,
            moment(element.startTime).format("HH:mm")
          );

          if (element.endDateText !== "End Date") {
            formData.append(
              `event_end_date[${index}]`,
              moment(element.endDate).format("YYYY/MM/DD")
            );

            if (element.endTimeText !== "End Time") {
              const isValidEndTime =
                (element.startDate.getTime() === element.endDate.getTime() &&
                  element.endTime.getTime() > element.startTime.getTime()) ||
                element.startDate.getTime() < element.endDate.getTime();

              if (isValidEndTime) {
                formData.append(
                  `event_end_time[${index}]`,
                  moment(element.endTime).format("HH:mm")
                );
              } else {
                datesOkay = false;
                flashRef.current.showMessage({
                  message: t("End time must be after the start time"),
                  type: "warning",
                });
                return;
              }
            }
          }
        } else {
          datesOkay = false;
          flashRef.current.showMessage({
            message: t("Fields marked with red star are required"),
            type: "warning",
          });
          return;
        }
      }

      if (datesOkay) {
        createEvent(formData);
        onCancelPress();
      }
    } else {
      flashRef.current.showMessage({
        message: t("Fields marked with red star are required"),
        type: "warning",
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          setShowCreateGroupModal(false);
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {edit
                ? t("Edit Event")
                : duplicateEvent
                ? t("Duplicate Event")
                : t("Create New Event")}
            </Text>

            <TouchableOpacity onPress={onCancelPress}>
              <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Loader />
          ) : (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <Pressable
                style={styles.borderContainer}
                onPress={() => setOpenPrivacyPicker(true)}
              >
                {Platform.OS === "ios" ? (
                  <>
                    {edit ? (
                      <TextInput
                        editable={false}
                        style={styles.roomNameInput}
                        value={selectedPrivacy}
                      />
                    ) : (
                      <>
                        <View style={styles.pickerTextContainer}>
                          <Text style={{ marginLeft: 10 }}>
                            {selectedPrivacy}
                            <Text style={{ color: "red" }}> *</Text>
                          </Text>

                          {ICONS.fontAwesome5("caret-down", COLORS.primary, 15)}
                        </View>
                        {openPrivacyPicker && (
                          <CustomPickerPrivacy
                            data={pickerData}
                            selectedValue={selectedPrivacy}
                            setValueFunc={setSelectedPrivacy}
                            closeOnSelect={false}
                            visible={openPrivacyPicker}
                            hideVisible={() => setOpenPrivacyPicker(false)}
                          />
                        )}
                      </>
                    )}
                  </>
                ) : edit ? (
                  <TextInput
                    editable={false}
                    style={styles.roomNameInput}
                    value={selectedPrivacy}
                  />
                ) : (
                  <CustomPickerAndroid
                    data={pickerData}
                    selectedValue={selectedPrivacy}
                    setValueFunc={setSelectedPrivacy}
                    closeOnSelect={false}
                    hideVisible={() => setOpenPrivacyPicker(false)}
                  />
                )}
              </Pressable>

              <InputField
                value={eventName}
                isRequired={true}
                placeholder={t("Event Name")}
                onChangeText={(val) => setEventName(val)}
              />

              <InputField
                value={eventLocation}
                isRequired={true}
                placeholder={t("Event Location")}
                onChangeText={(val) => setEventLocation(val)}
              />

              {eventDates.map((date, index) => (
                <View key={index}>
                  {index > 0 && <Divider bold style={styles.divider} />}

                  <View style={styles.eventDateContainer}>
                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() => toggleIosDatePicker(index)}
                    >
                      <Text style={{ marginLeft: 10 }}>
                        {date?.startDateText}
                        <Text style={{ color: "red" }}> *</Text>
                      </Text>

                      <Image
                        source={IMAGES.calender}
                        style={styles.calenderIcon}
                      />
                    </TouchableOpacity>

                    <IosDatePicker
                      mode="date"
                      date={date?.startDate}
                      minimumDate={new Date()}
                      visible={date?.startDatePickerVisible}
                      hideVisible={() => toggleIosDatePicker(index)}
                      onIosDateChange={(selectedDate) =>
                        hanldeDateChange(index, selectedDate)
                      }
                    />

                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() => toggleIosTimePicker(index)}
                    >
                      <Text style={{ marginLeft: 10 }}>
                        {date?.startTimeText}
                        <Text style={{ color: "red" }}> *</Text>
                      </Text>
                      <Image
                        source={IMAGES.clock}
                        style={styles.calenderIcon}
                      />
                    </TouchableOpacity>

                    <IosDatePicker
                      mode="time"
                      date={date?.startTime}
                      minimumDate={
                        moment(date.startDate).format("DD-MMM-YYYY") ==
                        moment(new Date()).format("DD-MMM-YYYY")
                          ? new Date()
                          : undefined
                      }
                      visible={date?.startTimePickerVisible}
                      hideVisible={() => toggleIosTimePicker(index)}
                      onIosDateChange={(selectedDate) =>
                        hanldeTimeChange(index, selectedDate)
                      }
                    />
                  </View>

                  <View style={styles.eventDateContainer}>
                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() => toggleIosEndDatePicker(index)}
                    >
                      <Text style={{ marginLeft: 10 }}>
                        {date?.endDateText}
                      </Text>

                      <Image
                        source={IMAGES.calender}
                        style={styles.calenderIcon}
                      />
                    </TouchableOpacity>

                    <IosDatePicker
                      mode="date"
                      date={date?.endDate}
                      minimumDate={date?.startDate}
                      visible={date?.endDatePickerVisible}
                      hideVisible={() => toggleIosEndDatePicker(index)}
                      onIosDateChange={(selectedDate) =>
                        hanldeEndDateChange(index, selectedDate)
                      }
                    />

                    <TouchableOpacity
                      style={styles.datePicker}
                      onPress={() => toggleIosEndTimePicker(index)}
                    >
                      <Text style={{ marginLeft: 10 }}>
                        {date?.endTimeText}
                      </Text>
                      <Image
                        source={IMAGES.clock}
                        style={styles.calenderIcon}
                      />
                    </TouchableOpacity>

                    <IosDatePicker
                      mode="time"
                      date={date?.endTime}
                      minimumDate={
                        date?.startDate.getDate() == date?.endDate.getDate()
                          ? date.startTime
                          : undefined
                      }
                      visible={date?.endTimePickerVisible}
                      hideVisible={() => toggleIosEndTimePicker(index)}
                      onIosDateChange={(selectedDate) =>
                        hanldeEndTimeChange(index, selectedDate)
                      }
                    />
                  </View>

                  {index > 0 && (
                    <TouchableOpacity
                      style={styles.removeButtonContainer}
                      onPress={() => handleRemoveDate(index)}
                    >
                      <Text style={styles.buttonText}>{t("Remove")}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.extraDateContainer}
                onPress={handleAddDate}
              >
                <Text style={styles.extraDateText}>
                  {t("Add another date and time")}
                </Text>
              </TouchableOpacity>

              <Pressable
                style={styles.borderContainer}
                onPress={toggleCategoryPicker}
              >
                {Platform.OS === "ios" ? (
                  <>
                    <View style={styles.pickerTextContainer}>
                      <Text style={{ marginLeft: 10 }}>
                        {t(selectedCategory)}
                        <Text style={{ color: "red" }}> *</Text>
                      </Text>
                      {ICONS.fontAwesome5("caret-down", COLORS.primary, 15)}
                    </View>

                    {openCategoryPicker && (
                      <CustomPickerPrivacy
                        data={categories}
                        selectedValue={selectedCategory}
                        setValueFunc={setSelectedCategory}
                        closeOnSelect={false}
                        visible={openCategoryPicker}
                        hideVisible={toggleCategoryPicker}
                      />
                    )}
                  </>
                ) : (
                  <CustomPickerAndroid
                    data={categories}
                    selectedValue={selectedCategory}
                    setValueFunc={setSelectedCategory}
                    closeOnSelect={false}
                    hideVisible={() => {
                      toggleCategoryPicker;
                    }}
                  />
                )}
              </Pressable>

              <InputField
                multiline
                description
                value={groupDescription}
                placeholder={t("Description")}
                onChangeText={(text) => setGroupDescription(text)}
              />

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={onCreatePress}
              >
                <Text style={styles.buttonText}>
                  {edit
                    ? t("Edit Event")
                    : duplicateEvent
                    ? t("Duplicate Event")
                    : t("Create Event")}
                </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          )}
        </View>

        <FlashMessage
          ref={flashRef}
          position="bottom"
          floating
          duration={3000}
          icon="auto"
          style={{
            alignItems: "center",
            backgroundColor: COLORS.secondary,
          }}
        />
      </Modal>
    </View>
  );
};

export default CreateEventModal;

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    right: 0,
    bottom: 0,
    top: HP(8),
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  container: {
    left: 0,
    right: 0,
    top: HP(8),
    bottom: HP(5),
    margin: WP(2),
    borderRadius: 10,
    position: "absolute",
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    height: 60,
    padding: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",

    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  headerText: { fontSize: 18, fontWeight: "bold" },
  crossIcon: { width: 25, height: 25, resizeMode: "contain" },

  borderContainer: {
    borderWidth: 1,
    width: WP("85%"),
    marginTop: HP(2),
    borderRadius: 10,
    alignSelf: "center",
    borderColor: COLORS.grey,
    height: Platform.OS == "ios" ? HP("6%") : undefined,
  },

  pickerTextContainer: {
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  divider: {
    marginTop: HP(2),
    marginHorizontal: WP(6),
  },

  eventDateContainer: {
    marginTop: HP(2),
    width: WP("85%"),
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  datePicker: {
    padding: 10,
    width: WP(38),
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  calenderIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },

  removeButtonContainer: {
    width: WP(30),
    borderRadius: 5,
    marginTop: HP(2),
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },

  extraDateContainer: {
    marginTop: HP(2),
    marginHorizontal: 20,
    paddingHorizontal: 2,
  },

  extraDateText: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.primary,
  },

  buttonContainer: {
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: HP(4),
    backgroundColor: COLORS.primary,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  roomNameInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 18,
    padding: 6,
    opacity: Platform.OS === "ios" ? 0.5 : null,
    backgroundColor: COLORS.lightGray,
    borderRadius: 9,
  },
});
