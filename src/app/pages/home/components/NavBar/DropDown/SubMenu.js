import React from "react";
import classnames from "classnames";
import { NavLink } from "react-router-dom";

const Submenu = ({open,show,openCreatingPost} )=>{
  return (
    <>
      <button type="button" className={"clickable-button dropbtn"} onClick={open}>
        <i className="fas fa-chevron-down dropbtn" />
      </button>
      <div className={classnames("dropdown-menu",{show:show})}>
        <a className={"dropdown-item createing"} onClick={openCreatingPost}>
          Crear Post
        </a>                
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
    </>    
  )
}
export default Submenu;