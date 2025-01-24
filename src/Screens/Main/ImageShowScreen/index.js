import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import GallerySwiper from "react-native-gallery-swiper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { IMAGES } from "../../../Constants/Images";
import {
  HeightScreen,
  WidthScreen,
} from "../../../Components/TopBar/Dimensions";

const ImageShowScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      {route?.params?.deleteIcon && (
        <AntDesign
          onPress={route?.params?.deleteImage}
          name="delete"
          size={30}
          color={COLORS.primary}
          style={styles.deleteIcon}
        />
      )}
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => navigation.goBack()}
      >
        {ICONS.materialIcons("cancel", COLORS.lightGray, 40)}
      </TouchableOpacity>
      <GallerySwiper
        images={[
          route.params.url
            ? { uri: route.params.url }
            : { source: IMAGES.blankCover },
        ]}
        onSwipeDownReleased={() => navigation.goBack()}
        onSwipeUpReleased={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
  },
  backContainer: {
    position: "absolute",
    right: 15,
    top: 40,
    zIndex: 1000,
  },
  deleteIcon: {
    position: "absolute",
    right: WidthScreen * 0.18,
    top: HeightScreen * 0.05,
    zIndex: 1000,
  },
});

export default ImageShowScreen;
