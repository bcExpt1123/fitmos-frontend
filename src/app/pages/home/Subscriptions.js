import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SectionCancelSubscription from "./SectionCancelSubscription";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/subscriptions.scss";
const SubscriptionsPage = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);
  const renderStatus = (subscription)=>{
    let status = '';
    switch(subscription.status){
      case 'Active':
        if(subscription.end_date){
          status = 'Activa hasta '+subscription.end_date;
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
  const renderAction = (subscription)=>{
    switch(subscription.status){
      case 'Active':
        if(subscription.end_date){
          return (
            <NavLink
              to={'/pricing'}
              className={"button renew"}
              exact
            >
              Renovar
            </NavLink>
          )
        }else{
          return (
          <>
            <NavLink
              to={'/pricing'}
              className={"button renew"}
              exact
            >
              Renovar
            </NavLink>
            -
            <Button variant="cancel" onClick={handleShowCancel}>Cancelar</Button>
          </>
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
    <NavBar />
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
              <td className={classStatus(currentUser.customer.services['1'])}>{renderStatus(currentUser.customer.services['1'])}</td>
              <td>{renderAction(currentUser.customer.services['1'])}</td>
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

    <Footer />
    <SectionCancelSubscription  handleClose={handleCloseCancel} show={showCancel}  credit={false}/>
  </>)
};

export default SubscriptionsPage;
