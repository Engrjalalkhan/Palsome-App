import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

import { theme } from "../../../Core/theme";
import { COLORS } from "../../../Constants/Colors";

import {
  getHeight,
  getWidth,
  getFontSize,
} from "../../../../Utils/NewResponsive";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  switchUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    height: 50,
  },
  switchUserSyncImage: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: -5,
    bottom: -5,
    tintColor: COLORS.tooDarkGrey,
  },

  switchUserSyncUserImage: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  switchUserDropDown: {
    height: 25,
    width: 25,
    marginHorizontal: 20,
    resizeMode: "contain",
    tintColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: heightPercentageToDP("2"),
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginLeft: widthPercentageToDP("7"),
  },

  card: {
    elevation: 16,
    marginBottom: 10,
    borderRadius: 10,
    width: getWidth(40),
    shadowColor: "#000",
    height: getHeight(9),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingLeft: 10,

    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  listitem: {
    marginVertical: heightPercentageToDP("0.7"),
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

  cardsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: getWidth(5),
    justifyContent: "space-between",
  },

  cardsText: {
    fontSize: getFontSize(2.5),
    fontWeight: "bold",
    padding: 7,
    paddingVertical: 3,
    flexShrink: 1,
  },

  buyNsellLogo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },

  logoIcon: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },

  birtdayLogo: {
    height: 32,
    width: 32,
  },

  settingsText: {
    fontSize: 28,
    color: theme.colors.text,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
  },

  exploreText: {
    fontSize: 18,
    color: COLORS.cocoGrey,
    left: widthPercentageToDP("12"),
    textAlign: "left",
  },
  textAlignRtl: { textAlign: "left" },
});
export default styles;
