import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  image: {
    width: "70%",
    overflow: "hidden",
    borderWidth: 3,
    marginTop: -15,
    borderRadius: 50,
    height: 95,
  },

  listitem: {
    marginVertical: hp("0.4"),
  },

  box: {
    // flex: 1,
    // marginTop: 15,
    // marginLeft: 10,
    backgroundColor: COLORS.white,
    flexDirection: "column",
    width: wp(42),
    height: hp(26),
    // margin: wp(2),
    margin: wp(2),
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxFeed: {
    // flex: 1,
    // marginTop: 15,
    // marginLeft: 10,
    backgroundColor: COLORS.white,
    // flexDirection: "column",
    width: wp(98),
    height: hp(26),
    alignContent: "center",
    // backgroundColor: "red",
    // margin: wp(2),
    margin: wp(2),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    backgroundColor: COLORS.primary,
    width: wp(44),
    height: hp(21),
    // margin: wp(2),
    borderRadius: 10,
  },

  imageFeed: {
    backgroundColor: COLORS.primary,
    width: wp(86),
    height: hp(21),
    // margin: wp(2),
    borderRadius: 10,
  },
  card_icons_view: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "blue",
  },
  card_icons_view2: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 5,
  },
  card_icon_style: {
    textAlign: "right",
    marginTop: 5,
    marginHorizontal: 5,
  },
  button_text: {
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 17.58,
    color: COLORS.white,
  },
  button_outlook: {
    width: 100,
    height: 34,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  roomStyle: {
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    // marginLeft: 100
  },
  tabStyle: {
    width: wp(95),
    height: hp(100),
    marginTop: hp(0.3),
    paddingHorizontal: wp(4),
    justifyContent: "center",
    alignSelf: "center",
  },
  ButtonStyle: {
    backgroundColor: COLORS.white,
    width: wp(8),
    height: hp(4),
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: wp(1.7),
    marginTop: hp(1.2),
    // padding:4,
  },
});
export default styles;
