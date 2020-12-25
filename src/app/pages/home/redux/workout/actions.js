import { createActions } from "redux-actions";

export const {
  initialModalBlock,
  nextModalBlock,
  previousModalBlock,
  convertVideo,
  convertIntroduction,
  convertContent,
  setVideo,
} = createActions(
  "INITIAL_MODAL_BLOCK",
  "NEXT_MODAL_BLOCK",
  "PREVIOUS_MODAL_BLOCK",
  "CONVERT_VIDEO",
  "CONVERT_INTRODUCTION",
  "CONVERT_CONTENT",
  "SET_VIDEO",
  { prefix: "WORKOUT" }
);
