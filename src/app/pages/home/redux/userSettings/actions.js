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
  triggerNotifiable } = createActions(
  "UPDATE_PROFILE",
  "UPDATE_ADMIN_PROFILE",
  "UPDATE_EMAIL",
  "UPDATE_ONLY_EMAIL",
  "UPLOAD_PROFILE_IMAGE",
  "DELETE_PROFILE_IMAGE",
  "UPDATE_PASSWORD",
  "TRIGGER_WORKOUT",
  "TRIGGER_NOTIFIABLE",
  {
    prefix: "USER_SETTINGS"
  }
);
