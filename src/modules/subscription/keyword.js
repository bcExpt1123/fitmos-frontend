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
  KEYWORD_INDEX_REQUEST: "KEYWORD_INDEX_REQUEST",
  KEYWORD_INDEX_SUCCESS: "KEYWORD_INDEX_SUCCESS",
  KEYWORD_INDEX_FAILURE: "KEYWORD_INDEX_FAILURE",
  KEYWORD_LOADING_REQUEST: "KEYWORD_LOADING_REQUEST",
  KEYWORD_SEARCH_REQUEST: "KEYWORD_SEARCH_REQUEST",
  KEYWORD_CHANGE_SEARCH_VALUE: "KEYWORD_CHANGE_SEARCH_VALUE",
  KEYWORD_ACTION_REQUEST: "KEYWORD_ACTION_REQUEST",
  KEYWORD_CHANGE_ITEM: "KEYWORD_CHANGE_ITEM",
  KEYWORD_SAVE_ITEM: "KEYWORD_SAVE_ITEM",
  KEYWORD_SET_ITEM: "KEYWORD_SET_ITEM",
  KEYWORD_SET_ITEM_VALUE: "KEYWORD_SET_ITEM_VALUE",
  KEYWORD_CHANGE_SAVE_STATUS: "KEYWORD_CHANGE_SAVE_STATUS",
  KEYWORD_SET_ITEM_ERROR: "KEYWORD_SET_ITEM_ERROR",
  KEYWORD_SET_LIST: "KEYWORD_SET_LIST",
  KEYWORD_DELETE_LIST: "KEYWORD_DELETE_LIST",
  KEYWORD_UPDATE_LIST: "KEYWORD_UPDATE_LIST",
  //for pagination
  KEYWORD_INDEX_META: "KEYWORD_INDEX_META",
  KEYWORD_PAGE_CHANGED: "KEYWORD_PAGE_CHANGED",
  KEYWORD_PAGESIZE_CHANGED: "KEYWORD_PAGESIZE_CHANGED"
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
  all:false,
  searchCondition: {
    search: ""
  },
  errors: {
    name: "",
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "keywords",
    whitelist: ['all']
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.KEYWORD_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.KEYWORD_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.KEYWORD_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.KEYWORD_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.KEYWORD_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.KEYWORD_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.KEYWORD_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.KEYWORD_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.KEYWORD_SET_LIST:
        return {...state,all:action.list};  
      case actionTypes.KEYWORD_DELETE_LIST:
        return {...state,all:false};  
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.KEYWORD_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.KEYWORD_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.KEYWORD_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.KEYWORD_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.KEYWORD_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.KEYWORD_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.KEYWORD_SEARCH_REQUEST, name, value };
}
export function $delete(id) {
  return { type: actionTypes.KEYWORD_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.KEYWORD_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    name: "",
  };
  return { type: actionTypes.KEYWORD_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.KEYWORD_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.KEYWORD_SET_ITEM_VALUE, name, value };
}

const keywordsRequest = (meta, searchCondition) =>
  http({
    path: `keywords?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchKeyword() {
  try {
    const keyword = yield select(store => store.keyword);
    const result = yield call(
      keywordsRequest,
      keyword.meta,
      keyword.searchCondition
    );
    yield put({
      type: actionTypes.KEYWORD_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.KEYWORD_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchKeyword({ name, value }) {
  try {
    yield put({ type: actionTypes.KEYWORD_CHANGE_SEARCH_VALUE, name, value });
    const keyword = yield select(store => store.keyword);
    const result = yield call(
      keywordsRequest,
      keyword.meta,
      keyword.searchCondition
    );
    yield put({
      type: actionTypes.KEYWORD_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.KEYWORD_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.keyword.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.KEYWORD_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.KEYWORD_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.KEYWORD_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.KEYWORD_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(keywordActionRequest, action, id);
    if (action === "delete") {
      yield put({ type: actionTypes.KEYWORD_INDEX_REQUEST });
    } 
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.KEYWORD_INDEX_FAILURE,
        error: e.message
      });
    }
  }
  yield put({ type: actionTypes.KEYWORD_DELETE_LIST});  
}
function keywordActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `keywords/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `keywords/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findKeyword = id =>
  http({ path: `keywords/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const keywords = yield select(store => store.keyword.data);
  yield put({ type: actionTypes.KEYWORD_LOADING_REQUEST });
  if (keywords != null) {
    const filterKeywords = keywords.filter(keyword => {
      return keyword.id === id;
    });
    if (filterKeywords.length > 0) {
      yield put({
        type: actionTypes.KEYWORD_SET_ITEM,
        item: filterKeywords[0]
      });
      return;
    }
  }
  try {
    const result = yield call(findKeyword, id);
    if (result.id)
      yield put({ type: actionTypes.KEYWORD_SET_ITEM, item: result });
    else yield put({ type: actionTypes.KEYWORD_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.KEYWORD_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const saveKeyword = keyword => {
  const formData = new FormData();
  formData.append("name", keyword.item.name);
  if (keyword.item.id) {
    formData.append("_method", "put");
    return http({
      path: `keywords/${keyword.item.id}`,
      method: "POST",
      data: formData
    }).then(res => res.data);
  } else {
    return http({ path: `keywords`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveItem({ history }) {
  const keyword = yield select(store => store.keyword);
  yield put({ type: actionTypes.KEYWORD_CHANGE_SAVE_STATUS, status: true });
  yield put({ type: actionTypes.KEYWORD_DELETE_LIST});
  try {
    const result = yield call(saveKeyword, keyword);
    if (result.keyword) {
      alert("Saving success.");
      history.push("/admin/keywords");
      //yield put({type: actionTypes.KEYWORD_INDEX_REQUEST});
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.KEYWORD_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });
      }
      yield put({
        type: actionTypes.KEYWORD_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.KEYWORD_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.KEYWORD_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
const getList = ()=>http({ path: `keywords/all` }).then(response => response.data);
function* getAllItems(){
  const result = yield call(getList);
  yield put({type:actionTypes.KEYWORD_SET_LIST,list:result})
}
export function* saga() {
  yield takeLatest(actionTypes.KEYWORD_INDEX_REQUEST, fetchKeyword);
  yield takeLatest(actionTypes.KEYWORD_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.KEYWORD_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.KEYWORD_SEARCH_REQUEST, searchKeyword);
  yield takeLatest(actionTypes.KEYWORD_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.KEYWORD_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.KEYWORD_SAVE_ITEM, saveItem);
  yield takeLatest(actionTypes.KEYWORD_UPDATE_LIST,getAllItems)
}
