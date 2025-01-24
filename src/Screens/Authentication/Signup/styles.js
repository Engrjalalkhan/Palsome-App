import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    paddingBottom: heightPercentageToDP("20"),
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: heightPercentageToDP("1"),
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  textmain: {
    flex: 1,
    width: widthPercentageToDP("80%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("20"),
  },
  text: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  image: {
    height: widthPercentageToDP("12"),
    width: widthPercentageToDP("12"),
  },
  img: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: widthPercentageToDP("26"),
    marginRight: widthPercentageToDP("26"),
    marginTop: heightPercentageToDP("1.5"),
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: widthPercentageToDP("6"),
  },
  error: {
    color: "red",
    alignSelf: "flex-start",
  },
  IosPicker2: {
    justifyContent: "center",
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    marginTop: widthPercentageToDP("5"),
    width: WP(80),
    height: heightPercentageToDP("5.2"),
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: COLORS.lightGray,
  },
  city: {
    flex: 1,
    justifyContent: "center",
    borderColor: COLORS.lightGray,
    marginRight: 1,
    borderWidth: 1,
    marginTop: widthPercentageToDP("5"),
    width: WP(80),
    height: heightPercentageToDP("5.2"),
  },
  dob: {
    marginTop: heightPercentageToDP("1"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // margin: 8,
    // padding: 5,
    // marginTop: 8,
  },
  dobtext: {
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  dobtextIos: {
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginTop: HP(1),
  },
  datePicker: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  calenderStyle: {
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "center",
    width: 30,
    height: 50,
    zIndex: 100,
    right: -10,
    top: 4 /* Adjust the top position as needed */,
    // backgroundColor: "red",
  },
  containerTextInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1, // Take up remaining space
    paddingRight: 25,
  },
  iconContainer: {
    marginRight: 30,
    marginLeft: -28,
    marginTop: 18,
    // Adjust the margin as needed
  },
});
export default styles;
