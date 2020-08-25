import { persistReducer } from "redux-persist";
import { put, call,  takeLeading, select } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  WEEKWORKOUT_CHANGE_ITEM: "WEEKWORKOUT_CHANGE_ITEM",
  WEEKWORKOUT_SET_ITEM: "WEEKWORKOUT_SET_ITEM",
  WEEKWORKOUT_LOADING_REQUEST: "WEEKWORKOUT_LOADING_REQUEST",
  WEEKWORKOUT_FETCH_REQUEST: "WEEKWORKOUT_FETCH_REQUEST",
  WEEKWORKOUT_INDEX_SUCCESS: "WEEKWORKOUT_INDEX_SUCCESS",
  WEEKWORKOUT_OPEN_CELL: "WEEKWORKOUT_OPEN_CELL",
  WEEKWORKOUT_PREVIEW_DATE: "WEEKWORKOUT_PREVIEW_DATE",
  WEEKWORKOUT_SET_CONTENT: "WEEKWORKOUT_SET_CONTENT",
  WEEKWORKOUT_SAVE_CONTENT: "WEEKWORKOUT_SAVE_CONTENT",
  WEEKWORKOUT_TAKE_CONTENT: "WEEKWORKOUT_TAKE_CONTENT",
  WEEKWORKOUT_SET_VALUE: "WEEKWORKOUT_SET_VALUE",
  WEEKWORKOUT_TAKE_VALUE: "WEEKWORKOUT_TAKE_VALUE",
  WEEKWORKOUT_UPLOAD_IMAGE: "WEEKWORKOUT_UPLOAD_IMAGE"
};

const initialState = {
  data: [],
  id: null,
  isWeeklyLoading: false,
  isSaving: false,
  column: null,
  day:null,
  content: "",
  image:"",
  uploadImage:null,
  timerType:"",
  timerRound:"",
  timerWork:"",
  timerRest:"",
  previewContent: ""
};

export const reducer = persistReducer(
  {
    storage,
    key: "WEEKWORKOUT",
    whitelist: ["meta"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.WEEKWORKOUT_LOADING_REQUEST:
        return { ...state, isWeeklyLoading: true };
      case actionTypes.WEEKWORKOUT_DATE_CHANGED:
        return { ...state, pickedDate: action.pickedDate };
      case actionTypes.WEEKWORKOUT_SET_ITEM:
        return {
          ...state,
          id: action.id,
        };
      case actionTypes.WEEKWORKOUT_INDEX_SUCCESS:
        return { ...state, data: action.data };
      case actionTypes.WEEKWORKOUT_OPEN_CELL:
        const clonedData = Object.assign({}, state.data);
        let content = null;
        let image = null;
        let note = "";
        let timerType = "";
        let timerWork = "";
        let timerRound = "";
        let timerRest = "";
        if (clonedData[action.weekDay] && clonedData[action.weekDay][action.day])
          content = clonedData[action.weekDay][action.day][action.column];
        switch(action.column){
          case "comentario":
            image = clonedData[action.weekDay][action.day]['image_path'];
            break;
          case "blog":
            timerType = clonedData[action.weekDay][action.day][action.column+'_timer_type'];
            if(timerType == null)timerType = "";
            timerWork = clonedData[action.weekDay][action.day][action.column+'_timer_work'];
            if(timerWork == null)timerWork = "";
            timerRest = clonedData[action.weekDay][action.day][action.column+'_timer_rest'];
            if(timerRest == null)timerRest = "";
            timerRound = clonedData[action.weekDay][action.day][action.column+'_timer_round'];
            if(timerRound == null)timerRound = "";
            break;
          default:
            note = clonedData[action.weekDay][action.day][action.column+'_note'];
            if(note == null)note = "";
            timerType = clonedData[action.weekDay][action.day][action.column+'_timer_type'];
            if(timerType == null)timerType = "";
            timerWork = clonedData[action.weekDay][action.day][action.column+'_timer_work'];
            if(timerWork == null)timerWork = "";
            timerRest = clonedData[action.weekDay][action.day][action.column+'_timer_rest'];
            if(timerRest == null)timerRest = "";
            timerRound = clonedData[action.weekDay][action.day][action.column+'_timer_round'];
            if(timerRound == null)timerRound = "";
          }  
        return {
          ...state,
          column: action.column,
          day:action.day,
          content,
          image,
          note,
          timerType,
          timerWork,
          timerRest,
          timerRound
        };
      case actionTypes.WEEKWORKOUT_SET_CONTENT:
        return { ...state, content: action.content };
      case actionTypes.WEEKWORKOUT_TAKE_CONTENT:
        let clonedData1 = Object.assign({}, state.data);
        clonedData1[action.weekDay][state.day][state.column] = action.content;
        return { ...state, data: clonedData1 };
      case actionTypes.WEEKWORKOUT_TAKE_VALUE:
        const clonedData2 = Object.assign({}, state.data);
        if(action.name === 'image_path'){
          clonedData2[action.weekDay][state.day][action.name] = action.value;
        }else{
          clonedData2[action.weekDay][state.day][state.column+'_'+action.name] = action.value;
        }
        return { ...state, data: clonedData2 };
      case actionTypes.WEEKWORKOUT_SET_VALUE:
        return { ...state, [action.key]: action.value };
      case actionTypes.WEEKWORKOUT_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };
        default:
        return state;
    }
  }
);

// ACTIONS CREATORS
export function $fetchRequestCms(history,id) {
  return { type: actionTypes.WEEKWORKOUT_FETCH_REQUEST, history,id };
}
export function $changeItem(id, history) {
  return { type: actionTypes.WEEKWORKOUT_CHANGE_ITEM, id: id, history };
}
export function $openCell(weekDay, column, day) {
  return { type: actionTypes.WEEKWORKOUT_OPEN_CELL, weekDay, column, day };
}
export function $openPreviewCell(weekDay, column, day) {
  return { type: actionTypes.WEEKWORKOUT_PREVIEW_DATE, weekDay, column, day };
}
export function $updateItemValue(key,value) {
  return { type: actionTypes.WEEKWORKOUT_SET_VALUE, key, value };
}
export function $submitContent(weekDay) {
  return { type: actionTypes.WEEKWORKOUT_SAVE_CONTENT,weekDay };
}
export function $updateImage(image){
  return { type: actionTypes.WEEKWORKOUT_UPLOAD_IMAGE, image };
}
function* changeItem({ id, history }) {
  try {
    const result = yield call(findService, id);
    if (result.id)
      yield put({
        type: actionTypes.WEEKWORKOUT_SET_ITEM,
        id,
      });
    else {
      history.push("/admin/subscription-manager");
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      history.push("/admin/subscription-manager");
    }
  }
}
const findService = (id) =>
  http({ path: `services/${id}/cms?year=2020` }).then(
    response => response.data
  );
const weekWorkoutRquest = (id) => {
  return http({
    path: `services/${id}/pending`
  }).then(response => response.data);
};
function* fetchRequest({ history,id }) {
  yield put({ type: actionTypes.WEEKWORKOUT_LOADING_REQUEST });
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    //if (id == null) id = 1;
  } else {
    if (id == null) {
      history.push("/admin/subscription-manager");
    }
  }
  if(id){
    const result = yield call(weekWorkoutRquest, id);
    try {
      yield put({ type: actionTypes.WEEKWORKOUT_INDEX_SUCCESS, data: result.data });
    } catch (e) {
      if (e.response.status === 401) {
        yield put(logOut());
      } else {
        //history.push('/admin/subscription-manager');
      }
    }
  }
}
const saveWorkout = (fromDate,weekDate, column, content,note,timerType,work,round,rest,uploadImage) => {
  const formData = new FormData();
  formData.append("from_date", fromDate);
  formData.append("weekdate", weekDate);
  formData.append("column", column);
  formData.append("content", content);
  if ( note )formData.append("note", note);
  if ( timerType )formData.append("timer_type", timerType);
  if ( work )formData.append("timer_work", work);
  if ( round )formData.append("timer_round", round);
  if ( rest )formData.append("timer_rest", rest);
  if ( uploadImage ) {
    const files = Array.from(uploadImage);
    files.forEach((file, i) => {
      formData.append("image", file);
    });
  }
  return http({
    path: `services/pendingworkout`,
    method: "POST",
    data: formData
  }).then(res => res.data);
};
function* saveContent({weekDay}) {
  const weekWorkout = yield select(store => store.weekWorkout);
  try {
    const result = yield call(
      saveWorkout,
      weekDay,
      weekWorkout.day,
      weekWorkout.column,
      weekWorkout.content,
      weekWorkout.note,
      weekWorkout.timerType,
      weekWorkout.timerWork,
      weekWorkout.timerRound,
      weekWorkout.timerRest,
      weekWorkout.uploadImage
    );
    
    if (result.id) {
      try {
        yield put({
          type: actionTypes.WEEKWORKOUT_TAKE_CONTENT,
          weekDay,
          content: result[weekWorkout.column]
        });
        if(result[weekWorkout.column+'_note']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'note',
            value: result[weekWorkout.column+'_note']
          });
        }
        if(result[weekWorkout.column+'_timer_type']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'timer_type',
            value: result[weekWorkout.column+'_timer_type']
          });
        }
        if(result[weekWorkout.column+'_timer_work']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'timer_work',
            value: result[weekWorkout.column+'_timer_work']
          });
        }
        if(result[weekWorkout.column+'_timer_round']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'timer_round',
            value: result[weekWorkout.column+'_timer_round']
          });
        }
        if(result[weekWorkout.column+'_timer_rest']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'timer_rest',
            value: result[weekWorkout.column+'_timer_rest']
          });
        }
        if(result['image_path']){
          yield put({
            type: actionTypes.WEEKWORKOUT_TAKE_VALUE,
            weekDay,
            name: 'image_path',
            value: result['image_path']
          });
        }
      } catch (e) {
        console.log(e)
        if (e.response.status === 401) {
          yield put(logOut());
        } else {
          //history.push('/admin/subscription-manager');
        }
      }
    }
  } catch (ex) { }
}
const getPreview = (weekDay,column, day) => {
  return http({
    path: `services/previewPendingWorkout`,
    method: "PUT",
    data: {
      from_date:weekDay,
      weekdate:day,
      column
    }
  }).then(res => res.data);
};
function* previewContent({ weekDay, column,day }) {
  try {
    const result = yield call(getPreview, weekDay, column,day);
    if (result.content) {
      yield put({
        type: actionTypes.WEEKWORKOUT_SET_VALUE,
        key: "previewContent",
        value: result
      });
    }
  } catch (ex) { }
}
export function* saga() {
  yield takeLeading(actionTypes.WEEKWORKOUT_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.WEEKWORKOUT_FETCH_REQUEST, fetchRequest);
  yield takeLeading(actionTypes.WEEKWORKOUT_SAVE_CONTENT, saveContent);
  yield takeLeading(actionTypes.WEEKWORKOUT_PREVIEW_DATE, previewContent);
}