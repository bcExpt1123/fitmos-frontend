import React, { useState } from "react";
import { reactLocalStorage } from 'reactjs-localstorage';

import Sidebar from "./Sidebar";
import PaymentForm from "./PaymentForm";
import { CHECKOUT_KIND } from "../../constants/checkout-kind";
import { productBrand } from "../../../../../lib/productBrand";

const getCheckoutKind = (checkoutType, activeVoucher) => {
  return CHECKOUT_KIND.ACTIVATE;
};

const StepPayment = ({
  service,
  checkoutType,
  countryCode,
  pricing,
  selectedProduct,
  referrer,
  enteredVoucher,
  vouchers,
  onEnteredVoucherChange,
  resetActiveVoucher
}) => {
  const checkoutKind = getCheckoutKind(
    checkoutType,
    vouchers[productBrand(selectedProduct)][selectedProduct.interval]
  );
  const currency = {
    code: selectedProduct.currency,
    exponent: selectedProduct.currency_exponent
  };

  const couponId = reactLocalStorage.get('publicCouponId');

  return (
    <>
      {couponId&&
        <div
          className="section-notification"
        >
          Aprovecha esta promoción única y entrena desde casa. Aplica el cupón y afíliate. Podrás cancelar en cualquier momento.
        </div>
      }
      <section className={"container"} id="checkout" data-service={service}>
        <div className="row">
          <div className={"col-12 col-md-7 pt-4"}>
            <div>
              <h2 className="checkout-page-title display-3 d-none d-md-block">Checkout</h2>
              <PaymentForm
                service={service}
                checkoutKind={checkoutKind}
                currency={currency}
                pricing={pricing}
                selectedProduct={selectedProduct}
                activeVoucher={enteredVoucher}
                referrer={referrer}
              />
            </div>
          </div>

          <aside className={"col-12 col-md-4"}>
            <Sidebar
              service={service}
              checkoutKind={checkoutKind}
              pricing={pricing}
              selectedProduct={selectedProduct}
              activeVoucher={enteredVoucher}
              enteredVoucher={enteredVoucher}
              onEnteredVoucherChange={onEnteredVoucherChange}
              resetActiveVoucher={resetActiveVoucher}
            />
          </aside>
        </div>
      </section>
    </>
  );
};

export default StepPayment;
