import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  comentDeleted,
  comentUpdate,
} from "../../Redux/actions/NewsFeedActions";
import Modal from "react-native-modal";
import { ICONS } from "../../Constants/Icons";
import Toast from "react-native-simple-toast";
import { IMAGES } from "../../Constants/Images";
import FastImage from "react-native-fast-image";
import { COLORS } from "../../Constants/Colors";
import { HP, WP } from "../../../Utils/Resposive";
import { SITE_URL } from "../../Services/Constants";
import CommentReactions from "../CommentsReactions";
import FlashMessage from "react-native-flash-message";
import Feather from "react-native-vector-icons/Feather";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import GallerySwiper from "react-native-gallery-swiper";
import { useNavigation } from "@react-navigation/native";
import { downloadAndSave } from "../../../Utils/Download";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import ShowCommentReactions from "../ShowCommentReactions";

const FirstComment = memo((props) => {
  const { handleOnPresReply } = props;
  let flashRef = useRef();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const data_target = props.data_target;

  const user = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);

  const [commentText, setCommentText] = useState("");
  const [commentData, setCommentData] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [showSaveModel, setShowSaveModal] = useState(false);
  const [isEditReplyFocused, setIsEditReplyFocused] = useState(false);
  const [replyingName, setReplyingName] = useState("");
  const [commentId, setCommentId] = React.useState();
  const [replyIndexes, setReplyIndexes] = useState([]);
  const [myNewReply, setMyNewReply] = useState("");

  const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);

  useEffect(() => {
    setCommentData(props?.data);
  }, [props?.data]);

  const [ID, setID] = useState(0);

  const dispatch = useDispatch();

  const showConfirmDialog = () => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this comment?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            deletedComment();
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };
  const deletedComment = () => {
    let formData = new FormData();
    formData.append("_js_id", ID);
    dispatch(comentDeleted({ formData, token }));
  };

  const UpdateComment = (text) => {
    setModalVisible2(!modalVisible2);
    let formData = new FormData();
    formData.append("_js_id", ID);
    formData.append("js_comment_form-edit-text", text);
    dispatch(comentUpdate({ formData, token }));
  };

  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
    gestureIsClickThreshold: 1,
  };

  const foo = () => {
    setModalVisible(false);
    setTimeout(() => {
      setModalVisible2(true);
    }, 500);
  };

  const handleLongPress = () => {
    setShowSaveModal(true);
  };

  const likeItemFunc = async (item, index) => {
    let myArray = [...commentData];
    let myIndex = myArray.indexOf(item);
    let myPostId = item?.post_id;

    let myNewItem = myArray[myIndex];

    if (!myNewItem.reaction || myNewItem.reaction.reaction_type_id !== 1) {
      if (!myNewItem.reaction) {
        myNewItem.comment_reactions_count =
          (myNewItem.comment_reactions_count || 0) + 1; // Ensure to increment
      }
      myNewItem.reaction = {
        reaction_type_id: 1,
      };
      myNewItem.localReacted = true;
    }

    myArray[myIndex] = myNewItem;
    setCommentData(myArray);

    const formData = new FormData();
    formData.append("post_id", myPostId);
    formData.append("comment_id", item.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");

    try {
      const res = await withoutStringiApiCall2({
        route:
          // data_target == "comment"
          "post/comment/reaction",
        // : data_target == "gallery_comment"
        // ? "post/gallery_comment/reaction"
        // : null,
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        // Handle error
      } else if (res.responseCode == 200) {
        // Handle success if needed
      }
    } catch (e) {
      console.log("saga likeComment error -- ", e.toString());
    }
  };

  const reactionType = async (id, item, index) => {
    let myArray = [...commentData];
    let myIndex = myArray.indexOf(item);
    let myPostId = item?.post_id;

    let myNewItem = myArray[myIndex];

    if (!myNewItem.reaction || myNewItem.reaction.reaction_type_id !== id) {
      if (!myNewItem.reaction) {
        myNewItem.comment_reactions_count =
          (myNewItem.comment_reactions_count || 0) + 1;
      } else if (myNewItem.reaction.reaction_type_id !== id) {
      }

      myNewItem.reaction = {
        reaction_type_id: id,
      };

      myArray[myIndex] = myNewItem;
      setCommentData(myArray);

      const formData = new FormData();
      formData.append("post_id", myPostId);
      formData.append("comment_id", item.id);
      formData.append("reaction_id", id);
      formData.append("post_type", "post");

      try {
        const res = await withoutStringiApiCall2({
          route: "post/comment/reaction",

          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          // Handle error
        } else if (res.responseCode == 200) {
          // Handle success if needed
        }
      } catch (e) {
        console.log("saga reactionType error -- ", e.toString());
      }
    }
  };

  const unLikeItemFunc = async (item, index) => {
    let myPostId = item.post_id;
    let myArray = [...commentData];
    let myIndex = myArray.indexOf(item);
    let myNewItem = myArray.find((itm, ind) => {
      if (itm == item) {
        if (itm?.reaction.reaction_type_id == 1) {
          let like = itm?.like?.filter((i) => i.user_id != user.id);
          itm.like = like;
        }
        if (itm?.reaction.reaction_type_id == 2) {
          let heart = itm?.heart?.filter((i) => i.user_id != user.id);
          itm.heart = heart;
        }
        if (itm?.reaction.reaction_type_id == 3) {
          let haha = itm?.haha?.filter((i) => i.user_id != user.id);
          itm.haha = haha;
        }
        if (itm?.reaction.reaction_type_id == 4) {
          let wow = itm?.wow?.filter((i) => i.user_id != user.id);
          itm.wow = wow;
        }
        if (itm?.reaction.reaction_type_id == 5) {
          let sad = itm?.sad?.filter((i) => i.user_id != user.id);
          itm.sad = sad;
        }
        if (itm?.reaction.reaction_type_id == 6) {
          let angry = itm?.angry?.filter((i) => i.user_id != user.id);
          itm.angry = angry;
        }
        itm.reaction = null;
        itm.localReacted = false;
        itm.comment_reactions_count = itm.comment_reactions_count - 1;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setCommentData(myArray);

    const formData = new FormData();
    formData.append("post_id", myPostId);
    formData.append("comment_id", item.id);

    try {
      const res = await withoutStringiApiCall2({
        route:
          // data_target == "comment"
          "post/comment/reaction/delete",
        // : data_target == "gallery_comment"
        // ? "post/gallery_comment/reaction/delete"
        // : null,
        verb: "POST",
        token: token,
        params: formData,
      });
    } catch (e) {
      console.log("saga deleteComment error -- ", e.toString());
    }
  };
  const onPressReply = (item, index, replyOfreplyItem, replyCount) => {
    handleOnPresReply(item);

    setIsEditReplyFocused(false);

    if (replyOfreplyItem?.user) {
      setReplyingName(
        replyOfreplyItem.user.first_name + " " + replyOfreplyItem.user.last_name
      );
    } else {
      setReplyingName(item.user.first_name + " " + item.user.last_name);
    }

    setCommentId(item.id);
    if (replyCount == 0) {
      setReplyIndexes((prevState) => {
        return [...prevState, index];
      });
    }
  };

  return (
    <KeyboardAvoidingView>
      <FlatList
        listKey={(item, index) => index.toString()}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1 }}
        data={commentData}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() =>
                navigation.push("ProfileScreen", {
                  id: item?.user?.id,
                })
              }
            >
              <FastImage
                source={
                  item?.user?.profile_picture != null
                    ? {
                        uri: SITE_URL + item?.user?.profile_picture,
                      }
                    : IMAGES.blankDP
                }
                style={styles.img}
              />
            </TouchableOpacity>
            <Modal
              backdropOpacity={0.3}
              isVisible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}
              onSwipeComplete={() => setModalVisible(false)}
              swipeDirection={["down"]}
              style={styles.bottomView}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.centerContent}>
                <View style={styles.headLine} />
              </View>
              <View style={styles.content}>
                <TouchableOpacity
                  style={{ flexDirection: "row", padding: 12 }}
                  onPress={() => foo()}
                >
                  {ICONS.antDesign("edit", COLORS.info, 24)}
                  <Text style={styles.modalText}>{t("Update")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row", padding: 12 }}
                  onPress={() => showConfirmDialog()}
                >
                  {ICONS.antDesign("delete", COLORS.primary, 24)}
                  <Text style={styles.modalText}>{t("Delete")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row", padding: 12 }}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  {ICONS.entypo("cross", COLORS.transparent, 24)}
                  <Text style={styles.modalText}>{t("Cancel")}</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={styles.commentAndName}>
              <Modal
                backdropOpacity={0.3}
                isVisible={modalVisible2}
                onBackdropPress={() => setModalVisible2(false)}
                onSwipeComplete={() => setModalVisible2(false)}
                swipeDirection={["down"]}
                style={styles.bottomView}
                onRequestClose={() => setModalVisible2(false)}
              >
                <View style={styles.centerContent}>
                  <View style={styles.headLine} />
                </View>
                <View style={styles.content}>
                  <TouchableOpacity onPress={() => setModalVisible2(false)}>
                    <TextInput
                      multiline
                      numberOfLines={2}
                      style={styles.input}
                      onChangeText={(val) => setCommentText(val)}
                      value={commentText}
                    />

                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.info,
                        marginTop: 5,
                        height: 40,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => UpdateComment(commentText)}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        {t("Update")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        marginTop: 10,
                        height: 40,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => setModalVisible2(!modalVisible2)}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        {t("Cancel")}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </Modal>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.name}>
                  {item.user.first_name} {item.user.last_name}
                </Text>
              </View>
              {item.comment_text ? (
                <View style={styles.comenttxt}>
                  <NewsFeedText txt={item?.comment_text} />
                </View>
              ) : null}
              {item?.comment_file ? (
                <>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setIsSinglePictureModell(true);
                    }}
                  >
                    <FastImage
                      resizeMode="contain"
                      style={styles.imageInComment}
                      source={{
                        uri: SITE_URL + item?.comment_file,
                      }}
                    />
                  </TouchableWithoutFeedback>
                  <Modal
                    onBackButtonPress={() => {
                      setIsSinglePictureModell(false);
                    }}
                    visible={isSinglePictureModell}
                    style={{
                      margin: 0,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 30,
                        zIndex: 1000,
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={handleLongPress}
                      >
                        {ICONS.entypo("dots-three-horizontal", COLORS.grey, 35)}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => setIsSinglePictureModell(false)}
                      >
                        {ICONS.materialIcons("cancel", COLORS.primary, 35)}
                      </TouchableOpacity>
                    </View>
                    <GallerySwiper
                      images={[
                        {
                          uri: SITE_URL + item?.comment_file,
                        },
                      ]}
                      initialNumToRender={1}
                      imageComponent={(imageProps, imageDimensions, index) => (
                        <FastImage {...imageProps} />
                      )}
                      resizeMode="contain"
                      sensitiveScroll={false}
                      onSwipeUpReleased={() => setIsSinglePictureModell(false)}
                      onSwipeDownReleased={(e) =>
                        setIsSinglePictureModell(false)
                      }
                      enableScale
                      onLongPress={handleLongPress}
                    />

                    {showSaveModel && (
                      <Modal
                        visible={showSaveModel}
                        hasBackdrop={true}
                        animationInTiming={2000}
                        onBackdropPress={() => setShowSaveModal(false)}
                        style={{
                          margin: 0,
                          justifyContent: "flex-end",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <SafeAreaView
                          style={{
                            // height: "15%",
                            backgroundColor: "white",
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                          }}
                        >
                          <View
                            style={{
                              width: WP(20),
                              height: 5,
                              marginTop: -HP(1),
                              marginBottom: HP(1),
                              backgroundColor: "white",
                              alignSelf: "center",
                              borderRadius: 5,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              padding: HP(2),
                              margin: HP(1),
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              setShowSaveModal(false);
                              const url = SITE_URL + item?.comment_file;

                              flashRef.current.showMessage({
                                message: "Saving...",
                                type: "info",
                              });

                              downloadAndSave(url, (res) => {
                                if (res)
                                  flashRef.current.showMessage({
                                    message: "Saved successfully",
                                    type: "success",
                                  });
                              });
                            }}
                          >
                            <Feather
                              name="download"
                              size={HP(3)}
                              color="black"
                            />
                            <Text
                              style={{
                                fontSize: 19,
                                marginLeft: 13,
                              }}
                            >
                              {t("Save To Phone")}
                            </Text>
                          </TouchableOpacity>
                        </SafeAreaView>
                      </Modal>
                    )}

                    <FlashMessage
                      ref={flashRef}
                      position="bottom"
                      floating
                      duration={3000}
                      icon="auto"
                      style={{
                        alignItems: "center",
                        backgroundColor: COLORS.secondary,
                      }}
                    />
                  </Modal>
                </>
              ) : null}

              <View style={styles.likeReplyContainer}>
                <CommentReactions
                  likePress={() => {
                    likeItemFunc(item);
                  }}
                  unLikePress={() => {
                    unLikeItemFunc(item);
                  }}
                  likesCount={item.comment_reactions_count}
                  replyPress={() => {
                    onPressReply(item, index, null, item?.replies_count);
                  }}
                  color={COLORS.primary}
                  liked={item.reaction != null ? true : false}
                  reactionID={item?.reaction?.reaction_type_id}
                  reactionType={(id) => reactionType(id, item)}
                />

                <ShowCommentReactions
                  reaction={item.reaction}
                  post_reactions_count={item.comment_reactions_count}
                  comments_count={item.comments_count + item.replies_count}
                  like={item.like}
                  heart={item.heart}
                  haha={item.haha}
                  wow={item.wow}
                  sad={item.sad}
                  angry={item.angry}
                  fontColor={COLORS.black}
                  pressfunction={() => {
                    // onPressProfile();
                  }}
                  commentId={item?.id}
                  data_target={"comment"}
                  ifNewsFeed={true}
                />
              </View>
              {/* {isReplying ? (
                <>
                  <View style={styles.isReplyingContainer}>
                    <Text>{t("Replying to")}</Text>
                    <Text style={styles.nameTxt}> {replyingName} </Text>
                    <TouchableOpacity
                      style={styles.cancelContainer}
                      onPress={toggleReplying}
                    >
                      {ICONS.entypo("dot-single", null, 17)}
                      <Text>{t("Cancel")}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginHorizontal: 10 }}>
                    <TextInput
                      ref={txtInputRef}
                      value={myNewReply}
                      onChangeText={setMyNewReply}
                      style={{
                        backgroundColor: "white",
                        width: "85%",
                        height: 40,
                        borderRadius: 10,
                        padding: 10,
                        margin: 3,
                      }}
                    />
                  </View>
                </>
              ) : null} */}
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  Contanier: {
    flex: 1,
  },
  ModelContanier: {
    backgroundColor: COLORS.white,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderRadius: 10,

    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cocoGray,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: COLORS.white,
    //    borderRadius: 15,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,

    width: "100%",
    height: 200,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 300,
    justifyContent: "space-around",
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGray,

    marginBottom: 5,
  },

  commentAndName: {
    backgroundColor: COLORS.lightGray,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
    width: WP(80),
    paddingVertical: 10,
    // height: HP(10),
  },
  name: {
    marginLeft: 18,
    fontWeight: "bold",
  },
  comenttxt: {
    marginLeft: 10,
  },
  imageInComment: {
    flex: 1,
    width: WP(30),
    height: HP(10),
    margin: 5,
    marginLeft: WP(5),
  },
  likeReplyText: {
    padding: 8,
    fontSize: 15,
    fontWeight: "600",
  },
  likeReplyContainer: {
    paddingLeft: 8,
    // padding: 3,
    width: "94%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  isReplyingContainer: {
    height: 30,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 18,
  },
  nameTxt: { fontWeight: "bold" },
  cancelContainer: { flexDirection: "row", justifyContent: "center" },
});

// export default FirstComment;
export default React.memo(FirstComment);
