import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, call, takeLatest, takeEvery, select } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  SERVICE_INDEX_REQUEST: "SERVICE_INDEX_REQUEST",
  SERVICE_INDEX_SUCCESS: "SERVICE_INDEX_SUCCESS",
  SERVICE_INDEX_FAILURE: "SERVICE_INDEX_FAILURE",
  SERVICE_CHANGE_ITEM: "SERVICE_CHANGE_ITEM",
  SERVICE_CHANGE_INTERVAL: "SERVICE_CHANGE_INTERVAL",
  SERVICE_SET_ITEM: "SERVICE_SET_ITEM",
  SERVICE_LOADING_REQUEST: "SERVICE_LOADING_REQUEST",
  SERVICE_UPDATE_ITEM_VALUE: "SERVICE_UPDATE_ITEM_VALUE",
  SERVICE_SET_ITEM_VALUE: "SERVICE_SET_ITEM_VALUE",
  SERVICE_CLONE_ITEM: "SERVICE_CLONE_ITEM",
  SERVICE_UPLOAD_IMAGE: "SERVICE_UPLOAD_IMAGE",
  SERVICE_SAVE_ITEM: "SERVICE_SAVE_ITEM",
  SERVICE_CHANGE_SAVE_STATUS: "SERVICE_CHANGE_SAVE_STATUS",
  SERVICE_FIND_ITEM: "SERVICE_FIND_ITEM",
  //for pagination
  SERVICE_INDEX_META: "SERVICE_INDEX_META",
  SERVICE_PAGE_CHANGED: "SERVICE_PAGE_CHANGED",
  SERVICE_PAGESIZE_CHANGED: "SERVICE_PAGESIZE_CHANGED"
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
  frequency: null,
  activePlan: null,
  updatedItem: null,
  uploadImage: null,
  isSaving: false,
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "services",
    whitelist: ["meta", "item", "activePlan", "frequency"]
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.SERVICE_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.SERVICE_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.SERVICE_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.SERVICE_CHANGE_INTERVAL:
        return {
          ...state,
          frequency: action.frequency,
          activePlan: action.activePlan
        };
      case actionTypes.SERVICE_LOADING_REQUEST:
        return { ...state, isloading: true };

      case actionTypes.SERVICE_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        return { ...state, item };
      case actionTypes.SERVICE_CLONE_ITEM:
        return { ...state, updatedItem: action.item };

      case actionTypes.SERVICE_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };
      case actionTypes.SERVICE_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.SERVICE_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.SERVICE_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.SERVICE_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.SERVICE_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.SERVICE_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.SERVICE_PAGE_CHANGED, page: page };
}

export function $changeItem(id) {
  return { type: actionTypes.SERVICE_CHANGE_ITEM, id: id };
}
export function $saveItem() {
  return { type: actionTypes.SERVICE_SAVE_ITEM };
}
export function $updateItemValue(name, value) {
  return { type: actionTypes.SERVICE_SET_ITEM_VALUE, name, value };
}
export function $updateInterval(frequency, activePlan) {
  return { type: actionTypes.SERVICE_CHANGE_INTERVAL, frequency, activePlan };
}

export function $cloneItem(item) {
  return { type: actionTypes.SERVICE_CLONE_ITEM, item };
}
export function $updateItemImage(image) {
  return { type: actionTypes.SERVICE_UPLOAD_IMAGE, image };
}
export function $findWorkoutSerive() {
  const id = 1;
  return { type: actionTypes.SERVICE_CHANGE_ITEM, id: id };
}
const servicesRequest = meta =>
  http({
    path: `services?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1
    })}`
  }).then(response => response.data);
function* fetchService() {
  try {
    const meta = yield select(store => store.service.meta);
    const result = yield call(servicesRequest, meta);
    yield put({
      type: actionTypes.SERVICE_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.SERVICE_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.service.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.SERVICE_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.SERVICE_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.SERVICE_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SERVICE_INDEX_REQUEST });
}
const findService = id =>
  http({ path: `services/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const services = yield select(store => store.service.data);
  yield put({ type: actionTypes.SERVICE_LOADING_REQUEST });
  if (services != null) {
    const filterServices = services.filter(service => {
      return service.id == id;
    });
    if (filterServices.length > 0) {
      yield put({
        type: actionTypes.SERVICE_SET_ITEM,
        item: filterServices[0]
      });
      return;
    }
  }
  try {
    const result = yield call(findService, id);
    if (result.id)
      yield put({ type: actionTypes.SERVICE_SET_ITEM, item: result });
    else yield put({ type: actionTypes.SERVICE_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.SERVICE_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveService = service => {
  let formData = new FormData();
  if (service.uploadImage) {
    const files = Array.from(service.uploadImage);
    files.forEach((file, i) => {
      formData.append("photo", file);
    });
  }
  formData.append("title", service.item.title);
  formData.append("description", service.item.description);
  formData.append("monthly", service.item.monthly);
  formData.append("quarterly", service.item.quarterly);
  formData.append("semiannual", service.item.semiannual);
  formData.append("yearly", service.item.yearly);
  formData.append("frequency", service.item.frequency);
  formData.append("_method", "PUT");
  return http({
    path: `services/${service.item.id}`,
    method: "POST",
    data: formData
  }).then(res => res.data);
};
function* saveItem() {
  const service = yield select(store => store.service);
  yield put({ type: actionTypes.SERVICE_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveService, service);
    if (result.service) {
      yield put({ type: actionTypes.SERVICE_SET_ITEM, item: result.service });
      alert("Saving success.");
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.SERVICE_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({
        type: actionTypes.SERVICE_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.SERVICE_INDEX_REQUEST, fetchService);
  yield takeLatest(actionTypes.SERVICE_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.SERVICE_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.SERVICE_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.SERVICE_SAVE_ITEM, saveItem);
}
