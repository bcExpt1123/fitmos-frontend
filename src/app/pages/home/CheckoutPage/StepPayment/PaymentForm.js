import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl} from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import usePaymentInputs from "react-payment-inputs/es/usePaymentInputs";
import { withRouter } from "react-router";
import { NavLink, useHistory } from "react-router-dom";

import Button from "../../components/Button";
import Card from "../../components/Card";
import FormattedPrice from "../../components/FormattedPrice";
import Spinner from "../../components/Spinner";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import CreditCardForm from "./CreditCardForm";
//import CreditCardLogo from './CreditCardLogo';
//import { usePayPal } from './usePayPal';

import {
  payWithNmi,
  setIdempotencyKey,
  changePaymentProvider,
  paymentRequested,
} from "../../redux/checkout/actions";
import { $fetchIndex } from "../../../../../modules/subscription/tocken";
import { uuidv4 } from "../../../../../lib/uuidv4";
import { PAYMENT_PROVIDER } from "../../constants/payment-provider";

const BRANDS = {};
// These need to be defined outside of the component. Otherwise, it will cause infinite render loop.
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

// Used in nmi
const creditCardInitialValues = {
  number: "",
  exp: "",
  holder: "",
  cvc: "",
  zipCode: ""
};

const PaymentForm = ({
  service,
  currency,
  pricing,
  selectedProduct,
  activeVoucher,
  referrer,
}) => {
  const frequency = useSelector(({service})=>service.frequency);
  const isProcessingPayment = useSelector(({checkout})=>checkout.isProcessingPayment);
  const paymentType = useSelector(({service})=>service.type);
  const paymentTestMode = useSelector(({checkout})=>checkout.paymentTestMode);
  const history = useHistory();
  const actions = {
    payWithNmi,
    setIdempotencyKey,
    changePaymentProvider,
    paymentRequested,
  }
  const checkoutKind = useSelector(({checkout})=>checkout.checkoutKind);
  // Set idempotency key, used to prevent submitting the payment form more
  // than once with the same data, when visiting the page. It's required by
  // backend to process the payment request. It's regenerated in saga, whenever
  // there's an error during payment, to allow submitting the form again.
  // PayPal JS library opens its payment flow in a popup, so we need to load it
  // upfront to make sure that the time from user's click on the submit button,
  // till the popup shows up is less than 2 seconds. Otherwise, some browser,
  // like e.g. Firefox, can block the popup.
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.setIdempotencyKey({ idempotencyKey: uuidv4() }));
    dispatch(actions.changePaymentProvider(PAYMENT_PROVIDER.NMI));
    dispatch($fetchIndex());
    setClicked(true);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const canUseNmi = true; //NMI_COUNTRIES.includes(countryCode);
  const creditCardProvider = PAYMENT_PROVIDER.NMI;
  const cards = useSelector(({ tocken }) => tocken.items);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const initialValues = {
    creditCard: creditCardInitialValues,
    nmiPaymentToken:''
  };  
  const [clicked, setClicked] = useState(false);
  const ref = useRef();
  if(cards&&cards.length>0 && clicked){
    setTimeout(()=>{
      if(ref.current)ref.current.click();
      setClicked(false);
    },10);
  }
  //
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(
    creditCardProvider
  );
  const paymentInputs = usePaymentInputs({
    errorMessages: PAYMENT_INPUTS_ERROR_MESSAGES
  });
  const theme = service === BRANDS.NUTRITION ? "nutrition" : "training";
  let clientId;

  const onSubmit = (values, { setErrors }) => {
    console.log('submit')
    switch (selectedPaymentProvider) {
      case PAYMENT_PROVIDER.NMI:
        dispatch(actions.payWithNmi({
          checkoutKind,
          creditCard: {
            ...values.creditCard,
            number: values.creditCard.number.replace(/\s+/g, "")
          },
          nmiPaymentToken:values.nmiPaymentToken,
          selectedProduct,
          activeVoucher,
          frequency,
          setErrors,
          history
        }));
        break;
      case PAYMENT_PROVIDER.BANK:
        break;
      default:
        break;
    }
  };

  const validate = values => {
    // Make sure to return empty errors object, if there are no errors.
    // Otherwise Formik#isvalid will return incorrect value.
    const errors = {};
    switch (selectedPaymentProvider) {
      case PAYMENT_PROVIDER.NMI: {
        const { meta } = paymentInputs;
        const creditCardErrors = validateNmiCreditCardForm({
          values,
          erroredInputs: meta.erroredInputs
        });
        const nmiErrors = {}; /*validateNmiPersonalInfoForm({
                    values,
                    countryCode,
                });*/
        if(values.nmiPaymentToken === '' || values.nmiPaymentToken === 'new'){
          if (Object.keys(creditCardErrors).length) {
            errors.creditCard = creditCardErrors;
          }
        }

        if (Object.keys(nmiErrors).length) {
          errors.nmi = nmiErrors;
        }

        break;
      }
      default:
        break;
    }
    return errors;
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >  
      {({ isValid, errors, touched, values,setFieldValue }) => (
        <Form noValidate>
          <Card noMarginBottom className="payment-card">
            <fieldset
              className={"expandable"}
              data-cy="credit-card-radio-button"
            >
              <input
                className={"expandableToggle"}
                id="credit-card-radio-button"
                type="radio"
                name="paymentOption"
                value="creditCard"
                checked={selectedPaymentProvider === creditCardProvider}
                onChange={() => {
                  setSelectedPaymentProvider(creditCardProvider);
                  dispatch(actions.changePaymentProvider(creditCardProvider));
                }}
              />
              <label
                className={"expandableHeader"}
                htmlFor="credit-card-radio-button"
              >
                Tarjeta de crédito o débito
              </label>

              <section className={"expandableContainer"}>
                {canUseNmi && ((cards && cards.length>0)?(
                  <>
                    <NavLink
                      to="/settings/payments"
                      className={"btn btn-payment-methods"}
                      exact
                    >
                      Métodos de Pago
                    </NavLink>
                    {cards.map((card,index)=>
                      <div key={card.id}>
                        {index===0?(
                          <>
                            <input
                              className={"expandableTokenToggle"}
                              id={`credit-card-token-radio-button${card.id}`}
                              type="radio"
                              ref={ref}
                              name="nmiSavedCard"
                              value={card.id}
                              checked={values.nmiPaymentToken!==''&&values.nmiPaymentToken === card.id}
                              onChange={() => {
                                setFieldValue('nmiPaymentToken',card.id);
                              }}          
                            />
                            <label
                              className={"expandableCardHeader"}
                              htmlFor={`credit-card-token-radio-button${card.id}`}
                            >
                              {card.holder} 
                              <img src={toAbsoluteUrl(`/media/cards/${card.type}.png`)} alt="card-type-alt"/>
                              &#9679;&#9679;&#9679;{card.last4} {card.expiry_month+'/'+card.expiry_year}
                            </label>
                          </>
                        ):(
                          <>
                            <input
                              className={"expandableTokenToggle"}
                              id={`credit-card-token-radio-button${card.id}`}
                              type="radio"
                              name="nmiSavedCard"
                              value={card.id}
                              checked={values.nmiPaymentToken !== '' && values.nmiPaymentToken === card.id}
                              onChange={() => {
                                console.log("nmi payment")
                                setFieldValue('nmiPaymentToken',card.id);
                              }}          
                            />
                            <label
                              className={"expandableCardHeader"}
                              htmlFor={`credit-card-token-radio-button${card.id}`}
                            >
                              {card.holder} 
                              <img src={toAbsoluteUrl(`/media/cards/${card.type}.png`)} alt="card-type-alt"/>
                              &#9679;&#9679;&#9679;{card.last4} {card.expiry_month+'/'+card.expiry_year}
                            </label>
                          </>
                        )}

                      </div>
                    )}
                    <div>
                      <input
                        className={"expandableTokenToggle"}
                        id={`credit-card-token-radio-button`}
                        type="radio"
                        name="nmiSavedCard"
                        value="new"
                        checked={values.nmiPaymentToken === 'new'}
                        onChange={() => {
                          setFieldValue('nmiPaymentToken','new');
                        }}          
                      />
                      <label
                        className={"expandableCardHeader"}
                        htmlFor={`credit-card-token-radio-button`}
                      >
                        Use a new Card
                      </label>
                      {values['nmiPaymentToken'] === 'new' &&(
                        <CreditCardForm
                          errors={errors}
                          touched={touched}
                          values={values}
                          paymentInputs={paymentInputs}
                        />
                      )}
                  </div>
                </>
            ):(
                  <CreditCardForm
                    errors={errors}
                    touched={touched}
                    values={values}
                    paymentInputs={paymentInputs}
                  />
                )
                  
                )}
              </section>
            </fieldset>

          </Card>

          <Card className="payment-card second">
            <div className={"notes mt-4"}>
              {paymentType!=='bank'&&
                <p>
                  La suscripción se renovará automáticamente una vez transcurrido
                  el término del plan. Usted podrá cancelar la misma en cualquier
                  momento, libre de cargos.
                </p>
              }
              <p>
                Al suscribirse estará aceptando nuestros &nbsp;
                  <a
                    href="/#terms_and_condition"
                    className={""}
                    target='_blank'
                  >
                    términos y condiciones
                  </a>
                &nbsp;y&nbsp;
                  <a
                    href="/#privacy"
                    className={""}
                    target='_blank'
                  >
                    políticas de privacidad
                  </a>
                .&nbsp;
              </p>
            </div>

            {paymentType!=='bank' && selectedPaymentProvider === PAYMENT_PROVIDER.NMI && (
              <Button
                theme={theme}
                type="submit"
                block
                disabled={
                  // all providers - disable button while processing payment
                  isProcessingPayment ||
                  // Nmi - disable button if Nmi credit card and/or personal info fields are invalid
                  /*eslint-disable no-mixed-operators*/
                  (selectedPaymentProvider === PAYMENT_PROVIDER.NMI && 
                    ((!Boolean(values.creditCard.holder) || !Boolean(values.creditCard.number) || !Boolean(values.creditCard.exp) || !Boolean(values.creditCard.cvc) || !Boolean(values.creditCard.cvc.length>2)) && (cards && cards.length>0)===false || 
                    (cards && cards.length>0)&&(values.nmiPaymentToken==='new' && (!Boolean(values.creditCard.holder) || !Boolean(values.creditCard.number) || !Boolean(values.creditCard.exp) || !Boolean(values.creditCard.cvc) || !Boolean(values.creditCard.cvc.length>2)))))
                }
                data-cy="submit button"
                className="fs-btn"
              >
                {isProcessingPayment ? (
                  <Spinner />
                ) : (
                  <>
                    <span>AFILIARSE</span>
                    <span style={{display:'none'}}>
                      PAGAR AHORA -{" "}
                      <FormattedPrice
                        price={pricing.discountedPrices.total}
                        currency={currency}
                        locale="en"
                      />{" "}
                      / {frequency} {frequency > 1 ? <>MESES</> : <>MES</>}
                    </span>
                  </>
                )}
              </Button>
            )} 
          </Card>
        </Form>
      )}
    </Formik>  
  );
};

export default PaymentForm;
