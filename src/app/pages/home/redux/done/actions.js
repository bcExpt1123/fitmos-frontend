import { createActions } from "redux-actions";

export const {
  doneWorkout,
  setWorkout,
  findWorkouts,
  putWorkout,
  initialBlock,
  nextBlock,
  previousBlock,
  doneQuestion,
  fetchSurvey,
  setSurvey,
  submitSurvey,
  startProfileImageUploading,
  endProfileImageUploading,
  setShopMenu,
} = createActions(
  "DONE_WORKOUT",
  "SET_WORKOUT",
  "FIND_WORKOUTS",
  "PUT_WORKOUT",
  "INITIAL_BLOCK",
  "NEXT_BLOCK",
  "PREVIOUS_BLOCK",
  "DONE_QUESTION",
  "FETCH_SURVEY",
  "SET_SURVEY",
  "SUBMIT_SURVEY",
  "START_PROFILE_IMAGE_UPLOADING",
  "END_PROFILE_IMAGE_UPLOADING",
  "SET_SHOP_MENU",
  { prefix: "DONE" }
);
