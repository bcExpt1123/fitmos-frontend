import React from "react";
import PropTypes from "prop-types";
import { IntlProvider, FormattedNumber } from "react-intl";

export const formatPrice = ({ intl, currency, price }) =>
  intl.formatNumber(price / 10 ** currency.exponent, {
    style: "currency",
    currency: currency.code
  });
const FormattedPrice = ({ intl, price, currency, children, locale }) => {
  const formattedPrice = formatPrice({ intl, currency, price });
  return locale === "en" ? (
    <IntlProvider locale="en">
      <FormattedNumber
        value={price / 10 ** currency.exponent}
        style="currency"
        currency={currency.code}
      />
    </IntlProvider>
  ) : children ? (
    children(formattedPrice)
  ) : (
    formattedPrice
  );
};

FormattedPrice.propTypes = {
  price: PropTypes.number.isRequired,
  currency: PropTypes.shape({
    code: PropTypes.string.isRequired,
    exponent: PropTypes.number.isRequired
  }).isRequired
};
export default FormattedPrice;
