import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import ShowReactions from "../ShowReactions";

const CommentReactions = memo(
  ({
    commentsCount,
    likePress,
    replyPress,
    color,
    liked,
    unLikePress,
    reactionID,
    reactionType,
  }) => {
    const { t } = useTranslation();

    const [reactionVisible, setReactionVisible] = useState(false);
    const [height, setHeight] = useState(0);

    const handleLongPress = (e) => {
      setReactionVisible(true);
      setHeight(e.nativeEvent.pageY);
      unLikePress();
    };

    const handleReactionPress = (reactionId) => {
      setReactionVisible(false);
      reactionType(reactionId);
    };

    const handlePress = () => {
      if (liked) {
        unLikePress();
      } else {
        likePress();
      }
    };

    const getReactionText = (reactionId) => {
      switch (reactionId) {
        case 1:
          return t("Like");
        case 2:
          return t("Love");
        case 3:
          return t("Haha");
        case 4:
          return t("Wow");
        case 5:
          return t("Sad");
        case 6:
          return t("Angry");
        default:
          return t("Like");
      }
    };

    return (
      <View style={styles.container}>
        <ShowReactions
          visible={reactionVisible}
          close={() => setReactionVisible(false)}
          function={handleReactionPress}
          height={height}
          reactionType={reactionType}
        />

        <TouchableOpacity
          onLongPress={handleLongPress}
          onPress={handlePress}
          style={styles.commentView}
        >
          <Text style={[styles.txt, { color: liked ? color : "black" }]}>
            {getReactionText(reactionID)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={replyPress} style={styles.commentView}>
          <Text style={[styles.txt, { color: "black" }]}>
            {commentsCount} {t("Reply")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    marginLeft: WP(1.5),
  },
  shareView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: WP(6),
  },
  commentView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txt: {
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: WP(1),
    marginTop: HP(0.5),
  },
  main: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  bar: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logo: {},
  font: {
    fontFamily: "Roboto",
    fontSize: 17,
    fontWeight: "400",
    color: COLORS.lightGray,
  },
  storycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dividerStyle: {
    height: 1,
  },
});

export default CommentReactions;
