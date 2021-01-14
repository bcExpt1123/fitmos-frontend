import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

const Logo = ({ color, className, variant,checkout, ...other }) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const history = useHistory();
  const link = ( currentUser&&currentUser.has_workout_subscription===false || checkout)?"/pricing":"/";
  /*eslint-disable no-mixed-operators*/
  const handleLink = ()=>{
    history.push(link);    
  }
  return (
    checkout?(
      <img
        src={require("../../assets/img/logo-mini-md.png")}
        className="mini-logo"
        alt="Fitemos"
        title=""
      />
    )
    :(
      <span onClick={handleLink} className="cursor-pointer mini-logo">
        <img
          src={require("../../assets/img/logo-mini-md.png")}
          alt="Fitemos"
          title=""
        />
      </span>
    )
  );
};

Logo.displayName = "Logo";

export default Logo;
