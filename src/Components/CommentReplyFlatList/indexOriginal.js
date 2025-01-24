import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import { memo } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
} from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { WidthScreen } from "../TopBar/Dimensions";
import { FlatList, View, Text, TouchableOpacity, Image } from "react-native";
import { timeDifference } from "../NewsFeedList/Functions";
import { useDispatch, useSelector } from "react-redux";
import {
  editReply,
  fetchReplies,
  postReply,
  updateReply,
} from "../../Redux/actions/NewsFeedActions";
import { launchImageLibrary } from "react-native-image-picker";
import EditDeleteCommentModal from "../EditDeleteCommentModal";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import Button from "../../Components/NewButton";
import CommentReactions from "../CommentsReactions";
import ShowCommentReactions from "../ShowCommentReactions";
import { ACTIONS } from "../../Redux/action-types";
import { SITE_URL } from "../../Services/Constants";
import { IMAGES } from "../../Constants/Images";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

const CommentReplyFlatList = memo(
  ({ data, backPress, closeFromParent, item3, data_target }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const myPostId = useSelector((state) => state.blackNewsF.myPostId);
    const token = useSelector((state) => state.auth.userToken);
    const userName = useSelector((state) => state.auth.userData);

    const [myNewReply, setMyNewReply] = useState("");
    const [replyImage, setReplyImage] = useState("");
    const [editReplyText, setEditReplyText] = useState("");
    const [isEdittingReply, setIsEdittingReply] = useState("");
    const [myData, setMyData] = useState([]);
    const [isEditDellModalReply, setIsEditDellModalReply] = useState(false);
    const [myItemReply, setMyItemReply] = useState(false);
    const textInputRef = useRef();
    const editReplyData = useSelector(
      (state) => state.blackNewsF.editReplyData
    );
    const chooseImageGalleryReply = () => {
      let options = {
        mediaType: "mixed",
        quality: 1,
        noData: true,
        selectionLimit: 6,
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled camera picker");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          console.log("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          console.log("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          console.log(response.errorMessage);
          return;
        }
        console.log(response);
        let uri = response?.assets[0]?.uri;
        let type = response?.assets[0]?.type;
        let name = response?.assets[0]?.fileName;

        const MyObject = { uri, type, name };
        setReplyImage(MyObject);
      });
    };

    const submitNewReplyToServer = async (item) => {
      console.log("id", myPostId);
      const formData = new FormData();
      formData.append("comment_text", myNewReply);
      formData.append("post_id", myPostId);
      formData.append("post_type", "post");
      formData.append("comment_id", item.id);
      {
        replyImage && formData.append("comment_file", replyImage);
      }
      dispatch(postReply({ token, formData }));
    };

    const submitNewGalleryReplyToServer = async (item) => {
      console.log("id", myPostId);
      const formData = new FormData();
      formData.append("comment_text", myNewReply);
      formData.append("post_id", myPostId);
      formData.append("post_type", "post");
      formData.append("comment_id", item.id);
      {
        replyImage && formData.append("comment_file", replyImage);
      }
      try {
        const res = await withoutStringiApiCall2({
          route: "post/gallery_comment/reply",
          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          console.log("res !== 200 in postReply ... ", res);
        } else if (res.responseCode == 200) {
          dispatch({
            type: ACTIONS.NEW_POST_REPLY,
            newReply: res.payload.data.comment_reply,
          });
        }
      } catch (e) {
        console.log("saga postReply error -- ", e.toString());
      }
    };

    const submitNewReply = async (item) => {
      console.log("data_target in replies", data_target);

      if (data_target == "comment") {
        submitNewReplyToServer(item);
        setReplyImage();
        setMyNewReply("");
      } else if (data_target == "gallery_comment") {
        submitNewGalleryReplyToServer(item);
        setReplyImage();
        setMyNewReply("");
      }
    };

    const deleteReply = async (item) => {
      const formData = new FormData();
      formData.append("_js_id", item.id);
      try {
        const res = await withoutStringiApiCall2({
          route: "post/comment/reply/delete",
          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          setIsEditDellModalReply(false);
        } else if (res.responseCode == 200) {
          setIsEditDellModalReply(false);
          dispatch(
            fetchReplies({
              token,
              id: item3.encrypted_id,
              comm_id: item.comment_id,
            })
          );
        }
      } catch (e) {
        console.log("saga deleteReply error -- ", e.toString());
      }
    };

    const editMyReply = () => {
      setIsEdittingReply(true);
      setIsEditDellModalReply(false);
      dispatch(editReply({ token, id: myItemReply.id }));
    };

    const updateMyReply = () => {
      const formData = new FormData();
      formData.append("js_comment_form-edit-text", editReplyText);
      formData.append("_js_id", editReplyData.id);
      // {
      //   replyImage && formData.append("comment_file", image);
      // }
      dispatch(updateReply({ token, formData }));
      setIsEdittingReply(false);

      setTimeout(() => {
        dispatch(
          fetchReplies({
            token,
            id: item3.encrypted_id,
            comm_id: myItemReply.comment_id,
          })
        );
      }, 1000);
    };

    const reactChk = (number, bool, reaction) => {
      if (bool == true || reaction != null) {
        return number;
      } else {
        return number + 1;
      }
    };

    const likeItemFunc = async (item, index) => {
      let myArray = [...myData];
      let myIndex = myArray.indexOf(item);
      let myNewItem = myArray.find((itm, ind) => {
        if (itm == item) {
          itm.reaction = {
            reaction_type_id: 1,
          };
          itm.comment_reply_reactions_count = reactChk(
            itm.comment_reply_reactions_count,
            itm.localReacted
          );
          itm.localReacted = true;
          return itm;
        }
      });
      myArray[myIndex] = myNewItem;
      setMyData(myArray);

      const formData = new FormData();
      formData.append("post_id", myPostId);
      formData.append("comment_id", item.comment_id);
      formData.append("reaction_id", 1);
      formData.append("comment_reply_id", item.id);
      formData.append("post_type", "post");
      try {
        const res = await withoutStringiApiCall2({
          route: "post/comment/reply/reaction",
          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          console.log("res !== 200 in likeComment ... ", res);
        } else if (res.responseCode == 200) {
        }
      } catch (e) {
        console.log("saga likeComment error -- ", e.toString());
      }
    };

    const unLikeItemFunc = async (item, index) => {
      let myArray = [...myData];
      let myIndex = myArray.indexOf(item);
      let myNewItem = myArray.find((itm, ind) => {
        if (itm == item) {
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
          itm.comment_reply_reactions_count =
            itm.comment_reply_reactions_count - 1;
          return itm;
        }
      });
      myArray[myIndex] = myNewItem;
      setMyData(myArray);

      const formData = new FormData();
      formData.append("post_id", myPostId);
      formData.append("comment_id", item.comment_id);
      formData.append("comment_reply_id", item.id);

      try {
        const res = await withoutStringiApiCall2({
          route: "post/comment/reply/reaction/delete",
          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          console.log("res !== 200 in deleteComment ... ", res);
        } else if (res.responseCode == 200) {
        }
      } catch (e) {
        console.log("saga deleteComment error -- ", e.toString());
      }
    };

    const reactionType = async (id, item, index) => {
      let myArray = [...myData];
      let myIndex = myArray.indexOf(item);

      let myNewItem = myArray.find((itm, ind) => {
        if (itm == item) {
          itm.comment_reply_reactions_count = reactChk(
            itm.comment_reply_reactions_count,
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
      setMyData(myArray);

      const formData = new FormData();
      formData.append("post_id", myPostId);
      formData.append("comment_id", item.comment_id);
      formData.append("reaction_id", id);
      formData.append("comment_reply_id", item.id);
      formData.append("post_type", "post");
      try {
        const res = await withoutStringiApiCall2({
          route: "post/comment/reply/reaction",
          verb: "POST",
          token: token,
          params: formData,
        });

        if (res.responseCode !== 200) {
          console.log("res !== 200 in likeComment ... ", res);
        } else if (res.responseCode == 200) {
        }
      } catch (e) {
        console.log("saga likeComment error -- ", e.toString());
      }
    };

    useEffect(() => {
      setMyData(data?.replies?.data);
    }, [data?.replies?.data]);

    React.useEffect(() => {
      if (editReplyData) {
        setEditReplyText(editReplyData.comment_text);
      }
    }, [editReplyData]);

    return (
      <>
        {isEdittingReply ? (
          <SafeAreaView style={styles.containerEdit}>
            <View style={styles.headerEdit}>
              <TouchableOpacity
                onPress={() => {
                  setIsEdittingReply(false);
                  setEditReplyText("");
                }}
              >
                {ICONS.fontAwesome5("arrow-left", COLORS.black, 30)}
              </TouchableOpacity>
              <Text style={styles.headerTextEdit}>Edit Comment</Text>
            </View>
            <View>
              <TextInput
                value={editReplyText}
                onChangeText={(val) => setEditReplyText(val)}
                style={[styles.txtInputEdit]}
                multiline
                numberOfLines={7}
                onSubmitEditing={() => console.log("enter press")}
                placeholder=""
              />
              <View style={styles.btnmainEdit}>
                <Button
                  buttonstyle={styles.fullbtnEdit}
                  textstyle={styles.fullbtnTextEdit}
                  text={t("Cancel")}
                  pressFunction={() => {
                    setIsEdittingReply(false);
                    setEditCommentText("");
                  }}
                />
                <Button
                  buttonstyle={styles.fullbtnEdit}
                  textstyle={styles.fullbtnTextEdit}
                  text={t("Update")}
                  pressFunction={() => updateMyReply()}
                />
              </View>
            </View>
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.replyContainer}>
            <TouchableOpacity onPress={() => backPress()}>
              {ICONS.fontAwesome5("arrow-left", COLORS.primary, 23, {
                marginLeft: 12,
                marginTop: 15,
              })}
            </TouchableOpacity>

            {data?.comment ? (
              <View style={styles.flatlistcontainer}>
                <View style={styles.flatlistInnerCont}>
                  <TouchableOpacity>
                    <Image
                      style={styles.profpic}
                      source={
                        data?.comment?.user?.profile_picture != null
                          ? {
                              uri:
                                SITE_URL + data?.comment?.user?.profile_picture,
                            }
                          : IMAGES.blankDP
                      }
                    />
                  </TouchableOpacity>
                  <View>
                    <View style={[styles.nameContainer]}>
                      <Text style={{ fontWeight: "700" }}>
                        {data?.comment.user.first_name +
                          " " +
                          data?.comment.user.last_name}
                      </Text>
                      {data?.comment.comment_text ? (
                        <Text style={{ fontSize: 16 }}>
                          {data?.comment.comment_text}
                        </Text>
                      ) : null}
                      {data?.comment.comment_file ? (
                        <Image
                          style={styles.commentPic}
                          source={{
                            uri: SITE_URL + data?.comment?.comment_file,
                          }}
                        />
                      ) : null}
                    </View>
                    <View style={styles.reactionsContainer}>
                      <Text>{timeDifference(data?.comment.created_at)}</Text>
                      <Text style={{ fontWeight: "700" }}>Like</Text>
                      <Text style={{ fontWeight: "700" }}>Reply</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text>{data?.comment.comment_reactions_count}</Text>
                        {ICONS.fontAwesome5("thumbs-up", COLORS.primary, 16)}
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <FlatList
                    data={myData}
                    nestedScrollEnabled
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.flatlistcontainerReplies}>
                          <View
                            style={[styles.flatlistInnerCont, { width: "93%" }]}
                          >
                            <TouchableOpacity>
                              <Image
                                style={styles.profpic}
                                source={
                                  item?.user?.profile_picture != null
                                    ? {
                                        uri:
                                          SITE_URL +
                                          item?.user?.profile_picture,
                                      }
                                    : IMAGES.blankDP
                                }
                              />
                            </TouchableOpacity>
                            <View>
                              <View style={styles.nameContainer}>
                                <Text style={{ fontWeight: "700" }}>
                                  {item.user.first_name +
                                    " " +
                                    item.user.last_name}
                                </Text>
                                {item.comment_text ? (
                                  <Text style={{ fontSize: 16 }}>
                                    {item.comment_text}
                                  </Text>
                                ) : null}
                                {item.comment_file ? (
                                  <Image
                                    style={styles.commentPic}
                                    source={{
                                      uri: SITE_URL + item?.comment_file,
                                    }}
                                  />
                                ) : null}
                              </View>
                              <View style={styles.reactContainer}>
                                <Text style={{ marginTop: 4 }}>
                                  {timeDifference(item.created_at)}
                                </Text>
                                <CommentReactions
                                  likePress={() => {
                                    likeItemFunc(item, index);
                                  }}
                                  unLikePress={() => {
                                    unLikeItemFunc(item, index);
                                  }}
                                  likesCount={
                                    item.comment_reply_reactions_count
                                  }
                                  replyPress={() => {
                                    // showRepliesFunc(item, index);
                                    // setCommentId(item?.id);

                                    textInputRef.current.focus();
                                  }}
                                  color={COLORS.primary}
                                  liked={item.reaction != null ? true : false}
                                  reactionID={item?.reaction?.reaction_type_id}
                                  reactionType={(id) =>
                                    reactionType(id, item, index)
                                  }
                                />
                                <ShowCommentReactions
                                  reaction={item.reaction}
                                  post_reactions_count={
                                    item.comment_reply_reactions_count
                                  }
                                  comments_count={item.comments_count}
                                  like={item.like}
                                  heart={item.heart}
                                  haha={item.haha}
                                  wow={item.wow}
                                  sad={item.sad}
                                  angry={item.angry}
                                  fontColor={COLORS.black}
                                  pressfunction={() => {
                                    setIsModel(!isModell),
                                      setPostId(item.encrypted_id);
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                          {userName.name == item.user.name && (
                            <TouchableOpacity
                              onPress={() => {
                                setIsEditDellModalReply(!isEditDellModalReply);
                                setMyItemReply(item);
                              }}
                            >
                              {ICONS.fontAwesome5(
                                "ellipsis-h",
                                COLORS.primary,
                                30
                              )}
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
                {replyImage ? (
                  <View style={styles.imgContainer}>
                    <Image
                      resizeMode="cover"
                      style={styles.img}
                      source={{ uri: replyImage.uri }}
                    />
                    <TouchableOpacity onPress={() => setReplyImage()}>
                      {ICONS.fontAwesome5("times-circle", COLORS.primary, 25)}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
            {data?.comment && (
              <View style={styles.footer}>
                <TextInput
                  ref={textInputRef}
                  value={myNewReply}
                  onChangeText={setMyNewReply}
                  style={[styles.txtInput]}
                  multiline
                  numberOfLines={2}
                  onSubmitEditing={() => console.log("enter press")}
                  placeholder="Write a comment there"
                />
                <TouchableOpacity onPress={() => chooseImageGalleryReply()}>
                  {ICONS.fontAwesome5("camera", COLORS.primary, 25)}
                </TouchableOpacity>
                {myNewReply || replyImage ? (
                  <TouchableOpacity
                    onPress={() => submitNewReply(data.comment)}
                  >
                    {ICONS.fontAwesome5("paper-plane", COLORS.primary, 25)}
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
            <EditDeleteCommentModal
              isEditDellModal={isEditDellModalReply}
              setIsEditDellModal={() => {
                setIsEditDellModalReply(false);
              }}
              closePress={() => setIsEditDellModalReply(false)}
              onPressDell={() => deleteReply(myItemReply)}
              onPressEdit={() => editMyReply()}
            />
          </SafeAreaView>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  replyContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    // paddingTop: 50,

    marginTop: Platform.OS == "android" ? StatusBar.currentHeight : 44,
  },
  profpic: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  flatlistcontainer: {
    marginHorizontal: 10,
    marginVertical: 7,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  flatlistcontainerReplies: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 1,
  },
  flatlistInnerCont: {
    flexDirection: "row",
    marginHorizontal: 10,

    marginVertical: 7,
  },
  nameContainer: {
    backgroundColor: COLORS.cocoGray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    maxWidth: getWidth(62),
    minWidth: getWidth(38),
  },
  commentPic: {
    width: getWidth(40),
    height: getHeight(20),
    margin: 5,
    alignSelf: "center",
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  footer: {
    // position: "absolute",
    // top: "400%",

    paddingHorizontal: 10,
    // backgroundColor: COLORS.white,
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: COLORS.cocoGray,
  },
  txtInput: {
    height: 40,
    backgroundColor: COLORS.cocoGray,
    width: "80%",
    borderRadius: 20,
  },
  imgContainer: {
    position: "absolute",
    backgroundColor: COLORS.white,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    // height: 150,
    width: WidthScreen,
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingLeft: 10,
    flexDirection: "row",
  },
  img: {
    height: 130,
    width: 100,
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: "center",
  },
  containerEdit: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerEdit: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    alignItems: "center",
    height: getHeight(7),
    marginBottom: getHeight(2),
    borderBottomWidth: 0.5,
  },
  imgEdit: {
    height: getHeight(30),
    width: getWidth(35),
    left: getWidth(4),
    top: getHeight(3),
    borderRadius: 10,
  },
  txtInputEdit: {
    backgroundColor: COLORS.cocoGray,
    width: "95%",
    height: "30%",
    maxHeight: getHeight(30),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
  },
  headerTextEdit: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18,
    left: getWidth(25),
  },
  fullbtnEdit: {
    width: getWidth(20),
    height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  fullbtnTextEdit: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  btnmainEdit: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: getWidth(3),
    marginTop: getHeight(1.5),
  },
  reactContainer: {
    flexDirection: "row",
  },
});

export default CommentReplyFlatList;
