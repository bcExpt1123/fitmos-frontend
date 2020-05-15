import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import RegistrationForm from "../Auth/RegistrationForm";
import FacebookButton from "../Auth/FacebookButton";
import GoogleButton from "../Auth/GoogleButton";
import {
  registerWithFacebook,
  registerWithGoogle,
  initialize as initializeRegistration
} from "../../redux/registration/actions";
import useBodyClass from "../../../../../lib/bodyClassModify";

const StepForm = ({
  actions,
  applicationSource,
  isRegistering,
  referralId,
  returnTo,
  profile
}) => {
  useBodyClass(`page-auth`);
  useEffect(() => {
    actions.initializeRegistration();
  });
  return (
    <main className="row justify-content-md-center">
      <div className="col-12 col-lg-2"></div>
      <div className="col-12 col-lg-8">
        <header>
          <h1>¡Todo listo!</h1>
          <div>
            Solo completa el registro para comenzar a entrenar con
            Fitemos.
          </div>
        </header>

        <section className={"social"}>
          <GoogleButton
            disabled={isRegistering}
            onClick={() =>
              actions.registerWithGoogle({
                applicationSource,
                referralId,
                returnTo,
                profile
              })
            }
          >
            Empezar con Google
          </GoogleButton>
          <FacebookButton
            disabled={isRegistering}
            onClick={() =>
              actions.registerWithFacebook({
                applicationSource,
                referralId,
                returnTo,
                profile
              })
            }
          >
            Empezar con Facebook
          </FacebookButton>
        </section>

        <section className={"email"}>
          <RegistrationForm
            applicationSource={applicationSource}
            referralId={referralId}
            returnTo={returnTo}
            profile={profile}
          />
        </section>
        <section className={"login"}>
          <NavLink
            to="/auth/login"
            exact
          >
            Ya tengo una cuenta
          </NavLink>
        </section>
      </div>
      <div className="col-12 col-lg-2"></div>
    </main>
  );
};
StepForm.defaultProps = {
  applicationSource: undefined,
  referralId: undefined,
  returnTo: undefined
};

StepForm.propTypes = {
  applicationSource: PropTypes.string,
  isRegistering: PropTypes.bool.isRequired,
  referralId: PropTypes.string,
  returnTo: PropTypes.string,
  actions: PropTypes.shape({
    registerWithFacebook: PropTypes.func.isRequired,
    registerWithGoogle: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  isRegistering: state.registration.isRegistering
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      registerWithFacebook,
      registerWithGoogle,
      initializeRegistration
    },
    dispatch
  )
});

const StepRegistration = connect(mapStateToProps, mapDispatchToProps)(StepForm);

export default StepRegistration;
