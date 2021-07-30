import React from "react";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import MetaTags from "react-meta-tags";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Modal } from "react-bootstrap";
import Button from "../../home/components/Button";

import LogInForm from "../../home/components/Auth/LogInForm";
import FacebookButton from "../../home/components/Auth/FacebookButton";
import GoogleButton from "../../home/components/Auth/GoogleButton";
import AppleButton from "../../home/components/Auth/AppleButton";
import { NavLink } from "react-router-dom";
import Logo from "../../home/components/Logo";
//import QueryParams from '../../../lib/QueryParams';
import useBodyClass from "../../../../lib/bodyClassModify";
import {
  showLogInForm as showLogInFormAction,
  logInWithFacebook as logInWithFacebookAction,
  logInWithGoogle as logInWithGoogleAction,
  logInWithApple as logInWithAppleAction,
  logInAppleFailed as logInAppleFailedAction,
} from "../../home/redux/logIn/actions";
import "../../home/assets/scss/theme/login.scss";
import { isMobile, isIOS } from "../../../../_metronic/utils/utils";
const LogInPage = ({
  intl,
  isLogInFormVisible,
  isLoggingIn,
  showLogInForm,
  logInWithFacebook,
  logInWithGoogle,
  logInWithApple,
  logInAppleFailed,
  history
}) => {
  /*const {
    url: { query },
  } = useCurrentRoute();*/
  useBodyClass(`page-auth`);
  const referralId = 1;
  const returnTo = "";
  const applicationSource = "workout";
  const appleHandleSuccess = (response)=>{
    if(response){
      logInWithApple(response.authorization.id_token)
    }
  }
  const appleHandleError = (error)=>{
    logInAppleFailed(error);
  }
  const mobileApp = reactLocalStorage.get('mobile-app');
  const handleCloseForm = () => {
    reactLocalStorage.set('mobile-app', 'no');
  }
  const handleRedirectApp = () => {
    if(isIOS()){
      setTimeout(function () { window.location.replace("https://apps.apple.com/us/app/fitemos/id1549350889"); }, 25);
      window.location.replace("appname://");
    }else{
      setTimeout(function () { window.location.replace("https://play.google.com/store/apps/details?id=com.dexterous.fitemos"); }, 25);
      window.location.replace("appname://");
    }
  }
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
            <AppleButton
              disabled={isLoggingIn}
              onSuccess={appleHandleSuccess}
              onError={appleHandleError}
            >
              <FormattedMessage id="LogInPage.Button.Apple" />
            </AppleButton>
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
          {isMobile() && mobileApp !== 'no' && (
            <Modal
              size="md"
              dialogClassName="logout-modal"
              show={showForm}
              animation={false}
              centered
            >
              <Modal.Body>
                <h3 style={{margin:'14px'}}>Descarga el app Fitemos y accede a todos los beneficios</h3>
                <p>En el app de Fitemos podrás vivir la experiencia completa de entrenar y conectarte con tus compañeros. Descárgala ya</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="logout-modal-button" onClick={handleCloseForm}>
                  No 
                </Button>
                <Button variant="logout-modal-button" onClick={handleRedirectApp}>
                  Si
                </Button>
              </Modal.Footer>          
            </Modal>

          )}
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
  logInWithGoogle: logInWithGoogleAction,
  logInWithApple : logInWithAppleAction,
  logInAppleFailed : logInAppleFailedAction
};

export default withRouter(LogInPage);
