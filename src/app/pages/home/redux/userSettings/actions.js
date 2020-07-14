import { createActions } from "redux-actions";

export const { updateProfile, updateAdminProfile, updateEmail,triggerNotifiable } = createActions(
  "UPDATE_PROFILE",
  "UPDATE_ADMIN_PROFILE",
  "UPDATE_EMAIL",
  "TRIGGER_NOTIFIABLE",
  {
    prefix: "USER_SETTINGS"
  }
);
