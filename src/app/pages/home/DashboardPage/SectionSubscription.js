import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import SectionNextLevel from "./SectionNextLevel";
import SectionChangeLevel from "./SectionChangeLevel";
import SectionChangeGoal from "./SectionChangeGoal";
import SectionRenewal from "./SectionRenewal";
import { http } from "../services/api";
import { updateCustomerAttribute as updateWeightsAction } from "../redux/auth/actions";
import { $resetPublished } from "../../../../modules/subscription/benchmark";

const Subscription = ({ currentUser, updateWeightsAction }) => {
  const [showNext, setShowNext] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [showChangeGoal, setShowChangeGoal] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);

  const dispatch = useDispatch();

  const handleCloseNext = () => setShowNext(false);
  const handleShowNext = () => setShowNext(true);
  const handleCloseChange = () => setShowChange(false);
  const handleShowChange = () => setShowChange(true);
  const handleCloseChangeGoal = () => setShowChangeGoal(false);
  const handleShowChangeGoal = () => setShowChangeGoal(true);
  const handleShowRenewal = () => setShowRenewal(true);
  const handleCloseRenewal = () => setShowRenewal(false);
  const findObjective = (objective) => {
    let label;
    if (objective == 'auto') {
      if (currentUser.customer.imc >= 25) objective = 'cardio';
      else if (currentUser.customer.imc <= 18.5) objective = 'strong';
      else objective = 'fit';
    }
    switch (objective) {
      case 'cardio':
        label = 'Perder peso';
        break;
      case 'fit':
        label = 'Ponerte en forma';
        break;
      case 'strong':
        label = currentUser.customer.gender == "Male"
          ? "Ganar musculatura" : "Tonificar"
        break;
    }
    return label;
  }
  const renderSubscriptionStatus = (subscription) => {
    if (subscription.status) {
      switch (subscription.status) {
        case 'Expired':
          return (
            <div style={{ color: "#c32121", fontWeight: 500 }}>
              {subscription.nmi_product_id?(
                <>Renovará</>
              ):(
                <>Expirado</>
              )}
            </div>
          );
          break;
        case 'Cancelled':
          return (
            <div style={{ color: "#c32121", fontWeight: 500 }}>
              Cancelado
            </div>
          )
          break;
        case 'Active':
          if (currentUser.customer.services[1].expire_at && currentUser.customer.services[1].expire_at > 0) {
            return (
              <div>Expira en {currentUser.customer.services[1].expire_at} dias</div>
            )
          }
          if(currentUser.customer.services[1].expired_date){
            return (
              <div>Expira el {currentUser.customer.services[1].expired_date}</div>
            )
          }
          break;
      }
      return (
        <div style={{ color: "transparent" }}>
          Nothing
        </div>
      )
    }
    return (
      <div style={{ color: "#c32121", fontWeight: 500 }}>
        Sin subscripción
      </div>
    )
  }
  const handleClick = async event => {
    if (window.confirm("Por favor confirmar para hacer el cambio.")) {
      const weights = currentUser.customer.weights=='con pesas'?'sin pesas':'con pesas';
      const res = await http({
        method: "POST",
        app: "user",
        path: "customers/changeWeights",
        data: {
          weights: weights
        }
      });
      updateWeightsAction({ attribute: "weights", value: weights });
      dispatch($resetPublished());
    }
  };
  return (
    <>
      <Card className="profile">
        <Card.Header>
          <Card.Title>Suscripción</Card.Title>
        </Card.Header>
        <Card.Body>
          {currentUser && currentUser.customer && currentUser.customer.services && (
            <>
              <Row>
                <Col xs={12} md={6}>
                  <div className="sub-body">
                    <Card.Title>{currentUser.customer.services[1].serviceName}</Card.Title>
                    {
                      renderSubscriptionStatus(currentUser.customer.services[1])
                    }
                    {currentUser.has_active_workout_subscription && currentUser.customer.services[1].paid?(
                      <button className={"btn btn-alink"} onClick={handleShowRenewal}>
                        Actualizar
                      </button>
                    ):(
                    <NavLink
                      to={'/pricing'}
                      className={"btn btn-alink"}
                      exact
                    >
                      Actualizar
                    </NavLink>
                  )}
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="sub-body">
                    <Card.Title>
                      Nivel Físico {currentUser.customer.current_condition}
                    </Card.Title>
                    <br />
                    <Button
                      variant="alink"
                      onClick={handleShowNext}
                    >
                      Actualizar
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <div className="sub-body">
                    <div className="sub-head">Objetivo</div>
                    <Card.Title>
                      {findObjective(currentUser.customer.objective)}
                    </Card.Title>
                    {currentUser.customer.objective == "auto" ? (
                      <div>Recomendado segun IMC</div>
                    ) : (
                        <div style={{ color: "transparent" }}>
                          Nothing
                        </div>
                      )}
                    <Button variant="alink" onClick={handleShowChangeGoal}>
                      Actualizar
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="sub-body">
                    <div className="sub-head">Entrenando</div>
                    <Card.Title>{currentUser.customer.weights}</Card.Title>
                    <br />
                    <Button
                      variant="alink"
                      onClick={handleClick}
                    >
                      Actualizar
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
      <SectionNextLevel handleClose={handleCloseNext} show={showNext} />
      <SectionChangeGoal
        handleClose={handleCloseChangeGoal}
        show={showChangeGoal}
      />
      <SectionRenewal handleClose={handleCloseRenewal} show={showRenewal} />
    </>
  );
};

const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateWeightsAction
};
const SectionSubscription = connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscription);

export default SectionSubscription;
