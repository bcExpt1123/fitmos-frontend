import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import EmailModal from "./Dialogs/Email";
import PasswordModal from "./Dialogs/Password";
import { removeGoogle, signInWithGoogle, removeFacebook, signInWithFacebook } from "../../redux/userSettings/actions";
import Google from "../../../../../lib/Google";

const Account = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();
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
  useEffect(()=>{
    Google.load();
  },[]);
  const onTriggerGoogle = ()=>{
    if(currentUser.google_provider_id){
      if(window.confirm("¿Realmente quieres eliminar la conexión de Google?")){
        dispatch(removeGoogle());
        setTimeout(()=>{
          //setGoogle(null);
        },10000);
      }else{
        return;
      }
    }else{
      dispatch(signInWithGoogle());
    }
  }
  const onTriggerFacebook = ()=>{
    if(currentUser.facebook_provider_id){
      if(window.confirm("¿Realmente quieres eliminar la conexión de Facebook?")){
        dispatch(removeFacebook());
      }else{
        return;
      }
    }else{
      dispatch(signInWithFacebook());
    }
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
        <div className="row">
          <div className="col-9 mt-3">
            {currentUser.google_provider_id?(
              <>Conectado a Google como <a href="https://plus.google.com" target="_blank">{currentUser.google_name}</a></>
            ):(
              <>Conectarse con Google+</>
            )}
          </div>
          <div className="col-3 edit"><input className="apple-switch" type="checkbox" checked={currentUser.google_provider_id!==null} onChange={onTriggerGoogle}/></div>
        </div>
        <div className="row">
          <div className="col-9 mt-3">
            {currentUser.facebook_provider_id?(
              <>Conectado a Facebook como <a href="https://facebook.com" target="_blank">{currentUser.facebook_name}</a></>
            ):(
              <>Conectarse con Facebook</>
            )}            
          </div>
          <div className="col-3 edit"><input className="apple-switch" type="checkbox" checked={currentUser.facebook_provider_id!==null} onChange={onTriggerFacebook}/></div>
        </div>
      </Card.Body>
      <EmailModal show={show} handleClose={handleClose}/>
      <PasswordModal show={showPassword} handleClose={handlePasswordClose}/>
    </Card>
  );
};
export default Account;
