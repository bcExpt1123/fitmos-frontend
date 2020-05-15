import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { useDispatch } from "react-redux";

import PasswordResetForm from "../../home/components/Auth/PasswordResetForm";
import Logo from "../../home/components/Logo";
import useBodyClass from "../../../../lib/bodyClassModify";
import { initialAlerts } from "../../home/redux/alert/actions";

const PasswordResetPage = ({ intl }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialAlerts());
  }, []);

  useBodyClass(`page-auth`);
  return (
    <>
      <MetaTags>
        <title>Restablecer la contraseña -Fitemos </title>
        <meta
          name="description"
          content="Restablezca su contraseña de Fitemos para obtener acceso a su cuenta."
        />
      </MetaTags>

      <article className={"forgot-page"}>
        <div className={"logo"}>
          <Logo />
        </div>
        <div className={"widget"}>
          <header>
            <h1 className="title">¿Contraseña olvidada?</h1>
          </header>

          <section className="password-reset">
            <PasswordResetForm />
          </section>
          <footer>
            <p className="login-link">
              <NavLink to={"/auth/login"}>Iniciar Sesión</NavLink>
            </p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default PasswordResetPage;
