import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as qs from 'query-string';
import { $findWorkoutSerive } from "../../../../modules/subscription/service";
import { setPublicVoucher } from "../redux/vouchers/actions";
import { roundToMoney } from "../../../../_metronic/utils/utils.js";

class Pricing extends React.Component {
  componentDidMount() {
    this.props.$findWorkoutSerive();
    const parsed = qs.parse(window.location.search);
    if (parsed.codigo) {
      //console.log(parsed.coupon);
      this.props.setPublicVoucher(parsed.codigo);
    }
  }

  render() {
    const { serviceItem } = this.props;
    //hasPaid? or free
    let monthlyFee;
    if (serviceItem) {
      if (serviceItem.quarterly !== "") {
        monthlyFee = serviceItem.quarterly / 3;
      }
      if (serviceItem.semiannual !== "") {
        monthlyFee = serviceItem.semiannual / 6;
      }
      if (serviceItem.yearly !== "") {
        monthlyFee = serviceItem.yearly / 12;
      }
      if (monthlyFee === undefined) {
        monthlyFee = serviceItem.monthly;
      }
      monthlyFee = roundToMoney(monthlyFee);
    }
    return (
      <section className="section-pricing" id="section-pricing">
        <div className="container">
          <div className="media-container-row">
            <div className="col-12 col-md-1"></div>
            <div className="col-12 col-md-5">
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
                  <div className="plan-price">
                    <span className="price-value">$</span>
                    <span className="price-figure">{monthlyFee}</span>
                    <span className="price-term">/ mes</span>
                  </div>
                  <div className="helper">
                    Podrás cancelar en cualquier momento
                  </div>
                  <div className="plan-btn">
                    <NavLink
                      to="/signup"
                      className={"btn btn-md btn-primary fs-btn"}
                      exact
                    >
                      PRUEBA {serviceItem.free_duration} DÍAS
                    </NavLink>
                  </div>
                </div>
                <div className="border-line-container">
                  <div className="border-line"></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-1">&nbsp;</div>
            <div className="col-12 col-md-5">
              <div className="text-label">
                <h2 className="title">Fitemos</h2>
                <h2 className="sub-title">anywhere</h2>
                <div className="description d-none d-md-block">
                  Conviértete en la mejor versión de ti mismo con el Plan
                  Fitemos. ¡Rodéate de una comunidad motivada y véncete a ti
                  mismo!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="background-container">
          <div className="background"></div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  serviceItem: state.service.item
});

const mapDispatchToProps = {
  $findWorkoutSerive,
  setPublicVoucher
};

const SectionPricing = connect(mapStateToProps, mapDispatchToProps)(Pricing);

export default SectionPricing;
