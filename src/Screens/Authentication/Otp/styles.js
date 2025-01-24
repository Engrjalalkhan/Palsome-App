import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../Constants/Colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    marginVertical: heightPercentageToDP("2"),
  },
  textmain: {
    flex: 1,
    width: widthPercentageToDP("80%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("20"),
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 26,
    color: COLORS.primary,
  },
  text2: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
  btnmain: {
    flexDirection: "column",
    marginTop: widthPercentageToDP("9"),
  },
  error: {
    color: "red",
    alignSelf: "flex-start",
  },
  otpEmailText: {
    fontWeight: "bold",
  },
});
export default styles;
