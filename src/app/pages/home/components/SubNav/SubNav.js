import React from "react";
import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";

const SubNav = ({ links,handleLogout }) => {
  return (
    <ul className={"nav profile-settings mb-2"}>
      {links.map(({ label, name, url }) => (
        <li key={name}>
          {name==='logout'?(
            <a
              className={"nav-link link "}
              onClick={handleLogout}
              href="!="
            >
              {label}
            </a>
        ):(
            <NavLink
              to={url}
              className={"nav-link link "}
              activeClassName="active"
              exact
            >
              {label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

SubNav.propTypes = {
  links: PropTypes.instanceOf(Array).isRequired
};

export default SubNav;
