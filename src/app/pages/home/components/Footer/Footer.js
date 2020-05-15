import React from "react";
import { FormattedMessage } from "react-intl";
import FacebookIcon from "@material-ui/icons/Facebook";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import { NavLink } from "react-router-dom";

import Logo from "../Logo";
import FooterCheckout from "../FooterCheckout";


export const mapStateToProps = state => ({
  locale: state.locale
});

function Footer({ locale, checkout }) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {(checkout == undefined && checkout != true) && (
        <section className={"footer"}>
          <div className="container">
            <div className="media-container-row content text-white">
              <div className="col-12 col-md-4">
                <h3 className="pb-3">Nosotros</h3>
                <p className="mbr-section-subtitle">
                  Fitemos desarrolla la mejor versión de miles de personas.
                  Mejorando su salud, apariencia y motivación a través de
                  entrenamientos personalizados, guías nutricionales y una gran
                  comunidad.
              </p>
              </div>
              <div className="col-6 col-md-3 mbr-fonts-style">
                <h3 className="pb-3">Legal</h3>
                <ul>
                  <li>
                    <NavLink to="/terms_and_condition" exact>
                      Términos y condiciones
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/privacy" exact>
                      Políticas de privacidad
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/cookies" exact>
                      Política de cookies
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-3 mbr-fonts-style">
                <h3 className="pb-3">Ayuda</h3>
                <ul>
                  <li>
                    <NavLink to="/contact" exact>
                      Contacto
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact" exact>
                      Soporte
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/ayuda" exact>
                      Preguntas frecuentes
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-2 mbr-fonts-style">
                <h3 className="pb-3">Redes sociales</h3>
                <ul>
                  <li>
                    <a href="https://www.instagram.com/fitemoslatam/" target='_blank'>
                      <img src={require("../../assets/social/instagram.png")} />
                      &nbsp;&nbsp;Instagram
                  </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/fitemoslatam" target='_blank'>
                      <img src={require("../../assets/social/facebook.png")} />
                      &nbsp;&nbsp;Facebook
                  </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/channel/UCI_YlVV3NhzHr2HoYp0LcVw" target='_blank'>
                      <img src={require("../../assets/social/youtube.png")} />
                      &nbsp;&nbsp;Youtube
                  </a>
                  </li>
                </ul>
              </div>
              <div className="col-6 d-block d-md-none">
                <Logo />
              </div>
            </div>
          </div>
        </section>
      )}
      <FooterCheckout />
    </>
  );
}

export default Footer;
