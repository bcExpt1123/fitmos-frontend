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
        src={require("../../assets/img/Fitmose-logo1.png")}
        alt="Fitemos"
        title=""
      />
    )
    :(
      <span onClick={handleLink} className="cursor-pointer">
        <img
          src={require("../../assets/img/Fitmose-logo1.png")}
          alt="Fitemos"
          title=""
        />
      </span>
    )
  );
};

Logo.displayName = "Logo";

export default Logo;
