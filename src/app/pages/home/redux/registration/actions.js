import { createActions } from "redux-actions";

export const {
  initialize,
  setStep,
  registerWithPassword,
  registerWithFacebook,
  registerWithGoogle,
  registerWithApple,
  registrationRequested,
  registrationSucceeded,
  registrationFailed,
  registrationAppleFailed,
} = createActions(
  "INITIALIZE",
  "SET_STEP",
  "REGISTER_WITH_PASSWORD",
  "REGISTER_WITH_FACEBOOK",
  "REGISTER_WITH_GOOGLE",
  "REGISTER_WITH_APPLE",
  "REGISTRATION_REQUESTED",
  "REGISTRATION_SUCCEEDED",
  "REGISTRATION_FAILED",
  "REGISTRATION_APPLE_FAILED",
  { prefix: "REGISTRATION" }
);
