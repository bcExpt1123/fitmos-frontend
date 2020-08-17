import { call, put, select, delay } from "redux-saga/effects";
import pick from "lodash/pick";
import get from "lodash/get";
import {reactLocalStorage} from 'reactjs-localstorage';

import { logError } from "../../../../../../lib/logError";
import { paymentRequested, paymentFailed, paymentSucceeded, } from "../actions";
import { authenticate as regenerateAuthAction } from "../../auth/actions";
import { addAlertMessage } from "../../alert/actions";
import { initialVoucher } from "../../vouchers/actions";

import apiErrorMatcher from "../../../../../../lib/apiErrorMatcher";
import { http } from "../../../services/api";


const logErrorMeta = { SourceModule: "Checkout", PaymentProvider: "NMI" };

// TODO: replace with proper error messages
const errorMessages = {
  "BP-DR-13": {
    message: "CheckoutPage.StepPayment.NmiForm.Error.emptyName",
    field: "nmi.fullName"
  },
  "BP-DR-14": {
    message: "CheckoutPage.StepPayment.NmiForm.Error.emptyName",
    field: "nmi.fullName"
  },
};

const mapApiErrors = apiErrorMatcher(
  [
    {
      field: "base",
      error: "transaction_failed",
      message: error => {
        return {
          id: errorMessages[error.code]
            ? errorMessages[error.code].message
            : "CheckoutPage.Alert.Error.transaction_failed"
        };
      }
    },
    {
      field: "base",
      error: "claim_renewable",
      message: "CheckoutPage.Alert.Error.claim_renewable"
    }
  ],
  { id: "CheckoutPage.Alert.Error.generic_error" }
);


function loadNmiRequest(creditCard,selectedProduct,activeVoucher,frequency,nmiPaymentToken,checkoutKind){
  return http({
    path: "subscriptions/nmi", // pay with nmi gateway credit card
    method: "POST",
    data: {
      nmi:creditCard,
      'nmi-payment-token':nmiPaymentToken,
      service_id:selectedProduct.id,
      kind:checkoutKind,
      coupon:activeVoucher?activeVoucher.id:null,
      frequency:frequency,
      paymentProvider: "nmi"
    }
  }).then(response => response.data);
}
export function* onPayWithNmi({
  payload: {
    checkoutKind,
    creditCard,
    nmi,
    nmiPaymentToken,
    selectedProduct,
    activeVoucher,
    frequency,
    setErrors,
    history,
  }
}) {

  yield put(paymentRequested());
  const activePlan = yield select(store => store.service.activePlan);
  try {
    const result = yield call(loadNmiRequest,creditCard,selectedProduct,activeVoucher,frequency,nmiPaymentToken,checkoutKind);
    yield put(paymentSucceeded());
    yield put(
      addAlertMessage({
        type: "success",
        message: { id: "CheckoutPage.Alert.Success.Nmi.payment_success" }
      })
    );
    reactLocalStorage.remove('checkout');
    reactLocalStorage.remove('publicCouponId');
    yield put(regenerateAuthAction());
    yield put(initialVoucher());
    if (result.now == true) {
      let currentUser;
      currentUser = yield select(store => store.auth.currentUser);
      while(!currentUser.has_workout_subscription){
        yield delay(50);
        currentUser = yield select(store => store.auth.currentUser);
      }
    }
    history.push("/");
  } catch (error) {
    logError(error, logErrorMeta);
    yield put(paymentFailed());

    const errorsObj = get(error, "response.data.errors", { base: [] });
    console.log(errorsObj)
    const message = errorsObj;//mapApiErrors(errorsObj);
    /*const formErrors = errorsObj.base.reduce(
      (res, err) =>
        errorMessages[err.code] && errorMessages[err.code].field
          ? { ...res, [errorMessages[err.code].field]: "not valid" }
          : res,
      {}
    );
    if (Object.keys(formErrors).length) {
      yield call(setErrors, { "nmi.state": "not valid" });
    }*/
    yield put(addAlertMessage({ type: "error", message }));
  }

}
