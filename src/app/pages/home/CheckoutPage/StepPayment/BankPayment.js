
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormattedPrice from "../../components/FormattedPrice";
import Card from "../../components/Card";
import usePaymentInputs from "react-payment-inputs/es/usePaymentInputs";
import { withRouter } from "react-router";
import { NavLink, useHistory } from "react-router-dom";
import {start} from "../../redux/checkout/actions";
import { $fetchIndex } from "../../../../../modules/subscription/tocken";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const BankPayment = ({
  service,
  currency,
  pricing,
  selectedProduct,
  activeVoucher,
  referrer,
}) => {
  const frequency = useSelector(({service})=>service.frequency);
  const paymentType = useSelector(({service})=>service.type);
  const history = useHistory();
  const dispatch = useDispatch();
  // Set idempotency key, used to prevent submitting the payment form more
  // than once with the same data, when visiting the page. It's required by
  // backend to process the payment request. It's regenerated in saga, whenever
  // there's an error during payment, to allow submitting the form again.
  // PayPal JS library opens its payment flow in a popup, so we need to load it
  // upfront to make sure that the time from user's click on the submit button,
  // till the popup shows up is less than 2 seconds. Otherwise, some browser,
  // like e.g. Firefox, can block the popup.
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const goBackPricing = ()=>{
    dispatch(start());
    history.push('/pricing');
  }

  return (
    <>
      <h2 className="checkout-page-title d-none d-md-block">¡Tu membresía está lista!</h2>
      <div className="payment-card second">
        <p>Hola {currentUser.customer.first_name}, para activar tu membresía debes transferir:</p>
        <div>
          <span className="bank-amount">
            <FormattedPrice
              price={pricing.discountedPrices.total}
              currency={currency}
              locale="en"
            />
          </span>
          <span
            className="bank-redirect-pricing"
            onClick={goBackPricing}
          >
            Editar
          </span>
        </div>
        <hr />
        <h3 className="checkout-page-subtitle">Transferencia Bancaria</h3>
        <p className="mb-0">Banco General </p>
        <p className="mb-0">Fitemos Corp. </p>
        <p className="mb-0">Cuenta Corriente </p>
        <p className="mb-0">03-17-01-131135-6 </p>
        <p className="mb-0">hola@fitemos.com</p>
        <hr />
        <div>
          <div className="yappy-meta">
            <h3 className="checkout-page-subtitle">Yappy</h3> 
            <ul>
              <li><span className="normal">Ingresar a <span className="font-weight-bold">Yappy</span></span></li>
              <li><span className="normal">Hacer click en <span className="font-weight-bold">Enviar</span></span></li>
              <li><span className="normal">Ir al <span className="font-weight-bold">Directorio</span></span></li>
              <li><span className="normal">Buscar <span className="font-weight-bold">fitemoslatam</span></span></li>
              <li><span className="normal">O bien, <span className="font-weight-bold">escanear</span>:</span></li>
            </ul>
          </div>
          <div className="yappy-image">
            <img src={toAbsoluteUrl("/media/company-logos/yappy.png")} alt="Yappy" />
          </div>
        </div>
        <hr />
      </div>
      <Card className="payment-card second">
        <div className={"notes"}>
          <h3 className="checkout-page-subtitle">Notas</h3>
          <p>La activación es un proceso manual y puede tardar unas horas. Se te notificará inmediatamente 
          al correo electrónico una vez la membresía esté activa.</p>
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
      </Card>
    </>      
  );
};

export default BankPayment;
