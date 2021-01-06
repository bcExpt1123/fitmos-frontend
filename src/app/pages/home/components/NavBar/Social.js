import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Navbar, Container } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import * as qs from 'query-string';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

import Avatar from "../Avatar";
import Icon from "../Icon";
import Logo from "../Logo";
import {
  authenticate as regenerateAuthAction,
} from "../../redux/auth/actions";
import { setPrivateVoucher } from "../../redux/vouchers/actions";
import { start } from "../../redux/checkout/actions";
import { $changeItem } from "../../../../../modules/subscription/service";

//import styles from './NavBar.module.css';
//import Link from '../Link';

const NavBarVariantFull = ({isScroll, checkout})=>{
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleisDrawerOpen = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const expires_at = useSelector(({auth})=>auth.expires_at);
  const bankRenewal = useSelector(({checkout})=>checkout.bank.renewal);
  const serviceItem = useSelector(({service})=>service.item);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(()=>{
    const offset = new Date().getTimezoneOffset() - 5 * 60;
    if (expires_at) {
      const loginTime = new Date(expires_at).getTime() - offset * 60 * 1000;
      const loginATime = new Date(expires_at).getTime() - offset * 60 * 1000 - 5 * 60 * 1000;
      const loginADate = new Date();
      loginADate.setTime(loginATime);
      const loginDate = new Date();
      loginDate.setTime(loginTime);
      if (currentUser && loginDate < new Date()) {
        //deleteAuthAction();
        dispatch(regenerateAuthAction());
      } else if ( currentUser && loginADate < new Date()) {
        dispatch(regenerateAuthAction());
      }
    }
    const parsed = qs.parse(window.location.search);
    if (parsed.coupon) {
      dispatch(setPrivateVoucher(parsed.coupon));
    }
    if(serviceItem == null)dispatch($changeItem(1));
  },[]);
  const navbarClassnames =
    " full-width align-items-center navbar-fixed-top navbar-toggleable-sm ";
  return (
    <>
      <Navbar
        collapseOnSelect
        className={classnames(
          navbarClassnames,
          { "bg-color": isScroll },
          { "navbar-short": !isScroll },
          { opened: isDrawerOpen },
          { transparent: false },
          { "navbar-dropdown": !isScroll },
          {"checkout":checkout}
        )}
        onToggle={toggleisDrawerOpen}
      >
        <Container>
          {(checkout===undefined && checkout !== true)&&
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
          <div className="menu-logo">
            <div className="navbar-brand">
              <span className="navbar-logo">
                <Logo checkout={checkout}/>
              </span>
            </div>
          </div>
          {(checkout===undefined && checkout !== true)&&(
            <Navbar.Collapse id="responsive-navbar-nav">
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
              </ul>  
              <ul
                className="navbar-nav nav-dropdown"
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
                <li className="nav-item">
                  <NavLink
                    to="/logout"
                    className={"nav-link link text-white display-4"}
                    activeClassName="active"
                    exact
                  >
                    Cerrar Sesión
                  </NavLink>
                </li>
              </ul>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
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
  return (
    <section className="menu fitemos-menu">
      <NavBarVariantFull {...props} isScroll={hideOnNavbar} />
    </section>
  );
};

export default NavBarWrapper;
