import { StyleSheet } from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { WidthScreen } from "../TopBar/Dimensions";

const styles = StyleSheet.create({
  header: {
    borderBottomColor: COLORS.cocoGrey,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  content: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  textInput: {
    height: 40,
    top: 5,
    width: getWidth(40),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.tooLightGrey,
  },
  text: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  mytext: { fontSize: 16, fontWeight: "bold", maxWidth: WP(38) },
  box: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    height: getHeight(7),
    borderBottomWidth: 0.5,
    justifyContent: "space-between",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  txtInput: {
    minHeight: getHeight(5),
    backgroundColor: COLORS.cocoGrey,
    width: "100%",
    maxHeight: getHeight(20),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    padding: getWidth(2),
  },
  txtInput2: {
    minHeight: getHeight(5),
    backgroundColor: COLORS.cocoGrey,
    width: "100%",
    top: 5,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: WP(2),
  },
  pickerView: {
    borderColor: "black",
    justifyContent: "center",
    alignSelf: "center",
    width: WP(90),
    height: HP(8),
    borderRadius: 5,
    borderColor: "red",
    marginTop: HP(5),
  },

  picker: {
    backgroundColor: "Gray",
    color: "blue",
    fontFamily: "Ebrima",
    fontSize: 17,
    color: COLORS.primary,
  },
  iosPicker: {
    height: 50,
    flexDirection: "row",
    paddingHorizontal: WP(1),
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: HP(1),
  },
  btn: {
    // width: getWidth(40),
    // height: getHeight(7),
    paddingHorizontal: getHeight(3),
    paddingVertical: getHeight(1.5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: getHeight(2),
    fontWeight: "bold",
  },
  btnmain: {
    flexDirection: "row",
    marginBottom: HP(3.5),
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  checkbox: {
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  headingText: {
    padding: 8,
  },
  friendsDp: {
    height: WP(10),
    width: WP(10),
    marginHorizontal: WP(2),
  },
  listEmptyBox: {
    flex: 1,

    height: getHeight(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
export default styles;
