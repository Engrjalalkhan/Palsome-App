import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { HP } from "../../../Utils/Resposive";
import { theme } from "../../Core/theme";

function Header(props) {
  return <Text numberOfLines={1} style={styles.header} {...props} />;
}

const styles = StyleSheet.create({
  header: {
    fontSize: HP(2.5),
    color: theme.colors.text,
    fontFamily: "Roboto-Regular",
    fontWeight: "bold",
    paddingVertical: 12,
  },
});
export default React.memo(Header);
