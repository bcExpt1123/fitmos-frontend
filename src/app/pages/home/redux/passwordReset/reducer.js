import { handleActions, combineActions } from "redux-actions";
import {
  passwordResetRequested,
  passwordResetSucceeded,
  passwordResetFailed
} from "./actions";

const initialState = { isRequestingPassword: false };
export default handleActions(
  {
    [passwordResetRequested]: () => ({ isRequestingPassword: true }),

    [combineActions(passwordResetSucceeded, passwordResetFailed)]: () => ({
      isRequestingPassword: false
    })
  },
  initialState
);
