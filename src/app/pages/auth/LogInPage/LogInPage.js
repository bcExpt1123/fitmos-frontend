import React from "react";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import MetaTags from "react-meta-tags";

import Button from "../../home/components/Button";

import LogInForm from "../../home/components/Auth/LogInForm";
import FacebookButton from "../../home/components/Auth/FacebookButton";
import GoogleButton from "../../home/components/Auth/GoogleButton";
import { NavLink } from "react-router-dom";
import Logo from "../../home/components/Logo";
//import QueryParams from '../../../lib/QueryParams';
import useBodyClass from "../../../../lib/bodyClassModify";
import {
  showLogInForm as showLogInFormAction,
  logInWithFacebook as logInWithFacebookAction,
  logInWithGoogle as logInWithGoogleAction
} from "../../home/redux/logIn/actions";
import "../../home/assets/scss/theme/login.scss";

const LogInPage = ({
  intl,
  isLogInFormVisible,
  isLoggingIn,
  showLogInForm,
  logInWithFacebook,
  logInWithGoogle,
  history
}) => {
  /*const {
    url: { query },
  } = useCurrentRoute();*/
  useBodyClass(`page-auth`);
  const referralId = 1;
  const returnTo = "";
  const applicationSource = "workout";

  return (
    <>
      <MetaTags>
        <title>Página de inicio de sesión -Fitemos </title>
        <meta
          name="description"
          content="Inicie sesión en su cuenta para acceder al perfil, los entrenamientos y continuar su entrenamiento de Fitemos."
        />
      </MetaTags>

      <article className={"log-in-page"}>
        <div className={"logo"}>
          <Logo />
        </div>

        <div className={"widget"} data-cy="login page">
          <header>
            <h1 className="title text-white text-center">Inicia Sesión</h1>
          </header>

          <section className={"social"}>
            <FacebookButton
              disabled={isLoggingIn}
              onClick={() =>
                logInWithFacebook({
                  applicationSource,
                  referralId,
                  returnTo,
                  history
                })
              }
            >
              <FormattedMessage id="LogInPage.Button.Facebook" />
            </FacebookButton>

            <GoogleButton
              disabled={isLoggingIn}
              onClick={() =>
                logInWithGoogle({
                  applicationSource,
                  referralId,
                  returnTo,
                  history
                })
              }
            >
              <FormattedMessage id="LogInPage.Button.Google" />
            </GoogleButton>
          </section>

          <div className={"divider"}>
            <span>O</span>
          </div>

          {!isLogInFormVisible && (
            <Button theme="ghost" size="xs" onClick={showLogInForm}>
              <FormattedMessage id="LogInForm.Button.ShowLogInForm" />
            </Button>
          )}

          {isLogInFormVisible && (
            <section className={"email"}>
              <LogInForm
                applicationSource={applicationSource}
                referralId={referralId}
                returnTo={returnTo}
              />
            </section>
          )}

          <footer className={"links"}>
            <NavLink to={"/signup"}>
              <FormattedMessage id="LogInPage.Link.Register" />
            </NavLink>

            <NavLink to={"/auth/forgot-password"}>
              <FormattedMessage id="LogInPage.Link.ForgotPassword" />
            </NavLink>
          </footer>
        </div>
      </article>
    </>
  );
};

export const mapStateToProps = state => ({
  isLogInFormVisible: state.logIn.isLogInFormVisible,
  isLoggingIn: state.logIn.isLoggingIn,
  locale: state.locale
});

export const mapDispatchToProps = {
  showLogInForm: showLogInFormAction,
  logInWithFacebook: logInWithFacebookAction,
  logInWithGoogle: logInWithGoogleAction
};

export default withRouter(LogInPage);
