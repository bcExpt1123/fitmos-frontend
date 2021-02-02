import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
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
import { addAlertMessage } from "../../app/pages/home/redux/alert/actions";

export const actionTypes = {
  EVENTO_INDEX_REQUEST: "EVENTO_INDEX_REQUEST",
  EVENTO_INDEX_SUCCESS: "EVENTO_INDEX_SUCCESS",
  EVENTO_INDEX_FAILURE: "EVENTO_INDEX_FAILURE",
  EVENTO_LOADING_REQUEST: "EVENTO_LOADING_REQUEST",
  EVENTO_SEARCH_REQUEST: "EVENTO_SEARCH_REQUEST",
  EVENTO_CHANGE_SEARCH_VALUE: "EVENTO_CHANGE_SEARCH_VALUE",
  EVENTO_ACTION_REQUEST: "EVENTO_ACTION_REQUEST",
  EVENTO_CHANGE_ITEM: "EVENTO_CHANGE_ITEM",
  EVENTO_SAVE_ITEM: "EVENTO_SAVE_ITEM",
  EVENTO_SET_ITEM: "EVENTO_SET_ITEM",
  EVENTO_NEW_ITEM_FETCH: "EVENTO_NEW_ITEM_FETCH",
  EVENTO_SET_ITEM_VALUE: "EVENTO_SET_ITEM_VALUE",
  EVENTO_SET_VALUE: "EVENTO_SET_VALUE",
  EVENTO_CHANGE_SAVE_STATUS: "EVENTO_CHANGE_SAVE_STATUS",
  EVENTO_SET_ITEM_ERROR: "EVENTO_SET_ITEM_ERROR",
  EVENTO_UPLOAD_IMAGE:"EVENTO_UPLOAD_IMAGE",
  //for pagination
  EVENTO_INDEX_META: "EVENTO_INDEX_META",
  EVENTO_PAGE_CHANGED: "EVENTO_PAGE_CHANGED",
  EVENTO_PAGESIZE_CHANGED: "EVENTO_PAGESIZE_CHANGED",
  //for front page
  EVENTO_FRONT_INDEX_REQUEST:"EVENTO_FRONT_INDEX_REQUEST",
  EVENTO_FRONT_INDEX_SUCCESS:"EVENTO_FRONT_INDEX_SUCCESS",
  EVENTO_FRONT_INDEX_META: "EVENTO_FRONT_INDEX_META",
  EVENTO_FRONT_PAGE_CHANGED: "EVENTO_FRONT_PAGE_CHANGED",
  EVENTO_FRONT_SUBSCRIBED: "EVENTO_FRONT_SUBSCRIBED",
  EVENTO_FRONT_SUBSCRIBE_WITH_FACEBOOK: "EVENTO_FRONT_SUBSCRIBE_WITH_FACEBOOK",
  EVENTO_FRONT_SUBSCRIBE_WITH_GOOGLE: "EVENTO_FRONT_SUBSCRIBE_WITH_GOOGLE",
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
  frontData:null,
  frontMeta: {
    page: 1,
    pageSize: 6,
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
    title: "",
    address:""
  },
  isloading: false,
  subscribed:false,
};

export const reducer = persistReducer(
  {
    storage,
    key: "eventos",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.EVENTO_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.EVENTO_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.EVENTO_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.EVENTO_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.EVENTO_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.EVENTO_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.EVENTO_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.images };  
      case actionTypes.EVENTO_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.EVENTO_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      case actionTypes.EVENTO_FRONT_INDEX_META:
        return { ...state, frontMeta: { ...state.frontMeta, ...action.frontMeta } };

      case actionTypes.EVENTO_SET_VALUE:
        return { ...state, [action.key]: action.value };
  
      case actionTypes.EVENTO_FRONT_INDEX_SUCCESS:
        return {
          ...state,
          frontData: action.frontData,
          frontMeta: { ...state.frontMeta, ...action.frontMeta }
        };
  
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.EVENTO_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.EVENTO_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.EVENTO_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.EVENTO_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.EVENTO_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.EVENTO_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.EVENTO_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.EVENTO_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  return { type: actionTypes.EVENTO_NEW_ITEM_FETCH};
}
export function $saveItem(history) {
  return { type: actionTypes.EVENTO_SAVE_ITEM, history };
}
export function $updateItemImage(images) {
  return { type: actionTypes.EVENTO_UPLOAD_IMAGE, images };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.EVENTO_SET_ITEM_VALUE, name, value };
}
export const $fetchFrontIndex = () => ({ type: actionTypes.EVENTO_FRONT_INDEX_REQUEST });
export function $frontPage(page = 1) {
  return { type: actionTypes.EVENTO_FRONT_PAGE_CHANGED, page: page };
}
export function $subscribe(name,email){
  return { type:actionTypes.EVENTO_FRONT_SUBSCRIBED, payload:{name, email}};
}
export function $subscribeWithFacebook(){
  return { type:actionTypes.EVENTO_FRONT_SUBSCRIBE_WITH_FACEBOOK};
}
export function $subscribeWithGoogle(name,email){
  return { type:actionTypes.EVENTO_FRONT_SUBSCRIBE_WITH_GOOGLE};
}

const eventsRequest = (meta, searchCondition) =>
  http({
    path: `eventos?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchEvent() {
  try {
    const evento = yield select(store => store.evento);
    const result = yield call(eventsRequest, evento.meta, evento.searchCondition);
    yield put({
      type: actionTypes.EVENTO_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchEvent({ name, value }) {
  try {
    yield put({ type: actionTypes.EVENTO_CHANGE_SEARCH_VALUE, name, value });
    const evento = yield select(store => store.evento);
    const result = yield call(eventsRequest, evento.meta, evento.searchCondition);
    yield put({
      type: actionTypes.EVENTO_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.evento.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENTO_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.EVENTO_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(eventActionRequest, action, id);
    const evento = yield select(store => store.evento);
    if (action === "delete") {
      yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
    } else {
      let data = evento.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Draft";
          else item.status = "Publish";
        }
      });
      yield put({
        type: actionTypes.EVENTO_INDEX_SUCCESS,
        data: data,
        meta: evento.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function eventActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `eventos/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `eventos/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findEvent = id =>
  http({ path: `eventos/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const evento = yield select(store => store.evento);
  const auth = yield select(store => store.auth);
  
  yield put({ type: actionTypes.EVENTO_LOADING_REQUEST });
  if (evento.data != null) {
    const filterEvents = evento.data.filter(evento => {
      return evento.id === id;
    });
    if (filterEvents.length > 0) {
      yield put({ type: actionTypes.EVENTO_SET_ITEM, item: filterEvents[0] });
      yield put({ type: actionTypes.EVENTO_UPLOAD_IMAGE, images: [] });
      return;
    }
  }
  try {
    const result = yield call(findEvent, id);
    if (result.id)
      yield put({ type: actionTypes.EVENTO_SET_ITEM, item: result });
    else yield put({ type: actionTypes.EVENTO_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveEvent = evento => {
  const formData = new FormData();
  formData.append("title", evento.item.title);
  formData.append("description", evento.item.description);
  formData.append("done_date", evento.item.date + ' ' + evento.item.datetime+':00');
  formData.append("address", evento.item.address);
  formData.append("latitude", evento.item.latitude);
  formData.append("longitude", evento.item.longitude);
  if (evento.uploadImage) {
    evento.uploadImage.forEach((file, i) => {
      if(file.file)formData.append(`images[${i}]`, file.file);
      else formData.append(`image_ids[${i}]`, file.id);
    });
  }

  if (evento.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `eventos/${evento.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `eventos`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const evento = yield select(store => store.evento);
  yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveEvent, evento);
    if (result.evento) {
      alert("Saving success.");
      history.push("/admin/eventos");
      //yield put({type: actionTypes.EVENTO_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.EVENTO_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
function* newItemFetch(){
  const evento = yield select(store => store.evento);
  const item = {
    id: null,
    title: "",
    description: "",
    address: "",
    date:"",
    datetime:"",
    latitude:null,
    longitude:null,
    status:"Publish",
  };
  yield put({ type: actionTypes.EVENTO_SET_ITEM, item });
}
const eventsFrontRequest = (meta) =>
  http({
    path: `eventos/home?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
    })}`
  }).then(response => response.data);
function* fetchFrontEvent(){
  try {
    const evento = yield select(store => store.evento);
    const result = yield call(eventsFrontRequest, evento.frontMeta);
    yield put({
      type: actionTypes.EVENTO_FRONT_INDEX_SUCCESS,
      frontData: result.data,
      frontMeta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
  }
}
function* changeFrontPage({ page }) {
  const frontMeta = yield select(store => store.evento.frontMeta);
  if (page < 0) {
    page = 0;
  }

  if (page > frontMeta.pageTotal) {
    page = frontMeta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENTO_FRONT_INDEX_META, frontMeta: { page: page } });
  yield put({ type: actionTypes.EVENTO_FRONT_INDEX_REQUEST });
}
export function* saga() {
  yield takeLeading(actionTypes.EVENTO_INDEX_REQUEST, fetchEvent);
  yield takeLeading(actionTypes.EVENTO_PAGE_CHANGED, changePage);
  yield takeLeading(actionTypes.EVENTO_PAGESIZE_CHANGED, changePageSize);
  yield takeLeading(actionTypes.EVENTO_SEARCH_REQUEST, searchEvent);
  yield takeLeading(actionTypes.EVENTO_ACTION_REQUEST, callAction);
  yield takeLeading(actionTypes.EVENTO_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.EVENTO_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.EVENTO_NEW_ITEM_FETCH,newItemFetch);
  yield takeLeading(actionTypes.EVENTO_FRONT_INDEX_REQUEST, fetchFrontEvent);
  yield takeLeading(actionTypes.EVENTO_FRONT_PAGE_CHANGED, changeFrontPage);
}
