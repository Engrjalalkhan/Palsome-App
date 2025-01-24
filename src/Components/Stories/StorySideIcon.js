import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";

const StorySideIcon = ({ source }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.storySideAddBox}
      onPress={() => navigation.navigate("PostStory")}
    >
      <View style={{ height: 40, width: 40 }}>
        <Image
          source={source}
          style={{ height: 40, width: 40, borderRadius: 40 }}
        />
        <Image
          resizeMode="cover"
          style={styles.storySideAddBoxAddImg}
          source={IMAGES.bluePlusCircle}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storySideAddBox: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    position: "absolute",
    zIndex: 100,
    top: "35%",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  storySideAddBoxAddImg: {
    height: 15,
    width: 15,
    borderRadius: 15,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
export default StorySideIcon;
