import { StyleSheet } from "react-native";
import { WidthScreen } from "../../Components/TopBar/Dimensions";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";

export const Styles = StyleSheet.create({
  unRead: {
    backgroundColor: COLORS.tooLightGrey,
    // backgroundColor: "rgba(223, 75, 56,0.2)",
  },
  read: {
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: WP(8),
    paddingVertical: HP(1.8),
  },

  blackCircle: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    // marginRight: WP(2.5),
    width: WP(4),
    height: WP(4),
    position: "absolute",
    marginLeft: WP(2),
  },
  img: {
    width: WP(14),
    height: WP(14),
    borderRadius: 40,
  },
  txtContainer: {
    marginLeft: WP(2.8),
  },
});
