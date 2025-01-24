import { useTranslation } from "react-i18next";
import React, { useState, memo, useEffect } from "react";

import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Image,
} from "react-native";

import { useSelector } from "react-redux";
import { getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import ShowLikeModel from "../ShowLikesModel";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

const ShowLikeCommentShare = memo(
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
    postId,
  }) => {
    const { t } = useTranslation();
    const token = useSelector((state) => state.auth.userToken);
    const [isLikeModell, setIsLikeModell] = useState(false);
    const [allReactions, setAllReactions] = useState(null);

    const fetchPostReactions = async () => {
      const res = await withoutStringiApiCall2({
        route: `reactedusers/popover?item_type=post&id=${postId}`,
        verb: "GET",
        token: token,
      });
      const allReactions = { like, haha, sad, wow, heart, angry };
      setAllReactions(res.payload.data);
    };

    useEffect(() => {
      isLikeModell ? fetchPostReactions() : null;
    }, [isLikeModell]);
    const closelikeModel = () => {
      setIsLikeModell(false);
    };
    const getImageSource = (reactionType) => {
      switch (reactionType) {
        case "like":
          return IMAGES.like_static_fill;
        case "haha":
          return IMAGES.haha_static;
        case "sad":
          return IMAGES.sad_static;
        case "wow":
          return IMAGES.wow_static;
        case "heart":
          return IMAGES.love_static;
        case "angry":
          return IMAGES.angry_static;
        default:
          return null;
      }
    };

    return post_reactions_count > 0 ||
      comments_count !== 0 ||
      shared_post_count !== 0 ? (
      <View style={styles.mainContainer}>
        <ShowLikeModel
          data={allReactions}
          isLikeModell={isLikeModell}
          setIsLikeModell={() => {
            // console.log("its there");
            closelikeModel();
          }}
        />
        <View style={styles.innerContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              // fetchPostReactions();
              setIsLikeModell(true);
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {[
                { type: "like", length: like?.length, id: 1 },
                { type: "haha", length: haha?.length, id: 3 },
                { type: "sad", length: sad?.length, id: 5 },
                { type: "wow", length: wow?.length, id: 4 },
                { type: "heart", length: heart?.length, id: 2 },
                { type: "angry", length: angry?.length, id: 6 },
              ]
                .filter(
                  (item) =>
                    item.length > 0 || reaction?.reaction_type_id == item?.id
                )
                .sort((a, b) => b.length - a.length)
                .map(({ type, length }) => (
                  <Image
                    key={type}
                    style={styles.img}
                    source={getImageSource(type)}
                  />
                ))}
              {post_reactions_count > 0 ? (
                <Text style={{ color: fontColor }}>{post_reactions_count}</Text>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
          <View style={{ flexDirection: "row" }}>
            <TouchableWithoutFeedback onPress={() => pressfunction()}>
              <View>
                {comments_count !== 0 ? (
                  <Text style={{ color: fontColor }}>
                    {comments_count}{" "}
                    {comments_count == 1 ? t("Comment") : t("Comments")}
                  </Text>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <View>
                {shared_post_count !== 0 ? (
                  <Text style={{ marginLeft: 7, color: fontColor }}>
                    {" "}
                    {shared_post_count}{" "}
                    {shared_post_count == 1 ? t("Share") : t("Shares")}
                  </Text>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    ) : null;
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginTop: HP(1),
    marginLeft: WP(1.5),
  },
  mainContainer: {
    height: HP(5.5),
    justifyContent: "center",
    borderBottomWidth: 0.3,
    borderColor: COLORS.white,
  },
  innerContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: getWidth(3),
    paddingBottom: 4,
  },
  img: {
    height: WP(4),
    width: WP(4),
    resizeMode: "stretch",
  },
});

export default ShowLikeCommentShare;
