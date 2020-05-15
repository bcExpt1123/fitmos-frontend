import { all, call, put, select, takeLatest, takeLeading } from "redux-saga/effects";
import {
  authenticate,
  authenticationFailed,
  authenticationRequested,
  authenticationSkipped,
  authenticationSucceeded,
  signInUser,
  generateAuthData,
  reAuthenticate,
  logOut,
  logOuting,
  initialAuth,
  setAuthData,
  sessionIn,
  sessionOut,
} from "./actions";
import {actionTypes} from '../../../../../modules/subscription/benchmark';
//import { setClaims } from '../claims/actions';

import * as User from "../../services/user";
//import * as Claim from '../../services/claim';
import { clear as clearStorage } from "../../services/storage";
import { http } from "../../services/api";
import { actions } from "../../../../../_metronic/ducks/i18n";
import {reactLocalStorage} from 'reactjs-localstorage';

const generateAuth = () =>
  http({ path: `users/accessToken`, method: "POST" }).then(
    response => response.data
  );
function* onGenerateAuth() {
  yield put(authenticationRequested());
  try {
    const { authentication, user } = yield call(generateAuth);
    yield put(
      signInUser({
        authentication,
        user
      })
    );
    yield put(authenticationSucceeded());
  } catch (error) {
    yield put(authenticationFailed());
  }
}
function* onAuthenticate() {
  const accessToken = yield select(store => store.auth.accessToken);
  if (!accessToken) {
    yield put(authenticationSkipped());
    return;
  }

  yield put(authenticationRequested());
  try {
    const [user] = yield all([call([User, "get"])]);

    yield put(signInUser({ user }));
    yield put(authenticationSucceeded());
  } catch {
    yield put(authenticationFailed());
  }
}

function* onSignInUser({ payload }) {}
const deleteRefreshToken = async () =>
  http({
    method: "delete",
    app: "user",
    path: "logout"
  }).catch(() => {});

function* onLogOut() {
  yield put(logOuting());
  yield put(initialAuth());
  try {
    yield call(deleteRefreshToken);
    yield put(actions.setLanguage("es"));
    yield put({
      type: actionTypes.BENCHMARK_SET_VALUE,
      key: "published",
      value: []
    });
  } catch (error) {
    return;
  }

  // Clear cookies
  yield call(clearStorage);
  yield put(initialAuth());
  // Reload the page
  //yield call([window.location, 'assign'], states.home());
  if(document.location.pathname=="/pricing")document.location.href="/";
}
const sessionInAction = () =>
  http({ path: `sessions/inside`, method: "POST" }).then(
    response => response.data
  );
function* onSessionIn(){
  try {
    const result = yield call(sessionInAction);
  } catch (error) {
    return;
  }
}
const sessionOutAction = () =>
  http({ path: `sessions/outside`, method: "POST" }).then(
    response => response.data
  );
function* onSessionOut(){
  try {
    yield call(sessionOutAction);
  } catch (error) {
    return;
  }
}
export default function* rootSaga() {
  yield all([
    takeLatest(authenticate, onGenerateAuth),
    takeLatest(logOut, onLogOut),
    takeLeading(sessionIn,onSessionIn),
    takeLeading(sessionOut,onSessionOut),
  ]);
}
