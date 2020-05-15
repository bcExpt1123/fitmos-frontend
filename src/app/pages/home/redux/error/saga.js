import { call, takeEvery } from "redux-saga/effects";
import { trackError } from "./actions";

function* onTrackError({ payload }) {
  if (window.TrackJS) {
    yield call([window.TrackJS, "track"], payload);
  }
  if (!window.TrackJS || process.env.APP_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(payload);
  }
}

export default function* rootSaga() {
  yield takeEvery(trackError, onTrackError);
}
