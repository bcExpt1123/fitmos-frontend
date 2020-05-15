import { createActions } from "redux-actions";

export const {
  requestPassword,
  passwordResetRequested,
  passwordResetSucceeded,
  passwordResetFailed
} = createActions(
  "REQUEST_PASSWORD",
  "PASSWORD_RESET_REQUESTED",
  "PASSWORD_RESET_SUCCEEDED",
  "PASSWORD_RESET_FAILED",
  { prefix: "PASSWORD_RESET" }
);
