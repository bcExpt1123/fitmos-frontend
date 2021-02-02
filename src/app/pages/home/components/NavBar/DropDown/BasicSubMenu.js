import React from "react";
import classnames from "classnames";
import { NavLink } from "react-router-dom";

const BasicSubmenu = ({show,open})=>{
  return (
    <>
      <button type="button" className={"clickable-button dropbtn"} onClick={open}>
        <i className="fas fa-ellipsis-h dropbtn" />
      </button>
      <div className={classnames("dropdown-menu",{show:show})}>
        <NavLink
          to="/"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          Workout
        </NavLink>                
        <NavLink
          to="/newsfeed"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          Newsfeed
        </NavLink>                
        <NavLink
          to="/leaderboard"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          Leaderboard
        </NavLink>                
        <NavLink
          to="/benchmarks"
          className={"dropdown-item"}
          activeClassName="active"
          exact
        >
          Explore
        </NavLink>
      </div>
    </>    
  )
}
export default BasicSubmenu;