import groupBy from "lodash/groupBy";

//import { VOUCHER_TYPE } from '../constants/voucher-type';
//import { BUNDLES } from '../constants/brands';
const VOUCHER_TYPE = {};
const BUNDLES = {};
export const INTERVAL_TO_WEEKS_NUM = {
  "1-month": 4,
  "3-months": 13,
  "6-months": 26,
  "1-year": 52
};

export const INTERVAL_TO_MONTHS_NUM = {
  "1-month": 1,
  "3-months": 3,
  "6-months": 6,
  "1-year": 12
};

export const INSTALLMENTS_INTEREST_RATE = {
  2: 6.89 - 3.9,
  3: 7.77 - 3.9,
  4: 8.63 - 3.9,
  5: 9.48 - 3.9,
  6: 10.33 - 3.9,
  7: 11.44 - 3.9,
  8: 12.26 - 3.9,
  9: 13.07 - 3.9,
  10: 13.87 - 3.9,
  11: 14.66 - 3.9,
  12: 15.44 - 3.9
};

// Determined by the bank of the customer and proceed directly
const UNKNOWN_INSTALLMENT_FEE_COUNTRIES = ["CL", "CO", "PE"];

// TODO: check if we really need this constant
// Intervals displayed on the buying and checkout pages.
export const INTERVALS = ["1-month", "1-year"];

export const groupByBrand = products =>
  groupBy(products, product => product.type.replace(/-coach$/, ""));

const isBundle = product =>
  Object.keys(BUNDLES).includes(product.type.replace("-coach", ""));

const isVoucherValidForProduct = ({ voucher, product }) =>
  voucher &&
  (voucher.intervals.length === 0 ||
    voucher.intervals.includes(product.interval));

const getAppliedDiscountInPercent = ({ voucher, product }) => {
  if (!isVoucherValidForProduct({ voucher, product })) {
    return 0;
  }

  switch (voucher.type) {
    case VOUCHER_TYPE.PERCENTAGE_DISCOUNT:
      return voucher.discount_percentage;
    default:
      return 0;
  }
};

const getVisualDiscountInPercent = ({ voucher, product }) => {
  if (!isVoucherValidForProduct({ voucher, product })) {
    return 0;
  }

  switch (voucher.type) {
    case VOUCHER_TYPE.PERCENTAGE_DISCOUNT:
      return voucher.discount_percentage;
    case VOUCHER_TYPE.FREE_TRIAL:
    case VOUCHER_TYPE.LASTING_FREE_TRAIL:
      return 100;
    default:
      return 0;
  }
};

export function isInstallmentsFeeUnknown(countryCode) {
  return UNKNOWN_INSTALLMENT_FEE_COUNTRIES.includes(countryCode);
}

function calculatePriceWithInstallmentFee(
  price,
  installmentCount,
  countryCode
) {
  if (installmentCount > 1 && !isInstallmentsFeeUnknown(countryCode)) {
    const interestRate = INSTALLMENTS_INTEREST_RATE[installmentCount];
    const modifier = 100.0 / (100.0 - interestRate);

    return Math.ceil(price * modifier);
  }

  return price;
}

const calculatePricesPerIntervals = (amountCents, interval, countryCode) => {
  const weeks = INTERVAL_TO_WEEKS_NUM[interval];
  const months = INTERVAL_TO_MONTHS_NUM[interval];
  const amountCentsWithInstallmentFee = calculatePriceWithInstallmentFee(
    amountCents,
    months,
    countryCode
  );
  const prices = {
    total: amountCents,
    perMonth: amountCents / months,
    perWeek: amountCents / weeks
  };
  const pricesWithInstallmentFee = {
    total: amountCentsWithInstallmentFee,
    perMonth: amountCentsWithInstallmentFee / months,
    perWeek: amountCentsWithInstallmentFee / weeks
  };

  return [prices, pricesWithInstallmentFee];
};

// initial prices     - prices for the first purchase
// discounted prices  - prices dispayed on the page (e.g. 0 for trial)
// recurring prices   - prices for the recurring pruchases
export function calculatePricesForProduct(
  product,
  { maxPricePerWeek, hasFakeDiscount, voucher, countryCode }
) {
  const isVoucherValid = isVoucherValidForProduct({ voucher, product });
  const visualDiscountInPercent = getVisualDiscountInPercent({
    voucher,
    product
  });
  const appliedDiscountInPercent = getAppliedDiscountInPercent({
    voucher,
    product
  });
  const visualPriceRatio = 1 - visualDiscountInPercent / 100;
  const appliedPriceRatio = 1 - appliedDiscountInPercent / 100;

  const [
    initialPrices,
    //initialPricesWithInstallmentFee
  ] = calculatePricesPerIntervals(
    product.amount_cents * appliedPriceRatio,
    product.interval,
    countryCode
  );
  let originalPrices;
  if (product.original_amount_cents) {
    [originalPrices] = calculatePricesPerIntervals(
      product.original_amount_cents * appliedPriceRatio,
      product.interval,
      countryCode
    );
  }
  let refundAmountCents;
  let currentSubscriptionsAmountCents;
  if (
    typeof product.refund_amount_cents === "number" &&
    typeof product.current_subscriptions_amount_cents === "number"
  ) {
    refundAmountCents = product.refund_amount_cents;
    currentSubscriptionsAmountCents =
      product.current_subscriptions_amount_cents;
  }
  const [
    discountedPrices,
    //discountedPricesWithInstallmentFee
  ] = calculatePricesPerIntervals(
    product.amount_cents * visualPriceRatio,
    product.interval,
    countryCode
  );
  const [
    recurringPrices,
    //recurringPricesWithInstallmentFee
  ] = calculatePricesPerIntervals(
    product.recurring_amount_cents || product.amount_cents,
    product.interval,
    countryCode
  );

  // This is only used to display savings, not for calculating prices.
  let savingsInPercent = 0;
  if (isVoucherValid && voucher.discount_percentage > 0) {
    // If discount voucher can be applied, show savings based on that.
    savingsInPercent = voucher.discount_percentage;
  } else if (hasFakeDiscount) {
    // If product doesn't have a real discount from voucher, but any of
    // the products has discount_percentage set, show that instead.
    savingsInPercent = product.discount_percentage;
  } else if (maxPricePerWeek && maxPricePerWeek > 0) {
    // Show savings compared to the most expensive product.
    savingsInPercent = (1 - initialPrices.perWeek / maxPricePerWeek) * 100;
  }

  return {
    initialPrices,
    originalPrices,
    discountedPrices,
    recurringPrices,
    savingsInPercent,
    appliedVoucher: isVoucherValid && voucher,
    refundAmountCents,
    currentSubscriptionsAmountCents
  };
}

export function calculatePricesForProducts(products, { voucher, countryCode }) {
  // Compare weekly prices only if all products are of the same type
  const doCompareWeeklyPrices = products.every(
    product => product.type === products[0].type
  );
  // Show fake discounts if any of the products has them
  const hasFakeDiscount = products.some(
    product => product.discount_percentage > 0
  );

  const maxPricePerWeek = doCompareWeeklyPrices
    ? Math.max(
        ...products.map(
          product =>
            product.amount_cents / INTERVAL_TO_WEEKS_NUM[product.interval]
        )
      )
    : undefined;

  const prices = products.reduce((acc, product) => {
    acc[product.id] = calculatePricesForProduct(product, {
      maxPricePerWeek,
      hasFakeDiscount,
      voucher,
      countryCode
    });

    return acc;
  }, {});

  // Calculate fake price for bundles.
  products.forEach(product => {
    if (isBundle(product)) {
      const totalAmount = product.amount_cents * (4 / 3);

      const [bundlePrices] = calculatePricesPerIntervals(
        totalAmount,
        product.interval,
        countryCode
      );

      prices[product.id].bundlePrices = bundlePrices;
    }
  });

  return prices;
}
