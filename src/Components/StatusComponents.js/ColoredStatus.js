import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { HP, WP } from "../../../Utils/Resposive";
import { useDispatch, useSelector } from "react-redux";
import { SITE_URL } from "../../Services/Constants";
import FastImage from "react-native-fast-image";
import { WidthScreen } from "../TopBar/Dimensions";
import { showImgFunc } from "../../../Utils/Data";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import moment from "moment/moment";
import AntDesign from "react-native-vector-icons/AntDesign";

const ColoredStatus = (props) => {
  const { t } = useTranslation();

  const userData = useSelector((state) => state.auth.userData);
  const profileDP = useSelector((state) => state.prof.profilePicture);

  const onPress = () => {
    const time = moment(props?.expirytext, "YYYYMMDD").endOf("day").fromNow();

    props?.flashRef?.current?.showMessage({
      message: `${t("This post will expire")} ${time} ${t("from now")}`,
      type: "info",
    });
  };

  return (
    <LinearGradient
      colors={[props.color1, props.color2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        width: WP(95),
        height: HP(40),
      }}
    >
      <View>
        <View style={styles.dpName}>
          <FastImage
            style={styles.dp}
            source={
              userData?.profile_picture != null
                ? {
                    uri:
                      profileDP == null
                        ? SITE_URL + userData?.profile_picture
                        : profileDP,
                  }
                : profileDP !== null
                ? { uri: profileDP }
                : IMAGES.blankDP
            }
          />
          <View style={{ width: WidthScreen * 0.81 }}>
            <Text style={{ marginTop: 5, marginLeft: 5, color: props.color }}>
              <Text style={styles.name}>
                {userData.first_name} {userData.last_name}
              </Text>

              {props.feeling_value && (
                <Text onPress={props?.onPressFeeling}>
                  {" "}
                  - {props.feeling_action}
                  <Text style={styles.feelAction}> {props.feeling_value} </Text>
                  {showImgFunc(props.feeling_value)}
                </Text>
              )}
              {props?.tags && props.tags.length > 0 ? (
                <Text onPress={props?.onPressTagged}>
                  {" "}
                  {!props.feeling_value ? "is " : null}with
                  <Text style={styles.feelAction}>
                    {" "}
                    {props?.tags?.[0]?.first_name} {props?.tags?.[0].last_name}
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
                  <AntDesign name="clockcircle" size={12} color={props.color} />
                </TouchableOpacity>
              )}
            </Text>
            {props.children}
          </View>
        </View>

        <TextInput
          multiline
          placeholder={
            props?.timelinePlaceholder
              ? props?.timelinePlaceholder
              : `What's on your mind, ${userData.first_name}?`
          }
          onChangeText={(val) => {
            props.handleText(val);
          }}
          onLayout={props?.onLayout}
          value={props?.value}
          placeholderTextColor={props?.color}
          style={[styles.input, { color: props.color }]}
          color={props.color}
          onFocus={props.onFocus}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "99%",
    maxHeight: HP(32),

    alignSelf: "center",
    marginTop: 5,
    fontSize: 20,
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
    height: HP(40),
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
});

export default ColoredStatus;
