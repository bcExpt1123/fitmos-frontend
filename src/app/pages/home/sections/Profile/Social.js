import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeGoogle, signInWithGoogle, removeFacebook, signInWithFacebook } from "../../redux/userSettings/actions";
import Google from "../../../../../lib/Google";

const Email = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();
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
        <Card.Title>Cuentas conectadas</Card.Title>
      </Card.Header>
      <Card.Body>
        <label>Google</label>
        <div className="row">
          <div className="col-9 mt-3">
            {currentUser.google_provider_id?(
              <>Conectado Google como <a href="https://plus.google.com" target="_blank">{currentUser.google_name}</a></>
            ):(
              <>Conectarse Google+</>
            )}
          </div>
          <div className="col-3 edit"><input className="apple-switch" type="checkbox" checked={currentUser.google_provider_id!==null} onChange={onTriggerGoogle}/></div>
        </div>
        <label>Facebook</label>
        <div className="row">
          <div className="col-9 mt-3">
            {currentUser.facebook_provider_id?(
              <>Conectado Facebook como <a href="https://facebook.com" target="_blank">{currentUser.facebook_name}</a></>
            ):(
              <>Conectarse Facebook</>
            )}            
          </div>
          <div className="col-3 edit"><input className="apple-switch" type="checkbox" checked={currentUser.facebook_provider_id!==null} onChange={onTriggerFacebook}/></div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default Email;
