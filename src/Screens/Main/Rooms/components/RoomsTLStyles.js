import { StyleSheet } from "react-native";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import { HP, WP } from "../../../../../Utils/Resposive";
import { WidthScreen } from "../../../../Components/TopBar/Dimensions";
import { COLORS } from "../../../../Constants/Colors";
import { widthPercentageToDP } from "react-native-responsive-screen";

const RoomsTLStyles = StyleSheet.create({
  container: { flex: 1 },
  coverPhoto: {
    height: HP(22),
    width: WidthScreen,
    borderBottomWidth: 3,
    // borderColor: "black",
  },
  silentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  otherImg: {
    marginTop: HP(1),
    justifyContent: "center",
    alignItems: "center",
  },
  excelStyle: {
    padding: 5,
  },
  upperTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: WP(3.5),
    paddingTop: 5,
    marginTop: 15,
    paddingBottom: 8,
    // backgroundColor: "red",
  },
  noContent: {
    borderWidth: 0.5,
    borderColor: COLORS.cocoGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
  },
  sharePost: {
    borderWidth: 0.5,
    borderColor: COLORS.cocoGrey,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
  },

  imageShare: {
    flex: 1,
    justifyContent: "center",
    // width: WP(92),
    height: HP(45),
  },
  imgAndStatus: {
    flexDirection: "row",
    width: "90%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: WP(100),
    height: HP(45),
  },
  imageShared: {
    flex: 1,
    justifyContent: "center",
    width: WP(92),
    height: HP(45),
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
  dp: {
    borderWidth: 5,
    alignSelf: "center",
    borderRadius: 340,
    width: 150,
    height: 150,
    borderColor: COLORS.white,
  },
  profileCamera: {
    backgroundColor: COLORS.darkGray,
    height: getHeight(6),
    width: getHeight(6),
    borderRadius: 30,
    position: "absolute",
    right: -2,
    justifyContent: "center",
    bottom: getHeight(-1),
  },
  coverCamera: {
    backgroundColor: COLORS.darkGray,
    height: getHeight(6),
    width: getHeight(6),
    borderRadius: 30,
    position: "absolute",
    right: getWidth(2),
    top: getHeight(14),
    justifyContent: "center",
  },
  time: {
    color: COLORS.black,
    marginLeft: 10,
    // marginRight: -10,
  },
  tagTxt: {
    left: getWidth(2.5),
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  name: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: "bold",
    textAlignVertical: "center",
  },

  action: {
    color: COLORS.lightGray,
    marginLeft: 5,
    paddingLeft: 10,
  },
  userName: {
    // height: HP(7),
    paddingTop: 12,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  timelineContainer: { flex: 1, marginVertical: 10 },
  usertext: { fontSize: 24, fontWeight: "bold" },
  btn: {
    // width: getWidth(35),
    // height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: getWidth(4),
    paddingVertical: getWidth(2),
  },
  timelineDp: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
  },
  btncontaner: {
    height: HP(8),
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  iconStyle: {
    color: COLORS.white,
    // fontSize: 18,
    marginRight: getWidth(2),
  },
  aboutProfile: {
    // height: HP(25),
    alignItems: "center",
    justifyContent: "space-around",
    // paddingVertical: getHeight(5),
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
    marginVertical: 10,
  },
  fullbtnText: {
    color: COLORS.white,
    fontSize: 16,
  },
  friendsList: {
    flex: 0.9,
  },
  //   friendContainer: {
  //     justifyContent: "space-between",
  //     paddingHorizontal: getWidth(3),
  //     flexDirection: "row",
  //     marginVertical: 10,
  //     backgroundColor: "red",
  //   },
  fbtn: {
    // width: getWidth(20),
    backgroundColor: COLORS.primary,
    // height: getHeight(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: WP(2),
  },
  friendFlatlist: {
    flex: 1,
    // marginRight: 18,
    marginHorizontal: 10,
  },
  ItemSeparator: {
    height: 13,
  },
  friend: {
    width: getWidth(30),

    // height: getHeight(20),
    marginHorizontal: 5,
  },
  friendImg: {
    height: getHeight(15),
    width: getWidth(30),
    borderRadius: 13,
  },
  text: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",

    marginTop: 5,
  },
  colorPost: {
    flex: 1,
    justifyContent: "center",
    // width: WP(100),
    height: HP(40),
  },
  colorPostShared: {
    flex: 1,
    justifyContent: "center",
    width: WP(94.4),
    height: HP(40),
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
    marginBottom: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  mapaction: {
    color: COLORS.lightGray,
    marginLeft: 5,
    fontWeight: "bold",
  },
  psted_text: { paddingBottom: 7, paddingHorizontal: 16 },

  backButtonWrapper: {
    backgroundColor: COLORS.darkGray,
    height: getHeight(4.5),
    width: getHeight(4.5),
    borderRadius: getHeight(4),
    marginLeft: WP(2),
    marginTop: getHeight(1),
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    right: 10,
  },
  tabBullet: {
    padding: WP(3),
    borderRadius: WP(6),
    marginHorizontal: WP(2.2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tooLightGrey,
  },
  tabBulletTxt: {
    fontWeight: "bold",
    color: "black",
  },
  BulletContainer: { marginVertical: 10 },

  topButtonsCon: {
    position: "absolute",
    top: HP("17%"),
    right: WP("2%"),
    alignSelf: "center",
    flexDirection: "row",
    // marginRight: 20,
  },

  roomNameAndTabsCon: {
    marginVertical: 10,
    // backgroundColor: "rgba(52, 52, 52, alpha)",
  },
  roomNameText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  roomMembersCon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
    alignSelf: "center",
  },
  memberText: { fontSize: 16, marginLeft: 5 },

  memberListheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  membersHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    alignSelf: "center",
  },
  searchMemberCon: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    width: WP(60),
    height: HP(5),
    flexDirection: "row",
    alignItems: "center",
  },
  searchMemberInput: {
    flex: 1,
    padding: 5,
  },
  searchMemberIcon: {
    alignSelf: "center",
    marginLeft: 5,
  },
  myUserDataProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: HP(1),
    marginHorizontal: HP(2),
  },
  myUserDataName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  myUserDataProfileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  sharedPostStyle: {
    width: WidthScreen * 0.86,
    borderWidth: 1,
    borderColor: COLORS.cocoGrey,
  },
  noPostsContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 20,
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
  noRoomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonWrapperContainer: {
    flex: 1,
    width: getWidth(100),
  },
  backContainer: {
    backgroundColor: COLORS.primary,
    height: 65,
    justifyContent: "center",
  },
  onPressBackStyle: {
    justifyContent: "center",
    marginLeft: widthPercentageToDP("4"),
  },
  noRoomText: { fontSize: 23, color: COLORS.grey },

  marginLeft15: { marginLeft: 15 },

  onlyAdminContainer: {
    fontSize: 15,
    fontWeight: "bold",
  },
  noContent: {
    borderWidth: 0.5,
    borderColor: COLORS.cocoGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
  },
});
export default RoomsTLStyles;
