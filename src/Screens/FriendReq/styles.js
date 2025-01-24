import { StyleSheet } from "react-native";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { getWidth } from "../../../Utils/NewResponsive";
import { WP, HP } from "../../../Utils/Resposive";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: "white",
  },
  logo: {
    marginHorizontal: widthPercentageToDP("2"),
  },

  header: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
  },
  tabBullet: {
    backgroundColor: "gray",
    padding: WP(3),
    borderRadius: WP(6),
    marginHorizontal: WP(2.2),
    alignItems: "center",
    justifyContent: "center",
  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  text1: { fontSize: 24, fontWeight: "bold" },
  leftIcon: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-around",
  },
});
export default styles;
