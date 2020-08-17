import React,{useState, useEffect} from 'react';
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router";

import { toAbsoluteUrl,isMobile } from "../../../../_metronic/utils/utils";
import NotificationSection from "../sections/NotificationSection";
import { logOut as logOutAction } from "../redux/auth/actions";
import { MailruIcon } from 'react-share';


const SideBar = ({history}) => {
  const [submenu, setSubmenu] = useState(true);
  const [subContain, setSubContain] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm,setShowForm] = useState(false);
  useEffect(()=>{
    const paths = ["/perfil","/profile","/ayuda"];
    if( paths.includes(window.location.pathname)){
      console.log("contain");
      setSubmenu(false);
      setSubContain(true);
    }
  },[]);
  const expandSubmenu = ()=>{
    setSubmenu(false);
  }
  const collaseSubmenu = ()=>{
    if(!subContain)setSubmenu(true);
  }
  const showMobileMenu = ()=>{
    setShowMenu(true);
  }
  const hideMobileMenu = ()=>{
    setShowMenu(false);
  }
  const handleShowLogoutModal = ()=>{
    setShowForm(true);
  }
  const handleCloseForm = ()=>{
    setShowForm(false);
  }
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    dispatch(logOutAction());
    setShowForm(false);
  }
  const redirectProfilePage = ()=>{
    history.push('/profile');
  }
  return (
    <>
      <button id="show-responive-menu" onClick={showMobileMenu} className={classnames({'d-none':showMenu})}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <nav id="sidebar" className={classnames({responsive:showMenu })}>
        <button id="hide-responive-menu" onClick={hideMobileMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className="menu-logo">
          <NavLink className="image-logo" to="/">
          </NavLink>
          <NavLink className="text-logo" to="/">
          </NavLink>
        </div>
        <ul className="list-unstyled components">
          <li>
            <NavLink className="menu-link menu-toggle" to="/" exact activeClassName="active">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/workout.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/workout-active.svg")} />
              </span>
              <span className="menu-text">Workout</span>
              <i className="menu-arrow" />
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link menu-toggle" to="/benchmarks" activeClassName="active">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/benchmarks.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/benchmarks-active.svg")} />
              </span>
              <span className="menu-text">Benchmarks</span>
              <i className="menu-arrow" />
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link menu-toggle" to="/news" activeClassName="active">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/blog.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/blog-active.svg")} />
              </span>
              <span className="menu-text">Blog</span>
              <i className="menu-arrow" />
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link menu-toggle" to="/shop" activeClassName="active">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/shop.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/shop-active.svg")} />
              </span>
              <span className="menu-text">Shop</span>
              <i className="menu-arrow" />
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link menu-toggle" to="/partners" activeClassName="active">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/partners.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/partners-active.svg")} />
              </span>
              <span className="menu-text">Partners</span>
              <i className="menu-arrow" />
            </NavLink>
          </li>
          <li onMouseEnter={expandSubmenu} onMouseLeave={collaseSubmenu}>
            <a className="menu-link menu-toggle" onClick={redirectProfilePage}>
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/profile.svg")} />
              </span>
              <span className="svg-icon-active menu-icon">
                <SVG src={toAbsoluteUrl("/media/icons/svg/Menus/profile-active.svg")} />
              </span>
              <span className="menu-text">Cuenta</span>
              <i className="menu-arrow" />
            </a>
            <ul className={classnames("list-unstyled", {collapse:submenu })} id="pageSubmenu">
              <li className="responsive-menu">
                <NavLink className="menu-link menu-toggle" to="/perfil" activeClassName="active">
                  Mi Perfil
                </NavLink>
              </li>
              <li>
                <NavLink className="menu-link menu-toggle" to="/profile" activeClassName="active">
                  Ajustes
                </NavLink>
              </li>
              <li>
                <NavLink className="menu-link menu-toggle" to="/ayuda" activeClassName="active">
                  Ayuda
                </NavLink>
              </li>
              <li>
                <a className="menu-link menu-toggle"  onClick={handleShowLogoutModal}>
                  Cerrar sesión
                </a>
              </li>
            </ul>          
          </li>
        </ul>
        <NotificationSection />
        <footer className="menu">
          <NavLink className="menu-link menu-toggle" to="/terms_and_condition" activeClassName="active">
            Términos
          </NavLink>        
          -
          <NavLink className="menu-link menu-toggle" to="/privacy" activeClassName="active">
            Privacidad
          </NavLink>        
          -
          <NavLink className="menu-link menu-toggle" to="/cookies" activeClassName="active">
            Cookies
          </NavLink>        
          &nbsp;&nbsp;&nbsp;Fitemos 2020
        </footer>
        <Modal
          size="md"
          dialogClassName="logout-modal"
          show={showForm}
          onHide={handleCloseForm}
          animation={false}
          centered
        >
        <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <h3>¿Está seguro que desea cerrar sesión?</h3>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="logout-modal-button" onClick={handleCloseForm}>
            No 
          </Button>
          <Button variant="logout-modal-button" onClick={handleLogout}>
            Si
          </Button>
          </Modal.Footer>          
        </Modal>
      </nav>
    </>
  )
}
export default withRouter(SideBar);