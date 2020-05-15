import { call, takeEvery, takeLeading, put, select } from "redux-saga/effects";
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  validateVoucher,
  validateVoucherFailed,
  validateVoucherSucceeded,
  setPrivateVoucher,
  generateFirstPayVoucher,
  setPublicVoucher,
  checkVoucher,
  createRenewalVoucher,
  initialVoucher,
} from "./actions";
import { http } from "../../services/api";
import { trackError } from "../error/actions";
import { actionTypes } from "../../../../../modules/subscription/service";

export const validateVoucherRequest = ({ token, userId, service }) =>
  http({
    path: "coupons/check",
    method: "POST",
    data: {
      voucher: {
        token,
        service,
        user_id: userId
      }
    }
  }).then(response => response.data.voucher);

function* onValidateVoucher({ payload: { token, service, resolve, reject } }) {
  try {
    const voucher = yield select(store => store.vouchers[token]);
    // Trigger succeeded action only for valid vouchers.
    if (voucher && voucher.token) {
      yield put(validateVoucherSucceeded(voucher));
      if (resolve) {
        yield call(resolve, voucher);
      }
    }
  } catch (error) {
    yield put(trackError(error));
    if (reject) {
      yield call(reject, error);
    }
  }

  try {
    yield put(initialVoucher());
    const currentUserId = yield select(store => store.auth.currentUser.id);
    const voucher = yield call(validateVoucherRequest, {
      token,
      userId: currentUserId,
      service
    });
    yield put(validateVoucherSucceeded(voucher));
    if (resolve) {
      yield call(resolve, voucher);
    }
  } catch (error) {
    yield put(validateVoucherFailed({ token }));
    if (reject) {
      yield call(reject, error);
    }
  }
}
const validatePrivateVoucherRequest = ({ code, userId, service }) =>
  http({
    path: "coupons/private",
    method: "POST",
    data: {
      voucher: {
        code,
        user_id: userId
      }
    }
  }).then(response => response.data.voucher);

function* onSetPrivateCoucher({ payload }) {
  const currentUser = yield select(store => store.auth.currentUser);
  if (currentUser === undefined) {
    reactLocalStorage.set('privateCoupon', payload);
    // /yield put(addPrivateVoucher(payload));
  } else {
    const currentUserId = currentUser.id;
    try {
      const voucher = yield call(validatePrivateVoucherRequest, {
        code: payload,
        userId: currentUserId,
      });
      yield put(validateVoucherSucceeded(voucher));
    } catch (error) {
      yield put(validateVoucherFailed({ payload }));
    }
  }
}
const validatePublicVoucherRequest = ({ code, service }) =>
  http({
    path: "coupons/public",
    method: "POST",
    data: {
      voucher: {
        code,
      }
    }
  }).then(response => response.data.voucher);
function* onSetPublicCoucher({ payload }) {
  const currentUser = yield select(store => store.auth.currentUser);
  if (currentUser === undefined) {
    try {
      const voucher = yield call(validatePublicVoucherRequest, {
        code: payload,
      });
      reactLocalStorage.set('publicCoupon', payload);
    } catch (error) {
      yield put(validateVoucherFailed({ payload }));
    }
  }
}
const validatePublicVoucherRequestWithUser = ({ couponId,userId, service }) =>
  http({
    path: "coupons/publicWithUser",
    method: "POST",
    data: {
      voucher: {
        id:couponId,
      }
    }
  }).then(response => response.data.voucher);
function* onCheckVoucer() {
  const token = reactLocalStorage.get('privateCoupon');
  const currentUser = yield select(store => store.auth.currentUser);
  const currentUserId = currentUser.id;
  if (token) {
    try { 
      const voucher = yield call(validatePrivateVoucherRequest, {
        code: token,
        userId: currentUserId,
      });
      yield put(validateVoucherSucceeded(voucher));
      reactLocalStorage.remove('privateCoupon');
    } catch (error) {
      //yield put(validateVoucherFailed({ token }));
    }
  }
  const couponId = reactLocalStorage.get('publicCouponId');
  if(couponId){
    try { 
      const voucher = yield call(validatePublicVoucherRequestWithUser, {
        couponId: couponId,
        userId: currentUserId,
      });
      yield put(validateVoucherSucceeded(voucher));
    } catch (error) {
      //yield put(validateVoucherFailed({ token }));
    }
  }
}
const createRenewalVoucherRequest = () =>
  http({
    path: "coupons/subscription",
    method: "POST",
  }).then(response => response.data.voucher);

function* onCreateRenewalVoucher({ payload }) {
  const history = payload;
  try {
    const voucher = yield call(createRenewalVoucherRequest);
    yield put(validateVoucherSucceeded(voucher));
    const currentUser = yield select(store => store.auth.currentUser);
    const workoutService = currentUser.customer.services['1'];
    yield put({ type: actionTypes.SERVICE_CHANGE_INTERVAL, frequency: currentUser.customer.currentWorkoutMonths, activePlan: currentUser.customer.currentWorkoutPlan });
    yield put({ type: actionTypes.SERVICE_SET_ITEM, item: workoutService });
    history.push('/checkout');
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }
}
const generateFirstPay = ()=>
  http({
    path: "coupons/generateFirstPay",
    method: "POST",
  }).then(response => response.data.voucher);
function* onGenerateFirstPayVoucher(){
  try {
    const voucher = yield call(generateFirstPay);
    yield put(validateVoucherSucceeded(voucher));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }
}
export default function* rootSaga() {
  yield takeEvery(validateVoucher, onValidateVoucher);
  yield takeLeading(setPrivateVoucher, onSetPrivateCoucher);
  yield takeLeading(setPublicVoucher, onSetPublicCoucher);
  yield takeLeading(checkVoucher, onCheckVoucer);
  yield takeLeading(createRenewalVoucher, onCreateRenewalVoucher);
  yield takeLeading(generateFirstPayVoucher,onGenerateFirstPayVoucher);
}
