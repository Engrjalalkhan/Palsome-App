import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { getWidth } from "../../../../../Utils/NewResponsive";
import { WP } from "../../../../../Utils/Resposive";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../../Constants/Colors";
import { ICONS } from "../../../../Constants/Icons";

const SearchHeader = ({ search, setSearch, onPressCross, placeHolder }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {ICONS.antDesign("arrowleft", null, 35, { fontWeight: "bold" })}
        </TouchableOpacity>
        <View style={styles.inputView}>
          <TextInput
            value={search}
            style={styles.input}
            placeholder={placeHolder}
            placeholderTextColor={COLORS.black}
            // onChangeText={setSearch}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity onPress={onPressCross} style={styles.iconTouch}>
            {ICONS.antDesign("closecircleo", COLORS.black, 23, {
              color: COLORS.red,
            })}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 15,
  },

  input: {
    height: 40,
    paddingLeft: 15,
    width: getWidth(75),
  },
  inputView: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
  },
  iconTouch: {
    justifyContent: "center",
    alignSelf: "center",
    paddingRight: WP(2),
    color: "red",
  },
});
export default SearchHeader;
