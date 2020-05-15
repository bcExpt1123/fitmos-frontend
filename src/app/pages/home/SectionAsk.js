import React from "react";
import { NavLink } from "react-router-dom";

function SectionAsk() {
  return (
    <section id="section-contact-us" className="help">
      <div className="container">
        <div className="col-12 mt-5 text-center pb-5 ">
          <h1>¿Tienes una consulta adicional?</h1>
          <div className="mt-5">
            <NavLink
              to="/contact"
              className={"btn btn-md btn-primary fs-btn mb-5"}
              exact
            >
              Contáctanos
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SectionAsk;
