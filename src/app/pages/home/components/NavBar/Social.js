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
import MiniLogo from "../MiniLogo";
import {
  authenticate as regenerateAuthAction,
} from "../../redux/auth/actions";
import { setPrivateVoucher } from "../../redux/vouchers/actions";
import { pulling } from "../../redux/workout/actions";
import { $changeItem } from "../../../../../modules/subscription/service";
import CreatePostModal from "../../social/posts/CreatingModal";
import EditPostModal from "../../social/posts/EditingModal";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import BasicSubmenu from "./DropDown/BasicSubMenu";
import Submenu from "./DropDown/SubMenu";
import SearchResult from "./DropDown/SearchResult";
import QuickPanel from "../../../../partials/layout/QuickPanel";
import NotificationToggler from "./Notifications/Toggler";
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
    function hideDropDowns(event){
      if (!event.target.matches('.dropbtn')) {
        console.log(event.target)
        var dropdowns = document.getElementsByClassName("dropdown-menu");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    } 
    window.addEventListener('click', hideDropDowns) 
    return ()=>window.removeEventListener("click", hideDropDowns);   
  },[]);
  const [showCreatingPost, setShowCreatingPost] = useState(false);
  const OpenCreatingPost = ()=>{
    setShowCreatingPost(true);
    setShowSubmenu(false);
  }
  const handleCreatingModalClose = () => {
    setShowCreatingPost(false);
  }
  const navbarClassnames =
    " full-width align-items-center navbar-fixed-top navbar-toggleable-sm ";
  const [showBasicSubMenu, setShowBasicSubMenu] = useState(false);
  const openBasicSubmenu = ()=>{
    setShowSubmenu(false);
    setShowBasicSubMenu(!showBasicSubMenu);
  }
  const [showSubmenu, setShowSubmenu] = useState(false);
  const openSubmenu = ()=>{
    setShowBasicSubMenu(false);
    setShowSubmenu(!showSubmenu);
  }
  const [clickSearch, setClickSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const clearSearchValue = () => {
    setSearchValue("");
  }
  useEffect(()=>{
    setSearchValue("");
  },[window.location.pathname]);
  //edit post
  const editPost = useSelector(({post})=>post.editPost);
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
            {!clickSearch&&
              <div className="menu-logo">
                <div className="navbar-brand">
                  <span className="navbar-logo">
                    <Logo checkout={checkout}/>
                    <MiniLogo checkout={checkout} />
                  </span>
                </div>
              </div>
            }
            {clickSearch&&
              <button className="back-button"  onClick={()=>setClickSearch(false)}>
                <i className="fas fa-arrow-left" />
              </button>
            }
            <div className="search">
             {!clickSearch&&<button className="search-button" onClick={()=>setClickSearch(true)}>
                  <i className="fas fa-search" />
                </button>
              }
              <input id="search" placeholder="&#xF002; Buscar...." autoComplete="off" type="text" className={classnames("mt-3 dropbtn",{clickable:clickSearch})} value={searchValue} onChange={(evt)=>setSearchValue(evt.target.value)}/>
              <div className="search-result dropdown">
                <SearchResult value={searchValue} clearValue={clearSearchValue}/>
              </div>
            </div>  
          </div>
          <ul
            className={classnames("navbar-nav nav-dropdown menu-second",{clickable:clickSearch})}
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
                isActive={(match, location) => {
                  return (location.pathname.match('/\/benchmarks|\/news$|\/news\/|\/shop|\/events/'))
                }}                
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
            <li className="nav-item dropdown">
              <BasicSubmenu show={showBasicSubMenu} open={openBasicSubmenu}/>
            </li>
          </ul>
          <ul
            className="navbar-nav nav-dropdown menu-third"
            data-app-modern-menu="true"
          >
            <li className="nav-item">
              <button type="button" className={"clickable-button"} onClick={OpenCreatingPost}>
                <i className="far fa-plus-square" />
              </button>
            </li>
            <li className="nav-item">
              <NavLink
                to={"/customers/"+currentUser.customer.id}
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <i className="far fa-comments" />
              </NavLink>
            </li>
            <li className="nav-item">
              <a                
                className={"nav-link link text-white display-4"}
              >
                <NotificationToggler />
              </a>
            </li>
            <li className="nav-item">
              <NavLink
                to={"/customers/"+currentUser.customer.id}
                className={"nav-link link text-white display-4"}
                activeClassName="active"
                exact
              >
                <Avatar pictureUrls={currentUser.avatarUrls} size="xs" />
                <span className="full-name">{currentUser.name}</span>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <Submenu open={openSubmenu} show={showSubmenu} openCreatingPost={OpenCreatingPost}/>
            </li>
          </ul>
        </Container>
      </Navbar>
      <CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose}/>
      <EditPostModal show={!(editPost===false)} />
      <QuickPanel />
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
