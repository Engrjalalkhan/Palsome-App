import { useTranslation } from "react-i18next";
import React, { useState, useCallback, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  ImageBackground,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  PixelRatio,
  Platform,
  BackHandler,
} from "react-native";
import {
  heightPercentageToDP as HP,
  widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import Toast from "react-native-simple-toast";
import { Keyboard } from "react-native";
import DiscardModal from "../../../Components/DiscardModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { Pattern } from "react-native-svg";
import MyHeader from "../../../Components/MyHeader";
import { useDispatch, useSelector } from "react-redux";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { DarkTheme } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useKeyboard } from "../../../../Utils/Hooks/KeyBoardHeight";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { BASE_URL } from "../../../Services/Constants";
import { postStatusApiCall } from "../../../Services/Apis";
import { isRTL } from "../../../../Utils/IsRTL";

const ColoredPost = (props) => {
  const { t } = useTranslation();

  const foregroundColor = COLORS.white;
  const backgroundColor = COLORS.success;
  const inputAccessoryViewID = "uniqueID";
  const navigation = useNavigation();
  const [pattern, setPattern] = useState("");
  const [postId, setPostId] = useState();
  const [storyprivacy, setStoryprivacy] = useState("public");
  const [temporary, setTemporary] = useState(1);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const [postBackgroundColor, setPostBackgroundColor] = useState();
  const [backgroundCheck, setBackgroundCheck] = useState(false);
  const [colorPat, setColorPat] = useState();
  const [disBtn, setDisBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [lengthMore, setLengthMore] = useState();
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);
  const { keyboardHeight, keyboardVisible } = useKeyboard();
  // const BASE_URL = "https:palsome.com/";
  const Placeholder = `${t("What's on your mind, ")}${userData.first_name}?`;
  const handleColorPat = (item) => {
    setBackgroundCheck(true);
    // console.log("===>temporary_story", JSON.stringify(item));
    setPattern(item);
    setPostId(item.id);
    // console.log(item.id);
    setPostBackgroundColor(item.background_color_2);
    setColorPat(item.id);
    // TextStory(item);
  };
  const handleBack = () => {
    if (inputValue == "") {
      // handleBack;
      console.log("getback");
      navigation.goBack();
    } else {
      setDiscardModalVisible(true);
    }
  };
  // useEffect(() => {
  //   TextStory();
  // }, []);
  // const TextStory = async item => {
  //   const formData = new FormData();
  //   formData.append('colored_pattern_id', postId);
  //   formData.append('story_title', inputValue);
  //   formData.append('story_privacy', storyprivacy);
  //   formData.append('temporary_story', temporary);
  //   console.log(
  //     'formdata==>              jjj',
  //     JSON.stringify(formData, null, 2),
  //   );
  //   try {
  //     const res = await withoutStringiApiCall2({
  //       route: `story`,
  //       verb: 'POST',
  //       token: token,
  //       params: formData,
  //     });

  //     if (res.responseCode !== 200) {
  //       console.log(
  //         'res !== 200 in color text  - - - ',
  //         JSON.stringify(res, null, 2),
  //       );
  //     } else if (res.responseCode == 200) {
  //       console.log('res inin coloreed text- - - ', res.payload.data);
  //       navigation.goBack();
  //     }
  //   } catch (e) {
  //     console.log('saga login error -- ', e.toString());
  //   }
  //   // }
  // };
  // const apiURL = "https://palsome.com/api/story",
  //   const TextStory = await fetch(apiURL, {

  //     method: 'POST',
  //     headers: {
  //         'Content-type': 'application/json',
  //         'Authorization': `Bearer ${token}`, // notice the Bearer before your token
  //     },
  //     body: JSON.stringify(formData)
  // })
  const TextStory = async () => {
    setLoading(true);
    setTimeout(() => {
      Toast.show("Creating your story...", Toast.LONG);
    }, 1500);
    const formData = new FormData();
    formData.append("colored_pattern_id", postId);
    formData.append("story_title", inputValue);
    formData.append("story_privacy", storyprivacy);
    formData.append("temporary_story", temporary);

    const response = await postStatusApiCall({
      route: "story",
      verb: "POST",
      token: token,
      body: formData,
    });

    if (response.responseCode === 200) {
      console.log("textstory api response ===>", response);
      setTimeout(() => {
        Toast.show("Story posted successfully", Toast.LONG);
      }, 2000);

      setLoading(false);

      navigation.navigate("NewsFeed");
    } else {
      setLoading(false);
      navigation.navigate("NewsFeed");
      Toast.show(
        "Try Again",
        Toast.LONG
        // foregroundColor,
        // backgroundColor,
      );
    }
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const scale = SCREEN_WIDTH / 320;

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
  }, []);
  function handleBackButtonClick() {
    // if (inputValue == "") {
    //   // handleBack;
    //   console.log(inputValue);
    //   navigation.goBack();
    //   // return true;
    // } else {
    //   console.log("Show Discard Modal");
    //   setDiscardModalVisible(true);
    //   // return true;
    // }
    // handleBack;
    console.log("Hitted");
    return true;
  }

  useEffect(() => {
    handleColorPat(myPatterns[0]);
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.remove("hardwareBackPress", handleBackButtonClick);
    };
  }, []);

  const myPatterns = [
    {
      id: 1,
      type: "image",
      background_image: "patterns/1.jpg",
      background_color_1: null,
      background_color_2: null,
      text_color: COLORS.white,
    },
    {
      id: 2,
      type: "image",
      background_image: "patterns/2.jpg",
      background_color_1: null,
      background_color_2: null,
      text_color: COLORS.white,
    },
    {
      id: 3,
      type: "image",
      background_image: "patterns/3.jpg",
      background_color_1: null,
      background_color_2: null,
      text_color: COLORS.white,
    },
    {
      id: 4,
      type: "image",
      background_image: "patterns/4.jpg",
      background_color_1: "",
      background_color_2: "",
      text_color: COLORS.black,
    },
    {
      id: 5,
      type: "image",
      background_image: "patterns/5.jpg",
      background_color_1: null,
      background_color_2: null,
      text_color: COLORS.black,
    },
    {
      id: 6,
      type: "color",
      background_image: null,
      background_color_1: COLORS.magenta,
      background_color_2: COLORS.gulfBlue,
      text_color: COLORS.yellow,
    },
    {
      id: 7,
      type: "color",
      background_image: "",
      background_color_1: COLORS.primary,
      background_color_2: COLORS.error,
      text_color: COLORS.white,
    },
  ];

  const renderItem = (item) => {
    return (
      <View>
        {item.type === "image" ? (
          <TouchableOpacity
            style={{
              borderColor: COLORS.yellow,
              borderWidth: 1,
              borderRadius: HP(15),
            }}
            onPress={() => {
              // console.log('lo gi item', item);
              handleColorPat(item);
            }}
          >
            <Image
              style={{ width: WP(14), height: WP(14), borderRadius: WP(14) }}
              source={{
                uri:
                  "https://testing.palsome.com/frontend/img/" +
                  item.background_image,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => {
                handleColorPat(item);
              }}
              style={{
                width: WP(14),
                height: WP(14),
                borderRadius: WP(14),
                borderColor: COLORS.yellow,
                borderWidth: 1,
                backgroundColor: item.background_color_1,
              }}
            />
          </View>
        )}
      </View>
    );
  };
  const itemSeparator = () => {
    return (
      <View
        style={{
          width: WP(2),
          flexDirection: "row",
        }}
      />
    );
  };
  const { bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{
        alignItems: "center",
      }}

      // scrollEnabled={false}
    >
      <MyHeader goBack={handleBack} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {discardModalVisible && (
          <DiscardModal
            isVisible={discardModalVisible}
            setIsVisible={setDiscardModalVisible}
            onDiscard={navigation.goBack}
            // onSave={() => goBack()}
          />
        )}

        {pattern.type === "color" ? (
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            style={{ backgroundColor: postBackgroundColor }}
            contentContainerStyle={[
              styles.colorStyle,
              { backgroundColor: postBackgroundColor },
            ]}
          >
            <LinearGradient
              colors={[pattern.background_color_1, pattern.background_color_2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inputStyle}
            >
              {/* <View style={{ height: HP(55) }}> */}
              <TextInput
                numberOfLines={6}
                maxLength={450}
                multiline={true}
                placeholderStyle={{ fontSize: 50, padding: 50 }}
                // inputAccessoryViewID={inputAccessoryViewID}
                placeholder={Placeholder}
                onChangeText={(val) => {
                  setInputValue(val);
                }}
                value={inputValue}
                placeholderTextColor={pattern.text_color}
                style={styles.inputTwo}
                color={pattern.text_color}
                // onFocus={() => console.log('focused')}
              />
              {Platform.OS == "ios"
                ? keyboardVisible && (
                    <View style={styles.bottombar}>
                      <TouchableOpacity
                        onPress={() => {
                          Keyboard.dismiss();
                        }}
                        activeOpacity={1}
                      >
                        {}
                        {ICONS.fontAwesome5("caret-down", null, 23)}
                      </TouchableOpacity>
                    </View>
                  )
                : null}
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.flatStyle,
                  {
                    right: inputValue !== "" ? WP(14) : WP(0.1),
                    bottom: Platform.OS == "ios" ? bottom + 10 : bottom + 10,
                    // backgroundColor: "red",
                  },
                ]}
                contentContainerStyle={{ padding: 10 }}
                data={myPatterns}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={itemSeparator}
              />
              {inputValue !== "" ? (
                <TouchableOpacity
                  onPress={(item) => {
                    Keyboard.dismiss();
                    TextStory(item);
                    setDisBtn(true);
                  }}
                  disabled={disBtn}
                  style={[
                    styles.sendStyle,
                    {
                      bottom: Platform.OS == "ios" ? bottom + 25 : bottom + 25,
                    },
                  ]}
                >
                  {ICONS.ionIcons("ios-send", COLORS.white, 20)}
                </TouchableOpacity>
              ) : null}
            </LinearGradient>
          </KeyboardAwareScrollView>
        ) : (
          <ImageBackground
            // resizeMode="stretch"
            source={{
              uri:
                "https://testing.palsome.com/frontend/img/" +
                pattern.background_image,
            }}
            style={styles.backimgStyle}
          >
            <TextInput
              numberOfLines={6}
              maxLength={450}
              multiline={true}
              placeholderStyle={{ fontSize: 50, padding: 50 }}
              // inputAccessoryViewID={inputAccessoryViewID}
              placeholder={Placeholder}
              onChangeText={(val) => {
                setInputValue(val);
              }}
              value={inputValue}
              placeholderTextColor={pattern.text_color}
              style={styles.inputTwo}
              color={pattern.text_color}
              // onFocus={() => console.log('focused')}
            />

            {Platform.OS == "ios"
              ? keyboardVisible && (
                  <View style={styles.bottombar}>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                      }}
                      activeOpacity={1}
                    >
                      {ICONS.fontAwesome5("caret-down", null, 23)}
                    </TouchableOpacity>
                  </View>
                )
              : null}
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={[
                styles.flatStyle,
                {
                  right: inputValue !== "" ? WP(14) : WP(0.1),
                  bottom: Platform.OS == "ios" ? bottom + 10 : bottom + 10,
                  // backgroundColor: "red",
                },
              ]}
              contentContainerStyle={{ padding: 10 }}
              data={myPatterns}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={itemSeparator}
            />
            {inputValue !== "" ? (
              <TouchableOpacity
                onPress={(item) => {
                  Keyboard.dismiss();
                  setDisBtn(true);
                  TextStory(item);
                }}
                disabled={disBtn}
                style={[
                  styles.sendStyle,
                  {
                    backgroundColor: disBtn ? COLORS.grey : COLORS.primary,
                    bottom: Platform.OS == "ios" ? bottom + 20 : bottom + 20,
                  },
                  { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
                ]}
              >
                {ICONS.ionIcons("ios-send", COLORS.white, 20)}
              </TouchableOpacity>
            ) : null}
          </ImageBackground>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
  },
  bottombar: {
    width: WP(10),
    position: "absolute",

    backgroundColor: COLORS.tooLightGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    bottom: 5,
    paddingVertical: 10,
    right: 5,
    alignSelf: "flex-end",
  },
  textInputStyle: {
    paddingHorizontal: 12,
    width: 100,
    backgroundColor: COLORS.tooLightGrey,
    borderStyle: "solid",
    marginLeft: -4,
    overflow: "hidden",
    // marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 25,
  },
  sendStyle: {
    width: WP(14),
    height: WP(14),

    borderColor: COLORS.white,
    borderWidth: 0.5,
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",

    borderRadius: WP(20),

    right: WP(1),
  },

  colorStyle: {
    // width: WP(100),
    // height: HP(100),
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatStyle: {
    position: "absolute",
    bottom: HP(10),
    left: WP(0.1),
  },
  inputOne: {
    justifyContent: "center",
    alignItems: "center",
    // fontSize: normalize(24),
    textAlign: "center",
    alignSelf: "center",
    width: WP(93),
    fontSize: 25,
    backgroundColor: COLORS.blue,

    flex: 0.6,
  },
  inputTwo: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
    width: WP(93),
    fontSize: 25,
    // backgroundColor: "red",

    bottom: HP(3),
  },
  inputFirst: {
    justifyContent: "center",
    alignItems: "center",

    textAlign: "center",
    alignSelf: "center",
    width: WP(93),
    fontSize: 25,

    flex: 0.9,
    // backgroundColor: "red",
    bottom: HP(10),
  },
  inputStyle: {
    width: WP(100),

    flex: 1,
    justifyContent: "center",
  },
  backimgStyle: {
    flex: 1,

    justifyContent: "center",
  },
  txtinputStyle: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 25,
    alignSelf: "center",
    width: WP(90),
    height: HP(80),
  },
});

export default ColoredPost;
