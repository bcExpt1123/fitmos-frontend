import React, { useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import Button from "../../components/Button";

import { addAlertMessage } from "../../redux/alert/actions";
import { validateVoucher } from "../../redux/vouchers/actions";

export const mapStateToProps = state => ({
  currentUserId: state.auth.currentUserId,
  vouchers: state.vouchers
});

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addAlertMessage,
      validateVoucher
    },
    dispatch
  )
});

// I had to change named export to be different than default one, otherwise
// when importing component as ExpandedVoucherForm raised eslint error:
// > Using exported name 'ExpandedVoucherForm' as identifier for default export  import/no-named-as-default
export const Component = ({
  actions,
  currentUserId,
  service,
  onEnteredVoucherChange,
  intl
}) => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    return new Promise((resolve, reject) =>
      actions.validateVoucher({
        service,
        token,
        userId: currentUserId,
        resolve,
        reject
      })
    )
    .then(
      voucher => {
        onEnteredVoucherChange(voucher);
      },
      error => {
        actions.addAlertMessage({
          type: "error",
          message: {
            id: "CheckoutPage.VoucherForm.Error.invalid_token"
          }
        });
      }
    )
    .then(() => setIsSubmitting(false));
  };

  return (
    <form className={"coupon-form"}>
      <label htmlFor="coupon" style={{ display: "none" }}>
        <FormattedMessage id="CheckoutPage.VoucherForm.Label" />
      </label>
      <div>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          type="text"
          id="coupon"
          value={token}
          onChange={event => setToken(event.target.value)}
          placeholder={"Introduzca su codigo de referido"}
          data-cy="voucher input field"
        />
        <Button
          size="xs"
          type="button"
          onClick={handleSubmit}
          className="btn fs-btn"
          disabled={isSubmitting}
          data-cy="voucher submit button"
        >
          Aplicar
        </Button>
      </div>
    </form>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Component));
