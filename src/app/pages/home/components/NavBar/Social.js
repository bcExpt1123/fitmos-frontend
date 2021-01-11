import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Navbar, Container } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import * as qs from 'query-string';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import SVG from "react-inlinesvg";

import Avatar from "../Avatar";
import Logo from "../Logo";
import {
  authenticate as regenerateAuthAction,
} from "../../redux/auth/actions";
import { setPrivateVoucher } from "../../redux/vouchers/actions";
import { start } from "../../redux/checkout/actions";
import { pulling } from "../../redux/workout/actions";
import { $changeItem } from "../../../../../modules/subscription/service";
import CreatePostModal from "../../social/posts/CreatingModal";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
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
    if( currentUser ) dispatch(pulling({id:currentUser.customer.id}))
  },[]);
  const [showCreatingPost, setShowCreatingPost] = useState(false);
  const OpenCreatingPost = ()=>{
    setShowCreatingPost(true);
  }
  const handleCreatingModalClose = () => {
    setShowCreatingPost(false);
  }
  const navbarClassnames =
    " full-width align-items-center navbar-fixed-top navbar-toggleable-sm ";
  const [showSubmenu, setShowSubmenu] = useState(false);
  const openSubmenu = ()=>{
    setShowSubmenu(true);
  }
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
          <div className="menu-first">
            <div className="menu-logo">
              <div className="navbar-brand">
                <span className="navbar-logo">
                  <Logo checkout={checkout}/>
                </span>
              </div>
            </div>
            <div className="search">
              <input id="search" placeholder="&#xF002; Search" type="text" className="mt-3"/>
            </div>  
          </div>
          <ul
            className="navbar-nav nav-dropdown menu-second"
            data-app-modern-menu="true"
          >
            <li className="nav-item">
              <NavLink
                to="/"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/workout.svg")} />
                </span>
                <span className="svg-icon-active menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/workout-active.svg")} />
                </span>
                <span className="menu-text">Workout</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/newsfeed"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/newsfeed.svg")} />
                </span>
                <span className="svg-icon-active menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/newsfeed-active.svg")} />
                </span>
                <span className="menu-text">Newsfeed</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/leaderboard"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/leaderboard.svg")} />
                </span>
                <span className="svg-icon-active menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/leaderboard-active.svg")} />
                </span>
                <span className="menu-text">Leaderboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/benchmarks"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <span className="svg-icon menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/explore.svg")} />
                </span>
                <span className="svg-icon-active menu-icon">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/explore-active.svg")} />
                </span>
                <span className="menu-text">Explore</span>
              </NavLink>
            </li>
          </ul>
          <ul
            className="navbar-nav nav-dropdown menu-third"
            data-app-modern-menu="true"
          >
            <li className="nav-item">
              <NavLink
                to="/settings/profile"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <Avatar pictureUrls={currentUser.avatarUrls} size="xs" />
                <span className="full-name">{currentUser.name}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <button type="button" className={"clickable-button"} onClick={OpenCreatingPost}>
                <i className="far fa-plus-square" />
              </button>
            </li>
            <li className="nav-item">
              <NavLink
                to="/settings/profile"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <i className="far fa-comments" />
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <i className="far fa-bell" />
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button type="button" className={"clickable-button"} onClick={openSubmenu}>
                <i className="fas fa-chevron-down" />
              </button>
              <div className={classnames("dropdown-menu",{show:showSubmenu})}>
                <NavLink
                  to="/profile"
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                >
                  My Profile
                </NavLink>                
                <NavLink
                  to="/profile"
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                >
                  Settings
                </NavLink>                
                <NavLink
                  to="/profile"
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                >
                  Help&Support
                </NavLink>                
                <NavLink
                  to="/logout"
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                >
                  Cerrar Sesión
                </NavLink>
              </div>
            </li>
          </ul>
        </Container>
      </Navbar>
      <CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose}/>
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
    <section className="menu fitemos-menu-social">
      <NavBarVariantFull {...props} isScroll={hideOnNavbar} />
    </section>
  );
};

export default NavBarWrapper;
