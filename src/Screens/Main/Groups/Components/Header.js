import * as React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP } from "react-native-responsive-screen";

import { useTranslation } from "react-i18next";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { HP, WP } from "../../../../../Utils/Resposive";
import { isRTL } from "../../../../../Utils/IsRTL";

export default function Header(props) {
  const { t } = useTranslation();

  const { goBack, onAddPress, showSearch, handleSearchPress } = props;

  return (
    <View
      style={[
        styles.main,
        {
          justifyContent: !showSearch ? "space-between" : "space-evenly",
          margin: showSearch ? 0 : 15,
          marginTop: showSearch ? 0 : 9,
        },
      ]}
    >
      <TouchableOpacity onPress={goBack}>
        <Image
          style={[
            styles.backIcon,
            { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
          ]}
          source={IMAGES.backIcon}
        />
      </TouchableOpacity>

      {showSearch && (
        <TouchableWithoutFeedback onPress={handleSearchPress}>
          <View style={styles.bar}>
            <Ionicons name="search-sharp" size={21} style={styles.logo} />
            <Text style={{ color: COLORS.tooDarkGrey }}>
              {t("Search for groups")}...
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}

      {showSearch && (
        <TouchableOpacity onPress={onAddPress}>
          <Image source={IMAGES.add} style={styles.addIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingRight: WP(1),
    alignItems: "center",
    flexDirection: "row",
    marginVertical: HP(2.5),
    justifyContent: "space-evenly",
    top: Platform.OS === "android" ? 15 : 8,
  },

  backIcon: {
    height: HP(3),
    resizeMode: "contain",
  },

  bar: {
    flex: 0.8,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: widthPercentageToDP("1"),
    backgroundColor: "rgba(234, 234, 234, 0.5)",
  },

  logo: {
    marginHorizontal: widthPercentageToDP("2"),
  },

  addIcon: {
    width: WP(8),
    height: HP(4),
    resizeMode: "contain",
  },
});
