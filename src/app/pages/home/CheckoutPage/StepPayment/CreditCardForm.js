import React, { useState,useEffect } from "react";
import { Field } from "formik";
import { injectIntl } from "react-intl";
import get from "lodash/get";

import Icon from "../../components/Icon";
import FormGroup from "../FormGroup";
import ReactTooltip from "react-tooltip";

const CreditCardForm = ({ intl, errors, touched, values, paymentInputs }) => {
  const [focused, setFocused] = useState({});
  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };
  return (
    <div
      className={"credit-card-form auth-form  mt-3 pt-2"}
      data-cy="credit card form"
    >
      <FormGroup
        hasValue={Boolean(values.creditCard.holder)}
        id="cc-name"
        className={"credit-card-holder mr-3 ml-3"}
        label={intl.formatMessage({
          id: "CheckoutPage.StepPayment.CreditCardForm.Name.Label"
        })}
        focused={focused["creditCard.holder"]}
        touched={touched.creditCard && touched.creditCard.holder}
        valid={Boolean(values.creditCard.holder)}
      >
        <Field
          id="cc-name"
          name="creditCard.holder"
          placeholder={intl.formatMessage({
            id: "CheckoutPage.StepPayment.CreditCardForm.Name.Placeholder"
          })}
          autoComplete="cc-name"
          required
          onFocus={handleFocus}
        />
      </FormGroup>
      <FormGroup
        hasValue={Boolean(values.creditCard.number)}
        id="cc-number"
        className={"credit-card-number  mr-3 ml-3"}
        label={intl.formatMessage({
          id: "CheckoutPage.StepPayment.CreditCardForm.Number.Label"
        })}
        focused={focused["creditCard.number"]}
        touched={touched.creditCard && touched.creditCard.number}
        valid={Boolean(
          values.creditCard.number && !get(errors, "creditCard.number")
        )}
      >
        <Field name="creditCard.number">
          {({ field }) => (
            <input
              {...paymentInputs.getCardNumberProps({
                id: "cc-number",
                name: field.name,
                onBlur: field.onBlur,
                onChange: field.onChange,
                placeholder: "**** **** **** ****",
                required: true
              })}
              maxLength={[19, 'no puedes ingresar más de 16 números.']} 
              onFocus={handleFocus}
            />
          )}
        </Field>

        {Boolean(
          values.creditCard.number && !get(errors, "creditCard.number")
        ) && (
          <Icon name="checkmark" className={"credit-card-number-check-icon"} />
        )}
      </FormGroup>

      <FormGroup
        hasValue={Boolean(values.creditCard.exp)}
        id="cc-exp"
        className={"credit-card-exp  mr-3 ml-4"}
        label={intl.formatMessage({
          id: "CheckoutPage.StepPayment.CreditCardForm.ExpirationDate.Label"
        })}
        focused={focused["creditCard.exp"]}
        touched={touched.creditCard && touched.creditCard.exp}
        valid={Boolean(values.creditCard.exp && !get(errors, "creditCard.exp"))}
      >
        <Field name="creditCard.exp">
          {({ field }) => (
            <input
              {...paymentInputs.getExpiryDateProps({
                id: "cc-exp",
                name: field.name,
                onBlur: field.onBlur,
                onChange: field.onChange,
                placeholder: intl.formatMessage({
                  id:
                    "CheckoutPage.StepPayment.CreditCardForm.ExpirationDate.Placeholder"
                }),
                required: true
              })}
              onFocus={handleFocus}
            />
          )}
        </Field>
      </FormGroup>

      <FormGroup
        hasValue={Boolean(values.creditCard.cvc)}
        id="cc-csc"
        className={"credit-card-cvc  mr-3 ml-3"}
        label={intl.formatMessage({
          id: "CheckoutPage.StepPayment.CreditCardForm.CVC.Label"
        })}
        focused={focused["creditCard.cvc"]}
        touched={touched.creditCard && touched.creditCard.cvc}
        valid={Boolean(values.creditCard.cvc && !get(errors, "creditCard.cvc"))}
      >
        <Field name="creditCard.cvc">
          {({ field }) => (
            <input
              {...paymentInputs.getCVCProps({
                id: "cc-csc",
                name: field.name,
                onBlur: field.onBlur,
                onChange: field.onChange,
                placeholder: intl.formatMessage({
                  id: "CheckoutPage.StepPayment.CreditCardForm.CVC.Placeholder"
                }),
                required: true
              })}
              onFocus={handleFocus}
              maxLength={[3, 'no puedes ingresar más de 3 números.']} 
            />
          )}
        </Field>
      </FormGroup>
      <span className="question-help" data-place='bottom' data-tip data-for="tooltip-cvc-bottom">?</span>
      <ReactTooltip id={`tooltip-cvc-bottom`} backgroundColor="#e4e4e4" arrowColor="#e4e4e4">
        <img src={require("../../assets/img/cvc-sm.png")} alt="cvc" />
      </ReactTooltip>
    </div>
  );
};

export default injectIntl(CreditCardForm);
