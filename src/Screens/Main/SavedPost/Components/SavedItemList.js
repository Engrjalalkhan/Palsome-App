import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useMemo } from "react";
import { IMAGES } from "../../../../Constants/Images";
import { getWidth } from "../../../../../Utils/NewResponsive";
import { COLORS } from "../../../../Constants/Colors";
import { textBottomTopContainerSavedStyle } from "../../ReminderScreen/Components/RemindersStyle";
import { ICONS } from "../../../../Constants/Icons";

const SavedItemList = ({ item }) => {
  const bottomStyleTop = useMemo(
    () => textBottomTopContainerSavedStyle("top"),
    []
  );
  const bottomStyle = useMemo(
    () => textBottomTopContainerSavedStyle("bottom"),
    []
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES.blankCover}
        style={styles.imageBackground}
      >
        <View style={bottomStyleTop}>
          <Text style={styles.cardNameContainer}>{item?.name}</Text>
          <TouchableOpacity
            style={styles.iconButton}
            // onPress={() => onPressThreeDots(item)}
          >
            {/* {ICONS.entypo("dots-three-vertical", COLORS.white, 24)} */}
          </TouchableOpacity>
        </View>
        <View style={bottomStyle}>
          <View style={styles.bottomNameContainer}>
            <TouchableOpacity>
              <Image source={IMAGES.blankDP} style={styles.userDp} />
            </TouchableOpacity>
            <Text style={[styles.cardNameContainer, { color: "black" }]}>
              Zeeeee
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default React.memo(SavedItemList);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  imageBackground: {
    height: 200,
    width: getWidth(45),
    resizeMode: "contain",
    justifyContent: "center",
  },
  userDp: {
    height: 35,
    width: 35,
    borderRadius: 125,
    marginRight: 8,
  },
  bottomNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  cardNameContainer: {
    color: "white",
    fontWeight: "bold",
    margin: 10,
  },
  iconButton: {
    padding: 5,
    width: 50,
    alignItems: "center",
  },
});
