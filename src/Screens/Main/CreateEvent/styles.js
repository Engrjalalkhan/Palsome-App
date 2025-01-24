import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";
import { theme } from "../../../Core/theme";

const styles = StyleSheet.create({
  image: {
    resizeMode: "stretch",
    width: "90%",
    marginTop: 10,
    height: 95,
  },
  listitem: {
    marginVertical: heightPercentageToDP("0.4"),
  },

  box: {
    flex: 1,
    marginTop: 25,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    flexDirection: "column",
  },
  card_icons_view: {
    flexDirection: "row",
    // justifyContent: "space-between",
    textAlign: "center",
    marginLeft: 12,
    width: 120,
    marginTop: 10,
  },
  card_icons_view2: {
    flexDirection: "row",
    // justifyContent: "space-between",
    textAlign: "center",
    marginLeft: 10,
    width: 120,
    marginBottom: 5,
  },
  card_icon_style: {
    textAlign: "right",
    marginTop: 5,
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
});
export default styles;
