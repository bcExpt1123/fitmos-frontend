import { persistReducer } from "redux-persist";
import { put, call, takeLatest, takeLeading, select } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http,fileDownload } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";
import { addAlertMessage } from "../../app/pages/home/redux/alert/actions";

export const actionTypes = {
  REPORT_INDEX_REQUEST: "REPORT_INDEX_REQUEST",
  REPORT_INDEX_SUCCESS: "REPORT_INDEX_SUCCESS",
  REPORT_INDEX_FAILURE: "REPORT_INDEX_FAILURE",
  REPORT_SEARCH_REQUEST: "REPORT_SEARCH_REQUEST",
  REPORT_CHANGE_SEARCH_VALUE: "REPORT_CHANGE_SEARCH_VALUE",
  REPORT_ACTION_REQUEST: "REPORT_ACTION_REQUEST",
  REPORT_CHANGE_ITEM: "REPORT_CHANGE_ITEM",
  REPORT_SET_ITEM: "REPORT_SET_ITEM",
  REPORT_LOADING_REQUEST: "REPORT_LOADING_REQUEST",
  REPORT_CREATE: "REPORT_CREATE",
  //for pagination
  REPORT_INDEX_META: "REPORT_INDEX_META",
  REPORT_PAGE_CHANGED: "REPORT_PAGE_CHANGED",
  REPORT_PAGESIZE_CHANGED: "REPORT_PAGESIZE_CHANGED"
};

const initialState = {
  data: null,
  meta: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  searchCondition: {
    search: "",
    shape: "all",
    status: "pending"
  },
  item: null
};

export const reducer = persistReducer(
  {
    storage,
    key: "reports",
    blacklist: []
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.REPORT_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.REPORT_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.REPORT_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.REPORT_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.REPORT_LOADING_REQUEST:
        return { ...state, isloading: true };
      default:
        return state;
    }
  }
);

export const $fetchIndex = () => ({ type: actionTypes.REPORT_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  console.log(pageSize);
  return { type: actionTypes.REPORT_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.REPORT_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.REPORT_SEARCH_REQUEST, name, value };
}
export function $complete(id) {
  return { type: actionTypes.REPORT_ACTION_REQUEST, action: "complete", id };
}
export function $restore(id) {
  return { type: actionTypes.REPORT_ACTION_REQUEST, action: "restore", id };
}
export function $changeItem(id) {
  return { type: actionTypes.REPORT_CHANGE_ITEM, id };
}
export function $create(type, id,content){
  return { type: actionTypes.REPORT_CREATE, shape:type, id, content };
}
const reportsRequest = (meta, searchCondition) =>
  http({
    path: `social-reports?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      content: searchCondition.search,
      status: searchCondition.status,
      type: searchCondition.shape,
    })}`
  }).then(response => response.data);
function* fetchReport() {
  try {
    const report = yield select(store => store.report);
    const result = yield call(
      reportsRequest,
      report.meta,
      report.searchCondition
    );
    yield put({
      type: actionTypes.REPORT_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.REPORT_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchReport({ name, value }) {
  try {
    yield put({ type: actionTypes.REPORT_CHANGE_SEARCH_VALUE, name, value });
    const report = yield select(store => store.report);
    const result = yield call(
      reportsRequest,
      report.meta,
      report.searchCondition
    );
    yield put({
      type: actionTypes.REPORT_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.REPORT_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.report.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.REPORT_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.REPORT_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.REPORT_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.REPORT_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(reportActionRequest, action, id);
    yield put({ type: actionTypes.REPORT_INDEX_REQUEST });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.REPORT_INDEX_FAILURE, error: e.message });
    }
  }
}
function reportActionRequest(action, id) {
  return http({ path: `social-reports/${id}/${action}` }).then(
    response => response.data
  );
}
const findReport = id =>
  http({ path: `social-reports/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  //const reports = yield select((store) => store.report.data);
  yield put({ type: actionTypes.REPORT_LOADING_REQUEST });
  /*if( reports!=null){
    const filterReports = reports.filter((report)=>{
      return report.id == id;
    })
    if(filterReports.length>0){
      yield put({type: actionTypes.REPORT_SET_ITEM, item: filterReports[0]});
      return;
    }
  }*/
  try {
    const result = yield call(findReport, id);
    if (result.id)
      yield put({ type: actionTypes.REPORT_SET_ITEM, item: result });
    else yield put({ type: actionTypes.REPORT_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.REPORT_INDEX_FAILURE, error: e.message });
    }
  }
}
const createRequest = (type,object_id, content)=>
 http({ 
   path: `social-reports`,
   method:'POST',
   data:{
    type,
    object_id,
    content
   }
   }).then(
  response => response.data
);
function* createItem({shape, id, content}){
  try{
    const result = yield call(createRequest, shape, id, content);
    yield put(
      addAlertMessage({
        type: "success",
        message: { id: "Social.Report.Success" }
      })
    );
  }catch(e){
    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "Social.Report.Failed" }
      })
    );
  }
}
export function* saga() {
  yield takeLatest(actionTypes.REPORT_INDEX_REQUEST, fetchReport);
  yield takeLatest(actionTypes.REPORT_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.REPORT_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.REPORT_SEARCH_REQUEST, searchReport);
  yield takeLatest(actionTypes.REPORT_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.REPORT_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.REPORT_CREATE, createItem);
}
