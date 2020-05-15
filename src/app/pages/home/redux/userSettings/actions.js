import { createActions } from "redux-actions";

export const { updateProfile, updateAdminProfile, updateEmail } = createActions(
  "UPDATE_PROFILE",
  "UPDATE_ADMIN_PROFILE",
  "UPDATE_EMAIL",
  {
    prefix: "USER_SETTINGS"
  }
);
