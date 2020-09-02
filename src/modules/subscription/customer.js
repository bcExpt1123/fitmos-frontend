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
export const actionTypes = {
  CUSTOMER_INDEX_REQUEST: "CUSTOMER_INDEX_REQUEST",
  CUSTOMER_INDEX_SUCCESS: "CUSTOMER_INDEX_SUCCESS",
  CUSTOMER_INDEX_FAILURE: "CUSTOMER_INDEX_FAILURE",
  CUSTOMER_SEARCH_REQUEST: "CUSTOMER_SEARCH_REQUEST",
  CUSTOMER_CHANGE_SEARCH_VALUE: "CUSTOMER_CHANGE_SEARCH_VALUE",
  CUSTOMER_ACTION_REQUEST: "CUSTOMER_ACTION_REQUEST",
  CUSTOMER_CHANGE_ITEM: "CUSTOMER_CHANGE_ITEM",
  CUSTOMER_SET_ITEM: "CUSTOMER_SET_ITEM",
  CUSTOMER_LOADING_REQUEST: "CUSTOMER_LOADING_REQUEST",
  CUSTOMER_EXPORT_REQUEST: "CUSTOMER_EXPORT_REQUEST",
  CUSTOMER_EXPORT_START: "CUSTOMER_EXPORT_START",
  CUSTOMER_EXPORT_END: "CUSTOMER_EXPORT_END",
  CUSTOMER_DASHBOARD_EXPORT_REQUEST: "CUSTOMER_DASHBOARD_EXPORT_REQUEST",
  CUSTOMER_DASHBOARD_EXPORT_USAGE_REQUEST:"CUSTOMER_DASHBOARD_EXPORT_USAGE_REQUEST",
  //for pagination
  CUSTOMER_INDEX_META: "CUSTOMER_INDEX_META",
  CUSTOMER_PAGE_CHANGED: "CUSTOMER_PAGE_CHANGED",
  CUSTOMER_PAGESIZE_CHANGED: "CUSTOMER_PAGESIZE_CHANGED"
};

export const selectors = {};

const initialState = {
  data: null,
  meta: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  exportLoading:false,
  searchCondition: {
    search: "",
    status: "all"
  },
  item: null
};

export const reducer = persistReducer(
  {
    storage,
    key: "customers",
    blacklist: ["item",'exportLoading']
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.CUSTOMER_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.CUSTOMER_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.CUSTOMER_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.CUSTOMER_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.CUSTOMER_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.CUSTOMER_EXPORT_START:
        return   { ...state, exportLoading: true };
      case actionTypes.CUSTOMER_EXPORT_END:
        return   { ...state, exportLoading: false };
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.CUSTOMER_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.CUSTOMER_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.CUSTOMER_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.CUSTOMER_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  console.log(pageSize);
  return { type: actionTypes.CUSTOMER_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.CUSTOMER_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.CUSTOMER_SEARCH_REQUEST, name, value };
}
export function $export(searchCondition) {
  return { type: actionTypes.CUSTOMER_EXPORT_REQUEST,searchCondition};
}
export function $exportReport(from,to) {
  return { type: actionTypes.CUSTOMER_DASHBOARD_EXPORT_REQUEST,from,to};
}
export function $exportReportUsage(from, to){
  return { type: actionTypes.CUSTOMER_DASHBOARD_EXPORT_USAGE_REQUEST,from,to};
}
export function $disable(id) {
  return { type: actionTypes.CUSTOMER_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.CUSTOMER_ACTION_REQUEST, action: "restore", id };
}
export function $changeItem(id) {
  return { type: actionTypes.CUSTOMER_CHANGE_ITEM, id };
}
const customersRequest = (meta, searchCondition) =>
  http({
    path: `customers?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search,
      status: searchCondition.status
    })}`
  }).then(response => response.data);
function* fetchCustomer() {
  try {
    const customer = yield select(store => store.customer);
    const result = yield call(
      customersRequest,
      customer.meta,
      customer.searchCondition
    );
    yield put({
      type: actionTypes.CUSTOMER_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CUSTOMER_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchCustomer({ name, value }) {
  try {
    yield put({ type: actionTypes.CUSTOMER_CHANGE_SEARCH_VALUE, name, value });
    const customer = yield select(store => store.customer);
    const result = yield call(
      customersRequest,
      customer.meta,
      customer.searchCondition
    );
    yield put({
      type: actionTypes.CUSTOMER_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CUSTOMER_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.customer.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.CUSTOMER_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.CUSTOMER_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.CUSTOMER_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.CUSTOMER_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(customerActionRequest, action, id);
    yield put({ type: actionTypes.CUSTOMER_INDEX_REQUEST });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CUSTOMER_INDEX_FAILURE, error: e.message });
    }
  }
}
function customerActionRequest(action, id) {
  return http({ path: `customers/${id}/${action}` }).then(
    response => response.data
  );
}
const findCustomer = id =>
  http({ path: `customers/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  //const customers = yield select((store) => store.customer.data);
  yield put({ type: actionTypes.CUSTOMER_LOADING_REQUEST });
  /*if( customers!=null){
    const filterCustomers = customers.filter((customer)=>{
      return customer.id == id;
    })
    if(filterCustomers.length>0){
      yield put({type: actionTypes.CUSTOMER_SET_ITEM, item: filterCustomers[0]});
      return;
    }
  }*/
  try {
    const result = yield call(findCustomer, id);
    if (result.id)
      yield put({ type: actionTypes.CUSTOMER_SET_ITEM, item: result });
    else yield put({ type: actionTypes.CUSTOMER_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CUSTOMER_INDEX_FAILURE, error: e.message });
    }
  }
}
function download(path){
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
function* exportCustomers({searchCondition}){
  console.log(searchCondition)
  const path = `customers/export?${serializeQuery({
    search: searchCondition.search,
    status: searchCondition.status
  })}`;
  yield put({type:actionTypes.CUSTOMER_EXPORT_START});
  try{
    yield call(download,path);
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }catch(e){
    console.log(e)
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }
}
function downloadReport(path,from,to, name){
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
function* exportReport({from,to}){
  const path = `reports/export-customers?${serializeQuery({
    from,
    to
  })}`;
  yield put({type:actionTypes.CUSTOMER_EXPORT_START});
  try{
    yield call(downloadReport,path,from,to,'Report-'+from+'-'+to+'.xlsx');
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }catch(e){
    console.log(e)
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }
}
function* exportReportUsage({from,to}){
  const path = `reports/export-usage?${serializeQuery({
    from,
    to
  })}`;
  yield put({type:actionTypes.CUSTOMER_EXPORT_START});
  try{
    yield call(downloadReport,path,from,to,'Report-Usage-'+from+'-'+to+'.xlsx');
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }catch(e){
    console.log(e)
    yield put({type:actionTypes.CUSTOMER_EXPORT_END});
  }
}
export function* saga() {
  yield takeLatest(actionTypes.CUSTOMER_INDEX_REQUEST, fetchCustomer);
  yield takeLatest(actionTypes.CUSTOMER_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.CUSTOMER_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.CUSTOMER_SEARCH_REQUEST, searchCustomer);
  yield takeLatest(actionTypes.CUSTOMER_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.CUSTOMER_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.CUSTOMER_EXPORT_REQUEST, exportCustomers);
  yield takeLeading(actionTypes.CUSTOMER_DASHBOARD_EXPORT_REQUEST,exportReport);
  yield takeLeading(actionTypes.CUSTOMER_DASHBOARD_EXPORT_USAGE_REQUEST,exportReportUsage);
}
