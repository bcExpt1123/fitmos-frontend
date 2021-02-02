import { createActions } from "redux-actions";

export const { updateProfile } = createActions("UPDATE_PROFILE", {
  prefix: "CUSTOMER_SETTINGS"
});
