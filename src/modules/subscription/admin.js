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

export const actionTypes = {
  ADMIN_INDEX_REQUEST: "ADMIN_INDEX_REQUEST",
  ADMIN_INDEX_SUCCESS: "ADMIN_INDEX_SUCCESS",
  ADMIN_INDEX_FAILURE: "ADMIN_INDEX_FAILURE",
  ADMIN_LOADING_REQUEST: "ADMIN_LOADING_REQUEST",
  ADMIN_SEARCH_REQUEST: "ADMIN_SEARCH_REQUEST",
  ADMIN_CHANGE_SEARCH_VALUE: "ADMIN_CHANGE_SEARCH_VALUE",
  ADMIN_ACTION_REQUEST: "ADMIN_ACTION_REQUEST",
  ADMIN_CHANGE_ITEM: "ADMIN_CHANGE_ITEM",
  ADMIN_SAVE_ITEM: "ADMIN_SAVE_ITEM",
  ADMIN_SET_ITEM: "ADMIN_SET_ITEM",
  ADMIN_ROLES_REQUEST: "ADMIN_ROLES_REQUEST",
  ADMIN_SET_ROLES: "ADMIN_SET_ROLES",
  ADMIN_SET_ITEM_VALUE: "ADMIN_SET_ITEM_VALUE",
  ADMIN_CHANGE_SAVE_STATUS: "ADMIN_CHANGE_SAVE_STATUS",
  ADMIN_SET_ITEM_ERROR: "ADMIN_SET_ITEM_ERROR",
  //for pagination
  ADMIN_INDEX_META: "ADMIN_INDEX_META",
  ADMIN_PAGE_CHANGED: "ADMIN_PAGE_CHANGED",
  ADMIN_PAGESIZE_CHANGED: "ADMIN_PAGESIZE_CHANGED"
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
    status: "all"
  },
  roles:[],
  errors: {
    name: "",
    email: "",
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "admins",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.ADMIN_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.ADMIN_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.ADMIN_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.ADMIN_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.ADMIN_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.ADMIN_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.ADMIN_SET_ROLES:
        return {
          ...state,
          roles:action.roles
        };
      case actionTypes.ADMIN_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.ADMIN_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.ADMIN_INDEX_REQUEST }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.ADMIN_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.ADMIN_INDEX_FAILURE
  })
};
export const $fetchIndex = () => ({ type: actionTypes.ADMIN_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.ADMIN_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.ADMIN_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.ADMIN_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.ADMIN_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.ADMIN_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.ADMIN_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.ADMIN_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    name: "",
    email: "",
    password:"",
    confirm_password:"",
    role: "admin",
  };
  return { type: actionTypes.ADMIN_SET_ITEM, item };
}
export function $saveItem(history) {
  return { type: actionTypes.ADMIN_SAVE_ITEM, history };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.ADMIN_SET_ITEM_VALUE, name, value };
}
export function $setErrorEmail(content){
  return { type: actionTypes.ADMIN_SET_ITEM_ERROR, name: "email", value: content};
}
export function $requestRoles(){
  return { type: actionTypes.ADMIN_ROLES_REQUEST}
}
//export function
const adminsRequest = (meta, searchCondition) =>
  http({
    path: `admins?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search,
      status: searchCondition.status
    })}`
  }).then(response => response.data);
const roleRequest = ()=>
 http({
    path: `roles`
  }).then(response => response.data);
  
function* fetchAdmin() {
  try {
    const admin = yield select(store => store.admin);
    const result = yield call(
      adminsRequest,
      admin.meta,
      admin.searchCondition
    );
    yield put({
      type: actionTypes.ADMIN_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.ADMIN_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchAdmin({ name, value }) {
  try {
    yield put({ type: actionTypes.ADMIN_CHANGE_SEARCH_VALUE, name, value });
    const admin = yield select(store => store.admin);
    const result = yield call(
      adminsRequest,
      admin.meta,
      admin.searchCondition
    );
    yield put({
      type: actionTypes.ADMIN_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.ADMIN_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.admin.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.ADMIN_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.ADMIN_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.ADMIN_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.ADMIN_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(adminActionRequest, action, id);
    const admin = yield select(store => store.admin);
    if (action === "delete") {
      yield put({ type: actionTypes.ADMIN_INDEX_REQUEST });
    } else {
      let data = admin.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Inactive";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.ADMIN_INDEX_SUCCESS,
        data: data,
        meta: admin.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.ADMIN_INDEX_FAILURE, error: e.message });
    }
  }
}
function adminActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `admins/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `admins/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findAdmin = id =>
  http({ path: `admins/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const admins = yield select(store => store.admin.data);
  yield put({ type: actionTypes.ADMIN_LOADING_REQUEST });
  if (admins !== null) {
    const filterAdmins = admins.filter(admin => {
      return admin.id === id;
    });
    if (filterAdmins.length > 0) {
      yield put({ type: actionTypes.ADMIN_SET_ITEM, item: filterAdmins[0] });
      return;
    }
  }
  try {
    const result = yield call(findAdmin, id);
    if (result.id)
      yield put({ type: actionTypes.ADMIN_SET_ITEM, item: result });
    else yield put({ type: actionTypes.ADMIN_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.ADMIN_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveAdmin = admin => {
  const data = {
    name: admin.item.name,
    email: admin.item.email,
    password:admin.item.password,
    confirm_password:admin.item.confirm_password,
    role: admin.item.role,
  };
  if (admin.item.id) {
    return http({
      path: `admins/${admin.item.id}`,
      method: "PUT",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    const formData = new FormData();
    formData.append("name", admin.item.name);
    formData.append("email", admin.item.email);
    formData.append("password", admin.item.password);
    formData.append("confirm_password", admin.item.confirm_password);
    formData.append("role", admin.item.role);
    return http({ path: `admins`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveItem({ history }) {
  const admin = yield select(store => store.admin);
  yield put({ type: actionTypes.ADMIN_CHANGE_SAVE_STATUS, status: true });
  try {
    yield call(saveAdmin, admin);
    alert("Saving success.");
    history.push("/admin/users");
  } catch (e) {
    if (e.response.status === 403) {
      yield put({
        type: actionTypes.ADMIN_SET_ITEM_ERROR,
        name: "email",
        value: "Email duplicate"
      });
      yield put({ type: actionTypes.ADMIN_CHANGE_SAVE_STATUS, status: false });
    }
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.ADMIN_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.ADMIN_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
function* requestRolesAction(){
  const admin = yield select(store=>store.admin)
  if(admin.roles.length===0){
    try{
      const roles = yield call(roleRequest);
      console.log(roles)
      if(roles) yield put( {type:actionTypes.ADMIN_SET_ROLES, roles});
    } catch(e){

    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.ADMIN_INDEX_REQUEST, fetchAdmin);
  yield takeLatest(actionTypes.ADMIN_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.ADMIN_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.ADMIN_SEARCH_REQUEST, searchAdmin);
  yield takeLatest(actionTypes.ADMIN_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.ADMIN_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.ADMIN_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.ADMIN_ROLES_REQUEST,requestRolesAction);
}
