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
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  PERMISSION_SETTING_REQUEST: "PERMISSION_SETTING_REQUEST",
  PERMISSION_SETTING_SUCCESS: "PERMISSION_SETTING_SUCCESS",
  PERMISSION_SETTING_FAILURE: "PERMISSION_SETTING_FAILURE",
  PERMISSION_SETTING_LOADING_REQUEST: "PERMISSION_SETTING_LOADING_REQUEST",
  PERMISSION_SETTING_SAVE_ITEM: "PERMISSION_SETTING_SAVE_ITEM",
  PERMISSION_SETTING_CHOOSE_ROLE:"PERMISSION_SETTING_CHOOSE_ROLE",
  PERMISSION_SETTING_SET_ITEM_PERMISSION: "PERMISSION_SETTING_SET_ITEM_PERMISSION",
  PERMISSION_SETTING_CHANGE_SAVE_STATUS: "PERMISSION_SETTING_CHANGE_SAVE_STATUS",
  PERMISSION_SETTING_SET_ITEM_ERROR: "PERMISSION_SETTING_SET_ITEM_ERROR",
  PERMISSION_DELETE_ROLE:"PERMISSION_DELETE_ROLE",
  PERMISSION_EDIT_ROLE:"PERMISSION_EDIT_ROLE",
  PERMISSION_SET_ITEM_ROLE: "PERMISSION_SET_ITEM_ROLE",
  PERMISSION_SET_ITEM_ROLE_VALUE: "PERMISSION_SET_ITEM_ROLE_VALUE",  
  PERMISSION_SAVE_ROLE:"PERMISSION_SAVE_ROLE",
};

export const selectors = {};

const initialState = {
  roles: [],
  permissions:[],
  item:null,
  roleItem:{name:''},
  errors: {
    name: ""
  },
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "coupons",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    const errors = { ...clonedErrors, [action.name]: "" };
    switch (action.type) {
      case actionTypes.PERMISSION_SETTING_SUCCESS:
        return {
          ...state,
          roles: action.roles,
          permissions:action.permissions,
          item:action.roles[0],
          isloading: false
        };
      case actionTypes.PERMISSION_SETTING_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.PERMISSION_SETTING_CHOOSE_ROLE:
        let item;
        for(let i =0;i<state.roles.length;i++){
          if(action.id == state.roles[i].id){
            item = state.roles[i];
            break;
          }
        }      
        return { ...state, item };
      case actionTypes.PERMISSION_SETTING_SET_ITEM_PERMISSION:
        const clonedRole = Object.assign({}, state.item);
        let permissions = clonedRole.permissions;
        const length = permissions.length;
        let index = -1;
        for(let i=0;i<length;i++){
          if(permissions[i].id == action.permission.id){
            index = i;
            break;
          }
        }
        if(index<0){
          permissions.push(action.permission);
        }else{
          permissions.splice(index,1);
        }
        return {
          ...state,
          item: clonedRole
        };
      case actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.PERMISSION_SETTING_SET_ITEM_ERROR:
        const errors1 = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.PERMISSION_EDIT_ROLE:
        let role;
        for(let i =0;i<state.roles.length;i++){
          if(action.id == state.roles[i].id){
            role = state.roles[i];
            break;
          }
        }      
        return { ...state, roleItem:role,errors };
      case actionTypes.PERMISSION_SET_ITEM_ROLE:
        return {
          ...state,
          roleItem: action.roleItem,
          isloading: false,
          isSaving: false
        };
      case actionTypes.PERMISSION_SET_ITEM_ROLE_VALUE:
        const clonedItemRole = Object.assign({}, state.roleItem);
        const roleItem = { ...clonedItemRole, [action.name]: action.value };
        return { ...state, roleItem, errors };
      default:
        return state;
    }
  }
);

export const $fetchSetting = () => ({ type: actionTypes.PERMISSION_SETTING_REQUEST });
export function $saveItem() {
  return { type: actionTypes.PERMISSION_SETTING_SAVE_ITEM };
}

export function $updatePermissionsValue(permission){
  return { type: actionTypes.PERMISSION_SETTING_SET_ITEM_PERMISSION, permission};
}
export function $chooseRole(id) {
  return { type: actionTypes.PERMISSION_SETTING_CHOOSE_ROLE, id };
}
export function $updateItemValue(name, value) {
  return { type: actionTypes.PERMISSION_SET_ITEM_ROLE_VALUE, name, value };
}
export function $deleteRole(id){
  return { type: actionTypes.PERMISSION_DELETE_ROLE,id}
}
export function $editRole(id){
  return { type: actionTypes.PERMISSION_EDIT_ROLE,id}
}
export function $saveItemRole(){
  return { type: actionTypes.PERMISSION_SAVE_ROLE };
}
export function $setNewItemRole() {
  const roleItem = {
    name: "",
  };
  return { type: actionTypes.PERMISSION_SET_ITEM_ROLE, roleItem };
}

const permissionSettingRequest = () =>
  http({
    path: `setting/permissions`
  }).then(response => response.data);
function* fetchPermissionSetting() {
  try {
    yield put({type:actionTypes.PERMISSION_SETTING_LOADING_REQUEST});
    const result = yield call(permissionSettingRequest);
    yield put({
      type: actionTypes.PERMISSION_SETTING_SUCCESS,
      roles: result.roles,
      permissions:result.permissions,
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.PERMISSION_SETTING_FAILURE, error: e.message });
    }
  }
}
const savePermissionSetting = role => {
  const formData = new FormData();
  formData.append("id", role.id);
  for (let i = 0; i < role.permissions.length; i++) {
    formData.append('permissionIds[]', role.permissions[i].id);
  } 
  return http({ path: `setting/updatePermissions`, method: "POST", data: formData }).then(
    res => res.data
  );
};
function* saveItem() {
  const role = yield select(store => store.permission.item);
  yield put({ type: actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(savePermissionSetting, role);
    alert("Saving success.");
      //yield put({type: actionTypes.PERMISSION_SETTING_REQUEST});
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.PERMISSION_SETTING_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
const removeRole = id=>{
  return http({ path: `roles/${id}`, method: "delete" }).then(
    response => response.data
  );
}
function* deleteRole({id}){
  try{
    yield put({ type: actionTypes.PERMISSION_SETTING_REQUEST });
  }catch(e){

  }
}
const submitRole = role => {
  const data = {
    name: role.name,
  };
  if (role.id) {
    return http({
      path: `roles/${role.id}`,
      method: "PUT",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    const formData = new FormData();
    formData.append("name", role.name);
    return http({ path: `roles`, method: "POST", data: formData }).then(
      res => res.data
    );
  }
};
function* saveRole(){
  const role = yield select(store => store.permission.roleItem);
  yield put({ type: actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(submitRole, role);
    alert("Saving success.");
    const roleItem = {
      name: "",
    };
    yield put({ type: actionTypes.PERMISSION_SET_ITEM_ROLE, roleItem });  
    yield put({ type: actionTypes.PERMISSION_SETTING_REQUEST });    
  } catch (e) {
    if (e.response.status == 403) {
      yield put({
        type: actionTypes.PERMISSION_SETTING_SET_ITEM_ERROR,
        name: "name",
        value: "Name duplicate"
      });
      yield put({ type: actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS, status: false });
    }
    yield put({ type: actionTypes.PERMISSION_SETTING_FAILURE, error: e.message });
    alert("Saving failed.");
    yield put({ type: actionTypes.PERMISSION_SETTING_CHANGE_SAVE_STATUS, status: false });
  }
}
export function* saga() {
  yield takeLatest(actionTypes.PERMISSION_SETTING_REQUEST, fetchPermissionSetting);
  yield takeLatest(actionTypes.PERMISSION_SETTING_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.PERMISSION_DELETE_ROLE, deleteRole);
  yield takeLeading(actionTypes.PERMISSION_SAVE_ROLE, saveRole);
}
