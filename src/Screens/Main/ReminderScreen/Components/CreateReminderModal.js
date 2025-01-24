import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

import moment from "moment/moment";
import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Loader from "../../../../Components/Loader";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";

import InputField from "./InputField";
import { HP, WP } from "../../../../../Utils/Resposive";
import { SITE_URL } from "../../../../Services/Constants";
import { getHeight } from "../../../../../Utils/NewResponsive";
import ImagePickerModal from "../../../../Components/ImagePickerModal";
import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../../Utils/ImageAndCamera";
import { FlatList } from "react-native";
import IosDatePicker from "./IosDatePicker";
import SelectedFriends from "./SelectedFriends";
import FastImage from "react-native-fast-image";
import { postApiCall } from "./remindersApiCall";
import AppStyle from "../../../../styles/AppStyle";
import { Dropdown } from "react-native-element-dropdown";
import { withoutStringiApiCall2 } from "../../../../Services/Apis";
import {
  deleteReminder,
  singleReminder,
  updateReminder,
} from "../../../../Redux/actions/Reminders";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { getRepeatData, getStatusData } from "../Constant/ReminderLocalData";

const CreateReminderModal = (props) => {
  let flashRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const editSelectedItems = props.currentItem;
  const reminderId = editSelectedItems?.encrypted_id;

  const token = useSelector((state) => state.auth.userToken);

  const {
    edit,
    setShowCreateGroupModal,
    setReminderDetailData,
    isCompleted,
    setFriends,
    friends,
    fromDetailScreen,
  } = props;

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

  const [value, setValue] = useState("Never");
  const [loading, setLoading] = useState(false);
  const [reminderName, setReminderName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [onlyNewFiles, setOnlyNewFiles] = useState([]);
  const [locationValue, setLocationValue] = useState("");
  const [multipleImages, setMultipleImages] = useState([]);
  const [friendslistData, setFriendslistData] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [filesTitlesArray, setFilesTitlesArray] = useState([]);
  const [groupDescription, setGroupDescription] = useState("");
  const [reminderDate, setReminderDate] = useState([dateStructure]);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState("");
  const [isTimeSelected, setIsTimeSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const repeat = getRepeatData(t);
  const status = getStatusData(t);

  const charactersCondition = reminderName?.length > 25;

  const filteredFriendsListData = friendslistData?.filter(
    (friend) =>
      !selectedFriends?.some(
        (selectedFriend) => selectedFriend?.id === friend?.id
      )
  );

  {
    edit &&
      useEffect(() => {
        setIsDateSelected(
          editSelectedItems?.upcomming_notify_date_time == null
            ? ""
            : "selected"
        );

        setReminderName(editSelectedItems?.reminder_name);
        setGroupDescription(
          editSelectedItems?.description !== "null"
            ? editSelectedItems?.description
            : ""
        );
        setLocationValue(
          editSelectedItems?.location !== "null"
            ? editSelectedItems?.location
            : ""
        );
        {
          editSelectedItems?.reminder_cover_picture &&
            setMultipleImages(
              SITE_URL + editSelectedItems?.reminder_cover_picture
            );
        }
        setSelectedFriends(
          fromDetailScreen
            ? friends
            : editSelectedItems?.friends
            ? editSelectedItems?.friends
            : []
        );
        const foundValue = repeat.find(
          (value) => value?.label === editSelectedItems?.repeat
        )?.value;
        if (foundValue) {
          setValue(foundValue);
        }
        const foundStatus = status?.find(
          (value) => value?.value === editSelectedItems?.status
        )?.value;
        if (foundStatus) {
          setStatusValue(foundStatus);
        }

        if (editSelectedItems?.upcomming_notify_date_time) {
          const dateTimeString = editSelectedItems.upcomming_notify_date_time;
          const parsedDate = new Date(dateTimeString);
          const formattedDate = moment(parsedDate).format("MM-DD-YYYY");
          const formattedTime = moment(parsedDate).format("hh:mm A");
          if (parsedDate < new Date()) {
            setErrorMessage(
              "The selected date and time should be greater than the current date and time."
            );
          } else {
            setErrorMessage("");
          }

          setReminderDate([
            {
              startDate: parsedDate,
              startDateText: formattedDate,
              startTime: parsedDate,
              startTimeText: formattedTime,
              startDatePickerVisible: false,
              startTimePickerVisible: false,
            },
          ]);
          setIsTimeSelected(formattedTime);
        }
        return () => {};
      }, [editSelectedItems]);
  }
  useEffect(() => {
    if (edit && statusValue == 1) {
      setErrorMessage("");
    } else {
      setErrorMessage(
        "The selected date and time should be greater than the current date and time."
      );
    }
  }, [statusValue, edit]);

  const searchFriend = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      setLoadingFriendsList(true);
      setShowFriendsList(true);
      try {
        const res = await withoutStringiApiCall2({
          route: text
            ? `reminders/get_friend?term=${text}`
            : `rooms/user/search?term=&added_ids[]=`,
          verb: "GET",
          token: token,
        });
        // console.log("search api res -- ", JSON.stringify(res));
        if (res.responseCode !== 200) {
          setLoadingFriendsList(false);
          console.log("Error in saga", res?.errors);
        } else if (res.responseCode == 200) {
          setFriendslistData(res?.payload?.data?.friends);

          setLoadingFriendsList(false);
        }
      } catch (e) {
        console.log("saga error -- ", e.toString());
      }
    } else {
      setFriendslistData([]);
      setLoadingFriendsList(false);
      setShowFriendsList(false);
    }
  };

  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode) {
          return;
        }

        if (response?.assets && response?.assets.length > 0) {
          let asset = response.assets[0];
          let newMedia = {
            uri: asset.uri,
            type: asset.type
              ? asset.type
              : contentType === "video"
              ? "video/mp4"
              : "image/jpg",
            name: asset.fileName,
          };

          setMultipleImages(newMedia.uri);
          setOnlyNewFiles([newMedia]);
          setFilesTitlesArray([""]);
        }

        setPickerModalVisibile(false);
      });
    }
  };

  const chooseImageGallery = () => {
    let options = {
      mediaType: "photo",
      quality: 1,
      noData: true,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        return;
      }

      console.log("response", response);

      if (response.assets && response.assets.length > 0) {
        let asset = response.assets[0];
        let newImage = {
          uri: asset.uri,
          type: asset.type ? asset.type : "image/jpg",
          name: asset.fileName,
        };

        // Update the state with the new image URI as a single string
        setMultipleImages(newImage.uri);
        setFilesTitlesArray([""]);
        setOnlyNewFiles([newImage]);
      }

      setPickerModalVisibile(false);
    });
  };

  const deleteItem = (item) => {
    setMultipleImages([]);
  };

  const onCancelPress = () => {
    setShowCreateGroupModal(false);
  };

  const toggleIosDatePicker = (index) => {
    let dates = [...reminderDate];
    let date = dates[index];

    date.startDatePickerVisible = !date.startDatePickerVisible;

    dates[index] = date;
    setReminderDate(dates);
  };

  const toggleIosTimePicker = (index) => {
    let dates = [...reminderDate];
    let date = dates[index];

    date.startTimePickerVisible = !date.startTimePickerVisible;

    dates[index] = date;
    setReminderDate(dates);
  };

  const hanldeDateChange = (index, selectedDate) => {
    setIsDateSelected(selectedDate);
    let dates = [...reminderDate];
    let date = dates[index];

    date.startDate = selectedDate;
    date.endDate = selectedDate;

    date.startDateText = moment(selectedDate).format("MM-DD-YYYY");

    dates[index] = date;
    setReminderDate(dates);
    validateDateTime(index, selectedDate, reminderDate[index].startTime);
  };

  const hanldeTimeChange = (index, selectedTime) => {
    setIsTimeSelected(selectedTime);
    let dates = [...reminderDate];
    let date = dates[index];
    date.startTime = selectedTime;
    date.startTimeText = moment(selectedTime).format("hh:mm A");
    dates[index] = date;
    setReminderDate(dates);
    validateDateTime(index, reminderDate[index].startDate, selectedTime);
  };

  const validateDateTime = (index, selectedDate, selectedTime) => {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    if (combinedDateTime < new Date()) {
      setErrorMessage(
        "The selected date and time should be greater than the current date and time."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriends((prev) => [...prev, friend]);
    setFriendslistData((prev) =>
      prev.filter((item) => item?.id !== friend?.id)
    );
  };

  const handleRemoveFriend = (friend) => {
    setSelectedFriends((prev) => prev.filter((item) => item.id !== friend.id));
    setFriendslistData((prev) => [...prev, friend]);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainerNotSearched}
        onPress={() => handleSelectFriend(item)}
      >
        <TouchableOpacity>
          <Image
            source={
              item?.profile_picture
                ? { uri: SITE_URL + item?.profile_picture }
                : IMAGES.blankDP
            }
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          {item?.first_name} {item?.last_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectedFriendsRenders = ({ item }) => {
    return <SelectedFriends item={item} onDeselect={handleRemoveFriend} />;
  };

  const onPressCloseModal = useCallback(() => {
    setShowCreateGroupModal(false);
  }, []);

  const onPressCreateReminder = async () => {
    setShowCreateGroupModal(false);
    props?.setCreatingItem(true);
    let apiRoute = "reminders/store";
    const formData = new FormData();
    selectedFriends?.forEach((friend) => {
      formData.append("selected_user[]", friend?.id);
    });
    const imageData = {
      uri: multipleImages,
      type: "image/jpg",
      name: onlyNewFiles ? onlyNewFiles[0]?.name : "Reminder",
    };
    {
      multipleImages?.length > 0 &&
        formData.append("reminder_cover_picture", imageData);
    }
    formData.append("reminder_name", reminderName);
    formData.append("seen", "0");
    {
      isDateSelected &&
        reminderDate.forEach((item) => {
          formData.append(
            "reminder_date",
            moment(item.startDate).format("YYYY-MM-DD")
          );
          formData.append(
            "reminder_time",
            moment(item.startTime).format("HH:mm")
          );
        });
    }
    formData.append("reminder_location", locationValue);
    formData.append("reminder_description", groupDescription);
    formData.append("reminder_repeat", value);
    try {
      const remindersCreate = await postApiCall(apiRoute, formData, token);

      if (remindersCreate?.responseCode === 200) {
        // console.log("Reminder created successfully");
        // Toast.show("Reminder created successfully");
        showMessage({
          message: t(`Reminder created successfully`),
          type: "info",
        });
        const newReminder = remindersCreate?.payload?.data?.data;
        dispatch(singleReminder(newReminder));
        props?.setCreatingItem(false);
      } else {
        console.log("Failed to create reminder", remindersCreate);
        props?.setCreatingItem(false);
      }
    } catch (error) {
      console.error("Error creating reminder:", error.toString());
      props?.setCreatingItem(false);
    }
  };

  const onPressUpdate = async () => {
    setShowCreateGroupModal(false);
    props?.setUpdatingItem(true);

    let apiRoute = `reminders/update/${reminderId}`;
    const formData = new FormData();
    selectedFriends?.forEach((friend) => {
      formData.append("selected_user[]", friend?.id);
    });
    const imageData = {
      uri: multipleImages,
      type: "image/jpg",
      name: onlyNewFiles ? onlyNewFiles[0]?.name : "Reminder",
    };
    {
      onlyNewFiles?.length > 0 &&
        formData.append("reminder_cover_picture", imageData);
    }
    formData.append("reminder_name", reminderName);

    formData.append("status", statusValue);
    {
      isDateSelected &&
        reminderDate.forEach((item) => {
          formData.append(
            "reminder_date",
            moment(item.startDate).format("YYYY-MM-DD")
          );
          formData.append(
            "reminder_time",
            moment(item.startTime).format("HH:mm")
          );
        });
    }

    formData.append("reminder_location", locationValue);
    formData.append("reminder_description", groupDescription);
    formData.append("reminder_repeat", value);

    try {
      const remindersCreate = await postApiCall(apiRoute, formData, token);

      if (remindersCreate?.responseCode === 200) {
        // console.log("Reminder updated successfully");
        // Toast.show("Reminder updated successfully");
        showMessage({
          message: t(`Reminder updated successfully`),
          type: "info",
        });
        props?.setUpdatingItem(false);

        {
          isCompleted && statusValue === "0"
            ? dispatch(deleteReminder(editSelectedItems.id))
            : !isCompleted && statusValue === "1"
            ? dispatch(deleteReminder(editSelectedItems.id))
            : null;
        }

        const newReminder = remindersCreate?.payload?.data?.data;
        {
          setFriends && setFriends(newReminder?.friends);
        }
        {
          setReminderDetailData && setReminderDetailData(newReminder);
        }
        dispatch(updateReminder(newReminder));
      } else {
        console.log("Failed to create reminder", remindersCreate);
        props?.setUpdatingItem(false);
      }
    } catch (error) {
      console.error("Error creating reminder:", error.toString());
      props?.setUpdatingItem(false);
    }
  };

  const conditionDisabled =
    // !multipleImages?.length ||
    !reminderName || errorMessage || charactersCondition;

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
              {edit ? t("Edit Reminder") : t("Create Reminder")}
            </Text>

            <TouchableOpacity onPress={onCancelPress}>
              <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Loader />
          ) : (
            <>
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
              >
                {multipleImages?.length > 0 ? (
                  <View style={styles.body}>
                    <>
                      {multipleImages?.length ? (
                        <View style={{ height: HP(15), marginBottom: 30 }}>
                          <TouchableOpacity>
                            {/* {!edit && (
                              <ImageCrossIcon
                                onPress={() => deleteItem(multipleImages)}
                              />
                            )} */}

                            <FastImage
                              resizeMode="cover"
                              style={styles.image}
                              source={{
                                uri: multipleImages,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.imageToUpload,
                            styles.imageToUploadPlaceHolder,
                            { height: HP(15) },
                          ]}
                        ></View>
                      )}
                    </>
                  </View>
                ) : (
                  multipleImages?.length === 0 && (
                    <TouchableOpacity
                      style={styles.uploadBox}
                      onPress={() => setPickerModalVisibile(true)}
                    >
                      <Image
                        source={IMAGES.addUploadIcon}
                        style={styles.addUploadIcon}
                      />
                      <Text>{t("Upload Photo")}</Text>
                    </TouchableOpacity>
                  )
                )}
                {multipleImages?.length > 0 && (
                  <View style={styles.uploadContainer}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => setPickerModalVisibile(true)}
                    >
                      <Text style={{ color: COLORS.white }}>
                        {t("Upload Photo")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <ImagePickerModal
                  visible={pickerModalVisibile}
                  hideVisible={() => setPickerModalVisibile(false)}
                  galleryImage={() => chooseImageGallery()}
                  cameraImage={() => captureImage("image")}
                  showOpenVidcamera={false}
                  showOpenImgcamera={true}
                  showOpenPdf={false}
                />

                <View style={AppStyle.mt0}>
                  <InputField
                    value={reminderName}
                    isRequired={true}
                    placeholder={t("Reminder Name")}
                    onChangeText={(val) => setReminderName(val)}
                  />
                  <View style={{ margin: 5, marginHorizontal: 10 }}>
                    {reminderName?.length > 25 ? (
                      <Text style={{ color: "red" }}>
                        {t(
                          "Reminder name cannot be greater than 25 characters"
                        )}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {reminderDate.map((date, index) => (
                  <View key={index}>
                    {index > 0 && <Divider bold style={styles.divider} />}

                    <View style={styles.eventDateContainer}>
                      <TouchableOpacity
                        style={styles.datePicker}
                        onPress={() => toggleIosDatePicker(index)}
                      >
                        <Text style={{ marginLeft: 10 }}>
                          {date?.startDateText}
                          {/* <Text style={{ color: "red" }}> *</Text> */}
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
                          {/* <Text style={{ color: "red" }}> *</Text> */}
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
                      <View style={{ right: 18, margin: 5 }}>
                        {errorMessage && isTimeSelected ? (
                          <Text style={{ color: "red" }}>
                            {t(errorMessage)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ))}

                <InputField
                  isRequired={true}
                  isSearch={true}
                  placeholder={t("Search Friends")}
                  onChangeText={(val) => searchFriend(val)}
                />

                <View style={styles.searchItemContainer}>
                  <FlatList
                    data={selectedFriends}
                    renderItem={selectedFriendsRenders}
                    horizontal
                    keyExtractor={(item) => item?.id?.toString()}
                  />

                  {searchText && friendslistData?.length > 0 ? (
                    <FlatList
                      data={filteredFriendsListData}
                      keyExtractor={(item) => item?.id?.toString()}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      style={{
                        height: getHeight(30),
                      }}
                    />
                  ) : null}
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={repeat}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={t("Repeat")}
                  value={value}
                  onChange={(item) => {
                    setValue(item.value);
                  }}
                />
                {edit && (
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={status}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Status"
                    value={statusValue}
                    onChange={(item) => {
                      setStatusValue(item.value);
                    }}
                  />
                )}
                <InputField
                  value={locationValue}
                  isRequired={true}
                  placeholder={t("Location")}
                  onChangeText={(val) => setLocationValue(val)}
                />

                <InputField
                  multiline
                  description
                  value={groupDescription}
                  placeholder={t("Description")}
                  onChangeText={(text) => setGroupDescription(text)}
                />
              </KeyboardAwareScrollView>

              <View style={styles.buttonMainContainer}>
                <TouchableOpacity
                  disabled={conditionDisabled}
                  onPress={edit ? onPressUpdate : onPressCreateReminder}
                  style={[
                    conditionDisabled
                      ? styles.disabledColor
                      : styles.buttonContainer,
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {edit ? t("Edit Reminder") : t("Create")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPressCloseModal}
                  style={[styles.buttonContainer, styles.buttonCancel]}
                >
                  <Text style={styles.buttonText}>{t("Cancel")}</Text>
                </TouchableOpacity>
              </View>
            </>
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

export default CreateReminderModal;

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
    width: WP("92%"),
    marginTop: HP(6),
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
    width: WP("85%"),
    alignSelf: "center",
    alignItems: "center",
  },

  datePicker: {
    padding: 10,
    width: WP(92),
    height: HP("6%"),
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
    marginTop: HP(2),
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
  buttonMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: HP(4),
    backgroundColor: COLORS.primary,
    padding: 10,
    width: WP(35),
  },
  disabledColor: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: HP(4),
    backgroundColor: COLORS.grey,
    padding: 10,
    width: WP(35),
  },

  buttonCancel: {
    backgroundColor: COLORS.grey,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  uploadBox: {
    width: WP(92),
    height: WP(30),
    borderWidth: 1.5,
    borderStyle: "dotted",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dotted",
    borderColor: COLORS.darkGray,
    borderRadius: 7,
    marginTop: 10,
    marginLeft: WP(2.0),
  },
  addUploadIcon: {
    height: 50,
    width: 50,
    margin: 5,
  },

  image: {
    width: WP(92),
    height: WP(30),
    marginTop: WP(1.5),
    marginLeft: WP(2.0),
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    borderRadius: WP(2),
    backgroundColor: COLORS.black,
  },
  searchItemContainer: {
    margin: 8,
    marginVertical: 10,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "blue",
    height: getHeight(7),
  },
  itemContainerNotSearched: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  searchItemDp: {
    height: 30,
    width: 30,
    borderRadius: 125,
    marginRight: 10,
  },
  reminderCross: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 10,
  },
  text: {
    flexWrap: "nowrap",
    color: COLORS.white,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    // resizeMode: "contain",
  },
  selectedFriendsCon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedFriendsCon: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  selectedFriendsItemClose: {
    position: "absolute",
    right: 0,
    top: -4,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  listEmptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    height: getHeight(5),
    alignSelf: "center",
    marginTop: 10,
    // padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  friendsListCon: {
    position: "absolute",
    // top: Platform.OS === "ios" ? 190 : 170,
    width: "100%",
    height: "60%",
    backgroundColor: COLORS.white,
    zIndex: 1,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    width: WP("92%"),
    height: HP("6%"),
    marginTop: HP(1),
    alignSelf: "center",
    justifyContent: "center",
    borderColor: COLORS.grey,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  selectedTextStyle: {
    paddingLeft: 10,
    fontSize: 16,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    height: 40,
    width: 120,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
