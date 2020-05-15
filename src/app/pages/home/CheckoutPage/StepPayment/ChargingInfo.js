import React from "react";
import { FormattedMessage } from "react-intl";

import FormattedPrice from "../../components/FormattedPrice";
import { CHECKOUT_KIND } from "../../constants/checkout-kind";

const ChargingInfo = ({
  service,
  checkoutKind,
  currency,
  pricing,
  selectedProduct
}) => {
  switch (checkoutKind) {
    case CHECKOUT_KIND.PROLONG:
    case CHECKOUT_KIND.ACTIVATE:
    case CHECKOUT_KIND.UPGRADE:
      return (
        <FormattedMessage
          id={`CheckoutPage.StepPayment.ChargingInfo.${checkoutKind}`}
        />
      );
    case CHECKOUT_KIND.ACTIVATE_WITH_TRIAL:
      return (
        <FormattedMessage
          id={`CheckoutPage.StepPayment.ChargingInfo.${checkoutKind}`}
          values={{
            price: (
              <FormattedPrice
                currency={currency}
                price={pricing.initialPrices.total}
              />
            ),
            interval: (
              <FormattedMessage
                id={`CheckoutPage.StepPayment.ChargingInfo.activate_with_trial.Interval.${selectedProduct.interval}`}
              />
            ),
            service: <FormattedMessage id={`Brand.${service}`} />
          }}
        />
      );
    case CHECKOUT_KIND.ACTIVATE_WITH_DISCOUNT:
      return (
        <FormattedMessage
          id={`CheckoutPage.StepPayment.ChargingInfo.${checkoutKind}`}
          values={{
            initialPrice: (
              <FormattedPrice
                currency={currency}
                price={pricing.initialPrices.total}
              />
            ),
            recurringPrice: (
              <FormattedPrice
                currency={currency}
                price={pricing.recurringPrices.total}
              />
            )
          }}
        />
      );
    default:
      return null;
  }
};

export default ChargingInfo;
