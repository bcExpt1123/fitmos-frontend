import { call, takeEvery, takeLeading, put, select } from "redux-saga/effects";
import {
  doneWorkout,
  setWorkout
} from "./actions";
import { $resetPublished } from "../../../../../modules/subscription/benchmark";
import { http } from "../../services/api";
import { trackError } from "../error/actions";

const sendDoneWorkout = (date,blog) =>
  http({
    path: "done/check",
    method: "POST",
    data: {
      date,
      blog
    }
  }).then(response => response.data);

function* onDoneWorkout({payload:{date,blog}}) {
  try {
    const { fromWorkout,fromWorkoutImage,toWorkout,toWorkoutImage,workoutCount } = yield call(sendDoneWorkout,date,blog);
    yield put(setWorkout({fromWorkout,fromWorkoutImage,toWorkout,toWorkoutImage,workoutCount}));
    yield put($resetPublished());
  } catch (error) {
    yield put(trackError(error));
  }
}
export default function* rootSaga() {
  yield takeLeading(doneWorkout,onDoneWorkout);
}
