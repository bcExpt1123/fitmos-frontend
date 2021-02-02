import { createActions } from "redux-actions";

export const {
  initialize,
  setStep,
  registerWithPassword,
  registerWithFacebook,
  registerWithGoogle,
  registrationRequested,
  registrationSucceeded,
  registrationFailed
} = createActions(
  "INITIALIZE",
  "SET_STEP",
  "REGISTER_WITH_PASSWORD",
  "REGISTER_WITH_FACEBOOK",
  "REGISTER_WITH_GOOGLE",
  "REGISTRATION_REQUESTED",
  "REGISTRATION_SUCCEEDED",
  "REGISTRATION_FAILED",
  { prefix: "REGISTRATION" }
);
