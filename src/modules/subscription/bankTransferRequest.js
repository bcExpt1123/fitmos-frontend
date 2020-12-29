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
  BANK_TANSFER_REQUEST_INDEX_REQUEST: "BANK_TANSFER_REQUEST_INDEX_REQUEST",
  BANK_TANSFER_REQUEST_INDEX_SUCCESS: "BANK_TANSFER_REQUEST_INDEX_SUCCESS",
  BANK_TANSFER_REQUEST_INDEX_FAILURE: "BANK_TANSFER_REQUEST_INDEX_FAILURE",
  BANK_TANSFER_REQUEST_LOADING_REQUEST: "BANK_TANSFER_REQUEST_LOADING_REQUEST",
  BANK_TANSFER_REQUEST_SEARCH_REQUEST: "BANK_TANSFER_REQUEST_SEARCH_REQUEST",
  BANK_TANSFER_REQUEST_CHANGE_SEARCH_VALUE: "BANK_TANSFER_REQUEST_CHANGE_SEARCH_VALUE",
  BANK_TANSFER_REQUEST_SET_VALUE: "BANK_TANSFER_REQUEST_SET_VALUE",
  BANK_TRANSFER_REQUEST_ACTIONS:"BANK_TRANSFER_REQUEST_ACTIONS",
  //for pagination
  BANK_TANSFER_REQUEST_INDEX_META: "BANK_TANSFER_REQUEST_INDEX_META",
  BANK_TANSFER_REQUEST_PAGE_CHANGED: "BANK_TANSFER_REQUEST_PAGE_CHANGED",
  BANK_TANSFER_REQUEST_PAGESIZE_CHANGED: "BANK_TANSFER_REQUEST_PAGESIZE_CHANGED"
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
    status: "Pending"
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "bankTransferRequests",
    whitelist: ["meta"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.BANK_TANSFER_REQUEST_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.BANK_TANSFER_REQUEST_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.BANK_TANSFER_REQUEST_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.BANK_TANSFER_REQUEST_CHANGE_SEARCH_VALUE:
        const clonedItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...clonedItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.BANK_TANSFER_REQUEST_SET_VALUE:
        return { ...state, [action.key]: action.value };  
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.BANK_TANSFER_REQUEST_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.BANK_TANSFER_REQUEST_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.BANK_TANSFER_REQUEST_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.BANK_TANSFER_REQUEST_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.BANK_TANSFER_REQUEST_SEARCH_REQUEST, name, value };
}
export function $export(searchCondition) {
  const path = `bankTransferRequests/export?${serializeQuery({
    customer_name: searchCondition.customer_name,
    from: searchCondition.from,
    to: searchCondition.to,
    type: searchCondition.type
  })}`;
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bankTransferRequests.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
export function $approve(id){
  return { type: actionTypes.BANK_TRANSFER_REQUEST_ACTIONS, action: "approve", id };
}
export function $reject(id){
  return { type: actionTypes.BANK_TRANSFER_REQUEST_ACTIONS, action: "reject", id };
}
export function $restore(id){
  return { type: actionTypes.BANK_TRANSFER_REQUEST_ACTIONS, action: "restore", id };
}

const bankTransferRequestList = (meta, searchCondition) =>
  http({
    path: `bank?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      customer_name: searchCondition.customer_name,
      from: searchCondition.from,
      customer_id: searchCondition.customer_id,
      subscription_id:searchCondition.subscription_id,
      to: searchCondition.to,
      status: searchCondition.status
    })}`
  }).then(response => response.data);
function* fetchBankTransferRequest() {
  try {
    const bankTransferRequest = yield select(store => store.bankTransferRequest);
    const result = yield call(
      bankTransferRequestList,
      bankTransferRequest.meta,
      bankTransferRequest.searchCondition
    );
    yield put({
      type: actionTypes.BANK_TANSFER_REQUEST_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BANK_TANSFER_REQUEST_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchBankTransferRequest({ name, value }) {
  try {
    yield put({
      type: actionTypes.BANK_TANSFER_REQUEST_CHANGE_SEARCH_VALUE,
      name,
      value
    });
    const bankTransferRequest = yield select(store => store.bankTransferRequest);
    const result = yield call(
      bankTransferRequestList,
      bankTransferRequest.meta,
      bankTransferRequest.searchCondition
    );
    yield put({
      type: actionTypes.BANK_TANSFER_REQUEST_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BANK_TANSFER_REQUEST_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.bankTransferRequest.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.BANK_TANSFER_REQUEST_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.BANK_TANSFER_REQUEST_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST });
}
function actionRequest(action, id) {
  return http({ path: `bank/${id}/${action}`, method: "post" }).then(
    response => response.data
  );
}
function* callAction({ action, id }){
  try {
    yield call(actionRequest, action, id);
    yield put({
      type: actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST,
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.BANK_TANSFER_REQUEST_INDEX_REQUEST, fetchBankTransferRequest);
  yield takeLatest(actionTypes.BANK_TANSFER_REQUEST_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.BANK_TANSFER_REQUEST_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.BANK_TANSFER_REQUEST_SEARCH_REQUEST, searchBankTransferRequest);
  yield takeLatest(actionTypes.BANK_TRANSFER_REQUEST_ACTIONS,callAction);
}
