import { createActions } from "redux-actions";

export const { logOut } = createActions("LOG_OUT", { prefix: "LOG_OUT" });
