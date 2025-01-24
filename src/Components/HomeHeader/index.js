import * as React from "react";
import { useTranslation } from "react-i18next";

import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { HP, WP } from "../../../Utils/Resposive";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";
import { isRTL } from "../../../Utils/IsRTL";

export default function HomeHeader({
  room,
  setSearchEnable,
  innerScreensHeader,
  searchPlaceholder,
  onAddPress,
  onMessengerPress,
  onSearchPress,
  birthdayHeader,
  messenger,
  backArrow = false,
}) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    // <View style={styles.main}>
    <View style={[styles.main, { alignItems: !room ? "center" : null }]}>
      {innerScreensHeader || birthdayHeader ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[
              styles.backIcon,
              { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
            ]}
            source={IMAGES.backIcon}
          />
        </TouchableOpacity>
      ) : (
        <>
          {!backArrow && (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image style={styles.logo2} source={IMAGES.logo} />
            </TouchableOpacity>
          )}
          {backArrow && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.logoo}
            >
              {ICONS.antDesign("arrowleft", null, 35, { fontWeight: "bold" })}
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableWithoutFeedback
        onPress={innerScreensHeader ? onSearchPress : () => setSearchEnable()}
      >
        <View style={[innerScreensHeader ? styles.bar2 : styles.bar]}>
          <Ionicons
            name="search-sharp"
            size={21}
            style={[
              styles.logo,
              { color: innerScreensHeader && COLORS.primary },
            ]}
          />
          <Text style={{ color: COLORS.tooDarkGrey }}>
            {(searchPlaceholder = t("Search"))}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {messenger && (
        <TouchableOpacity onPress={onMessengerPress}>
          <Image source={IMAGES.touchBase} style={styles.touchBase} />
        </TouchableOpacity>
      )}

      <View style={styles.iconContainer}>
        {innerScreensHeader ? (
          <TouchableOpacity onPress={onAddPress}>
            <Image source={IMAGES.add} style={styles.addIcon} />
          </TouchableOpacity>
        ) : null}
        {/* (
          <TouchableOpacity onPress={onMessengerPress}>
            <FontAwesome5Icon
              name="facebook-messenger"
              size={27}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )
        } */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  bar: {
    flexDirection: "row",
    marginRight: widthPercentageToDP("2"),
    width: widthPercentageToDP("78"),
    width: widthPercentageToDP("73"),

    height: heightPercentageToDP("5.2"),
    borderWidth: 1.7,
    borderColor: COLORS.primary,
    alignItems: "center",
    borderRadius: 20,
  },
  iconContainer: {
    marginTop: 5,
  },
  logo: {
    marginHorizontal: widthPercentageToDP("2"),
  },
  logoo: {
    marginHorizontal: widthPercentageToDP("1"),
  },
  logo2: {
    marginHorizontal: widthPercentageToDP("2"),
    // marginVertical: heightPercentageToDP("0.5"),
    // marginBottom: heightPercentageToDP("1"),

    width: WP(10),
    height: HP(5),
    borderRadius: 4,
  },
  inputStyle: {
    flex: 1,
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.tooDarkGray,
    height: 50,
  },
  backIcon: {
    marginTop: HP(1),
    height: HP(3),
    resizeMode: "contain",
  },
  bar2: {
    flexDirection: "row",
    flex: 0.8,
    height: heightPercentageToDP("5"),
    // borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(234, 234, 234, 0.5)",
  },
  addIcon: {
    height: HP(4),
    width: WP(8),
    resizeMode: "contain",
  },
  touchBase: {
    width: WP(10),
    height: HP(5.5),
    borderRadius: 4,
    right: 2,
  },
});
