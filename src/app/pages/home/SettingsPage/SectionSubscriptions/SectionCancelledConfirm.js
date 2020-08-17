import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";

const CancelledConfirm = ({show,handleClose}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const firstName = currentUser.customer.first_name;
  const cancelled = useSelector(({ subscription }) => subscription.cancelled);
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
          CONFIRMACIÓN DE CANCELACIÓN
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div >
          <p>{firstName}, gracias por tu confianza.</p>
          {cancelled.just == "yes"&&(
            <>
              <p>Tu suscripción ha sido cancelada con éxito y no se volverán a hacer cobros adicionales.</p>
              <p>Tendrás el servicio disponible hasta ({cancelled.endDate}).</p>
            </>
          )}
          {cancelled.just == "no"&&(
            <p>Tu suscripción ha sido cancelada con éxito y no se volverán a hacer cobros adicionales.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="subscription-renewal" onClick={handleClose}  type="button">Cerrar</Button>
      </Modal.Footer>        
    </Modal>
  );
}

export default CancelledConfirm;
