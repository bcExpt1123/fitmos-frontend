import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import classnames from "classnames";
import { Modal, Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  $findWorkoutSerive,
  $updateInterval,
  $changeType,
} from "../../../../modules/subscription/service";
//import { $findUserDetails } from "../../../../modules/subscription/service";
import { setCheckoutKind, sendBankRequest } from "../redux/checkout/actions";
import { roundToMoney } from "../../../../_metronic/utils/utils.js";
import { CHECKOUT_KIND } from "../constants/checkout-kind";
import NmiPricing,{getFrequency} from "./pricing/NmiPricing";
import BankPricing,{getBankFrequency} from "./pricing/BankPricing";
const renderSubtitle = (hasWorkoutSubscription, activePlan)=>{
  let content = "Primer mes gratis’";
  if(hasWorkoutSubscription){
    switch(activePlan){
      case "monthly":
        content = "¡Consulta por el mes de prueba!";
        break;
      default:
    }
  }else{
    switch(activePlan){
      case "monthly":
        content = "¡1 Mes Gratis!";
        break;
      case "quarterly":
        content = "¡4.99/mes!";
        break;
      case "semiannual":
        content = "¡5.49/mes!";
        break;
        default:
    }
  }
  return content;
}

const renderPrice = (currentUser,monthlyFee,hasWorkoutSubscription,activePlan,couponId)=>{
  return (
    <>
    {currentUser?(
      hasWorkoutSubscription?(
        <div className="plan-price">
          <span className="price-value">$</span>
          <span className="price-figure">
            {monthlyFee}
          </span>
          <span className="price-term">/ mes</span>
        </div>
      ):(
        couponId?(
          <>
            <div className="plan-price discount">
              <del>
                <span className="price-value">$</span>
                <span className="price-figure">
                  {monthlyFee}
                </span>
              </del>  
              <span className="price-term">/ mes</span>
            </div>
            <div className="plan-subtitle">
              {renderSubtitle(hasWorkoutSubscription,activePlan)}
            </div>
          </>
        ):(
          <>
            <div className="plan-price">
              <span className="price-value">$</span>
              <span className="price-figure">
                {monthlyFee}
              </span>
              <span className="price-term">/ mes</span>
            </div>
            <div className="plan-subtitle yellow">
              {renderSubtitle(hasWorkoutSubscription,activePlan)}
            </div>
          </>
        )
      )
    ):(
      <div className="plan-price">
        <span className="price-value">$</span>
        <span className="price-figure">
          {monthlyFee}
        </span>
        <span className="price-term">/ mes</span>
      </div>
      )}
    </>
  )
}
export default function SubscriptionBank() {
  const [couponId, setCouponId] = useState(reactLocalStorage.get('publicCouponId'));
  const [showForm, setShowForm] = useState(showForm);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const monthlyFee = useSelector(({service})=>service.monthlyFee);
  const activePlan = useSelector(({service})=>service.activePlan);
  const frequency = useSelector(({service})=>service.frequency);
  const type = useSelector(({service})=>service.type);
  const checkoutDone = useSelector(({checkout})=>checkout.status);
  const [hasWorkoutSubscription, setHasWorkoutSubscription] = useState(false);
  let duration = frequency;
  if(!hasWorkoutSubscription)duration++; 
  const [changed, setChanged] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const handleFreeMembership = ()=>{
    dispatch(setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE_WITH_TRIAL}));
    history.push("/checkout");
  }
  const handlePaidMembership = ()=>{
    // dispatch(setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE}));
    history.push("/checkout");
  }
  const handleBankRequest = ()=>{
    dispatch(sendBankRequest(frequency));
    history.push("/checkout");
  }
  useEffect(() => {
    if(type === 'bank' && checkoutDone === 'done')history.push("/checkout");
    if( couponId == null && currentUser && currentUser.defaultCouponId && !currentUser.has_workout_subscription){
      setCouponId(currentUser.defaultCouponId);
      reactLocalStorage.set('publicCouponId', currentUser.defaultCouponId);
    }  
    if(currentUser)setHasWorkoutSubscription(currentUser.has_workout_subscription);
    // if(serviceItem == null || serviceItem&&serviceItem.bank_fee == undefined)$changeItem(1);  
    dispatch($findWorkoutSerive());
    setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE});
  },[]);
  const handleCloseForm = () => {
    setShowForm(false);
  }
  const getActivePlan = (key, plan)=> {
    if (activePlan !== "") {
      return key === activePlan;
    } else {
      return key === plan;
    }
  }

  return (
    <>
      <MetaTags>
        <title>Entrenamiento -Fitemos </title>
        <meta
          name="description"
          content="Obtenga un viaje de entrenamiento personal basado en su nivel de condición física. Entrenamiento de alta intensidad: en cualquier momento y en cualquier lugar. ¡Comienza a entrenar hoy!"
        />
      </MetaTags>

      <section className="section-subscription" id="section-subscription">
        <div className="container">
          <div className="media-container-row">
            <div className="col-12">
              <h1 className="text-white header-title text-center mb-5 mt-5">
                TU ENTRENAMIENTO EMPIEZA AHORA
              </h1>
            </div>
          </div>
          {currentUser && serviceItem && (
            <>
              <div className="row mt-2 mb-4">
                <div
                  className="col-6"
                  onClick={() => dispatch($changeType('nmi'))}
                >
                  <div
                    className={classnames("membership", {
                      active: type === 'nmi',
                    })}
                  >
                    <h2>Tarjeta de Crédito</h2>
                    <h5>1 mes de prueba sin compromiso</h5>
                  </div>
                </div>
                <div
                  className="col-6"
                  onClick={() => dispatch($changeType('bank'))}
                >
                  <div
                    className={classnames("membership", {
                      active: type === 'bank',
                    })}
                  >
                    <h2>Transferencia ACH</h2>
                    <h5>1 mes extra + USD {serviceItem.bank_fee} Gasto de Manejo</h5>
                  </div>
                </div>
              </div>
              {type=='nmi'?<NmiPricing getActivePlan={getActivePlan}/>
                :<BankPricing getActivePlan={getActivePlan}/>
              }
            </>
          )}
          <div className="row mt-4">
            <div className="col-12 col-md-12">
              <div className="plan-card">
                <div className="plan-header text-left">
                  <h3 className="plan-title mbr-fonts-style">Programa Fitemos</h3>
                </div>
                <div className="plan-body">
                  <div className="plan-list align-center row">
                    <ul className="col-12 col-md-6 pl-5 mb-0">
                        <li className="text-left">Programa con pesas</li>
                        <li className="text-left">Programa sin pesas</li>
                        <li className="text-left">Programa orientado a objetivos</li>
                        <li className="text-left">Tutorial de cada movimiento</li>
                      </ul>
                      <ul className="col-12 col-md-6 pl-5">
                        <li className="text-left">Blog Nutricional y Tips</li>
                        <li className="text-left">Acceso a Entrenadores</li>
                        <li className="text-left">Interacción con Miembros</li>
                        <li className="text-left">Entrenamientos al Aire Libre</li>
                      </ul>
                  </div>
                </div>
                <div className="plan-footer">
                  <div className="plan-btn">
                    {currentUser === undefined ? (
                      <NavLink
                        to={`/signup`}
                        className="btn btn-md btn-primary fs-btn"
                      >
                        PRUEBA {serviceItem && serviceItem.free_duration} DÍAS GRATIS
                        <br/>
                        Podrás cancelar en cualquier momento.
                      </NavLink>
                    ) : (
                      hasWorkoutSubscription?(
                        <NavLink
                          to={`/checkout`}
                          className="btn btn-md btn-primary fs-btn"
                        >
                          Compra ahora
                        </NavLink>                        
                      ):(
                        type === 'nmi'?(
                          couponId?
                            <button
                              className="btn-md btn-primary fs-btn"
                              onClick={handlePaidMembership}
                            >
                              OBTENER OFERTA
                              <br/>
                              <small>Podrás cancelar en cualquier momento.</small>
                            </button>
                            :
                            <button
                              className="btn-md btn-primary fs-btn"
                              onClick={handleFreeMembership}
                            >
                              PRUEBA {serviceItem && serviceItem.free_duration} DÍAS GRATIS
                              <br/>
                              <small>Podrás cancelar en cualquier momento.</small>
                            </button>
                          )
                          :
                          <button
                            className="btn-md btn-primary fs-btn"
                            onClick={handleBankRequest}
                          >
                            ADQUIERE {duration} 
                            &nbsp;
                            {duration>1?<>MESES</>:<>MES</>} 
                            &nbsp;
                            POR USD {roundToMoney(parseFloat(serviceItem[activePlan])+parseFloat(serviceItem.bank_fee))}
                            <br/>
                            <small>Podrás cambiar de plan o método de pago en el futuro.</small>
                          </button>
                      )
                    )}
                  </div>
                </div>
                <div className="border-line-container">
                  <div className="border-line"></div>
                </div>
              </div>
              {(currentUser && hasWorkoutSubscription === false) && false && (
                <p className="text-white pt-5 text-center">
                  Comienza hoy y recibe 10% de descuento al afiliarte
                </p>
              )}
            </div>
          </div>
          {(currentUser === undefined ||
            (currentUser && hasWorkoutSubscription === false)) && false && (
            <div className="media-container-row">
              <div className="col-12 col-md-2"></div>
              <div className="col-12 col-md-8">
                <div className="divider">
                  <span>O</span>
                </div>
                <div className="text-center free-plan">
                  {currentUser === undefined ? (
                    <NavLink
                      to={`/signup`}
                      className="btn btn-md btn-primary fs-btn"
                    >
                      PRUEBA {serviceItem.free_duration} DÍAS GRATIS
                      <br/>
                      Podrás cancelar en cualquier momento.
                    </NavLink>
                  ) : (
                    <button
                      className="btn btn-md btn-primary fs-btn"
                      onClick={()=>setShowForm(true)}
                    >
                      PRUEBA {serviceItem.free_duration} DÍAS GRATIS
                      <br/>
                      Podrás cancelar en cualquier momento.
                    </button>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-2"></div>
            </div>
          )}
        </div>
        <div className="background-container">
          <div className="background"></div>
        </div>
      </section>
      <Modal
        size="lg"
        dialogClassName="free-plan"
        show={showForm}
        onHide={handleCloseForm}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h2>¿Está seguro que desea continuar hacia los {serviceItem && serviceItem.free_duration} días gratis y perder el bono de 10% en su suscripción?</h2>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="free-plan-button" onClick={handleCloseForm}>
          Regresar
        </Button>
        <Button variant="free-plan-button" onClick={handleFreeMembership}>
          Continuar 
        </Button>
        </Modal.Footer>          
      </Modal>
    </>    
  )  
}