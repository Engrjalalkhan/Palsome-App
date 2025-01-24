import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { WidthScreen } from "../TopBar/Dimensions";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-simple-toast";

import {
  timeDifference,
  timeDifferenceComments,
} from "../NewsFeedList/Functions";

import { useDispatch, useSelector } from "react-redux";
import {
  comentDeleted,
  editReply,
  fetchComments,
  postReply,
  updateReply,
} from "../../Redux/actions/NewsFeedActions";
import { launchImageLibrary } from "react-native-image-picker";
import EditDeleteCommentModal from "../EditDeleteCommentModal";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import Button from "../../Components/NewButton";
import CommentReactions from "../CommentsReactions";
import ShowCommentReactions from "../ShowCommentReactions";
import { useNavigation } from "@react-navigation/native";
import { SITE_URL } from "../../Services/Constants";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import { IMAGES } from "../../Constants/Images";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { Keyboard } from "react-native";
import GallerySwiper from "react-native-gallery-swiper";
import FastImage from "react-native-fast-image";

// Add this hook to your component

const CommentReplyFlatList = memo(
  ({
    data,
    comm_id,
    item3,
    data_target,
    onLayout,
    closeCommentModal,
    replyPress,
    onPressDelete,
    onEditReplyFocus,
    onLeftArrowPress,
    onEditReplyBlur,
    editDeleteModel,
    isEditReplyFocused,
    setIsEditReplyFocused,
    isReplying,
    setIsReplying,
    setPlay,
    onPressProfile,
    commentId,
  }) => {
    const editReplyData = useSelector(
      (state) => state.blackNewsF.editReplyData
    );

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const myPostId = useSelector((state) => state.blackNewsF.myPostId);
    const token = useSelector((state) => state.auth.userToken);
    const userData = useSelector((state) => state.auth.userData);
    const newReply = useSelector((state) => state.blackNewsF.newReply);

    const [myNewReply, setMyNewReply] = useState("");
    const [replyImage, setReplyImage] = useState("");
    const [editReplyText, setEditReplyText] = useState("");
    const [isEdittingReply, setIsEdittingReply] = useState(false);
    const [myData, setMyData] = useState([]);
    const [isEditDellModalReply, setIsEditDellModalReply] = useState(false);
    const [myItemReply, setMyItemReply] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardStatus, setKeyboardStatus] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);
    const [isNewReply, setIsNewReply] = useState([]);

    const textInputRef = useRef();
    const navigation = useNavigation();

    useEffect(() => {
      if (editReplyData) {
        setEditReplyText(editReplyData?.comment_text);
      }
    }, [editReplyData]);

    useEffect(() => {
      setIsNewReply(newReply);
    }, [newReply]);

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
        let uri = response?.assets[0]?.uri;
        let type = response?.assets[0]?.type;
        let name = response?.assets[0]?.fileName;

        const MyObject = { uri, type, name };
        setReplyImage(MyObject);
      });
    };

    const submitNewGalleryReplyToServer = async (item) => {
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
        } else if (res.responseCode == 200) {
          // dispatch({
          //   type: ACTIONS.NEW_POST_REPLY,
          //   newReply: res.payload.data.comment_reply,
          // });
        }
      } catch (e) {
        console.log("saga postReply error -- ", e.toString());
      }
    };

    const submitNewReplyToServer = async (commId) => {
      const formData = new FormData();
      formData.append("comment_text", myNewReply);
      formData.append("post_id", myPostId);
      formData.append("post_type", "post");
      formData.append("comment_id", commId);
      {
        replyImage && formData.append("comment_file", replyImage);
      }
      dispatch(postReply({ token, formData }));
    };

    const submitNewReply = async (commId) => {
      if (data_target == "comment") {
        submitNewReplyToServer(commId);
        setReplyImage();
        setMyNewReply("");
      } else if (data_target == "gallery_comment") {
        submitNewGalleryReplyToServer(commId);
        setReplyImage();
        setMyNewReply("");
      }
    };

    const showConfirmDialogForReply = () => {
      // setModalVisible(!modalVisible);
      return Alert.alert(
        t("Are you sure?"),
        t("Are you sure you want to remove this comment?"),
        [
          {
            text: t("Yes"),
            onPress: () => {
              deleteReply(myItemReply);
            },
          },

          {
            text: t("No"),
          },
        ]
      );
    };

    const deleteReply = async (item) => {
      const formData = new FormData();
      formData.append("_js_id", item?.id);
      setIsEditDellModalReply(false);
      // let list = myData.filter((itm, index) => itm.id != item?.id);
      // let data = isNewReply.filter((itm, index) => itm.id != item?.id);
      // setMyData(list);
      // setIsNewReply(data);
      // setTimeout(() => {
      //   Toast.show("Your comment deleted successfully", Toast.SHORT);
      // }, 500);
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
          onPressDelete();
          // setIsEditDellModalReply(false);
          // let list = myData.filter((itm, index) => itm.id != item.id);
          // setMyData(list);
          // let data = isNewReply.filter((itm, index) => itm.id != item?.id);
          // setIsNewReply(data);
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
      setIsEditReplyFocused(false);
      setIsReplying(false);
      setIsEdittingReply(false);

      let myReplyArrray = [...data];
      let myIndex = myReplyArrray.indexOf(myItemReply);
      let myNewItem = myReplyArrray.find((itm) => {
        if (itm == myItemReply) {
          itm.comment_text = editReplyText;
          return itm;
        }
      });
      myReplyArrray[myIndex] = myNewItem;

      const formData = new FormData();
      formData.append("js_comment_form-edit-text", editReplyText);
      formData.append("_js_id", editReplyData.id);

      dispatch(updateReply({ token, formData }));
    };

    const reactChk = (number, bool, reaction) => {
      if (bool == true || reaction != null) {
        return number;
      } else {
        return number + 1;
      }
    };

    const likeItemFunc = async (item, index, context) => {
      if (context === "IsNewLike") {
        let myArray = [...isNewReply];
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
        setIsNewReply(myArray);
      } else {
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
      }

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

    const unLikeItemFunc = async (item, index, context) => {
      if (context === "IsNewUnLike") {
        let myArray = [...isNewReply];
        let myIndex = myArray.indexOf(item);
        let myNewItem = myArray.find((itm, ind) => {
          if (itm == item) {
            if (itm?.reaction.reaction_type_id == 1) {
              let like = itm?.like?.filter((i) => i.user_id != userData.id);
              itm.like = like;
            }
            if (itm?.reaction.reaction_type_id == 2) {
              let heart = itm?.heart?.filter((i) => i.user_id != userData.id);
              itm.heart = heart;
            }
            if (itm?.reaction.reaction_type_id == 3) {
              let haha = itm?.haha?.filter((i) => i.user_id != userData.id);
              itm.haha = haha;
            }
            if (itm?.reaction.reaction_type_id == 4) {
              let wow = itm?.wow?.filter((i) => i.user_id != userData.id);
              itm.wow = wow;
            }
            if (itm?.reaction.reaction_type_id == 5) {
              let sad = itm?.sad?.filter((i) => i.user_id != userData.id);
              itm.sad = sad;
            }
            if (itm?.reaction.reaction_type_id == 6) {
              let angry = itm?.angry?.filter((i) => i.user_id != userData.id);
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
        setIsNewReply(myArray);
      } else {
        let myArray = [...myData];
        let myIndex = myArray.indexOf(item);
        let myNewItem = myArray.find((itm, ind) => {
          if (itm == item) {
            if (itm?.reaction.reaction_type_id == 1) {
              let like = itm?.like?.filter((i) => i.user_id != userData.id);
              itm.like = like;
            }
            if (itm?.reaction.reaction_type_id == 2) {
              let heart = itm?.heart?.filter((i) => i.user_id != userData.id);
              itm.heart = heart;
            }
            if (itm?.reaction.reaction_type_id == 3) {
              let haha = itm?.haha?.filter((i) => i.user_id != userData.id);
              itm.haha = haha;
            }
            if (itm?.reaction.reaction_type_id == 4) {
              let wow = itm?.wow?.filter((i) => i.user_id != userData.id);
              itm.wow = wow;
            }
            if (itm?.reaction.reaction_type_id == 5) {
              let sad = itm?.sad?.filter((i) => i.user_id != userData.id);
              itm.sad = sad;
            }
            if (itm?.reaction.reaction_type_id == 6) {
              let angry = itm?.angry?.filter((i) => i.user_id != userData.id);
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
      }
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
    const getIdAndDispatch = (id, postid, ind, data_target) => {
      // setData_target(data_target);
      // setIsModel(!isModell);
      // dispatch({ type: ACTIONS.POST_ID, myPostId: postid });
      dispatch(fetchComments({ token, id: id, data_target, page: 0 }));
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
      // if (newReply != null) {
      //   let myReplyArray = [...replies];
      //   let myIndex = myReplyArray.length - 1;
      //   let myNewItem = newReply;
      //   myReplyArray[myIndex + 1] = myNewItem;
      //   setMyData(myReplyArray);
      // }
    }, [newReply]);

    useEffect(() => {
      setMyData(data);

      // data.map((item, index) => {
      //   if (item != newReply) {
      //     const myarr = [];
      //     myarr.push(item);
      //     setMyData(myarr);
      //   }
      // });

      // return () => {
      //   second
      // }
    }, [data]);

    // useEffect(() => {
    //   if (newReply != null) {
    //     let myReplyArray = [...replies];
    //     let myIndex = myReplyArray.length - 1;
    //     let myNewItem = newReply;
    //     myReplyArray[myIndex + 1] = myNewItem;
    //     setMyData(myReplyArray);
    //   }
    //   return () => {
    //     setMyData([]);
    //   };
    // }, [newReply]);
    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    const showModal = () => {
      setTimeout(() => {
        setModalVisible(true);
      }, 500); // Change the delay time (in milliseconds) as needed
    };

    return (
      <View onLayout={onLayout}>
        {isEdittingReply ? (
          <Modal visible={isModalVisible} animationType="fade">
            <SafeAreaView
              style={[
                styles.containerEdit,
                // { marginBottom: keyboardStatus ? getHeight(40) : 5 },
              ]}
            >
              <View style={styles.headerEdit}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEdittingReply(false);
                    onLeftArrowPress();
                    setModalVisible(false);
                    if (editReplyText !== myItemReply.comment_text) {
                      setEditReplyText(myItemReply.comment_text);
                    }
                  }}
                >
                  {ICONS.fontAwesome5("arrow-left", COLORS.black, 30)}
                </TouchableOpacity>
                <Text style={styles.headerTextEdit}>{t("Edit Reply")}</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.lightGray,
                  paddingTop: 10,
                  flex: 1,
                }}
              >
                <TextInput
                  value={editReplyText}
                  onChangeText={(val) => setEditReplyText(val)}
                  style={[styles.txtInputEdit]}
                  multiline
                  numberOfLines={7}
                  onFocus={onEditReplyFocus}
                  onBlur={onEditReplyBlur}
                  onSubmitEditing={() => console.log("enter press")}
                  placeholder={t("Edit reply")}
                  autoFocus={true} // Add this line to open the keyboard automatically
                />
                <View style={styles.btnmainEdit}>
                  <Button
                    buttonstyle={styles.fullbtnEdit}
                    textstyle={styles.fullbtnTextEdit}
                    text={t("Cancel")}
                    pressFunction={() => {
                      setIsEdittingReply(false);
                      setModalVisible(false);
                      if (editReplyText !== myItemReply.comment_text) {
                        setEditReplyText(myItemReply.comment_text);
                      }
                      onLeftArrowPress();

                      // setEditCommentText("");
                    }}
                  />
                  <Button
                    buttonstyle={styles.fullbtnEdit}
                    textstyle={styles.fullbtnTextEdit}
                    text={t("Update")}
                    pressFunction={() => {
                      updateMyReply(), setModalVisible(false);
                    }}
                    disabled={!editReplyText || editReplyText.trim() === ""}
                    disabledButtonStyle={styles.disabledButtonStyle} // Define your disabled button style
                    disabledTextStyle={styles.disabledTextStyle}
                  />
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        ) : (
          <SafeAreaView style={styles.replyContainer}>
            {true ? (
              <View style={styles.flatlistcontainer}>
                <View>
                  {myData
                    ?.filter((item, index) => item.comment_id == comm_id)
                    .map((item, index, arr) => {
                      return (
                        <View
                          key={index}
                          style={styles.flatlistcontainerReplies}
                        >
                          <View style={[styles.flatlistInnerCont]}>
                            <TouchableOpacity
                              onPress={() => {
                                closeCommentModal();
                                if (setPlay) {
                                  setPlay(true);
                                }
                                navigation.push("ProfileScreen", {
                                  id: item?.user?.id,
                                });
                              }}
                            >
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
                                <Text
                                  onPress={() => {
                                    closeCommentModal();
                                    if (setPlay) {
                                      setPlay(true);
                                    }
                                    navigation.push("ProfileScreen", {
                                      id: item?.user?.id,
                                    });
                                  }}
                                  style={{
                                    fontWeight: "700",
                                  }}
                                >
                                  {item?.user?.first_name +
                                    " " +
                                    item?.user?.last_name}
                                </Text>
                                {item.comment_text ? (
                                  // <Text style={{ fontSize: 15, width: 230 }}>
                                  //   {item?.comment_text}
                                  // </Text>
                                  <NewsFeedText
                                    txt={item?.comment_text}
                                    paddingLeftTrue
                                  />
                                ) : null}
                                {item?.comment_file ? (
                                  <>
                                    <TouchableWithoutFeedback
                                      onPress={() =>
                                        setIsSinglePictureModell(true)
                                      }
                                    >
                                      <FastImage
                                        resizeMode="contain"
                                        style={styles.commentPic}
                                        source={{
                                          uri: SITE_URL + item?.comment_file,
                                        }}
                                      />
                                    </TouchableWithoutFeedback>
                                    <Modal
                                      onBackButtonPress={() =>
                                        setIsSinglePictureModell(false)
                                      }
                                      visible={isSinglePictureModell}
                                      style={{
                                        margin: 0,
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={{
                                          position: "absolute",
                                          right: 15,
                                          top: getHeight(7),
                                          zIndex: 1000,
                                        }}
                                        onPress={() =>
                                          setIsSinglePictureModell(false)
                                        }
                                      >
                                        {ICONS.materialIcons(
                                          "cancel",
                                          COLORS.primary,
                                          33
                                        )}
                                      </TouchableOpacity>
                                      <GallerySwiper
                                        images={[
                                          {
                                            uri: SITE_URL + item?.comment_file,
                                          },
                                        ]}
                                        initialNumToRender={1}
                                        imageComponent={(imageProps) => (
                                          <FastImage {...imageProps} />
                                        )}
                                        resizeMode="contain"
                                        sensitiveScroll={false}
                                        onSwipeUpReleased={() =>
                                          setIsSinglePictureModell(false)
                                        }
                                        onSwipeDownReleased={(e) =>
                                          setIsSinglePictureModell(false)
                                        }
                                        enableScale
                                      />
                                    </Modal>
                                  </>
                                ) : null}
                              </View>
                              <View style={styles.reactContainer}>
                                <Text style={{ marginTop: 4 }}>
                                  {timeDifferenceComments(item?.created_at)}
                                </Text>
                                <CommentReactions
                                  likePress={() => {
                                    likeItemFunc(item, index);
                                  }}
                                  unLikePress={() => {
                                    unLikeItemFunc(item, index);
                                  }}
                                  likesCount={
                                    item?.comment_reply_reactions_count
                                  }
                                  replyPress={() => {
                                    replyPress({ replyOfreplyItem: item });
                                    // textInputRef?.current?.focus();
                                  }}
                                  color={COLORS.primary}
                                  liked={item.reaction != null ? true : false}
                                  reactionID={item?.reaction?.reaction_type_id}
                                  reactionType={(id) =>
                                    reactionType(id, item, index)
                                  }
                                />
                                <View
                                  style={{
                                    left: 30,
                                  }}
                                >
                                  <ShowCommentReactions
                                    reaction={item?.reaction}
                                    post_reactions_count={
                                      item?.comment_reply_reactions_count
                                    }
                                    comments_count={item?.comments_count}
                                    like={item?.like}
                                    heart={item?.heart}
                                    haha={item?.haha}
                                    wow={item?.wow}
                                    sad={item?.sad}
                                    angry={item?.angry}
                                    fontColor={"black"}
                                    pressfunction={() => {
                                      onPressProfile();
                                    }}
                                    commentId={item?.id}
                                    data_target={"comment_reply"}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                          {userData.id == item?.user?.id && (
                            <TouchableOpacity
                              style={{ height: 40 }}
                              onPress={() => {
                                setIsEditDellModalReply(!isEditDellModalReply);
                                setMyItemReply(item);
                                setIsEditReplyFocused(true);
                                setIsReplying(false);
                              }}
                            >
                              {ICONS.fontAwesome5(
                                "ellipsis-h",
                                COLORS.primary,
                                25,
                                null,
                                null,
                                true
                              )}
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  <View>
                    {isNewReply
                      ?.filter((item, index) => item.comment_id == comm_id)
                      .map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={styles.flatlistcontainerReplies}
                          >
                            <View style={[styles.flatlistInnerCont]}>
                              <TouchableOpacity
                                onPress={() => {
                                  closeCommentModal();
                                  if (setPlay) {
                                    setPlay(true);
                                  }
                                  navigation.push("ProfileScreen", {
                                    id: item?.user?.id,
                                  });
                                }}
                              >
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
                                  <Text
                                    style={{ fontWeight: "700" }}
                                    onPress={() => {
                                      closeCommentModal();
                                      if (setPlay) {
                                        setPlay(true);
                                      }
                                      navigation.push("ProfileScreen", {
                                        id: item?.user?.id,
                                      });
                                    }}
                                  >
                                    {item?.user?.first_name +
                                      " " +
                                      item?.user?.last_name}
                                  </Text>
                                  {item.comment_text ? (
                                    // <Text
                                    //   style={{
                                    //     fontSize: 15,
                                    //     width: 230,
                                    //   }}
                                    // >
                                    //   {item?.comment_text}
                                    // </Text>
                                    <NewsFeedText
                                      txt={item?.comment_text}
                                      paddingLeftTrue
                                    />
                                  ) : null}
                                  {item?.comment_file ? (
                                    <Image
                                      style={styles.commentPic}
                                      source={{
                                        uri: SITE_URL + item?.comment_file,
                                      }}
                                    />
                                  ) : null}
                                </View>
                                <View
                                  style={[
                                    styles.reactContainer,
                                    {
                                      width: Platform?.OS == "ios" ? 240 : 200,
                                    },
                                  ]}
                                >
                                  <Text style={{ marginTop: 4 }}>
                                    {timeDifference(item?.created_at)}
                                  </Text>
                                  <CommentReactions
                                    likePress={() => {
                                      likeItemFunc(item, index, "IsNewLike");
                                    }}
                                    unLikePress={() => {
                                      unLikeItemFunc(
                                        item,
                                        index,
                                        "IsNewUnLike"
                                      );
                                    }}
                                    likesCount={
                                      item?.comment_reply_reactions_count
                                    }
                                    // replyPress={() => {
                                    //   // showRepliesFunc(item, index);
                                    //   // setCommentId(item?.id);
                                    //   textInputRef?.current?.focus();
                                    // }}
                                    replyPress={() => {
                                      replyPress({ replyOfreplyItem: item });
                                      // textInputRef?.current?.focus();
                                    }}
                                    color={"#DF4B38"}
                                    liked={item.reaction != null ? true : false}
                                    reactionID={
                                      item?.reaction?.reaction_type_id
                                    }
                                    reactionType={(id) =>
                                      reactionType(id, item, index)
                                    }
                                  />
                                  <ShowCommentReactions
                                    reaction={item?.reaction}
                                    post_reactions_count={
                                      item?.comment_reply_reactions_count
                                    }
                                    comments_count={item?.comments_count}
                                    like={item?.like}
                                    heart={item?.heart}
                                    haha={item?.haha}
                                    wow={item?.wow}
                                    sad={item?.sad}
                                    angry={item?.angry}
                                    fontColor={"black"}
                                    pressfunction={() => {
                                      onPressProfile();
                                    }}
                                    commentId={item?.id}
                                    data_target={"comment_reply"}
                                  />
                                </View>
                              </View>
                            </View>
                            {userData.id == item?.user?.id && (
                              <TouchableOpacity
                                style={{ height: 40 }}
                                onPress={() => {
                                  setIsEditDellModalReply(
                                    !isEditDellModalReply
                                  );
                                  setMyItemReply(item, "New");
                                }}
                              >
                                {ICONS.fontAwesome5(
                                  "ellipsis-h",
                                  COLORS.primary,
                                  25
                                )}
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                  </View>
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
              <ActivityIndicator size="small" color={"#DF4B38"} />
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
                    onPress={() => {
                      submitNewReply(data.comment);
                      // getIdAndDispatch(item3.encrypted_id, item3.id, "comment");
                    }}
                  >
                    {ICONS.fontAwesome5("paper-plane", COLORS.black, 25)}
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
            <EditDeleteCommentModal
              isEditDellModal={isEditDellModalReply}
              setIsEditDellModal={() => {
                setIsEditDellModalReply(false);
              }}
              closePress={() => {
                setIsEditDellModalReply(false);
                onLeftArrowPress();
              }}
              onPressDell={() => {
                showConfirmDialogForReply(), onLeftArrowPress();
              }}
              onPressEdit={() => {
                editMyReply(), showModal();
              }}
            />
          </SafeAreaView>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  replyContainer: {
    backgroundColor: COLORS.white,

    marginLeft: getWidth(10),
  },

  containerReply: {
    // borderWidth: 1,
    // borderColor: COLORS.lightGray,
    // marginHorizontal: 10
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
  },
  flatlistcontainerReplies: {
    flexDirection: "row",
    marginVertical: 1,
    justifyContent: "space-between",
  },
  flatlistInnerCont: {
    flexDirection: "row",
    // marginHorizontal: 10,

    marginVertical: 7,
    marginLeft: 9,
  },
  nameContainer: {
    backgroundColor: COLORS.cocoGray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    // borderWidth: 1,
    maxWidth: getWidth(62),
    minWidth: getWidth(38),
  },
  commentPic: {
    width: getWidth(45),
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

    paddingLeft: getWidth(12),
    // backgroundColor: "white",
    // flex: 1,
    flexDirection: "row",
    // justifyContent: "flex-end",
    alignItems: "center",
    borderTopColor: COLORS.cocoGray,
  },
  txtInput: {
    minHeight: 30,
    backgroundColor: COLORS.cocoGray,
    width: "50%",
    borderRadius: 20,
    marginRight: 5,
  },
  imgContainer: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "Gray",
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
    height: getHeight(30),
    backgroundColor: COLORS.white,
  },
  headerEdit: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingLeft: 15,
    alignItems: "center",
    height: getHeight(7),
    // marginBottom: getHeight(2),
    borderTopWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imgEdit: {
    height: getHeight(30),
    width: getWidth(35),
    left: getWidth(4),
    top: getHeight(3),
    borderRadius: 10,
  },
  txtInputEdit: {
    backgroundColor: COLORS.cocoGrey,
    width: "95%",
    height: "35%",
    maxHeight: getHeight(30),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    paddingTop: 10,
    borderColor: COLORS.cocoGrey,
  },
  headerTextEdit: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18,
    left: getWidth(30),
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
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  btnmainEdit: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: getWidth(3),
    marginTop: getHeight(1.5),
    marginBottom: getHeight(0.5),
  },
  reactContainer: {
    flexDirection: "row",
    marginLeft: 15,
    justifyContent: "space-between",
    width: 210,
    // backgroundColor: "red",
  },
  disabledButtonStyle: {
    backgroundColor: "gray",
    opacity: 0.7,
  },
  disabledTextStyle: {
    color: "lightgray",
  },
});

export default CommentReplyFlatList;
