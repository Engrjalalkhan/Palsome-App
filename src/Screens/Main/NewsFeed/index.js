import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles";
import ReelsInNewsFeed from "./ReelsInNewsFeed";
import { useTranslation } from "react-i18next";
import TopBar from "../../../Components/TopBar";
import NewPost from "../../../Components/NewPost";
import { useIsFocused } from "@react-navigation/native";
import HomeHeader from "../../../Components/HomeHeader";
import ReelStoriesTabs from "./components/Reel&StoriesTabs";
import SideBarFriend from "../../../Components/SideBarFriend";
import NewsfComponent from "../../../Components/NewsFeedList";
import messaging from "@react-native-firebase/messaging";

import Stories from "../../../../src/Components/Stories/Stories";
import { FlatListItemSeparator } from "../../../Components/NewsFeedList/Functions";

import { setMyStory } from "../../../Redux/actions/NewsFeedActions";
import { getReelsDataRequest } from "../../../Redux/actions/ReelsActions";

import {
  postStatusApiCall,
  settingsApiCall,
} from "../../../Services/Apis/index";
import { COLORS } from "../../../Constants/Colors";
import { onPressTouchBase } from "../../../../Utils/TouchBaseNavigation";


export let isModalVisible = false;

const NewsFeed = ({ navigation }) => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const { height } = Dimensions.get("window");

  const token = useSelector((state) => state?.auth?.userToken);
  const reelsData = useSelector((state) => state?.reelsRed?.reelsData);
  const getSelectedLanguage = useSelector((state) => state.newsF.saveLanguage);

  const [newToken, setNewToken] = useState("");
  const [storiesData, setStoriesData] = useState();
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState("stories");  




  useEffect(() => {
    if (getSelectedLanguage) {
      i18n.changeLanguage(getSelectedLanguage);
    }
  }, [getSelectedLanguage, i18n]);

  useEffect(() => {
    const getUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);
          getFCMToken();
        }
      } catch (error) {
        console.error("Error getting user permission:", error);
      }
    };

    getUserPermission();
  }, []);

  const getFCMToken = async () => {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    if (!fcmtoken) {
      try {
        const newToken = await messaging().getToken();
        console.log("New token =======>> :", newToken);
        setNewToken(newToken);
        await AsyncStorage.setItem("fcmtoken", newToken);
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    } else {
      console.log("Token already !!!!", fcmtoken);
    }
  };

  useEffect(() => {
    getFcmTokenData();
  }, [newToken]);

  const getFcmTokenData = async () => {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    if (fcmtoken) {
      const formData = new FormData();
      formData.append("fcm_token", fcmtoken);
      const res = await postStatusApiCall({
        route: "saveFCMToken",
        verb: "POST",
        token: token,
        body: formData,
      });
    }
  };

  const onPressReels = () => {
    setSelectedTab("reels");
  };

  const onPressStories = () => {
    setSelectedTab("stories");
  };

  const editPostLoading = useSelector(
    (state) => state?.blackNewsF?.editPostLoading
  );

  const createPostLoading = useSelector(
    (state) => state?.blackNewsF?.createPostLoading
  );

  const deletePostLoading = useSelector(
    (state) => state?.blackNewsF?.deletePostLoading
  );

  const loadStories = async () => {
    try {
      const res = await settingsApiCall({
        route: "story",
        verb: "GET",
        token,
      });
      if (res.responseCode === 200) {
        const myStoryData = res?.payload?.data?.my_story;
        setStoriesData(myStoryData);
        dispatch(setMyStory(myStoryData));
      } else {
        // Handle other response codes if needed.
      }
    } catch (error) {
      console.log("saga loadStories error -- ", error.toString());
    }
  };

  useEffect(() => {
    const reFresh = navigation.addListener("focus", () => {
      loadStories();
    });

    return () => {
      reFresh(); // Remove the event listener
    };
  }, [navigation, storiesData]);

  const setSearchEnable = () => {
    navigation.navigate("SearchComponent");
  };

  const getReelsDataApi = useCallback(() => {
    dispatch(
      getReelsDataRequest({
        token,
        currentPage: 1,
        reel_order: reelsData?.reel_order,
      })
    );
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getReelsDataApi();
    });

    return unsubscribe;
  }, [navigation, reelsData?.reel_order]);

  const ListHeaderComponent = () => {
    return (
      <>
        <View style={styles.head}>
          <HomeHeader
            setSearchEnable={() => setSearchEnable()}
            onMessengerPress={() => onPressTouchBase("", "", true, navigation)}
            messenger={true}
          />
        </View>

        <View style={styles.mainview}>
          <View style={styles.GrayView}></View>
          <ReelStoriesTabs
            selectedTab={selectedTab}
            onPressReels={onPressReels}
            onPressStories={onPressStories}
          />

          {selectedTab === "reels" ? (
            <ReelsInNewsFeed homeRealApiData={reelsData} />
          ) : (
            <View style={styles.storycontainer}>
              <Stories storyData={storiesData} />
            </View>
          )}

          <View style={styles.GrayView}></View>
          <NewPost newsFeed />
        </View>

        <FlatListItemSeparator />
        <SideBarFriend />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      {topBarVisible && (
        <View>
          <TopBar title="Palsome" />
        </View>
      )}

      <View style={{ flex: 1, height: height }}>
        {editPostLoading ? (
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Updating your post...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        ) : null}

        {deletePostLoading ? (
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Deleting your post...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        ) : null}

        {createPostLoading ? (
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Creating your post...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        ) : null}

        <NewsfComponent
          Header={ListHeaderComponent}
          topBarVisible
          setTopBarVisible={setTopBarVisible}
        />
      </View>
    </View>
  );
};

export default NewsFeed;
