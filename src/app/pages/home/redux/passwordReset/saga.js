import { call, put, takeEvery } from "redux-saga/effects";
import {
  requestPassword,
  passwordResetRequested,
  passwordResetFailed,
  passwordResetSucceeded
} from "./actions";
import { http } from "../../services/api";
import { addAlertMessage, initialAlerts } from "../alert/actions";

const passwordResetRequest = email =>
  http({
    method: "POST",
    app: "user",
    path: "password/reset",
    data: {  email },
    skipAuthentication: true
  });

function* onRequestPassword({ payload }) {
  yield put(passwordResetRequested());
  yield put(initialAlerts());
  try {
    yield call(passwordResetRequest, payload.email);
    yield put(
      addAlertMessage({
        type: "success",
        message: { id: "PasswordReset.Alert.Success" }
      })
    );
    yield put(passwordResetSucceeded());
    // TODO: redirect to login
    payload.history.push("/auth/login");
  } catch (e) {
    console.log(e)
    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "PasswordReset.Alert.Error" }
      })
    );
    yield put(passwordResetFailed());
  }
}

export default function* rootSaga() {
  yield takeEvery(requestPassword, onRequestPassword);
}
