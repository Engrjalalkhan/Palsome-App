import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ImageBackground,
  Alert,
  RefreshControl,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { WP } from "../../../Utils/Resposive";
import { getWidth } from "../../../Utils/NewResponsive";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import {
  FlatListItemSeparator,
  handleLike,
  handleShare,
  timeDifference,
} from "../../../Components/NewsFeedList/Functions";
import FastImage from "react-native-fast-image";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { ActivityIndicator } from "react-native-paper";
import { HP } from "../../../../Utils/Resposive";
import NewPost from "../../../Components/NewPost";
import ImageGrid from "../../../Components/ImageGridFlatlist";
import { Divider } from "react-native-elements";
import EditPostModal from "../../../Components/EditPostModal";
import { privacy, tags } from "../../../../Utils/PickerDataStatus/privacyData";
import ImageShowModel from "../../../Components/ImageShowModel";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";
import LikeComShare from "../../../Components/LikeComShare";
import FirstComment from "../../../Components/FirstComment";
import PostMenuModel from "../../../Components/NewsFeedList/PostMenuModel";
import ImageShowSingle from "../../../Components/ImageShowSingle";
import ShareModel from "../../../Components/ShareModel";
import ComentModel from "../../../Components/ComentModel";
import { ACTIONS } from "../../../Redux/action-types";
import {
  deletePost,
  editPost,
  fetchComments,
} from "../../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../../Services/Constants";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";

const ShowSingleGroup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData.name);
  const [GroupData, setGroupData] = useState([]);
  const [editPostVisibility, setEditPostVisibility] = useState(false);
  const [isModell, setIsModel] = useState(false);
  const [postID, setPostId] = useState("");
  const [shareModel, setShareModel] = useState(false);
  const [postUid, setpostUid] = useState();
  const [mySolid, setMySolid] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [postIndex, setPostIndex] = useState();
  const [isPictureModell, setIsPictureModell] = useState(false);
  const statusPost = useSelector((state) => state.blackNewsF.statusPosted);
  const editPostId = useSelector((state) => state.blackNewsF.editPostId);
  const editPostLoading = useSelector(
    (state) => state.blackNewsF.editPostLoading
  );
  const [deleteBool, setDeleteBool] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [singlePostData, setSinglePostData] = useState([]);
  const [getNew, setGetNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing2, setRefreshing2] = useState(false);
  const [postText, setPostText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const encid = "bjnkjnkjnjnkjnkj";
  const getGroups = async (getnew) => {
    try {
      const res = await withoutStringiApiCall2({
        route: `groups/${encid}/?page=${currentPage}`,
        verb: "GET",
        token: "token",
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetGroupData ... ", res);
      } else if (res.responseCode == 200) {
        if (getnew == "loadNew") {
          console.log(res.payload.data);
          setGroupData([res.payload.data]);
        } else {
          setGroupData(GroupData.concat(res.payload.data));
        }

        setIsLoading(false);
        setRefreshing2(false);
        setGetNew(false);
        console.log("group data is there", GroupData);
      }
    } catch (e) {
      console.log("Post get Single Group error -- ", e.toString());
    }
  };
  const handleText = (val) => {
    setPostText(val);
  };

  const imageModelShow = (item) => {
    setSinglePostData(item);
    console.log(singlePostData.length);
    setIsPictureModell(!isPictureModell);
    console.log(item);
  };

  const onRefresh = () => {
    setRefreshing2(true);
    setGetNew(true);

    currentPage == 1 ? getGroups("loadNew") : null;
    setCurrentPage(1);
  };

  const getIdAndDispatch = (id, postid, ind) => {
    setIsModel(!isModell);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id }));
  };

  const reactFunc = async (item3, index) => {
    setMySolid(!mySolid);
    // const formData = new FormData();
    // formData.append("post_id", item3.id);
    // formData.append("reaction_id", 1);
    // formData.append("post_type", "post");
    // try {
    //   const res = await withoutStringiApiCall({
    //     route: "post/reaction",
    //     verb: "POST",
    //     token: token,
    //     params: formData,
    //   });
    //   if (res.responseCode !== 200) {
    //     console.log("res !== 200 in react ... ", res);
    //   } else if (res.responseCode == 200) {
    //     console.log("response in react", res);
    //   }
    // } catch (e) {
    //   console.log("saga react error -- ", e.toString());
    // }
  };

  const showConfirmDialog = (id) => {
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this post?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            deleteMyPost(id);
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };
  const deleteMyPost = (id) => {
    setDeleteBool(false);
    dispatch(deletePost({ id, token, setDeleteBool }));
    onRefresh();
  };
  const editMyPost = (id) => {
    setpostUid(id);

    dispatch(editPost({ id, token }));
    setTimeout(() => {
      setEditPostVisibility(true);
    }, 500);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setIsLoading(true);
  };
  const renderFooter = () => {
    return (
      <View>
        <ActivityIndicator animating={isLoading} size="large" color="#000" />
      </View>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getNew == false ? getGroups() : getGroups("loadNew");
  }, [currentPage]);

  useEffect(() => {
    if (statusPost.length !== 0) {
      getGroups([statusPost].concat(GroupData));
    }
  }, [statusPost]);

  useEffect(() => {
    console.log("new post coming");
    onRefresh();
  }, [editPostId, editPostLoading]);

  useEffect(() => {
    return () => {
      console.log("reture");
      setGroupData("");
    };
  }, []);

  return (
    <SafeAreaView style={styles.containerMain}>
      {GroupData[0] ? (
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <View style={{ height: HP(23), backgroundColor: "red" }}>
            <Image
              style={styles.coverPhoto}
              source={
                GroupData[0]?.group?.avatar_full
                  ? { uri: SITE_URL + GroupData[0]?.group?.avatar_full }
                  : IMAGES.blankCover
              }
              resizeMode="stretch"
            />
          </View>

          <View style={styles.userName}>
            <Text style={styles.usertext}>{GroupData[0]?.group?.name}</Text>
          </View>

          <NewPost
            postText={postText}
            onChangeText={(val) => handleText(val)}
          />
          <Divider></Divider>
          <FlatList
            style={styles.friendFlatlist}
            numColumns={1}
            ItemSeparatorComponent={() => FlatListItemSeparator()}
            ListHeaderComponent={() => FlatListItemSeparator()}
            ListFooterComponent={renderFooter}
            onEndReached={() => handleLoadMore()}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
                tintColor={COLORS.primary}
                colors={COLORS.primary}
              />
            }
            data={GroupData[0]?.singlePost?.data}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.container}>
                  <EditPostModal
                    visible={editPostVisibility}
                    goBack={() => setEditPostVisibility(false)}
                  />
                  <TouchableOpacity
                    style={styles.upperTab}
                    onPress={() =>
                      navigation.navigate("ProfileScreen", {
                        userName: item?.user?.name,
                      })
                    }
                  >
                    <View style={styles.imgAndStatus}>
                      <FastImage
                        style={styles.dp}
                        source={
                          item?.user?.profile_picture != null
                            ? {
                                uri: SITE_URL + item?.user?.profile_picture,
                              }
                            : IMAGES.blankDP
                        }
                      />
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.name}>
                            {item?.user?.first_name} {item?.user?.last_name}
                          </Text>
                          {item.post_type === "profile_picture" ? (
                            <Text style={styles.action}>
                              {t("updated profile picture")}
                            </Text>
                          ) : item.post_type === "shared_post" ? (
                            <Text style={styles.action}>
                              {" "}
                              {t("is shared a post")}{" "}
                              {/* {item?.groups[0]?.name
                              ? `to ${item?.groups[0]?.name}`
                              : item?.pages[0]?.name
                              ? `in ${item?.pages[0]?.name}`
                              : item?.rooms[0]?.name
                              ? `in ${item?.rooms[0]?.name}`
                              : item?.shared_user_post?.name
                              ? `with ${item?.shared_user_post?.name}`
                              : null} */}
                            </Text>
                          ) : item.post_map ? (
                            <Text style={styles.action}>
                              is at {item.post_map}
                            </Text>
                          ) : null}
                          {item.feeling_action && (
                            <Text style={styles.action}>
                              {item.feeling_action} {item.feeling_value}
                            </Text>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.time}>
                              {timeDifference(item.created_at)}
                            </Text>
                            {privacy(item.post_privacy)}
                            <Text style={styles.tagTxt}>
                              {tags(item.post_tag_id)}
                            </Text>
                          </View>
                          {userName == item.user.name && (
                            <PostMenuModel
                              showConfirmDialog={showConfirmDialog}
                              editMyPost={editMyPost}
                              item3={item}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {item.post_text != null ? (
                    <View style={{ flex: 0.7, paddingLeft: 16 }}>
                      <Text>{item.post_text}</Text>
                    </View>
                  ) : null}

                  {/* ------------shared---------------------  */}
                  {item.post_type === "shared_post" ? (
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: COLORS.cocoGrey,
                        margin: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.upperTab}
                        onPress={() =>
                          navigation.navigate("ProfileScreen", {
                            userName: item?.post_shared?.user?.name,
                          })
                        }
                      >
                        <View style={styles.imgAndStatus}>
                          <FastImage
                            style={styles.dp}
                            source={
                              item?.post_shared?.user?.profile_picture != null
                                ? {
                                    uri:
                                      SITE_URL +
                                      item?.post_shared?.user?.profile_picture,
                                  }
                                : IMAGES.blankDP
                            }
                          />

                          <View>
                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.name}>
                                {item?.post_shared?.user?.first_name}{" "}
                                {item?.post_shared?.user?.last_name}
                              </Text>
                              {item?.shared_post && (
                                <Text style={styles.action}>
                                  {t("is shared a post")}{" "}
                                  {item?.post_shared?.groups[0]?.name
                                    ? `to ${item?.post_shared?.groups[0]?.name}`
                                    : item?.post_shared?.pages[0]?.name
                                    ? `in ${item?.post_shared?.pages[0]?.name}`
                                    : item?.post_shared?.rooms[0]?.name
                                    ? `in ${item?.post_shared?.rooms[0]?.name}`
                                    : item?.post_shared?.shared_user_post?.name
                                    ? `with ${item?.post_shared?.shared_user_post?.name}`
                                    : null}
                                </Text>
                              )}
                            </View>

                            <View style={{ flexDirection: "row" }}>
                              <Text style={styles.time}>
                                {timeDifference(item?.post_shared?.created_at)}
                              </Text>

                              <Text style={styles.tagTxt}>
                                {tags(item?.post_shared?.post_tag_id)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {item?.post_shared?.post_text != null ? (
                        <View style={styles.psted_text}>
                          <Text>{item?.post_shared?.post_text}</Text>
                        </View>
                      ) : null}
                      {item?.post_shared?.media?.length ? (
                        <View>
                          {imageModelShow && (
                            <ImageGrid
                              data={item?.post_shared?.media}
                              imageModelShow={imageModelShow}
                            />
                          )}
                          {Object.keys(singlePostData).length != 0 ? (
                            item?.post_shared?.media?.length > 1 ? (
                              <ImageShowModel
                                isPictureModell={isPictureModell}
                                singlePostData={singlePostData}
                                setIsPictureModell={setIsPictureModell}
                                setIsModel={setIsModel}
                                setPostId={setPostId}
                                handleLike={handleLike}
                                handleShare={handleShare}
                                isModell={isModell}
                              />
                            ) : (
                              <ImageShowSingle
                                isPictureModell={isPictureModell}
                                singlePostData={singlePostData}
                                setIsPictureModell={setIsPictureModell}
                                setIsModel={setIsModel}
                                setPostId={setPostId}
                                handleLike={handleLike}
                                handleShare={handleShare}
                                isModell={isModell}
                              />
                            )
                          ) : null}
                        </View>
                      ) : null}
                      {item?.post_shared?.pattern ? (
                        <View style={styles.postedView}>
                          {item?.post_shared?.pattern?.type == "image" ? (
                            <ImageBackground
                              source={{
                                uri:
                                  SITE_URL +
                                  "frontend/img/" +
                                  item?.post_shared?.pattern?.background_image,
                              }}
                              resizeMode="cover"
                              style={styles.image}
                            >
                              <Text
                                style={[
                                  styles.text,
                                  { color: item.pattern.text_color },
                                ]}
                              >
                                {item?.post_shared?.post_text}
                              </Text>
                            </ImageBackground>
                          ) : (
                            <LinearGradient
                              colors={[
                                item.pattern.background_color_1,
                                item.pattern.background_color_2,
                              ]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[styles.colorPost]}
                            >
                              <Text
                                style={[
                                  styles.text,
                                  { color: item.pattern.text_color },
                                ]}
                              >
                                {item?.post_shared?.post_text}
                              </Text>
                            </LinearGradient>
                          )}
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                  {/* ------------shared---------------------  */}

                  {item?.media?.length ? (
                    <View>
                      <ImageGrid
                        data={item.media}
                        imageModelShow={imageModelShow}
                      />
                      {Object.keys(singlePostData).length != 0 ? (
                        item?.post_shared?.media?.length > 1 ? (
                          <ImageShowModel
                            isPictureModell={isPictureModell}
                            singlePostData={singlePostData}
                            setIsPictureModell={setIsPictureModell}
                            setIsModel={setIsModel}
                            setPostId={setPostId}
                            handleLike={handleLike}
                            handleShare={handleShare}
                            isModell={isModell}
                          />
                        ) : (
                          <ImageShowSingle
                            isPictureModell={isPictureModell}
                            singlePostData={singlePostData}
                            setIsPictureModell={setIsPictureModell}
                            setIsModel={setIsModel}
                            setPostId={setPostId}
                            handleLike={handleLike}
                            handleShare={handleShare}
                            isModell={isModell}
                          />
                        )
                      ) : null}
                    </View>
                  ) : null}
                  {item.pattern ? (
                    <View
                      style={{
                        marginTop: HP(1),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.pattern.type == "image" ? (
                        <ImageBackground
                          source={{
                            uri:
                              SITE_URL +
                              "frontend/img/" +
                              item.pattern.background_image,
                          }}
                          resizeMode="cover"
                          style={styles.image}
                        >
                          <Text
                            style={[
                              styles.text,
                              { color: item.pattern.text_color },
                            ]}
                          >
                            {item.post_text}
                          </Text>
                        </ImageBackground>
                      ) : (
                        <LinearGradient
                          colors={[
                            item.pattern.background_color_1,
                            item.pattern.background_color_2,
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.colorPost]}
                        >
                          <Text
                            style={[
                              styles.text,
                              { color: item.pattern.text_color },
                            ]}
                          >
                            {item.post_text}
                          </Text>
                        </LinearGradient>
                      )}
                    </View>
                  ) : null}

                  <ShowLikeCommentShare
                    post_reactions_count={item.post_reactions_count}
                    comments_count={item.comments_count}
                    shared_post_count={item.shared_post_count}
                    like={item.like}
                    heart={item.heart}
                    haha={item.haha}
                    wow={item.wow}
                    sad={item.sad}
                    angry={item.angry}
                    fontColor={"black"}
                    pressfunction={() => {
                      setIsModel(!isModell), setPostId(item.encrypted_id);
                    }}
                  />

                  <LikeComShare
                    likePress={() => {
                      setLikeIndex(index);
                      reactFunc(item, index);
                    }}
                    commentPress={() => {
                      getIdAndDispatch(item.encrypted_id, item.id, index);
                      setPostIndex(index);
                    }}
                    sharePress={() => {
                      setShareModel(!shareModel), setPostIndex(index);
                    }}
                    likesCount={item.post_reactions_count}
                    commentsCount={item.comments_count}
                    shareCount={item.shared_post_count}
                    color={COLORS.primary}
                    solid={mySolid && likeIndex == index}
                  />
                  {isModell && postIndex == index ? (
                    <ComentModel
                      isModell={isModell}
                      setIsModel={setIsModel}
                      item3={item}
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

                  {shareModel && postIndex == index ? (
                    <ShareModel
                      shareModel={shareModel}
                      setShareModel={setShareModel}
                      onRefresh={onRefresh}
                      postId={item.id}
                      item={item}
                    />
                  ) : null}

                  <FirstComment data={item.comments} />
                </View>
              );
            }}
          />
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
};

export default ShowSingleGroup;
