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
  },
  pickerView: {
    borderBottomWidth: 1,
    marginTop: 10,
    justifyContent: "center",
  },
  error: {
    color: "red",
    alignSelf: "flex-end",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: heightPercentageToDP("1"),
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  textmain: {
    flex: 1,
    width: widthPercentageToDP("80%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("22"),
    // justifyContent: 'center'
  },
  textsub: {
    flexDirection: "column",
    marginTop: widthPercentageToDP("9"),
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
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
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: widthPercentageToDP("8"),
  },
});
export default styles;
