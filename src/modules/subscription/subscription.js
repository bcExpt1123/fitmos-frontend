import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  takeLeading,
  select,
} from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http,fileDownload } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import {
  logOut,
  takeFreeWorkoutCompleted,
  authenticate as regenerateAuthAction
} from "../../app/pages/home/redux/auth/actions";
import { addAlertMessage } from "../../app/pages/home/redux/alert/actions";
import { $fetchIndex as $fetchTokensIndex } from "./tocken";
export const actionTypes = {
  SUBSCRIPTION_INDEX_REQUEST: "SUBSCRIPTION_INDEX_REQUEST",
  SUBSCRIPTION_INDEX_SUCCESS: "SUBSCRIPTION_INDEX_SUCCESS",
  SUBSCRIPTION_INDEX_FAILURE: "SUBSCRIPTION_INDEX_FAILURE",
  SUBSCRIPTION_LOADING_REQUEST: "SUBSCRIPTION_LOADING_REQUEST",
  SUBSCRIPTION_LOADING_COMPLETE: "SUBSCRIPTION_LOADING_COMPLETE",
  SUBSCRIPTION_SEARCH_REQUEST: "SUBSCRIPTION_SEARCH_REQUEST",
  SUBSCRIPTION_CHANGE_SEARCH_VALUE: "SUBSCRIPTION_CHANGE_SEARCH_VALUE",
  SUBSCRIPTION_ACTION_REQUEST: "SUBSCRIPTION_ACTION_REQUEST",
  SUBSCRIPTION_SHOW_ITEM:"SUBSCRIPTION_SHOW_ITEM",
  SUBSCRIPTION_SET_VALUE:"SUBSCRIPTION_SET_VALUE",
  SUBSCRIPTION_SET_ITEM_ERROR: "SUBSCRIPTION_SET_ITEM_ERROR",
  SUBSCRIPTION_TAKE_FREE_MEMBERSHIP: "SUBSCRIPTION_TAKE_FREE_MEMBERSHIP",
  SUBSCRIPTION_CANCEL_ACTIVE_MEMBERSHIP: "SUBSCRIPTION_CANCEL_ACTIVE_MEMBERSHIP",
  SUBSCRIPTION_CANCEL_ACTION_CONFIRM:"SUBSCRIPTION_CANCEL_ACTION_CONFIRM",
  SUBSCRIPTION_CANCEL_ACTION_COMPLETED:"SUBSCRIPTION_CANCEL_ACTION_COMPLETED",
  //for pagination
  SUBSCRIPTION_INDEX_META: "SUBSCRIPTION_INDEX_META",
  SUBSCRIPTION_PAGE_CHANGED: "SUBSCRIPTION_PAGE_CHANGED",
  SUBSCRIPTION_PAGESIZE_CHANGED: "SUBSCRIPTION_PAGESIZE_CHANGED"
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
  cancelled:{
    just:null,
    endDate:null,
    completed:false,
  },
  updatedItem: null,
  action: "",
  searchCondition: {
    search: "",
    from: "",
    to: "",
    plan_id: "all",
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
    key: "subscriptions",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.SUBSCRIPTION_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.SUBSCRIPTION_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.SUBSCRIPTION_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.SUBSCRIPTION_LOADING_COMPLETE:
        return { ...state, isloading: false };
      case actionTypes.SUBSCRIPTION_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.SUBSCRIPTION_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.SUBSCRIPTION_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false
        };
      case actionTypes.SUBSCRIPTION_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.SUBSCRIPTION_SET_VALUE:
        return { ...state, [action.key]: action.value };    
      case actionTypes.SUBSCRIPTION_CANCEL_ACTION_CONFIRM:
        return { ...state, cancelled:action.cancelled}
      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.SUBSCRIPTION_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.SUBSCRIPTION_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.SUBSCRIPTION_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({
  type: actionTypes.SUBSCRIPTION_INDEX_REQUEST
});
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return {
    type: actionTypes.SUBSCRIPTION_PAGESIZE_CHANGED,
    pageSize: pageSize
  };
}

export function $page(page = 1) {
  return { type: actionTypes.SUBSCRIPTION_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.SUBSCRIPTION_SEARCH_REQUEST, name, value };
}
export function $cancel(id) {
  return {
    type: actionTypes.SUBSCRIPTION_ACTION_REQUEST,
    action: "disable",
    id
  };
}
export function $restore(id) {
  return {
    type: actionTypes.SUBSCRIPTION_ACTION_REQUEST,
    action: "restore",
    id
  };
}
export function $export(searchCondition) {
  const path = `subscriptions/export?${serializeQuery({
        search: searchCondition.search,
        from: searchCondition.from,
        to: searchCondition.to,
        plan_id: searchCondition.plan_id,
        status: searchCondition.status
      })}`;
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subscriptions.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });

}
export function $takeFreeMembership(history) {
  return { type: actionTypes.SUBSCRIPTION_TAKE_FREE_MEMBERSHIP, history };
}
export function $cancelActiveSubscription(qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit){
  return { type:actionTypes.SUBSCRIPTION_CANCEL_ACTIVE_MEMBERSHIP,qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit};
}
export function $show(id){
  return { type:actionTypes.SUBSCRIPTION_SHOW_ITEM,id}
}
export function $cancelActionCompleted(){
  return { type:actionTypes.SUBSCRIPTION_CANCEL_ACTION_COMPLETED}
}
const subscriptionsRequest = (meta, searchCondition) =>
  http({
    path: `subscriptions?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search,
      from: searchCondition.from,
      to: searchCondition.to,
      plan_id: searchCondition.plan_id,
      status: searchCondition.status
    })}`
  }).then(response => response.data);
function* fetchSubscription() {
  try {
    const subscription = yield select(store => store.subscription);
    const result = yield call(
      subscriptionsRequest,
      subscription.meta,
      subscription.searchCondition
    );
    yield put({
      type: actionTypes.SUBSCRIPTION_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SUBSCRIPTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* searchSubscription({ name, value }) {
  try {
    yield put({
      type: actionTypes.SUBSCRIPTION_CHANGE_SEARCH_VALUE,
      name,
      value
    });
    const subscription = yield select(store => store.subscription);
    const result = yield call(
      subscriptionsRequest,
      subscription.meta,
      subscription.searchCondition
    );
    yield put({
      type: actionTypes.SUBSCRIPTION_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SUBSCRIPTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.subscription.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({
    type: actionTypes.SUBSCRIPTION_INDEX_META,
    meta: { page: page }
  });
  yield put({ type: actionTypes.SUBSCRIPTION_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.SUBSCRIPTION_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SUBSCRIPTION_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(subscriptionActionRequest, action, id);
    yield select(store => store.subscription);
    yield put({ type: actionTypes.SUBSCRIPTION_INDEX_REQUEST });
  } catch (e) {
    console.log(e);
    if (e.response && e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SUBSCRIPTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function subscriptionActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `subscriptions/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `subscriptions/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findSubscription = id =>
  http({ path: `subscriptions/${id}` }).then(response => response.data);
function* showItem({ id }) {
  try {
    const result = yield call(findSubscription, id);
    if(result.id){
      yield put({
        type: actionTypes.SUBSCRIPTION_SET_VALUE,
        key: "item",
        value: result
      });
    }
  } catch (e) {
    yield put({
      type: actionTypes.SUBSCRIPTION_SET_VALUE,
      key: "item",
      value: null
    });
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SUBSCRIPTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const takeFreeWorkoutPlan = () =>
  http({ path: `subscriptions/free`, method: "POST" }).then(
    response => response.data
  );
function* takeFreeWorkflowSubscription({ history }) {
  yield put({ type: actionTypes.SUBSCRIPTION_LOADING_REQUEST });
  try {
    const result = yield call(takeFreeWorkoutPlan);
    if (result.subscription) {
      yield put(takeFreeWorkoutCompleted());
      yield put(regenerateAuthAction());
      history.push("/");
    } else {
    }
  } catch (e) {
    console.log(e);
    if (e.response && e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SUBSCRIPTION_INDEX_FAILURE,
        error: e.message
      });
    }
  }
  yield put({ type: actionTypes.SUBSCRIPTION_LOADING_COMPLETE });
}
const cancelActiveWorkoutSubscription = (qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit)=>
  http({ path: `subscriptions/cancel`, method: "POST",data:{serviceId:1,qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit} }).then(
    response => response.data
  );  

function* takeCancelActiveWorkoutSubscription({qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit}){
  try{
    const result = yield call(cancelActiveWorkoutSubscription,qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit);
    //yield put(regenerateAuthAction());
    /*yield put(
      addAlertMessage({
        type: "success",
        message: { id: "Subscription.Cancel.Success" }
      })
    );*/
    yield put({
      type:actionTypes.SUBSCRIPTION_CANCEL_ACTION_CONFIRM,
      cancelled:{
        just:enableEnd,
        endDate:result.endDate,
        completed:true,
      }
    });
    yield put($fetchTokensIndex());
  } catch (e){
    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "Subscription.Cancel.Error" }
      })
    );
  }
}
function* takeCancelActionCompleted(){
  const just = yield select(({subscription}) => subscription.cancelled.just);
  yield put({
    type:actionTypes.SUBSCRIPTION_CANCEL_ACTION_CONFIRM,
    cancelled:{
      just:null,
      endDate:null,
      completed:false,
    }
  });
  if(just === "no")yield put(logOut());
  if(just === "yes")yield put(regenerateAuthAction());
}
export function* saga() {
  yield takeLatest(actionTypes.SUBSCRIPTION_INDEX_REQUEST, fetchSubscription);
  yield takeLatest(actionTypes.SUBSCRIPTION_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.SUBSCRIPTION_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.SUBSCRIPTION_SEARCH_REQUEST, searchSubscription);
  yield takeLatest(actionTypes.SUBSCRIPTION_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.SUBSCRIPTION_SHOW_ITEM, showItem);
  yield takeLatest(
    actionTypes.SUBSCRIPTION_TAKE_FREE_MEMBERSHIP,
    takeFreeWorkflowSubscription
  );
  yield takeLeading(actionTypes.SUBSCRIPTION_CANCEL_ACTIVE_MEMBERSHIP,takeCancelActiveWorkoutSubscription);
  yield takeLeading(actionTypes.SUBSCRIPTION_CANCEL_ACTION_COMPLETED,takeCancelActionCompleted);
}
