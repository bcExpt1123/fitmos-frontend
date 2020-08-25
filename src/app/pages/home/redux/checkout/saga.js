import { all, takeLeading, call, put, select } from "redux-saga/effects";
import {reactLocalStorage} from 'reactjs-localstorage';
import {
  payWithPayPal,
  payWithStripe,
  payWithNmi,
  checkPaymentMode,
  setPaymentMode,
  changePaymentProvider,
  setKeyValue,
  changeVoucher,
  canceledPayPal,
  errorPayPal,
  reactivateSubscription,
  inside,
  outside,
  validCartId,
} from "./actions";
import {
  onPayWithPayPal,
  onCanceledPayPal,
  onErrorPayPal
} from "./saga/paypal";
import { authenticate as regenerateAuthAction } from "../auth/actions";
import { onPayWithStripe } from "./saga/stripe";
import { http } from "../../services/api";
//import { onPayWithEbanx } from './saga/ebanx';
import { onPayWithNmi } from "./saga/nmi";
import { trackError } from "../error/actions";
import { addAlertMessage } from "../alert/actions";
import { $findWorkoutSerive,$updateInterval} from "../../../../../modules/subscription/service";
import { initialVoucher,validateVoucherSucceeded} from '../vouchers/actions'

function getPaymentTestMode() {
  return http({
    path: "subscriptions/checkout", // get paymentTest and createOrUpdate paypal plan
    method: "POST"
  }).then(response => response.data);
}
function* onCheckPaymentMode() {
  const paymentMode = yield select(store => store.checkout.paymentTestMode);
  if (paymentMode === null) {
    try {
      const result = yield call(getPaymentTestMode);
      yield put(setPaymentMode({ paymentTestMode: result.mode }));
    } catch (error) {
      yield put(trackError(error));
    }
  }
}
function findPaypalPlan(frequency, couponId) {
  return http({
    path: "subscriptions/findPaypalPlan", // get paymentTest and createOrUpdate paypal plan
    method: "POST",
    data: {
      frequency,
      coupon_id: couponId
    }
  }).then(response => response.data);
}
function* onChangePaymentProvider({ payload }) {
  yield put(setKeyValue({ key: "selectedPaymentProvider", value: payload }));
  if (payload === "paypal") {
    const frequency = yield select(store => store.service.frequency);
    const vouchers = yield select(store => store.vouchers);
    const coupons = Object.values(vouchers);
    let couponId;
    if (coupons[0] && coupons[0].discount) couponId = coupons[0].id;
    try {
      const result = yield call(findPaypalPlan, frequency, couponId);
      const paypal = {
        planId: result.paypalPlanId,
        startTime: result.startTime
      };
      yield put(setKeyValue({ key: "paypal", value: paypal }));
    } catch (error) {
      console.log(error);
      yield put(trackError(error));
    }
  }
}
function* onChangeVoucher() {
  const selectedPaymentProvider = yield select(
    store => store.checkout.selectedPaymentProvider
  );
  if (selectedPaymentProvider === "paypal") {
    const frequency = yield select(store => store.service.frequency);
    const vouchers = yield select(store => store.vouchers);
    const coupons = Object.values(vouchers);
    let couponId;
    if (coupons[0] && coupons[0].discount) couponId = coupons[0].id;
    try {
      const result = yield call(findPaypalPlan, frequency, couponId);
      const paypal = {
        planId: result.paypalPlanId,
        startTime: result.startTime
      };
      yield put(setKeyValue({ key: "paypal", value: paypal }));
    } catch (error) {
      yield put(trackError(error));
    }
  }
}
function subscriptionRenewal(id,frequency){
  return http({
    path: "subscriptions/"+id+"/renewal", // get paymentTest and createOrUpdate paypal plan
    method: "POST",
    data: {
      frequency,
    }
  }).then(response => response.data);  
}
function* onReactivateSubscription({payload}) {
  const currentUser = yield select(store => store.auth.currentUser);
  try {
    yield call(subscriptionRenewal, currentUser.customer.workoutSubscriptionId, payload.frequency);
    yield put(addAlertMessage({
      type: "success",
      message: {id:"Subscription.Renewal.Success"} 
    }));
    yield put(regenerateAuthAction());
  } catch (error) {
    yield put(addAlertMessage({ type: "error", message: error }));
    yield put(trackError(error));
  }
}
function checkoutInSide(frequency){
  return http({
    path: "cart/inside", // get paymentTest and createOrUpdate paypal plan
    method: "POST",
    data: {
      frequency
    }
  }).then(response => response.data);  
}
function* onCheckoutInSide({payload}){
  try {
    yield call(checkoutInSide, payload.activePlan);
  }catch (error) {
    console.log(error);
    yield put(trackError(error));
  }
}
function checkoutOutSide(){
  return http({
    path: "cart/outside", // get paymentTest and createOrUpdate paypal plan
    method: "POST",
  }).then(response => response.data);  
}
function* onCheckoutOutSide(){
  try {
    yield call(checkoutOutSide);
  }catch (error) {
    console.log(error);
    yield put(trackError(error));
  }
}
function validateCart(id){
  return http({
    path: "cart/"+id, // get paymentTest and createOrUpdate paypal plan
    method: "GET",
  }).then(response => response.data);  
}
function* onValidCartId({payload}){
  try {
    const result = yield call(validateCart,payload.id);
    yield put($findWorkoutSerive());
    yield put($updateInterval(result.frequency,result.cart.frequency));
    yield put(initialVoucher());
    yield put(validateVoucherSucceeded(result.coupon));
    payload.history.push("/checkout");
    reactLocalStorage.remove('cartId');
  }catch (error) {
    console.log(error);
    yield put(trackError(error));
  }
}
export default function* rootSaga() {
  yield all([
    takeLeading(payWithPayPal, onPayWithPayPal),
    takeLeading(payWithStripe, onPayWithStripe),
    //takeLeading(payWithEbanx, onPayWithEbanx),
    takeLeading(payWithNmi, onPayWithNmi),
    takeLeading(checkPaymentMode, onCheckPaymentMode),
    takeLeading(changePaymentProvider, onChangePaymentProvider),
    takeLeading(changeVoucher, onChangeVoucher),
    takeLeading(canceledPayPal, onCanceledPayPal),
    takeLeading(errorPayPal, onErrorPayPal),
    takeLeading(reactivateSubscription,onReactivateSubscription),
    takeLeading(inside,onCheckoutInSide),
    takeLeading(outside,onCheckoutOutSide),
    takeLeading(validCartId,onValidCartId),
  ]);
}
