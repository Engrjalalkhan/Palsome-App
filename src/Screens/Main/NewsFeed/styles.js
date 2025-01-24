import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    flex: 0.08,
  },
  txt: {
    color: COLORS.white,
  },
  ModelContanier: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  head: { marginTop: heightPercentageToDP(2) },
  mainview: { marginTop: heightPercentageToDP(1) },
  GrayView: { backgroundColor: COLORS.grey, opacity: 0.3, height: HP(1) },
  footer: {
    position: "absolute",
    backgroundColor: COLORS.white,
    left: 0,
    right: 0,
    height: 50,
    bottom: 0,
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: COLORS.cocoGrey,
    flexDirection: "row",
  },
  header: {
    borderBottomColor: COLORS.cocoGrey,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",

    alignItems: "center",
  },
  // nf:{ flex: 1, height: height },
  main: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: heightPercentageToDP("3"),
  },
  bar: {
    flexDirection: "row",
    width: widthPercentageToDP("60"),
    height: heightPercentageToDP("3.8"),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logo: {
    marginTop: heightPercentageToDP("1"),
  },
  font: {
    fontFamily: "Roboto",
    fontSize: 17,
    fontWeight: "400",
    color: COLORS.tooDarkGrey,
  },
  storycontainer: {
    // backgroundColor: "red",
    marginTop: HP(1),
    marginBottom: HP(0.5),
  },
});
export default styles;
