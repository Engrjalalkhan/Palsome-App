import { StyleSheet } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { theme } from "../../../Core/theme";
import { COLORS } from "../../Constants/Colors";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: heightPercentageToDP("2"),
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    flex: 0.1,
  },
  srchIcon: {
    marginRight: widthPercentageToDP("5"),
    justifyContent: "center",
  },
  image: {
    resizeMode: "center",
  },
  listitem: {
    marginVertical: heightPercentageToDP("0.7"),
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
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
