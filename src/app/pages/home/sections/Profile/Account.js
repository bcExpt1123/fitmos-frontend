import React, {useState} from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import EmailModal from "./Dialogs/Email";
import PasswordModal from "./Dialogs/Password";
const Account = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClose = ()=>{
    setShow(false);
  }
  const openModal = ()=>{
    setShow(true);
  }
  const handlePasswordClose = ()=>{
    setShowPassword(false);
  }
  const openPasswordModal = ()=>{
    setShowPassword(true);
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Cuenta</Card.Title>
      </Card.Header>
      <Card.Body>
        <label>Email</label>
        <div className="row">
          <div className="value col-10">{currentUser.customer.email}</div>
          <div className="col-2 edit"><i className="fa fa-pen" onClick={openModal}></i></div>
        </div>
        <label>Password</label>
        <div className="row">
          <div className="value col-10">************</div>
          <div className="col-2 edit"><i className="fa fa-pen"onClick={openPasswordModal}></i></div>
        </div>
      </Card.Body>
      <EmailModal show={show} handleClose={handleClose}/>
      <PasswordModal show={showPassword} handleClose={handlePasswordClose}/>
    </Card>
  );
};
export default Account;
