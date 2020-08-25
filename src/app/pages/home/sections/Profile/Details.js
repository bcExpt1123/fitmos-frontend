import React,{useState} from "react";
import { FormattedMessage } from "react-intl";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

import DetailModal from "./Dialogs/Detail";
import SectionEditWeight from "../../DashboardPage/SectionEditWeight";
const Details = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const handleClose = ()=>{
    setShow(false);
  }
  const openModal = ()=>{
    setShow(true);
  }
  const handleCloseWeight = ()=>{
    setShowWeight(false);
  }
  const openModalWeight = ()=>{
    setShowWeight(true);
  }
  return (
    <Card>
      <Card.Header>
        <div className="row">
          <div className="col-10"><Card.Title>Details</Card.Title></div>
          <div className="col-2 edit"><i className="fa fa-pen" onClick={openModal}></i></div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="row">
          <div className="col-6">
            <label>Nombre</label>
            <div className="value">{currentUser.customer.first_name}</div>
          </div>
          <div className="col-6">
            <label>Apellido</label>
            <div className="value">{currentUser.customer.last_name}</div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label>Altura</label>
            <div className="value">
              {parseInt(currentUser.customer.current_height)}
              {currentUser.customer.current_height_unit}
            </div>
          </div>
          <div className="col-6">
            <label>Peso</label>
            <div className="row">
              <div className="value col-8">
                {parseInt(currentUser.customer.current_weight)}
                {currentUser.customer.current_weight_unit}
              </div>
              <div className="col-4 edit"><i className="fa fa-pen" onClick={openModalWeight}></i></div>
            </div>

          </div>
        </div>
        <label>Ubicación</label>
        <div className="value">{currentUser.customer.country}</div>
        {currentUser.customer.whatsapp_phone_number&&(
          <>
            <label>Whatsapp</label>
            <div className="value">{currentUser.customer.whatsapp_phone_number}</div>
          </>
        )}
        <label>Género</label>
        <div className="value"><FormattedMessage id={`SettingsForm.Profile.Full.Value.${currentUser.customer.gender}`} /></div>
      </Card.Body>
      <DetailModal show={show} handleClose={handleClose}/>
      <SectionEditWeight handleClose={handleCloseWeight} show={showWeight} />
    </Card>
  );
};
export default Details;
