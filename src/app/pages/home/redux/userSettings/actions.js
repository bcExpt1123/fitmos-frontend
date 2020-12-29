import { createActions } from "redux-actions";

export const { 
  updateProfile, 
  updateAdminProfile, 
  updateEmail,
  updateOnlyEmail,
  uploadProfileImage,
  deleteProfileImage,
  updatePassword, 
  triggerWorkout,
  triggerNotifiable,
  removeGoogle,
  signInWithGoogle,
  removeFacebook,
  signInWithFacebook
 } = createActions(
  "UPDATE_PROFILE",
  "UPDATE_ADMIN_PROFILE",
  "UPDATE_EMAIL",
  "UPDATE_ONLY_EMAIL",
  "UPLOAD_PROFILE_IMAGE",
  "DELETE_PROFILE_IMAGE",
  "UPDATE_PASSWORD",
  "TRIGGER_WORKOUT",
  "TRIGGER_NOTIFIABLE",
  "REMOVE_GOOGLE",
  "SIGN_IN_WITH_GOOGLE",
  "REMOVE_FACEBOOK",
  "SIGN_IN_WITH_FACEBOOK",
  {
    prefix: "USER_SETTINGS"
  }
);
