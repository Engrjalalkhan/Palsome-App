import {
  postStatusApiCall,
  commentDeleteApiCall,
  commentUpdateApiCall,
  settingsApiCall,
  singlePostApiCall,
  withoutStringiApiCall,
  friendsSuggesionSideBar,
  withoutStringiApiCall2,
} from "../../Services/Apis";
import { ACTIONS } from "../action-types";
import { put, putResolve, takeLatest } from "redux-saga/effects";
import {
  setColoredPatterns,
  setComments,
  setCommentsLoading,
  setEditPost,
  setFriendRequestList,
  setFriendRequestNumber,
  setNewsFeed,
  setSingleComments,
  setSinglePost,
  setTimeline,
  setUserAlbum,
  setUserAlbumMedia,
  setUserPhotos,
  setUserVideos,
  setSideBarFriendList,
  showGalleryPostsData,
} from "../actions/NewsFeedActions";

import Toast from "react-native-simple-toast";

function* fetchNewsFeed(params) {
  console.log("saga params", params.data.notsPaginationNumber);
  params?.data?.setPagingLoader ? params?.data?.setPagingLoader(true) : null;
  try {
    const res = yield settingsApiCall({
      route: `notifications?per_page=${params.data.notsPaginationNumber}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      params?.data?.setPagingLoader
        ? params?.data?.setPagingLoader(false)
        : null;
      params?.data?.setPaginationEnable
        ? params?.data?.setPaginationEnable(false)
        : null;
      if (res?.payload?.data?.session_expired == true) {
        params?.data?.navigation?.navigate("SessionExpiredScreen");
      }
    } else if (res.responseCode == 200) {
      console.log("re new", res.payload.data.all_notifications.total);
      params.data.notsPaginationNumber >
      res.payload.data.all_notifications.total
        ? params?.data?.setPaginationEnable
          ? params?.data?.setPaginationEnable(false)
          : null
        : null;
      yield put(setNewsFeed(res.payload.data.all_notifications.data));
      params?.data?.setPagingLoader
        ? params?.data?.setPagingLoader(false)
        : null;
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchNewsFeedSaga() {
  yield takeLatest(ACTIONS.FETCH_NEWS_FEED, fetchNewsFeed);
}

function* postStatusNf(body) {
  yield put({
    type: ACTIONS.CREATE_POST_LOADING,
    createPostLoading: true,
  });
  try {
    const res = yield postStatusApiCall({
      route: "news_feed",
      // post/share
      verb: "POST",
      token: body.data.token,
      body: body.data.formData,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      yield put({ type: ACTIONS.SUCCESS_MESSAGE, successMessage: null });
      yield put({
        type: ACTIONS.CREATE_POST_LOADING,
        createPostLoading: false,
      });
    } else if (res.responseCode == 200) {
      console.log("res - -", res);
      body?.data?.postHasVideo
        ? null
        : yield putResolve({
            type: ACTIONS.UPDATE_POST_STATUS,
            statusPosted: res,
          });
      yield put({
        type: ACTIONS.CREATE_POST_LOADING,
        createPostLoading: false,
      });

      body?.data?.postHasVideo
        ? Toast.show(
            "Your video post is being processed. We'll let you know when it's ready",
            Toast.SHORT
          )
        : Toast.show("Post added successfully", Toast.SHORT);

      body?.data?.refresh ? body?.data?.refresh() : null;
    }
  } catch (e) {
    console.log("saga post status error -- ", e.toString());
  }
}

export function* postStatusSaga() {
  yield takeLatest(ACTIONS.POST_STATUS, postStatusNf);
}

function* comentDeleted(body) {
  try {
    const res = yield commentDeleteApiCall({
      route: "post/comment/delete",
      verb: "POST",
      token: body.data.token,
      body: body.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      console.log(res);
      yield put({ type: ACTIONS.SUCCESS_MESSAGE, successMessage: null });
      Toast.show("You are not authorized to delete this comment!", Toast.LONG);
    } else if (res.responseCode == 200) {
      yield putResolve({ type: ACTIONS.SUCCESS_MESSAGE, successMessage: res });
      Toast.show("Your comment deleted successfully", Toast.SHORT);
      console.log(res);
    }
  } catch (e) {
    console.log("saga delete comment error -- ", e.toString());
  }
}

export function* commentDeletedSaga() {
  yield takeLatest(ACTIONS.DELETED_COMMENT, comentDeleted);
}

function* fetchColoredPatterns(token) {
  try {
    const res = yield settingsApiCall({
      route: "color_pattern?action=fetch-colorPattern",
      verb: "GET",
      token: token.data,
    });
    console.log("res from saga -- ", res);
    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
    } else if (res.responseCode == 200) {
      yield put(setColoredPatterns(res.payload.data.colored_patterns));
      console.log(res.payload.data);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}

export function* fetchPattersSaga() {
  yield takeLatest(ACTIONS.COLORED_PATTERNS, fetchColoredPatterns);
}

function* fetchSinglePost({ data }) {
  // console.log(data.token);
  data?.setLoading ? data?.setLoading(true) : null;
  try {
    const res = yield singlePostApiCall({
      route: data.url,
      verb: "GET",
      token: data.token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      data?.setLoading ? data?.setLoading(false) : null;
    } else if (res.responseCode == 200) {
      yield put(setSinglePost(res.payload.data));

      data?.setLoading ? data?.setLoading(false) : null;
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
    data?.setLoading ? data?.setLoading(false) : null;
  }
}

export function* fetchSinglePostSaga() {
  yield takeLatest(ACTIONS.FETCH_SINGLE_POST, fetchSinglePost);
}

function* deletePost(params) {
  yield put({ type: ACTIONS.DELETE_POST_LOADING, deletePostLoading: true });

  try {
    const res = yield settingsApiCall({
      route: "delete_post/" + params.data.id,
      verb: "DELETE",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Error in deleting post", Toast.SHORT);
    } else if (res.responseCode == 200) {
      console.log("response", res.message);

      // params.data.setDeleteBool(true);
      yield put({
        type: ACTIONS.DELETE_POST_LOADING,
        deletePostLoading: false,
      });
      Toast.show("Post deleted successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga deletePost error -- ", e.toString());
    yield put({
      type: ACTIONS.DELETE_POST_LOADING,
      deletePostLoading: false,
    });
    Toast.show("Error deleting post", Toast.SHORT);
  }
}

export function* deletePostSaga() {
  yield takeLatest(ACTIONS.DELETE_POST, deletePost);
}

function* editPost(params) {
  try {
    const res = yield settingsApiCall({
      route: "news_feed/" + params.data.id + "/edit",
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in edit post ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in edit post ", res.payload.data.post.media);
      yield put(setEditPost(res.payload.data));
    }
  } catch (e) {
    console.log("saga editPost error -- ", e.toString());
  }
}

export function* editPostSaga() {
  yield takeLatest(ACTIONS.EDIT_POST, editPost);
}

function* updatePost(params) {
  console.log("added video", params?.data?.videoAdded);
  yield put({ type: ACTIONS.EDIT_POST_LOADING, editPostLoading: true });

  try {
    const res = yield withoutStringiApiCall2({
      route: "news_feed/" + params.data.id + "/update",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in edit post ... ", res);
      yield put({ type: ACTIONS.EDIT_POST_LOADING, editPostLoading: false });
      Toast.show("Post update fail", Toast.SHORT);
    } else if (res.responseCode == 200) {
      console.log("response in update post ", res.payload.data);
      yield put({ type: ACTIONS.EDIT_POST_LOADING, editPostLoading: false });
      params?.data?.videoAdded
        ? null
        : yield put({
            type: ACTIONS.EDIT_POST_ID,
            editPostId: res.payload.data.post.id,
          });
      params?.data?.videoAdded
        ? Toast.show(
            "Your video post is being processed. We'll let you know when it's ready",
            Toast.SHORT
          )
        : Toast.show("Post updated successfully", Toast.SHORT);

      params?.data?.refresh ? params?.data?.refresh() : null;
    }
  } catch (e) {
    yield put({ type: ACTIONS.EDIT_POST_LOADING, editPostLoading: false });
    Toast.show("Post update fail", Toast.SHORT);
    console.log("saga updatePost error -- ", e.toString());
  }
}

export function* updatePostSaga() {
  yield takeLatest(ACTIONS.UPDATE_POST, updatePost);
}

function* getTimeline(params) {
  params?.data?.setLoadingTimeLine
    ? params?.data?.setLoadingTimeLine(true)
    : null;
  try {
    const res = yield settingsApiCall({
      route:
        "timeline/" + params.data.userId + "?page=" + params.data.currentPage,
      verb: "GET",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 ... ", res);
      params?.data?.setLoadingTimeLine
        ? params?.data?.setLoadingTimeLine(false)
        : null;
    } else if (res.responseCode == 200) {
      console.log("response in getTimeline Sucess", res.responseCode);
      yield put(setTimeline(res.payload.data));
      yield params.data.setConcatTimelineData(
        params.data.concatTimelineData.concat(
          res.payload.data?.singlePost?.data
        )
      );
      // console.log("singlePost", res.payload.data?.singlePost);
      yield params.data.setPaginationData({
        current_page: res.payload.data?.singlePost?.current_page,
        last_page: res.payload.data?.singlePost?.last_page,
        total: res.payload.data?.singlePost?.total,
      });

      yield params.data.setIsTimelineData(true);
      params?.data?.setLoadingTimeLine
        ? params?.data?.setLoadingTimeLine(false)
        : null;
    }
  } catch (e) {
    // params?.data?.setLoadingTimeLine(false);

    console.log("saga getTimeline error -- ", e.toString());
  }
}

export function* getTimelineSaga() {
  yield takeLatest(ACTIONS.GET_TIMELINE, getTimeline);
}

function* fetchComments(params) {
  params?.data?.loadPage ? null : yield put(setCommentsLoading(true));
  // console.log("params", params);
  params?.data?.setPageLoading ? params?.data?.setPageLoading(true) : null;
  try {
    const res = yield settingsApiCall({
      route:
        "post/comment/fetch?post_id=" +
        params.data.id +
        "&data_target=" +
        params.data.data_target +
        "&page=" +
        params.data.page,
      verb: "GET",
      token: params?.data?.token,
    });

    if (res?.responseCode !== 200) {
      params?.data?.loadPage ? null : yield put(setCommentsLoading(false));
      params?.data?.setPageLoading ? params?.data?.setPageLoading(false) : null;
      console.log("res !== 200 in fetchComments ... ", res);
    } else if (res?.responseCode == 200) {
      console.log("Comments data", res.responseCode);
      params?.data?.setPageLoading ? params?.data?.setPageLoading(false) : null;
      params?.data?.loadPage ? null : yield put(setCommentsLoading(false));

      yield put(setComments(res?.payload?.data?.comments?.data));
      yield put({
        type: ACTIONS.COMMENT_PAGES,
        commentPages: {
          current_page: res.payload?.data?.comments?.current_page,
          last_page: res?.payload?.data?.comments?.last_page,
        },
      });
    }
  } catch (e) {
    console.log("saga fetchComments error --- ", e.toString());
  }
}

export function* fetchCommentsSaga() {
  yield takeLatest(ACTIONS.FETCH_COMMENTS, fetchComments);
}

function* postComment(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/comment",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in postComment ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in postComment", res.payload.data.comment);
      yield put({
        type: ACTIONS.NEW_POST_COMMENT,
        newComment: res.payload.data.comment,
      });
    }
  } catch (e) {
    console.log("saga postComment error -- ", e.toString());
  }
}

export function* postCommentSaga() {
  yield takeLatest(ACTIONS.POST_COMMENT, postComment);
}

function* editComment(params) {
  console.log("edit comment . . .");
  try {
    const res = yield settingsApiCall({
      route: "post/comment/edit?id=" + params.data.id,
      verb: "GET",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in editComment ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in editComment", res.payload.data.comment);
      yield put({
        type: ACTIONS.SET_EDIT_COMMENT,
        editCommmentData: res.payload.data.comment,
      });
    }
  } catch (e) {
    console.log("saga editComment error -- ", e.toString());
  }
}

export function* editCommentSaga() {
  yield takeLatest(ACTIONS.EDIT_COMMENT_DATA, editComment);
}

function* updateComment(params) {
  console.log("updating comment . . .");
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/comment/update",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in updateComment ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in updateComment", res.payload.data.comment);
      yield put({
        type: ACTIONS.UPDATED_COMMENT,
        updatedComment: res.payload.data.comment,
      });
    }
  } catch (e) {
    console.log("saga updateComment error -- ", e.toString());
  }
}

export function* updateCommentSaga() {
  yield takeLatest(ACTIONS.UPDATE_COMMENT, updateComment);
}

function* fetchReplies(params) {
  try {
    const res = yield settingsApiCall({
      route:
        "post/comment-replies/fetch?post_id=" +
        params.data.id +
        "&comment_id=" +
        params.data.comm_id +
        "&data_target=comment",
      verb: "GET",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in fetchReplies ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in fetchReplies", res.payload.data.replies.data);
      yield put({
        type: ACTIONS.SET_REPLIES,
        replies: res.payload.data.replies.data,
      });
    }
  } catch (e) {
    console.log("saga fetchReplies error -- ", e.toString());
  }
}

export function* fetchRepliesSaga() {
  yield takeLatest(ACTIONS.FETCH_REPLIES, fetchReplies);
}

function* postReply(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/comment/reply",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in postReply ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in postReply", res.payload.data.comment_reply);
      yield put({
        type: ACTIONS.NEW_POST_REPLY,
        newReply: res.payload.data.comment_reply,
      });
    }
  } catch (e) {
    console.log("saga postReply error -- ", e.toString());
  }
}

export function* postReplySaga() {
  yield takeLatest(ACTIONS.POST_REPLY, postReply);
}

function* editReply(params) {
  console.log("edit reply . . .");
  try {
    const res = yield settingsApiCall({
      route: "post/comment_reply/edit?id=" + params.data.id,
      verb: "GET",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in editReply ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in editReply", res.payload.data.comment);
      yield put({
        type: ACTIONS.SET_EDIT_REPLY,
        editReplyData: res.payload.data.comment,
      });
    }
  } catch (e) {
    console.log("saga editReply error -- ", e.toString());
  }
}

export function* editReplySaga() {
  yield takeLatest(ACTIONS.EDIT_REPLY_DATA, editReply);
}

function* updateReply(params) {
  console.log("updating reply . . .");
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/comment/reply/update",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in updateReply ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in updateReply", res);
      yield put({
        type: ACTIONS.UPDATED_REPLY,
        updatedReply: res.payload.data.comment,
      });
    }
  } catch (e) {
    console.log("saga updateReply error -- ", e.toString());
  }
}

export function* updateReplySaga() {
  yield takeLatest(ACTIONS.UPDATE_REPLY, updateReply);
}

function* sharePost(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/share",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in sharePost ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in sharePost", res);
      Toast.show("Post shared successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga sharePost error -- ", e.toString());
  }
}

export function* sharePostSaga() {
  yield takeLatest(ACTIONS.SHARE_POST, sharePost);
}

function* likeItem(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/reaction",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in likeItem ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in likeItem", res);
    }
  } catch (e) {
    console.log("saga likeItem error -- ", e.toString());
  }
}

export function* likeItemSaga() {
  yield takeLatest(ACTIONS.LIKE_ITEM, likeItem);
}

function* unLikeItem(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "post/reaction/delete",
      verb: "POST",
      token: params?.data?.token,
      params: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in unLikeItem ... ", res);
    } else if (res.responseCode == 200) {
      console.log("response in unLikeItem", res);
    }
  } catch (e) {
    console.log("saga unLikeItem error -- ", e.toString());
  }
}

export function* unLikeItemSaga() {
  yield takeLatest(ACTIONS.UNLIKE_ITEM, unLikeItem);
}

function* fetchVideos(params) {
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;

  try {
    const res = yield settingsApiCall({
      route: `news_feed/video/posts?page=${params?.data?.page}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
      params?.data?.setApiError ? params?.data?.setApiError(res) : null;
      if (res?.payload?.data?.session_expired == true) {
        params?.data?.navigation?.navigate("SessionExpiredScreen");
      }
    } else if (res.responseCode == 200) {
      yield put(res?.payload?.data?.data);
    }
  } catch (e) {
    console.log("saga getVideos error -- ", e.toString());
  }
}
export function* getVideosSaga() {
  yield takeLatest(ACTIONS.FETCH_VIDEOS, fetchVideos);
}

function* showGalleryPost(params) {
  try {
    const res = yield withoutStringiApiCall2({
      route: "users/post/view-modal?post_id=" + params.data.id,
      verb: "Get",
      token: params?.data?.token,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in showGalleryPost ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in showGalleryPost", res.payload.data);
      yield put(showGalleryPostsData(res?.payload?.data));
    }
  } catch (e) {
    console.log("saga showGalleryPost error -- ", e.toString());
  }
}

export function* showGalleryPostSaga() {
  yield takeLatest(ACTIONS.SHOW_GALLERY_POSTS, showGalleryPost);
}

function* getFriendRequestList(params) {
  // console.log("setNumOfReq", params?.data?.setNumOfReq);
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;
  try {
    const res = yield withoutStringiApiCall2({
      route: `friends/requests`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in postgetFriends Suggestion ... ", res);
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
      if (res?.payload?.data?.session_expired == true) {
        params?.data?.navigation?.navigate("SessionExpiredScreen");
      }
    } else if (res.responseCode == 200) {
      // console.log(
      //   "res 200 in Friends request list saga ... ",
      //   res.payload.data.friend_requests.length
      // );
      yield put(setFriendRequestList(res?.payload?.data.friend_requests));
      params?.data?.setNumOfReq
        ? yield put(
            setFriendRequestNumber(res?.payload?.data?.friend_requests.length)
          )
        : null;
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
    }
  } catch (e) {
    params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;
    console.log("saga showGalleryPost error -- ", e.toString());
  }
}

export function* getFriendRequestListSaga() {
  yield takeLatest(ACTIONS.GET_FRIEND_REQUESTS_LIST, getFriendRequestList);
}

function* fetchUserAlbums(params) {
  // console.log("fetching UserAlbums . . .", params);
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;

  try {
    const res = yield settingsApiCall({
      route: `${params?.data?.userName}/albums?page=${params?.data?.currentPage}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      console.log("res !== 200 in getAlbums ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in getAlbums", res.payload);
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      yield put(setUserAlbum(res.payload.data));
    }
  } catch (e) {
    console.log("saga getAlbums error -- ", e.toString());
  }
}
export function* getUserAlbumsSaga() {
  yield takeLatest(ACTIONS.GET_USER_ALBUM, fetchUserAlbums);
}

function* fetchUserAlbumMedia(params) {
  // console.log("fetching UserAlbumMedia . . .", params);
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;

  try {
    const res = yield settingsApiCall({
      route: `${params?.data?.user_name}/album_photos/${params?.data?.encrypted_id}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      console.log("res !== 200 in getAlbums ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in getAlbums", res.payload.data);
      yield put(setUserAlbumMedia(res.payload.data));
    }
  } catch (e) {
    console.log("saga getAlbums error -- ", e.toString());
  }
}
export function* getUserAlbumMediaSaga() {
  yield takeLatest(ACTIONS.GET_USER_ALBUM_MEDIA, fetchUserAlbumMedia);
}

function* fetchUserPhotos(params) {
  // console.log("fetching UserPhotos . . .", params);
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;

  try {
    const res = yield settingsApiCall({
      route: `${params?.data?.userName}/photos?page=${params?.data?.currentPage}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      console.log("res !== 200 in getAlbums ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in getAlbums", res.payload);
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      yield put(setUserPhotos(res.payload.data));
    }
  } catch (e) {
    console.log("saga getAlbums error -- ", e.toString());
  }
}
export function* getUserPhotosSaga() {
  yield takeLatest(ACTIONS.GET_USER_PHOTOS, fetchUserPhotos);
}
function* fetchUserVideos(params) {
  // console.log("fetching UserVideos . . .", params);
  params?.data?.setIsLoading ? params?.data?.setIsLoading(true) : null;

  try {
    const res = yield settingsApiCall({
      route: `${params?.data?.userName}/videos?page=${params?.data?.currentPage}`,
      verb: "GET",
      token: params?.data?.token,
    });
    if (res.responseCode !== 200) {
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      console.log("res !== 200 in getVideos ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in getVideos", res.payload);
      params?.data?.setIsLoading ? params?.data?.setIsLoading(false) : null;

      yield put(setUserVideos(res.payload.data));
    }
  } catch (e) {
    console.log("saga getVideos error -- ", e.toString());
  }
}
export function* getUserVideosSaga() {
  yield takeLatest(ACTIONS.GET_USER_VIDEOS, fetchUserVideos);
}

function* uploadUserPhoto(params) {
  console.log("uploadUserPhoto . . .", params);

  try {
    const res = yield postStatusApiCall({
      route: "save_photos",
      verb: "POST",
      token: params?.data?.token,
      body: params.data.formData,
    });

    if (res.responseCode !== 200) {
      Toast.show("Error uploading", Toast.SHORT);
      console.log("res !== 200 in uploadUserPhoto ... ", res);
    } else if (res.responseCode == 200) {
      // console.log("response in uploadUserPhoto", res.payload);
      Toast.show("Photo uploaded successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga uploadUserPhoto error -- ", e.toString());
  }
}
export function* uploadUserPhotoSaga() {
  yield takeLatest(ACTIONS.UPLOAD_PHOTO, uploadUserPhoto);
}

function* uploadUserVideo(params) {
  console.log("uploadUserVideo . . .", params);
  try {
    const res = yield postStatusApiCall({
      route: "videos",
      verb: "POST",
      token: params?.data?.token,
      body: params.data.formData,
    });

    if (res.responseCode !== 200) {
      Toast.show("Error uploading", Toast.SHORT);
      console.log("res !== 200 in uploadUservideos ... ", res);
    } else if (res.responseCode == 200) {
      Toast.show("Video uploaded successfully", Toast.SHORT);
      // console.log("response in uploadUservideos", res.payload);
    }
  } catch (e) {
    console.log("saga uploadUservideos error -- ", e.toString());
  }
}
export function* uploadUserVideoSaga() {
  yield takeLatest(ACTIONS.UPLOAD_VIDEO, uploadUserVideo);
}
function* uploadUserAlbum(params) {
  console.log("uploadUserAlbum . . .", params);
  try {
    const res = yield postStatusApiCall({
      route: "save_album",
      verb: "POST",
      token: params?.data?.token,
      body: params.data.formData,
    });

    if (res.responseCode !== 200) {
      console.log("res !== 200 in uploadUserAlbum ... ", res);
      Toast.show("Error uploading", Toast.SHORT);
    } else if (res.responseCode == 200) {
      // console.log("response in uploadUserAlbum", res.payload);
      Toast.show("Album uploaded successfully", Toast.SHORT);
    }
  } catch (e) {
    console.log("saga uploadUserAlbum error -- ", e.toString());
  }
}
export function* uploadUserAlbumSaga() {
  yield takeLatest(ACTIONS.UPLOAD_ALBUM, uploadUserAlbum);
}

function* friendsSuggestedSideBar({ token }) {
  const res = yield friendsSuggesionSideBar(token);
  if (res.responseCode !== 200) {
    Toast.show("Error in FreindSuggested data api", Toast.SHORT);
  } else if (res.responseCode == 200) {
    Toast.show("Friends Suggested data", Toast.SHORT);
  }
}

export function* friendSuggested_Side_Bar_Saga() {
  yield takeLatest(ACTIONS.SET_Side_Bar_FRIEND_LIST, friendsSuggestedSideBar);
}
