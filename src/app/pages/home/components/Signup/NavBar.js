import React from "react";
import Icon from "../Icon";
import Logo from "../Logo";

//import styles from './NavBar.module.css';
const BackButton = ({ currentStep, prevStep }) => {
  const button = (
    <button type="button" onClick={prevStep} className={"back-button"}>
      <Icon name="arrowLeft" className="arrow-left" />
    </button>
  );

  return currentStep > 0 ? button : null;
};

const NavBar = ({ currentStep, prevStep, ...other }) => (
  <nav className={"nav"} {...other}>
    <div className="container">
      <BackButton prevStep={prevStep} currentStep={currentStep} />
      <Logo variant="lite" className={"logo"} />
    </div>
  </nav>
);

export default NavBar;
