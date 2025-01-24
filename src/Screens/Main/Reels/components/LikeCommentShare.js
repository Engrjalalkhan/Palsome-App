import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { HP } from "../../../../../Utils/Resposive";
import { IMAGES } from "../../../../Constants/Images";

const LikeCommentShare = ({
  comments_count,
  post_reactions_count,
  shared_post_count,
  reactToggleFn,
  isToggledByUser,
  reacted,
  onCommentPress,
  onSharePress,
  item,
  count,
}) => {
  const [liked, setLiked] = useState(false); // Set initial value to false
  const [likePosts, setLikedPost] = useState(post_reactions_count);

  // console.log("Item=======>>>>>>", setPlay(true));

  const onPressLike = () => {
    if (liked) {
      setLikedPost((post_reactions_count) =>
        1 ? post_reactions_count - 1 : 0
      );
      setLiked(!liked);
      reactToggleFn();
      return;
    } else {
      setLikedPost(post_reactions_count + 1);
      setLiked(!liked);
      reactToggleFn();
      return;
    }
  };
  useEffect(() => {
    setLiked(false);
    if (item?.reaction == null) {
    } else {
      setLiked(true);
    }
  }, []);
  const memoizedComponent = useMemo(
    () => (
      <View style={styles.container}>
        <View style={styles.shadowStyle}>
          <TouchableOpacity onPress={onPressLike}>
            <Image
              source={liked ? IMAGES.clipLike : IMAGES.clipUnlike}
              style={styles.reactionStyle}
            />
            <Text style={styles.text}>{likePosts}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCommentPress}>
            <Image source={IMAGES.clipComment} style={styles.reactionStyle} />
            <Text style={styles.text}>{comments_count}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSharePress}>
            <Image source={IMAGES.clipShare} style={styles.reactionStyle} />
            <Text style={styles.text}>{shared_post_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [liked, likePosts, comments_count, shared_post_count]
  );

  return memoizedComponent;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    right: 15,
    bottom: 165,
    justifyContent: "center",
    alignItems: "center",
    height: HP(25),
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  reactionStyle: {
    height: 35,
    width: 35,
    resizeMode: "contain",
  },
  shadowStyle: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 40,
    backgroundColor: "rgba(60, 60, 60, 0)",
  },
});

export default LikeCommentShare;
