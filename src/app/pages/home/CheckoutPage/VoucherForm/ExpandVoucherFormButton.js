import React from "react";

const ExpandVoucherFormButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={"show-form-button btn fs-btn"}
    data-cy="switch voucher form button"
  >
    Ingrese un cupón
  </button>
);

export default ExpandVoucherFormButton;
