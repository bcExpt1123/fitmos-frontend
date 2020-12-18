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
  LINKCOUPON_INDEX_REQUEST: "LINKCOUPON_INDEX_REQUEST",
  LINKCOUPON_INDEX_SUCCESS: "LINKCOUPON_INDEX_SUCCESS",
  LINKCOUPON_INDEX_FAILURE: "LINKCOUPON_INDEX_FAILURE",
  LINKCOUPON_LOADING_REQUEST: "LINKCOUPON_LOADING_REQUEST",
  LINKCOUPON_SEARCH_REQUEST: "LINKCOUPON_SEARCH_REQUEST",
  LINKCOUPON_CHANGE_SEARCH_VALUE: "LINKCOUPON_CHANGE_SEARCH_VALUE",
  LINKCOUPON_ACTION_REQUEST: "LINKCOUPON_ACTION_REQUEST",
  LINKCOUPON_CHANGE_ITEM: "LINKCOUPON_CHANGE_ITEM",
  LINKCOUPON_SAVE_ITEM: "LINKCOUPON_SAVE_ITEM",
  LINKCOUPON_SET_ITEM: "LINKCOUPON_SET_ITEM",
  LINKCOUPON_SET_ITEM_VALUE: "LINKCOUPON_SET_ITEM_VALUE",
  LINKCOUPON_CHANGE_SAVE_STATUS: "LINKCOUPON_CHANGE_SAVE_STATUS",
  LINKCOUPON_SET_ITEM_ERROR: "LINKCOUPON_SET_ITEM_ERROR",
  //for pagination
  LINKCOUPON_INDEX_META: "LINKCOUPON_INDEX_META",
  LINKCOUPON_PAGE_CHANGED: "LINKCOUPON_PAGE_CHANGED",
  LINKCOUPON_PAGESIZE_CHANGED: "LINKCOUPON_PAGESIZE_CHANGED"
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
    type: "invitations"
  },
  errors: {
    code: ""
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "linkCoupons",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.LINKCOUPON_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.LINKCOUPON_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.LINKCOUPON_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.LINKCOUPON_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.LINKCOUPON_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.LINKCOUPON_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.LINKCOUPON_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.LINKCOUPON_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.LINKCOUPON_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.LINKCOUPON_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.LINKCOUPON_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.LINKCOUPON_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.LINKCOUPON_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.LINKCOUPON_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.LINKCOUPON_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.LINKCOUPON_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.LINKCOUPON_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.LINKCOUPON_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.LINKCOUPON_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    code: "",
    type:"InvitationEmail",
    expiration:"",
    max_user_count:"",
    email_list:"",
    emails:[]
  };
  return { type: actionTypes.LINKCOUPON_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.LINKCOUPON_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.LINKCOUPON_SET_ITEM_VALUE, name, value };
}

const linkCouponsRequest = (meta, searchCondition) =>
  http({
    path: `coupons?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search,
      type: searchCondition.type
    })}`
  }).then(response => response.data);
function* fetchCoupon() {
  try {
    const linkCoupon = yield select(store => store.linkCoupon);
    const result = yield call(
      linkCouponsRequest,
      linkCoupon.meta,
      linkCoupon.searchCondition
    );
    yield put({
      type: actionTypes.LINKCOUPON_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchCoupon({ name, value }) {
  try {
    yield put({ type: actionTypes.LINKCOUPON_CHANGE_SEARCH_VALUE, name, value });
    const linkCoupon = yield select(store => store.linkCoupon);
    const result = yield call(
      linkCouponsRequest,
      linkCoupon.meta,
      linkCoupon.searchCondition
    );
    yield put({
      type: actionTypes.LINKCOUPON_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.linkCoupon.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.LINKCOUPON_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.LINKCOUPON_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.LINKCOUPON_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.LINKCOUPON_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(linkCouponActionRequest, action, id);
    const linkCoupon = yield select(store => store.linkCoupon);
    if (action === "delete") {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_REQUEST });
    } else {
      let data = linkCoupon.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Disabled";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.LINKCOUPON_INDEX_SUCCESS,
        data: data,
        meta: linkCoupon.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
function linkCouponActionRequest(action, id) {
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
  const linkCoupons = yield select(store => store.linkCoupon.data);
  yield put({ type: actionTypes.LINKCOUPON_LOADING_REQUEST });
  if (linkCoupons != null) {
    const filterCoupons = linkCoupons.filter(linkCoupon => {
      return linkCoupon.id === id;
    });
    if (filterCoupons.length > 0) {
      yield put({ type: actionTypes.LINKCOUPON_SET_ITEM, item: filterCoupons[0] });
      return;
    }
  }
  try {
    const result = yield call(findCoupon, id);
    if (result.id)
      yield put({ type: actionTypes.LINKCOUPON_SET_ITEM, item: result });
    else yield put({ type: actionTypes.LINKCOUPON_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveCoupon = linkCoupon => {
    const formData = new FormData();
    formData.append("code", linkCoupon.item.code);
    formData.append("name", linkCoupon.item.code);
    formData.append("expiration", linkCoupon.item.expiration);
    formData.append("discount", 100);
    formData.append("form", '%');
    formData.append("type", linkCoupon.item.type);
    formData.append("max_user_count", linkCoupon.item.max_user_count);
    formData.append("email_list", linkCoupon.item.email_list);
    return http({ path: `coupons`, method: "POST", data: formData }).then(
      res => res.data
    );
  // }
};
function* saveItem({ history }) {
  const linkCoupon = yield select(store => store.linkCoupon);
  yield put({ type: actionTypes.LINKCOUPON_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveCoupon, linkCoupon);
    if (result.coupon) {
      alert("Saving success.");
      history.push("/admin/link-coupons");
      //yield put({type: actionTypes.LINKCOUPON_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.LINKCOUPON_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.LINKCOUPON_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.LINKCOUPON_INDEX_FAILURE, error: e.message });
      if (e.response.status === 422) {
        if(e.response.data.errors && e.response.data.errors.code){
          alert(e.response.data.errors.code[0]);
        }
        else alert("Saving failed.");
      }else{
        alert("Saving failed.");
      }
      yield put({ type: actionTypes.LINKCOUPON_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.LINKCOUPON_INDEX_REQUEST, fetchCoupon);
  yield takeLatest(actionTypes.LINKCOUPON_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.LINKCOUPON_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.LINKCOUPON_SEARCH_REQUEST, searchCoupon);
  yield takeLatest(actionTypes.LINKCOUPON_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.LINKCOUPON_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.LINKCOUPON_SAVE_ITEM, saveItem);
}
