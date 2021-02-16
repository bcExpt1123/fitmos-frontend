import { createActions } from "redux-actions";

export const {
  showLogInForm,
  logInWithPassword,
  logInWithFacebook,
  logInWithGoogle,
  logInWithApple,
  logInRequested,
  logInSucceeded,
  logInFailed,
  logInAppleFailed
} = createActions(
  "SHOW_LOG_IN_FORM",
  "LOG_IN_WITH_PASSWORD",
  "LOG_IN_WITH_FACEBOOK",
  "LOG_IN_WITH_GOOGLE",
  "LOG_IN_WITH_APPLE",
  "LOG_IN_REQUESTED",
  "LOG_IN_SUCCEEDED",
  "LOG_IN_FAILED",
  "LOG_IN_APPLE_FAILED",
  { prefix: "LOG_IN" }
);
