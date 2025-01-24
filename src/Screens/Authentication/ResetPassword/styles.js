import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";
import { getWidth } from "../../../../Utils/NewResponsive";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    width: getWidth(100),
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
  text2: {
    fontFamily: "Roboto",
    fontSize: 16,
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
