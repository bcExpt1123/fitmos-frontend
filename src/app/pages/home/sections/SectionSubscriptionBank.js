import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import classnames from "classnames";
import { Modal, Button } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  $findWorkoutSerive,
  $updateInterval
} from "../../../../modules/subscription/service";
import { $changeItem } from "../../../../modules/subscription/service";
import { setCheckoutKind } from "../redux/checkout/actions";
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
  const [type, setType] = useState('nmi');
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [activePlan, setActivePlan] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [couponId, setCouponId] = useState(reactLocalStorage.get('publicCouponId'));
  const [showForm, setShowForm] = useState(showForm);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const [hasWorkoutSubscription, setHasWorkoutSubscription] = useState(false);
  const [changed, setChanged] = useState(false);
  const history = useHistory();
  const handleFreeMembership = ()=>{
    this.props.setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE_WITH_TRIAL});
    history.push("/checkout");
  }
  useEffect(() => {
    if( couponId == null && currentUser && currentUser.defaultCouponId && !currentUser.has_workout_subscription){
      setCouponId(currentUser.defaultCouponId);
      reactLocalStorage.set('publicCouponId', currentUser.defaultCouponId);
    }  
    if(currentUser)setHasWorkoutSubscription(currentUser.has_workout_subscription);
    if(serviceItem == null)$changeItem(1);  
    $findWorkoutSerive();
    setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE});
    const data = getFrequency(currentUser, serviceItem);
    setActivePlan(data[3]);
    if(data[3]){
      setFrequency(data[1]);
    }
    setMonthlyFee(data[2]);
    if ( activePlan == null ){
      $updateInterval(data[1], data[3]);
    }
  },[]);
  // useEffect(() => {
  //   const data = getFrequency(currentUser, serviceItem);
  //   if(data[3] !== activePlan && !changed){
  //     // setActivePlan(data[3]);
  //     // setFrequency(data[1]);
  //     setMonthlyFee(data[2]);
  //     setChanged(false);
  //   }
  // },[activePlan]);
  const handleCloseForm = () => {
    setShowForm(false);
  }
  const changeMembership = (key)=> {
    let monthlyFee = serviceItem[key];
    let frequency = 1;
    const activePlan = key;
    switch (key) {
      case "quarterly":
        monthlyFee = monthlyFee / 3;
        frequency = 3;
        break;
      case "semiannual":
        monthlyFee = monthlyFee / 6;
        frequency = 6;
        break;
      case "yearly":
        monthlyFee = monthlyFee / 12;
        frequency = 12;
        break;
      default:
    }
    monthlyFee = roundToMoney(monthlyFee);
    $updateInterval(frequency, activePlan);
    setMonthlyFee(monthlyFee);
    setActivePlan(activePlan);
    setFrequency(frequency);
    setChanged(true);
    // console.log(activePlan)
    setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE});
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
                  onClick={() => setType('nmi')}
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
                  onClick={() => setType('bank')}
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
              {type=='nmi'?<NmiPricing changeMembership={changeMembership} getActivePlan={getActivePlan}/>
                :<BankPricing changeMembership={changeMembership} getActivePlan={getActivePlan}/>
              }
            </>
          )}
          <div className="row mt-4">
            <div className="col-12 col-md-12">
              <div className="plan-card">
                <div className="plan-header text-left">
                  <h3 className="plan-title mbr-fonts-style">Plan Fitemos</h3>
                </div>
                <div className="plan-body">
                  <div className="plan-list align-center row">
                    <ul className="col-12 col-md-6 pl-5">
                        <li className="text-left">Programa Personalizado</li>
                        <li className="text-left">Tutorial de Cada Movimiento</li>
                        <li className="text-left">Blog Nutricional y Tips</li>
                      </ul>
                      <ul className="col-12 col-md-6 pl-5">
                        <li className="text-left">Acceso a Entrenadores</li>
                        <li className="text-left">Interacción con Miembros</li>
                        <li className="text-left">Actividades del Team Fi</li>
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
                        type === 'nmi'?
                          <button
                            className="btn-md btn-primary fs-btn"
                            onClick={handleFreeMembership}
                          >
                            PRUEBA {serviceItem && serviceItem.free_duration} DÍAS GRATIS
                            <br/>
                            <small>Podrás cancelar en cualquier momento.</small>
                          </button>
                          :
                          <button
                            className="btn-md btn-primary fs-btn"
                            onClick={handleFreeMembership}
                          >
                            ADQUIERE {frequency} MESES POR USD {roundToMoney(parseFloat(serviceItem[activePlan])+parseFloat(serviceItem.bank_fee))}
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