import { all, call, put, takeLatest } from "redux-saga/effects";
//import { cid, analytics, GATracker } from '@freeletics/web-package-tracking';
//import Cookie from "js-cookie";
import { reactLocalStorage } from 'reactjs-localstorage';
import { http } from "../../services/api";
import apiErrorMatcher from "../../../../../lib/apiErrorMatcher";
import Facebook from "../../../../../lib/Facebook";
import Google from "../../../../../lib/Google";
//import { REGISTRATION_STEPS } from '../../constants/registration-steps';

import {
  registrationRequested,
  registrationSucceeded,
  registrationFailed,
  registerWithPassword,
  registerWithFacebook,
  registerWithGoogle,
} from "./actions";
import { addAlertMessage } from "../alert/actions";
import { signInUser } from "../auth/actions";
import { trackError } from "../error/actions";
import { start } from "../checkout/actions";
//import { grantMarketingConsent } from '../marketingConsent/actions';

/* Common functions */

const mapApiErrors = apiErrorMatcher(
  [
    {
      field: "facebook_account",
      error: "taken",
      message: {
        id: "RegistrationForm.Error.Api.error.facebook_account.taken"
      }
    },
    {
      field: "google_account",
      error: "taken",
      message: { id: "RegistrationForm.Error.Api.error.google_account.taken" }
    },
    {
      field: "email",
      error: "blank",
      message: { id: "RegistrationForm.Error.Api.error.email.blank" }
    },
    {
      field: "email",
      error: "invalid",
      message: { id: "RegistrationForm.Error.Api.error.email.invalid" }
    },
    {
      field: "email",
      error: "failed",
      message: { id: "RegistrationForm.Error.Api.error.email.failed" }
    },
    {
      field: "email",
      error: "taken",
      message: { id: "RegistrationForm.Error.Api.error.email.taken" }
    },
    {
      field: "first_name",
      error: "blank",
      message: { id: "RegistrationForm.Error.Api.error.first_name.blank" }
    },
    {
      field: "last_name",
      error: "blank",
      message: { id: "RegistrationForm.Error.Api.error.last_name.blank" }
    },
    {
      field: "password",
      error: "blank",
      message: { id: "RegistrationForm.Error.Api.error.password.blank" }
    },
    {
      field: "terms_acceptance",
      error: "accepted",
      message: {
        id: "RegistrationForm.Error.Api.error.terms_acceptance.accepted"
      }
    }
  ],
  { id: "RegistrationForm.Error.Api.error" }
);

const getApiErrorMessage = error => {
  const errors =
    error && error.response ? error.response.data.errors : undefined;
  const result = mapApiErrors(errors);
  if (result.id === "RegistrationForm.Error.Api.error") {
    if (
      errors &&
      errors.email &&
      errors.email[0] === "The email has already been taken."
    )
      return { id: "RegistrationForm.Error.Api.error.email.taken" };
  }
  return result;
};

/*const getGenderFromAthleteProfile = () => {
  try {
    const cookie = Cookie.get("athlete_profile");
    const athleteProfile = cookie && JSON.parse(cookie);
    const gender = (athleteProfile && athleteProfile.gender) || "u";
    return gender;
  } catch {
    return "u";
  }
};

const updateAthleteProfile = (params, idToken = undefined) =>
  http({
    method: "PATCH",
    app: "bodyweight",
    path: "/v5/athlete/profile.json",
    data: { athlete_profile: params },
    authToken: idToken
  });

const createPersonalizedTrainingPlan = (slug, idToken = undefined) =>
  http({
    method: "POST",
    app: "bodyweight",
    path: `/v5/coach/training_plans/${slug}/personalized_plans.json`,
    authToken: idToken
  });*/

/* Password */

const passwordRequest = ({
  firstName,
  lastName,
  email,
  password,
  gender = "u",
  locale,
  applicationSource = "workout",
  returnTo,
  referralId,
  level,
  place,
  goal,
  birthday,
  weight,
  weightUnit,
  height,
  heightUnit,
  couponCode,
  invitationEmail
}) =>
  http({
    method: "POST",
    app: "user",
    path: "register",
    data: {
      //      user: {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      emails_allowed: true,
      terms_acceptance: true,
      platform_source: "web",
      application_source: applicationSource,
      couponCode,
      invitationEmail,
      //      },
      return_to: returnTo,
      referral_id: referralId
    },
    skipAuthentication: true
  });

/* example response from server:
{
  user: {
    fl_uid: 123,
    created_at: '2019-02-25T22:19:14.864Z',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john+doe@test.com',
    emails_allowed: true,
    locale: 'en',
    gender: 'm',
    picture_urls: {
      large:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/large/X-man.jpg',
      medium:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/medium/X-man.jpg',
      small:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/small/X-man.jpg',
    },
    authentications: { password: true, facebook: false, google: false },
    about: null,
    location: null,
    personalized_marketing_consent: true,
    terms_acceptance: true,
  },
  authentication: {
    audience: 'restricted',
    refresh_token: null,
    id_token:
      'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NTExMzQwNTUsImF1ZCI6WyJyZXN0cmljdGVkIl0sInVzZXJfaWQiOjE5N30.xltCUhQQluri6u8iiaBQFZcjK6cSd6fbRLUCwxrGAF3tRbbc8Tn1vQtAqIKI-icDhwn-Ic9NV5rrlZvwAPuCrEXESjrBGY7FyTD1pkI2AsVqNSUGhi5KOWOyL_R_f1qGNflFZ9DeioSjWe0xAgwAWRMn78asLTQQzqvHwxV08DvOcHH22CGgLiOPClnW_H3j0AGdu3opNEe27QQXMjeqbYY0yR0AYWjO3L44aeoU8oqtBdN6REL5ixWdfZqZNvT79Y-QC5HKd9uRMtGAtR6NQbQC7ROEriheDJV-EfByTbFZet53mdlYhtYXLW_l7LAWoV2e2XHwesIJvRfCGjEo2A',
    expires_in: 900,
  },
};
*/

function* onRegisterWithPassword({ payload }) {
  try {
    const response = yield call(passwordRequest, payload);
    yield put(start());
    return { response };
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }
}

/* Facebook */

const facebookRequest = ({
  accessToken,
  gender = "u",
  applicationSource = "workout",
  returnTo,
  referralId,
  level,
  place,
  goal,
  birthday,
  weight,
  weightUnit,
  height,
  heightUnit,
  couponCode,
  invitationEmail
}) =>
  http({
    method: "POST",
    app: "user",
    path: "facebook/register",
    data: {
      //      user: {
      access_token: accessToken,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      emails_allowed: true,
      terms_acceptance: true,
      platform_source: "web",
      couponCode,
      invitationEmail,
      application_source: applicationSource,
      //      },
      return_to: returnTo,
      referral_id: referralId
    },
    skipAuthentication: true
  });

/* example response from server
{
  user: {
    fl_uid: 2,
    created_at: '2018-10-10T15:40:38.251Z',
    first_name: 'nocoach',
    last_name: 'test',
    email: 'nocoach@test.com',
    emails_allowed: true,
    locale: 'en',
    gender: 'm',
    picture_urls: {
      large:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/large/X-man.jpg',
      medium:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/medium/X-man.jpg',
      small:
        'https://s3-eu-west-1.amazonaws.com/freeletics-storage/small/X-man.jpg',
    },
    authentications: { password: true, facebook: true, google: false },
    about: null,
    location: null,
    personalized_marketing_consent: true,
    terms_acceptance: null,
  },
  authentication: {
    audience: 'standard',
    refresh_token: '39190f288989c54adefc4916abc36e4dca922ec6',
    id_token:
      'eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1NTExMzQxNzQsImF1ZCI6WyJzdGFuZGFyZCJdLCJ1c2VyX2lkIjoyfQ.ypSgvO9qo8riLP8AOWPVRwnLpbpz7mM2r684u_uygdgWP1ZfL9qBYZ4PYp5ovgWE9nB_L6AH0fwHoeXyUsy9qGXpw_hiXAvqFb7gVK33wLzvnP0LAabX5VIyW-CQ22JBPJON3tPo99C_Nqas-sZkVgOjK1EDqXfJFZjRp5yUO6NzeY9Fm-w2q6Pfx7W4prdfIzZXKMPyOHnF7S0jNLiWYMgFJeqH9sT0kWnmPwua3gBGTrBw53tn2bv6qjFJABVxBqUBA0WR5jy1fZqPfNXhnJfxm-kFZ6tYZE25DW549pmc0-qdmnV3wBybYfpL8F4mg8MD6yM2IIIw2UIXOHu0Qw',
    expires_in: 900,
  },
};
*/

/*
 Possible errors:
 "fix_invalid_session": facebook session changed in meantime, user needs to reload page
 "app_not_authorized": User denied the permission
*/
const getFacebookErrorMessage = ({ message }) => {
  const key = {
    fix_invalid_session: "RegistrationForm.Error.Facebook.invalid",
    app_not_authorized: "RegistrationForm.Error.Facebook.denied"
  }[message];

  return { id: key || "RegistrationForm.Error.Facebook.error" };
};

function* onRegisterWithFacebook({ payload }) {
  const {
    gender,
    level,
    place,
    goal,
    info: { birthday, weight, weightUnit, height, heightUnit }
  } = payload.profile;
  //  yield put(registrationRequested());

  let accessToken;
  try {
    accessToken = yield call(Facebook.login);
  } catch (error) {
    return { error: getFacebookErrorMessage(error) };
  }

  let response;
  let couponCode = reactLocalStorage.get('publicCoupon');
  const referralCode = reactLocalStorage.get('referralCode');
  if(referralCode) couponCode = referralCode;
  const invitationEmail = reactLocalStorage.get('invitationEmail');
  //const locale = yield select((store) => store.i18n.lang);
  //const gender = getGenderFromAthleteProfile();
  try {
    response = yield call(facebookRequest, {
      ...payload,
      accessToken,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      couponCode,
      invitationEmail
    });
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }
  return { response };
}

/* Google */

const googleRequest = ({
  accessToken,
  first_name,
  last_name,
  email,
  gender = "u",
  applicationSource = "workout",
  returnTo,
  referralId,
  level,
  place,
  goal,
  birthday,
  weight,
  weightUnit,
  height,
  heightUnit,
  couponCode,
  invitationEmail
}) =>
  http({
    method: "POST",
    app: "user",
    path: "google/register",
    data: {
      //      user: {
      access_token: accessToken,
      first_name,
      last_name,
      email,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      emails_allowed: true,
      terms_acceptance: true,
      platform_source: "web",
      application_source: applicationSource,
      couponCode,
      invitationEmail,
      //      },
      return_to: returnTo,
      referral_id: referralId
    },
    skipAuthentication: true
  });

/* https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorize-errorcodes */
const getGoogleErrorMessage = ({ error }) => {
  const key = {
    // idpiframe_initialization_failed: 'error', -- this can only happen on initialization
    popup_blocked_by_browser: "RegistrationForm.Error.Google.blocked",
    popup_closed_by_user: "RegistrationForm.Error.Google.cancelled",
    access_denied: "RegistrationForm.Error.Google.denied"
  }[error];

  return { id: key || "RegistrationForm.Error.Google.error" };
};

function* onRegisterWithGoogle({ payload }) {
  const {
    gender,
    level,
    place,
    goal,
    info: { birthday, weight, weightUnit, height, heightUnit }
  } = payload.profile;

  let googleUser;
  try {
    googleUser = yield call(Google.logIn);
  } catch (error) {
    return { error: getGoogleErrorMessage(error) };
  }
  let couponCode = reactLocalStorage.get('publicCoupon');
  const referralCode = reactLocalStorage.get('referralCode');
  if(referralCode) couponCode = referralCode;
  const invitationEmail = reactLocalStorage.get('invitationEmail');
  payload.invitationEmail = invitationEmail;
  let response;
  try {
    response = yield call(googleRequest, {
      ...payload,
      accessToken: googleUser.id_token,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      couponCode,
      invitationEmail
    });
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }

  return { response };
}

const registrationTypes = {
  [registerWithPassword]: {
    provider: "email",
    trackingProvider: "password",
    requestFunction: onRegisterWithPassword
  },
  [registerWithFacebook]: {
    provider: "facebook",
    trackingProvider: "facebook",
    requestFunction: onRegisterWithFacebook
  },
  [registerWithGoogle]: {
    provider: "google",
    trackingProvider: "google",
    requestFunction: onRegisterWithGoogle
  }
};

/*function* getDataFromCookie(name, callback) {
  try {
    const value = yield call([Cookie, "get"], name);
    if (value) {
      yield call(callback, value);
    }
    yield call([Cookie, "remove"], name);
  } catch (error) {
    yield put(trackError(error));
  }
}*/

function* onRegister({ type, payload }) {
  //const locale = yield select(store => store.i18n.lang);

  yield put(registrationRequested());
  //yield put(grantMarketingConsent());

  // Extract provider and request function from action type
  const { provider, requestFunction } = registrationTypes[
    type
  ];
  let couponCode = reactLocalStorage.get('publicCoupon');
  const referralCode = reactLocalStorage.get('referralCode');
  if(referralCode) couponCode = referralCode;
  const invitationEmail = reactLocalStorage.get('invitationEmail');
  if(couponCode)payload.couponCode = couponCode;
  if(invitationEmail)payload.invitationEmail = invitationEmail;
  try {
    const result = yield call(requestFunction, { payload });
    const { response, error } = result;
    // short circout with error response from request function
    if (error) {
      yield put(addAlertMessage({ type: "error", message: error }));
      yield put(registrationFailed());
      return;
    }

    const { user, authentication } = response.data;

    const standardAuthentication = true; //authentication.audience === 'standard';

    yield put(
      registrationSucceeded({
        provider,
        authentication,
        user
      })
    );
    if(user.customer.coupon_id){
      const couponCode = reactLocalStorage.get('publicCoupon');
      if(couponCode){
        reactLocalStorage.set('publicCouponId', user.customer.coupon_id);
        reactLocalStorage.remove('publicCoupon');
      }
      const invitationEmail = reactLocalStorage.get('invitationEmail');
      if(invitationEmail){
        reactLocalStorage.remove('invitationEmail');
      }
    }  
    if (standardAuthentication) {
      yield put(
        signInUser({
          authentication,
          user
        })
      );
    }

    // don't wait for this action to finish
    /*yield spawn(
      getDataFromCookie,
      'athlete_profile',
      function* sendAthleteProfile(cookie) {
        yield call(updateAthleteProfile, JSON.parse(cookie), idToken);
      },
    );*/

    // don't wait for this action to finish
    /*yield spawn(
      getDataFromCookie,
      'selected_training_plan',
      function* sendTrainingPlan(selectedTrainingPlan) {
        yield call(
          createPersonalizedTrainingPlan,
          selectedTrainingPlan,
          idToken,
        );
      },
    );*/

    // Switch to 2nd step
    // If user is fully authenthicated just redirect to desired page
    if (standardAuthentication) {
      //const { returnTo } = payload;
      // redirect to pricing page or customer dashboard
    } else {
      //yield put(setStep(REGISTRATION_STEPS.CONFIRMATION));
    }
  } catch (error) {
    yield put(trackError(error));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      [registerWithPassword, registerWithFacebook, registerWithGoogle],
      onRegister
    )
  ]);
}
