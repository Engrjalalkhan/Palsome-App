import { Platform, StatusBar, StyleSheet } from "react-native";

import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { heightScreen } from "../MyVideoPlayer/VideoPlayerSwiperAndroid";
import { WidthScreen } from "../TopBar/Dimensions";
const ModalHeight =
  Platform.OS == "android"
    ? heightScreen * 0.9 - StatusBar.currentHeight
    : heightScreen - 44;
const styles = StyleSheet.create({
  container: { flex: 1, marginLeft: WP(2), marginVertical: 10 },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  replyContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profpic: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  commentPic: {
    width: 200,
    margin: 5,
    height: 300,
    alignSelf: "center",
  },
  nameContainer: {
    backgroundColor: COLORS.cocoGray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  flatlistcontainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
    justifyContent: "space-between",
  },
  flatlistInnerCont: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  txtInput: {
    height: 40,
    backgroundColor: COLORS.cocoGray,
    width: "100%",
    borderRadius: 20,
  },
  imgContainer: {
    borderTopWidth: 1,
    borderTopColor: "Grey",
    height: 150,
    width: WidthScreen,
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingLeft: 10,
    flexDirection: "row",
  },

  ModelContanier: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  footer: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    left: 0,
    right: 0,
    height: 50,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: COLORS.cocoGray,
    flexDirection: "row",
  },
  header: {
    borderBottomColor: COLORS.cocoGray,
    // borderBottomWidth: 1,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: getWidth(2.5),
    alignItems: "center",
  },
  upperTab: {
    flexDirection: "row",
    alignItems: "center",
  },
  dp: {
    width: WP(14),
    height: HP(7),
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    color: "#000",
    marginLeft: 10,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.darkGray,
    marginLeft: 10,
    flexGrow: 1,
  },
  time: {
    color: "#000",
    marginLeft: 10,
  },
  img: {
    height: 130,
    width: 100,
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: "center",
  },
  feeling_action: { color: COLORS.darkGray, marginTop: HP(0.5) },
  feeling_value: {
    fontWeight: "bold",
    color: COLORS.tooDarkGrey,
    marginTop: HP(0.5),
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: WP(90),
    height: HP(40),
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
    shadowColor: COLORS.transparent,
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
  content: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    flex: 0.9,
    justifyContent: "space-around",
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
    // backgroundColor: COLORS.black,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGray,

    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: COLORS.cocoGray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    maxWidth: getWidth(70),
    minWidth: getWidth(42),
  },
  containerEdit: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerEdit: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    alignItems: "center",
    height: getHeight(7),
    marginBottom: getHeight(2),
    borderBottomWidth: 0.5,
    marginHorizontal: 10,
  },
  imgEdit: {
    height: getHeight(30),
    width: getWidth(35),
    left: getWidth(4),
    top: getHeight(3),
    borderRadius: 10,
  },
  txtInputEdit: {
    backgroundColor: COLORS.tooLightGrey,
    width: "95%",
    height: "30%",
    maxHeight: getHeight(30),
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.tooLightGrey,
    padding: getWidth(2),
  },
  headerTextEdit: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18,
    left: getWidth(25),
  },
  fullbtnEdit: {
    width: getWidth(20),
    height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  fullbtnTextEdit: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  btnmainEdit: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: getWidth(3),
    marginTop: getHeight(1.5),
  },
  footerTxt: { fontSize: 16, fontWeight: "bold", marginLeft: 20 },
  noMoreTxt: {
    fontSize: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  footerContainer: {
    height: 40,
    justifyContent: "center",
  },
  reactContainer: {
    flexDirection: "row",
    // backgroundColor: "green",
    marginLeft: 14,
    width: getWidth(58),
  },
  userProfileImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  imageInComment: {
    flex: 1,
    width: getWidth(50),
    height: getHeight(18),
    margin: 5,
    alignSelf: "center",
  },
  img: {
    height: WP(30),
    width: WP(30),
    resizeMode: "stretch",
  },
  icons: {
    height: WP(4.5),
    width: WP(4.5),
    resizeMode: "stretch",
  },
  flxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInnerView: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    alignSelf: "center",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  disabledButtonStyle: {
    backgroundColor: "gray",
    opacity: 0.7,
  },
  disabledTextStyle: {
    color: "lightgray",
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 14,
    backgroundColor: "white",
  },
});
export default styles;
