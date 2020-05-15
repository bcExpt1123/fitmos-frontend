import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  takeEvery,
  select,
  delay
} from "redux-saga/effects";
import { push } from "react-router-redux";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  SHORTCODE_INDEX_REQUEST: "SHORTCODE_INDEX_REQUEST",
  SHORTCODE_INDEX_SUCCESS: "SHORTCODE_INDEX_SUCCESS",
  SHORTCODE_INDEX_FAILURE: "SHORTCODE_INDEX_FAILURE",
  SHORTCODE_LOADING_REQUEST: "SHORTCODE_LOADING_REQUEST",
  SHORTCODE_SEARCH_REQUEST: "SHORTCODE_SEARCH_REQUEST",
  SHORTCODE_CHANGE_SEARCH_VALUE: "SHORTCODE_CHANGE_SEARCH_VALUE",
  SHORTCODE_ACTION_REQUEST: "SHORTCODE_ACTION_REQUEST",
  SHORTCODE_CHANGE_ITEM: "SHORTCODE_CHANGE_ITEM",
  SHORTCODE_SAVE_ITEM: "SHORTCODE_SAVE_ITEM",
  SHORTCODE_SET_ITEM: "SHORTCODE_SET_ITEM",
  SHORTCODE_SET_ITEM_VALUE: "SHORTCODE_SET_ITEM_VALUE",
  SHORTCODE_CHANGE_SAVE_STATUS: "SHORTCODE_CHANGE_SAVE_STATUS",
  SHORTCODE_SET_ITEM_ERROR: "SHORTCODE_SET_ITEM_ERROR",
  //for pagination
  SHORTCODE_INDEX_META: "SHORTCODE_INDEX_META",
  SHORTCODE_PAGE_CHANGED: "SHORTCODE_PAGE_CHANGED",
  SHORTCODE_PAGESIZE_CHANGED: "SHORTCODE_PAGESIZE_CHANGED"
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
    search: ""
  },
  errors: {
    name: "",
    link: ""
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "shortcodes",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.SHORTCODE_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.SHORTCODE_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.SHORTCODE_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.SHORTCODE_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.SHORTCODE_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.SHORTCODE_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.SHORTCODE_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.SHORTCODE_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.SHORTCODE_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.SHORTCODE_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.SHORTCODE_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.SHORTCODE_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.SHORTCODE_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.SHORTCODE_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.SHORTCODE_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.SHORTCODE_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.SHORTCODE_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.SHORTCODE_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.SHORTCODE_CHANGE_ITEM, id: id };
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
  return { type: actionTypes.SHORTCODE_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.SHORTCODE_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.SHORTCODE_SET_ITEM_VALUE, name, value };
}

const shortcodesRequest = (meta, searchCondition) =>
  http({
    path: `shortcodes?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchShortcode() {
  try {
    const shortcode = yield select(store => store.shortcode);
    const result = yield call(
      shortcodesRequest,
      shortcode.meta,
      shortcode.searchCondition
    );
    yield put({
      type: actionTypes.SHORTCODE_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SHORTCODE_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchShortcode({ name, value }) {
  try {
    yield put({ type: actionTypes.SHORTCODE_CHANGE_SEARCH_VALUE, name, value });
    const shortcode = yield select(store => store.shortcode);
    const result = yield call(
      shortcodesRequest,
      shortcode.meta,
      shortcode.searchCondition
    );
    yield put({
      type: actionTypes.SHORTCODE_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SHORTCODE_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.shortcode.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.SHORTCODE_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.SHORTCODE_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.SHORTCODE_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SHORTCODE_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    const result = yield call(shortcodeActionRequest, action, id);
    const shortcode = yield select(store => store.shortcode);
    if (action == "delete") {
      yield put({ type: actionTypes.SHORTCODE_INDEX_REQUEST });
    } else {
      let data = shortcode.data;
      data.forEach(item => {
        if (item.id == id) {
          if (action == "disable") item.status = "Disabled";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.SHORTCODE_INDEX_SUCCESS,
        data: data,
        meta: shortcode.meta
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SHORTCODE_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function shortcodeActionRequest(action, id) {
  if (action == "delete") {
    return http({ path: `shortcodes/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `shortcodes/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findShortcode = id =>
  http({ path: `shortcodes/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const shortcodes = yield select(store => store.shortcode.data);
  yield put({ type: actionTypes.SHORTCODE_LOADING_REQUEST });
  if (shortcodes != null) {
    const filterShortcodes = shortcodes.filter(shortcode => {
      return shortcode.id == id;
    });
    if (filterShortcodes.length > 0) {
      yield put({
        type: actionTypes.SHORTCODE_SET_ITEM,
        item: filterShortcodes[0]
      });
      return;
    }
  }
  try {
    const result = yield call(findShortcode, id);
    if (result.id)
      yield put({ type: actionTypes.SHORTCODE_SET_ITEM, item: result });
    else yield put({ type: actionTypes.SHORTCODE_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SHORTCODE_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const saveShortcode = shortcode => {
  const data = {
    name: shortcode.item.name,
    link: shortcode.item.link
  };
  if (shortcode.item.id) {
    return http({
      path: `shortcodes/${shortcode.item.id}`,
      method: "PUT",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    const formData = new FormData();
    formData.append("name", shortcode.item.name);
    formData.append("link", shortcode.item.link);
    return http({ path: `shortcodes`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveItem({ history }) {
  const shortcode = yield select(store => store.shortcode);
  yield put({ type: actionTypes.SHORTCODE_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveShortcode, shortcode);
    if (result.shortcode) {
      alert("Saving success.");
      history.push("/admin/shortcodes");
      //yield put({type: actionTypes.SHORTCODE_INDEX_REQUEST});
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.SHORTCODE_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });
      }
      yield put({
        type: actionTypes.SHORTCODE_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SHORTCODE_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.SHORTCODE_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.SHORTCODE_INDEX_REQUEST, fetchShortcode);
  yield takeLatest(actionTypes.SHORTCODE_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.SHORTCODE_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.SHORTCODE_SEARCH_REQUEST, searchShortcode);
  yield takeLatest(actionTypes.SHORTCODE_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.SHORTCODE_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.SHORTCODE_SAVE_ITEM, saveItem);
}
