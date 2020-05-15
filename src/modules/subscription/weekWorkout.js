import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, call, takeLatest, takeLeading, select,delay } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  WEEKWORKOUT_CHANGE_ITEM: "WEEKWORKOUT_CHANGE_ITEM",
  WEEKWORKOUT_SET_ITEM: "WEEKWORKOUT_SET_ITEM",
  WEEKWORKOUT_LOADING_REQUEST: "WEEKWORKOUT_LOADING_REQUEST",
  WEEKWORKOUT_FETCH_REQUEST: "WEEKWORKOUT_FETCH_REQUEST",
  WEEKWORKOUT_LOADING_REQUEST: "WEEKWORKOUT_LOADING_REQUEST",
  WEEKWORKOUT_INDEX_SUCCESS: "WEEKWORKOUT_INDEX_SUCCESS",
  WEEKWORKOUT_OPEN_CELL: "WEEKWORKOUT_OPEN_CELL",
  WEEKWORKOUT_PREVIEW_DATE: "WEEKWORKOUT_PREVIEW_DATE",
  WEEKWORKOUT_SET_CONTENT: "WEEKWORKOUT_SET_CONTENT",
  WEEKWORKOUT_SAVE_CONTENT: "WEEKWORKOUT_SAVE_CONTENT",
  WEEKWORKOUT_TAKE_CONTENT: "WEEKWORKOUT_TAKE_CONTENT",
  WEEKWORKOUT_SET_VALUE: "WEEKWORKOUT_SET_VALUE"
};

const d = new Date();
const initialState = {
  data: [],
  id: null,
  isWeeklyLoading: false,
  isSaving: false,
  column: null,
  day:null,
  content: "",
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
        if (clonedData[action.weekDay] && clonedData[action.weekDay][action.day])
          content = clonedData[action.weekDay][action.day][action.column];
        return {
          ...state,
          column: action.column,
          day:action.day,
          content
        };
      case actionTypes.WEEKWORKOUT_SET_CONTENT:
        return { ...state, content: action.content };
      case actionTypes.WEEKWORKOUT_TAKE_CONTENT:
        let clonedData1 = Object.assign({}, state.data);
        const weekDay = 1;
        clonedData1[action.weekDay][state.day][state.column] = action.content;
        return { ...state, data: clonedData1 };
      case actionTypes.WEEKWORKOUT_SET_VALUE:
        return { ...state, [action.key]: action.value };
      default:
        return state;
    }
  }
);

// ACTIONS CREATORS
export function $fetchRequestCms(history,id) {
  console.log(id)
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
export function $updateItemValue(content) {
  return { type: actionTypes.WEEKWORKOUT_SET_CONTENT, content };
}
export function $submitContent(weekDay) {
  return { type: actionTypes.WEEKWORKOUT_SAVE_CONTENT,weekDay };
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
    if (e.response.status == 401) {
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
  console.log(id)
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
      if (e.response.status == 401) {
        yield put(logOut());
      } else {
        //history.push('/admin/subscription-manager');
      }
    }
  }
}
const saveWorkout = (fromDate,weekDate, column, content) => {
  const formData = new FormData();
  formData.append("from_date", fromDate);
  formData.append("weekdate", weekDate);
  formData.append("column", column);
  formData.append("content", content);
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
      weekWorkout.content
    );
    if (result.id) {
      try {
        yield put({
          type: actionTypes.WEEKWORKOUT_TAKE_CONTENT,
          weekDay,
          content: result[weekWorkout.column]
        });
      } catch (e) {
        if (e.response.status == 401) {
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