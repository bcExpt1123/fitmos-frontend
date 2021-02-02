import { all,  put, select, takeLatest } from "redux-saga/effects";
import {
  declineMarketingConsent,
  grantMarketingConsent,
  marketingConsentUpdated
} from "./actions";
//import { setUser } from "../auth/actions";

//import { update as updateUser } from "../../services/user";

function* onGrantMarketingConsent() {
  const user = yield select(store => store.auth.currentUser);

  if (user) {
    /*const updatedUser = yield call(updateUser, {
      personalized_marketing_consent: true,
    });
    yield put(setUser(updatedUser));*/
  }
  yield put(
    marketingConsentUpdated({
      marketingConsent: true
    })
  );
}

function* onDeclineMarketingConsent() {
  const user = yield select(store => store.auth.currentUser);

  if (user) {
    /*const updatedUser = yield call(updateUser, {
      personalized_marketing_consent: false,
    });
    yield put(setUser(updatedUser));*/
  }
  yield put(
    marketingConsentUpdated({
      marketingConsent: false
    })
  );
}

export default function* rootSaga() {
  yield all([
    takeLatest(grantMarketingConsent, onGrantMarketingConsent),
    takeLatest(declineMarketingConsent, onDeclineMarketingConsent)
  ]);
}
