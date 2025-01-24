import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";
import { COLORS } from "../../../../../Constants/Colors";

const BuyNSellTextInputComponent = ({
  title,
  keyboardType,
  onTextChange,
  value,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text) => {
    setSearchText(text);
    if (onTextChange) {
      onTextChange(text);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.inputText}>{title}</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange}
        value={value}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default BuyNSellTextInputComponent;

const styles = StyleSheet.create({
  input: {
    height: 65,
    marginVertical: 6,
    padding: 10,
    paddingTop: 20,
    width: getWidth(42),
    borderRadius: 10,

    borderWidth: 1,
    paddingRight: 10,
  },

  searchContainer: {
    // marginHorizontal: 5,
    // width: getWidth(85),
  },
  inputText: {
    top: getHeight(1.5),
    left: 10,
    position: "absolute",
    color: COLORS.primary,
    fontWeight: "500",
    fontSize: 16,
  },
});
