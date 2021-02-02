import { actionChannel, delay, put, race, take } from "redux-saga/effects";
import { addAlertMessage, dismissAlert } from "./actions";

export default function*() {
  const channel = yield actionChannel(addAlertMessage);

  while (true) {
    // 1. wait for new addAlertMessage action
    const { payload } = yield take(channel);

    // 2. if it has delay...
    if (payload.delay) {
      // 2a. wait for either delay or dismissAlert action
      const { dismiss } = yield race({
        delay: delay(payload.delay),
        dismiss: take(dismissAlert)
      });

      // 2b. if it wasn't dismiss, call dismissAlert to move state to next message
      if (!dismiss) {
        yield put(dismissAlert());
      }
    } else {
      // 3. if it doesn't have delay, wait for dismissAlert action only
      take(dismissAlert);
    }
  }
}
