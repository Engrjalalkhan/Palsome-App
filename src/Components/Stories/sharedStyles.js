import { StyleSheet } from "react-native";
import { WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";

const sharedStyles = StyleSheet.create({
  storiesBgImg: {
    height: 150,
    width: 90,
    marginLeft: WP(2),
    borderWidth: 2.5,
    borderRadius: 15,
    // borderColor: "#c13584",
    borderColor: COLORS.white,
    overflow: "hidden",
  },
  userNameStyle: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
export default sharedStyles;
