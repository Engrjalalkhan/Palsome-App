import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: "column",
  },
  dob: {
    marginTop: heightPercentageToDP("3"),
  },
  dobtext: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 7,
  },
  boxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: widthPercentageToDP("2"),
  },
  btnmain: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default styles;
