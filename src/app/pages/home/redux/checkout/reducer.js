import { persistReducer } from "redux-persist";
import { handleActions } from "redux-actions";
import storage from "redux-persist/lib/storage";
import {
  paymentRequested,
  paymentSucceeded,
  paymentFailed,
  setIdempotencyKey,
  setStripeIntent,
  clearStripeIntent,
  setPaymentMode,
  setChangePlan,
  clearChangePlan,
  setPayPalPlanId,
  setKeyValue,
  setCheckoutKind,
  startBankRenewal,
  doneBankRenewal,
  done,
  start
} from "./actions";

const initialState = {
  isProcessingPayment: false,
  idempotencyKey: undefined,
  paymentTestMode: null,
  changePlan: true,
  checkoutKind:null,
  selectedPaymentProvider: null,
  stripe: {
    intent: undefined,
    productId: undefined,
    voucherToken: undefined
  },
  paypal: {
    planId: undefined,
    startTime: undefined
  },
  bank:{
    renewal:false,
  },
  status:false,
};

export default persistReducer(
  {
    storage,
    key: "checkout",
    whitelist: ["status"]
  },
  handleActions(
  {
    [paymentRequested]: state => {
      return {
        ...state,
        isProcessingPayment: true
      };
    },

    [paymentSucceeded]: state => {
      return {
        ...state,
        isProcessingPayment: false
      };
    },

    [paymentFailed]: state => {
      return {
        ...state,
        isProcessingPayment: false
      };
    },

    [setIdempotencyKey]: (state, { payload }) => {
      return {
        ...state,
        idempotencyKey: payload.idempotencyKey
      };
    },

    [setStripeIntent]: (state, { payload }) => {
      return {
        ...state,
        stripe: payload
      };
    },

    [clearStripeIntent]: state => {
      return {
        ...state,
        stripe: initialState.stripe
      };
    },
    [setPaymentMode]: (state, { payload }) => {
      return {
        ...state,
        paymentTestMode: payload.paymentTestMode
      };
    },
    [setChangePlan]: state => {
      return {
        ...state,
        changePlan: true
      };
    },
    [setCheckoutKind]: (state, {payload}) => {
      return {
        ...state,
        checkoutKind: payload.checkoutKind
      };
    },
    [clearChangePlan]: state => {
      return {
        ...state,
        changePlan: false
      };
    },
    [setPayPalPlanId]: (state, { payload }) => {
      const paypal = { planId: payload.planId };
      return {
        ...state,
        paypal
      };
    },
    [setKeyValue]: (state, { payload }) => {
      const key = payload.key;
      const value = payload.value;
      return {
        ...state,
        [key]: value
      };
    },
    [start]:state => {
      return {
        ...state,
        status: false
      };
    },
    [done]:state => {
      return {
        ...state,
        status: 'done'
      };
    },
    [startBankRenewal]:state => {
      let bank = {renewal:true}
      return {
        ...state,
        bank
      };
    },
    [doneBankRenewal]:state => {
      let bank = {renewal:false}
      return {
        ...state,
        bank
      };
    },
  },
  initialState
));
