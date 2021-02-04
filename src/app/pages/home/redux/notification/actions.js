import { createActions } from "redux-actions";

export const {
  setItemValue,
  findFollows,
  searchNotifications,
  follow,
  unfollow,
  reject,
  accept,
  block,
  unblock,
  mute,
  unmute
} = createActions(
  "SET_ITEM_VALUE",
  "FIND_FOLLOWS",
  "SEARCH_NOTIFICATIONS",
  "FOLLOW",
  "UNFOLLOW",
  "REJECT",
  "ACCEPT",
  "BLOCK",
  "UNBLOCK",
  "MUTE",
  "UNMUTE",
  { prefix: "NOTIFICATION" }
);
