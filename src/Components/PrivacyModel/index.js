import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text } from "react-native";
import { View } from "react-native";
import { Modal } from "react-native";
import { StyleSheet } from "react-native";
import { ICONS } from "../../Constants/Icons";
import { WP } from "../../../Utils/Resposive";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../Constants/Colors";

const CustomPickerPrivacy = (props) => {
  const { t } = useTranslation();
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the selected item
    const selectedIndex = props.data.findIndex(
      (item) =>
        item.value === props.selectedValue ||
        item.title === props.selectedValue ||
        item.name === props.selectedValue
    );

    if (selectedIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true,
      });
    }
  }, [props.selectedValue]);

  const renderItem = ({ item, index }) => {
    const isSelected =
      item.value === props.selectedValue ||
      index + 1 === props.selectedValue ||
      item.title === props.selectedValue ||
      item.name === props.selectedValue;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => {
          props.setValueFunc(
            item.value ? item.value : item.title ? item.title : item.name
          );
          props.hideVisible();
        }}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedText,
            !isSelected && { opacity: 0.5 }, // Blur effect for unselected items
          ]}
        >
          {props.categories ? t(item.name) : t(item.title)}
        </Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (_, index) => ({
    length: 50,
    offset: 50 * index,
    index,
  });

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={props.visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 8,
                marginHorizontal: 10,
              }}
              onPress={props.hideVisible}
            >
              {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={props.data}
              keyExtractor={(item, index) => item?.id || index.toString()}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              style={{ marginTop: 30 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    width: "100%",
    height: "40%",
    position: "absolute",
    bottom: 0,
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 42,
  },
  selectedItem: {
    backgroundColor: COLORS.tooLightGrey,
  },
  itemText: {
    color: COLORS.black,
    fontSize: 16,
  },
  selectedText: {
    // color: COLORS.primary,
    fontWeight: "500",
  },
});

export default CustomPickerPrivacy;
