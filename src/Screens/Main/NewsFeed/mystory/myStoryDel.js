import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import Ionic from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";

import { setMyStory } from "../../../../Redux/actions/NewsFeedActions";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  settingsApiCall,
  withoutStringiApiCall,
} from "../../../../Services/Apis";
import MyHeader from "../../../../Components/MyHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../../Constants/Colors";
import { BASE_URL, SITE_URL } from "../../../../Services/Constants";
import { IMAGES } from "../../../../Constants/Images";
import FastImage from "react-native-fast-image";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import { HP, WP } from "../../../../../Utils/Resposive";
import { alignment } from "../../../../styles/TextAlignment";
const MyStoryDel = ({ ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const token = useSelector((state) => state.auth.userToken);

  const [itoDel, setItoDel] = useState();
  const [myStoryData, setmyStoryData] = useState(
    props.route.params.myStoryData
  );
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [storyViewData, setStoryViewData] = useState([]);
  const [storyViewModal, setStoryViewModal] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("NewsFeed");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const toggleStoryViewModal = () => {
    setStoryViewModal(!storyViewModal);
  };

  const onViewSeenBy = async (item) => {
    setLoading(true);
    try {
      const storyViewApi = await withoutStringiApiCall({
        route: `story/views/seen_users?id=${item?.id}`,
        verb: "GET",
        token: token,
      });

      if (storyViewApi?.responseCode === 200) {
        setStoryViewData(storyViewApi?.payload?.data?.viewers?.data);
        setLoading(false);
      } else {
        console.log("Error: " + storyViewApi);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Toast.show("An error occurred while fetching data");
    }
  };

  const loadStories = async () => {
    // alert('2nd');

    try {
      const res = await settingsApiCall({
        route: "story",
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
      } else if (res.responseCode == 200) {
        setmyStoryData(res.payload.data.my_story);
        dispatch(setMyStory(res?.payload?.data?.my_story));
      }
    } catch (error) {
      console.log("saga login error -- ", error.toString());
    }
  };
  const onDelete = async (item) => {
    setDeleteModal(false);

    const apiURL = `${BASE_URL}/story/${itoDel}`;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer" + " " + token);
    const formData = new FormData();
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    await fetch(apiURL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.responseCode === 200) {
          loadStories();

          Toast.show("Story Deleted", Toast.LONG);
        } else {
          console.log("OnDelete api response on error ===>", result);

          Toast.show(result.message, Toast.LONG);
        }
      })
      .catch((error) => {
        console.log("OnDelete error", error);
      });
  };
  const timeDifference = (previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = new Date() - new Date(previous);
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " s";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " m";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " h";
    } else if (elapsed < msPerMonth) {
      return +Math.round(elapsed / msPerDay) + " d";
    } else if (elapsed < msPerYear) {
      return +Math.round(elapsed / msPerMonth) + " month";
    } else {
      return +Math.round(elapsed / msPerYear) + " y";
    }
  };

  console.log(disabled);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {storyViewModal && (
        <Modal
          isVisible={storyViewModal}
          onBackdropPress={toggleStoryViewModal}
          scrollHorizontal={true}
          animationIn="slideInRight"
          animationOut="slideOutDown"
          animationInTiming={400}
          animationOutTiming={500}
          style={{ backgroundColor: COLORS.white, margin: 0 }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.viewersContainer}>
              <Text style={styles.viewersText}>
                {storyViewData?.length} {t("viewers")}
              </Text>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                }}
                onPress={toggleStoryViewModal}
              >
                <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading ? (
                <View style={styles.loading}>
                  <ActivityIndicator size={"large"} color={COLORS.primary} />
                </View>
              ) : (
                <ScrollView style={{ flex: 1 }}>
                  <View style={styles.storyViewUsers}>
                    {storyViewData?.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          setStoryViewModal(false);
                          navigation.navigate("ProfileScreen", {
                            id: item?.id,
                          });
                        }}
                        key={index}
                        style={styles.storyUsersCard}
                      >
                        <FastImage
                          style={styles.storyUsersDP}
                          source={
                            item.profile_picture
                              ? {
                                  uri: SITE_URL + item?.profile_picture,
                                }
                              : IMAGES.blankDP
                          }
                        />
                        <View style={styles.userNameTextContainer}>
                          <Text
                            style={styles.storyUsersNameText}
                            numberOfLines={1}
                          >
                            {item?.first_name + " " + item?.last_name}
                          </Text>
                          <Text style={alignment.left}>
                            {timeDifference(item?.pivot?.created_at) +
                              " " +
                              "ago"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {storyViewData?.length === 0 && (
                      <View style={styles.emptyMessageContainer}>
                        <View style={styles.emptyMessageCard}>
                          <Text style={styles.emptyMessageText}>
                            {t("No one has seen this yet!")}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      )}

      {disabled ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation?.navigate("NewsFeed");
          }}
        >
          <Image style={{ resizeMode: "contain" }} source={IMAGES.leftArrow} />
        </TouchableOpacity>
      ) : (
        <MyHeader goBack={() => navigation.navigate("NewsFeed")} />
      )}

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // marginTop: Platform.OS == "ios" ? hp(1) : hp(0.2),
        }}
      >
        <Modal
          isVisible={deleteModal}
          // transparent={true}
          style={styles.mtwoStyle}
        >
          <View style={styles.excelStyle}>
            <AntDesign
              name="exclamationcircleo"
              size={44}
              color={COLORS.gold}
            />
          </View>
          <View style={styles.surestyle}>
            <Text style={styles.SureText}>{t("Are you sure?")}</Text>
            <Text style={styles.delTex}>
              {t("You want to delete this story?")}
            </Text>
          </View>
          <View style={styles.modalbuttonStyle}>
            <TouchableOpacity
              onPress={() => {
                onDelete(), setDisabled(true);
              }}
              style={styles.deleteButton}
            >
              <Text style={styles.delTxtStyle}>{t("Delete")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // props.route.params.falseMute();
                setDeleteModal(false);
              }}
              style={styles.canStyle}
            >
              <Text style={styles.canText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {myStoryData?.length >= 1 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={myStoryData?.[0].items}
            keyExtractor={(result) => result.id}
            contentContainerStyle={{
              justifyContent: "flex-start",
              marginTop: hp(1),
              marginHorizontal: hp(2),
            }}
            style={{
              flex: 1,
              // height: hp(20),
              // width: wp(100),
              // backgroundColor: COLORS.white,
              //     width: hp(80),
            }}
            renderItem={({ item, index }) => (
              <>
                <View
                  style={{
                    height: hp(14),
                    width: wp(90),
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: hp(11),
                      height: hp(11),
                      borderRadius: 60,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.type === "photo" ? (
                      <Image
                        source={{
                          uri: item?.preview,
                        }}
                        style={styles.userImage}
                      />
                    ) : item.type == "text" ? (
                      <>
                        {item.colored_pattern.type == "image" ? (
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ImageBackground
                              source={{
                                uri: `${SITE_URL}frontend/img/${item.colored_pattern.background_image}`,
                              }}
                              style={{
                                width: 70,
                                height: 70,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              imageStyle={{
                                borderRadius: 35,
                              }}
                            >
                              <Text
                                numberOfLines={5}
                                style={{
                                  paddingVertical: hp(1),
                                  paddingHorizontal: wp(1.3),
                                  fontSize: 6,
                                  textAlign: "center",
                                  color: item.colored_pattern.text_color,
                                }}
                              >
                                {item.story_text}
                              </Text>
                            </ImageBackground>
                          </View>
                        ) : (
                          <LinearGradient
                            // colors={["#FF00FF", "#FF00FF"]} background_color_2
                            colors={[
                              item.colored_pattern.background_color_1,
                              item.colored_pattern.background_color_2,
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.inputStyle}
                          >
                            <Text
                              numberOfLines={5}
                              style={{
                                paddingVertical: hp(1),
                                paddingHorizontal: wp(1),
                                paddingTop: hp(0.5),
                                fontSize: 6,
                                textAlign: "center",
                                color: item.colored_pattern.text_color,
                              }}
                            >
                              {item.story_text}
                            </Text>
                          </LinearGradient>
                        )}
                      </>
                    ) : (
                      <Image
                        source={{
                          uri: item?.preview,
                        }}
                        style={styles.userImage}
                      />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      onViewSeenBy(item);
                      toggleStoryViewModal();
                    }}
                  >
                    <View
                      style={{
                        width: wp(50),
                        height: hp(12),
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text style={styles.textStyle}>
                        {item?.seen_count}{" "}
                        {item?.seen_count > 1 ? (
                          <Text style={styles.textStyleT}>{t("Views")}</Text>
                        ) : (
                          <Text style={styles.textStyleT}>{t("View")}</Text>
                        )}
                      </Text>
                      <Text style={styles.textStyleTwo}>
                        {timeDifference(item.timestamp) + " " + "ago"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setDeleteModal(true), setItoDel(item.id);
                    }}
                    style={{
                      width: wp(10),
                      height: hp(11),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionic
                      name="trash-outline"
                      color={COLORS.primary}
                      size={20}
                      style={styles.dotStyle}
                    />
                  </TouchableOpacity>
                  {/* </View> */}
                </View>
                <View
                  style={{
                    width: wp(90),
                    backgroundColor: "Gray",
                    height: hp(0.1),
                    opacity: 0.4,
                  }}
                ></View>
              </>
            )}
          />
        ) : (
          navigation.navigate("NewsFeed")
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backButton: {
    justifyContent: "center",
    paddingLeft: 16,
    marginTop: 3,
    // backgroundColor: "red",
    height: 32,
    width: 60,
  },
  dotStyle: {
    fontSize: 20,
    opacity: 0.6,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 40,
    // borderColor: COLORS.white,
    borderWidth: 1,

    borderColor: COLORS.tooLightGrey,
    backgroundColor: COLORS.white,
  },
  userImageText: {
    flex: 1,
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 70,
    // borderColor: COLORS.white,
    borderWidth: 1,

    borderColor: COLORS.tooLightGrey,
    backgroundColor: COLORS.white,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "800",
  },
  textStyleT: {
    fontSize: 14,
    fontWeight: "bold",
  },
  textStyleTwo: {
    fontSize: 14,
    fontWeight: "600",
  },
  mtwoStyle: {
    flex: 1,
    height: hp(40),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    top: hp(25),
    borderRadius: 30,
    width: wp(85),
    position: "absolute",
    zIndex: 1000,
    backgroundColor: COLORS.white,
  },
  surestyle: {
    width: wp(53),
    height: hp(12),
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },
  SureText: {
    color: "black",
    fontWeight: "800",
    fontSize: 21,
  },
  delTex: {
    color: COLORS.primary,
    fontWeight: "400",
    fontSize: 14,
    marginVertical: hp(1),
  },
  modalbuttonStyle: {
    width: wp(40),
    height: hp(10),
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  deleteButton: {
    width: wp(19),
    height: hp(6),
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  delTxtStyle: { color: COLORS.white, fontWeight: "600" },
  canStyle: {
    width: wp(19),
    height: hp(6),
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.tooLightGrey,
  },
  inputStyle: {
    // borderTopWidth: 0.3,
    // borderBottomWidth: 0.3,
    width: 70,
    height: 70,
    borderRadius: 35,

    justifyContent: "center",
  },
  canText: { color: "blue", fontWeight: "600" },
  loading: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
    top: getHeight(50),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: HP(5),
    zIndex: 1000,
    width: getWidth(95),
    padding: 10,
  },
  viewersText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  crossIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  storyViewUsers: {
    marginTop: 10,
    padding: 10,
  },
  storyUsersCard: {
    width: WP(90),
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  storyUsersDP: {
    height: 55,
    width: 55,
    borderRadius: 125,
    resizeMode: "contain",
  },
  storyUsersNameText: {
    fontSize: 16,
    width: getWidth(75),
    fontWeight: "bold",
    paddingRight: 20,
    textAlign: "left",
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessageCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 3, // For Android shadow
    shadowColor: "black", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyMessageText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  userNameTextContainer: {
    paddingHorizontal: 10,
  },
});

export default MyStoryDel;
