import { createActions } from "redux-actions";

export const {
  initialModalBlock,
  nextModalBlock,
  previousModalBlock,
  convertVideo,
  convertIntroduction,
  convertContent,
  setVideo,
  alternateVideo,
  confirmAlternate,
  confirmModalNo,
  confirmModalYes,
  pulling,
  setPublic,
} = createActions(
  "INITIAL_MODAL_BLOCK",
  "NEXT_MODAL_BLOCK",
  "PREVIOUS_MODAL_BLOCK",
  "CONVERT_VIDEO",
  "CONVERT_INTRODUCTION",
  "CONVERT_CONTENT",
  "SET_VIDEO",
  "ALTERNATE_VIDEO",
  "CONFIRM_ALTERNATE",
  "CONFIRM_MODAL_NO",
  "CONFIRM_MODAL_YES",
  "PULLING",
  "SET_PUBLIC",
  { prefix: "WORKOUT" }
);
