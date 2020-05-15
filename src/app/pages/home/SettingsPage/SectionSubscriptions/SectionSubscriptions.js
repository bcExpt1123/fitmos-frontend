import React, { useState,useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useDispatch,useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SectionCancelSubscription from "../../SectionCancelSubscription";
import SectionRenewal from "../../DashboardPage/SectionRenewal";
import SectionCreditCard from "./SectionCreditCard";
import { $fetchIndex } from "../../../../../modules/subscription/tocken";
import "../../assets/scss/theme/style.scss";
import "../../assets/scss/theme/mbr-additional.css";
import "../../assets/scss/dropdown/style.css";
import "../../assets/scss/theme/common.scss";
import "../../assets/scss/theme/subscriptions.scss";
const SubscriptionsPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchIndex());
  }, []);
  const items = useSelector(({ tocken }) => tocken.items);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [showCancel, setShowCancel] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);
  const handleShowRenewal = () => {
    if(items == null || items.length==0){
      setShowPayment(true);
    }else{
      setShowRenewal(true);
    }
  }
  const handleClosePaymentForm = ()=>setShowPayment(false);
  const handleShowCredit = ()=>{
    setShowCredit(true);
    setShowPayment(false);
  }
  const handleCloseCredit = ()=>setShowCredit(false);
  const handleCloseRenewal = () => setShowRenewal(false);
  const renderStatus = (subscription)=>{
    let status = '';
    switch(subscription.status){
      case 'Active':
        if(subscription.end_date){
          status = 'Finaliza el '+subscription.end_date;
        }else{
          status = 'Activo';
        }
      break;
      case 'Expired':
        status = 'Expirado';
      break;
      case 'Cancelled':
        status = 'Cancelado';
      break;
    }
    return status;
  }
  const renderHelpText = (subscription)=>{
    switch(subscription.status){
      case 'Active':
        if(subscription.end_date){
          return 'No se realizarán cobros adicionales';
        }
        break;
      case 'Expired':
      break;
      case 'Cancelled':
      break;
    }
    return '';
  }
  const renderAction = (subscription)=>{
    switch(subscription.status){
      case 'Active':
        if(subscription.paid){
          if(subscription.end_date){
            return (
              <>
                <button className={"button renew"} onClick={handleShowRenewal}>
                  Reactivar
                </button>
              </>
            )
            }else{
            return (
              <>
                <button className={"button renew"} onClick={handleShowRenewal}>
                  Actualizar
                </button>
                -
                <Button variant="cancel" onClick={handleShowCancel}>Cancelar</Button>
              </>
            )
          }
        }else{
          return (
            <NavLink
              to={'/pricing'}
              className={"button renew"}
              exact
            >
              Renovar
            </NavLink>
          )
        }
      break;
      default:
        return (
          <NavLink
            to={'/pricing'}
            className={"button renew"}
            exact
          >
            Renovar
          </NavLink>
        )
    }
  }
  const classStatus = (subscription)=>{
    let className = '';
    switch(subscription.status){
      case 'Active':
        if(subscription.end_date){
          className = 'blue';
        }else{
          className = 'green';
        }
      break;
      case 'Expired':
        className = 'red';
      break;
      case 'Cancelled':
        className = 'red';
      break;
    }
    return className;
  }
  return  (<>
    <div className='container mt-5 mb-5'>
      <Table responsive className='subscriptions'>
        <thead>
          <tr>
            <th>Suscripción</th>
            <th>Inicio</th>
            <th>Expiración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUser&&currentUser.customer.services['1']&&(
            <tr>
              <td>{currentUser.customer.services['1'].serviceName}</td>
              <td>{currentUser.customer.services['1'].start_date}</td>
              <td>{currentUser.customer.services['1'].end_date?(
                currentUser.customer.services['1'].end_date
              ):(
                currentUser.customer.services['1'].expired_date
              )}</td>
              <td className={classStatus(currentUser.customer.services['1'])}>
                {renderStatus(currentUser.customer.services['1'])}
                <br />
                <small style={{color:'#333333'}}>{renderHelpText(currentUser.customer.services['1'])}</small>
              </td>
              <td><div className="actions">{renderAction(currentUser.customer.services['1'])}</div></td>
            </tr>
          )}
          {[1,2,3,4,5].map((index)=>
            <tr key={index}>
              <td colSpan="5">&nbsp;</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
    <Modal
      dialogClassName="warning-form"
      show={showPayment}
      onHide={handleClosePaymentForm}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Aviso Importante
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Para reactivar su membresía debe tener un método de pago afiliado.
      </Modal.Body>
      <Modal.Footer>
          <button className="btn btn-subscription-renewal" onClick={handleShowCredit}  type="button">Ingresar Método de Pago</button>
        </Modal.Footer>        
    </Modal>
    <SectionCancelSubscription  handleClose={handleCloseCancel} show={showCancel}  credit={false}/>
    <SectionRenewal handleClose={handleCloseRenewal} show={showRenewal} />
    <SectionCreditCard handleClose={handleCloseCredit} show={showCredit} />
  </>)
};

export default SubscriptionsPage;
