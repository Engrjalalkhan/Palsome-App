import { ACTIONS } from "../action-types";

export const fetchNewsFeed = (data) => ({
  type: ACTIONS.FETCH_NEWS_FEED,
  data,
});

export const setNewsFeed = (data) => ({
  type: ACTIONS.SET_NEWS_FEED,
  data,
});

export const setFocusedTabIndex = (index) => {
  return {
    type: ACTIONS.SET_FOCUSED_TAB_INDEX,
    payload: index,
  };
};

export const postStatusNf = (data) => ({
  type: ACTIONS.POST_STATUS,
  data,
});
export const storyStatus = (data) => ({
  type: ACTIONS.STORY_STATUS,
  data,
});
export const notificationEvent = (data) => ({
  type: ACTIONS.PUSH_NOTIFICATION_EVENT,
  data,
});
export const comentDeleted = (data) => ({
  type: ACTIONS.DELETED_COMMENT,
  data,
});
export const saveLanguage = (data) => ({
  type: ACTIONS.SAVE_LANGUAGE,
  data,
});

export const fetchColoredPatterns = (data) => ({
  type: ACTIONS.COLORED_PATTERNS,
  data,
});

export const setColoredPatterns = (data) => ({
  type: ACTIONS.SET_COLORED_PATTERNS,
  data,
});

export const fetchSinglePost = (data) => {
  return {
    type: ACTIONS.FETCH_SINGLE_POST,
    data,
  };
};

export const setSinglePost = (data) => ({
  type: ACTIONS.SET_SINGLE_POST,
  data,
});

export const removeTag = (data) => ({
  type: ACTIONS.REMOVE_TAG,
  data,
});

export const deletePost = (data) => ({
  type: ACTIONS.DELETE_POST,
  data,
});

export const editPost = (data) => ({
  type: ACTIONS.EDIT_POST,
  data,
});

export const setEditPost = (data) => ({
  type: ACTIONS.SET_POST,
  data,
});

export const setSharePost = (data) => ({
  type: ACTIONS.SET_SHARE,
  data,
});

export const getTimeline = (data) => ({
  type: ACTIONS.GET_TIMELINE,
  data,
});
export const clearTimeline = (data) => (
  console.log("Cleared timeline========"),
  {
    type: ACTIONS.CLEAR_TIMELINE,
    data,
  }
);
export const getUserAlbum = (data) => ({
  type: ACTIONS.GET_USER_ALBUM,
  data,
});
export const setUserAlbum = (data) => ({
  type: ACTIONS.SET_USER_ALBUM,
  data,
});
export const getUserAlbumMedia = (data) => ({
  type: ACTIONS.GET_USER_ALBUM_MEDIA,
  data,
});
export const setUserAlbumMedia = (data) => ({
  type: ACTIONS.SET_USER_ALBUM_MEDIA,
  data,
});
export const setUserPhotos = (data) => ({
  type: ACTIONS.SET_USER_PHOTOS,
  data,
});
export const getUserPhotos = (data) => ({
  type: ACTIONS.GET_USER_PHOTOS,
  data,
});
export const getUserVideos = (data) => ({
  type: ACTIONS.GET_USER_VIDEOS,
  data,
});
export const setUserVideos = (data) => ({
  type: ACTIONS.SET_USER_VIDEOS,
  data,
});

export const fetchComments = (data) => ({
  type: ACTIONS.FETCH_COMMENTS,
  data,
});

export const resetComments = () => {
  return {
    type: ACTIONS.RESET_COMMENTS,
  };
};

export const setComments = (data) => ({
  type: ACTIONS.SET_COMMENTS,
  data,
});

export const setSingleComments = (data) => ({
  type: ACTIONS.SET_SINGLECOMMENTS,
  data,
});

export const removeComments = (data) => ({
  type: ACTIONS.REMOVE_COMMENTS,
  data,
});

export const postComment = (data) => ({
  type: ACTIONS.POST_COMMENT,
  data,
});

export const editComment = (data) => ({
  type: ACTIONS.EDIT_COMMENT_DATA,
  data,
});

export const updateComment = (data) => ({
  type: ACTIONS.UPDATE_COMMENT,
  data,
});

export const fetchReplies = (data) => ({
  type: ACTIONS.FETCH_REPLIES,
  data,
});

export const postReply = (data) => ({
  type: ACTIONS.POST_REPLY,
  data,
});

export const editReply = (data) => ({
  type: ACTIONS.EDIT_REPLY_DATA,
  data,
});

export const updateReply = (data) => ({
  type: ACTIONS.UPDATE_REPLY,
  data,
});

export const setTimeline = (data) => ({
  type: ACTIONS.SET_TIMELINE,
  data,
});

export const updatePost = (data) => ({
  type: ACTIONS.UPDATE_POST,
  data,
});

export const sharePost = (data) => ({
  type: ACTIONS.SHARE_POST,
  data,
});

export const PostShare = (data) => ({
  type: ACTIONS.SHARE_POST,
  data,
});

export const likeItem = (data) => ({
  type: ACTIONS.LIKE_ITEM,
  data,
});

export const unLikeItem = (data) => ({
  type: ACTIONS.UNLIKE_ITEM,
  data,
});

export const addToLiked = (data) => ({
  type: ACTIONS.ADD_TO_LIKED,
  data,
});

export const removeFromLiked = (data) => ({
  type: ACTIONS.REMOVE_FROM_LIKED,
  data,
});

export const fetchVideos = (data) => ({
  type: ACTIONS.FETCH_VIDEOS,
  data,
});

export const setVideos = (data) => ({
  type: ACTIONS.SET_VIDEOS,
  data,
});

export const addToLikedCounter = (data) => ({
  type: ACTIONS.LIKE_COUNTER,
  data,
});

export const removeFromLikedCounter = (data) => ({
  type: ACTIONS.REMOVE_LIKE_COUNTER,
  data,
});

export const minusFromVideos = (data) => ({
  type: ACTIONS.MINUS_FROM_VIDEOS,
  data,
});

export const showGalleryPosts = (data) => ({
  type: ACTIONS.SHOW_GALLERY_POSTS,
  data,
});

export const showGalleryPostsData = (data) => ({
  type: ACTIONS.SHOW_GALLERY_POSTS_DATA,
  data,
});

export const removeReplies = (data) => ({
  type: ACTIONS.REMOVE_REPLIES,
  data,
});

export const removeNewReplies = (data) => ({
  type: ACTIONS.REMOVE_NEW_POST_REPLY,
  data,
});

export const removeNewRepliesAll = (data) => ({
  type: ACTIONS.REMOVE_NEW_POST_REPLY_ALL,
  data,
});

export const setNumOfNots = (data) => ({
  type: ACTIONS.SET_NUM_OF_NOTIFICATIONS,
  data,
});

export const setCommentsLoading = (data) => ({
  type: ACTIONS.SET_COMMENTS_LOADING,
  data,
});

export const setStories = (data) => ({
  type: ACTIONS.SET_STORIES,
  data,
});

export const setMyStory = (data) => ({
  type: ACTIONS.SET_MYSTORY,
  data,
});
export const getFriendRequestList = (data) => ({
  type: ACTIONS.GET_FRIEND_REQUESTS_LIST,
  data,
});
export const setFriendRequestList = (data) => ({
  type: ACTIONS.SET_FRIEND_REQUESTS_LIST,
  data,
});
//
export const setSideBarFriendList = (data) => ({
  type: ACTIONS.SET_Side_Bar_FRIEND_LIST,
  data,
});
//
export const setFriendRequestNumber = (data) => ({
  type: ACTIONS.SET_FRIEND_REQUESTS_NUMBER,
  data,
});

export const uploadVideo = (data) => ({
  type: ACTIONS.UPLOAD_VIDEO,
  data,
});
export const uploadAlbum = (data) => ({
  type: ACTIONS.UPLOAD_ALBUM,
  data,
});
export const uploadPhoto = (data) => ({
  type: ACTIONS.UPLOAD_PHOTO,
  data,
});
export const incremtOtpTimer = (data) => ({
  type: ACTIONS.INCREMENT_OTP_TIMER,
  data,
});
