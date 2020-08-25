import { call, put, delay } from "redux-saga/effects";
import {reactLocalStorage} from 'reactjs-localstorage';

import {
  paymentFailed,
  paymentSucceeded,
} from "../actions";

import { addAlertMessage } from "../../alert/actions";
import { logError } from "../../../../../../lib/logError";
import { http } from "../../../services/api";
import { initialVoucher } from "../../vouchers/actions";
import { authenticate as regenerateAuthAction } from "../../auth/actions";
//import { getClaimedBrands } from '../../../routes';
const logErrorMeta = { SourceModule: "Checkout", PaymentProvider: "PayPal" };

function createSubscription(data) {
  return http({
    path: "subscriptions", // 
    method: "POST",
    data: {
      data,
      paymentProvider: "paypal"
    }
  }).then(response => response.data);
}

export function* onPayWithPayPal({ payload }) {
  console.log(payload);
  try {
    const result = yield call(createSubscription, payload.data);
    yield put(paymentSucceeded());
    yield put(
      addAlertMessage({
        type: "success",
        message: { id: "CheckoutPage.Alert.Success.PayPal.payment_success" }
      })
    );
    reactLocalStorage.remove('checkout');
    if (result.now === true) {
      delay(10);
    }
    yield put(regenerateAuthAction());
    yield put(initialVoucher());
    payload.history.push("/");
  } catch (error) {
    logError(error, logErrorMeta);
    yield put(paymentFailed());
    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "CheckoutPage.Alert.Error.PayPal.payment_error" }
      })
    );
  }
}
export function* onCanceledPayPal({ payload }) {
  yield put(paymentFailed());
  yield put(
    addAlertMessage({
      type: "error",
      message: { id: "CheckoutPage.Alert.Error.PayPal.payment_canceled" }
    })
  );
}
export function* onErrorPayPal({ payload }) {
  yield put(paymentFailed());
  logError(payload, logErrorMeta);
  yield put(
    addAlertMessage({
      type: "error",
      message: { id: "CheckoutPage.Alert.Error.PayPal.payment_error" }
    })
  );
}
