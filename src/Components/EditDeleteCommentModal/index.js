import React from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import GestureRecognizer from "react-native-swipe-gestures";
import { HP, WP } from "../../../Utils/Resposive";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

const EditDeleteCommentModal = (props) => {
  const { t } = useTranslation();

  const { isEditDellModal, onPressEdit, onPressDell, closePress } = props;

  // const config = {
  //   velocityThreshold: 0.1,
  //   directionalOffsetThreshold: 80,
  //   gestureIsClickThreshold: 1,
  // };

  return (
    // <GestureRecognizer onSwipeDown={closePress} config={config}>
    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={isEditDellModal}
    //     style={{ flex: 1 }}
    //     onRequestClose={closePress}
    //   >
    //     <View style={styles.Contanier}>
    //       <View style={styles.ModelContanier}>
    //         <View
    //           style={{
    //             justifyContent: "flex-end",

    //             flexDirection: "row",
    //             marginTop: 10,
    //             marginRight: 10,
    //           }}
    //         >

    //           <TouchableOpacity onPress={closePress}>
    // {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
    //           </TouchableOpacity>
    //         </View>
    //         <TouchableOpacity
    //           style={styles.buttons}
    //           onPress={
    //             onPressEdit
    //             // onPress={() => {
    //             //   console.log("hit the button");
    //             // }}
    //           }
    //         >
    //            {ICONS.fontAwesome5("edit", COLORS.primary, 30)}
    //           <Text style={styles.textBtn}>Edit</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.buttons} onPress={onPressDell}>
    //            {ICONS.fontAwesome5("trash-alt", COLORS.primary, 30)}
    //           <Text style={styles.textBtn}>Delete</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </Modal>
    // </GestureRecognizer>

    <View style={{ position: "absolute" }}>
      {/* <TouchableOpacity style={styles.singleIcon} onPress={closePress}>
    //   {ICONS.entypo("dots-three-horizontal", COLORS.primary, 24)}
      </TouchableOpacity> */}
      <Modal
        isVisible={isEditDellModal}
        onBackdropPress={closePress}
        onSwipeComplete={closePress}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={closePress}
      >
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 12 }}
            onPress={onPressEdit}
          >
            {ICONS.antDesign("edit", COLORS.blue, 24)}
            <Text style={styles.modalText}>{t("Edit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 12 }}
            onPress={onPressDell}
          >
            {ICONS.antDesign("delete", COLORS.red, 24)}
            <Text style={styles.modalText}>{t("Delete")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  Contanier: {
    flex: 1,
  },
  ModelContanier: {
    backgroundColor: COLORS.white,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderRadius: 10,

    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cocoGray,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,

    width: "100%",
    height: 200,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 150,
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
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGray,
    marginBottom: 5,
  },
  commentAndName: {
    backgroundColor: COLORS.lightGray,
    marginLeft: 10,
    borderRadius: 10,

    width: WP(75),
    paddingVertical: 7,
  },
  name: {
    marginLeft: 18,
    fontWeight: "bold",
  },
  comenttxt: {
    marginLeft: 18,
  },
});
// const styles = StyleSheet.create({
//   Contanier: {
//     flex: 1,
//     // backgroundColor: "rgba(0, 0, 0, 0.2)",
//     justifyContent: "flex-end",
//   },
//   ModelContanier: {
//     backgroundColor: COLORS.white,
//     height: HP(30),

//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderTopRightRadius: 30,
//     borderTopLeftRadius: 30,
//   },
//   img: {
//     height: HP(3),
//     width: WP(6),
//     resizeMode: "stretch",
//   },
//   buttons: {
//     flexDirection: "row",
//     height: 60,
//     alignItems: "center",
//     marginLeft: 20,
//     // backgroundColor: COLORS.red,
//   },
//   reaction: {
//     paddingHorizontal: WP(5),
//     flexDirection: "row",
//   },
//   scene: {
//     flex: 1,
//   },
//   txt: {
//     color: COLORS.primary,
//   },
//   noLabel: {
//     display: "none",
//     height: 0,
//   },
//   bubble: {},
//   img: {
//     height: 20,
//     width: 20,
//   },
//   tabStyle: {
//     backgroundColor: COLORS.primary,
//   },
//   textBtn: {
//     fontSize: 25,
//     marginLeft: 20,
//   },
//   closebuttons: {
//     alignSelf: "center",
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });

export default React.memo(EditDeleteCommentModal);
