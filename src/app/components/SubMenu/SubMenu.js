import React from "react";
import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";


const SubMenu = ({ links }) => {
  return (
    <div
      className={`kt-header-menu fite-submenu kt-header-menu-mobile`}
    >
      <ul className={"kt-menu__nav"}>
        {links.map(({ label, name, url }) => (
          <li key={name}>
            <NavLink
              to={url}
              className={"nav-link link "}
              activeClassName="active"
              exact
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

SubMenu.propTypes = {
  links: PropTypes.instanceOf(Array).isRequired
};

export default SubMenu;
