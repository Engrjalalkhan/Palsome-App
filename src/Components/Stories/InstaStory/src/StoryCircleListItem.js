import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { COLORS } from "../../../../Constants/Colors";
import { SITE_URL } from "../../../../Services/Constants";

const StoriesLinearGradColors = [
  "transparent",
  "transparent",
  "rgba(0,0,0,0.6)",
];

const StoryCircleListItem = ({ item, handleStoryItemPress }) => {
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    let storiesIndex = -1;
    const filterStories = item?.items?.filter((item) => !item?.seen);

    if (filterStories?.length > 0) {
      const otherIndex = item?.items?.findIndex(
        (item) => item === filterStories[0]
      );
      storiesIndex = otherIndex;
    } else storiesIndex = 0;

    setCurrentItem(item?.items[storiesIndex]);
  }, []);

  const _handleItemPress = (item) => {
    if (handleStoryItemPress) handleStoryItemPress(item);
  };

  const renderStoryText = () => (
    <Text
      numberOfLines={5}
      style={{
        ...styles.storyText,
        color: currentItem?.colored_pattern?.text_color,
      }}
    >
      {currentItem?.story_text}
    </Text>
  );

  const renderNameText = () => (
    <LinearGradient
      colors={StoriesLinearGradColors}
      style={styles.storiesLinearGrad}
    >
      <Text style={styles.text}>{item?.name}</Text>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => _handleItemPress(item)}
        style={[
          styles.avatarWrapper,
          {
            borderColor: !item?.seen ? COLORS.primary : COLORS.white,
          },
        ]}
      >
        {currentItem?.type == "text" &&
        currentItem?.colored_pattern?.type == "color" ? (
          <LinearGradient
            style={styles.colorPattern}
            colors={[
              currentItem?.colored_pattern?.background_color_1,
              currentItem?.colored_pattern?.background_color_1,
            ]}
          >
            {renderStoryText()}
            {renderNameText()}
          </LinearGradient>
        ) : (
          <ImageBackground
            style={styles.bgImg}
            source={{
              uri:
                currentItem?.preview ||
                `${SITE_URL}frontend/img/${currentItem?.colored_pattern?.background_image}`,
            }}
          >
            {currentItem?.type == "text" && renderStoryText()}
            {renderNameText()}
          </ImageBackground>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default StoryCircleListItem;

const styles = StyleSheet.create({
  avatarWrapper: {
    width: 90,
    height: 150,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2.5,
    overflow: "hidden",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  bgImg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },

  text: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },

  storyText: {
    padding: 10,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },

  colorPattern: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
  },

  // previous
  storiesLinearGrad: {
    padding: 5,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
