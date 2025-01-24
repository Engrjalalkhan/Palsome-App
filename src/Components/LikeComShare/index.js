import React, { useState } from "react";
import { memo } from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import ShowReactions from "../ShowReactions";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import { useTranslation } from "react-i18next";

const LikeComShare = memo(
  ({
    shareCount,
    commentsCount,
    likePress,
    commentPress,
    sharePress,
    color,
    liked,
    unLikePress,
    reactionID,
    reactionType,
    hideShare,
  }) => {
    const { t } = useTranslation();

    const [reactionVisible, setReactionVisible] = useState(false);
    const [height, setHeight] = useState(0);

    return (
      <View
        style={[
          styles.container,
          { marginHorizontal: hideShare ? WP(10) : WP(5) },
        ]}
      >
        <ShowReactions
          visible={reactionVisible}
          close={() => setReactionVisible(false)}
          function={() => console.log("Check Reactions")}
          height={height}
          reactionType={reactionType}
        />

        {liked && reactionID == 1 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            {ICONS.fontAwesome5("thumbs-up", color, 23, null, null, true)}
            <Text style={[styles.txt, { color: color }]}>{t("Like")}</Text>
          </TouchableOpacity>
        ) : liked && reactionID == 2 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
              console.log(e);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            <Image
              source={IMAGES.love_static}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[styles.txt, { color: color }]}>{t("Love")}</Text>
          </TouchableOpacity>
        ) : liked && reactionID == 3 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            <Image
              source={IMAGES.haha_static}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[styles.txt, { color: color }]}>{t("Haha")}</Text>
          </TouchableOpacity>
        ) : liked && reactionID == 4 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
              console.log(e);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            <Image
              source={IMAGES.wow_static}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[styles.txt, { color: color }]}> {t("Wow")}</Text>
          </TouchableOpacity>
        ) : liked && reactionID == 5 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            <Image
              source={IMAGES.sad_static}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[styles.txt, { color: color }]}> {t("Sad")}</Text>
          </TouchableOpacity>
        ) : liked && reactionID == 6 ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
              console.log(e);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            <Image
              source={IMAGES.angry_static}
              style={{ height: 25, width: 25 }}
            />
            <Text style={[styles.txt, { color: color }]}>{t("Angry")}</Text>
          </TouchableOpacity>
        ) : liked && !reactionID ? (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
            }}
            onPress={(e) => unLikePress()}
            style={styles.commentView}
          >
            {ICONS.fontAwesome5("thumbs-up", color, 23, null, null, true)}
            <Text style={[styles.txt, { color: color }]}>{t("Like")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onLongPress={(e) => {
              setReactionVisible(!reactionVisible);
              setHeight(e.nativeEvent.pageY);
            }}
            onPress={(e) => likePress()}
            style={styles.commentView}
          >
            {ICONS.fontAwesome5("thumbs-up", color, 23)}
            <Text style={[styles.txt, { color: color }]}>{t("Like")}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={commentPress} style={styles.commentView}>
          {ICONS.fontAwesome5("comment", color, 23)}
          <Text style={[styles.txt, { color: color }]}>{t("Comment")}</Text>
        </TouchableOpacity>
        {hideShare ? null : (
          <TouchableOpacity onPress={sharePress} style={styles.shareView}>
            {ICONS.fontAwesome5("share", color, 23)}
            <Text style={[styles.txt, { color: color }]}> {t("Share")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: HP(1),
  },
  shareView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txt: {
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
    color: COLORS.darkGray,
  },
  storycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dividerStyle: {
    height: 1,
  },
});

export default LikeComShare;
