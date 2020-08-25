import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  select,
} from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  COUPON_INDEX_REQUEST: "COUPON_INDEX_REQUEST",
  COUPON_INDEX_SUCCESS: "COUPON_INDEX_SUCCESS",
  COUPON_INDEX_FAILURE: "COUPON_INDEX_FAILURE",
  COUPON_LOADING_REQUEST: "COUPON_LOADING_REQUEST",
  COUPON_SEARCH_REQUEST: "COUPON_SEARCH_REQUEST",
  COUPON_CHANGE_SEARCH_VALUE: "COUPON_CHANGE_SEARCH_VALUE",
  COUPON_ACTION_REQUEST: "COUPON_ACTION_REQUEST",
  COUPON_CHANGE_ITEM: "COUPON_CHANGE_ITEM",
  COUPON_SAVE_ITEM: "COUPON_SAVE_ITEM",
  COUPON_SET_ITEM: "COUPON_SET_ITEM",
  COUPON_SET_ITEM_VALUE: "COUPON_SET_ITEM_VALUE",
  COUPON_CHANGE_SAVE_STATUS: "COUPON_CHANGE_SAVE_STATUS",
  COUPON_SET_ITEM_ERROR: "COUPON_SET_ITEM_ERROR",
  //for pagination
  COUPON_INDEX_META: "COUPON_INDEX_META",
  COUPON_PAGE_CHANGED: "COUPON_PAGE_CHANGED",
  COUPON_PAGESIZE_CHANGED: "COUPON_PAGESIZE_CHANGED"
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
  item: null,
  updatedItem: null,
  action: "",
  searchCondition: {
    search: "",
    status: "all"
  },
  errors: {
    code: ""
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "coupons",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.COUPON_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.COUPON_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.COUPON_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.COUPON_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.COUPON_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.COUPON_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.COUPON_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.COUPON_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.COUPON_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.COUPON_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.COUPON_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.COUPON_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.COUPON_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.COUPON_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.COUPON_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.COUPON_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.COUPON_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.COUPON_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.COUPON_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    code: "",
    name: "",
    mail: "",
    discount: "",
    renewal: 0
  };
  return { type: actionTypes.COUPON_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.COUPON_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.COUPON_SET_ITEM_VALUE, name, value };
}

const couponsRequest = (meta, searchCondition) =>
  http({
    path: `coupons?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search,
      status: searchCondition.status
    })}`
  }).then(response => response.data);
function* fetchCoupon() {
  try {
    const coupon = yield select(store => store.coupon);
    const result = yield call(
      couponsRequest,
      coupon.meta,
      coupon.searchCondition
    );
    yield put({
      type: actionTypes.COUPON_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchCoupon({ name, value }) {
  try {
    yield put({ type: actionTypes.COUPON_CHANGE_SEARCH_VALUE, name, value });
    const coupon = yield select(store => store.coupon);
    const result = yield call(
      couponsRequest,
      coupon.meta,
      coupon.searchCondition
    );
    yield put({
      type: actionTypes.COUPON_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.coupon.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.COUPON_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.COUPON_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.COUPON_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.COUPON_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(couponActionRequest, action, id);
    const coupon = yield select(store => store.coupon);
    if (action === "delete") {
      yield put({ type: actionTypes.COUPON_INDEX_REQUEST });
    } else {
      let data = coupon.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Disabled";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.COUPON_INDEX_SUCCESS,
        data: data,
        meta: coupon.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function couponActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `coupons/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `coupons/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findCoupon = id =>
  http({ path: `coupons/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const coupons = yield select(store => store.coupon.data);
  yield put({ type: actionTypes.COUPON_LOADING_REQUEST });
  if (coupons != null) {
    const filterCoupons = coupons.filter(coupon => {
      return coupon.id === id;
    });
    if (filterCoupons.length > 0) {
      yield put({ type: actionTypes.COUPON_SET_ITEM, item: filterCoupons[0] });
      return;
    }
  }
  try {
    const result = yield call(findCoupon, id);
    if (result.id)
      yield put({ type: actionTypes.COUPON_SET_ITEM, item: result });
    else yield put({ type: actionTypes.COUPON_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveCoupon = coupon => {
  const data = {
    code: coupon.item.code,
    name: coupon.item.name,
    mail: coupon.item.mail,
    discount: coupon.item.discount,
    form: coupon.item.form,
    renewal: coupon.item.renewal
  };
  if (coupon.item.id) {
    return http({
      path: `coupons/${coupon.item.id}`,
      method: "PUT",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    const formData = new FormData();
    formData.append("code", coupon.item.code);
    formData.append("name", coupon.item.name);
    formData.append("mail", coupon.item.mail);
    formData.append("discount", coupon.item.discount);
    formData.append("form", coupon.item.form);
    formData.append("renewal", coupon.item.renewal);
    return http({ path: `coupons`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveItem({ history }) {
  const coupon = yield select(store => store.coupon);
  yield put({ type: actionTypes.COUPON_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveCoupon, coupon);
    if (result.coupon) {
      alert("Saving success.");
      history.push("/admin/coupons");
      //yield put({type: actionTypes.COUPON_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.COUPON_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.COUPON_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.COUPON_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.COUPON_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.COUPON_INDEX_REQUEST, fetchCoupon);
  yield takeLatest(actionTypes.COUPON_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.COUPON_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.COUPON_SEARCH_REQUEST, searchCoupon);
  yield takeLatest(actionTypes.COUPON_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.COUPON_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.COUPON_SAVE_ITEM, saveItem);
}
