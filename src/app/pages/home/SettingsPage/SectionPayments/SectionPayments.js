import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import usePaymentInputs from "react-payment-inputs/es/usePaymentInputs";
import {Table} from "react-bootstrap";
import {Modal } from "react-bootstrap";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import CreditCardForm from "../../CheckoutPage/StepPayment/CreditCardForm";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import SectionCancelSubscription from "../../sections/SectionCancelSubscription";
import { $fetchIndex, $changeItem,$saveItem,$showFormAction,$closeFormAction,$delete } from "../../../../../modules/subscription/tocken";

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


const SectionPayments = () => {
  const dispatch = useDispatch();
  const items = useSelector(({ tocken }) => tocken.items);
  useEffect(() => {
    dispatch($fetchIndex());
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const item = useSelector(({ tocken }) => tocken.item);
  const isSaving = useSelector(({ tocken }) => tocken.isSaving);
  const showForm = useSelector(({ tocken }) => tocken.showForm);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => {setShowCancel(true);setShow(false)}
  const handleCloseForm = () => {
    dispatch($closeFormAction());
  }
  const handleCloseWarningForm = ()=>{
    setShow(false);
  }
  const creditCardInitialValues = {
    number: "",
    exp: item?`${item.expiry_month}`:"",
    holder: item?item.holder:"",
    cvc: "",
    zipCode: ""
  };
  const initialValues = {
    creditCard: creditCardInitialValues
  };  
  const handleShowForm = (id) => {
    setShow(false);
    dispatch($changeItem(id));
    dispatch($showFormAction());
  }
  const handleDelete = (id) => {
    if(items.length === 1 && currentUser.has_active_workout_subscription && currentUser.customer.services['1'].end_date === null){
      setShow(true);
    }else if(window.confirm('¿Estás segura de eliminar esta tarjeta de crédito?')){
      dispatch($delete(id));
    }
  }
  const paymentInputs = usePaymentInputs({
    errorMessages: PAYMENT_INPUTS_ERROR_MESSAGES
  });
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
  };
  return (
    <>
      {(items && items.length > 0) ? (
        <div className="payment-methods">
          <Table responsive className='methods'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Número de tarjeta</th>
                <th>Expiración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((card) =>
                <tr key={card.id}>
                <td>{card.holder}</td>
                <td>
                  <img src={toAbsoluteUrl(`/media/cards/${card.type}.png`)} alt="credit card type" />
                  &#9679;&#9679;&#9679;{card.last4}</td>
                <td>{card.expiry_month+'/'+card.expiry_year}</td>
                <td>
                  <button onClick={(event) => handleShowForm(card.id)}>Editar</button>
                  <button onClick={(event) => handleDelete(card.id)}>Eliminar</button>
                </td>
              </tr>
              )}
            </tbody>
          </Table>

        </div>
      ) : (
          <div className="payment-methods">
            No existen métodos de pagos afiliados a tu perfil
          </div>
        )}
      <button className="add-payment-method fs-btn" onClick={(event) => handleShowForm('new')}>Agregar método de pago</button>
      <Modal
        size="lg"
        dialogClassName="payment-method-form"
        show={showForm}
        onHide={handleCloseForm}
        animation={false}
        className="edit-credit-card"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            {(item && item.id) ? (
              <>{item.holder}</>
            ) : (
                <>Agregar Método de Pago</>
              )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            isInitialValid={false}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors
              }) => (
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
                    isSaving
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
           </Formik>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        dialogClassName="warning-form"
        show={show}
        onHide={handleCloseWarningForm}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Aviso Importante
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Para retirar el único método de pago, usted debe:</b>
          <ul>
            <li>Ingresar uno nuevo antes de retirar el existente.</li>
            <li>Cancelar la renovación y luego retirar el único método de pago.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-subscription" onClick={()=>handleShowForm('new')}>Nuevo método de Pago</button>
          <button className="btn btn-subscription-renewal" onClick={handleShowCancel}  type="button">Cancelar la suscripción</button>
        </Modal.Footer>        
      </Modal>
      <SectionCancelSubscription  handleClose={handleCloseCancel} show={showCancel} credit={true}/>
    </>
  );
};

export default SectionPayments;
