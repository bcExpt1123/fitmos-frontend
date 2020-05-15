import React from "react";
import { FormattedMessage } from "react-intl";

import Card from "../../components/Card";
import Typography from "../../components/Typography";
import VoucherForm from "../VoucherForm";
import Cart from "../Cart";

import { CHECKOUT_KIND } from "../../constants/checkout-kind";

import AboutFitemos from "../About/AboutFitemos";

const BRANDS = {};

const Sidebar = ({
  service,
  checkoutKind,
  pricing,
  selectedProduct,
  activeVoucher,
  enteredVoucher,
  onEnteredVoucherChange,
  resetActiveVoucher
}) => (
  <>
    <Cart
      activeVoucher={activeVoucher}
      service={service}
      checkoutKind={checkoutKind}
      pricing={pricing}
      selectedProduct={selectedProduct}
    />
    {![CHECKOUT_KIND.UPGRADE, CHECKOUT_KIND.PROLONG].includes(checkoutKind) && (
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
);

export default Sidebar;
