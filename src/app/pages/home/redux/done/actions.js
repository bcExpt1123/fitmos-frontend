import { createActions } from "redux-actions";

export const {
  doneWorkout,
  setWorkout
} = createActions(
  "DONE_WORKOUT",
  "SET_WORKOUT",
  { prefix: "DONE" }
);
