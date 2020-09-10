import React, { useState } from "react";
import {Button, Modal,Form} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router";
import Rating from '@material-ui/lab/Rating';

import { $cancelActiveSubscription } from "../../../../modules/subscription/subscription";
import { createRenewalVoucher } from "../redux/vouchers/actions";

const CancelSubscription = ({show,handleClose,credit,history}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [step, setStep] = useState(0);
  const [just, setJust] = useState(false);
  const [qualityLevel, setQualityLevel] = useState(0);
  const [radioReason, setRadioReason] = useState('not_suit');
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
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return false;
    }else{
      let reasonText = null;
      if(form.elements.reasonText)reasonText = form.elements.reasonText.value;
      const recommendation = form.elements.recommendation.value;
      const enableEnd = "yes";
      dispatch($cancelActiveSubscription(qualityLevel,radioReason,reasonText,recommendation,enableEnd,credit));
      handleClose();
      return false;
    }
  };  
  const onTriggerCancelNow = ()=>{
    if(just)setJust(false);
    else setJust(true);
  }
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
        {step===0&&(
          <div >
            <h3 className='mb-2'>{firstName}, ¡No te vayas!</h3>
            <p>{firstName}, ¡Queremos que sigas teniendo una vida saludable!</p>
            <p>Por eso te ofrecemos un descuento vitalicio ¡del 10%!
              Además estaremos agregando módulos de nutrición,
              carrera y yoga que no te querrás perder.</p>
            <p>Esperamos que sigas perteneciendo a la gran familia Fitemos
              y podamos acompañarte en todos tus logros.</p>
          </div>
        )}
        {step===2&&(
          <div >
            <h3 className='mb-2'>{firstName}, ¡Aún puedes quedarte!</h3>
            <p>Tu suscripción expira el {currentUser.customer.services['1'].expired_date}. ¿Deseas cancelar y seguir
              recibiendo los entrenamientos?</p>
            <p>Si, quiero cancelar y continuar recibiendo los entrenamientos hasta que expire la suscripción</p>
            <Form.Group>
              <Form.Check type="radio" name="enableEnd" id="cancelRadio1" value={'no'} onChange={onTriggerCancelNow} checked={just} label="No quiero recibir más los entrenamientos"/>
              <Form.Check type="radio" name="enableEnd" id="cancelRadio2" value={'yes'} onChange={onTriggerCancelNow} checked={!just} label="Si, quiero cancelar y continuar recibiendo los entrenamientos hasta que expire la suscripción" />
            </Form.Group>
          </div>
        )}
        {step===1&&(
          <div >
            <p>
             {firstName}, gracias por confiar en nosotros. Antes de cancelar agradeceríamos que contestes estas tres preguntas (tarda menos de un minuto).
            </p>
            <Form noValidate validated={validated} onSubmit={handleSubmit} id="cancel-subscription-form">
              <Form.Group controlId="qualityLevel">
                <Form.Label as="legend">1. ¿Qué tal fue tu experiencia general en Fitemos?</Form.Label>
                <div>
                  <Rating name="qualityLevel" size="large" value={qualityLevel} onChange={(event, newValue) => { setQualityLevel(newValue); }}/>
                </div>
                <Form.Control.Feedback type="invalid">Por favor elija su calificación</Form.Control.Feedback>
              </Form.Group>     
              <fieldset>
                <Form.Group>
                  <Form.Label as="legend">
                    2. Si tuvieras que escoger una razón de cancelamiento, ¿cual sería?
                  </Form.Label>

                  <Form.Check
                    type="radio"
                    label="El método de entrenamientos no se ajusta a mi"
                    name="radioReason"
                    required
                    checked={radioReason === 'not_suit'}
                    onChange={(event) => { setRadioReason('not_suit'); }}
                    id="radioReason2"
                  />
                  <Form.Check
                    type="radio"
                    label="El producto / servicio no llena mis expectativas"
                    name="radioReason"
                    required
                    checked={radioReason === 'poor_quaulity'}
                    onChange={(event) => { setRadioReason('poor_quaulity'); }}
                    id="radioReason3"
                    feedback="You must agree before submitting."
                  />
                  <Form.Check
                    type="radio"
                    label="Muy costoso / no tengo tiempo"
                    name="radioReason"
                    required
                    checked={radioReason === 'expensive'}
                    onChange={(event) => { setRadioReason('expensive'); }}
                    id="radioReason4"
                    feedback="You must agree before submitting."
                  />
                  <Form.Check
                    type="radio"
                    label="Es bueno pero"
                    name="radioReason"
                    required
                    checked={radioReason === 'good'}
                    onChange={(event) => { setRadioReason('good'); }}
                    id="radioReason1"
                  />
                  {radioReason === 'good'&&(
                    <Form.Group controlId="reasonText">
                      <Form.Control as="input" name="reasonText" required placeholder="Escribe algo..."/>
                      <Form.Control.Feedback type="invalid">Por favor ingrese su razón</Form.Control.Feedback>
                    </Form.Group>                        
                  )}
                  <Form.Check
                    type="radio"
                    label="Otro"
                    name="radioReason"
                    required
                    checked={radioReason === 'other'}
                    onChange={(event) => { setRadioReason('other'); }}
                    id="radioReason5"
                    feedback="You must agree before submitting."
                  />
                  {radioReason === 'other'&&(
                    <Form.Group controlId="reasonText">
                      <Form.Control as="input" name="reasonText" required placeholder="Escribe algo..."/>
                      <Form.Control.Feedback type="invalid">Por favor ingrese su razón</Form.Control.Feedback>
                    </Form.Group>                        
                  )}
                </Form.Group>
              </fieldset>    
              <Form.Group controlId="reason">
                <Form.Label>3. ¿Si pudieras darnos una recomendación cuál sería?</Form.Label>
                <Form.Control as="textarea" name="recommendation" required rows="3" placeholder="Escribe algo..."/>
                <Form.Control.Feedback type="invalid">Por favor ingrese su recomendación</Form.Control.Feedback>
              </Form.Group>                        
            </Form>            
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {step===0&&(
          <>
            <button className="btn btn-subscription" onClick={()=>setStep(1)}>Finalizar suscripción</button>
            <Button variant="subscription-renewal" onClick={handleRenewal}  type="button">Tomar oferta 10%</Button>
          </>
        )}
        {step===1&&(
          <>
            <Button variant="subscription" form="cancel-subscription-form" type="submit">Finalizar suscripción</Button>
            <Button variant="subscription-renewal"  onClick={()=>setStep(0)} type="button">Regresar</Button>
          </>
        )}
        {step===2&&(
          <>
            <Button variant="subscription" form="cancel-subscription-form"  onClick={()=>setStep(2)}>Continuar</Button>
            <Button variant="subscription-renewal"  onClick={()=>setStep(0)} type="button">Regresar</Button>
          </>
        )}
      </Modal.Footer>        
    </Modal>
  );
}

export default withRouter(CancelSubscription);
