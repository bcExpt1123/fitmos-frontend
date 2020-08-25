import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLeading,
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
import { actionTypes as eventActionTypes} from "./event";

export const actionTypes = {
  CATEGORY_INDEX_REQUEST: "CATEGORY_INDEX_REQUEST",
  CATEGORY_INDEX_SUCCESS: "CATEGORY_INDEX_SUCCESS",
  CATEGORY_INDEX_FAILURE: "CATEGORY_INDEX_FAILURE",
  CATEGORY_LOADING_REQUEST: "CATEGORY_LOADING_REQUEST",
  CATEGORY_SEARCH_REQUEST: "CATEGORY_SEARCH_REQUEST",
  CATEGORY_CHANGE_SEARCH_VALUE: "CATEGORY_CHANGE_SEARCH_VALUE",
  CATEGORY_ACTION_REQUEST: "CATEGORY_ACTION_REQUEST",
  CATEGORY_CHANGE_ITEM: "CATEGORY_CHANGE_ITEM",
  CATEGORY_SAVE_ITEM: "CATEGORY_SAVE_ITEM",
  CATEGORY_SET_ITEM: "CATEGORY_SET_ITEM",
  CATEGORY_SET_ITEM_VALUE: "CATEGORY_SET_ITEM_VALUE",
  CATEGORY_CHANGE_SAVE_STATUS: "CATEGORY_CHANGE_SAVE_STATUS",
  CATEGORY_SET_ITEM_ERROR: "CATEGORY_SET_ITEM_ERROR",
  //for pagination
  CATEGORY_INDEX_META: "CATEGORY_INDEX_META",
  CATEGORY_PAGE_CHANGED: "CATEGORY_PAGE_CHANGED",
  CATEGORY_PAGESIZE_CHANGED: "CATEGORY_PAGESIZE_CHANGED"
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
    key: "categories",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.CATEGORY_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.CATEGORY_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.CATEGORY_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.CATEGORY_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.CATEGORY_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.CATEGORY_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.CATEGORY_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.CATEGORY_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.CATEGORY_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.CATEGORY_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.CATEGORY_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.CATEGORY_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.CATEGORY_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.CATEGORY_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.CATEGORY_SEARCH_REQUEST, name, value };
}
export function $delete(id) {
  return { type: actionTypes.CATEGORY_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.CATEGORY_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    name: "",
  };
  return { type: actionTypes.CATEGORY_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.CATEGORY_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.CATEGORY_SET_ITEM_VALUE, name, value };
}

const categoriesRequest = (meta, searchCondition) =>
  http({
    path: `categories?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchCategory() {
  try {
    const category = yield select(store => store.category);
    const result = yield call(
      categoriesRequest,
      category.meta,
      category.searchCondition
    );
    yield put({
      type: actionTypes.CATEGORY_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.CATEGORY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchCategory({ name, value }) {
  try {
    yield put({ type: actionTypes.CATEGORY_CHANGE_SEARCH_VALUE, name, value });
    const category = yield select(store => store.category);
    const result = yield call(
      categoriesRequest,
      category.meta,
      category.searchCondition
    );
    yield put({
      type: actionTypes.CATEGORY_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.CATEGORY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.category.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.CATEGORY_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.CATEGORY_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.CATEGORY_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.CATEGORY_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(categoryActionRequest, action, id);
    yield put({ type: actionTypes.CATEGORY_INDEX_REQUEST });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.CATEGORY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function categoryActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `categories/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `categories/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findCategory = id =>
  http({ path: `categories/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const categories = yield select(store => store.category.data);
  yield put({ type: actionTypes.CATEGORY_LOADING_REQUEST });
  if (categories != null) {
    const filterCategorys = categories.filter(category => {
      return category.id === id;
    });
    if (filterCategorys.length > 0) {
      yield put({
        type: actionTypes.CATEGORY_SET_ITEM,
        item: filterCategorys[0]
      });
      return;
    }
  }
  try {
    const result = yield call(findCategory, id);
    if (result.id)
      yield put({ type: actionTypes.CATEGORY_SET_ITEM, item: result });
    else yield put({ type: actionTypes.CATEGORY_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.CATEGORY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const saveCategory = category => {
  const data = {
    name: category.item.name,
    link: category.item.link
  };
  if (category.item.id) {
    return http({
      path: `categories/${category.item.id}`,
      method: "PUT",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    const formData = new FormData();
    formData.append("name", category.item.name);
    formData.append("link", category.item.link);
    return http({ path: `categories`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveItem({ history }) {
  const category = yield select(store => store.category);
  yield put({ type: actionTypes.CATEGORY_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveCategory, category);
    if (result.category) {
      alert("Saving success.");
      yield put({type:eventActionTypes.EVENT_REFETCH_CATEGORY});
      history.push("/admin/categories");
      //yield put({type: actionTypes.CATEGORY_INDEX_REQUEST});
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.CATEGORY_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });
      }
      yield put({
        type: actionTypes.CATEGORY_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.CATEGORY_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.CATEGORY_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
export function* saga() {
  yield takeLeading(actionTypes.CATEGORY_INDEX_REQUEST, fetchCategory);
  yield takeLeading(actionTypes.CATEGORY_PAGE_CHANGED, changePage);
  yield takeLeading(actionTypes.CATEGORY_PAGESIZE_CHANGED, changePageSize);
  yield takeLeading(actionTypes.CATEGORY_SEARCH_REQUEST, searchCategory);
  yield takeLeading(actionTypes.CATEGORY_ACTION_REQUEST, callAction);
  yield takeLeading(actionTypes.CATEGORY_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.CATEGORY_SAVE_ITEM, saveItem);
}
