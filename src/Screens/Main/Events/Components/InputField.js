import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, TextInput } from "react-native";

import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../../Constants/Colors";

const InputField = (props) => {
  const {
    value,
    multiline,
    isRequired,
    placeholder,
    description,
    onChangeText,
  } = props;

  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, description && styles.description]}>
      <View style={styles.iconAndInput}>
        <TextInput
          style={styles.input}
          multiline={multiline}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          placeholderTextColor={COLORS.darkGray}
          onChangeText={(text) => onChangeText(text)}
        >
          {!isFocused && !value ? (
            <Text style={{ color: COLORS.darkGray }}>
              {placeholder}
              {isRequired && <Text style={{ color: "red" }}> *</Text>}
            </Text>
          ) : (
            <Text>{value}</Text>
          )}
        </TextInput>
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    width: WP("85%"),
    height: HP("6%"),
    marginTop: HP(2),
    alignSelf: "center",
    justifyContent: "center",
    borderColor: COLORS.grey,
  },

  description: {
    paddingTop: 15,
    height: HP("15%"),
    justifyContent: "flex-start",
  },

  iconAndInput: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
  },

  input: {
    fontSize: 16,
    paddingLeft: 10,
  },
});
