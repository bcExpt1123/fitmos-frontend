import { createActions } from "redux-actions";

export const {
  findFriends,
  setPeople,
} = createActions(
  "FIND_FRIENDS",
  "SET_PEOPLE",
  { prefix: "PEOPLE" }
);
