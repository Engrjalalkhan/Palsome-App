import { ACTIONS } from "../../action-types";

const initialState = {
  statusPosted: [],
  editPostData: [],
  timelineData: [],
  editPostLoading: false,
  createPostLoading: false,
  deletePostLoading: false,
  createAlumPostLoading: false,
  editPostId: null,
  comments: [],
  resetComments: [],
  newComment: null,
  myPostId: null,
  sharePost: null,
  editCommmentData: null,
  updatedComment: null,
  newReply: [],
  editReplyData: null,
  likedItems: [],
  videos: [],
  likeCounter: [],
  minusVideos: [],
  commentPages: null,
  gallerPostData: [],
  replies: [],
  commentsLoading: false,
  friendRequestsList: [],
  friendRequestsNumber: 0,
  userPhotos: {},
  userAlbums: {},
  userAlbumMedia: {},
  index: 0,
  userVideos: {},
  otpTimer: 0,
  otpResendEmail: "",
  otpResendAttempts: 3,
};

const blackNewsFeedRed = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_POST_STATUS:
      return {
        ...state,
        statusPosted: action?.statusPosted?.payload?.data,
      };

    case ACTIONS.SET_POST:
      return {
        ...state,
        editPostData: action?.data,
      };
    case ACTIONS.SET_SHARE:
      return {
        ...state,
        setSharePost: action?.data,
      };
    case ACTIONS.SET_TIMELINE:
      return {
        ...state,
        timelineData: [action?.data],
      };
    case ACTIONS.CLEAR_TIMELINE:
      return {
        ...state,
        timelineData: [],
      };

    case ACTIONS.SET_FOCUSED_TAB_INDEX:
      return { ...state, index: action.payload };

    case ACTIONS.EDIT_POST_LOADING:
      return {
        ...state,
        editPostLoading: action.editPostLoading,
      };
    case ACTIONS.CREATE_POST_LOADING:
      return {
        ...state,
        createPostLoading: action.createPostLoading,
      };
    case ACTIONS.DELETE_POST_LOADING:
      return {
        ...state,
        deletePostLoading: action.deletePostLoading,
      };

    case ACTIONS.CREATE_ALBUM_POST_LOADING:
      return {
        ...state,
        createAlumPostLoading: action.createAlumPostLoading,
      };

    case ACTIONS.EDIT_POST_ID:
      return {
        ...state,
        editPostId: action.editPostId,
      };

    case ACTIONS.SET_COMMENTS:
      return {
        ...state,
        comments: [...action.data, ...state.comments],
        // comments: action.data,
      };

    case ACTIONS.RESET_COMMENTS:
      return {
        ...state,
        resetComments: [], // Reset comments to an empty array
      };

    case ACTIONS.SET_SINGLECOMMENTS:
      return {
        ...state,
        comments: action.data,
      };

    case ACTIONS.REMOVE_COMMENTS:
      return {
        ...state,
        comments: [],
      };

    case ACTIONS.NEW_POST_COMMENT:
      return {
        ...state,
        newComment: action.newComment,
      };

    case ACTIONS.POST_ID:
      return {
        ...state,
        myPostId: action.myPostId,
      };

    case ACTIONS.SET_EDIT_COMMENT:
      return {
        ...state,
        editCommmentData: action.editCommmentData,
      };

    case ACTIONS.UPDATED_COMMENT:
      return {
        ...state,
        updatedComment: action.updatedComment,
      };

    case ACTIONS.SET_REPLIES:
      return {
        ...state,
        // replies: state.replies.concat(action.replies), changes by wazir this was originally line
        replies: action.replies,
      };

    case ACTIONS.REMOVE_REPLIES:
      return {
        ...state,
        replies: [],
      };

    case ACTIONS.NEW_POST_REPLY:
      return {
        ...state,
        newReply: state.newReply.concat(action.newReply),
      };

    case ACTIONS.REMOVE_NEW_POST_REPLY:
      return {
        ...state,
        newReply: state.newReply.filter(
          (item, index) => item.comment_id != action.data
        ),
      };

    case ACTIONS.REMOVE_NEW_POST_REPLY_ALL:
      return {
        ...state,
        newReply: [],
      };

    case ACTIONS.SHARE_POST:
      return {
        ...state,
      };

    case ACTIONS.SET_EDIT_REPLY:
      return {
        ...state,
        editReplyData: action.editReplyData,
      };

    case ACTIONS.UPDATED_COMMENT:
      return {
        ...state,
        updatedReply: action.updatedReply,
      };

    case ACTIONS.ADD_TO_LIKED:
      return {
        ...state,
        likedItems: [...state.likedItems, action.data],
      };

    case ACTIONS.REMOVE_FROM_LIKED:
      return {
        ...state,
        likedItems: state.likedItems.filter(
          (item) => item.id !== action.data.id
        ),
      };

    case ACTIONS.LIKE_COUNTER:
      return {
        ...state,
        likeCounter: [...state.likeCounter, action.data],
      };

    case ACTIONS.REMOVE_LIKE_COUNTER:
      return {
        ...state,
        likeCounter: state.likeCounter.filter(
          (item) => item.id !== action.data.id
        ),
      };

    case ACTIONS.SET_VIDEOS:
      return {
        ...state,
        videos: state.videos.concat(action.data),
      };

    case ACTIONS.COMMENT_PAGES:
      return {
        ...state,
        commentPages: action.commentPages,
      };

    case ACTIONS.SHOW_GALLERY_POSTS_DATA:
      return {
        ...state,
        gallerPostData: action.data,
      };
    case ACTIONS.SET_COMMENTS_LOADING:
      return {
        ...state,
        commentsLoading: action.data,
      };
    case ACTIONS.SET_FRIEND_REQUESTS_LIST:
      return {
        ...state,
        friendRequestsList: action.data,
      };
    case ACTIONS.SET_FRIEND_REQUESTS_NUMBER:
      return {
        ...state,
        friendRequestsNumber: action.data,
      };
    case ACTIONS.SET_USER_PHOTOS:
      return {
        ...state,
        userPhotos: action.data,
      };
    case ACTIONS.SET_USER_ALBUM:
      return {
        ...state,
        userAlbums: action.data,
      };
    case ACTIONS.SET_USER_ALBUM_MEDIA:
      return {
        ...state,
        userAlbumMedia: action.data,
      };

    case ACTIONS.SET_USER_VIDEOS:
      return {
        ...state,
        userVideos: action.data,
      };
    case ACTIONS.INCREMENT_OTP_TIMER:
      return {
        ...state,
        otpTimer: state.otpTimer + 1,
      };
    case ACTIONS.SET_OTP_RESEND_EMAIL:
      return {
        ...state,
        otpResendEmail: action.data,
      };
    case ACTIONS.SET_RESEND_ATTEMPT:
      return {
        ...state,
        otpResendEmail: action.data,
      };
    case ACTIONS.SET_MYSTORY:
      return {
        ...state,
        setStories: action.data,
      };
    default:
      return state;
  }
};

export default blackNewsFeedRed;
