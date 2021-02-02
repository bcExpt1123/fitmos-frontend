import React, { useState } from "react";

import ExpandVoucherFormButton from "./ExpandVoucherFormButton";
import ExpandedVoucherForm from "./ExpandedVoucherForm";
import VoucherApplied from "./VoucherApplied";

const VoucherForm = ({
  service,
  voucher,
  onEnteredVoucherChange,
  resetActiveVoucher
}) => {
  const [isFormExpanded, setIsFormExpanded] = useState(Boolean(voucher));

  const handleExpandForm = () => {
    setIsFormExpanded(true);
  };

  const handleVoucherReset = () => {
    setIsFormExpanded(false);
    resetActiveVoucher();
  };

  const handleEnteredVoucherChange = newVoucher => {
    setIsFormExpanded(false);
    onEnteredVoucherChange(newVoucher);
  };

  return (
    <section data-cy="voucher form">
      {voucher && <VoucherApplied onVoucherReset={handleVoucherReset} />}

      {!voucher && !isFormExpanded && (
        <ExpandVoucherFormButton onClick={handleExpandForm} />
      )}

      {!voucher && isFormExpanded && (
        <ExpandedVoucherForm
          service={service}
          onEnteredVoucherChange={handleEnteredVoucherChange}
        />
      )}
    </section>
  );
};

export default VoucherForm;
