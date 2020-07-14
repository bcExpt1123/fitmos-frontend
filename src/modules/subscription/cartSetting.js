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
  CART_SETTING_REQUEST: "CART_SETTING_REQUEST",
  CART_SETTING_SUCCESS: "CART_SETTING_SUCCESS",
  CART_SETTING_FAILURE: "CART_SETTING_FAILURE",
  CART_SETTING_LOADING_REQUEST: "CART_SETTING_LOADING_REQUEST",
  CART_SETTING_SAVE_ITEM: "CART_SETTING_SAVE_ITEM",
  CART_SETTING_SET_ITEM: "CART_SETTING_SET_ITEM",
  CART_SETTING_SET_ITEM_VALUE: "CART_SETTING_SET_ITEM_VALUE",
  CART_SETTING_CHANGE_SAVE_STATUS: "CART_SETTING_CHANGE_SAVE_STATUS",
  CART_SETTING_SET_ITEM_ERROR: "CART_SETTING_SET_ITEM_ERROR",
};

export const selectors = {};

const initialState = {
  item: null,
  updatedItem: null,
  coupons:[],
  errors: {
    code: ""
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
    switch (action.type) {
      case actionTypes.CART_SETTING_SUCCESS:
        return {
          ...state,
          item: action.item,
          coupons:action.coupons,
          isloading: false
        };

      case actionTypes.CART_SETTING_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.CART_SETTING_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.CART_SETTING_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.CART_SETTING_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.CART_SETTING_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      default:
        return state;
    }
  }
);

export const $fetchSetting = () => ({ type: actionTypes.CART_SETTING_REQUEST });
export function $saveItem() {
  return { type: actionTypes.CART_SETTING_SAVE_ITEM };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.CART_SETTING_SET_ITEM_VALUE, name, value };
}

const cartSettingRequest = () =>
  http({
    path: `setting/cart`
  }).then(response => response.data);
function* fetchCartSetting() {
  try {
    yield put({type:actionTypes.CART_SETTING_LOADING_REQUEST});
    const result = yield call(cartSettingRequest);
    console.log(result.item)
    yield put({
      type: actionTypes.CART_SETTING_SUCCESS,
      item: result.item,
      coupons:result.coupons,
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CART_SETTING_FAILURE, error: e.message });
    }
  }
}
const saveCartSetting = cartSetting => {
  const formData = new FormData();
  formData.append("time", cartSetting.item.time);
  formData.append("unit", cartSetting.item.unit);
  formData.append("new_coupon_id", cartSetting.item.new_coupon_id);
  formData.append("renewal_coupon_id", cartSetting.item.renewal_coupon_id);
  formData.append("new_second_mail", cartSetting.item.new_second_mail);
  return http({ path: `setting/updateCart`, method: "POST", data: formData }).then(
    res => res.data
  );
};
function* saveItem() {
  const cartSetting = yield select(store => store.cartSetting);
  yield put({ type: actionTypes.CART_SETTING_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveCartSetting, cartSetting);
    if (result.status) {
      alert("Saving success.");
      //yield put({type: actionTypes.CART_SETTING_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.CART_SETTING_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.CART_SETTING_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.CART_SETTING_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.CART_SETTING_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
export function* saga() {
  yield takeLatest(actionTypes.CART_SETTING_REQUEST, fetchCartSetting);
  yield takeLatest(actionTypes.CART_SETTING_SAVE_ITEM, saveItem);
}
