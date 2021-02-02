import React from "react";
import { useDispatch } from "react-redux";
import {Button} from "react-bootstrap";
import {Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import usePaymentInputs from "react-payment-inputs/es/usePaymentInputs";
import CreditCardForm from "../../CheckoutPage/StepPayment/CreditCardForm";
import Spinner from "../../components/Spinner";
import { $saveItem } from "../../../../../modules/subscription/tocken";
const PAYMENT_INPUTS_ERROR_MESSAGES = {
  emptyCardNumber: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.emptyCardNumber"
  },
  invalidCardNumber: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.invalidCardNumber"
  },
  emptyExpiryDate: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.emptyExpiryDate"
  },
  monthOutOfRange: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.monthOutOfRange"
  },
  yearOutOfRange: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.yearOutOfRange"
  },
  dateOutOfRange: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.dateOutOfRange"
  },
  invalidExpiryDate: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.invalidExpiryDate"
  },
  emptyCVC: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.emptyCVC"
  },
  invalidCVC: {
    id: "CheckoutPage.StepPayment.CreditCardForm.Error.invalidCVC"
  }
};

const validateNmiCreditCardForm = ({ values }) => {
  const errors = {};

  if (!values.creditCard.holder) {
    errors.holder = {
      id: "CheckoutPage.StepPayment.CreditCardForm.Error.emptyCardHolder"
    };
  }

  return errors;
};

const SectionCreditCard = ({show,handleClose}) => {
  const handleHide = ()=>{
    handleClose();
  }
  const dispatch = useDispatch();
  const creditCardInitialValues = {
    number: "",
    exp: "",
    holder: "",
    cvc: "",
    zipCode: ""
  };
  const initialValues = {
    creditCard: creditCardInitialValues
  };  
  const paymentInputs = usePaymentInputs({
    errorMessages: PAYMENT_INPUTS_ERROR_MESSAGES
  });
  const isSaving = false;
  const validate = values => {
    // Make sure to return empty errors object, if there are no errors.
    // Otherwise Formik#isvalid will return incorrect value.
    const errors = {};

    const { meta } = paymentInputs;
    const creditCardErrors = validateNmiCreditCardForm({
      values,
      erroredInputs: meta.erroredInputs
    });
    const nmiErrors = {}; /*validateNmiPersonalInfoForm({
                values,
                countryCode,
            });*/

    if (Object.keys(creditCardErrors).length) {
      errors.creditCard = creditCardErrors;
    }

    if (Object.keys(nmiErrors).length) {
      errors.nmi = nmiErrors;
    }


    return errors;
  };
  const onSubmit = (values, { setErrors }) => {
    dispatch($saveItem({
      creditCard: {
        ...values.creditCard,
        number: values.creditCard.number.replace(/\s+/g, "")
      },
      setErrors
    }));
    handleClose();
  };

  return (
    <Modal
      size="md"
      show={show}
      dialogClassName="renewal-subscription"
      onHide={handleHide}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Renovación de membresía
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          isInitialValid={false}
          render={({ isValid, errors, touched, values }) => (
            <Form noValidate>
              <CreditCardForm
                errors={errors}
                touched={touched}
                values={values}
                paymentInputs={paymentInputs}
              />
              <Button
                type="submit"
                block
                disabled={
                  // all providers - disable button while processing payment
                  !Boolean(values.creditCard.holder) || !Boolean(values.creditCard.number) || !Boolean(values.creditCard.exp) || !Boolean(values.creditCard.cvc) || !Boolean(values.creditCard.cvc.length>2)
                }
                data-cy="submit button"
                className="fs-btn"
              >
                {isSaving ? (
                  <Spinner />
                ) : (
                    <>
                      Guardar
                    </>
                  )}
              </Button>
            </Form>
          )}
        />
      </Modal.Body>
    </Modal>
  );
}

export default SectionCreditCard;
