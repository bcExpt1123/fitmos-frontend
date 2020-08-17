import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, call, takeLatest, takeLeading, select } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  CMS_REDIRECT: "CMS_REDIRECT",
  CMS_DATE_CHANGED: "CMS_DATE_CHANGED",
  CMS_NEXT_YEAR: "CMS_NEXT_YEAR",
  CMS_PREV_YEAR: "CMS_PREV_YEAR",
  CMS_CHANGE_ITEM: "CMS_CHANGE_ITEM",
  CMS_SET_ITEM: "CMS_SET_ITEM",
  CMS_WEEKLY_LOADING_REQUEST: "CMS_WEEKLY_LOADING_REQUEST",
  CMS_WEEKLY_FETCH_REQUEST: "CMS_WEEKLY_FETCH_REQUEST",
  CMS_LOADING_REQUEST: "CMS_LOADING_REQUEST",
  CMS_NEXT_WEEK: "CMS_NEXT_WEEK",
  CMS_PREV_WEEK: "CMS_PREV_WEEK",
  CMS_INDEX_SUCCESS: "CMS_INDEX_SUCCESS",
  CMS_OPEN_DATE: "CMS_OPEN_DATE",
  CMS_PREVIEW_DATE: "CMS_PREVIEW_DATE",
  CMS_SET_CONTENT: "CMS_SET_CONTENT",
  CMS_SAVE_CONTENT: "CMS_SAVE_CONTENT",
  CMS_TAKE_CONTENT: "CMS_TAKE_CONTENT",
  CMS_SET_VALUE: "CMS_SET_VALUE",
  CMS_TAKE_VALUE: "CMS_TAKE_VALUE",
  CMS_UPLOAD_IMAGE: "CMS_UPLOAD_IMAGE"
};

const d = new Date();
const initialState = {
  data: [],
  year: d.getFullYear(),
  pickedDate: d,
  dates: [],
  id: null,
  isWeeklyLoading: false,
  isSaving: false,
  editorDate: null,
  column: null,
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
    key: "cms",
    whitelist: ["meta"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.CMS_WEEKLY_LOADING_REQUEST:
        return { ...state, isWeeklyLoading: true };
      case actionTypes.CMS_DATE_CHANGED:
        return { ...state, pickedDate: action.pickedDate };
      case actionTypes.CMS_SET_ITEM:
        return {
          ...state,
          id: action.id,
          dates: action.dates,
          year: action.year
        };
      case actionTypes.CMS_INDEX_SUCCESS:
        return { ...state, data: action.data };
      case actionTypes.CMS_OPEN_DATE:
        const clonedData = Object.assign({}, state.data);
        let content = null;
        let image = null;
        let note = null;
        let timerType = "";
        let timerWork = "";
        let timerRound = "";
        let timerRest = "";
        /*if (clonedData[action.day])
          content = clonedData[action.day][action.column];*/
        if (clonedData[action.column])
          content = clonedData[action.column][action.day];
        switch(action.column){
          case "comentario":
            image = clonedData['image_path'][action.day];
            break;
          case "blog":
            break;
          default:
            note = clonedData[action.column+'_note'][action.day];
            if(note == null)note = "";
            timerType = clonedData[action.column+'_timer_type'][action.day];
            if(timerType == null)timerType = "";
            timerWork = clonedData[action.column+'_timer_work'][action.day];
            if(timerWork == null)timerWork = "";
            timerRest = clonedData[action.column+'_timer_rest'][action.day];
            if(timerRest == null)timerRest = "";
            timerRound = clonedData[action.column+'_timer_round'][action.day];
            if(timerRound == null)timerRound = "";
          }  
        return {
          ...state,
          editorDate: action.editorDate,
          column: action.column,
          content,
          image,
          note,
          timerType,
          timerWork,
          timerRest,
          timerRound
        };
      case actionTypes.CMS_SET_CONTENT:
        return { ...state, content: action.content };
      case actionTypes.CMS_TAKE_CONTENT:
        const clonedData1 = Object.assign({}, state.data);
        const weekDay = state.editorDate.getDay();
        if(weekDay==0)clonedData1[state.column][weekDay+6] = action.content;
        else clonedData1[state.column][weekDay-1] = action.content;
        return { ...state, data: clonedData1 };
      case actionTypes.CMS_TAKE_VALUE:
        const clonedData2 = Object.assign({}, state.data);
        const weekDay1 = state.editorDate.getDay();
        if(action.name == 'image_path'){
          if(weekDay1==0)clonedData2[action.name][weekDay1+6] = action.value;
          else clonedData2[action.name][weekDay1-1] = action.value;
        }else{
          if(weekDay1==0)clonedData2[state.column+'_'+action.name][weekDay1+6] = action.value;
          else clonedData2[state.column+'_'+action.name][weekDay1-1] = action.value;
        }
        return { ...state, data: clonedData2 };
      case actionTypes.CMS_SET_VALUE:
        return { ...state, [action.key]: action.value };
      case actionTypes.CMS_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };
      default:
        return state;
    }
  }
);

// ACTIONS CREATORS
export function $datePicked(pickedDate, history) {
  return { type: actionTypes.CMS_REDIRECT, pickedDate, history };
}

export function $nextYear() {
  return { type: actionTypes.CMS_NEXT_YEAR };
}
export function $prevYear() {
  return { type: actionTypes.CMS_PREV_YEAR };
}
export function $changeItem(id, history) {
  return { type: actionTypes.CMS_CHANGE_ITEM, id: id, history };
}
export function $fetchWeeklyCms(history) {
  return { type: actionTypes.CMS_WEEKLY_FETCH_REQUEST, history };
}
export function $prevWeek() {
  return { type: actionTypes.CMS_PREV_WEEK };
}
export function $nextWeek() {
  return { type: actionTypes.CMS_NEXT_WEEK };
}
export function $openCell(editorDate, column, day) {
  return { type: actionTypes.CMS_OPEN_DATE, editorDate, column, day };
}
export function $openPreviewCell(editorDate, column, day) {
  return { type: actionTypes.CMS_PREVIEW_DATE, editorDate, column, day };
}
export function $updateItemValue(key, value) {
  return { type: actionTypes.CMS_SET_VALUE,key, value };
}
export function $submitContent() {
  return { type: actionTypes.CMS_SAVE_CONTENT };
}
export function $updateImage(image){
  return { type: actionTypes.CMS_UPLOAD_IMAGE, image };
}
function* redirectEditor({ pickedDate, history }) {
  yield put({ type: actionTypes.CMS_DATE_CHANGED, pickedDate });
  history.push("/admin/week-editor");
}
function* changeItem({ id, history }) {
  const cms = yield select(store => store.cms);
  try {
    const result = yield call(findService, id, cms.year);
    if (result.id)
      yield put({
        type: actionTypes.CMS_SET_ITEM,
        id,
        dates: result.days,
        year: cms.year
      });
    else {
      history.push("/admin/subscription-manager");
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      history.push("/admin/subscription-manager");
    }
  }
}
function* changePrevYear() {
  const cms = yield select(store => store.cms);
  try {
    const result = yield call(findService, cms.id, cms.year - 1);
    if (result.id)
      yield put({
        type: actionTypes.CMS_SET_ITEM,
        id: cms.id,
        dates: result.days,
        year: cms.year - 1
      });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      //history.push('/admin/subscription-manager');
    }
  }
}
function* changeNextYear() {
  const cms = yield select(store => store.cms);
  try {
    const result = yield call(findService, cms.id, cms.year + 1);
    if (result.id)
      yield put({
        type: actionTypes.CMS_SET_ITEM,
        id: cms.id,
        dates: result.days,
        year: cms.year + 1
      });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      //history.push('/admin/subscription-manager');
    }
  }
}
const options = { year: "numeric", month: "2-digit", day: "2-digit" };
const findService = (id, year) =>
  http({ path: `services/${id}/cms?year=${year}` }).then(
    response => response.data
  );
const cmsWeeklyRequest = (pickedDate, id) => {
  return http({
    path: `services/${id}/weekly?${serializeQuery({
      date: pickedDate.toLocaleDateString("en", options)
    })}`
  }).then(response => response.data);
};
function* fetchWeekly({ history }) {
  yield put({ type: actionTypes.CMS_WEEKLY_LOADING_REQUEST });
  const cms = yield select(store => store.cms);
  let id = cms.id;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    if (id == null) id = 1;
  } else {
    if (id == null) {
      history.push("/admin/subscription-manager");
    }
  }
  const result = yield call(cmsWeeklyRequest, cms.pickedDate, id);
  try {
    yield put({ type: actionTypes.CMS_INDEX_SUCCESS, data: result.data });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      //history.push('/admin/subscription-manager');
    }
  }
}
function* fetchPrevWeekly() {
  const cms = yield select(store => store.cms);
  const lastWeek = new Date(
    cms.pickedDate.getFullYear(),
    cms.pickedDate.getMonth(),
    cms.pickedDate.getDate() - 7
  );
  yield put({ type: actionTypes.CMS_DATE_CHANGED, pickedDate: lastWeek });
  yield put({ type: actionTypes.CMS_WEEKLY_LOADING_REQUEST });
  let id = cms.id;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    if (id == null) id = 1;
  } else {
    if (id == null) {
    }
  }
  const result = yield call(cmsWeeklyRequest, lastWeek, id);
  try {
    yield put({ type: actionTypes.CMS_INDEX_SUCCESS, data: result.data });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      //history.push('/admin/subscription-manager');
    }
  }
}
function* fetchNextWeekly() {
  const cms = yield select(store => store.cms);
  const nextWeek = new Date(
    cms.pickedDate.getFullYear(),
    cms.pickedDate.getMonth(),
    cms.pickedDate.getDate() + 7
  );
  yield put({ type: actionTypes.CMS_DATE_CHANGED, pickedDate: nextWeek });
  yield put({ type: actionTypes.CMS_WEEKLY_LOADING_REQUEST });
  let id = cms.id;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    if (id == null) id = 1;
  } else {
    if (id == null) {
    }
  }
  const result = yield call(cmsWeeklyRequest, nextWeek, id);
  try {
    yield put({ type: actionTypes.CMS_INDEX_SUCCESS, data: result.data });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      //history.push('/admin/subscription-manager');
    }
  }
}
const saveWorkout = (date, column, content,note,timerType,work,round,rest,uploadImage) => {
  const formData = new FormData();
  formData.append("date", date.toLocaleDateString("en", options));
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
    path: `services/workout`,
    method: "POST",
    data: formData
  }).then(res => res.data);
};
function* saveContent() {
  const cms = yield select(store => store.cms);
  try {
    const result = yield call(
      saveWorkout,
      cms.editorDate,
      cms.column,
      cms.content,
      cms.note,
      cms.timerType,
      cms.timerWork,
      cms.timerRound,
      cms.timerRest,
      cms.uploadImage
    );
    if (result.id) {
      try {
        yield put({
          type: actionTypes.CMS_TAKE_CONTENT,
          content: result[cms.column]
        });
        if(result[cms.column+'_note']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'note',
            value: result[cms.column+'_note']
          });
        }
        if(result[cms.column+'_timer_type']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'timer_type',
            value: result[cms.column+'_timer_type']
          });
        }
        if(result[cms.column+'_timer_work']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'timer_work',
            value: result[cms.column+'_timer_work']
          });
        }
        if(result[cms.column+'_timer_round']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'timer_round',
            value: result[cms.column+'_timer_round']
          });
        }
        if(result[cms.column+'_timer_rest']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'timer_rest',
            value: result[cms.column+'_timer_rest']
          });
        }
        if(result['image_path']){
          yield put({
            type: actionTypes.CMS_TAKE_VALUE,
            name: 'image_path',
            value: result['image_path']
          });
        }
      } 
      catch (e) {
        console.log(e);
        if (e.response.status == 401) {
          yield put(logOut());
        } else {
          //history.push('/admin/subscription-manager');
        }
      }
    }
  } catch (ex) {}
}
const getPreview = (date, column) => {
  return http({
    path: `services/previewWorkout`,
    method: "PUT",
    data: {
      date: date.toLocaleDateString("en", options),
      column
    }
  }).then(res => res.data);
};
function* previewContent({ editorDate, column }) {
  yield put({
    type: actionTypes.CMS_SET_VALUE,
    key: "editorDate",
    value: editorDate
  });
  try {
    const result = yield call(getPreview, editorDate, column);
    if (result.content) {
      yield put({
        type: actionTypes.CMS_SET_VALUE,
        key: "previewContent",
        value: result
      });
    }
  } catch (ex) {}
}
export function* saga() {
  yield takeLatest(actionTypes.CMS_REDIRECT, redirectEditor);
  yield takeLatest(actionTypes.CMS_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.CMS_PREV_YEAR, changePrevYear);
  yield takeLatest(actionTypes.CMS_NEXT_YEAR, changeNextYear);
  yield takeLatest(actionTypes.CMS_PREV_WEEK, fetchPrevWeekly);
  yield takeLatest(actionTypes.CMS_NEXT_WEEK, fetchNextWeekly);
  yield takeLatest(actionTypes.CMS_WEEKLY_FETCH_REQUEST, fetchWeekly);
  yield takeLatest(actionTypes.CMS_SAVE_CONTENT, saveContent);
  yield takeLeading(actionTypes.CMS_PREVIEW_DATE, previewContent);
}
