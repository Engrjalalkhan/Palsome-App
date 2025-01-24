import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../../../../Constants/Colors";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { WP } from "../../../../../../Utils/Resposive";
import RNPickerSelect from "react-native-picker-select";
const Dropdown = ({ style, text }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = [
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
  ];

  // Define subcategories based on the selected category
  const subcategories = {
    category1: [
      { label: "Subcategory 1.1", value: "subcategory1.1" },
      { label: "Subcategory 1.2", value: "subcategory1.2" },
    ],
    category2: [
      { label: "Subcategory 2.1", value: "subcategory2.1" },
      { label: "Subcategory 2.2", value: "subcategory2.2" },
    ],
  };

  return (
    <View>
      <View style={[styles.IosPicker, style]}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={categories}
          value={selectedCategory}
        />

        {selectedCategory && (
          <RNPickerSelect
            onValueChange={(value) => setSelectedSubcategory(value)}
            items={subcategories[selectedCategory]}
            value={selectedSubcategory}
          />
        )}
      </View>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  IosPicker: {
    justifyContent: "center",
    borderColor: COLORS.cocoGrey,
    borderWidth: 1,
    // marginTop: widthPercentageToDP("5"),
    height: heightPercentageToDP("5.2"),
    width: WP(25.5),
    marginBottom: 10,
    borderRadius: 7,
    margin: 5,
  },
  countryPickerIos: {
    justifyContent: "space-between",
    paddingHorizontal: widthPercentageToDP("4"),
    flexDirection: "row",
    alignItems: "center",
  },
  subtext: {
    fontSize: 11,
  },
});
