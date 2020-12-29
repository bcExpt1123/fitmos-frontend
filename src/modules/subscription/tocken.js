import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLeading,
  select,
} from "redux-saga/effects";
import get from "lodash/get";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import { logOut } from "../../app/pages/home/redux/auth/actions";
import { addAlertMessage } from "../../app/pages/home/redux/alert/actions";

export const actionTypes = {
  TOCKEN_INDEX_REQUEST: "TOCKEN_INDEX_REQUEST",
  TOCKEN_INDEX_SUCCESS: "TOCKEN_INDEX_SUCCESS",
  TOCKEN_INDEX_FAILURE: "TOCKEN_INDEX_FAILURE",
  TOCKEN_LOADING_REQUEST: "TOCKEN_LOADING_REQUEST",
  TOCKEN_CHANGE_ITEM: "TOCKEN_CHANGE_ITEM",
  TOCKEN_SAVE_ITEM: "TOCKEN_SAVE_ITEM",
  TOCKEN_SET_ITEM: "TOCKEN_SET_ITEM",
  TOCKEN_SET_VALUE: "TOCKEN_SET_VALUE",
  TOCKEN_SET_ITEM_VALUE: "TOCKEN_SET_ITEM_VALUE",
  TOCKEN_CHANGE_SAVE_STATUS: "TOCKEN_CHANGE_SAVE_STATUS",
  TOCKEN_SET_ITEM_ERROR: "TOCKEN_SET_ITEM_ERROR",
  TOCKEN_DELETE: "TOCKEN_DELETE",
};

export const selectors = {};

const initialState = {
  items: null,
  item: null,
  updatedItem: null,
  action: "",
  showForm:false,
  errors: {
    code: ""
  },
  isSaving:false,
  isloading: false
};

export const reducer = persistReducer(
  {
    storage,
    key: "tockens",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.TOCKEN_INDEX_SUCCESS:
        return {
          ...state,
          items: action.items,
        };

      case actionTypes.TOCKEN_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.TOCKEN_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.TOCKEN_SET_ITEM:
        return {
          ...state,
          item: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.TOCKEN_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.TOCKEN_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.TOCKEN_SET_VALUE:
        return { ...state, [action.key]: action.value };
  
      default:
        return state;
    }
  }
);

export const $fetchIndex = () => ({ type: actionTypes.TOCKEN_INDEX_REQUEST });

export function $changeItem(id) {
  return { type: actionTypes.TOCKEN_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = {
    id: null,
    code: "",
    name: "",
    mail: "",
    discount: "",
    renewal: 0
  };
  return { type: actionTypes.TOCKEN_SET_ITEM, item };
}
export function $saveItem({creditCard,setErrors}) {
  return { type: actionTypes.TOCKEN_SAVE_ITEM,creditCard,setErrors };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.TOCKEN_SET_ITEM_VALUE, name, value };
}
export function $showFormAction(){
  return {
    type: actionTypes.TOCKEN_SET_VALUE,
    key: "showForm",
    value: true
  };
}
export function $closeFormAction(){
  return {
    type: actionTypes.TOCKEN_SET_VALUE,
    key: "showForm",
    value: false
  };
}
export function $delete(id) {
  return { type: actionTypes.TOCKEN_DELETE, id };
}
const tockensRequest = () =>
  http({
    path: `tockens`
  }).then(response => response.data);
function* fetchTocken() {
  try {
    const result = yield call(tockensRequest);
    yield put({
      type: actionTypes.TOCKEN_INDEX_SUCCESS,
      items: result.items,
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.TOCKEN_INDEX_FAILURE, error: e.message });
    }
  }
}
const findTocken = id =>
  http({ path: `tockens/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  if(id === 'new'){
    const item = {
      holder:"",
      last4:"",
      type:"",
      expiry_year:"",
      expiry_month:"",
    }
    yield put({ type: actionTypes.TOCKEN_SET_ITEM, item: item });
    return;
  }
  const tockens = yield select(store => store.tocken.items);
  yield put({ type: actionTypes.TOCKEN_LOADING_REQUEST });
  if (tockens != null) {
    const filterTockens = tockens.filter(tocken => {
      return tocken.id === id;
    });
    if (filterTockens.length > 0) {
      yield put({ type: actionTypes.TOCKEN_SET_ITEM, item: filterTockens[0] });
      return;
    }
  }
  try {
    const result = yield call(findTocken, id);
    if (result.id)
      yield put({ type: actionTypes.TOCKEN_SET_ITEM, item: result });
    else yield put({ type: actionTypes.TOCKEN_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.TOCKEN_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveCard = (creditCard,item) => {
  const card = {nmi:creditCard};
  if (item&&item.id) {
    return http({
      path: `tockens/${item.id}`,
      method: "PUT",
      data: JSON.stringify(card),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({ path: `tockens`, method: "POST", data: card }).then(
      res => res.data
    );
  }
};
function* saveItem({creditCard,setErrors}) {
  const item = yield select(store => store.tocken.item);
  yield put({ type: actionTypes.TOCKEN_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveCard, creditCard,item);
    if (result.tocken) {
      yield put({type: actionTypes.TOCKEN_INDEX_REQUEST});
      yield put({type: actionTypes.TOCKEN_SET_VALUE, key: "showForm", value: false });
      //close
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.TOCKEN_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.TOCKEN_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    console.log(e)
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.TOCKEN_INDEX_FAILURE, error: e.message });
      yield put({ type: actionTypes.TOCKEN_CHANGE_SAVE_STATUS, status: false });
      const errorsObj = get(e, "response.data.errors", { base: [] });
      console.log(errorsObj)
      const message = errorsObj;//mapApiErrors(errorsObj);  
      yield put(addAlertMessage({ type: "error", message }));
      yield call(setErrors, { "nmi.state": "not valid" });
    }
  }
}
function* deleteItem({ id }) {
  try {
    yield call(tockenActionRequest, 'delete', id);
    yield put({ type: actionTypes.TOCKEN_INDEX_REQUEST });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.TOCKEN_INDEX_FAILURE, error: e.message });
    }
  }
}
const tockenActionRequest = (action, id)=>{
  if (action === "delete") {
    return http({ path: `tockens/${id}`, method: "delete" }).then(
      response => response.data
    );
  }
}
export function* saga() {
  yield takeLeading(actionTypes.TOCKEN_INDEX_REQUEST, fetchTocken);
  yield takeLeading(actionTypes.TOCKEN_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.TOCKEN_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.TOCKEN_DELETE,deleteItem);
}
