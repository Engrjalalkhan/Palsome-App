import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  Keyboard,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";

import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import FlashMessage from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import GallerySwiper from "react-native-gallery-swiper";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import styles from "./styles";
import ShowReactions from "../ShowReactions";
import ShowLikeModel from "../ShowLikesModel";
import Button from "../../Components/NewButton";
import CommentReactions from "../CommentsReactions";
import NewsFeedText from "../NewsFeedList/NewsFeedText";
import ShowCommentReactions from "../ShowCommentReactions";
import TextInputForComments from "../TextInputForComments";
import EditDeleteCommentModal from "../EditDeleteCommentModal";
import CommentReplyFlatList from "../CommentReplyFlatList/index";

import {
  likeItem,
  postReply,
  unLikeItem,
  postComment,
  editComment,
  fetchReplies,
  updateComment,
  fetchComments,
  comentDeleted,
  removeReplies,
  removeComments,
  removeNewReplies,
  removeNewRepliesAll,
} from "../../Redux/actions/NewsFeedActions";
import { ACTIONS } from "../../Redux/action-types";

import { SITE_URL } from "../../Services/Constants";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { timeDifferenceComments } from "../NewsFeedList/Functions";

import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";

import { HP, WP } from "../../../Utils/Resposive";
import { getHeight } from "../../../Utils/NewResponsive";
import { downloadAndSave } from "../../../Utils/Download";

const ComentModel = React.memo((props) => {
  const {
    item3,
    setIsModel,
    isModell,
    data_target,
    encrypted_id,
    inputFocus,
    setInputFocus,
    reel,
    postID,
    setPlay,
    fromImageGride,
    isReplying,
    setIsReplying,
    replyingName,
    setReplyingName,
    commentId,
    setCommentId,
    fromNewsFeed,
    setFromNewsFeed,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  let flashRef = React.useRef();
  const txtInputRef = React.useRef();
  const flatListRef = React.useRef(null);
  const colorAnim = React.useRef(new Animated.Value(0)).current;

  const [myNewComment, setMyNewComment] = React.useState("");
  const [image, setImage] = React.useState();
  const [isEditDellModal, setIsEditDellModal] = React.useState(false);
  const [myItem, setMyItem] = React.useState(false);
  const [isEditting, setIsEditting] = React.useState(false);
  const [editCommentText, setEditCommentText] = React.useState("");
  const [isComments, setIsComments] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(false);
  const [allComments, setAllComments] = React.useState([]);
  const [replyLoading, setReplyLoading] = useState(false);
  const [myNewReply, setMyNewReply] = useState("");
  const [replyImage, setReplyImage] = useState();
  const [reactionVisible, setReactionVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [replyIndexes, setReplyIndexes] = useState([]);
  const [comments, setComments] = useState(null);
  const [openImage, setOpenImage] = useState();

  const [replyIndex, setReplyIndex] = useState(0);
  const [replyLength, setReplyLength] = useState(0);
  const [hasRepliedMap, setHasRepliedMap] = useState({});
  const [showSaveModel, setShowSaveModal] = useState(false);
  const [shouldShowReplies, setShouldShowReplies] = useState(false);
  const [isEditReplyFocused, setIsEditReplyFocused] = useState(false);
  const [isSinglePictureModell, setIsSinglePictureModell] = useState(false);

  const postLiked = item3?.reaction != null ? true : false;
  const liked = postLiked;

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);
  const replies = useSelector((state) => state.blackNewsF.replies);
  const comment = useSelector((state) => state.blackNewsF.comments);
  const newComment = useSelector((state) => state.blackNewsF.newComment);
  const commentPages = useSelector((state) => state.blackNewsF.commentPages);

  const indexLast = allComments?.findIndex((item) => item?.id === commentId);

  useEffect(() => {
    setReplyIndex(indexLast);
  }, [indexLast]);

  useEffect(() => {
    if (fromNewsFeed) {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(colorAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }),
            Animated.timing(colorAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }),
          ]),
          {
            iterations: 4,
          }
        ).start();
      }, 500);
    }
  }, [comment]);

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef?.current) {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }
    }, 500);
  }, [comment]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#d3d3d3", "#a9a9a9"],
  });

  const myPostId = postID
    ? postID
    : useSelector((state) => state.blackNewsF.myPostId);

  const reelCommentsData = useSelector(
    (state) => state.reelsRed.reelCommentsData
  );

  const editCommmentData = useSelector(
    (state) => state.blackNewsF.editCommmentData
  );

  const commentsLoading = useSelector(
    (state) => state.blackNewsF.commentsLoading
  );

  useEffect(() => {
    if (reel) {
      setComments(reelCommentsData);
    } else {
      setComments(comment);
    }
  }, [reelCommentsData, comment]);

  const chooseImageGallery = () => {
    let options = {
      mediaType: "photo",
      quality: 1,
      noData: true,
      selectionLimit: 1,
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
      setImage(MyObject);
    });
  };

  const submitNewCommentToServer = async () => {
    const formData = new FormData();
    formData.append("comment_text", myNewComment);
    formData.append("post_id", myPostId);
    {
      reel
        ? formData.append("post_type", "reel")
        : formData.append("post_type", "post");
    }
    if (image) {
      formData.append("comment_file", image);
    }
    dispatch(postComment({ token, formData, data_target }));
  };

  const submitNewComment = async () => {
    setImage();
    setMyNewComment("");
    if (data_target == "comment") {
      submitNewCommentToServer();
    } else {
      console.log(data_target, "data");
      submitNewGalleryCommentToServer();
    }
  };

  const submitNewGalleryCommentToServer = async () => {
    const formData = new FormData();
    formData.append("comment_text", myNewComment);
    formData.append("post_id", myPostId);
    formData.append("post_type", "post");
    {
      image && formData.append("comment_file", image);
    }
    try {
      const res = await withoutStringiApiCall2({
        route: "post/gallery_comment",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
      } else if (res.responseCode == 200) {
        dispatch({
          type: ACTIONS.NEW_POST_COMMENT,
          newComment: res.payload.data.comment,
        });
        setImage();
        setMyNewComment("");
      }
    } catch (e) {}
  };

  const showConfirmDialog = () => {
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
    setIsReplying(false);
    let formData = new FormData();
    formData.append("_js_id", myItem.id);
    dispatch(comentDeleted({ formData, token }));
    setAllComments(allComments.filter((comment) => comment.id !== myItem.id));
    setIsEditDellModal(false);
  };

  const editMyComment = () => {
    setIsEditting(true);
    setIsEditDellModal(false);
    dispatch(editComment({ token, id: myItem.id }));
  };

  const updateMyComment = () => {
    let myCommentsArray = [...allComments];
    let myIndex = myCommentsArray.indexOf(myItem);
    let myNewItem = myCommentsArray.find((itm) => {
      if (itm == myItem) {
        itm.comment_text = editCommentText;
        return itm;
      }
    });
    myCommentsArray[myIndex] = myNewItem;

    const formData = new FormData();
    formData.append("js_comment_form-edit-text", editCommentText);
    formData.append("_js_id", editCommmentData.id);
    {
      image && formData.append("comment_file", image);
    }
    dispatch(updateComment({ token, formData }));
    setIsEditting(false);
  };

  const showRepliesFunc = (item, index) => {
    dispatch(removeNewReplies(item.id));
    if (data_target == "comment") {
      dispatch(
        fetchReplies({
          token,
          id: fromImageGride ? item?.encrypted_id : item3?.encrypted_id,
          comm_id: item.id,
          data_target: data_target,
        })
      );
    } else {
      dispatch(
        fetchReplies({
          token,
          id: item?.encrypted_id,
          comm_id: item.id,
          data_target: data_target,
        })
      );
    }

    setReplyIndexes((prevState) => {
      return [prevState, index];
    });
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <ScrollView>
          {!isComments ? (
            <TouchableOpacity
              onPress={() => {
                if (data_target == "comment") {
                  if (commentPages?.current_page != 1) {
                    dispatch(
                      fetchComments({
                        token,
                        id: item3?.encrypted_id,
                        page: commentPages?.current_page - 1,
                        setIsComments,
                        data_target,
                        loadPage: true,
                        setPageLoading,
                      })
                    );
                  } else {
                    setIsComments(true);
                  }
                } else if (data_target == "gallery_comment") {
                  if (commentPages?.current_page != 1) {
                    dispatch(
                      fetchComments({
                        token,
                        id: encrypted_id,
                        page: commentPages?.current_page - 1,
                        setIsComments,
                        data_target,
                        loadPage: true,
                        setPageLoading,
                      })
                    );
                  } else {
                    setIsComments(true);
                  }
                }
              }}
            >
              {pageLoading ? (
                <ActivityIndicator
                  style={styles.loader}
                  size="small"
                  color={COLORS.primary}
                />
              ) : (
                commentPages?.current_page !== 1 && (
                  <Text style={styles.footerTxt}>
                    View Previous Comments ...
                  </Text>
                )
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreTxt}>{t("No more Comments")}</Text>
          )}
        </ScrollView>
      </View>
    );
  };

  const reactChk = (number, bool, reaction) => {
    if (typeof count !== "number" || isNaN(count)) {
      return 1;
    }

    if (bool == true || reaction != null) {
      return number;
    } else {
      return number + 1;
    }
  };

  const likeItemFunc = async (item, index) => {
    let myArray = [...allComments];
    let myIndex = myArray.indexOf(item);

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
    setAllComments(myArray);

    const formData = new FormData();
    formData.append("post_id", myPostId);
    formData.append("comment_id", item.id);
    formData.append("reaction_id", 1);
    formData.append("post_type", "post");

    try {
      const res = await withoutStringiApiCall2({
        route:
          data_target == "comment"
            ? "post/comment/reaction"
            : data_target == "gallery_comment"
            ? "post/gallery_comment/reaction"
            : null,
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
    let myArray = [...allComments];
    let myIndex = myArray.indexOf(item);

    let myNewItem = myArray[myIndex];

    if (!myNewItem.reaction || myNewItem.reaction.reaction_type_id !== id) {
      if (!myNewItem.reaction) {
        myNewItem.comment_reactions_count =
          (myNewItem.comment_reactions_count || 0) + 1; // Ensure to increment
      } else if (myNewItem.reaction.reaction_type_id !== id) {
        // If changing the reaction type, no need to increment the counter again
      }

      myNewItem.reaction = {
        reaction_type_id: id,
      };

      myArray[myIndex] = myNewItem;
      setAllComments(myArray);

      const formData = new FormData();
      formData.append("post_id", myPostId);
      formData.append("comment_id", item.id);
      formData.append("reaction_id", id);
      formData.append("post_type", "post");

      try {
        const res = await withoutStringiApiCall2({
          route:
            data_target == "comment"
              ? "post/comment/reaction"
              : data_target == "gallery_comment"
              ? "post/gallery_comment/reaction"
              : null,
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
    let myArray = [...allComments];
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
        itm.comment_reactions_count = itm.comment_reactions_count - 1;
        return itm;
      }
    });
    myArray[myIndex] = myNewItem;
    setAllComments(myArray);

    const formData = new FormData();
    formData.append("post_id", myPostId);
    formData.append("comment_id", item.id);

    try {
      const res = await withoutStringiApiCall2({
        route:
          data_target == "comment"
            ? "post/comment/reaction/delete"
            : data_target == "gallery_comment"
            ? "post/gallery_comment/reaction/delete"
            : null,
        verb: "POST",
        token: token,
        params: formData,
      });
    } catch (e) {
      console.log("saga deleteComment error -- ", e.toString());
    }
  };

  // const reactionType = async (id, item, index) => {
  //   let myArray = [...allComments];
  //   let myIndex = myArray.indexOf(item);

  //   let myNewItem = myArray.find((itm, ind) => {
  //     if (itm == item) {
  //       itm.comment_reactions_count = reactChk(
  //         itm.comment_reactions_count,
  //         itm.localReacted,
  //         itm.reaction
  //       );

  //       itm.reaction = {
  //         reaction_type_id: id,
  //       };

  //       itm.localReacted = true;
  //       return itm;
  //     }
  //   });

  //   myArray[myIndex] = myNewItem;
  //   setAllComments(myArray);

  //   const formData = new FormData();
  //   formData.append("post_id", myPostId);
  //   formData.append("comment_id", item.id);
  //   formData.append("reaction_id", id);
  //   formData.append("post_type", "post");
  //   try {
  //     const res = await withoutStringiApiCall2({
  //       route:
  //         data_target == "comment"
  //           ? "post/comment/reaction"
  //           : data_target == "gallery_comment"
  //           ? "post/gallery_comment/reaction"
  //           : null,
  //       verb: "POST",
  //       token: token,
  //       params: formData,
  //     });
  //   } catch (e) {
  //     console.log("saga likeComment error -- ", e.toString());
  //   }
  // };

  const chooseImageGalleryReply = () => {
    let options = {
      mediaType: "photo",
      quality: 1,
      noData: true,
      selectionLimit: 1,
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

  const submitNewGalleryReplyToServer = async (commId) => {
    const formData = new FormData();
    formData.append("comment_text", myNewReply);
    formData.append("post_id", myPostId);

    if (reel) {
      formData.append("post_type", "reel");
    } else {
      formData.append("post_type", "post");
    }

    formData.append("comment_id", commId);
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
        console.log("res !== 200 in postReply Gallery ... ", res);
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

  const submitNewReplyToServer = async (commId, target) => {
    const formData = new FormData();
    formData.append("comment_text", myNewReply);
    formData.append("post_id", myPostId);
    formData.append("post_type", "post");
    formData.append("comment_id", commId);

    if (replyImage) {
      formData.append("comment_file", replyImage);
    }

    dispatch(postReply({ token, formData }));

    setReplyImage();
    setMyNewReply("");
    setIsReplying(false);

    setAllComments((prevMessages) => {
      const myArr = [...prevMessages];
      const myItem = myArr[replyIndex];
      // myItem.replies_count += 1;
      myArr[replyIndex] = myItem;
      return myArr;
    });
  };

  const submitNewReply = async (commId) => {
    setMyNewReply("");
    setIsEditReplyFocused(false);
    if (data_target === "comment" || data_target === "gallery_comment") {
      submitNewGalleryReplyToServer(commId);
      submitNewReplyToServer(commId, data_target);
    }
  };

  React.useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  useEffect(() => {
    if (editCommmentData) {
      setEditCommentText(editCommmentData.comment_text);
    }
  }, [editCommmentData]);

  useEffect(() => {
    if (newComment != null) {
      let myCommentsArray = [...allComments];
      let myIndex = myCommentsArray.length - 1;
      let myNewItem = newComment;
      myCommentsArray[myIndex + 1] = myNewItem;
      setAllComments(myCommentsArray);
    }
  }, [newComment]);

  useEffect(() => {
    setCurrentItem([item3]);
  }, [item3]);

  //////////////////////////////////////////is like Modal start/////////////////////////////////
  const [isLikeModell, setIsLikeModell] = useState(false);
  const [allReactions, setAllReactions] = useState(null);

  const fetchPostReactions = async () => {
    const res = await withoutStringiApiCall2({
      route: `reactedusers/popover?item_type=post&id=${myPostId}`,
      verb: "GET",
      token: token,
    });
    const allReactions = {
      like: currentItem.like,
      haha: currentItem.haha,
      sad: currentItem.sad,
      wow: currentItem.wow,
      heart: currentItem.heart,
      angry: currentItem.angry,
    };
    setAllReactions(res.payload.data);
    setIsLikeModell(true);
  };

  const closelikeModel = () => {
    setIsLikeModell(false);
  };

  const unLikepostFunc = (item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3?.[0].id);
    dispatch(unLikeItem({ token, formData }));

    let myArray = [...item3];

    let myNewItem = myArray.map((itm, ind) => {
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
      itm.post_reactions_count = itm.post_reactions_count - 1;
      return itm;
    });

    setCurrentItem(myNewItem);
  };

  const postreactionType = (id, item3, index) => {
    const formData = new FormData();
    formData.append("post_id", item3?.[0].id);
    formData.append("reaction_id", id);
    formData.append("post_type", "post");
    dispatch(likeItem({ token, formData }));

    let myArray = [...item3];

    let myNewItem = myArray.map((itm, ind) => {
      if (itm?.reaction?.reaction_type_id == 1) {
        let like = itm?.like?.filter((i) => i.user_id != userData.id);
        itm.like = like;
      }
      if (itm?.reaction?.reaction_type_id == 2) {
        let heart = itm?.heart?.filter((i) => i.user_id != userData.id);
        itm.heart = heart;
      }
      if (itm?.reaction?.reaction_type_id == 3) {
        let haha = itm?.haha?.filter((i) => i.user_id != userData.id);
        itm.haha = haha;
      }
      if (itm?.reaction?.reaction_type_id == 4) {
        let wow = itm?.wow?.filter((i) => i.user_id != userData.id);
        itm.wow = wow;
      }
      if (itm?.reaction?.reaction_type_id == 5) {
        let sad = itm?.sad?.filter((i) => i.user_id != userData.id);
        itm.sad = sad;
      }
      if (itm?.reaction?.reaction_type_id == 6) {
        let angry = itm?.angry?.filter((i) => i.user_id != userData.id);
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
    });
    setCurrentItem(myNewItem);
  };

  useEffect(() => {
    inputFocus ? txtInputRef?.current?.focus() : null;
  }, []);

  const closeCommentModal = () => {
    setIsModel(false);
    setIsReplying(false);
    dispatch(removeComments());
    dispatch(removeReplies());
    dispatch(removeNewRepliesAll());

    setInputFocus ? setInputFocus(false) : null;
  };

  const onPressReply = (item, index, replyOfreplyItem, replyCount) => {
    setIsReplying(true);
    setIsEditReplyFocused(false);
    setReplyIndex(index);
    setShouldShowReplies(true);
    setFromNewsFeed(true);

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

  const onPressDeleteReply = (item, index) => {
    showRepliesFunc(item, index);
  };

  const onLeftArrowPress = () => {
    setIsEditReplyFocused(false);
  };

  const handleLongPress = () => {
    setShowSaveModal(true);
  };

  const onPressProfile = () => {
    closeCommentModal();
  };

  return (
    <Modal
      key={item3?.id}
      animationIn="slideInUp"
      animationOut="fadeOut"
      backdropOpacity={0.3}
      isVisible={isModell}
      onBackdropPress={closeCommentModal}
      onSwipeComplete={closeCommentModal}
      propagateSwipe
      swipeDirection={["down"]}
      style={[reel && {}, styles.bottomView]}
      onRequestClose={closeCommentModal}
      keyboardAware={true}
    >
      {isEditting ? (
        <SafeAreaView style={styles.containerEdit}>
          <View style={[styles.headerEdit]}>
            <TouchableOpacity
              onPress={() => {
                setIsEditting(false);
                setEditCommentText("");
              }}
            >
              {ICONS.fontAwesome5("arrow-left", COLORS.black, 30)}
            </TouchableOpacity>
            <Text style={styles.headerTextEdit}>{t("Edit Comment")}</Text>
          </View>
          <View>
            <TextInput
              value={editCommentText}
              onChangeText={(val) => setEditCommentText(val)}
              style={styles.txtInputEdit}
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
                  setIsEditting(false);
                  setEditCommentText("");
                }}
              />
              <Button
                buttonstyle={styles.fullbtnEdit}
                textstyle={styles.fullbtnTextEdit}
                text={t("Update")}
                pressFunction={() => {
                  updateMyComment();
                }}
                disabled={!editCommentText || editCommentText.trim() === ""}
                disabledButtonStyle={styles.disabledButtonStyle}
                disabledTextStyle={styles.disabledTextStyle}
              />
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.content}>
          {!reel ? (
            <View style={styles.header}>
              <TouchableWithoutFeedback onPress={() => fetchPostReactions()}>
                <View style={styles.headerInnerView}>
                  {currentItem[0]?.like?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 1 ? (
                    <Image
                      style={styles.icons}
                      source={IMAGES.like_static_fill}
                    />
                  ) : null}
                  {currentItem[0]?.haha?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 3 ? (
                    <Image style={styles.icons} source={IMAGES.haha_static} />
                  ) : null}
                  {currentItem[0]?.sad?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 5 ? (
                    <Image style={styles.icons} source={IMAGES.sad_static} />
                  ) : null}
                  {currentItem[0]?.wow?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 4 ? (
                    <Image style={styles.icons} source={IMAGES.wow_static} />
                  ) : null}
                  {currentItem[0]?.heart?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 2 ? (
                    <Image style={styles.icons} source={IMAGES.love_static} />
                  ) : null}
                  {currentItem[0]?.angry?.length > 0 ||
                  currentItem[0]?.reaction?.reaction_type_id == 6 ? (
                    <Image style={styles.icons} source={IMAGES.angry_static} />
                  ) : null}
                  <Text
                    style={{ fontSize: 19, fontWeight: "700", marginLeft: 3 }}
                  >
                    {currentItem[0]?.post_reactions_count}
                    {console.log(currentItem[0]?.post_reactions_count)}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <ShowReactions
                visible={reactionVisible}
                close={() => setReactionVisible(false)}
                function={() => console.log("check Reaction")}
                height={1}
                reactionType={(id) => postreactionType(id, currentItem)}
              />

              {liked && currentItem[0]?.reaction?.reaction_type_id == 2 ? (
                <TouchableOpacity
                  onLongPress={(e) => {
                    setReactionVisible(!reactionVisible);
                  }}
                  onPress={(e) => unLikepostFunc(currentItem)}
                  style={styles.commentView}
                >
                  <Image
                    source={IMAGES.love_static}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              ) : liked && currentItem[0]?.reaction?.reaction_type_id == 3 ? (
                <TouchableOpacity
                  onLongPress={(e) => {
                    setReactionVisible(!reactionVisible);
                  }}
                  onPress={(e) => unLikepostFunc(currentItem)}
                  style={styles.commentView}
                >
                  <Image
                    source={IMAGES.haha_static}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              ) : liked && currentItem[0]?.reaction?.reaction_type_id == 4 ? (
                <TouchableOpacity
                  onLongPress={(e) => {
                    setReactionVisible(!reactionVisible);
                  }}
                  onPress={(e) => unLikepostFunc(currentItem)}
                  style={styles.commentView}
                >
                  <Image
                    source={IMAGES.wow_static}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              ) : liked && currentItem[0]?.reaction?.reaction_type_id == 5 ? (
                <TouchableOpacity
                  onLongPress={(e) => {
                    setReactionVisible(!reactionVisible);
                  }}
                  onPress={(e) => unLikepostFunc(currentItem)}
                  style={styles.commentView}
                >
                  <Image
                    source={IMAGES.sad_static}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              ) : liked && currentItem[0]?.reaction?.reaction_type_id == 6 ? (
                <TouchableOpacity
                  onLongPress={(e) => {
                    setReactionVisible(!reactionVisible);
                  }}
                  onPress={(e) => unLikepostFunc(currentItem)}
                  style={styles.commentView}
                >
                  <Image
                    source={IMAGES.angry_static}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View>
              <Text style={styles.commentText}>{t("Comments")}</Text>
            </View>
          )}

          <ScrollView ref={flatListRef}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              {!commentsLoading ? (
                <>
                  {allComments?.length > 0 ? (
                    <FlatList
                      data={allComments.filter(
                        (comment, index, self) =>
                          index ===
                          self?.findIndex((c) => c?.id === comment?.id)
                      )}
                      keyboardShouldPersistTaps={"handled"}
                      keyExtractor={(item, index) => index.toString()}
                      ListHeaderComponent={renderFooter}
                      renderItem={({ item, index }) => {
                        return (
                          <View>
                            <View style={styles.flatlistcontainer}>
                              <View style={styles.flatlistInnerCont}>
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
                                  <FastImage
                                    style={styles.userProfileImage}
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
                                  <Animated.View
                                    style={[
                                      styles.bottomContainer,
                                      {
                                        backgroundColor:
                                          fromNewsFeed && item?.id === commentId
                                            ? backgroundColor
                                            : "white",
                                      },
                                    ]}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          fontWeight: "700",
                                        }}
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
                                      {item?.comment_text ? (
                                        <View
                                          style={{
                                            marginLeft: -9,
                                          }}
                                        >
                                          <NewsFeedText
                                            txt={item?.comment_text}
                                          />
                                        </View>
                                      ) : null}
                                      {item?.comment_file ? (
                                        <>
                                          <TouchableWithoutFeedback
                                            onPress={() => {
                                              setIsSinglePictureModell(true),
                                                setOpenImage(
                                                  item?.comment_file
                                                );
                                            }}
                                          >
                                            <FastImage
                                              resizeMode="contain"
                                              style={styles.imageInComment}
                                              source={{
                                                uri:
                                                  SITE_URL + item?.comment_file,
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
                                            <View
                                              style={{
                                                position: "absolute",
                                                right: 10,
                                                top: getHeight(7),
                                                zIndex: 1000,
                                                alignItems: "center",
                                                flexDirection: "row",
                                              }}
                                            >
                                              <TouchableOpacity
                                                style={{ padding: 10 }}
                                                onPress={handleLongPress}
                                              >
                                                {ICONS.entypo(
                                                  "dots-three-horizontal",
                                                  COLORS.grey,
                                                  35
                                                )}
                                              </TouchableOpacity>

                                              <TouchableOpacity
                                                style={{ padding: 10 }}
                                                onPress={() =>
                                                  setIsSinglePictureModell(
                                                    false
                                                  )
                                                }
                                              >
                                                {ICONS.materialIcons(
                                                  "cancel",
                                                  COLORS.primary,
                                                  33
                                                )}
                                              </TouchableOpacity>
                                            </View>

                                            <GallerySwiper
                                              images={[
                                                {
                                                  uri: SITE_URL + openImage,
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
                                              onLongPress={handleLongPress}
                                            />

                                            {showSaveModel && (
                                              <Modal
                                                visible={showSaveModel}
                                                hasBackdrop={true}
                                                animationInTiming={2000}
                                                onBackdropPress={() =>
                                                  setShowSaveModal(false)
                                                }
                                                style={{
                                                  margin: 0,
                                                  justifyContent: "flex-end",
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0.1)",
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
                                                      const url =
                                                        SITE_URL +
                                                        item?.comment_file;

                                                      flashRef.current.showMessage(
                                                        {
                                                          message:
                                                            t("Saving..."),
                                                          type: "info",
                                                        }
                                                      );

                                                      downloadAndSave(
                                                        url,
                                                        (res) => {
                                                          if (res)
                                                            flashRef.current.showMessage(
                                                              {
                                                                message:
                                                                  t(
                                                                    "Saved successfully"
                                                                  ),
                                                                type: "success",
                                                              }
                                                            );
                                                        }
                                                      );
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
                                                backgroundColor:
                                                  COLORS.secondary,
                                              }}
                                            />
                                          </Modal>
                                        </>
                                      ) : null}
                                    </View>
                                  </Animated.View>
                                  <View style={styles.reactContainer}>
                                    {item?.created_at.endsWith("000000Z") ? (
                                      <Text style={{ marginTop: 4 }}>
                                        {timeDifferenceComments(
                                          item.created_at
                                        )}
                                      </Text>
                                    ) : (
                                      <Text style={{ marginTop: 4 }}>
                                        {timeDifferenceComments(
                                          item.created_at
                                        )}
                                      </Text>
                                    )}

                                    <CommentReactions
                                      likePress={() => {
                                        likeItemFunc(item, index);
                                      }}
                                      unLikePress={() => {
                                        unLikeItemFunc(item, index);
                                      }}
                                      likesCount={item.comment_reactions_count}
                                      replyPress={() => {
                                        onPressReply(
                                          item,
                                          index,
                                          null,
                                          item?.replies_count
                                        );
                                      }}
                                      color={COLORS.primary}
                                      liked={
                                        item.reaction != null ? true : false
                                      }
                                      reactionID={
                                        item?.reaction?.reaction_type_id
                                      }
                                      reactionType={(id) =>
                                        reactionType(id, item, index)
                                      }
                                    />

                                    <ShowCommentReactions
                                      reaction={item.reaction}
                                      post_reactions_count={
                                        item.comment_reactions_count
                                      }
                                      comments_count={
                                        item.comments_count + item.replies_count
                                      }
                                      like={item.like}
                                      heart={item.heart}
                                      haha={item.haha}
                                      wow={item.wow}
                                      sad={item.sad}
                                      angry={item.angry}
                                      fontColor={COLORS.black}
                                      pressfunction={() => {
                                        onPressProfile();
                                      }}
                                      commentId={item?.id}
                                      data_target={data_target}
                                    />
                                  </View>

                                  {setReplyLength(item?.replies_count)}
                                  {item?.replies_count &&
                                  !replyIndexes.includes(index) ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        showRepliesFunc(item, index);
                                        // setCommentId(item?.id);
                                        setReplyLoading(true);
                                        setHasRepliedMap({
                                          ...hasRepliedMap,
                                          [item?.id]: false,
                                        });
                                      }}
                                    >
                                      {hasRepliedMap[item?.id] ? null : (
                                        <Text
                                          style={{
                                            color: COLORS.red,
                                            marginTop: 4,
                                            marginLeft: 13,
                                          }}
                                        >
                                          {t("Show Replies")} (
                                          {item?.replies_count})
                                        </Text>
                                      )}
                                    </TouchableOpacity>
                                  ) : null}
                                </View>
                              </View>
                              {userData.id == item?.user?.id && (
                                <TouchableOpacity
                                  style={{
                                    height: 40,
                                  }}
                                  onPress={() => {
                                    setIsEditDellModal(!isEditDellModal);
                                    setMyItem(item);
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
                            {allComments?.length ? (
                              <CommentReplyFlatList
                                data={replies}
                                comm_id={item.id}
                                item3={item3}
                                data_target={data_target}
                                item={item}
                                onLeftArrowPress={onLeftArrowPress}
                                closeCommentModal={closeCommentModal}
                                replyPress={({ replyOfreplyItem }) => {
                                  onPressReply(
                                    item,
                                    index,
                                    replyOfreplyItem,
                                    item?.replies_count
                                  );
                                }}
                                onPressDelete={() => {
                                  onPressDeleteReply(item, index);
                                }}
                                isEditReplyFocused={isEditReplyFocused}
                                setIsEditReplyFocused={setIsEditReplyFocused}
                                isReplying={isReplying}
                                setIsReplying={setIsReplying}
                                setPlay={setPlay}
                                setIsModel={setIsModel}
                                isModell={isModell}
                                onPressProfile={onPressProfile}
                                commentId={item?.id}
                              />
                            ) : null}
                          </View>
                        );
                      }}
                    />
                  ) : (
                    <View style={styles.flxContainer}>
                      {ICONS.fontAwesome5(
                        "comments",
                        COLORS.lightGray,
                        200,
                        null,
                        null,
                        true
                      )}
                      <Text style={{ fontSize: 23, color: COLORS.grey }}>
                        {t("No comments yet")}
                      </Text>
                      <Text>{t("Be the first to comment")}.</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.flxContainer}>
                  <ActivityIndicator
                    animating={true}
                    size="large"
                    color={COLORS.primary}
                  />
                </View>
              )}
              {image ? (
                <View style={styles.imgContainer}>
                  <Image
                    resizeMode="cover"
                    style={styles.img}
                    source={{ uri: image.uri }}
                  />
                  <TouchableOpacity onPress={() => setImage()}>
                    {ICONS.fontAwesome5("times-circle", COLORS.primary, 25)}
                  </TouchableOpacity>
                </View>
              ) : replyImage ? (
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
              ) : (
                <View />
              )}

              {allReactions !== null && (
                <ShowLikeModel
                  data={allReactions}
                  isLikeModell={isLikeModell}
                  setIsLikeModell={() => {
                    closelikeModel();
                  }}
                />
              )}
            </TouchableOpacity>
          </ScrollView>
          {isReplying ? (
            <TextInputForComments
              cancel={() => {
                setIsReplying(false),
                  setIsEditReplyFocused(false),
                  setFromNewsFeed(false);
              }}
              name={replyingName}
              isReplying={isReplying}
              inputRef={txtInputRef}
              setMyNewComment={setMyNewReply}
              myNewComment={myNewReply}
              image={replyImage}
              chooseImageGallery={chooseImageGalleryReply}
              submitNewComment={() => {
                submitNewReply(commentId), Keyboard.dismiss();
              }}
              placeholder={t("Write a reply here...")}
            />
          ) : (
            !isEditReplyFocused && (
              <TextInputForComments
                isReplying={isReplying}
                inputRef={txtInputRef}
                myNewComment={myNewComment}
                setMyNewComment={setMyNewComment}
                image={image}
                chooseImageGallery={chooseImageGallery}
                submitNewComment={() => {
                  submitNewComment(), Keyboard.dismiss();
                }}
                placeholder={t("Write a comment here...")}
              />
            )
          )}
        </View>
      )}
      <EditDeleteCommentModal
        isEditDellModal={isEditDellModal}
        closePress={() => {
          setIsEditDellModal(false), setIsReplying(false);
        }}
        onPressDell={() => showConfirmDialog()}
        onPressEdit={() => editMyComment()}
      />
    </Modal>
  );
});

export default ComentModel;
