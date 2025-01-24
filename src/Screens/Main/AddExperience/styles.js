import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
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
    paddingHorizontal: widthPercentageToDP("3"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("2"),
  },
  text: {
    fontFamily: "Roboto-Bold",
    fontSize: 26,
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
  sub: {
    flex: 1,
    // width: widthPercentageToDP("75%"),
    marginHorizontal: widthPercentageToDP("3"),
  },
  dob: {
    marginTop: heightPercentageToDP("3"),
  },
  dobtext: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "600",
    marginBottom: 6,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: widthPercentageToDP("2"),
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: COLORS.tooLightGrey,
  },
  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: widthPercentageToDP("4"),
  },
  btnmain: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: heightPercentageToDP("3"),
    marginTop: getHeight(3),
  },
  fullbtn: {
    width: getWidth(35),
    height: getHeight(6),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
  },
  fullbtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  small: {
    alignSelf: "center",
    width: widthPercentageToDP("36"),
    height: heightPercentageToDP("3"),
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  big: {
    alignSelf: "center",
    width: widthPercentageToDP("17"),
    height: 56,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  boxtext: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Roboto",
    color: COLORS.tooLightGrey,
  },
});
export default styles;
