import { handleActions } from "redux-actions";
import {
  logInRequested,
  logInSucceeded,
  logInFailed,
  showLogInForm
} from "./actions";

const initialState = {
  isLogInFormVisible: true,
  isLoggingIn: false
};

export default handleActions(
  {
    [logInRequested]: state => ({
      ...state,
      isLoggingIn: true
    }),

    [logInSucceeded]: state => ({
      ...state,
      isLoggingIn: false
    }),

    [logInFailed]: state => ({
      ...state,
      isLoggingIn: false
    }),

    [showLogInForm]: state => ({
      ...state,
      isLogInFormVisible: true
    })
  },
  initialState
);
