import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { $cancelActiveSubscription } from "../../../modules/subscription/subscription";
import { createRenewalVoucher } from "./redux/vouchers/actions";

const CancelSubscription = ({show,handleClose,credit,history}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [step, setStep] = useState(0);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const firstName = currentUser.customer.first_name;
  const handleRenewal = ( )=>{
    dispatch(createRenewalVoucher(history));
    //history.push('/checkout');
    //handleClose();
  }
  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return false;
    }else{
      const enableEnd = form.elements.enableEnd.value;
      const reason = form.elements.reason.value;
      dispatch($cancelActiveSubscription(enableEnd,reason,credit));
      handleClose();
      return false;
    }
  };  
  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      animation={false}
      className="subscriptions"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
        {step===0?(
          <>Finalizar suscripción</>
        ):(
          <>Plan de suscripción Fitness</>
        )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step===0?(
          <div >
            <h3 className='mb-2'>{firstName}, ¡No te vayas!</h3>
            <p>{firstName}, ¡Queremos que sigas teniendo una vida saludable!</p>
            <p>Por eso te ofrecemos un descuento vitalicio ¡del 10%!
              Además estaremos agregando módulos de nutrición,
              carrera y yoga que no te querrás perder.</p>
            <p>Esperamos que sigas perteneciendo a la gran familia Fitemos
              y podamos acompañarte en todos tus logros.</p>
          </div>
        ):(
          <div >
            <h3 className='mb-2'>{firstName}, ¡Aún puedes quedarte!</h3>
            <p>Tu suscripción expira el {currentUser.customer.services['1'].expired_date}. ¿Deseas cancelar y seguir
              recibiendo los entrenamientos?</p>
            <Form noValidate validated={validated} onSubmit={handleSubmit} id="cancel-subscription-form">
              <Form.Group>
                <Form.Check type="radio" name="enableEnd" id="cancelRadio1" value={'no'} label="No quiero recibir más los entrenamientos" />
                <Form.Check type="radio" name="enableEnd" id="cancelRadio2" value={'yes'} defaultChecked label="Si, quiero cancelar y continuar recibiendo los entrenamientos hasta que expire la suscripción" />
              </Form.Group>
              <p>
                Lamentamos mucho que hayas decidido abandonar a la
                comunidad Fitemos. Sería de gran ayuda poder escuchar la
                razón de la cancelación.
              </p>
              <Form.Group controlId="reason">
                <Form.Label>Cuéntanos el motivo:</Form.Label>
                <Form.Control as="textarea" name="reason" required rows="3" placeholder="Escribe algo..."/>
                <Form.Control.Feedback type="invalid">Por favor ingrese su razón</Form.Control.Feedback>
              </Form.Group>              
            </Form>            
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {step===0?(
          <>
            <a className="btn btn-subscription" onClick={()=>setStep(1)}>Finalizar suscripción</a>
            <Button variant="subscription-renewal" onClick={handleRenewal}  type="button">Tomar oferta 10%</Button>
          </>
        ):(
          <>
            <Button variant="subscription" form="cancel-subscription-form" type="submit">Finalizar suscripción</Button>
            <Button variant="subscription-renewal"  onClick={()=>setStep(0)} type="button">Regresar</Button>
          </>
        )}
      </Modal.Footer>        
    </Modal>
  );
}

export default withRouter(CancelSubscription);
