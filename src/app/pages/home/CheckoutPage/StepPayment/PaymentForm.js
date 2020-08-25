import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl} from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import usePaymentInputs from "react-payment-inputs/es/usePaymentInputs";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";

import Button from "../../components/Button";
import Card from "../../components/Card";
import FormattedPrice from "../../components/FormattedPrice";
import Spinner from "../../components/Spinner";
import { PaypalButton } from "../../components/PaymentButton";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import CreditCardForm from "./CreditCardForm";
//import CreditCardLogo from './CreditCardLogo';
//import { usePayPal } from './usePayPal';

import {
  payWithPayPal,
  payWithNmi,
  setIdempotencyKey,
  changePaymentProvider,
  paymentRequested,
  canceledPayPal,
  errorPayPal
} from "../../redux/checkout/actions";
import { $fetchIndex, } from "../../../../../modules/subscription/tocken";
import { uuidv4 } from "../../../../../lib/uuidv4";
import { PAYMENT_PROVIDER } from "../../constants/payment-provider";

const paypalImgUrl = require("../../assets/img/paypal-sm.png");

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

const mapStateToProps = state => ({
  countryCode: state.countryCode,
  frequency: state.service.frequency,
  isProcessingPayment: state.checkout.isProcessingPayment,
  paymentTestMode: state.checkout.paymentTestMode,
  paypalInfo: state.checkout.paypal
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      payWithPayPal,
      payWithNmi,
      setIdempotencyKey,
      changePaymentProvider,
      paymentRequested,
      canceledPayPal,
      errorPayPal
    },
    dispatch
  )
});

const PaymentForm = ({
  actions,
  service,
  frequency,
  currency,
  isProcessingPayment,
  pricing,
  selectedProduct,
  activeVoucher,
  referrer,
  paymentTestMode,
  paypalInfo,
  history
}) => {
  const checkoutKind = useSelector(({checkout})=>checkout.checkoutKind);
  // Set idempotency key, used to prevent submitting the payment form more
  // than once with the same data, when visiting the page. It's required by
  // backend to process the payment request. It's regenerated in saga, whenever
  // there's an error during payment, to allow submitting the form again.
  // PayPal JS library opens its payment flow in a popup, so we need to load it
  // upfront to make sure that the time from user's click on the submit button,
  // till the popup shows up is less than 2 seconds. Otherwise, some browser,
  // like e.g. Firefox, can block the popup.
  //const payPal = true; //usePayPal();
  const dispatch = useDispatch();
  useEffect(() => {
    actions.setIdempotencyKey({ idempotencyKey: uuidv4() });
    actions.changePaymentProvider(PAYMENT_PROVIDER.NMI);
    dispatch($fetchIndex());
    setClicked(true);
  }, [actions]);// eslint-disable-line react-hooks/exhaustive-deps
  const canUsePaypal = false;//PAYPAL_CURRENCIES.includes(currency.code);
  const canUseNmi = true; //NMI_COUNTRIES.includes(countryCode);
  const creditCardProvider = PAYMENT_PROVIDER.NMI;
  const cards = useSelector(({ tocken }) => tocken.items);
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
  const {
    REACT_APP_PAYPAL_SANDBOX_CLIENT_ID,
    REACT_APP_PAYPAL_CLIENT_ID
  } = process.env;
  if (paymentTestMode) clientId = REACT_APP_PAYPAL_SANDBOX_CLIENT_ID;
  else clientId = REACT_APP_PAYPAL_CLIENT_ID;

  const onSubmit = (values, { setErrors }) => {
    console.log('submit')
    switch (selectedPaymentProvider) {
      case PAYMENT_PROVIDER.NMI:
        actions.payWithNmi({
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
        });
        break;
      case PAYMENT_PROVIDER.PAYPAL:
        /*actions.payWithPayPal({
                    service,
                    checkoutKind,
                    selectedProduct,
                    activeVoucher,
                    pricing,
                    referrer,
                });*/
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
                  actions.changePaymentProvider(creditCardProvider);
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

            {canUsePaypal && (
              <fieldset className={"expandable"} data-cy="paypal-radio-button">
                <input
                  className={"expandableToggle"}
                  id="paypal-radio-button"
                  name="paymentOption"
                  type="radio"
                  value="paypal"
                  checked={selectedPaymentProvider === PAYMENT_PROVIDER.PAYPAL}
                  onChange={() => {
                    setSelectedPaymentProvider(PAYMENT_PROVIDER.PAYPAL);
                    actions.changePaymentProvider(PAYMENT_PROVIDER.PAYPAL);
                  }}
                />
                <label
                  className={"expandableHeader"}
                  htmlFor="paypal-radio-button"
                >
                  Paypal
                  <img src={paypalImgUrl} alt="PayPal" />
                </label>
              </fieldset>
            )}
          </Card>

          <Card className="payment-card second">
            <div className={"notes mt-4"}>
              <p>
                La suscripción se renovará automáticamente una vez transcurrido
                el término del plan. Usted podrá cancelar la misma en cualquier
                momento, libre de cargos.
              </p>
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

            {selectedPaymentProvider === PAYMENT_PROVIDER.NMI ? (
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
            ) : (
              <>
                <span className="hidden">
                  PAGAR AHORA -{" "}
                  <FormattedPrice
                    price={pricing.discountedPrices.total}
                    currency={currency}
                    locale="en"
                  />{" "}
                  / {frequency} {frequency > 1 ? <>MESES</> : <>MES</>}
                </span>
                <PaypalButton
                  createSubscription={(data, paypalActions) => {
                    actions.paymentRequested();
                    let paypalData;
                    if(paypalInfo.startTime){
                      const startTime = new Date(paypalInfo.startTime);
                      const today = new Date();
                      let startDateTime;
                      if (today > startTime) {
                        startTime.setTime(today.getTime() + 30 * 60 * 1000);
                        startDateTime = startTime.toISOString();
                      } else {
                        startDateTime = paypalInfo.startTime;
                      }
                      paypalData = {
                        plan_id: paypalInfo.planId,
                        start_time: startDateTime
                      }
                    }else{
                      paypalData = {
                        plan_id: paypalInfo.planId
                      }
                    }
                    return paypalActions.subscription.create(paypalData);
                  }}
                  onApprove={(data, paypalActions) => {
                    actions.payWithPayPal({data, history});
                  }}
                  onCancel={data => {
                    // Show a cancel page, or return to cart
                    actions.canceledPayPal();
                  }}
                  onError={err => {
                    // Show an error page here, when an error occurs
                    console.log(err);
                    actions.errorPayPal(err);
                  }}
                  options={{
                    clientId: clientId,
                    disableFunding: "credit,card",
                    vault: true
                  }}
                  style={{
                    color: "blue"
                  }}
                />
              </>
            )}
          </Card>
        </Form>
      )}
    </Formik>  
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(PaymentForm)));
