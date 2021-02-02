import { createActions } from "redux-actions";

export const { trackError } = createActions("TRACK_ERROR", { prefix: "ERROR" });
