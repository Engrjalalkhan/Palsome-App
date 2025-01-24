import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { HP, WP } from "../../../Utils/Resposive";
import { showImgFunc } from "../../../Utils/Data";
import { SITE_URL } from "../../Services/Constants";

import { WidthScreen } from "../TopBar/Dimensions";
import PostModalImgsVidz from "../PostModalImgVidz";
import OnlyOneImageModal from "../../Components/OnlyOneImageModal";

import moment from "moment/moment";
import { ICONS } from "../../Constants/Icons";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { isRTL } from "../../../Utils/IsRTL";

const SimpleStatus = (props) => {
  const { t } = useTranslation();

  const userData = useSelector((state) => state.auth.userData);
  const profileDP = useSelector((state) => state.prof.profilePicture);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [testFormattedContent, setTestFormattedContent] = useState([]);

  const combinedData = props?.snapURI
    ? [
        props?.snapURI,
        ...(props?.multipleImages || []),
        ...(props?.AiImage?.type === "image" ? [props?.AiImage] : []),
      ]
    : [
        ...(props?.multipleImages || []),
        ...(props?.AiImage?.type === "image" ? [props?.AiImage] : []),
      ];

  //   const combinedData = props.snapURI
  // ? [props.snapURI, ...props.multipleImages]
  // : props.multipleImages;

  // const imageItems = props?.multipleImages?.filter(
  //   (item) =>
  //     item.post_file_type === "image" ||
  //     item?.type?.match(imgRegex) ||
  //     item?.post_file_type == "video" ||
  //     item?.type?.match(videoRegex)
  // );

  useEffect(() => {
    if (props?.value) {
      handleChangeText(props?.value);
    }
  }, [props.value]);

  const getWord = (word, color, key, weight) => {
    return (
      <Text key={key} style={{ color: color, fontWeight: weight }}>
        {word}
      </Text>
    );
  };

  const handleChangeText = (inputText) => {
    const retLines = inputText.split("\n");
    const formattedText = [];
    retLines.forEach((retLine, lineIndex) => {
      const words = retLine.split(" ");
      const contentLength = words.length;
      var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
      words.forEach((word, wordIndex) => {
        if (
          (word.startsWith("@") && !format.test(word.substr(1))) ||
          (word.startsWith("#") && !format.test(word.substr(1)))
        ) {
          const mention = getWord(
            word,
            word.startsWith("#") ? "#3F729B" : "#DF4B38",
            `${lineIndex}_${wordIndex}`,
            word.startsWith("#") ? "bold" : "normal"
          );
          if (wordIndex !== contentLength - 1) formattedText.push(mention, " ");
          else formattedText.push(mention);
        } else {
          if (wordIndex !== contentLength - 1)
            formattedText.push(
              getWord(word, "black", `${lineIndex}_${wordIndex}`),
              " "
            );
          else
            formattedText.push(
              getWord(word, "black", `${lineIndex}_${wordIndex}`)
            );
        }
      });
      if (lineIndex !== retLines.length - 1) {
        formattedText.push(<Text key={"newline_" + lineIndex}>{"\n"}</Text>);
      }
    });
    setTestFormattedContent(formattedText);
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);

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
  }, [keyboardStatus]);

  const onPress = () => {
    const time = moment(props?.expirytext, "MMDDYYYY").endOf("day").fromNow();

    props?.flashRef?.current?.showMessage({
      message: `${t("This post will expire")} ${time} ${t("from now")}`,
      type: "info",
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          height: props?.isBar ? HP(73) : HP(45),
          marginBottom: keyboardStatus ? HP(-33) : 0,
        },
      ]}
    >
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={50}
        extraScrollHeight={50}
        enableAutomaticScroll={true}
      >
        <View style={styles.dpName}>
          <FastImage
            style={styles.dp}
            source={
              userData.profile_picture != null
                ? {
                    uri:
                      profileDP == null
                        ? SITE_URL + userData.profile_picture
                        : profileDP,
                  }
                : profileDP !== null
                ? { uri: profileDP }
                : IMAGES.blankDP
            }
          />
          <View style={{ width: WidthScreen * 0.81 }}>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 5,
                  textAlignVertical: "center",
                }}
              >
                <Text style={styles.name}>
                  {userData.first_name} {userData.last_name}
                </Text>

                {props.feeling_value && (
                  <Text onPress={props?.onPressFeeling}>
                    {" "}
                    - {props.feeling_action}
                    <Text style={styles.feelAction}>
                      {" "}
                      {props.feeling_value}{" "}
                    </Text>
                    {showImgFunc(props.feeling_value)}
                  </Text>
                )}
                {props?.tags && props.tags.length > 0 ? (
                  <Text onPress={props?.onPressTagged}>
                    {" "}
                    {!props.feeling_value ? "is " : null}
                    with
                    <Text style={styles.feelAction}>
                      {" "}
                      {props?.tags?.[0]?.first_name}{" "}
                      {props?.tags?.[0].last_name}
                    </Text>
                    {props.tags.length > 1 && (
                      <Text>
                        {" "}
                        and
                        <Text style={styles.feelAction}>
                          {" "}
                          {props?.tags?.length - 1} other
                          {props?.tags?.length - 1 > 1 ? "s" : null}
                        </Text>
                      </Text>
                    )}
                  </Text>
                ) : null}
                {props.loc && (
                  <Text>
                    {" "}
                    at
                    <Text
                      style={styles.feelAction}
                      onPress={props?.onPressLocation}
                    >
                      {" "}
                      {props.loc}
                    </Text>
                  </Text>
                )}

                {props?.expiryTime && props?.expirytext && (
                  <TouchableOpacity
                    onPress={onPress}
                    style={{ zIndex: 1, paddingLeft: 3 }}
                  >
                    <AntDesign
                      name="clockcircle"
                      size={12}
                      color={COLORS.darkGray}
                    />
                  </TouchableOpacity>
                )}
              </Text>
            </View>
            {props.children}
          </View>
        </View>

        <TextInput
          scrollEnabled={false}
          multiline={true}
          placeholder={
            props?.timelinePlaceholder
              ? props?.timelinePlaceholder
              : props?.AiImage
              ? t("Say something about this...")
              : `${t("What's on your mind")}, ${userData.first_name}?`
          }
          onChangeText={(val) => {
            props.handleText(val);
            handleChangeText(val);
          }}
          enterKeyHint="next"
          onLayout={props?.onLayout}
          placeholderTextColor={COLORS.grey}
          style={[styles.input]}
          color="black"
          onFocus={props?.onFocus}
          returnKeyType={"none"}
        >
          {testFormattedContent}
        </TextInput>

        {props.multipleImages?.length ||
        props.snapURI?.length ||
        props?.AiImage ? (
          <>
            <View
              style={{
                marginTop: 10,
                marginBottom: keyboardStatus ? 0 : 35,
              }}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={combinedData}
                renderItem={({ item }) =>
                  PostModalImgsVidz(item, props.deleteItem, props?.onPressImage)
                }
                // horizontal={true}
                numColumns={3}
                // style={{ flex: 1 }}

                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            {modalVisible ? (
              <OnlyOneImageModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                image={modalImage}
              />
            ) : null}
          </>
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "99%",
    // maxHeight: HP(32),
    alignSelf: "center",
    marginTop: 5,
    fontSize: 20,
    textAlign: isRTL ? "right" : "left",
  },
  name: {
    fontWeight: "bold",
    fontSize: 17,
  },
  dp: {
    width: WP(14),
    height: WP(14),
    borderRadius: WP(14),
    marginTop: 5,
  },
  container: {
    borderTopWidth: 0.3,
    // borderBottomWidth: 0.3,

    width: WP(95),
    //  old height with playpause issue
    // height: HP(40),

    // Conditional Height for VideoPlayer
    // height: "100%",
  },
  dpName: {
    flexDirection: "row",
  },
  iosviewPickerGen: {
    borderColor: COLORS.black,
    borderWidth: 0.5,
    justifyContent: "space-between",
    width: WP(25),
    height: HP(3),
    borderRadius: 5,
    paddingHorizontal: WP(3),
    // position: "absolute",
    // top: HP(10),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    // left: WP(15),
  },
  feelAction: {
    fontWeight: "bold",
  },
  imgcrossWrap: {
    position: "absolute",
    elevation: 100,
    zIndex: 100,
    height: WP(6),
    width: WP(6),
    backgroundColor: "rgba(150, 150, 150, 0.4)",
    backgroundColor: COLORS.red,
    borderRadius: WP(6),
    top: WP(1),
    justifyContent: "center",
    alignItems: "center",
    left: WP(6),
  },
});

export default SimpleStatus;
