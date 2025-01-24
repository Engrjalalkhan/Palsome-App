import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getWidth } from "../../../Utils/NewResponsive";
import { WP, HP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.white,
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
  },
  logo2: {
    marginHorizontal: widthPercentageToDP("3"),
    // marginBottom: heightPercentageToDP("1"),
    width: 48,
    height: 48,
    borderRadius: 125,
  },
  placeItemView: {
    padding: 10,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  input: {
    height: 40,
    paddingLeft: 15,
    width: getWidth(75),
    padding: 10,
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
});
export default styles;
