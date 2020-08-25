import { call } from "redux-saga/effects";
//import { analytics } from '@freeletics/web-package-tracking';

//import { setClaims } from '../../claims/actions';
//import { getNavigation } from '../../../navigation';

//import { PAYMENT_PROVIDER } from "../../../constants/payment-provider";
//import { VOUCHER_TYPE } from "../../../constants/voucher-type";
//import { productBrand } from "../../../../../../lib/productBrand";

const states = {};
const Claim = {};

//const brandToCheckoutSlug = () => "service";
// TODO: check if it's really needed
/*function toPrice(cents, currencyExponent) {
  const amount = Math.round(cents) / 10 ** currencyExponent;

  if (currencyExponent > 0) {
    const integer = Math.floor(amount);
    const decimal = Math.abs(amount) % 1;
    const roundedDecimal = Math.floor(decimal * 10 ** currencyExponent);
    const paddingLength = currencyExponent - `${roundedDecimal}`.length;
    let padding = [];
    padding.length = paddingLength + 1;
    padding = padding.join("0");

    return `${integer}.${padding}${roundedDecimal}`;
  }

  return `${Math.round(amount)}`;
}

function getProductTrackingData({ product, voucher }) {
  return {
    category: "Coach",
    id: product.id,
    name: productBrand(product),
    price_total: toPrice(product.amount_cents, product.currency_exponent),
    price: toPrice(product.amount_cents, product.currency_exponent),
    variant: product.interval,
    quantity: "1",
    months: `${product.months}`,
    voucher_code: voucher && voucher.token,
    voucher_sum:
      voucher && voucher.type === "percentage_discount"
        ? toPrice(
            product.amount_cents * (voucher.discount_percentage / 100),
            product.currency_exponent
          )
        : ""
  };
}

function hoursSince(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.round(diff / 1000 / 60 / 60);
}*/

// Creating or updating some claims, like e.g. `training-nutrition-coach`,
// results in multiple claims being created or updated. Thus, we need to
// fetch all claims again to refresh them in store.
export function* refreshClaims() {
  const claims = yield call(Claim.findAll);
  //yield put(setClaims({ claims }));

  return claims;
}

export function* redirectToCongratulationsPage({ context }) {
  const navigation = "navigate";
  yield call(
    [navigation, "navigate"],
    states.checkout.congratulations({
      context
    })
  );
}

export function trackPurchaseIntent({ paymentProvider, product, voucher }) {
  /*analytics.track('analytics_event', {
    interaction_code: 'EC-CHF',
    hit_type: 'event',
    page_type: 'checkout-pay',
    component_category: 'checkout',
    component_subcategory: 'submit',
    component_attribute1:
      paymentProvider === PAYMENT_PROVIDER.PAYPAL ? 'paypal' : 'credit_card',
    checkout_type: brandToCheckoutSlug(productBrand(product)),
    checkout_payment_options:
      paymentProvider === PAYMENT_PROVIDER.PAYPAL ? 'paypal' : 'credit_card',
    checkout_step_name: 'submit',
    currency: product.currency,
    products: [getProductTrackingData({ product, voucher })],
  });*/
}

export function trackPurchaseSuccess({
  paymentProvider,
  claim,
  price,
  product,
  user,
  voucher,
  areInstallmentsSelected
}) {
  /*const isTrial =
    Boolean(voucher) &&
    [VOUCHER_TYPE.FREE_TRIAL, VOUCHER_TYPE.LASTING_FREE_TRAIL].includes(
      voucher.type
    );*/
  //const event = isTrial ? "start_trial" : "purchase";

  // New tracking code
  /*analytics.track('analytics_event', {
    interaction_code: isTrial ? 'EC-TRI' : 'EC-ORD',
    hit_type: 'page_impression',
    page_type: 'checkout-confirm',
    transaction_id: subscription.id,
    transaction_revenue: toPrice(price, subscription.currency_exponent),
    checkout_type: brandToCheckoutSlug(productBrand(product)),
    checkout_payment_options:
      subscription.provider_name === 'paypal' ? 'paypal' : 'credit_card',
    currency: subscription.currency,
    products: [
      getProductTrackingData({
        // When tracking PayPal purchase, product properties are passed via
        // query params and is missing currency properties. That's why the
        // defaults are taken from subscription object here.
        product: {
          currency: subscription.currency,
          currency_exponent: subscription.currency_exponent,
          ...product,
        },
        voucher,
      }),
    ],
  });*/

  // Old tracking code
  // TODO: check if it's really needed (ask Thomas Yopes)
  /*analytics.track(event, {
    payment_provider: paymentProvider,
    payment_structure: areInstallmentsSelected ? 'installments' : 'full',
    product_id: product.id,
    product_type: product.type,
    coupon_id: voucher ? voucher.token : '',
    coupon_type: voucher ? voucher.type : '',
    num_product_length: product.months,
    num_hours_since_sign_up: hoursSince(new Date(Date.parse(user.created_at))),
    value: Math.round(price) / 10 ** subscription.currency_exponent,
    currency: subscription.currency,
    transaction_id: subscription.id,
  });*/
}
