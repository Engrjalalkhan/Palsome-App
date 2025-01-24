import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, TextInput } from "react-native";

import {
  widthPercentageToDP as WP,
  heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const InputField = (props) => {
  const {
    value,
    multiline,
    isRequired,
    placeholder,
    description,
    onChangeText,
    isSearch,
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
          value={value}
          placeholder={placeholder}
        ></TextInput>
        {isSearch && (
          <View style={styles.icon}>
            {ICONS.antDesign("search1", COLORS.black, 24)}
          </View>
        )}
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    width: WP("92%"),
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
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },

  icon: {
    marginLeft: 10,
  },
});
