import React from "react";
import { useSelector } from "react-redux";

import Card from "../../components/Card";
import VoucherForm from "../VoucherForm";
import Cart from "../Cart";

import { CHECKOUT_KIND } from "../../constants/checkout-kind";

import AboutFitemos from "../About/AboutFitemos";

const Sidebar = ({
  service,
  pricing,
  selectedProduct,
  activeVoucher,
  enteredVoucher,
  onEnteredVoucherChange,
  resetActiveVoucher
}) => {
  const checkoutKind = useSelector(({checkout})=>checkout.checkoutKind);
  return (
  <>
    <Cart
      activeVoucher={activeVoucher}
      service={service}
      pricing={pricing}
      selectedProduct={selectedProduct}
    />
    {![CHECKOUT_KIND.UPGRADE, CHECKOUT_KIND.ACTIVATE_WITH_TRIAL].includes(checkoutKind) && (
      <Card padding="xs" className="mt-4 mb-4 ">
        <VoucherForm
          service={service}
          voucher={enteredVoucher}
          onEnteredVoucherChange={onEnteredVoucherChange}
          resetActiveVoucher={resetActiveVoucher}
        />
      </Card>
    )}
    <div className="">
      <AboutFitemos />
    </div>  
  </>
)};

export default Sidebar;
