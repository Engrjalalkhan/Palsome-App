import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import MainButton from "../Button";

const MyActivityHeader = memo(({ ButtonText, ButtonPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MainButton
          mode="contained"
          style="large"
          labelStyle="small"
          onPress={() => ButtonPress()}
        >
          {ButtonText}
        </MainButton>
      </View>
      <View style={styles.btnView}>
        <View style={styles.iconView}>
          {ICONS.fontAwesome5("search", COLORS.black, 30 )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: WP(90),
    height: HP(9),
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: { width: "63%", height: 60 },
  btnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "26%",
  },
  btn: {
    backgroundColor: COLORS.primary,
    width: 45,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 30,
  },
  iconView: { justifyContent: "center", alignContent: "center" },
});

export default MyActivityHeader;
