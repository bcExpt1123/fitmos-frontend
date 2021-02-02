import { call, delay, put, select, spawn } from "redux-saga/effects";

import {
  paymentRequested,
  paymentFailed,
  paymentSucceeded,
  setStripeIntent,
  clearStripeIntent
} from "../actions";
import { addAlertMessage } from "../../alert/actions";
//import { setClaims } from '../../claims/actions';
import { http } from "../../../services/api";
import { logError } from "../../../../../../lib/logError";
import { CHECKOUT_KIND } from "../../../constants/checkout-kind";
import { PAYMENT_PROVIDER } from "../../../constants/payment-provider";

import {
  redirectToCongratulationsPage,
  trackPurchaseIntent,
  trackPurchaseSuccess
} from "./common";

const Claim = {};
const logErrorMeta = { SourceModule: "Checkout", PaymentProvider: "Stripe" };

function hasStoredMatchingIntent(payload, storedData) {
  return (
    storedData.intent &&
    storedData.productId === payload.selectedProduct.id &&
    storedData.voucherToken ===
      (payload.activeVoucher && payload.activeVoucher.token)
  );
}

function requestIntent({ product, referrer, voucher, checkoutKind }) {
  // FIXME: refactor methods/paths selection
  return http({
    app: "payment",
    method: checkoutKind === CHECKOUT_KIND.PROLONG ? "PATCH" : "POST",
    path:
      checkoutKind === CHECKOUT_KIND.UPGRADE
        ? "/v3/stripe/upgrades"
        : "/v1/claims/stripe_intent",
    data: {
      claim: {
        product_id: product.id,
        ...(voucher ? { voucher: voucher.token } : {})
      },
      ...(referrer ? { referral_id: referrer.id } : {}),
      ...(checkoutKind === CHECKOUT_KIND.UPGRADE
        ? {
            upgrade: {
              product_id: product.id,
              claimed_brands: []
            }
          }
        : {})
    }
  }).then(({ data }) => data.stripe_intent);
}

function* pollForClaim(service) {
  const retryCount = 21; // about a minute
  const retryDelay = retry => Math.min(retry, 3) * 1000;
  const isSubscriptionActive = claim =>
    claim && claim.subscription.status === "active";

  for (let retries = 0; retries <= retryCount; retries += 1) {
    yield delay(retryDelay(retries));
    const claims = yield call(Claim.findAll);

    if (isSubscriptionActive(claims[service])) {
      return claims;
    }
  }

  throw new Error("stripe_webhook_processing_timeout");
}

export function* stripeAlerts(result) {
  // Stripe error types: https://stripe.com/docs/api/errors#errors-type
  // Stripe error codes: https://stripe.com/docs/error-codes
  // Stripe decline codes: https://stripe.com/docs/declines/codes
  switch (result.error.type) {
    case "card_error":
      yield put(
        addAlertMessage({
          type: "error",
          message: {
            id: `CheckoutPage.Alert.Error.CreditCard.${result.error.code}`
          }
        })
      );
      break;
    // Can happen if payment was processed by Stripe, but webhook was
    // not processed by our backend, and user tries to pay again using
    // the same intent.
    case "invalid_request_error":
      yield put(
        addAlertMessage({
          type: "error",
          message: {
            id:
              result.error.code === "payment_intent_unexpected_state"
                ? `CheckoutPage.Alert.Error.Stripe.webhook_failed`
                : "CheckoutPage.Alert.Error.transaction_failed"
          },
          delay: 10000
        })
      );
      break;
    default:
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "CheckoutPage.Alert.Error.transaction_failed" }
        })
      );
      break;
  }
}

export function* onPayWithStripe({
  payload: {
    stripe,
    stripeFormElement,
    service,
    checkoutKind,
    creditCard,
    selectedProduct,
    activeVoucher,
    pricing,
    referrer
  }
}) {
  // Stripe PaymentIntent or SetupIntent
  let intent;

  // Disable submit button while payment is being processed
  yield put(paymentRequested());
  yield spawn(trackPurchaseIntent, {
    paymentProvider: PAYMENT_PROVIDER.STRIPE,
    product: selectedProduct,
    voucher: activeVoucher
  });

  try {
    const storedData = yield select(store => store.checkout.stripe);

    if (
      hasStoredMatchingIntent({ selectedProduct, activeVoucher }, storedData)
    ) {
      // Use Stripe PaymentIntent or SetupIntent from the store
      ({ intent } = storedData);
    } else {
      // Request new Stripe PaymentIntent or SetupIntent from our Payment backend
      intent = yield call(requestIntent, {
        product: selectedProduct,
        voucher: activeVoucher,
        referrer,
        checkoutKind
      });

      yield put(
        setStripeIntent({
          intent,
          productId: selectedProduct.id,
          voucherToken: activeVoucher && activeVoucher.token
        })
      );
    }
  } catch (error) {
    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "CheckoutPage.Alert.Error.transaction_failed" }
      })
    );
    yield put(paymentFailed());
    return;
  }

  // Handle payment by passing PaymentIntent or SetupIntent client secret
  // to Stripe along with all credit card data.
  // https://stripe.com/docs/stripe-js/reference#stripe-handle-card-payment
  const method = {
    payment_intent: "handleCardPayment",
    setup_intent: "handleCardSetup"
  }[intent.type];
  const result = yield call(
    stripe[method],
    intent.client_secret,
    stripeFormElement,
    {
      payment_method_data: {
        billing_details: { name: creditCard.holder }
      }
    }
  );

  if (result.error) {
    logError(`Stripe error: ${JSON.stringify(result.error)}`, logErrorMeta);
    yield spawn(stripeAlerts, result);
    yield put(paymentFailed());
    return;
  }

  try {
    // Claims are created in Payment backend via webhook triggered by Stripe
    // after successful payment. If claims exist in Payment backend, it means
    // that the payment was successful *and* processed by our backend.
    const claims = yield call(pollForClaim, service);

    //yield put(setClaims({ claims }));
    yield put(clearStripeIntent());

    yield call(redirectToCongratulationsPage, {
      service,
      context: checkoutKind
    });

    if (checkoutKind !== CHECKOUT_KIND.PROLONG) {
      const { currentUser } = yield select(store => store.auth);

      yield spawn(trackPurchaseSuccess, {
        paymentProvider: PAYMENT_PROVIDER.STRIPE,
        claim: claims[service],
        price: pricing.initialPrices.total,
        product: selectedProduct,
        user: currentUser,
        voucher: activeVoucher,
        areInstallmentsSelected: false
      });
    }

    yield put(paymentSucceeded());
  } catch (error) {
    logError(error, logErrorMeta);

    yield put(
      addAlertMessage({
        type: "error",
        message: { id: "CheckoutPage.Alert.Error.Stripe.webhook_failed" }
      })
    );
    yield put(paymentFailed());
  }
}
