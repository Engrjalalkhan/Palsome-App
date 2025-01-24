import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../../../Constants/Colors";

const InputField = ({
  placeholder,
  search,
  description,
  value,
  onChangeText,
  inputRef,
  multiline,
}) => {
  return (
    <View style={[styles.container, description && styles.description]}>
      <View style={[styles.iconAndInput, { alignItems: "center" }]}>
        {search && (
          <View
          // style={{ margin: WP(3) }}
          >
            <FontAwesome name="search" color="grey" size={16} />
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.darkGray}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          autoCapitalize="none"
          autoCorrect={false}
          ref={inputRef}
          multiline={multiline}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.grey,
    borderWidth: 0.6,
    borderRadius: 5,
    width: WP("90%"),
    height: HP("6%"),
    alignSelf: "center",
    justifyContent: "center",
  },
  iconAndInput: { flexDirection: "row", marginHorizontal: 10 },
  input: {
    flex: 1,
    // backgroundColor: COLORS.red,
    fontSize: 16,
    paddingLeft: 10,
  },
  description: {
    height: HP("20%"),
    paddingTop: 15,
    justifyContent: "flex-start",
  },
});
export default InputField;
