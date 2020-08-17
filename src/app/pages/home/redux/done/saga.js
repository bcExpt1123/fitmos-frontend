import { call, takeEvery, takeLeading, put, select } from "redux-saga/effects";
import {
  doneWorkout,
  setWorkout,
  findWorkouts,
  putWorkout,
  doneQuestion,
  fetchSurvey,
  setSurvey,
  submitSurvey
} from "./actions";
import { $resetPublished } from "../../../../../modules/subscription/benchmark";
import { authenticate as regenerateAuthAction } from "../auth/actions";
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
    yield put(findWorkouts(date));
  } catch (error) {
    yield put(trackError(error));
  }
}
const getWorkouts = (date) =>{
  if(date){
    return   http({
      path: "done/workouts",
      method: "POST",
      data: {
        date
      }
      }).then(response => response.data);        
  }else{
    return   http({
      path: "done/workouts",
      method: "POST",
      }).then(response => response.data);    
  }
}

function* onFindWorkouts({payload}){
  try {
    const { workouts,tagLine } = yield call(getWorkouts,payload);
    yield put(putWorkout({workouts,tagLine}));
  } catch (error) {
    yield put(trackError(error));
  }
}

const sendDoneQuestion = ({question}) =>
  http({
    path: "done/question",
    method: "POST",
    data: {
      question
    }
  }).then(response => response.data);

function* onDoneQuestion({payload}){
  try {
    yield call(sendDoneQuestion,payload);
    yield put(regenerateAuthAction());
  } catch (error) {
    yield put(trackError(error));
  }
}
const findSurvey = () =>
  http({
    path: "surveys/me",
  }).then(response => response.data);
function* onFetchSurvey(){
  try {
    const res = yield call(findSurvey);
    yield put(setSurvey({survey:res.survey}));
  } catch (error) {
    yield put(trackError(error));
  }
}
const submitSurveyItems = (items) =>
  http({
    path: "survey-reports",
    method:"POST",
    data:{
      items
    } 
  }).then(response => response.data);

function* onSubmitSurvey({payload}){
  yield put(setSurvey({survey:null}));
  try {
    const res = yield call(submitSurveyItems,payload.items);
    yield put(setSurvey({survey:res.survey}));
  } catch (error) {
    yield put(trackError(error));
  }
}
export default function* rootSaga() {
  yield takeLeading(doneWorkout,onDoneWorkout);
  yield takeLeading(findWorkouts,onFindWorkouts);
  yield takeLeading(doneQuestion,onDoneQuestion);
  yield takeLeading(fetchSurvey, onFetchSurvey);
  yield takeLeading(submitSurvey,onSubmitSurvey);
}
