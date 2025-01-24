import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import { privacy } from "../../../../Utils/PickerDataStatus/privacyData";
import { HP, WP } from "../../../../Utils/Resposive";
import LikeComShare from "../../../Components/LikeComShare";
import {
  FlatListItemSeparator,
  timeDifference,
} from "../../../Components/NewsFeedList/Functions";
import ShowLikeCommentShare from "../../../Components/ShowLikeCommentShare";

import { useScrollToTop } from "@react-navigation/native";
import ComentModel from "../../../Components/ComentModel";
import ShareModel from "../../../Components/ShareModel";
import { ACTIONS } from "../../../Redux/action-types";
import {
  deletePost,
  editPost,
  fetchComments,
  fetchVideos,
  likeItem,
  unLikeItem,
} from "../../../Redux/actions/NewsFeedActions";

import Dp from "../../../Components/NewsFeedList/Dp";
import NewsFeedText from "../../../Components/NewsFeedList/NewsFeedText";
import TitleName from "../../../Components/NewsFeedList/TitleName";
import { COLORS } from "../../../Constants/Colors";
import { SITE_URL } from "../../../Services/Constants";
import AndroidVideoPlayer from "./AndroidVideoPlayer";

const VideoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const videos = useSelector((state) => state?.blackNewsF?.videos);
  const token = useSelector((state) => state?.auth?.userToken);
  const userName = useSelector((state) => state?.auth?.userData);

  const [noPostText, setNoPostText] = useState("");
  const [apiError, setApiError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postIndex, setPostIndex] = useState();
  const [isModell, setIsModel] = useState(false);
  const [shareModel, setShareModel] = useState(false);
  const [showOther, setShowOther] = useState(true);
  const [data_target, setData_target] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [myIndex, setMyIndex] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [cleanCache, setCleanCache] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [currentCommentItem, setCommentCurrentItem] = useState();
  const [fromNewsFeed, setFromNewsFeed] = useState(false);

  const settingData = () => {
    setIsLoading(true);
    setData(videos);
    setIsLoading(false);
  };

  useEffect(() => {
    settingData();
  }, []);

  const getIdAndDispatch = (id, postid, ind, data_target) => {
    setIsModel(!isModell);
    setData_target(data_target);
    dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
    dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
  };

  const reactChk = (number, bool, reaction) => {
    if (bool === true || reaction !== null) {
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
    dispatch(likeItem({ token, formData }));

    let myArray = [...videos];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm === item3) {
        itm.reaction = {
          reaction_type_id: 1,
        };
        itm.post_reactions_count = reactChk(
          itm.post_reactions_count + 1,
          itm.localReacted,
          itm.reaction
        );
        itm.localReacted = true;
        return itm;
      }
      return false;
    });
    if (myNewItem) {
      myArray[myIndex] = myNewItem;
      setData(myArray);
    }
  };

  const unLikeItemFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...videos];
    let myIndex = myArray.indexOf(item3);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm === item3) {
        if (itm?.reaction?.reaction_type_id === 1) {
          let like = itm?.like?.filter((i) => i.user_id !== userName.id);
          itm.like = like;
        }
        if (itm?.reaction?.reaction_type_id === 2) {
          let heart = itm?.heart?.filter((i) => i.user_id !== userName.id);
          itm.heart = heart;
        }
        if (itm?.reaction?.reaction_type_id === 3) {
          let haha = itm?.haha?.filter((i) => i.user_id !== userName.id);
          itm.haha = haha;
        }
        if (itm?.reaction?.reaction_type_id === 4) {
          let wow = itm?.wow?.filter((i) => i.user_id !== userName.id);
          itm.wow = wow;
        }
        if (itm?.reaction?.reaction_type_id === 5) {
          let sad = itm?.sad?.filter((i) => i.user_id !== userName.id);
          itm.sad = sad;
        }
        if (itm?.reaction?.reaction_type_id === 6) {
          let angry = itm?.angry?.filter((i) => i.user_id !== userName.id);
          itm.angry = angry;
        }
        itm.reaction = null;
        itm.localReacted = false;
        itm.post_reactions_count = itm.post_reactions_count - 1;
        return itm;
      }
      return false;
    });
    if (myNewItem) {
      myArray[myIndex] = myNewItem;
      setData(myArray);
    }
  };

  const reactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3.id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...videos];
    let myIndex = myArray.indexOf(item3);

    let myNewItem = myArray.find((itm, ind) => {
      if (itm === item3) {
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
      return false;
    });

    if (myNewItem) {
      myArray[myIndex] = myNewItem;
      setData(myArray);
    }
  };

  const handleLoadMore = (pageLoad) => {
    dispatch(
      fetchVideos({
        token,
        page: pageLoad,
        setIsLoading: setIsLoading,
        setApiError: setApiError,
      })
    );
    setCurrentPage(pageLoad);
  };

  const onScroll = () => {
    setCleanCache(!cleanCache);
  };
  const onRefresh = (pageLoad) => {
    setRefreshing(true);
    dispatch(
      fetchVideos({
        token,
        page: pageLoad,
        setIsLoading: setIsLoading,
        setApiError: setApiError,
        navigation,
      })
    );
    setRefreshing(false);
  };

  const flatlistRef = React.useRef();
  useScrollToTop(flatlistRef);

  useEffect(() => {
    if (apiError?.message) {
      setNoPostText(apiError?.message);
    }
  }, [apiError]);

  const renderFooter = () => {
    return (
      <>
        <View>
          {!isLoading && noMore ? (
            <View style={styles.noPostsContainer}>
              <Text style={{ fontSize: 23, color: "grey" }}>
                No more Videos
              </Text>
            </View>
          ) : (
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="#DF4B38"
            />
          )}
        </View>
      </>
    );
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setMyIndex(changed?.[0]?.key);
    viewableItems.forEach(({ item, isViewable }) => {
      const { videoRef } = item;
      if (videoRef) {
        isViewable ? videoRef.current.buffer() : videoRef.current.pauseBuffer();
      }
    });
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  return (
    <SafeAreaView style={styles.container}>
      {showOther && (
        <>
          <View style={styles.header1}>
            <Text style={styles.text1}>{t("Videos")}</Text>
          </View>
          <Divider />
        </>
      )}
      {data?.length > 0 ? (
        <>
          <FlatList
            data={videos ?? []}
            extraData={cleanCache}
            onScroll={onScroll}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewabilityConfig}
            ref={flatlistRef}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={10}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            numColumns={1}
            ItemSeparatorComponent={() => FlatListItemSeparator()}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh(currentPage + 1)}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            ListEmptyComponent={
              <>
                {isLoading ? (
                  <View
                    style={{
                      alignSelf: "center",
                      marginTop: HP(40),
                    }}
                  >
                    <ActivityIndicator
                      animating={isLoading}
                      size="large"
                      color={COLORS.primary}
                    />
                  </View>
                ) : (
                  <>
                    {noPostText.length ? (
                      <View style={styles.noPostsContainer}>
                        <Text style={{ fontSize: 23, color: "Gray" }}>
                          {noPostText}
                        </Text>
                      </View>
                    ) : null}
                  </>
                )}
              </>
            }
            ListFooterComponent={renderFooter}
            onEndReached={() => handleLoadMore(currentPage + 1)}
            onEndReachedThreshold={0.5}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.container]}>
                  {showOther && (
                    <>
                      <View style={styles.upperTab}>
                        <View style={styles.imgAndStatus}>
                          <Dp
                            user={item?.user}
                            pages={item?.pages?.[0]}
                            groups={item?.groups?.[0]}
                            rooms={item?.rooms?.[0]}
                            events={item?.events}
                          />
                          <View>
                            <TitleName
                              user={item?.user}
                              pages={item?.pages?.[0]}
                              groups={item?.groups?.[0]}
                              rooms={item?.rooms?.[0]}
                              events={item?.events}
                            />

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text style={styles.time}>
                                {timeDifference(item?.created_at)}
                              </Text>
                              {privacy(item?.post_privacy)}
                            </View>
                          </View>
                        </View>
                        {/* {userName?.name == item?.user?.name && (
                      <PostMenuModel
                        showConfirmDialog={showConfirmDialog}
                        editMyPost={editMyPost}
                        item3={item}
                      />
                    )} */}
                      </View>
                      {item?.post_text != null ? (
                        <View
                          style={{
                            flex: 0.7,
                            paddingHorizontal: 17,
                            paddingBottom: 7,
                            paddingLeft: 5,
                          }}
                        >
                          {/* <Text>{item.post_text}</Text> */}
                          <NewsFeedText txt={item?.post_text} />
                        </View>
                      ) : null}
                    </>
                  )}

                  <View style={{ flex: 1 }}>
                    {Platform.OS == "android" ? (
                      <>
                        {item?.media?.[0]?.stream_path240 != null ? (
                          <>
                            {/* <MyVideoPlayer
                            uri={
                              "https://www.palsome.com/converted_videos/" +
                              item?.media[0]?.stream_path240
                            }
                            poster={
                              "https://www.palsome.com/converted_videos/thumbnails/" +
                              item?.media[0]?.thumb_path
                            }
                            handleFullScreen={() => setShowOther(!showOther)}
                          /> */}

                            <AndroidVideoPlayer
                              source={{
                                uri:
                                  SITE_URL +
                                  "converted_videos/" +
                                  item?.media[0]?.stream_path240,
                              }}
                              style={{ height: 300, backgroundColor: "black" }}
                              controls={true}
                              resizeMode={"contain"}
                              poster={
                                SITE_URL +
                                "converted_videos/thumbnails/" +
                                item?.media[0]?.thumb_path
                              }
                              myIndex={myIndex}
                              index={index}

                              // paused={
                              //   autoPlayVideos
                              //     ? autoPlayVideos && myIndex == index && focused
                              //       ? false
                              //       : true
                              //     : myIndex == index && focused
                              //     ? false
                              //     : false
                              // }
                            />
                          </>
                        ) : item?.media?.[0]?.stream_path720 != null ? (
                          <>
                            {/* <MyVideoPlayer
                            uri={
                              "https://www.palsome.com/converted_videos/" +
                              item?.media[0]?.stream_path720
                            }
                            poster={
                              "https://www.palsome.com/converted_videos/thumbnails/" +
                              item?.media[0]?.thumb_path
                            }
                            handleFullScreen={() => setShowOther(!showOther)}
                          /> */}
                            <AndroidVideoPlayer
                              source={{
                                uri:
                                  SITE_URL +
                                  "converted_videos/" +
                                  item?.media[0]?.stream_path720,
                              }}
                              style={{ height: 300, backgroundColor: "black" }}
                              controls={true}
                              resizeMode={"contain"}
                              poster={
                                SITE_URL +
                                "converted_videos/thumbnails/" +
                                item?.media[0]?.thumb_path
                              }
                              myIndex={myIndex}
                              index={index}
                            />
                          </>
                        ) : (
                          <Text>Video Not Found</Text>
                        )}
                      </>
                    ) : (
                      <>
                        {item?.media?.[0]?.stream_path240 != null ? (
                          // <IosVideoPLayer
                          //   resizeMode={"contain"}
                          //   style={{
                          //     height: getHeight(45),
                          //   }}
                          //   source={getMediaMeta(item?.media[0]?.stream_path240)}
                          //   automaticallyWaitsToMinimizeStalling={true}
                          //   controls={true}
                          //   poster={
                          //     SITE_URL +
                          //     "converted_videos/thumbnails/" +
                          //     item?.media[0]?.thumb_path
                          //   }
                          // />
                          <AndroidVideoPlayer
                            source={{
                              uri:
                                SITE_URL +
                                "converted_videos/" +
                                item?.media[0]?.stream_path240,
                            }}
                            style={{
                              height: getHeight(45),
                              backgroundColor: "black",
                            }}
                            controls={true}
                            resizeMode={"contain"}
                            poster={
                              SITE_URL +
                              "converted_videos/thumbnails/" +
                              item?.media[0]?.thumb_path
                            }
                            myIndex={myIndex}
                            index={index}
                          />
                        ) : item?.media?.[0]?.stream_path720 != null ? (
                          // <IosVideoPLayer
                          //   style={{
                          //     height: getHeight(45),
                          //   }}
                          //   source={getMediaMeta(item?.media[0]?.stream_path720)}
                          //   automaticallyWaitsToMinimizeStalling={true}
                          //   controls={true}
                          //   poster={
                          //     SITE_URL +
                          //     "converted_videos/thumbnails/" +
                          //     item?.media[0]?.thumb_path
                          //   }
                          // />
                          <AndroidVideoPlayer
                            source={{
                              uri:
                                SITE_URL +
                                "converted_videos/" +
                                item?.media[0]?.stream_path720,
                            }}
                            style={{
                              height: getHeight(45),
                              backgroundColor: "black",
                            }}
                            controls={true}
                            resizeMode={"contain"}
                            poster={
                              SITE_URL +
                              "converted_videos/thumbnails/" +
                              item?.media[0]?.thumb_path
                            }
                            myIndex={myIndex}
                            index={index}
                          />
                        ) : (
                          <Text>Video Not Found</Text>
                        )}
                      </>
                    )}
                  </View>
                  {/* ----------------------------------------like and reactions ------------------------------ */}
                  <View style={styles.likeContainer}>
                    <ShowLikeCommentShare
                      postId={item?.id}
                      reaction={item?.reaction}
                      post_reactions_count={item?.post_reactions_count}
                      comments_count={
                        item?.comments_count + item?.replies_count
                      }
                      shared_post_count={item?.shared_post_count}
                      like={item?.like}
                      heart={item?.heart}
                      haha={item?.haha}
                      wow={item?.wow}
                      sad={item?.sad}
                      angry={item?.angry}
                      fontColor={"black"}
                      pressfunction={() => {
                        setIsModel(!isModell),
                          getIdAndDispatch(
                            item?.encrypted_id,
                            item?.id,
                            index,
                            "comment"
                          );
                        setPostIndex(index);
                        // setPostId(item.encrypted_id);
                      }}
                    />
                    <LikeComShare
                      likePress={() => {
                        likeItemFunc(item, index);
                      }}
                      unLikePress={() => {
                        unLikeItemFunc(item, index);
                      }}
                      commentPress={() => {
                        setInputFocus(true);

                        getIdAndDispatch(
                          item?.encrypted_id,
                          item?.id,
                          index,
                          "comment"
                        );
                        setPostIndex(index);
                      }}
                      sharePress={() => {
                        setShareModel(!shareModel), setPostIndex(index);
                      }}
                      likesCount={item?.post_reactions_count}
                      commentsCount={item?.comments_count + item?.replies_count}
                      shareCount={item?.shared_post_count}
                      color={COLORS.primary}
                      liked={item?.reaction != null ? true : false}
                      reactionID={item?.reaction?.reaction_type_id}
                      reactionType={(id) => reactionType(id, item, index)}
                    />
                  </View>
                  {isModell && postIndex == index ? (
                    <ComentModel
                      inputFocus={inputFocus}
                      setInputFocus={setInputFocus}
                      isModell={isModell}
                      setIsModel={setIsModel}
                      item3={item}
                      data_target={data_target}
                      encrypted_id={item?.encrypted_id}
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
                      postId={item?.id}
                      item={item}
                    />
                  ) : null}
                </View>
              );
            }}
            keyExtractor={(item, index) => index?.toString()}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};
export default VideoScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  likeContainer: {
    marginBottom: 5,
  },
  header1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  text1: { fontSize: 24, fontWeight: "bold" },
  leftIcon: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-around",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  tagTxt: {
    left: getWidth(2.5),
    textDecorationLine: "underline",
    color: COLORS.primary,
  },
  ModelContanier: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGrey,
    marginBottom: 5,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 200,
    justifyContent: "space-around",
  },
  singleIcon: {
    marginRight: 5,
  },
  footer: {
    position: "absolute",
    backgroundColor: COLORS.white,
    left: 0,
    right: 0,
    height: 50,
    bottom: 0,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: COLORS.cocoGrey,
    flexDirection: "row",
  },
  header: {
    borderBottomColor: COLORS.cocoGrey,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  imgAndStatus: {
    flexDirection: "row",
  },
  upperTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 8,
    paddingBottom: 10,
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  icons: {
    flexDirection: "row",
    position: "absolute",
    flex: 0.5,
    alignSelf: "baseline",
    right: 4,
  },
  name: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 10,
    fontWeight: "bold",
  },
  action: {
    color: COLORS.darkGray,
    marginLeft: 10,
    flexGrow: 1,
  },
  time: {
    color: COLORS.black,
    marginLeft: 10,
  },
  feeling_action: { color: COLORS.darkGray, marginTop: HP(0.5) },
  feeling_value: {
    fontWeight: "bold",
    color: COLORS.lightGray,
    marginTop: HP(0.5),
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: WP(100),
    marginLeft: -WP(2.1),
    height: HP(45),
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    height: WP(45),
    justifyContent: "center",
    alignItems: "center",
  },
  colorPost: {
    flex: 1,
    justifyContent: "center",
    width: WP(90),
    height: HP(40),
  },
  img: {
    height: HP(3),
    width: WP(5),
    resizeMode: "stretch",
    margin: 20,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
