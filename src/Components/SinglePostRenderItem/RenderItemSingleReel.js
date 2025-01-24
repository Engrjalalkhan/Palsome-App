import { useTranslation } from "react-i18next";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

import { HP, WP } from "../../../Utils/Resposive";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { timeDifference } from "../NewsFeedList/Functions";
import { privacy, tags } from "../../../Utils/PickerDataStatus/privacyData";
import { getWidth } from "../../../Utils/NewResponsive";
import { ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ShowLikeCommentShare from "../ShowLikeCommentShare";
import LikeComShare from "../LikeComShare";
import Dp from "../NewsFeedList/Dp";
import TitleName from "../NewsFeedList/TitleName";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import ImageGrid from "../ImageGridFlatlist";

import { ACTIONS } from "../../Redux/action-types";

import {
  fetchComments,
  unLikeItem,
  likeItem,
  showGalleryPosts,
} from "../../Redux/actions/NewsFeedActions";

import { useNavigation } from "@react-navigation/native";
import ShareModel from "../ShareModel";
import ComentModel from "../ComentModel";

import ImageShowSingle from "../ImageShowSingle";
import { showImgFunc } from "../../../Utils/Data";
import TaggedPeopleModal from "../TaggedPeopleModal";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";

const RenderItemSingleReel = ({ item, index, data, setData }) => {
  // console.log("RenderItemSinglePost>>>>>", item);
  const [currentItem, setCurrentItem] = useState({});
  const [shareModel, setShareModel] = useState(false);
  const [data_target, setData_target] = useState("");
  const [isModell, setIsModel] = useState(false);
  const [isComments, setIsComments] = useState(false);
  const [taggedPeopleModel, setTaggedPeopleModel] = useState(false);
  const [taggedPeopleList, setTaggedPeopleList] = useState([]);
  const userName = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);
  const [inputFocus, setInputFocus] = useState(false);
  const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);
  const [currentDimensions, setCurrentDimensions] = useState();
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    Dimensions.addEventListener("change", (e) => {
      setCurrentDimensions(e.window);
    });
    return () => Dimensions.remove();
  }, []);

  const fetchApiForGrid = (id) => {
    dispatch(showGalleryPosts({ token, id }));
  };

  const imageModelShow = (item, index, myIndex) => {
    // setImageGridIndex(index);
    // setPostGalleryIndex(myIndex);

    setIsSinglePictureModell(!isSinglePictureModell);
  };

  ///////////////////////////////////////////////////
  const reactChk = (number, bool, reaction) => {
    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };

  const likeItemFunc = async (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");
    console.log(formData);
    dispatch(likeItem({ token, formData }));

    let myArray = [...data];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
        itm.reaction = {
          reaction_type_id: 1,
        };
        itm.post_reactions_count = reactChk(
          itm.post_reactions_count,
          itm.localReacted
        );
        itm.localReacted = true;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setData(myArray);
  };

  const unLikeItemFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...data];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
        if (itm?.reaction.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != userName.id);
          itm.like = like;
        }
        if (itm?.reaction.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != userName.id);
          itm.heart = heart;
        }
        if (itm?.reaction.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != userName.id);
          itm.haha = haha;
        }
        if (itm?.reaction.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != userName.id);
          itm.wow = wow;
        }
        if (itm?.reaction.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != userName.id);
          itm.sad = sad;
        }
        if (itm?.reaction.reaction_type_id == 6) {
          let angry = itm?.angry?.filter((i) => i.user_id != userName.id);
          itm.angry = angry;
        }
        itm.reaction = null;
        itm.localReacted = false;
        itm.post_reactions_count = itm.post_reactions_count - 1;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setData(myArray);
  };

  const reactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...data];
    let myIndex = myArray.indexOf(item3);

    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item3) {
        if (itm?.reaction?.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != userName.id);
          itm.like = like;
        }
        if (itm?.reaction?.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != userName.id);
          itm.heart = heart;
        }
        if (itm?.reaction?.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != userName.id);
          itm.haha = haha;
        }
        if (itm?.reaction?.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != userName.id);
          itm.wow = wow;
        }
        if (itm?.reaction?.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != userName.id);
          itm.sad = sad;
        }
        if (itm?.reaction?.reaction_type_id == 6) {
          let angry = itm?.angry?.filter((i) => i.user_id != userName.id);
          itm.angry = angry;
        }
        itm.post_reactions_count = reactChk(
          itm.post_reactions_count,
          itm.localReacted,
          itm.reaction
        );

        itm.reaction = {
          reaction_type_id: id,
        };

        itm.localReacted = true;
        return itm;
      }
    });

    myArray[myIndex] = myNewItem;
    setData(myArray);
  };

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    // console.log("getIDAndDispatch function called");
    setData_target(data_target);
    setIsModel(!isModell);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(
      fetchComments({ token, id: id, setIsComments, data_target, page: 0 })
    );
  };

  useEffect(() => {
    // console.log("current Item", item);
    setCurrentItem(item);
    // getIdAndDispatch(item.encrypted_id, item.id, 1, "comment");
  }, [item]);

  const onPressTaggedPerson = (item) => {
    console.log(item);
    navigation.navigate("ProfileScreen", {
      userName: item.name,
    });
  };

  const onPressTaggedOthers = (item) => {
    setTaggedPeopleList(item);
    setTaggedPeopleModel(true);
  };

  return currentItem ? (
    <View style={styles.container}>
      {/* {editPostVisibility && item3.encrypted_id == postUid ? (
      <EditPostModal
        visible={editPostVisibility}
        goBack={() => setEditPostVisibility(false)}
      />
    ) : null} */}

      <>
        <View style={styles.upperTab}>
          <View style={styles.imgAndStatus}>
            <Dp
              user={currentItem?.user}
              pages={currentItem?.pages?.[0]}
              groups={currentItem?.groups?.[0]}
              rooms={currentItem?.rooms?.[0]}
              events={currentItem?.events}
            />

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginLeft: 10 }}>
                  <TitleName
                    user={currentItem?.user}
                    pages={currentItem?.pages?.[0]}
                    groups={currentItem?.groups?.[0]}
                    rooms={currentItem?.rooms?.[0]}
                    events={currentItem?.events}
                  />
                  {currentItem?.feeling_action && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {t("is")} {currentItem?.feeling_action}{" "}
                        {currentItem?.feeling_value}{" "}
                        {showImgFunc(currentItem?.feeling_value)}
                      </Text>
                    </>
                  )}
                  {currentItem?.tagged_users?.length > 0 && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {!currentItem.feeling_action && "is "}
                        {t("with")}
                        <Text
                          onPress={() =>
                            onPressTaggedPerson(currentItem?.tagged_users?.[0])
                          }
                          style={{
                            fontWeight: "bold",
                            color: COLORS.primary,
                          }}
                        >
                          {" "}
                          {currentItem?.tagged_users?.[0]?.first_name}{" "}
                          {currentItem?.tagged_users?.[0]?.last_name}{" "}
                        </Text>
                        {currentItem?.tagged_users.length > 1 && (
                          <Text>
                            {t("and")}
                            <Text
                              onPress={() =>
                                onPressTaggedOthers(currentItem?.tagged_users)
                              }
                              style={{
                                fontWeight: "bold",
                                color: COLORS.primary,
                              }}
                            >
                              {" "}
                              {currentItem?.tagged_users.length - 1} other
                              {currentItem?.tagged_users.length - 1 > 1
                                ? "s"
                                : null}
                            </Text>
                          </Text>
                        )}
                      </Text>
                    </>
                  )}
                  {currentItem?.post_type === "profile_picture" ? (
                    <Text style={styles.action} onPress={() => null}>
                      {" "}
                      {t("updated profile picture")}
                    </Text>
                  ) : currentItem?.post_type === "shared_post" ? (
                    <Text style={styles.action}>
                      {" "}
                      {t("has shared a post")}{" "}
                      {currentItem?.groups[0]?.name
                        ? `to ${currentItem?.groups[0]?.name}`
                        : currentItem?.pages[0]?.name
                        ? `in ${currentItem?.pages[0]?.name}`
                        : currentItem?.rooms[0]?.name
                        ? `in ${currentItem?.rooms[0]?.name}`
                        : currentItem?.shared_user_post?.name
                        ? `with ${currentItem?.shared_user_post?.name}`
                        : null}
                    </Text>
                  ) : currentItem?.post_map ? (
                    <Text onPress={() => null} style={styles.mapaction}>
                      {" "}
                      at {currentItem?.post_map}
                    </Text>
                  ) : currentItem?.post_type == "timeline" &&
                    currentItem?.user?.id !== currentItem?.wall_user?.id ? (
                    <>
                      <Text style={styles.action}> {t("posted on ")} </Text>

                      <Text
                        onPress={() =>
                          navigation.navigate("ProfileScreen", {
                            userName: currentItem?.wall_user?.name,
                          })
                        }
                        style={styles.name}
                      >
                        {currentItem?.wall_user?.first_name}{" "}
                        {currentItem?.wall_user?.last_name}
                      </Text>
                      <Text style={styles.action}>{t("'s timeline")}</Text>
                    </>
                  ) : null}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.time}>
                    {timeDifference(currentItem?.created_at)}
                  </Text>
                  {privacy(currentItem?.post_privacy)}
                  <Text style={styles.tagTxt}>
                    {tags(currentItem?.post_tag_id)}
                  </Text>
                </View>

                {/* {userName.name == currentItem.user.name && (
                <PostMenuModel
                  showConfirmDialog={showConfirmDialog}
                  editMyPost={editMyPost}
                  item3={item3}
                />
              )} */}
              </View>
            </View>
          </View>
        </View>
        {currentItem?.post_text != null ? (
          <View style={{ flex: 0.7, paddingHorizontal: 16, paddingBottom: 7 }}>
            {currentItem?.pattern ? null : (
              <NewsFeedText txt={currentItem?.post_text} />
            )}
          </View>
        ) : null}
      </>

      {/* ------------shared start---------------------  */}
      {currentItem?.post_type === "shared_post" ? (
        <View style={styles.sharePost}>
          <View style={styles.upperTab}>
            <Dp
              user={currentItem?.post_shared?.user}
              pages={currentItem?.post_shared?.pages?.[0]}
              groups={currentItem?.post_shared?.groups?.[0]}
              rooms={currentItem?.post_shared?.rooms?.[0]}
              events={currentItem?.post_shared?.events}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={{ marginLeft: 10 }}>
                  <TitleName
                    user={currentItem?.post_shared?.user}
                    pages={currentItem?.post_shared?.pages?.[0]}
                    groups={currentItem?.post_shared?.groups?.[0]}
                    rooms={currentItem?.post_shared?.rooms?.[0]}
                    events={currentItem?.post_shared?.events}
                  />
                  {currentItem?.post_shared?.feeling_action && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        is {currentItem?.post_shared?.feeling_action}{" "}
                        {currentItem?.post_shared?.feeling_value}{" "}
                        {showImgFunc(currentItem?.post_shared?.feeling_value)}
                      </Text>
                    </>
                  )}
                  {/* {console.log("shared", item3?.post_shared)} */}
                  {currentItem?.post_shared?.tagged_users?.length > 0 && (
                    <>
                      <Text style={styles.action} onPress={() => null}>
                        {" "}
                        {!currentItem?.post_shared?.feeling_action && "is "}
                        {t("with")}
                        <Text
                          onPress={() =>
                            onPressTaggedPerson(
                              currentItem?.post_shared?.tagged_users?.[0]
                            )
                          }
                          style={{
                            fontWeight: "bold",
                            color: COLORS.primary,
                          }}
                        >
                          {" "}
                          {
                            currentItem?.post_shared?.tagged_users?.[0]
                              ?.first_name
                          }{" "}
                          {
                            currentItem?.post_shared?.tagged_users?.[0]
                              ?.last_name
                          }{" "}
                        </Text>
                        {currentItem?.post_shared?.tagged_users.length > 1 && (
                          <Text>
                            {t("and")}
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: COLORS.primary,
                              }}
                              onPress={() =>
                                onPressTaggedOthers(
                                  currentItem?.post_shared?.tagged_users
                                )
                              }
                            >
                              {" "}
                              {currentItem?.post_shared?.tagged_users.length -
                                1}{" "}
                              other
                              {currentItem?.post_shared?.tagged_users.length -
                                1 >
                              1
                                ? "s"
                                : null}
                            </Text>
                          </Text>
                        )}
                      </Text>
                    </>
                  )}
                  {currentItem?.post_shared?.post_type === "profile_picture" ? (
                    <Text style={styles.action} onPress={() => null}>
                      {" "}
                      {t("updated profile picture")}
                    </Text>
                  ) : currentItem?.post_shared?.post_type === "shared_post" ? (
                    <Text style={styles.action} onPress={() => null}>
                      {" "}
                      {t("has shared a post")}{" "}
                      {currentItem?.post_shared?.groups[0]?.name
                        ? `to ${currentItem?.post_shared?.groups[0]?.name}`
                        : currentItem?.post_shared?.pages[0]?.name
                        ? `in ${currentItem?.post_shared?.pages[0]?.name}`
                        : currentItem?.post_shared?.rooms[0]?.name
                        ? `in ${currentItem?.post_shared?.rooms[0]?.name}`
                        : currentItem?.post_shared?.shared_user_post?.name
                        ? `with ${currentItem?.post_shared?.shared_user_post?.name}`
                        : null}
                    </Text>
                  ) : currentItem?.post_shared?.post_map ? (
                    <Text onPress={() => null} style={styles.mapaction}>
                      {" "}
                      at {currentItem?.post_shared?.post_map}
                    </Text>
                  ) : currentItem?.post_shared?.post_type == "timeline" &&
                    currentItem?.post_shared?.user?.id !==
                      currentItem?.post_shared?.wall_user?.id ? (
                    <>
                      <Text style={styles.action}> {t("posted on ")} </Text>

                      <Text
                        onPress={() =>
                          navigation.navigate("ProfileScreen", {
                            userName: currentItem?.post_shared?.wall_user?.name,
                          })
                        }
                        style={styles.name}
                      >
                        {currentItem?.post_shared?.wall_user?.first_name}{" "}
                        {currentItem?.post_shared?.wall_user?.last_name}
                      </Text>
                      <Text style={styles.action}>{t("'s timeline")}</Text>
                    </>
                  ) : null}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.time}>
                  {timeDifference(currentItem?.post_shared?.created_at)}
                </Text>
                {privacy(currentItem?.post_privacy)}
                <Text style={styles.tagTxt}>
                  {tags(currentItem?.post_shared?.post_tag_id)}
                </Text>
              </View>
            </View>
          </View>
          {currentItem?.post_shared?.post_text != null ? (
            <View style={{ paddingBottom: 7, paddingHorizontal: 16 }}>
              {currentItem?.post_shared?.pattern ? null : (
                <NewsFeedText txt={currentItem?.post_shared?.post_text} />
              )}
            </View>
          ) : null}
          {currentItem?.post_shared?.media?.length ? (
            <>
              <ImageGrid
                data={currentItem?.post_shared?.media}
                item3={currentItem}
                isModell={isModell}
                setIsModel={setIsModel}
                // setPostId={setPostId}
                // handleLike={handleLike}
                // handleShare={handleShare}
                // onRefresh={onRefresh}
                imageModelShow={(item, imgIndex) =>
                  imageModelShow(currentItem, imgIndex, index)
                }
                fetchApiForGrid={() =>
                  fetchApiForGrid(currentItem?.post_shared?.encrypted_id)
                }
                shared={true}
              />

              <>
                {isSinglePictureModell ? (
                  <ImageShowSingle
                    key={currentItem?.id}
                    isSinglePictureModell={isSinglePictureModell}
                    setIsSinglePictureModell={setIsSinglePictureModell}
                    // singlePostData={singlePostData}
                    index={index}
                    postData={currentItem?.post_shared}
                    currentDimensions={currentDimensions}
                    // onRefresh={onRefresh}
                  />
                ) : null}
              </>
            </>
          ) : null}
          {currentItem?.post_shared?.pattern ? (
            <View style={styles.postedView}>
              {currentItem?.post_shared?.pattern?.type == "image" ? (
                <ImageBackground
                  source={{
                    uri:
                      SITE_URL +
                      "frontend/img/" +
                      currentItem?.post_shared?.pattern?.background_image,
                  }}
                  resizeMode="cover"
                  style={styles.imageShare}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: currentItem?.post_shared?.pattern?.text_color,
                      },
                    ]}
                  >
                    {currentItem?.post_shared?.post_text}
                  </Text>
                </ImageBackground>
              ) : (
                <LinearGradient
                  colors={[
                    currentItem?.post_shared?.pattern?.background_color_1,
                    currentItem?.post_shared?.pattern?.background_color_2,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.colorPost]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: currentItem?.post_shared?.pattern?.text_color,
                      },
                    ]}
                  >
                    {currentItem?.post_shared?.post_text}
                  </Text>
                </LinearGradient>
              )}
            </View>
          ) : null}
        </View>
      ) : null}
      {/* ------------shared end---------------------  */}
      {currentItem?.media?.length ? (
        <>
          <ImageGrid
            data={currentItem?.media}
            item3={currentItem}
            isModell={isModell}
            setIsModel={setIsModel}
            // setPostId={setPostId}
            // handleLike={handleLike}
            // handleShare={handleShare}
            // onRefresh={onRefresh}
            imageModelShow={(item, imgIndex) =>
              imageModelShow(currentItem, imgIndex, index)
            }
            fetchApiForGrid={() => fetchApiForGrid(currentItem?.encrypted_id)}
          />

          {isSinglePictureModell ? (
            <ImageShowSingle
              key={currentItem?.id}
              isSinglePictureModell={isSinglePictureModell}
              setIsSinglePictureModell={setIsSinglePictureModell}
              // singlePostData={singlePostData}
              index={index}
              postData={currentItem}
              currentDimensions={currentDimensions}
              // onRefresh={onRefresh}
            />
          ) : null}
        </>
      ) : null}
      {currentItem?.pattern ? (
        <View
          style={{
            marginTop: HP(1),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentItem?.pattern.type == "image" ? (
            <ImageBackground
              source={{
                uri:
                  SITE_URL +
                  "frontend/img/" +
                  currentItem?.pattern.background_image,
              }}
              resizeMode="cover"
              style={styles.image}
            >
              <Text
                style={[
                  styles.text,
                  { color: currentItem?.pattern.text_color },
                ]}
              >
                {currentItem?.post_text}
              </Text>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={[
                currentItem?.pattern?.background_color_1,
                currentItem?.pattern?.background_color_2,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.colorPost, { width: WP(100) }]}
            >
              <Text
                style={[
                  styles.text,
                  { color: currentItem?.pattern?.text_color },
                ]}
              >
                {currentItem?.post_text}
              </Text>
            </LinearGradient>
          )}
        </View>
      ) : null}
      <ShowLikeCommentShare
        postId={currentItem?.id}
        reaction={currentItem?.reaction}
        post_reactions_count={currentItem?.post_reactions_count}
        comments_count={
          currentItem?.comments_count + currentItem?.replies_count
        }
        shared_post_count={currentItem?.shared_post_count}
        like={currentItem?.like}
        heart={currentItem?.heart}
        haha={currentItem?.haha}
        wow={currentItem?.wow}
        sad={currentItem?.sad}
        angry={currentItem?.angry}
        fontColor={"black"}
        pressfunction={() => {
          getIdAndDispatch(
            currentItem?.encrypted_id,
            currentItem?.id,
            index,
            "comment"
          );
        }}
      />
      <LikeComShare
        likePress={() => {
          likeItemFunc(currentItem, index);
        }}
        unLikePress={() => {
          unLikeItemFunc(currentItem, index);
        }}
        commentPress={() => {
          setInputFocus(true);

          getIdAndDispatch(
            currentItem?.encrypted_id,
            currentItem?.id,
            index,
            "comment"
          );
        }}
        sharePress={() => {
          setShareModel(!shareModel);
          // , setPostIndex(index);
        }}
        likesCount={currentItem?.post_reactions_count}
        commentsCount={currentItem?.comments_count + currentItem?.replies_count}
        shareCount={currentItem?.shared_post_count}
        color={COLORS.primary}
        liked={currentItem?.reaction != null ? true : false}
        reactionID={currentItem?.reaction?.reaction_type_id}
        reactionType={(id) => reactionType(id, currentItem, index)}
      />
      {shareModel ? (
        <ShareModel
          shareModel={shareModel}
          setShareModel={setShareModel}
          // onRefresh={onRefresh}
          postId={currentItem.id}
          item={currentItem}
        />
      ) : null}

      {isModell ? (
        <ComentModel
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          isModell={isModell}
          setIsModel={setIsModel}
          item3={currentItem}
          data_target={data_target}
          encrypted_id={currentItem?.encrypted_id}
          isReplying={isReplying}
          setIsReplying={setIsReplying}
          replyingName={replyingName}
          setReplyingName={setReplyingName}
          commentId={commentId}
          setCommentId={setCommentId}
          fromNewsFeed={fromNewsFeed}
          setFromNewsFeed={setFromNewsFeed}
        />
      ) : null}
      {taggedPeopleModel ? (
        <TaggedPeopleModal
          isVisible={taggedPeopleModel}
          close={() => setTaggedPeopleModel(false)}
          taggedPeopleList={taggedPeopleList}
        />
      ) : null}
    </View>
  ) : null;
};

export default RenderItemSingleReel;
