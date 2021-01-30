import { createActions } from "redux-actions";

export const {
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  appendComments,
  appendNextComments,
  createReply,
  removePostStore,
  openEditModal,
  closeEditModal,
  findNewsfeed,
  appendNewsfeedBefore,
  appendNewsfeedAfter,
  addNewsfeedBefore,
  addNewsfeedAfter,
  setNewsfeed,
  findCustomerPosts,
  appendCustomerPostsAfter,
  addCustomerPostsAfter,
  setCustomerPosts,
  setItemValue,
  findPost,
  findRandomMedias,
  appendCustomerPostMediasAfter,
  addCustomerPostMediasAfter,
  syncPosts,
} = createActions(
  "CREATE_POST",
  "UPDATE_POST",
  "DELETE_POST",
  "CREATE_COMMENT",
  "UPDATE_COMMENT",
  "DELETE_COMMENT",
  "APPEND_COMMENTS",
  "APPEND_NEXT_COMMENTS",
  "CREATE_REPLY",
  "REMOVE_POST_STORE",
  "OPEN_EDIT_MODAL",
  "CLOSE_EDIT_MODAL",
  "FIND_NEWSFEED",
  "APPEND_NEWSFEED_BEFORE",
  "APPEND_NEWSFEED_AFTER",
  "ADD_NEWSFEED_BEFORE",
  "ADD_NEWSFEED_AFTER",
  "SET_NEWSFEED",
  "FIND_CUSTOMER_POSTS",
  "APPEND_CUSTOMER_POSTS_AFTER",
  "ADD_CUSTOMER_POSTS_AFTER",
  "SET_CUSTOMER_POSTS",
  "SET_ITEM_VALUE",
  "FIND_POST",
  "FIND_RANDOM_MEDIAS",
  "APPEND_CUSTOMER_POST_MEDIAS_AFTER",
  "ADD_CUSTOMER_POST_MEDIAS_AFTER",
  "SYNC_POSTS",
  { prefix: "POST" }
);