import { StyleSheet } from "react-native";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getWidth } from "../../../../Utils/NewResponsive";
import { WP, HP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: COLORS.white,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
  },
  logo2: {
    marginHorizontal: widthPercentageToDP("3"),

    width: WP(20),
    height: WP(20),
    borderRadius: WP(13),
  },
  placeItemView: {
    padding: 10,
    backgroundColor: COLORS.white,
    // justifyContent: "space-between",
    flexDirection: "row",
  },
  input: {
    height: 40,
    paddingLeft: 15,
    width: getWidth(75),
  },
  inputView: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
  },
  iconTouch: {
    justifyContent: "center",
    alignSelf: "center",
    paddingRight: WP(2),
    color: "red",
  },
  mapImage: {
    width: "100%",
    alignSelf: "center",
    resizeMode: "stretch",
    height: 300,
    //margin: 10,
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    marginTop: 5,
    // width: "100%",
  },
  button: {
    paddingHorizontal: WP(3.5),
    paddingVertical: WP(2),

    borderRadius: WP(1),
  },
  buttonText: {
    fontWeight: "bold",
    color: COLORS.white,
  },
  userNames: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: WP(70),
    // backgroundColor: "red",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  btn: {
    // width: getWidth(35),
    // height: getHeight(5),
    backgroundColor: "#DF4B38",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // alignContent: "center",
    borderRadius: 5,
    paddingHorizontal: WP(3.5),
    paddingVertical: WP(2),
    // marginTop: 10,
    // borderWidth: 1,
  },
  btnText: {
    color: "white",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default styles;
