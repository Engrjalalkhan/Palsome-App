import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import { WP, HP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: COLORS.white,
  },
  loaderStyle: { height: getHeight(80), justifyContent: "center" },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingTop: 15,
    padding: 10,
    paddingBottom: 5,
  },
  logo2: {
    marginHorizontal: WP(3),
    // marginBottom: HP(1),
    width: WP(15),
    height: WP(15),
    borderRadius: WP(15),
  },
  placeItemView: {
    paddingVertical: HP(1.5),
    paddingHorizontal: WP(2),
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
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
    color: COLORS.red,
  },
  mapImage: {
    width: "100%",
    alignSelf: "center",
    resizeMode: "stretch",
    height: 300,
    //margin: 10,
    marginVertical: 10,
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
});
export default styles;
