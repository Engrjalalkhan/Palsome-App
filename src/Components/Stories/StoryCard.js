import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import sharedStyles from "./sharedStyles";
import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";
import { useSelector } from "react-redux";

const StoriesLinearGradColors = [
  "transparent",
  "transparent",

  "rgba(0,0,0,0.6)",
];

const StoryCard = ({ onPress, source, txt, item }) => {
  const my_storyData = useSelector((state) => state.blackNewsF?.setStories);

  const data = my_storyData[0]?.items;
  const allSeen = data?.every((item) => item?.seen);
  const unseenPreview = data?.find((item) => item?.seen === false)?.preview;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={[
          sharedStyles.storiesBgImg,
          {
            borderColor: allSeen ? "white" : COLORS.primary,
          },
        ]}
        onPress={onPress}
      >
        {item?.type !== "text" && (
          <ImageBackground
            style={{ flex: 1 }}
            source={{ uri: unseenPreview ? unseenPreview : item?.preview }}
          >
            <LinearGradient
              colors={StoriesLinearGradColors}
              style={styles.storiesLinearGrad}
            >
              <Text style={[sharedStyles.userNameStyle]}>{txt}</Text>
            </LinearGradient>
          </ImageBackground>
        )}
        {item?.type == "text" && item?.colored_pattern?.type == "image" ? (
          <ImageBackground
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            source={{
              uri:
                SITE_URL +
                "frontend/img/" +
                item?.colored_pattern?.background_image,
            }}
          >
            <Text
              numberOfLines={5}
              style={{
                color: item?.colored_pattern?.text_color,
                fontWeight: "bold",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {item?.story_text}
            </Text>
            <LinearGradient
              colors={StoriesLinearGradColors}
              style={styles.storiesLinearGrad}
            >
              <Text style={[sharedStyles.userNameStyle]}>{txt}</Text>
            </LinearGradient>
          </ImageBackground>
        ) : null}
        {item?.type == "text" && item?.colored_pattern?.type == "color" ? (
          <LinearGradient
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            colors={[
              item?.colored_pattern?.background_color_1,
              item?.colored_pattern?.background_color_1,
            ]}
          >
            <Text
              numberOfLines={5}
              style={{
                color: item?.colored_pattern?.text_color,
                fontWeight: "bold",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {item?.story_text}
            </Text>
            <LinearGradient
              colors={StoriesLinearGradColors}
              style={styles.storiesLinearGrad}
            >
              <Text style={[sharedStyles.userNameStyle]}>{txt}</Text>
            </LinearGradient>
          </LinearGradient>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  storiesLinearGrad: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    alignItems: "flex-end",
    position: "absolute",
    height: 150,
    width: 90,
    paddingBottom: 10,
  },
});
export default StoryCard;
