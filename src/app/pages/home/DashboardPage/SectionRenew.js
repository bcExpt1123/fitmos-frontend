import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const SectionRenew = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
    <Card className="renew">
      <Card.Body>
        <h4  style={{fontSize:'18px'}} className="text-center mb-2">{currentUser.customer.first_name}, tu suscripción ha caducado</h4>
        <p style={{width:'80%'}}>
          Para seguir entrenando con Fitemos, renueva tu suscripción fácilmente.
        </p>
        <h5 className='service'>Plan Fitness</h5>
        <NavLink
            to="/pricing"
            className={"btn btn-renewal pull-right"}
            exact
          >
          Renovar
        </NavLink>        
      </Card.Body>
    </Card>
  );
};

export default SectionRenew;
