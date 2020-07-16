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
import {reactLocalStorage} from 'reactjs-localstorage';
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import apiErrorMatcher from "../../lib/apiErrorMatcher";
import Facebook from "../../lib/Facebook";
import Google from "../../lib/Google";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";
import { addAlertMessage } from "../../app/pages/home/redux/alert/actions";

export const actionTypes = {
  EVENT_INDEX_REQUEST: "EVENT_INDEX_REQUEST",
  EVENT_INDEX_SUCCESS: "EVENT_INDEX_SUCCESS",
  EVENT_INDEX_FAILURE: "EVENT_INDEX_FAILURE",
  EVENT_LOADING_REQUEST: "EVENT_LOADING_REQUEST",
  EVENT_SEARCH_REQUEST: "EVENT_SEARCH_REQUEST",
  EVENT_CHANGE_SEARCH_VALUE: "EVENT_CHANGE_SEARCH_VALUE",
  EVENT_ACTION_REQUEST: "EVENT_ACTION_REQUEST",
  EVENT_CHANGE_ITEM: "EVENT_CHANGE_ITEM",
  EVENT_SAVE_ITEM: "EVENT_SAVE_ITEM",
  EVENT_SET_ITEM: "EVENT_SET_ITEM",
  EVENT_NEW_ITEM_FETCH: "EVENT_NEW_ITEM_FETCH",
  EVENT_SET_ITEM_VALUE: "EVENT_SET_ITEM_VALUE",
  EVENT_SET_VALUE: "EVENT_SET_VALUE",
  EVENT_CHANGE_SAVE_STATUS: "EVENT_CHANGE_SAVE_STATUS",
  EVENT_SET_ITEM_ERROR: "EVENT_SET_ITEM_ERROR",
  EVENT_FETCH_CATEGORY: "EVENT_FETCH_CATEGORY",
  EVENT_REFETCH_CATEGORY: "EVENT_REFETCH_CATEGORY",
  EVENT_UPLOAD_IMAGE:"EVENT_UPLOAD_IMAGE",
  //for pagination
  EVENT_INDEX_META: "EVENT_INDEX_META",
  EVENT_PAGE_CHANGED: "EVENT_PAGE_CHANGED",
  EVENT_PAGESIZE_CHANGED: "EVENT_PAGESIZE_CHANGED",
  //for front page
  EVENT_FRONT_INDEX_REQUEST:"EVENT_FRONT_INDEX_REQUEST",
  EVENT_FRONT_INDEX_SUCCESS:"EVENT_FRONT_INDEX_SUCCESS",
  EVENT_FRONT_INDEX_META: "EVENT_FRONT_INDEX_META",
  EVENT_FRONT_PAGE_CHANGED: "EVENT_FRONT_PAGE_CHANGED",
  EVENT_FRONT_SUBSCRIBED: "EVENT_FRONT_SUBSCRIBED",
  EVENT_FRONT_SUBSCRIBE_WITH_FACEBOOK: "EVENT_FRONT_SUBSCRIBE_WITH_FACEBOOK",
  EVENT_FRONT_SUBSCRIBE_WITH_GOOGLE: "EVENT_FRONT_SUBSCRIBE_WITH_GOOGLE",
};

export const selectors = {};

const initialState = {
  data: null,
  categories: null,
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
    title: ""
  },
  isloading: false,
  subscribed:false,
};

export const reducer = persistReducer(
  {
    storage,
    key: "events",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.EVENT_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.EVENT_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.EVENT_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.EVENT_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.EVENT_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.EVENT_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.EVENT_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };  
      case actionTypes.EVENT_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.EVENT_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.EVENT_FETCH_CATEGORY:
        return { ...state, categories: action.categories };

      case actionTypes.EVENT_FRONT_INDEX_META:
        return { ...state, frontMeta: { ...state.frontMeta, ...action.frontMeta } };

      case actionTypes.EVENT_SET_VALUE:
        return { ...state, [action.key]: action.value };
  
      case actionTypes.EVENT_FRONT_INDEX_SUCCESS:
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
  fetchIndexRequest: () => ({ type: actionTypes.EVENT_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.EVENT_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.EVENT_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.EVENT_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.EVENT_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.EVENT_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.EVENT_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.EVENT_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.EVENT_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.EVENT_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.EVENT_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  return { type: actionTypes.EVENT_NEW_ITEM_FETCH};
}
export function $saveItem(history) {
  return { type: actionTypes.EVENT_SAVE_ITEM, history };
}
export function $updateItemImage(image) {
  return { type: actionTypes.EVENT_UPLOAD_IMAGE, image };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.EVENT_SET_ITEM_VALUE, name, value };
}
export function $refetchCategories(){
  return {type:actionTypes.EVENT_REFETCH_CATEGORY};
}
export const $fetchFrontIndex = () => ({ type: actionTypes.EVENT_FRONT_INDEX_REQUEST });
export function $frontPage(page = 1) {
  return { type: actionTypes.EVENT_FRONT_PAGE_CHANGED, page: page };
}
export function $subscribe(name,email){
  return { type:actionTypes.EVENT_FRONT_SUBSCRIBED, payload:{name, email}};
}
export function $subscribeWithFacebook(){
  return { type:actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_FACEBOOK};
}
export function $subscribeWithGoogle(name,email){
  return { type:actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_GOOGLE};
}

const eventsRequest = (meta, searchCondition) =>
  http({
    path: `events?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
const categoriesRequest = () =>
  http({ path: `categories/all` }).then(response => response.data);
function* fetchEvent() {
  try {
    const event = yield select(store => store.event);
    const result = yield call(eventsRequest, event.meta, event.searchCondition);
    yield put({
      type: actionTypes.EVENT_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
    if (event.categories == null) {
      const categories = yield call(categoriesRequest);
      yield put({ type: actionTypes.EVENT_FETCH_CATEGORY, categories });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchEvent({ name, value }) {
  try {
    yield put({ type: actionTypes.EVENT_CHANGE_SEARCH_VALUE, name, value });
    const event = yield select(store => store.event);
    const result = yield call(eventsRequest, event.meta, event.searchCondition);
    yield put({
      type: actionTypes.EVENT_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
    if (event.categories == null) {
      const categories = yield call(categoriesRequest);
      yield put({ type: actionTypes.EVENT_FETCH_CATEGORY, categories });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.event.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENT_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.EVENT_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.EVENT_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.EVENT_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    const result = yield call(eventActionRequest, action, id);
    const event = yield select(store => store.event);
    if (action == "delete") {
      yield put({ type: actionTypes.EVENT_INDEX_REQUEST });
    } else {
      let data = event.data;
      data.forEach(item => {
        if (item.id == id) {
          if (action == "disable") item.status = "Draft";
          else item.status = "Publish";
        }
      });
      yield put({
        type: actionTypes.EVENT_INDEX_SUCCESS,
        data: data,
        meta: event.meta
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
    }
  }
}
function eventActionRequest(action, id) {
  if (action == "delete") {
    return http({ path: `events/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `events/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findEvent = id =>
  http({ path: `events/${id}` }).then(response => response.data);
const blogCount = ()=>  
  http({ method: "POST",
  path: "customers/activity",
  data:{
    column:'blog_count'
  }}).then(response => response.data);
function* changeItem({ id }) {
  const event = yield select(store => store.event);
  if (event.categories == null) {
    const categories = yield call(categoriesRequest);
    yield put({ type: actionTypes.EVENT_FETCH_CATEGORY, categories });
  }
  const auth = yield select(store => store.auth);
  if(auth.currentUser) yield call(blogCount);
  yield put({ type: actionTypes.EVENT_LOADING_REQUEST });
  if (event.data != null) {
    const filterEvents = event.data.filter(event => {
      return event.id == id;
    });
    if (filterEvents.length > 0) {
      filterEvents[0].immediate = false;
      yield put({ type: actionTypes.EVENT_SET_ITEM, item: filterEvents[0] });
      yield put({ type: actionTypes.EVENT_UPLOAD_IMAGE, image: null });
      return;
    }
  }
  try {
    const result = yield call(findEvent, id);
    if (result.id)
      yield put({ type: actionTypes.EVENT_SET_ITEM, item: result });
    else yield put({ type: actionTypes.EVENT_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveEvent = event => {
  const formData = new FormData();
  formData.append("title", event.item.title);
  formData.append("description", event.item.description);
  formData.append("category_id", event.item.category_id);
  formData.append("post_date", event.item.date + ' ' + event.item.datetime+':00');
  if (event.uploadImage) {
    const files = Array.from(event.uploadImage);
    files.forEach((file, i) => {
      formData.append("image", file);
    });
  }
  if (event.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `events/${event.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `events`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const event = yield select(store => store.event);
  yield put({ type: actionTypes.EVENT_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveEvent, event);
    if (result.event) {
      alert("Saving success.");
      history.push("/admin/events");
      //yield put({type: actionTypes.EVENT_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.EVENT_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.EVENT_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.EVENT_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
function* newItemFetch(){
  const event = yield select(store => store.event);
  if (event.categories == null) {
    const categories = yield call(categoriesRequest);
    yield put({ type: actionTypes.EVENT_FETCH_CATEGORY, categories });
  }
  const item = {
    id: null,
    title: "",
    description: "",
    status: "",
    uploadImage: "",
    category_id: null,
    immediate:true,
    date:"",
    datetime:"" 
  };
  yield put({ type: actionTypes.EVENT_SET_ITEM, item });
}
function* refetchCategories(){
  const categories = yield call(categoriesRequest);
  yield put({ type: actionTypes.EVENT_FETCH_CATEGORY, categories });
}
const eventsFrontRequest = (meta) =>
  http({
    path: `events/home?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
    })}`
  }).then(response => response.data);
function* fetchFrontEvent(){
  try {
    const event = yield select(store => store.event);
    const result = yield call(eventsFrontRequest, event.frontMeta);
    yield put({
      type: actionTypes.EVENT_FRONT_INDEX_SUCCESS,
      frontData: result.data,
      frontMeta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    yield put({ type: actionTypes.EVENT_INDEX_FAILURE, error: e.message });
  }
}
function* changeFrontPage({ page }) {
  const frontMeta = yield select(store => store.event.frontMeta);
  if (page < 0) {
    page = 0;
  }

  if (page > frontMeta.pageTotal) {
    page = frontMeta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENT_FRONT_INDEX_META, frontMeta: { page: page } });
  yield put({ type: actionTypes.EVENT_FRONT_INDEX_REQUEST });
}
const sendSubscribeRequest = ({name,email}) =>
 http({
    path: `events/subscribe`,
    method: "POST",
    data: {name,email},
  }).then(res => res.data);
// Whole login flow in one saga
function* subscribe({ type, payload }){
  const { provider, requestFunction } = subscribeTypes[type];
  const result = yield call(requestFunction, { payload });
  const { response, error } = result;
  if (error) {
    yield put(addAlertMessage({ type: "error", message: error }));
    // special case - when account is not confirmed redirect to resend confirmation screen instead
    if (error.id === "LogInForm.Error.Api.account-not-confirmed") {
    }
    return;
  }
  reactLocalStorage.set('blogSubscribed', true);
  yield put({ type: actionTypes.EVENT_SET_VALUE, key:'subscribed',value:true });
}
const subscribeTypes = {
  [actionTypes.EVENT_FRONT_SUBSCRIBED]: {
    provider: "email",
    requestFunction: onSubscribeWithEmail
  },
  [actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_FACEBOOK]: {
    provider: "facebook",
    requestFunction: onSubscribeWithFacebook
  },
  [actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_GOOGLE]: {
    provider: "google",
    requestFunction: onSubscribeWithGoogle
  }
};
function* onSubscribeWithEmail({ payload }) {
  let response;
  yield put({ type: actionTypes.EVENT_SET_VALUE, key:'subscribed',value:true });
  try {
    const response = yield call(sendSubscribeRequest, payload);
  } catch (error) {
    if(error.response){
      switch (error.response.status) {
        case 422:
          return { error: getApiErrorMessage(error) };
        case 401:
          return { error: getApiErrorMessage(error) };
        default:
          return { error: defaultError };
      }
    }
  }
  return { response };
}

/* Facebook */

const facebookRequest = facebookUser =>
  http({
    method: "POST",
    path: "events/subscribeWithFacebook",
    data: facebookUser,
    skipAuthentication: true
  });

/*
 Possible errors:
 "fix_invalid_session": facebook session changed in meantime, user needs to reload page
 "app_not_authorized": User denied the permission
*/
const getFacebookErrorMessage = ({ message }) => {
  const key = {
    fix_invalid_session: "LogInForm.Error.Facebook.invalid",
    app_not_authorized: "LogInForm.Error.Facebook.denied"
  }[message];

  return { id: key || "LogInForm.Error.Facebook.error" };
};

function* onSubscribeWithFacebook() {
  let accessToken;
  try {
    accessToken = yield call(Facebook.login);
  } catch (error) {
    return { error: getFacebookErrorMessage(error) };
  }

  let response;
  try {
    response = yield call(facebookRequest, { access_token: accessToken });
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }
  return { response };
}

/* Google */

const googleRequest = googleUser =>
  http({
    method: "POST",
    path: "events/subscribeWithGoogle",
    data: googleUser,
    skipAuthentication: true
  });

/* https://developers.google.com/identity/sign-in/web/reference#gapiauth2authorize-errorcodes */
const getGoogleErrorMessage = ({ error }) => {
  const key = {
    // idpiframe_initialization_failed: 'error', -- this can only happen on initialization
    popup_blocked_by_browser: "LogInForm.Error.Google.blocked",
    popup_closed_by_user: "LogInForm.Error.Google.cancelled",
    access_denied: "LogInForm.Error.Google.denied"
  }[error];

  return { id: key || "LogInForm.Error.Google.error" };
};
function* onSubscribeWithGoogle() {
  let googleUser;
  try {
    googleUser = yield call(Google.logIn);
  } catch (error) {
    return { error: getGoogleErrorMessage(error) };
  }

  let response;
  try {
    response = yield call(googleRequest, { access_token: googleUser.id_token });
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }
  return { response };
}
const defaultError = { id: "LogInForm.Error.Api.error" };
const mapApiErrors = apiErrorMatcher(
  [
    {
      field: "password",
      error: "invalid",
      message: { id: "LogInForm.Error.Api.password-invalid" }
    },
    {
      field: "base",
      error: "account_not_confirmed",
      message: { id: "LogInForm.Error.Api.account-not-confirmed" }
    },
    {
      field: "account",
      error: "account_inactive",
      message: { id: "LogInForm.Error.Api.account-inactive" }
    },
    {
      field: "facebook_account",
      error: "taken",
      message: { id: "SettingsForm.Account.FacebookLogin.Error.taken" }
    },
    {
      field: "facebook_account",
      message: { id: "LogInForm.Error.Api.facebook-account-blank" }
    },
    {
      field: "google_account",
      error: "taken",
      message: { id: "SettingsForm.Account.GoogleLogin.Error.taken" }
    },
    {
      field: "google_account",
      message: { id: "LogInForm.Error.Api.google-account-blank" }
    }
  ],
  defaultError
);

const getApiErrorMessage = error =>
  mapApiErrors(error.response.data.errors);

export function* saga() {
  yield takeLeading(actionTypes.EVENT_INDEX_REQUEST, fetchEvent);
  yield takeLeading(actionTypes.EVENT_PAGE_CHANGED, changePage);
  yield takeLeading(actionTypes.EVENT_PAGESIZE_CHANGED, changePageSize);
  yield takeLeading(actionTypes.EVENT_SEARCH_REQUEST, searchEvent);
  yield takeLeading(actionTypes.EVENT_ACTION_REQUEST, callAction);
  yield takeLeading(actionTypes.EVENT_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.EVENT_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.EVENT_NEW_ITEM_FETCH,newItemFetch);
  yield takeLeading(actionTypes.EVENT_REFETCH_CATEGORY, refetchCategories);
  yield takeLeading(actionTypes.EVENT_FRONT_INDEX_REQUEST, fetchFrontEvent);
  yield takeLeading(actionTypes.EVENT_FRONT_PAGE_CHANGED, changeFrontPage);
  yield takeLatest([actionTypes.EVENT_FRONT_SUBSCRIBED, actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_FACEBOOK, actionTypes.EVENT_FRONT_SUBSCRIBE_WITH_GOOGLE], subscribe);
}
