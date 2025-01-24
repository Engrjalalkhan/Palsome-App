import { StyleSheet } from "react-native";
import { getHeight } from "../../../../Utils/FuncsAndRespons";
import { getWidth } from "../../../../Utils/NewResponsive";
import { HP, WP } from "../../../../Utils/Resposive";
import { COLORS } from "../../../Constants/Colors";

const styles = StyleSheet.create({
  containerMain: { flex: 1 },
  container: { flex: 1, marginVertical: 10 },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  tagTxt: {
    left: getWidth(2.5),
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  ModelContanier: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGrey,

    marginBottom: 5,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 200,
    justifyContent: "space-around",
  },
  singleIcon: {
    marginRight: 5,
  },
  footer: {
    position: "absolute",
    backgroundColor: COLORS.white,
    left: 0,
    right: 0,
    height: 50,
    bottom: 0,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: COLORS.cocoGrey,
    flexDirection: "row",
  },
  header: {
    borderBottomColor: COLORS.cocoGrey,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  imgAndStatus: {
    flexDirection: "row",
  },
  upperTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  icons: {
    flexDirection: "row",
    position: "absolute",
    flex: 0.5,
    alignSelf: "baseline",
    right: 4,
  },
  name: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.lightGray,
    marginLeft: 10,
    flexGrow: 1,
  },
  time: {
    color: COLORS.black,
    marginLeft: 10,
  },
  feeling_action: { color: COLORS.lightGray, marginTop: HP(0.5) },
  feeling_value: { fontWeight: "bold", color: COLORS.darkGray, marginTop: HP(0.5) },
  image: {
    flex: 1,
    justifyContent: "center",
    width: WP(100),
    marginLeft: -WP(2.1),
    height: HP(45),
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    height: WP(45),
    justifyContent: "center",
    alignItems: "center",
  },
  colorPost: {
    flex: 1,
    justifyContent: "center",
    width: WP(90),
    height: HP(40),
  },
  // container: {
  //   flex: 1,
  // },
  friendImg: {
    height: getHeight(15),
    width: getWidth(30),
    borderRadius: 13,
  },
  friend: {
    width: getWidth(30),
    height: getHeight(15),
    marginHorizontal: 5,
  },
  innerContainer: {
    //flex: 1,
    // height: 800,
  },
  friendFlatlist: {
    paddingHorizontal: 4,
    flex: 1,
  },
  ItemSeparator: {
    height: 50,
  },
  coverPhoto: {
    height: HP(30),
    width: "100%",
    backgroundColor: "blue",
    borderBottomWidth: 3,
    borderColor: COLORS.white,
  },
  dpContainer: {
    borderRadius: 200,
    alignSelf: "center",
    justifyContent: "center",
  },
  profileImag: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  // dp: {
  //   borderWidth: 5,
  //   alignSelf: "center",
  //   borderRadius: 340,
  //   width: 160,
  //   height: 150,
  //   borderColor: COLORS.white,
  // },

  userName: {
    height: HP(7),
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  usertext: {
    fontSize: 24,
    color: COLORS.white,
    justifyContent: "center",
    alignSelf: "center",
    fontWeight: "bold",
  },
  btn: {
    width: getWidth(30),
    height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  fbtn: {
    width: getWidth(20),
    height: getHeight(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
  },
  fullbtn: {
    width: getWidth(80),
    height: getHeight(5.5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
  },
  fullbtnText: {
    color: COLORS.white,
    fontSize: 16,
  },
  btncontaner: {
    height: HP(8),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  aboutProfile: {
    height: HP(25),
    top: getHeight(0.5),
    justifyContent: "space-around",
    paddingBottom: getHeight(0.8),
  },
  friendContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  friendsList: {
    backgroundColor: COLORS.red,
    flex: 0.9,
  },
  text: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default styles;
