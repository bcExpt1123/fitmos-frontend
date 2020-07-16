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
import { push } from "react-router-redux";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import {
  logOut,
  deleteAuthData
} from "../../app/pages/home/redux/auth/actions";
import { setWorkout } from "../../app/pages/home/redux/done/actions";

export const actionTypes = {
  BENCHMARK_INDEX_REQUEST: "BENCHMARK_INDEX_REQUEST",
  BENCHMARK_INDEX_SUCCESS: "BENCHMARK_INDEX_SUCCESS",
  BENCHMARK_INDEX_FAILURE: "BENCHMARK_INDEX_FAILURE",
  BENCHMARK_LOADING_REQUEST: "BENCHMARK_LOADING_REQUEST",
  BENCHMARK_SEARCH_REQUEST: "BENCHMARK_SEARCH_REQUEST",
  BENCHMARK_CHANGE_SEARCH_VALUE: "BENCHMARK_CHANGE_SEARCH_VALUE",
  BENCHMARK_ACTION_REQUEST: "BENCHMARK_ACTION_REQUEST",
  BENCHMARK_CHANGE_ITEM: "BENCHMARK_CHANGE_ITEM",
  BENCHMARK_UPLOAD_IMAGE: "BENCHMARK_UPLOAD_IMAGE",
  BENCHMARK_SAVE_ITEM: "BENCHMARK_SAVE_ITEM",
  BENCHMARK_SET_ITEM: "BENCHMARK_SET_ITEM",
  BENCHMARK_SET_VALUE: "BENCHMARK_SET_VALUE",
  BENCHMARK_SET_ITEM_VALUE: "BENCHMARK_SET_ITEM_VALUE",
  BENCHMARK_CHANGE_SAVE_STATUS: "BENCHMARK_CHANGE_SAVE_STATUS",
  BENCHMARK_SET_ITEM_ERROR: "BENCHMARK_SET_ITEM_ERROR",
  BENCHMARK_FIND_PUBLISHED: "BENCHMARK_FIND_PUBLISHED",
  BENCHMARK_UPDATE_RESULT: "BENCHMARK_UPDATE_RESULT",
  BENCHMARK_UPDATE_RESULT_ACTION: "BENCHMARK_UPDATE_RESULT_ACTION",
  BENCHMARK_RESET_PUBLISHED: "BENCHMARK_RESET_PUBLISHED",
  //for pagination
  BENCHMARK_INDEX_META: "BENCHMARK_INDEX_META",
  BENCHMARK_PAGE_CHANGED: "BENCHMARK_PAGE_CHANGED",
  BENCHMARK_PAGESIZE_CHANGED: "BENCHMARK_PAGESIZE_CHANGED"
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
  published: [],
  results: {},
  workouts: null, //recent workouts on customer dashboard
  updatedItem: null,
  action: "",
  searchCondition: {
    search: ""
  },
  uploadImage: null,
  errors: {
    title: "",
    description: ""
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "benchmarks",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.BENCHMARK_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.BENCHMARK_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.BENCHMARK_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.BENCHMARK_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.BENCHMARK_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };
      case actionTypes.BENCHMARK_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.BENCHMARK_SET_VALUE:
        return { ...state, [action.key]: action.value };
      case actionTypes.BENCHMARK_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false,
          uploadImage: null
        };
      case actionTypes.BENCHMARK_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.BENCHMARK_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.BENCHMARK_UPDATE_RESULT:
        const clonedPublished = [...state.published];
        const index = clonedPublished.findIndex(item => item.id == action.id);
        if (index > -1) {
          clonedPublished[index].result = action.repetition;
        }
        return { ...state, published: clonedPublished };
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.BENCHMARK_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.BENCHMARK_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.BENCHMARK_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.BENCHMARK_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.BENCHMARK_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.BENCHMARK_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.BENCHMARK_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.BENCHMARK_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.BENCHMARK_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.BENCHMARK_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.BENCHMARK_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = { id: null, title: "", description: "", time: "", image: "",immediate:true,date:"",datetime:"" };
  return { type: actionTypes.BENCHMARK_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.BENCHMARK_SAVE_ITEM, history };
}
export function $updateItemImage(image) {
  return { type: actionTypes.BENCHMARK_UPLOAD_IMAGE, image };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.BENCHMARK_SET_ITEM_VALUE, name, value };
}
export function $findPublished() {
  return { type: actionTypes.BENCHMARK_FIND_PUBLISHED };
}
export function $resetPublished() {
  return { type: actionTypes.BENCHMARK_RESET_PUBLISHED };
}
export function $updatePublishedResult({ id, repetition }) {
  return { type: actionTypes.BENCHMARK_UPDATE_RESULT_ACTION, id, repetition };
}
const benchmarksRequest = (meta, searchCondition) =>
  http({
    path: `benchmarks?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchBenchmark() {
  try {
    const benchmark = yield select(store => store.benchmark);
    const result = yield call(
      benchmarksRequest,
      benchmark.meta,
      benchmark.searchCondition
    );
    yield put({
      type: actionTypes.BENCHMARK_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BENCHMARK_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchBenchmark({ name, value }) {
  try {
    yield put({ type: actionTypes.BENCHMARK_CHANGE_SEARCH_VALUE, name, value });
    const benchmark = yield select(store => store.benchmark);
    const result = yield call(
      benchmarksRequest,
      benchmark.meta,
      benchmark.searchCondition
    );
    yield put({
      type: actionTypes.BENCHMARK_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BENCHMARK_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.benchmark.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.BENCHMARK_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.BENCHMARK_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.BENCHMARK_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.BENCHMARK_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    const result = yield call(benchmarkActionRequest, action, id);
    const benchmark = yield select(store => store.benchmark);
    if (action == "delete") {
      yield put({ type: actionTypes.BENCHMARK_INDEX_REQUEST });
    } else {
      let data = benchmark.data;
      data.forEach(item => {
        if (item.id == id) {
          if (action == "disable") item.status = "Draft";
          else item.status = "Publish";
        }
      });
      yield put({
        type: actionTypes.BENCHMARK_INDEX_SUCCESS,
        data: data,
        meta: benchmark.meta
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BENCHMARK_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function benchmarkActionRequest(action, id) {
  if (action == "delete") {
    return http({ path: `benchmarks/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `benchmarks/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findBenchmark = id =>
  http({ path: `benchmarks/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const benchmarks = yield select(store => store.benchmark.data);
  yield put({ type: actionTypes.BENCHMARK_LOADING_REQUEST });
  if (benchmarks != null) {
    const filterBenchmarks = benchmarks.filter(benchmark => {
      return benchmark.id == id;
    });
    if (filterBenchmarks.length > 0) {
      filterBenchmarks[0].immediate = false;
      yield put({
        type: actionTypes.BENCHMARK_SET_ITEM,
        item: filterBenchmarks[0]
      });
      yield put({ type: actionTypes.BENCHMARK_UPLOAD_IMAGE, image: null });
      return;
    }
  }
  try {
    const result = yield call(findBenchmark, id);
    if (result.id)
      yield put({ type: actionTypes.BENCHMARK_SET_ITEM, item: result });
    else yield put({ type: actionTypes.BENCHMARK_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BENCHMARK_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const saveBenchmark = benchmark => {
  const formData = new FormData();
  formData.append("title", benchmark.item.title);
  formData.append("description", benchmark.item.description);
  formData.append("time", benchmark.item.time);
  formData.append("post_date", benchmark.item.date + ' ' + benchmark.item.datetime+':00');
  if (benchmark.uploadImage) {
    const files = Array.from(benchmark.uploadImage);
    files.forEach((file, i) => {
      formData.append("image", file);
    });
  }
  if (benchmark.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `benchmarks/${benchmark.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `benchmarks`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const benchmark = yield select(store => store.benchmark);
  yield put({ type: actionTypes.BENCHMARK_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveBenchmark, benchmark);
    if (result.benchmark) {
      alert("Saving success.");
      history.push("/admin/benchmarks");
      //yield put({type: actionTypes.BENCHMARK_INDEX_REQUEST});
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.BENCHMARK_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });
      }
      yield put({
        type: actionTypes.BENCHMARK_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.BENCHMARK_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.BENCHMARK_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
const getPublished = () =>
  http({ path: `benchmarks/published` }).then(response => response.data);
const getHistory = () =>
  http({ path: `benchmarkResults/history` }).then(response => response.data);
const getRecentWorkouts = () =>
  http({ path: `customers/recentWorkouts` }).then(response => response.data);
function* findPublished() {
  const benchmark = yield select(store => store.benchmark);
  if (benchmark.published.length == 0) {
    try {
      const {workouts,profile:{fromWorkout,fromWorkoutImage,toWorkout,toWorkoutImage,workoutCount}} = yield call(getRecentWorkouts);
      yield put({
        type: actionTypes.BENCHMARK_SET_VALUE,
        key: "workouts",
        value: workouts
      });
      yield put(setWorkout({fromWorkout,fromWorkoutImage,toWorkout,toWorkoutImage,workoutCount}));
    } catch (e) {
      if (e.response.status == 401) {
        yield put({ type: deleteAuthData });
        return;
      }
    }
    try {
      const result = yield call(getPublished);
      yield put({
        type: actionTypes.BENCHMARK_SET_VALUE,
        key: "published",
        value: result.published
      });
    } catch (e) {
      if (e.response.status == 401) {
        yield put({ type: deleteAuthData });
        return;
      }
    }
    try {
      const results = yield call(getHistory);
      yield put({
        type: actionTypes.BENCHMARK_SET_VALUE,
        key: "results",
        value: { labels: results.labels, data: results.data,histories:results.histories }
      });
    } catch (e) {
      if (e.response.status == 401) {
        yield put({ type: deleteAuthData });
        return;
      }
    }
  }
}
function* resetPublished(){
  try {
    const {workouts} = yield call(getRecentWorkouts);
    yield put({
      type: actionTypes.BENCHMARK_SET_VALUE,
      key: "workouts",
      value: workouts
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put({ type: deleteAuthData });
      return;
    }
  }
  try {
    const result = yield call(getPublished);
    yield put({
      type: actionTypes.BENCHMARK_SET_VALUE,
      key: "published",
      value: result.published
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put({ type: deleteAuthData });
      return;
    }
  }
  try {
    const results = yield call(getHistory);
    yield put({
      type: actionTypes.BENCHMARK_SET_VALUE,
      key: "results",
      value: { labels: results.labels, data: results.data,histories:results.histories }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put({ type: deleteAuthData });
      return;
    }
  }
}
function* updatePublishedResult({ id, repetition }) {
  yield put({ type: actionTypes.BENCHMARK_UPDATE_RESULT, id, repetition });
  const results = yield call(getHistory);
  yield put({
    type: actionTypes.BENCHMARK_SET_VALUE,
    key: "results",
    value: { labels: results.labels, data: results.data,histories:results.histories }
  });
}
export function* saga() {
  yield takeLatest(actionTypes.BENCHMARK_INDEX_REQUEST, fetchBenchmark);
  yield takeLatest(actionTypes.BENCHMARK_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.BENCHMARK_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.BENCHMARK_SEARCH_REQUEST, searchBenchmark);
  yield takeLatest(actionTypes.BENCHMARK_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.BENCHMARK_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.BENCHMARK_SAVE_ITEM, saveItem);
  yield takeLatest(actionTypes.BENCHMARK_FIND_PUBLISHED, findPublished);
  yield takeLeading(actionTypes.BENCHMARK_RESET_PUBLISHED,resetPublished);
  yield takeLatest(
    actionTypes.BENCHMARK_UPDATE_RESULT_ACTION,
    updatePublishedResult
  );
}
