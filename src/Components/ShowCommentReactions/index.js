import React, { useEffect, useState } from "react";
import { memo } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text, Image } from "react-native";
import { View } from "react-native";
import { getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import ShowLikeModel from "../ShowLikesModel";
import { IMAGES } from "../../Constants/Images";
import { useSelector } from "react-redux";
import { withoutStringiApiCall } from "../../Services/Apis";

const ShowCommentReactions = memo(
  ({
    post_reactions_count,
    comments_count,
    shared_post_count,
    pressfunction,
    like,
    haha,
    sad,
    wow,
    heart,
    fontColor,
    angry,
    reaction,
    commentId,
    data_target,
    ifNewsFeed,
  }) => {
    const [isLikeModell, setIsLikeModell] = useState(false);
    const [commentReaction, setCommentReaction] = useState([]);
    const token = useSelector((state) => state.auth.userToken);

    const getReactions = async () => {
      try {
        const res = await withoutStringiApiCall({
          route: `reactedusers/popover?item_type=${data_target}&id=${commentId}`,
          verb: "GET",
          token: token,
        });

        if (res.responseCode === 200) {
          const data = res.payload.data || {};

          const reactions = {
            angry: data.angry_s || [],
            haha: data.hahas || [],
            heart: data.hearts || [],
            like: data.likes || [],
            sad: data.sads || [],
            wow: data.wows || [],
          };

          setCommentReaction(reactions);
        }
      } catch (e) {
        console.error("Error fetching reactions:", e);
      }
    };
    useEffect(() => {
      let isMounted = true;
      if (!ifNewsFeed) {
        if (isMounted) {
          getReactions();
        }
      }
      return () => {
        isMounted = false;
      };
    }, []);

    const closelikeModel = () => {
      setIsLikeModell(false);
    };
    const allReactions = { like, haha, sad, wow, heart, angry };

    return post_reactions_count > 0 ||
      comments_count !== 0 ||
      shared_post_count !== 0 ? (
      <View style={styles.mainContainer}>
        <ShowLikeModel
          data={commentReaction}
          isLikeModell={isLikeModell}
          setIsLikeModell={() => {
            closelikeModel();
          }}
          post_reactions_count={post_reactions_count}
          pressfunction={pressfunction}
        />
        <View style={styles.innerContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsLikeModell(true), getReactions();
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {like?.length > 0 || reaction?.reaction_type_id == 1 ? (
                <Image style={styles.img} source={IMAGES.like_static_fill} />
              ) : null}
              {haha?.length > 0 || reaction?.reaction_type_id == 3 ? (
                <Image style={styles.img} source={IMAGES.haha_static} />
              ) : null}
              {sad?.length > 0 || reaction?.reaction_type_id == 5 ? (
                <Image style={styles.img} source={IMAGES.sad_static} />
              ) : null}
              {wow?.length > 0 || reaction?.reaction_type_id == 4 ? (
                <Image style={styles.img} source={IMAGES.wow_static} />
              ) : null}
              {heart?.length > 0 || reaction?.reaction_type_id == 2 ? (
                <Image style={styles.img} source={IMAGES.love_static} />
              ) : null}
              {angry?.length > 0 || reaction?.reaction_type_id == 6 ? (
                <Image style={styles.img} source={IMAGES.angry_static} />
              ) : null}

              {post_reactions_count > 0 ? (
                <Text style={{ color: fontColor }}>
                  {" "}
                  {post_reactions_count}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }
);

const styles = StyleSheet.create({
  mainContainer: {},
  innerContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: getWidth(2),
  },
  img: {
    marginTop: HP(0.3),
    height: WP(4),
    width: WP(4),
    resizeMode: "stretch",
  },
});

export default ShowCommentReactions;
