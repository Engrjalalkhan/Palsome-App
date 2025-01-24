import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { HP } from "../../../../Utils/Resposive";
import HomeHeader from "../../../Components/HomeHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  getBirthdayData,
  clearBirthdayData,
  wishBirthday,
} from "../../../Redux/actions/ProfileActions";
import BirthdayCard from "../../../Components/BirthdayCard";
import BirthdaySearchCom from "../../../Components/BirthdaySearchCom";
import { SafeAreaView } from "react-native";
import Loader from "../../../Components/Loader";
import TextInputForComments from "../../../Components/TextInputForComments";
import { ICONS } from "../../../Constants/Icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { set } from "lodash";
import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Birthday = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const token = useSelector((state) => state?.auth?.userToken);
  const birthdayData = useSelector((state) => state?.prof?.birthdayData);

  const [allFriendsBirthday, setAllFriendsBirthday] = useState([]);
  const [todayFriendsBirthday, setTodayFriendsBirthday] = useState([]);
  const [upcomingFriendsBirthday, setUpcomingFriendsBirthday] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mergedFriendsData, setMergedFriendsData] = useState([]);
  const [mergedTodayFriendsData, setMergedTodayFriendsData] = useState([]);
  const [mergedUpComingFriendsData, setMergedUpComingFriendsData] = useState(
    []
  );
  const [filteredFriendsData, setFilteredFriendsData] = useState([]);
  const [filteredTodayFriendsData, setFilteredTodayFriendsData] = useState([]);
  const [filteredUpComingFriendsData, setFilteredUpComingFriendsData] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [current_page, setCurrent_page] = useState(1);
  const [last_page, setLast_page] = useState(0);
  const [birthdayMessage, setBirthdayMessage] = useState([]);
  const [clearData, setClearData] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [userID, setUserID] = useState("");

  const onSendBirthdayWish = (id, message) => {
    if (!message || !message.trim()) {
      Toast.show("Please type something", Toast.LONG);
    } else if (message.trim()) {
      setUserID(id);
      const formData = new FormData();
      formData.append("friend_id", id);
      formData.append("birthday_wish_text", message.trim());
      dispatch(wishBirthday({ token, formData }));

      //clear input field
      updateBirthdayMessage(id, "");
      setClearData(true);
      setDefaultValue(" ");
      setBirthdayMessage("");
    }
  };

  const updateBirthdayMessage = (index, message) => {
    const newMessage = [...birthdayMessage];
    newMessage[index] = message;
    setBirthdayMessage(newMessage);
  };

  useEffect(() => {
    // dispatch((getBirthdayData({token})))
    setLoading(true);
    dispatch(getBirthdayData({ token, current_page }));

    return () => {
      dispatch(clearBirthdayData());
    };
  }, [current_page]);

  useEffect(() => {
    if (birthdayData !== null) {
      console.log("inside if statement");
      // setAllFriendsBirthday(birthdayData?.BirthdayFriendsAll?.data)
      //add new data to old data
      setAllFriendsBirthday([
        ...allFriendsBirthday,
        ...birthdayData?.BirthdayFriendsAll?.data,
      ]);
      setTodayFriendsBirthday(birthdayData?.BirthdayFriendsToday);
      setUpcomingFriendsBirthday(birthdayData?.BirthdayFriendsUpcoming);
    }
    setLoading(false);
  }, [birthdayData]);

  useEffect(() => {
    if (allFriendsBirthday?.length > 0) {
      const mergedData = [...allFriendsBirthday];
      setMergedFriendsData(mergedData);
    }
  }, [allFriendsBirthday]);

  useEffect(() => {
    if (allFriendsBirthday?.length > 0) {
      const mergedData = [...todayFriendsBirthday];
      setMergedTodayFriendsData(mergedData);
    }
  }, [allFriendsBirthday]);

  useEffect(() => {
    if (allFriendsBirthday?.length > 0) {
      const mergedData = [...upcomingFriendsBirthday];
      setMergedUpComingFriendsData(mergedData);
    }
  }, [allFriendsBirthday]);

  useEffect(() => {
    if (mergedTodayFriendsData?.length > 0) {
      const filteredData = mergedTodayFriendsData.filter((friend) => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredTodayFriendsData(filteredData);
    }
  }, [searchQuery, mergedTodayFriendsData]);

  useEffect(() => {
    if (mergedUpComingFriendsData?.length > 0) {
      const filteredData = mergedUpComingFriendsData.filter((friend) => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredUpComingFriendsData(filteredData);
    }
  }, [searchQuery, mergedUpComingFriendsData]);

  useEffect(() => {
    if (mergedFriendsData?.length > 0) {
      const filteredData = mergedFriendsData.filter((friend) => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredFriendsData(filteredData);
    }
  }, [searchQuery, mergedFriendsData]);

  useEffect(() => {
    if (birthdayData?.BirthdayFriendsAll?.last_page) {
      setLast_page(birthdayData?.BirthdayFriendsAll?.last_page);
    }
  }, [birthdayData]);

  const onEndReached = () => {
    if (current_page < last_page) {
      setCurrent_page(current_page + 1);
    }
  };
  const handleOnPressUserProfile = (item) => {
    navigation.navigate("ProfileScreen", {
      id: item?.id,
    });
  };

  const NoDataView = ({ title, detail, icon }) => {
    return (
      <>
        <View>{icon}</View>
        <Text style={styles.noFriendsText}>{title}</Text>
        <Text style={styles.noFriendsDetails}>{detail}</Text>
      </>
    );
  };

  return birthdayData === null ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.marginTop}>
        <BirthdaySearchCom
          placeholder={t("Search Friend Birthday...")}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      <ScrollView
        style={styles.scrollViewStyle}
        // pagingEnabled={true}
        onMomentumScrollEnd={onEndReached}
      >
        {todayFriendsBirthday?.length > 0 && !searchQuery && (
          <>
            <Text style={styles.text}>{t("Today's Birthdays")}</Text>
            {todayFriendsBirthday?.map((item) => (
              <TouchableOpacity
                key={item.id} // Add a unique key prop
                onPress={() => {
                  handleOnPressUserProfile(item);
                }}
              >
                <BirthdayCard
                  first_name={item?.first_name}
                  last_name={item?.last_name}
                  profile_picture={item?.profile_picture}
                  dob={item?.dob}
                  today
                  onSendBirthdayWish={() =>
                    onSendBirthdayWish(
                      item?.encrypted_id,
                      birthdayMessage[item?.id]
                    )
                  }
                  // birthdayMessage={birthdayMessage}
                  // setBirthdayMessage={setBirthdayMessage}
                  updateBirthdayMessage={updateBirthdayMessage}
                  index={item?.id}
                  setBirthdayMessage={(message) =>
                    updateBirthdayMessage(item?.id, message)
                  }
                  // defaultValue={defaultValue}
                  //set default value when user send birthday wish to specific user
                  // defaultValue={defaultValue}
                  defaultValue={
                    userID === item?.encrypted_id ? defaultValue : ""
                  }
                />
              </TouchableOpacity>
            ))}
          </>
        )}
        {filteredTodayFriendsData?.length > 0 && searchQuery?.length > 0 && (
          <>
            <Text style={styles.text}>{t("Today's Birthdays")}</Text>
            {filteredTodayFriendsData.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  handleOnPressUserProfile(item);
                }}
              >
                <BirthdayCard
                  first_name={item?.first_name}
                  last_name={item?.last_name}
                  profile_picture={item?.profile_picture}
                  dob={item?.dob}
                  today
                  onSendBirthdayWish={() =>
                    onSendBirthdayWish(
                      item?.encrypted_id,
                      birthdayMessage[item?.id]
                    )
                  }
                  // birthdayMessage={birthdayMessage}
                  // setBirthdayMessage={setBirthdayMessage}
                  updateBirthdayMessage={updateBirthdayMessage}
                  index={item?.id}
                  setBirthdayMessage={(message) =>
                    updateBirthdayMessage(item?.id, message)
                  }
                  // defaultValue={defaultValue}
                  //set default value when user send birthday wish to specific user
                  // defaultValue={defaultValue}
                  defaultValue={
                    userID === item?.encrypted_id ? defaultValue : ""
                  }
                />
              </TouchableOpacity>
            ))}
          </>
        )}

        {upcomingFriendsBirthday?.length > 0 && !searchQuery && (
          <>
            <Text style={styles.text}>{t("Upcoming Birthdays")}</Text>
            {upcomingFriendsBirthday.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  handleOnPressUserProfile(item);
                }}
              >
                <BirthdayCard {...item} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {filteredUpComingFriendsData?.length > 0 && searchQuery?.length > 0 && (
          <>
            <Text style={styles.text}>{t("Upcoming Birthdays")}</Text>

            {filteredUpComingFriendsData.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  handleOnPressUserProfile(item);
                }}
              >
                <BirthdayCard {...item} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {filteredFriendsData?.length > 0 && (
          <>
            <Text style={styles.text}>{t("Friends Birthday")}</Text>
            {filteredFriendsData.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  handleOnPressUserProfile(item);
                }}
              >
                <BirthdayCard {...item} />
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={styles.footer} />
        {filteredFriendsData?.length === 0 &&
        searchQuery === "" &&
        todayFriendsBirthday?.length === 0 &&
        upcomingFriendsBirthday?.length === 0 ? (
          <View style={styles.noDataContainer}>
            <NoDataView
              icon={ICONS.fontAwesome("birthday-cake", "#000", 50)}
              title={t("You don't have any friends")}
              detail={t(
                "Find your friends. Once you do, you'll see their birthdays here."
              )}
            />
          </View>
        ) : null}

        {filteredFriendsData?.length === 0 &&
        searchQuery !== "" &&
        filteredTodayFriendsData.length === 0 &&
        filteredUpComingFriendsData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <NoDataView
              icon={ICONS.fontAwesome("search", "#000", 50)}
              title={t("No Record Found")}
              detail={t("What you searched was unfortunately not found.")}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // margin: 10,
  },
  scrollViewStyle: {
    marginVertical: HP(2),
  },
  marginTop: { marginTop: 20 },
  text: {
    marginLeft: 30,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    textAlign: "left",
  },
  footer: { height: 50 },
  noFriendsText: { fontWeight: "bold", fontSize: 16, marginTop: 20 },
  noFriendsDetails: {
    marginTop: 10,
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: HP(20),
  },
});

export default Birthday;
