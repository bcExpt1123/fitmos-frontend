import { call, put, select, spawn } from "redux-saga/effects";
import pick from "lodash/pick";
import get from "lodash/get";

import { logError } from "../../../../../../lib/logError";
import { loadScript } from "../../../../../../lib/loadScript";
import { paymentRequested, paymentFailed, setIdempotencyKey } from "../actions";
import { addAlertMessage } from "../../alert/actions";

import {
  redirectToCongratulationsPage,
  refreshClaims,
  trackPurchaseIntent,
  trackPurchaseSuccess
} from "./common";

import apiErrorMatcher from "../../../../../../lib/apiErrorMatcher";
import { uuidv4 } from "../../../../../../lib/uuidv4";
import { CHECKOUT_KIND } from "../../../constants/checkout-kind";
import { PAYMENT_PROVIDER } from "../../../constants/payment-provider";

const Claim = {};
const selectCountryCode = state => state.countryCode;
const selectUserEmail = state => state.auth.currentUser.email;
const selectIdempotencyKey = state => state.checkout.idempotencyKey;

const logErrorMeta = { SourceModule: "Checkout", PaymentProvider: "EBANX" };

// TODO: replace with proper error messages
const errorMessages = {
  "BP-DR-13": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyName",
    field: "ebanx.fullName"
  },
  "BP-DR-14": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyName",
    field: "ebanx.fullName"
  },
  "BP-DR-22": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyTaxpayerIdBr",
    field: "ebanx.taxpayerIdBr"
  },
  "BP-DR-23": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.invalidTaxpayerIdBr",
    field: "ebanx.taxpayerIdBr"
  },
  "BP-DR-39": {
    message:
      "CheckoutPage.StepPayment.EbanxForm.Error.nonMatchingNameAndDocument",
    field: "ebanx.taxpayerIdBr"
  },
  "BP-DOC-01": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.invalidTaxpayerIdBr",
    field: "ebanx.taxpayerIdBr"
  },
  "BP-DR-24": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyZipCode",
    field: "ebanx.zipCode"
  },
  "BP-DR-25": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyAddress",
    field: "ebanx.address"
  },
  "BP-DR-26": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyAddressNumber",
    field: "ebanx.addressNumber"
  },
  "BP-DR-27": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyCity",
    field: "ebanx.city"
  },
  "BP-DR-28": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyState",
    field: "ebanx.state"
  },
  "BP-DR-29": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyState",
    field: "ebanx.state"
  },
  "BP-DR-31": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyPhoneNumber",
    field: "ebanx.phoneNumber"
  },
  "BP-DR-32": {
    message: "CheckoutPage.StepPayment.EbanxForm.Error.emptyPhoneNumber",
    field: "ebanx.phoneNumber"
  },
  idempotency_key_unique_violation: {
    message: "CheckoutPage.Alert.Error.idempotency_key_unique_violation"
  }
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

async function loadEbanxScript() {
  if (window.EBANX) return;

  await loadScript("https://js.ebanx.com/ebanx-1.9.0.min.js");

  window.EBANX.config.setMode(
    /^test/.test(process.env.EBANX_PUBLISHABLE_KEY) ? "test" : "production"
  );
  window.EBANX.config.setPublishableKey(process.env.EBANX_PUBLISHABLE_KEY);
}

function createToken(country, { number, holder, exp, cvc }) {
  window.EBANX.config.setCountry(country);
  const card = {
    card_number: number,
    card_name: holder,
    card_due_date: exp
      .split("/")
      .map((item, idx) => (idx === 0 ? item.trim() : `20${item.trim()}`))
      .join("/"),
    card_cvv: cvc
  };

  return new Promise((resolve, reject) => {
    window.EBANX.card.createToken(card, response => {
      if (response.data.status) {
        resolve(
          pick(
            response.data,
            "token",
            "payment_type_code",
            "masked_card_number"
          )
        );
      } else {
        const error = response && response.error && response.error.err;
        switch (error && (error.status_code || error.message)) {
          case "BP-DR-55":
            reject(new Error("invalid_cvc"));
            break;
          case "BP-DR-75":
            reject(new Error("invalid_number"));
            break;
          case "A data do cartão de crédito deve estar no formato mes/ano, por exemplo, 12/2020.":
          case "BP-DR-58":
          case "BP-DR-59":
          case "BP-DR-67":
            reject(new Error("invalid_expiry_month"));
            break;
          default:
            reject(
              response.error.err.status_message || response.error.err.message
            );
        }
      }
    });
  });
}

function createOrUpdateClaimWithEbanx({
  checkoutKind,
  product,
  referrer,
  token,
  voucher,
  idempotencyKey,
  ebanx: {
    fullName,
    taxpayerIdBr,
    taxpayerIdAr,
    taxpayerIdCl,
    taxpayerIdCo,
    taxpayerIdPe,
    zipCode,
    address,
    addressNumber,
    city,
    state,
    region,
    phoneNumber,
    installmentsSelected
  },
  country,
  email
}) {
  const claimParams = {
    product_id: product.id,
    idempotency_key: idempotencyKey,

    token: token.token,
    masked_card_number: token.masked_card_number,
    payment_type_code: token.payment_type_code,

    name: fullName,
    email,
    document:
      taxpayerIdBr ||
      taxpayerIdAr ||
      taxpayerIdCl ||
      taxpayerIdCo ||
      taxpayerIdPe,
    zipcode: zipCode,
    address,
    street_number: addressNumber,
    city,
    state: state || region,
    country,
    phone_number: phoneNumber,
    // installments attributes, backend is using UK English attribute name here
    instalments: installmentsSelected ? product.months : null
  };

  if (checkoutKind === CHECKOUT_KIND.PROLONG) {
    return Claim.update(PAYMENT_PROVIDER.EBANX, claimParams);
  }

  if (checkoutKind === CHECKOUT_KIND.UPGRADE) {
    return Claim.upsell(
      PAYMENT_PROVIDER.EBANX,
      // :product_id, :country, claimed_brands: []
      {
        ...claimParams,
        claimed_brands: []
      }
    );
  }

  if (voucher) {
    claimParams.voucher = voucher.token;
  }

  return Claim.create(
    PAYMENT_PROVIDER.EBANX,
    claimParams,
    referrer && referrer.id
  );
}

export function* onPayWithEbanx({
  payload: {
    service,
    checkoutKind,
    creditCard,
    ebanx,
    selectedProduct,
    activeVoucher,
    pricing,
    referrer,
    setErrors
  }
}) {
  let token;
  let country;

  yield put(paymentRequested());
  yield spawn(trackPurchaseIntent, {
    paymentProvider: PAYMENT_PROVIDER.EBANX,
    product: selectedProduct,
    voucher: activeVoucher
  });

  try {
    yield call(loadEbanxScript);
  } catch (error) {
    logError(error, logErrorMeta);
    yield put(paymentFailed());
    yield put(
      addAlertMessage({
        type: "error",
        message: {
          id: "CheckoutPage.Alert.Error.generic_error"
        }
      })
    );

    return;
  }

  try {
    country = (yield select(selectCountryCode)).toLowerCase();
    token = yield call(createToken, country, creditCard);
  } catch (error) {
    logError(error, logErrorMeta);
    yield put(paymentFailed());
    yield put(
      addAlertMessage({
        type: "error",
        // card error message from ebanx. Should be pulled from our translations?
        message: typeof error === "string" ? error : error.message
        // message: { id: `CheckoutPage.Alert.Error.CreditCard.${error.message}` },
      })
    );

    return;
  }

  try {
    const idempotencyKey = yield select(selectIdempotencyKey);
    const email = yield select(selectUserEmail);
    yield call(createOrUpdateClaimWithEbanx, {
      checkoutKind,
      product: selectedProduct,
      referrer,
      token,
      voucher: activeVoucher,
      idempotencyKey,
      ebanx,
      country,
      email
    });
  } catch (error) {
    logError(error, logErrorMeta);
    yield put(paymentFailed());
    yield put(setIdempotencyKey({ idempotencyKey: uuidv4() }));

    const errorsObj = get(error, "response.data.errors", { base: [] });
    const message = mapApiErrors(errorsObj);
    const formErrors = errorsObj.base.reduce(
      (res, err) =>
        errorMessages[err.code] && errorMessages[err.code].field
          ? { ...res, [errorMessages[err.code].field]: "not valid" }
          : res,
      {}
    );
    if (Object.keys(formErrors).length) {
      yield call(setErrors, { "ebanx.state": "not valid" });
    }

    if (
      message.id === "CheckoutPage.Alert.Error.idempotency_key_unique_violation"
    ) {
      // This happens e.g. on double click when the form gets submitted more
      // than once. Stop this request and let the first request finish.
      return;
    }

    yield put(addAlertMessage({ type: "error", message }));

    return;
  }

  const claims = yield call(refreshClaims);

  if (checkoutKind !== CHECKOUT_KIND.PROLONG) {
    const { currentUser } = yield select(store => store.auth);

    yield spawn(trackPurchaseSuccess, {
      paymentProvider: PAYMENT_PROVIDER.EBANX,
      claim: claims[service],
      price: ebanx.installmentsSelected
        ? pricing.initialPricesWithInstallmentFee.total
        : pricing.initialPrices.total,
      product: selectedProduct,
      user: currentUser,
      voucher: activeVoucher,
      areInstallmentsSelected: ebanx.installmentsSelected
    });
  }

  yield call(redirectToCongratulationsPage, {
    service,
    context: checkoutKind
  });
}
