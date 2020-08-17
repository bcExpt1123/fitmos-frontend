import React, { useContext } from "react";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";
import addMonths from "date-fns/addMonths";
import { useSelector } from "react-redux";

import { INSTALLMENTS_INTEREST_RATE } from "../../services/product";
import Card from "../../components/Card";
import Typography from "../../components/Typography";
import FormattedPrice, {
  formatPrice,
  FormatEnPrice
} from "../../components/FormattedPrice";

import { CHECKOUT_KIND } from "../../constants/checkout-kind";

const styles = {};

const ChargingInfo = ({
  activeVoucher,
  service,
  currency,
  prices,
  selectedProduct
}) => {
  const checkoutKind = useSelector(({checkout})=>checkout.checkoutKind);
  switch (checkoutKind) {
    case CHECKOUT_KIND.PROLONG:
    case CHECKOUT_KIND.ACTIVATE:
    case CHECKOUT_KIND.UPGRADE:
      return <>{selectedProduct.months} Meses de entrenamiento</>;
    case CHECKOUT_KIND.ACTIVATE_WITH_DISCOUNT: {
      const values = {
        interval: (
          <FormattedMessage
            id={`CheckoutPage.Sidebar.Cart.Interval.${selectedProduct.interval}`}
          />
        ),
        initialPrice: (
          <FormattedPrice currency={currency} price={prices.discounted} />
        ),
        recurringPrice: (
          <FormattedPrice currency={currency} price={prices.recurring} />
        )
      };

      return (
        <FormattedMessage
          id={`CheckoutPage.Sidebar.Cart.ProductDescription.activate_with_discount.${service}`}
          values={values}
        />
      );
    }
    default:
      return null;
  }
};

const Cart = ({
  activeVoucher,
  service,
  pricing,
  selectedProduct,
  intl
}) => {
  const currency = {
    code: selectedProduct.currency,
    exponent: selectedProduct.currency_exponent
  };
  const hasDiscountedPrice =
    pricing.initialPrices.total !== pricing.discountedPrices.total;
  const prices = {
    initial: pricing.initialPrices.total,
    discounted: pricing.discountedPrices.total,
    recurring: pricing.recurringPrices.total,
    different: pricing.discountedPrices.total - pricing.initialPrices.total
  };
  const checkoutKind = useSelector(({checkout})=>checkout.checkoutKind);
  const serviceItem = useSelector(({service})=>service.item);
  return (
    <section className={"cart"} data-cy="cart section">
      <h2 className="checkout-page-title display-3 d-block d-md-none pt-3">Checkout</h2>
      <Card padding="xs" noMarginBottom>
        {checkoutKind==CHECKOUT_KIND.ACTIVATE_WITH_TRIAL?(
          <h3>Free Trial</h3>
        ):(
          <h3>Detalle de compra</h3>
        )}
        
        <div className={"product"}>
          <div className={"product-details"}>
            <h5>PLAN FITEMOS</h5>
            <p>
              <ChargingInfo
                activeVoucher={activeVoucher}
                service={service}
                checkoutKind={checkoutKind}
                currency={currency}
                prices={prices}
                selectedProduct={selectedProduct}
              />
            </p>
          </div>

          {checkoutKind === CHECKOUT_KIND.ACTIVATE && (
            <div className={"product-price"} data-cy="cart product price">
              <p>
                <FormattedPrice
                  price={prices.initial}
                  currency={currency}
                  locale="en"
                />
              </p>
            </div>
          )}
          {checkoutKind === CHECKOUT_KIND.ACTIVATE_WITH_TRIAL && (
            <div className={"product-price"} data-cy="cart product price">
              <p>
                <FormattedPrice
                  price={0}
                  currency={currency}
                  locale="en"
                />
              </p>
            </div>
          )}
        </div>
        {hasDiscountedPrice && (
          <>
            <div className="discounted">
              <h5>{activeVoucher.name}</h5>
              <div className="discount-price">
                <FormattedPrice
                  price={prices.different}
                  currency={currency}
                  locale="en"
                />
              </div>
            </div>
            <p>
              <>
                Está aplicado el cupón "{activeVoucher.name}" y tu primer
                pago será por <FormattedPrice
                price={pricing.discountedPrices.total}
                currency={currency}
                locale="en"
              />. Al vencerse el período de la suscripción se
                renovará por {activeVoucher.renewal?(
                <FormattedPrice
                  price={pricing.discountedPrices.total}
                  currency={currency}
                  locale="en"
              />):(
                <FormattedPrice
                    price={pricing.initialPrices.total}
                    currency={currency}
                    locale="en"
                />
                )}.
                <br/>
                Podrás cancelar en cualquier momento libre de cargos.
              </>
          </p>      
        </>
      )}
      {checkoutKind === CHECKOUT_KIND.ACTIVATE_WITH_TRIAL && (
        <p>
          Prueba gratis por {serviceItem.free_duration} días. Podrá cancelar en cualquier momento sin compromiso.
          Al concluir el período de prueba se renovará por &nbsp; 
          <FormattedPrice
              price={pricing.discountedPrices.total}
              currency={currency}
              locale="en"
          />.
        </p>      
      )}

        {checkoutKind === CHECKOUT_KIND.UPGRADE &&
          typeof pricing.refundAmountCents === "number" && (
            <div className={"refundDetails"} data-cy="upsell cart prices">
              {pricing.refundAmountCents > 0 ? (
                <>
                  <div>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.subscription_credit" />
                    </p>
                    <p>
                      <FormattedPrice
                        price={pricing.currentSubscriptionsAmountCents}
                        currency={currency}
                      />
                    </p>
                  </div>
                  <div>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.new_subscription" />
                    </p>
                    <p>
                      -{" "}
                      <FormattedPrice
                        price={prices.recurring}
                        currency={currency}
                      />
                    </p>
                  </div>
                  <div className={"refundDetailsSummary"}>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.payment_due" />
                    </p>
                    <p>
                      <FormattedPrice price={0} currency={currency} />
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.new_subscription" />
                    </p>
                    <p>
                      <FormattedPrice
                        price={prices.recurring}
                        currency={currency}
                      />
                    </p>
                  </div>
                  <div>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.subscription_credit" />
                    </p>
                    <p>
                      -{" "}
                      <FormattedPrice
                        price={pricing.currentSubscriptionsAmountCents}
                        currency={currency}
                      />
                    </p>
                  </div>
                  <div className={"refundDetailsSummary"}>
                    <p>
                      <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.payment_due" />
                    </p>
                    <p>
                      <FormattedPrice
                        price={prices.discounted}
                        currency={currency}
                      />
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
      </Card>

      {checkoutKind === CHECKOUT_KIND.UPGRADE ? (
        <>
          {pricing.refundAmountCents > 0 ? (
            <Card padding="xs" noMarginBottom>
              <div className={"totalPrice"} data-cy="upsell cart total">
                <FormattedMessage id="CheckoutPage.Sidebar.Cart.Refund.Label.value" />
                <strong>
                  <FormattedPrice
                    price={pricing.refundAmountCents}
                    currency={currency}
                  />
                </strong>
              </div>

              <div className={"refundDisclaimer"}>
                <FormattedHTMLMessage
                  id="CheckoutPage.Sidebar.Cart.Refund.automatic_refund"
                  values={{
                    refund: formatPrice({
                      price: pricing.refundAmountCents,
                      currency,
                      intl
                    }),
                    renewal_price: formatPrice({
                      price: prices.recurring,
                      currency,
                      intl
                    }),
                    renewal_date: intl.formatDate(
                      addMonths(new Date(), selectedProduct.months)
                    )
                  }}
                />
              </div>
            </Card>
          ) : (
            <Card padding="xs" noMarginBottom>
              <div className={"totalPrice"} data-cy="cart total">
                <FormattedMessage id="CheckoutPage.Sidebar.Cart.Label.Total" />

                <strong>
                  <FormattedPrice
                    price={prices.discounted}
                    currency={currency}
                  />
                </strong>
              </div>

              <div className={"refundDisclaimer"}>
                <FormattedHTMLMessage
                  id="CheckoutPage.Sidebar.Cart.Disclaimer"
                  values={{
                    credit_amount: formatPrice({
                      price: pricing.currentSubscriptionsAmountCents,
                      currency,
                      intl
                    }),
                    renewal_price: formatPrice({
                      price: prices.recurring,
                      currency,
                      intl
                    }),
                    renewal_date: intl.formatDate(
                      addMonths(new Date(), selectedProduct.months)
                    )
                  }}
                />
              </div>
            </Card>
          )}
        </>
      ) : (
        checkoutKind === CHECKOUT_KIND.ACTIVATE_WITH_TRIAL ?(
          <Card padding="xs" noMarginBottom>
            <div className={"total-price"} data-cy="cart total">
              <span>TOTAL</span>
              <span>
                <FormattedPrice
                  price={0}
                  currency={currency}
                  locale="en"
                />
              </span>
            </div>
          </Card>
        )
        :(
          <Card padding="xs" noMarginBottom>
            <div className={"total-price"} data-cy="cart total">
              <span>TOTAL</span>
              <span>
                <FormattedPrice
                  price={prices.discounted}
                  currency={currency}
                  locale="en"
                />
              </span>
            </div>
          </Card>
        )
      )}
    </section>
  );
};

export default Cart;
