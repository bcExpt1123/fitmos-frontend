import {
  all,
  call,
  delay,
  put,
  select,
  spawn,
  takeLatest,
  takeLeading
} from "redux-saga/effects";
//import { cid, analytics } from '@freeletics/web-package-tracking';
import { http } from "../../services/api";
//import { redirectToLocale } from '../../services/locale';
//import * as Claim from '../../services/claim';
import apiErrorMatcher from "../../../../../lib/apiErrorMatcher";
import Facebook from "../../../../../lib/Facebook";
import Google from "../../../../../lib/Google";

import {
  logInWithPassword,
  logInRequested,
  logInSucceeded,
  logInFailed,
  logInWithFacebook,
  logInWithGoogle
} from "./actions";
import { signInUser } from "../auth/actions";
import { addAlertMessage,initialAlerts } from "../alert/actions";
//import { getNavigation } from '../../navigation';
import { actions } from "../../../../../_metronic/ducks/i18n";
//import { setClaims } from '../claims/actions';
//import { trackError } from '../error/actions';

/* Common functions */

const defaultError = { id: "LogInForm.Error.Api.error" };
const registerError = {id: "LogInForm.Error.Api.error.Register"}
const tooManyRequestsError = { id: "LogInForm.Error.Api.password-invalid" };
const mapApiErrors = apiErrorMatcher(
  [
    {
      field: "password",
      error: "invalid",
      message: { id: "LogInForm.Error.Api.password-invalid" }
    },
    {
      field: "base",
      error: "account_not_confirmed",
      message: { id: "LogInForm.Error.Api.account-not-confirmed" }
    },
    {
      field: "account",
      error: "account_inactive",
      message: { id: "LogInForm.Error.Api.account-inactive" }
    },
    {
      field: "facebook_account",
      error: "taken",
      message: { id: "SettingsForm.Account.FacebookLogin.Error.taken" }
    },
    {
      field: "facebook_account",
      message: { id: "LogInForm.Error.Api.facebook-account-blank" }
    },
    {
      field: "google_account",
      error: "taken",
      message: { id: "SettingsForm.Account.GoogleLogin.Error.taken" }
    },
    {
      field: "google_account",
      message: { id: "LogInForm.Error.Api.google-account-blank" }
    }
  ],
  defaultError
);

export const getApiErrorMessage = error =>
  mapApiErrors(error.response.data.errors);

/* Password */

const passwordRequest = credentials =>
  http({
    method: "POST",
    app: "user",
    path: "login",
    data: credentials,
    skipAuthentication: true
  });

function* onLogInWithPassword({ payload }) {
  let response;
  try {
    response = yield call(passwordRequest, payload);
  } catch (error) {
    switch (error.response.status) {
      case 422:
        return { error: getApiErrorMessage(error) };
      case 401:
        return { error: getApiErrorMessage(error) };
      case 429:
        yield delay(30000);
        return { error: tooManyRequestsError };
      default:
        return { error: defaultError };
    }
  }
  return { response };
}

/* Facebook */

const facebookRequest = facebookUser =>
  http({
    method: "POST",
    app: "user",
    path: "facebook/login",
    data: facebookUser,
    skipAuthentication: true
  });

/*
 Possible errors:
 "fix_invalid_session": facebook session changed in meantime, user needs to reload page
 "app_not_authorized": User denied the permission
*/
export const getFacebookErrorMessage = ({ message }) => {
  const key = {
    fix_invalid_session: "LogInForm.Error.Facebook.invalid",
    app_not_authorized: "LogInForm.Error.Facebook.denied"
  }[message];

  return { id: key || "LogInForm.Error.Facebook.error" };
};

function* onLogInWithFacebook() {
  let accessToken;
  try {
    accessToken = yield call(Facebook.login);
  } catch (error) {
    return { error: getFacebookErrorMessage(error) };
  }

  let response;
  try {
    response = yield call(facebookRequest, { access_token: accessToken });
    if(response.error){
      return { error: registerError };
    }
  } catch (error) {
    switch (error.response.status) {
      case 423:
        return { error: registerError };
      default:
        return { error: getApiErrorMessage(error) };
    }
  }
  return { response };
}

/* Google */

const googleRequest = googleUser =>
  http({
    method: "POST",
    app: "user",
    path: "google/login",
    data: googleUser,
    skipAuthentication: true
  });

/* https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorize-errorcodes */
export const getGoogleErrorMessage = ({ error }) => {
  const key = {
    // idpiframe_initialization_failed: 'error', -- this can only happen on initialization
    popup_blocked_by_browser: "LogInForm.Error.Google.blocked",
    popup_closed_by_user: "LogInForm.Error.Google.cancelled",
    access_denied: "LogInForm.Error.Google.denied"
  }[error];

  return { id: key || "LogInForm.Error.Google.error" };
};

function* onLogInWithGoogle() {
  let googleUser;
  try {
    googleUser = yield call(Google.logIn);
  } catch (error) {
    return { error: getGoogleErrorMessage(error) };
  }

  let response;
  try {
    response = yield call(googleRequest, { access_token: googleUser.id_token });
    if(response.error){
      return { error: registerError };
    }
  } catch (error) {
    switch (error.response.status) {
      case 423:
        return { error: registerError };
      default:
        return { error: getApiErrorMessage(error) };
    }
  }
  return { response };
}

const logInTypes = {
  [logInWithPassword]: {
    provider: "email",
    requestFunction: onLogInWithPassword
  },
  [logInWithFacebook]: {
    provider: "facebook",
    requestFunction: onLogInWithFacebook
  },
  [logInWithGoogle]: {
    provider: "google",
    requestFunction: onLogInWithGoogle
  }
};

// Whole login flow in one saga
function* onLogIn({ type, payload }) {
  const { provider, requestFunction } = logInTypes[type];

  yield put(logInRequested());

  const result = yield call(requestFunction, { payload });
  const { response, error } = result;
  if (error) {
    if(error == registerError){
      yield put(logInFailed());
      payload.history.push('/signup');
      return;
    }
    yield put(addAlertMessage({ type: "error", message: error }));
    yield put(logInFailed());
    // special case - when account is not confirmed redirect to resend confirmation screen instead
    if (error.id === "LogInForm.Error.Api.account-not-confirmed") {
      /*const navigation = yield call(getNavigation);
      yield call(
        [navigation, 'navigate'],
        states.auth.resendConfirmation({ email: payload.email }),
      );*/
    }
    return;
  }

  const { user, authentication } = response.data;

  yield put(
    logInSucceeded({
      provider,
      user,
      authentication,
      returnTo: payload.returnTo
    })
  );

  yield put(
    signInUser({
      authentication,
      user
    })
  );
  yield put(initialAlerts());
  if (user.type == "admin") {
    yield put(actions.setLanguage("en"));
  } else {
    yield put(actions.setLanguage("es"));
  }
  /*try {
    const claims = yield call([Claim, 'findAll']);
    yield put(setClaims({ claims }));
  } catch (err) {
    yield put(trackError(err));
  }
 
  const { returnTo } = payload;
 
  yield spawn([cid, 'trackLogin']);
  yield spawn([analytics, 'track'], 'login', {
    login_method: provider,
  });*/

  try {
    // redirect to customer dashboard when purchase services,
    // redirecdt to pricing page when not purchase services.
  } catch (err) {
    //yield put(trackError(err));
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading([logInWithPassword, logInWithFacebook, logInWithGoogle], onLogIn)
  ]);
}
