import { createActions } from "redux-actions";

export const STATUS_PENDING = 0
export const STATUS_SENT = 1
export const STATUS_DELIVERED = 2
export const STATUS_READ = 3

export const GROUP_CHAT_ALERT_TYPE = {
  CREATE: "create"
}

export const {
  setItemValue,
  pushMessage,
  fetchMessages,
  lazyFetchMessages,
  updateMessages,
  deleteAllMessages,
} = createActions(
  "SET_ITEM_VALUE",
  "PUSH_MESSAGE",
  "FETCH_MESSAGES",
  "LAZY_FETCH_MESSAGES",
  "UPDATE_MESSAGES",
  "DELETE_ALL_MESSAGES",
  { prefix: "MESSAGE" }
);
