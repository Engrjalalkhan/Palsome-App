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
    color: "white",
  },
  ModelContanier: {
    flex: 1,
    backgroundColor: "white",
  },
  txt2: {
    color: "black",
    fontSize: 30,
    fontWeight: '400',
  },
  ModelContanier: {
    flex: 1,
    backgroundColor: "white",
  },
  head: { marginTop: heightPercentageToDP(2), marginBottom: 15},
  mainview: { marginTop: heightPercentageToDP(2) },
  footer: {
    position: "absolute",
    backgroundColor: "white",
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
    color: COLORS.cocoGrey,
  },
  storycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: heightPercentageToDP("-2"),
    // marginLeft: widthPercentageToDP('5')
  },
  dividerStyle: {
    height: 1,
    marginTop: heightPercentageToDP("2"),
  },
});
export default styles;
