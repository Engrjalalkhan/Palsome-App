import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: widthPercentageToDP("100%"),
    flexDirection: "column",
    marginTop: widthPercentageToDP("2"),
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: widthPercentageToDP("9"),
  },
  imgWrapper: {
    backgroundColor: COLORS.primary,
    height: widthPercentageToDP("10"),
    width: widthPercentageToDP("10"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: widthPercentageToDP("5"),
  },
  image: {
    height: widthPercentageToDP("6"),
    width: widthPercentageToDP("6"),
  },
  listitem: {
    marginVertical: heightPercentageToDP("0.7"),
  },
  textAlignRtl: { textAlign: "left" },
});
export default styles;
