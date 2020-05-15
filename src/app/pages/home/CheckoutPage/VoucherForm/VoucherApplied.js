import React from "react";
import { FormattedMessage } from "react-intl";

const VoucherApplied = ({ onVoucherReset }) => (
  <div className={"voucher-applied-message"}>
    <FormattedMessage id="CheckoutPage.VoucherForm.VoucherApplied" />
    <button
      type="button"
      className={"reset-form-button"}
      onClick={onVoucherReset}
      data-cy="voucher remove button"
    >
      <FormattedMessage id="CheckoutPage.VoucherForm.Button.RemoveVoucher" />
    </button>
  </div>
);

export default VoucherApplied;
