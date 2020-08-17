import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import classnames from "classnames";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  $findWorkoutSerive,
  $updateInterval
} from "../../../../modules/subscription/service";
import { $takeFreeMembership } from "../../../../modules/subscription/subscription";
import { setCheckoutKind } from "../redux/checkout/actions";
import { roundToMoney } from "../../../../_metronic/utils/utils.js";
import { CHECKOUT_KIND } from "../constants/checkout-kind";

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    let couponId = reactLocalStorage.get('publicCouponId');
    if( couponId == null && this.props.currentUser && this.props.currentUser.defaultCouponId && !this.props.currentUser.has_workout_subscription){
      couponId = this.props.currentUser.defaultCouponId;
      reactLocalStorage.set('publicCouponId', couponId);
    }
    this.state = {
      monthlyFee: "",
      activePlan: "",
      count: 0,
      showForm:false,
      couponId:couponId
    };
    this.changeMembership = this.changeMembership.bind(this);
    this.handleFreeMembership = this.handleFreeMembership.bind(this);
    this.handleCloseForm = this.handleCloseForm.bind(this);
  }
  handleCloseForm = () => {
    this.setState({showForm:false});
  }

  componentDidMount() {
    this.props.$findWorkoutSerive();
    this.props.setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE});
    if(this.props.serviceItem && this.props.serviceItem.frequency!=""){
      let key = "monthly";
      switch(this.props.serviceItem.frequency){
        case "3":
          key = "quarterly";
          break;
        case "6":
          key = "semiannual";
          break;
        case "12":
          key = "yearly";
          break;
      }
      this.changeMembership(key);    
    }
    const { currentUser, serviceItem } = this.props;
    let count = 0;
    let frequency = 1;
    let monthlyFee;
    let activePlan;
    [count,frequency,monthlyFee,activePlan] = this.getFrequency(currentUser, serviceItem);
    if (this.state.activePlan == "")
      this.props.$updateInterval(frequency, activePlan);
  }
  getActivePlan(key, activePlan) {
    if (this.state.activePlan != "") {
      return key == this.state.activePlan;
    } else {
      return key == activePlan;
    }
  }
  changeMembership(key) {
    let monthlyFee = this.props.serviceItem[key];
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
    }
    monthlyFee = roundToMoney(monthlyFee);
    this.props.$updateInterval(frequency, activePlan);
    this.setState({ monthlyFee, activePlan });
    this.props.setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE});
  }
  handleFreeMembership() {
    //this.props.$takeFreeMembership(this.props.history);
    this.props.setCheckoutKind({checkoutKind:CHECKOUT_KIND.ACTIVATE_WITH_TRIAL});
    this.props.history.push("/checkout");
  }
  renderSubtitle(currentUser,hasWorkoutSubscription){
    let content = "Primer mes gratis’";
    if(hasWorkoutSubscription){
      switch(this.state.activePlan){
        case "monthly":
          content = "¡Consulta por el mes de prueba!";
          break;
        default:
      }
    }else{
      switch(this.state.activePlan){
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
  renderPrice(currentUser,monthlyFee,hasWorkoutSubscription){
    return (
      <>
      {currentUser?(
        hasWorkoutSubscription?(
          <div className="plan-price">
            <span className="price-value">$</span>
            <span className="price-figure">
              {this.state.monthlyFee == ""
                ? monthlyFee
                : this.state.monthlyFee}
            </span>
            <span className="price-term">/ mes</span>
          </div>
        ):(
          this.state.couponId?(
            <>
              <div className="plan-price discount">
                <del>
                  <span className="price-value">$</span>
                  <span className="price-figure">
                    {this.state.monthlyFee == ""
                      ? monthlyFee
                      : this.state.monthlyFee}
                  </span>
                </del>  
                <span className="price-term">/ mes</span>
              </div>
              <div className="plan-subtitle">
                {this.renderSubtitle(currentUser,hasWorkoutSubscription)}
              </div>
            </>
          ):(
            <>
              <div className="plan-price">
                <span className="price-value">$</span>
                <span className="price-figure">
                  {this.state.monthlyFee == ""
                    ? monthlyFee
                    : this.state.monthlyFee}
                </span>
                <span className="price-term">/ mes</span>
              </div>
              <div className="plan-subtitle yellow">
                {this.renderSubtitle(currentUser,hasWorkoutSubscription)}
              </div>
            </>
          )
        )
      ):(
        <div className="plan-price">
          <span className="price-value">$</span>
          <span className="price-figure">
            {this.state.monthlyFee == ""
              ? monthlyFee
              : this.state.monthlyFee}
          </span>
          <span className="price-term">/ mes</span>
        </div>
        )}
      </>
    )
  }
  getFrequency(currentUser, serviceItem){
    let count = 0;
    let frequency = 1;
    let monthlyFee;
    let activePlan;
    if (serviceItem) {
      if(currentUser&&currentUser.customer.currentWorkoutPlan!='monthly'){
        if (serviceItem.monthly != "") count++;
      }
      if(currentUser&&currentUser.customer.currentWorkoutPlan!='quarterly'){
        count++;
        monthlyFee = serviceItem.quarterly / 3;
        activePlan = "quarterly";
        frequency = 3;
      }
      if(currentUser&&currentUser.customer.currentWorkoutPlan!='semiannual'){
        if (serviceItem.semiannual != "") {
          count++;
          monthlyFee = serviceItem.semiannual / 6;
          activePlan = "semiannual";
          frequency = 6;
        }
      }
      if(currentUser&&currentUser.customer.currentWorkoutPlan!='yearly'){
        if (serviceItem.yearly != "") {
          count++;
          monthlyFee = serviceItem.yearly / 12;
          activePlan = "yearly";
          frequency = 12;
        }
      }
      if (monthlyFee == undefined) {
        monthlyFee = serviceItem.monthly;
        activePlan = "monthly";
        frequency = 1;
      }
      monthlyFee = roundToMoney(monthlyFee);
    }
    return [count,frequency,monthlyFee,activePlan];
  }
  render() {
    const { currentUser, serviceItem } = this.props;
    //hasPaid? or free
    const hasWorkoutSubscription = currentUser
      ? currentUser.has_workout_subscription
      : false;
    let count = 0;
    let frequency = 1;
    let monthlyFee;
    let activePlan;
    [count,frequency,monthlyFee,activePlan] = this.getFrequency(currentUser, serviceItem);

    let classes;
    switch (count) {
      case 1:
        classes = "col-12";
        break;
      case 2:
        classes = "col-6";
        break;
      case 3:
        classes = "col-4";
        break;
      case 4:
        classes = "col-6 col-md-3";
        break;
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
              <div className="row mt-2">
                {serviceItem.monthly != "" && currentUser.customer.currentWorkoutPlan !='monthly'&&(
                  <div
                    className={classes}
                    onClick={() => this.changeMembership("monthly")}
                  >
                    <div
                      className={classnames("membership", {
                        active: this.getActivePlan("monthly", activePlan),
                      })}
                    >
                      <h2>Mensual</h2>
                      <h5>Quiero crear el hábito Fit</h5>
                    </div>
                  </div>
                )}
                {serviceItem.quarterly != "" && currentUser.customer.currentWorkoutPlan !='quarterly'&&(
                  <div
                    className={classes}
                    onClick={() => this.changeMembership("quarterly")}
                  >
                    <div
                      className={classnames("membership", {
                        active: this.getActivePlan("quarterly", activePlan),
                      })}
                    >
                      <h2>Trimestral</h2>
                      <h5>Quiero mis primeros resultados</h5>
                    </div>
                  </div>
                )}
                {serviceItem.semiannual != "" && currentUser.customer.currentWorkoutPlan !='semiannual'&&(
                  <div
                    className={classes}
                    onClick={() => this.changeMembership("semiannual")}
                  >
                    <div
                      className={classnames("membership", {
                        active: this.getActivePlan("semiannual", activePlan)
                      })}
                    >
                      <h2>Semestral</h2>
                      <h5>Quiero cambiar mi vida</h5>
                    </div>
                  </div>
                )}
                {serviceItem.yearly != "" && currentUser.customer.currentWorkoutPlan !='yearly'&&(
                  <div
                    className={classes}
                    onClick={() => this.changeMembership("yearly")}
                  >
                    <div
                      className={classnames("membership", {
                        active: this.getActivePlan("yearly", activePlan)
                      })}
                    >
                      <h2>Anual</h2>
                      <h5>Quiero cambiar mi vida</h5>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="media-container-row mt-4">
              <div className="col-12 col-lg-3"></div>
              <div className="col-12 col-lg-6">
                <div className="plan-card">
                  <div className="plan-header text-center">
                    <h3 className="plan-title mbr-fonts-style">Plan Fitemos</h3>
                  </div>
                  <div className="plan-body">
                    <div className="plan-list align-center">
                      <div>Entrenamientos personalizados</div>
                      <div>Tutorial de cada movimiento</div>
                      <div>Tips personalizados</div>
                      <div>Pruebas para medir tu progreso</div>
                      <div>Calentamiento específico</div>
                      <div>Acceso a entrenadores 24/7</div>
                      <div>Comunidad Fitemos</div>
                    </div>
                  </div>
                  <div className="plan-footer">
                    {this.renderPrice(currentUser,monthlyFee,hasWorkoutSubscription)}
                    <div className="helper">
                      Podrás cancelar en cualquier momento
                    </div>
                    <div className="plan-btn">
                      {currentUser == undefined ? (
                        <NavLink
                          to={`/signup`}
                          className="btn btn-md btn-primary fs-btn"
                        >
                          COMENZAR
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
                          <>
                            <button
                              className="btn btn-md btn-primary fs-btn"
                              disabled={this.props.loading}
                              onClick={()=>this.setState({showForm:true})}
                            >
                              PRUEBA {this.props.serviceItem.free_duration} DÍAS GRATIS
                            </button>
                            <br/>
                            o <NavLink
                              to={`/checkout`}
                              className="btn btn-md"
                            >
                              Compra ahora
                            </NavLink>
                          </>
                        )
                      )}
                    </div>
                  </div>
                  <div className="border-line-container">
                    <div className="border-line"></div>
                  </div>
                </div>
                {(currentUser && hasWorkoutSubscription == false) && false && (
                  <p className="text-white pt-5 text-center">
                    Comienza hoy y recibe 10% de descuento al afiliarte
                  </p>
                )}
              </div>
              <div className="col-12 col-lg-3"></div>
            </div>
            {(currentUser == undefined ||
              (currentUser && hasWorkoutSubscription == false)) && false && (
              <div className="media-container-row">
                <div className="col-12 col-md-2"></div>
                <div className="col-12 col-md-8">
                  <div className="divider">
                    <span>O</span>
                  </div>
                  <div className="text-center free-plan">
                    {currentUser == undefined ? (
                      <NavLink
                        to={`/signup`}
                        className="btn btn-md btn-primary fs-btn"
                      >
                        PRUEBA {this.props.serviceItem.free_duration} DÍAS GRATIS
                      </NavLink>
                    ) : (
                      <button
                        className="btn btn-md btn-primary fs-btn"
                        disabled={this.props.loading}
                        onClick={()=>this.setState({showForm:true})}
                      >
                        PRUEBA {this.props.serviceItem.free_duration} DÍAS GRATIS
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
          show={this.state.showForm}
          onHide={this.handleCloseForm}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
             <h2>¿Está seguro que desea continuar hacia los {this.props.serviceItem.free_duration} días gratis y perder el bono de 10% en su suscripción?</h2>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="free-plan-button" onClick={this.handleCloseForm}>
            Regresar
          </Button>
          <Button variant="free-plan-button" onClick={this.handleFreeMembership}>
            Continuar 
          </Button>
          </Modal.Footer>          
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  loading: state.subscription.isloading,
  serviceItem: state.service.item
});

const mapDispatchToProps = {
  $findWorkoutSerive,
  $takeFreeMembership,
  $updateInterval,
  setCheckoutKind
};

const SectionSubscription = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Subscription));

export default SectionSubscription;