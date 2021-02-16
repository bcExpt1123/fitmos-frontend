import React, { useState } from "react";
import classnames from "classnames";

import Avatar from "../Avatar";
import Icon from "../Icon";
import Logo from "../Logo";
import CookieConsent from "../CookieConsent";
import { Navbar, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import * as qs from 'query-string';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { withRouter } from "react-router";

import {
  deleteAuthData as deleteAuthAction,
  authenticate as regenerateAuthAction,
} from "../../redux/auth/actions";
import { setPrivateVoucher } from "../../redux/vouchers/actions";
import { start } from "../../redux/checkout/actions";
import { pulling } from "../../redux/workout/actions";
import { logOut as logOutAction } from "../../redux/auth/actions";
import ProofButton from "../../components/ProofButton";
import { $changeItem } from "../../../../../modules/subscription/service";

//import styles from './NavBar.module.css';
//import Link from '../Link';

class NavBarVariantFull extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      isDrawerOpen: false
    };
    this.toggleisDrawerOpen = this.toggleisDrawerOpen.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentDidMount() {
    //const offset = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
    const offset = new Date().getTimezoneOffset() - 5 * 60;
    if (this.props.expires_at) {
      const loginTime = new Date(this.props.expires_at).getTime() - offset * 60 * 1000;
      const loginATime = new Date(this.props.expires_at).getTime() - offset * 60 * 1000 - 5 * 60 * 1000;
      const loginADate = new Date();
      loginADate.setTime(loginATime);
      const loginDate = new Date();
      loginDate.setTime(loginTime);
      if(this.props.currentUser){
        this.props.pulling({id:this.props.currentUser.customer.id});
        if (loginDate < new Date()) {
          this.props.regenerateAuthAction();
        } else if (loginADate < new Date()) {
          this.props.regenerateAuthAction();
        }
      }
    }
    const parsed = qs.parse(window.location.search);
    if (parsed.coupon) {
      //console.log(parsed.coupon);
      this.props.setPrivateVoucher(parsed.coupon);
    }
    if(this.props.serviceItem == null)this.props.$changeItem(1);
  }

  toggleisDrawerOpen = () => {
    this.setState(prevState => ({
      isDrawerOpen: !prevState.isDrawerOpen
    }));
  };
  handleLogout = () =>{
    this.props.logOutAction();
  }
  render() {
    const { isDrawerOpen } = this.state;
    //const navbarClassnames = "navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-fixed-top navbar-toggleable-sm transparent ";
    const navbarClassnames =
      " align-items-center navbar-fixed-top navbar-toggleable-sm ";
    const { currentUser, transparent, isScroll } = this.props;
    return (
      <>
        <div style={{ textAlign: 'center', fontSize: '12px', padding: '0px', color: 'brown', position: 'fixed', zIndex: '1000', width: '100%', background: 'white',display:'none' }}>
          Estamos cambiando nuestro nombre de Crossfit Condado a Fitemos.
        </div>
        <Navbar
          collapseOnSelect
          className={classnames(
            navbarClassnames,
            { "bg-color": isScroll },
            { "navbar-short": !isScroll },
            { opened: isDrawerOpen },
            { transparent: transparent },
            { "navbar-dropdown": !isScroll || transparent },
            {"checkout":this.props.checkout}
          )}
          onToggle={this.toggleisDrawerOpen}
        >
          <Container>
            {(this.props.checkout===undefined && this.props.checkout !== true)&&
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className={"navbar-toggler-right"}
                children={
                  <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                }
              />
            }
            {(this.props.checkout || window.location.pathname === "/pricing" && this.props.currentUser && this.props.currentUser.has_active_workout_subscription && (this.props.bankRenewal || true)) &&(
              <button type="button" className={"back-button"} onClick={() => {this.props.start();this.props.history.goBack()}}>
                <Icon name="arrowLeft" className="arrow-left" />
              </button>
            )}
            <div className="menu-logo">
              <div className="navbar-brand">
                <span className="navbar-logo">
                  <Logo checkout={this.props.checkout}/>
                </span>
              </div>
            </div>
            {(this.props.checkout===undefined && this.props.checkout !== true)&&(
              <Navbar.Collapse id="responsive-navbar-nav">
                {currentUser ? (
                  <>
                    {currentUser.has_workout_subscription && false?(
                      <>
                        <ul
                          className="mr-auto navbar-nav nav-dropdown"
                          data-app-modern-menu="true"
                        >
                          <li className="nav-item">
                            <NavLink
                              to={"/"}
                              className={"nav-link link text-white display-4"}
                              activeClassName="active"
                              exact
                            >
                              Entrenamiento
                            </NavLink>
                          </li>
                          {currentUser.has_workout_subscription&&(
                            <>
                              <li className="nav-item">
                                <NavLink
                                  to="/news"
                                  className={"nav-link link text-white display-4"}
                                  activeClassName="active"
                                  exact
                                >
                                  Blog
                                </NavLink>
                              </li>
                            </>
                          )}
                        </ul>
                        <ul
                          className="navbar-nav nav-dropdown"
                          data-app-modern-menu="true"
                        >
                          <li className="nav-item">
                            <NavLink
                              to="/settings/profile"
                              className={"nav-link link text-white display-4"}
                              activeClassName="active"
                              exact
                            >
                              <span>{currentUser.name}</span>
                              <Avatar pictureUrls={currentUser.avatarUrls} size="xs" />
                            </NavLink>
                          </li>
                        </ul>
                      </>
                    ):(
                      <ul
                        className="navbar-nav nav-dropdown"
                        data-app-modern-menu="true"
                      >
                        {
                          (this.props.currentUser && this.props.currentUser.has_active_workout_subscription && (this.props.bankRenewal || true))?
                          <li className="nav-item">
                            <NavLink
                              to="/profile"
                              className={"nav-link link text-white display-4"}
                              activeClassName="active"
                              exact
                            >
                              Ir a mi cuenta
                            </NavLink>
                          </li>
                        :
                          <li className="nav-item">
                            <a className={"nav-link link text-white display-4"}  onClick={this.handleLogout}>
                              Cerrar sesión
                            </a>

                            {/* <NavLink
                              to="/logout"
                              className={"nav-link link text-white display-4"}
                              activeClassName="active"
                              exact
                            >
                              Cerrar Sesión
                            </NavLink> */}
                          </li>
                        }
                      </ul>
                    )}
                  </>
                  ) : (
                    <>
                      <ul
                        className="navbar-nav nav-dropdown"
                        data-app-modern-menu="true"
                      >
                        <li className="nav-item">
                          <NavLink
                            to="/news"
                            className={"nav-link link text-white display-4"}
                            activeClassName="active"
                            exact
                          >
                            Blog
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink
                            to="/ayuda"
                            className={"nav-link link text-white display-4"}
                            activeClassName="active"
                            exact
                          >
                            Ayuda
                          </NavLink>
                        </li>
                        <li className="nav-item"></li>
                      </ul>
                      <div className="navbar-buttons mbr-section-btn">
                        <NavLink
                          to="/signup"
                          className={"btn btn-sm btn-primary display-4 fs-home-btn"}
                          exact
                        >
                          <ProofButton/>
                        </NavLink>
                      </div>
                      <div className="navbar-buttons mbr-section-btn  d-none d-md-block">
                        <span className="text-white display-4 mbr-semibold">|</span>
                      </div>
                      <div className="navbar-buttons mbr-section-btn">
                        <NavLink
                          to="/auth/login"
                          className={
                            "nav-link link text-white display-4 mbr-semibold"
                          }
                          activeClassName="active"
                          exact
                        >
                          Iniciar Sesión
                        </NavLink>
                      </div>
                    </>
                  )}
              </Navbar.Collapse>
            )}
          </Container>
        </Navbar>
      </>
    );
  }
}
const NavBarWrapper = ({ ...props }) => {
  const [hideOnNavbar, setHideOnNavbar] = useState(true);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y === 0;
      if (isShow !== hideOnNavbar && props.isScroll!==false) setHideOnNavbar(isShow);
    },
    [hideOnNavbar],
    false,
    false,
    300
  );
  /*useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Timeout called!');
    }, 10);
    return () => clearTimeout(timer);
  }, []);*/
  return (
    <section className="menu fitemos-menu">
      {/*
        This <CookieConsent /> duplication is used to preserve
        vertical space under fixed nav element.
      */}
      <CookieConsent />

      <NavBarVariantFull {...props} isScroll={hideOnNavbar} />
    </section>
  );
};

export const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  expires_at: state.auth.expires_at,
  serviceItem: state.service.item,
  bankRenewal:state.checkout.bank.renewal,
});

export const mapDispatchToProps = {
  deleteAuthAction: deleteAuthAction,
  regenerateAuthAction,
  setPrivateVoucher,
  $changeItem,
  start,
  pulling,
  logOutAction
};

export default withRouter(NavBarWrapper);
