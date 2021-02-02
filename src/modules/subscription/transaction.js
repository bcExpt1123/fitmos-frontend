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
  TRANSACTION_INDEX_REQUEST: "TRANSACTION_INDEX_REQUEST",
  TRANSACTION_INDEX_SUCCESS: "TRANSACTION_INDEX_SUCCESS",
  TRANSACTION_INDEX_FAILURE: "TRANSACTION_INDEX_FAILURE",
  TRANSACTION_LOADING_REQUEST: "TRANSACTION_LOADING_REQUEST",
  TRANSACTION_SEARCH_REQUEST: "TRANSACTION_SEARCH_REQUEST",
  TRANSACTION_CHANGE_SEARCH_VALUE: "TRANSACTION_CHANGE_SEARCH_VALUE",
  TRANSACTION_LOG: "TRANSACTION_LOG",
  TRANSACTION_SET_VALUE: "TRANSACTION_SET_VALUE",
  //for pagination
  TRANSACTION_INDEX_META: "TRANSACTION_INDEX_META",
  TRANSACTION_PAGE_CHANGED: "TRANSACTION_PAGE_CHANGED",
  TRANSACTION_PAGESIZE_CHANGED: "TRANSACTION_PAGESIZE_CHANGED"
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
    customer_name: "",
    from: "",
    to: "",
    customer_id: "",
    subscription_id:"",
    type: "all"
  },
  log:"",
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "transactions",
    whitelist: ["meta"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.TRANSACTION_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.TRANSACTION_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.TRANSACTION_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.TRANSACTION_CHANGE_SEARCH_VALUE:
        const clonedItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...clonedItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.TRANSACTION_SET_VALUE:
        return { ...state, [action.key]: action.value };  
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.TRANSACTION_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.TRANSACTION_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.TRANSACTION_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.TRANSACTION_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.TRANSACTION_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.TRANSACTION_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.TRANSACTION_SEARCH_REQUEST, name, value };
}
export function $export(searchCondition) {
  const path = `transactions/export?${serializeQuery({
    customer_name: searchCondition.customer_name,
    from: searchCondition.from,
    to: searchCondition.to,
    type: searchCondition.type
  })}`;
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
export function $showLog(id){
  return { type:actionTypes.TRANSACTION_LOG,id}
}

const transactionsRequest = (meta, searchCondition) =>
  http({
    path: `transactions?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      customer_name: searchCondition.customer_name,
      from: searchCondition.from,
      customer_id: searchCondition.customer_id,
      subscription_id:searchCondition.subscription_id,
      to: searchCondition.to,
      type: searchCondition.type
    })}`
  }).then(response => response.data);
function* fetchTransaction() {
  try {
    const transaction = yield select(store => store.transaction);
    const result = yield call(
      transactionsRequest,
      transaction.meta,
      transaction.searchCondition
    );
    yield put({
      type: actionTypes.TRANSACTION_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.TRANSACTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchTransaction({ name, value }) {
  try {
    yield put({
      type: actionTypes.TRANSACTION_CHANGE_SEARCH_VALUE,
      name,
      value
    });
    const transaction = yield select(store => store.transaction);
    const result = yield call(
      transactionsRequest,
      transaction.meta,
      transaction.searchCondition
    );
    yield put({
      type: actionTypes.TRANSACTION_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.TRANSACTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.transaction.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.TRANSACTION_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.TRANSACTION_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.TRANSACTION_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.TRANSACTION_INDEX_REQUEST });
}
const findLog = id=>
  http({ path: `transactions/${id}/log` }).then(response => response.data);
function* getLog({id}){
  try {
    const result = yield call(findLog,id);
    if(result && result.content){
      yield put({
        type: actionTypes.TRANSACTION_SET_VALUE,
        key: "log",
        value: result.content
      });
    }
  }catch( e ){
    yield put({
      type: actionTypes.TRANSACTION_INDEX_FAILURE,
      error: e.message
    });
  }
}
export function* saga() {
  yield takeLatest(actionTypes.TRANSACTION_INDEX_REQUEST, fetchTransaction);
  yield takeLatest(actionTypes.TRANSACTION_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.TRANSACTION_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.TRANSACTION_SEARCH_REQUEST, searchTransaction);
  yield takeLeading(actionTypes.TRANSACTION_LOG,getLog);
}
