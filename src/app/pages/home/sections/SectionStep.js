import React from "react";
export default function Builder() {
  return (
    <section className="step-boxes-container" id="counters1">
      <div className="container step-boxes">
        <div className="media-container-row row no-gutters">
          <div className="card align-center col-12 col-md-4 col-lg-4">
            <div className="panel-item">
              <div className="card-img pb-3">
                <div className="box-button">
                  <img src={require("../assets/img/join.png")} alt="join" />
                </div>
              </div>

              <div className="card-text">
                <h4 className="mbr-content-title mbr-bold mbr-fonts-style">
                  AFÍLIATE
                </h4>
                <p className="mbr-content-text mbr-fonts-style">
                  Llena el formulario y crearemos un plan personalizado
                </p>
              </div>
            </div>
            <div className="border-line-container">
              <div className="border-line"></div>
            </div>
          </div>

          <div className="card align-center col-12 col-md-4 col-lg-4">
            <div className="panel-item">
              <div className="card-img pb-3">
                <div className="box-button">
                  <img src={require("../assets/img/train.png")} alt="train" />
                </div>
              </div>
              <div className="card-text">
                <h4 className="mbr-content-title mbr-bold mbr-fonts-style">
                  ENTRENA
                </h4>
                <p className="mbr-content-text mbr-fonts-style">
                  Recibe entrenamientos y tutoriales todos los días en tu
                  teléfono
                </p>
              </div>
            </div>
          </div>

          <div className="card align-center col-12 col-md-4 col-lg-4">
            <div className="panel-item">
              <div className="card-img pb-3">
                <div className="box-button">
                  <img src={require("../assets/img/live.png")} alt="live" />
                </div>
              </div>
              <div className="card-text">
                <h4 className="mbr-content-title mbr-bold mbr-fonts-style">
                  VIVE FIT
                </h4>
                <p className="mbr-content-text mbr-fonts-style">
                  Con el plan y la comunidad Fitemos, los resultados son
                  garantizados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="background-container d-none d-md-block">
        <div className="background">&nbps;</div>
      </div>
    </section>
  );
}
