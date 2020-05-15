import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  takeLeading,
  select,
  delay
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
  MEDAL_INDEX_REQUEST: "MEDAL_INDEX_REQUEST",
  MEDAL_INDEX_SUCCESS: "MEDAL_INDEX_SUCCESS",
  MEDAL_INDEX_FAILURE: "MEDAL_INDEX_FAILURE",
  MEDAL_LOADING_REQUEST: "MEDAL_LOADING_REQUEST",
  MEDAL_CHANGE_SEARCH_VALUE: "MEDAL_CHANGE_SEARCH_VALUE",
  MEDAL_ACTION_REQUEST: "MEDAL_ACTION_REQUEST",
  MEDAL_CHANGE_ITEM: "MEDAL_CHANGE_ITEM",
  MEDAL_SAVE_ITEM: "MEDAL_SAVE_ITEM",
  MEDAL_SET_ITEM: "MEDAL_SET_ITEM",
  MEDAL_NEW_ITEM_FETCH: "MEDAL_NEW_ITEM_FETCH",
  MEDAL_SET_ITEM_VALUE: "MEDAL_SET_ITEM_VALUE",
  MEDAL_SET_VALUE: "MEDAL_SET_VALUE",
  MEDAL_CHANGE_SAVE_STATUS: "MEDAL_CHANGE_SAVE_STATUS",
  MEDAL_SET_ITEM_ERROR: "MEDAL_SET_ITEM_ERROR",
  MEDAL_UPLOAD_IMAGE:"MEDAL_UPLOAD_IMAGE",
  //for pagination
  MEDAL_PAGE_CHANGED: "MEDAL_PAGE_CHANGED",
  MEDAL_PAGESIZE_CHANGED: "MEDAL_PAGESIZE_CHANGED",
  //for front page
};

export const selectors = {};

const initialState = {
  data: null,
  meta: {
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
    count:""
  },
  isloading: false,
};

export const reducer = persistReducer(
  {
    storage,
    key: "medals",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {

      case actionTypes.MEDAL_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.MEDAL_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.MEDAL_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        return { ...state, searchCondition };
      case actionTypes.MEDAL_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.MEDAL_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.MEDAL_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };  
      case actionTypes.MEDAL_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.MEDAL_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.MEDAL_SET_VALUE:
        return { ...state, [action.key]: action.value };
    
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.MEDAL_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.MEDAL_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.MEDAL_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.MEDAL_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.MEDAL_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $changeConditionValue(name, value) {
  return { type: actionTypes.MEDAL_SEARCH_REQUEST, name, value };
}
export function $delete(id) {
  return { type: actionTypes.MEDAL_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.MEDAL_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  return { type: actionTypes.MEDAL_NEW_ITEM_FETCH};
}
export function $saveItem(history) {
  return { type: actionTypes.MEDAL_SAVE_ITEM, history };
}
export function $updateItemImage(image) {
  return { type: actionTypes.MEDAL_UPLOAD_IMAGE, image };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.MEDAL_SET_ITEM_VALUE, name, value };
}

const medalsRequest = (meta, searchCondition) =>
  http({
    path: `medals`
  }).then(response => response.data);
function* fetchMedal() {
  try {
    const medal = yield select(store => store.medal);
    const result = yield call(medalsRequest, medal.meta, medal.searchCondition);
    yield put({
      type: actionTypes.MEDAL_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.MEDAL_INDEX_FAILURE, error: e.message });
    }
  }
}
function* callAction({ action, id }) {
  try {
    const result = yield call(medalActionRequest, action, id);
    const medal = yield select(store => store.medal);
    if (action == "delete") {
      yield put({ type: actionTypes.MEDAL_INDEX_REQUEST });
    } else {
      let data = medal.data;
      data.forEach(item => {
        if (item.id == id) {
          if (action == "disable") item.status = "Draft";
          else item.status = "Publish";
        }
      });
      yield put({
        type: actionTypes.MEDAL_INDEX_SUCCESS,
        data: data,
        meta: medal.meta
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.MEDAL_INDEX_FAILURE, error: e.message });
    }
  }
}
function medalActionRequest(action, id) {
  if (action == "delete") {
    return http({ path: `medals/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `medals/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findMedal = id =>
  http({ path: `medals/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const medal = yield select(store => store.medal);
  yield put({ type: actionTypes.MEDAL_LOADING_REQUEST });
  if (medal.data != null) {
    const filterMedals = medal.data.filter(medal => {
      return medal.id == id;
    });
    if (filterMedals.length > 0) {
      yield put({ type: actionTypes.MEDAL_SET_ITEM, item: filterMedals[0] });
      yield put({ type: actionTypes.MEDAL_SET_ITEM_VALUE, name:'uploadImage',value:"" });
      return;
    }
  }
  try {
    const result = yield call(findMedal, id);
    if (result.id)
      yield put({ type: actionTypes.MEDAL_SET_ITEM, item: result });
    else yield put({ type: actionTypes.MEDAL_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.MEDAL_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveMedal = medal => {
  const formData = new FormData();
  formData.append("name", medal.item.name);
  formData.append("count", medal.item.count);
  if (medal.uploadImage) {
    const files = Array.from(medal.uploadImage);
    files.forEach((file, i) => {
      formData.append("image", file);
    });
  }
  if (medal.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `medals/${medal.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `medals`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const medal = yield select(store => store.medal);
  yield put({ type: actionTypes.MEDAL_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveMedal, medal);
    if (result.medal) {
      alert("Saving success.");
      history.push("/admin/medals");
      //yield put({type: actionTypes.MEDAL_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.MEDAL_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.MEDAL_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.MEDAL_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.MEDAL_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
function* newItemFetch(){
  const medal = yield select(store => store.medal);
  const item = {
    id: null,
    name: "",
    count: 0,
    uploadImage: "",
    image: "",
  };
  yield put({ type: actionTypes.MEDAL_SET_ITEM, item });
}


export function* saga() {
  yield takeLeading(actionTypes.MEDAL_INDEX_REQUEST, fetchMedal);
  yield takeLeading(actionTypes.MEDAL_ACTION_REQUEST, callAction);
  yield takeLeading(actionTypes.MEDAL_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.MEDAL_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.MEDAL_NEW_ITEM_FETCH,newItemFetch);
}
