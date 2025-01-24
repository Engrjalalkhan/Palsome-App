import { Text } from "native-base";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { HP, WP } from "../../../../../../Utils/Resposive";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const AndroidPickerModel = ({
  data,
  isModal,
  setIsModal,
  selectedItem,
  categories,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          backdropOpacity={0.3}
          isVisible={isModal}
          onBackdropPress={() => setIsModal(false)}
          onSwipeComplete={() => setIsModal(false)}
          swipeDirection={["down"]}
          style={styles.bottomView}
          onRequestClose={() => setIsModal(false)}
        >
          <ScrollView style={styles.contentContainerStyle}>
            {data &&
              data.map((item, key) => {
                return (
                  <TouchableOpacity
                    style={{ backgroundColor: "white" }}
                    onPress={() => {
                      selectedItem(item);
                    }}
                  >
                    <View
                      style={{
                        alignContent: "flex-start",
                        margin: 15,
                      }}
                    >
                      <Text style={{ color: "black" }}>
                        {categories ? t(item?.name) : t(item?.title)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
          {/* )}
          /> */}
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center" },
  bottomView: {
    justifyContent: "flex-end",
    // justifyContent: "center",
    backgroundColor: "white",
    margin: HP(5),
    flex: 1,
    padding: HP(1),
    paddingLeft: WP(1),
    marginBottom: HP(10),
  },
  contentContainerStyle: {
    // paddingLeft: WP(8),
    // paddingTop: HP(5),
    // borderWidth: 1,
    // borderRadius: 20,
    // marginBottom: HP(20),
  },
});
export default AndroidPickerModel;
