import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React from "react";
import AppStyle from "../../../../styles/AppStyle";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { getWidth } from "../../../../../Utils/NewResponsive";

const SavedItemFolder = ({
  data,
  onRefresh,
  refreshing,
  onPressItem,
  loadMoreData,
  renderFooter,
  onPressThreeDots,
}) => {
  const renderItems = ({ item }) => {
    return (
      <Pressable style={styles.container} onPress={() => onPressItem(item)}>
        <ImageBackground
          source={IMAGES.blankCover}
          style={styles.imageBackground}
        >
          <View style={styles.postTextContainer}>
            <Text numberOfLines={1} style={styles.postText}>
              {item?.title}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text numberOfLines={1} style={styles.cardNameContainer}>
              {item?.title}
            </Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onPressThreeDots(item)}
            >
              {ICONS.entypo("dots-three-vertical", COLORS.white, 24)}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <View style={AppStyle.flex1}>
      <FlatList
        data={data}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.id}
        onEndReached={loadMoreData}
        refreshing={refreshing}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

export default React.memo(SavedItemFolder);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    flex: 1,
  },
  imageBackground: {
    height: 250,
    width: getWidth(95),
    resizeMode: "contain",
    justifyContent: "center",
  },
  userDp: {
    height: 35,
    width: 35,
    borderRadius: 125,
    marginRight: 8,
  },
  bottomContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 50,
    alignItems: "center",
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
    width: "80%",
  },
  iconButton: {
    padding: 5,
    width: 50,
    alignItems: "center",
  },
  postTextContainer: {
    alignItems: "center",
    height: "40%",
    paddingHorizontal: 30,
  },
  postText: {
    fontSize: 30,
    color: COLORS.secondary,
  },
});
