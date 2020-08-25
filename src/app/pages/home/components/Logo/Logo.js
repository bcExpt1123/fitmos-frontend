import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Logo = ({ color, className, variant,checkout, ...other }) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  /*eslint-disable no-mixed-operators*/
  const link = ( currentUser&&currentUser.has_workout_subscription===false || checkout)?"/pricing":"/";
  return (
    checkout?(
      <img
        src={require("../../assets/img/Fitmose-logo1.png")}
        alt="Fitemos"
        title=""
      />
    )
    :(
      <Link to={link}>
        <img
          src={require("../../assets/img/Fitmose-logo1.png")}
          alt="Fitemos"
          title=""
        />
      </Link>
    )
  );
};

Logo.displayName = "Logo";

export default Logo;
