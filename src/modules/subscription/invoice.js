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
  INVOICE_INDEX_REQUEST: "INVOICE_INDEX_REQUEST",
  INVOICE_INDEX_SUCCESS: "INVOICE_INDEX_SUCCESS",
  INVOICE_INDEX_FAILURE: "INVOICE_INDEX_FAILURE",
  INVOICE_LOADING_REQUEST: "INVOICE_LOADING_REQUEST",
  INVOICE_SEARCH_REQUEST: "INVOICE_SEARCH_REQUEST",
  INVOICE_CHANGE_SEARCH_VALUE: "INVOICE_CHANGE_SEARCH_VALUE",
  INVOICE_SHOW_ITEM:"INVOICE_SHOW_ITEM",
  INVOICE_SET_VALUE:"INVOICE_SET_VALUE",
  //for pagination
  INVOICE_INDEX_META: "INVOICE_INDEX_META",
  INVOICE_PAGE_CHANGED: "INVOICE_PAGE_CHANGED",
  INVOICE_PAGESIZE_CHANGED: "INVOICE_PAGESIZE_CHANGED"
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
  searchCondition: {
    name: "",
    from: "",
    to: "",
    customer_id: ""
  },
  item:null,
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "invoices",
    whitelist: ["meta"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.INVOICE_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.INVOICE_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.INVOICE_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.INVOICE_CHANGE_SEARCH_VALUE:
        const clonedItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...clonedItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.INVOICE_SET_VALUE:
        return { ...state, [action.key]: action.value };    
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.INVOICE_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.INVOICE_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.INVOICE_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.INVOICE_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.INVOICE_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.INVOICE_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.INVOICE_SEARCH_REQUEST, name, value };
}
export function $export(searchCondition) {
  const path = `invoices/export?${serializeQuery({
    name: searchCondition.name,
    from: searchCondition.from,
    to: searchCondition.to,
    type: searchCondition.type
  })}`;
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
export function $showInvoice(id){
  return { type:actionTypes.INVOICE_SHOW_ITEM,id}
}

const invoicesRequest = (meta, searchCondition) =>
  http({
    path: `invoices?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      name: searchCondition.name,
      from: searchCondition.from,
      customer_id: searchCondition.customer_id,
      to: searchCondition.to
    })}`
  }).then(response => response.data);
function* fetchInvoice() {
  try {
    const invoice = yield select(store => store.invoice);
    const result = yield call(
      invoicesRequest,
      invoice.meta,
      invoice.searchCondition
    );
    yield put({
      type: actionTypes.INVOICE_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.INVOICE_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchInvoice({ name, value }) {
  try {
    yield put({ type: actionTypes.INVOICE_CHANGE_SEARCH_VALUE, name, value });
    const invoice = yield select(store => store.invoice);
    const result = yield call(
      invoicesRequest,
      invoice.meta,
      invoice.searchCondition
    );
    yield put({
      type: actionTypes.INVOICE_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.INVOICE_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.invoice.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.INVOICE_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.INVOICE_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.INVOICE_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.INVOICE_INDEX_REQUEST });
}
const findInvoice = id =>
  http({ path: `invoices/${id}` }).then(response => response.data);
function* showItem({id}){
  try {
    const result = yield call(findInvoice,id);
    if(result.id){
      yield put({
        type: actionTypes.INVOICE_SET_VALUE,
        key: "item",
        value: result
      });
    }
  }catch( e ){
    yield put({
      type: actionTypes.INVOICE_SET_VALUE,
      key: "item",
      value: null
    });
  yield put({
      type: actionTypes.TRANSACTION_INDEX_FAILURE,
      error: e.message
    });
  }
}
export function* saga() {
  yield takeLatest(actionTypes.INVOICE_INDEX_REQUEST, fetchInvoice);
  yield takeLatest(actionTypes.INVOICE_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.INVOICE_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.INVOICE_SEARCH_REQUEST, searchInvoice);
  yield takeLeading(actionTypes.INVOICE_SHOW_ITEM,showItem);
}
