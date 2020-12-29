import React,{ useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { http } from "../../services/api";
import { currentWorkoutPlan } from "../../services/convert";
import { startBankRenewal } from "../../redux/checkout/actions";
import SectionRenewal from "../../DashboardPage/SectionRenewal";

const Subscription = () => {
  const [paymentToken, setPaymentToken] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const handleShowRenewal = () => setShowRenewal(true);
  const handleCloseRenewal = () => setShowRenewal(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const goPricingPage = ()=>{
    dispatch(startBankRenewal());
    history.push('/pricing');
  }
  useEffect(()=>{
    async function fetchData(){
      const res = await http({
        path: "customers/ccard"
      });
      if(res.data){
        setPaymentToken(res.data.number);
      }
    }
    fetchData();
  },[]);
  const renderSubscriptionStatus = (subscription) => {
    if (subscription.status) {
      switch (subscription.status) {
        case 'Expired':
          return (
            <div style={{ color: "#c32121" }}>
              {subscription.nmi_product_id?(
                <>Renovará</>
              ):(
                <>Expirado</>
              )}
            </div>
          );
        case 'Cancelled':
          return (
            <div style={{ color: "#c32121" }}>
              Cancelado
            </div>
          )
        case 'Active':
          if (currentUser.customer.services[1].expire_at && currentUser.customer.services[1].expire_at > 0) {
            return (
              <div style={{ color: "#51AB80" }}>Expira en {currentUser.customer.services[1].expire_at} dias</div>
            )
          } 
          if(currentUser.customer.services[1].expired_date){
            return (
              <div style={{ color: "#51AB80" }}>Renueva el {currentUser.customer.services[1].expired_date}</div>
            )
          }
          break;
        default:
      }
      return (
        <div style={{ color: "transparent" }}>
          Nothing
        </div>
      )
    }
    return (
      <div style={{ color: "#c32121" }}>
        Sin subscripción
      </div>
    )
  }
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-10"><Card.Title>Factura y Suscripción</Card.Title></div>
          <div className="col-2 edit">            
            <NavLink
              to={"/settings/payments"}
              exact
            >
              <i className="fa fa-pen"></i>
            </NavLink>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <label>Membresía Fitness</label>
        <div className="row">
          <div className="value col-8">{renderSubscriptionStatus(currentUser.customer.services[1])}</div>
          {currentUser.customer.currentWorkoutPaymentType === 'bank'&&(
            <div className="col-4 extender">
              {/* <i className="fa fa-edit"></i> */}
              <button className="btn btn-fs-blue" onClick={goPricingPage}>Extender</button>
            </div>
          )}
        </div>
        <label>Tarjeta de Pago</label>
        <div className="value">{paymentToken&&`**** **** **** ${paymentToken}`}</div>
        <label>Plan Adquirido</label>
        <div className="row">
          <div className="value col-10">{currentWorkoutPlan(currentUser.customer.currentWorkoutPlan)}</div>
          <div className="col-2 edit"><i className="fa fa-pen" onClick={handleShowRenewal}></i></div>
        </div>
        <SectionRenewal handleClose={handleCloseRenewal} show={showRenewal} />
      </Card.Body>
    </Card>
  );
};
export default Subscription;
