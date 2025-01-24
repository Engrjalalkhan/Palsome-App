import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { HP, WP } from "../../../Utils/Resposive";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { isRTL } from "../../../Utils/IsRTL";

const BirthdaySearchCom = ({ placeholder, searchQuery, setSearchQuery }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={[
            styles.backIcon,
            { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
          ]}
          source={IMAGES.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.bar}>
        <Ionicons name="search-sharp" size={21} style={styles.logo} />
        <TextInput
          style={styles.inputStyle}
          placeholder={placeholder}
          placeholderTextColor={COLORS.tooDarkGrey}
          autoCapitalize="none"
          returnKeyType="search"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 10,
    paddingRight: 20,
  },
  bar: {
    flexDirection: "row",
    width: widthPercentageToDP("78"),
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
    marginBottom: heightPercentageToDP("1"),
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
});

export default BirthdaySearchCom;
