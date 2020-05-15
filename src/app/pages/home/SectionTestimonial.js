import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Testimonial() {
  const settings = {
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <section className="testimonial" id="testimonial">
      <div className="container">
        <Slider {...settings}>
          <div className="media-container-row">
            <div className="mbr-figure">
              <img
                src={require("./assets/testimonial/mujer, panama.png")}
                alt="Mobirise"
              />
              <div className="border-line-container">
                <div className="border-line"></div>
              </div>
            </div>
            <div className="align-left aside-content">
              <h2 className="mbr-title mbr-fonts-style">
                <span className="top-line-green">Lo</span>
                <span className="top-line-green-md">&nbsp;que&nbsp;</span>dicen
                de Fitemos
              </h2>
              <div className="address">MIEMBRO FITEMOS, PANAMÁ</div>
              <div className="mbr-section-text">
                <p className="description">
                  Nunca había hecho ejercicio. Fitemos me envía rutinas tres
                  veces a la semana y es más que suficiente! Mi hijo está en el
                  plan más avanzado y entrena 6 días a la semana, algún día
                  estaré tan en forma como él!&nbsp;
                </p>
                <div className="bottom-line-black" />
                <p className="name pt-3">MARITZA RODRÍGUEZ, PROFESORA</p>
              </div>
            </div>
          </div>
          <div className="media-container-row">
            <div className="mbr-figure">
              <img
                src={require("./assets/testimonial/Panama, hombre.png")}
                alt="Mobirise"
              />
              <div className="border-line-container">
                <div className="border-line"></div>
              </div>
            </div>
            <div className="align-left aside-content">
              <h2 className="mbr-title mbr-fonts-style">
                <span className="top-line-green">Lo</span>
                <span className="top-line-green-md">&nbsp;que&nbsp;</span>dicen
                de Fitemos
              </h2>
              <div className="address">MIEMBRO FITEMOS, PANAMÁ</div>
              <div className="mbr-section-text">
                <p className="description">
                  Me parece conveniente el hecho de que me envíen mi rutina al
                  WhatsApp con anticipación. Esto me permite revisar los videos
                  y prepararme para hacerla de la mejor forma posible.&nbsp;
                </p>
                <div className="bottom-line-black"></div>
                <p className="name pt-3">ROBERTO SALAZAR, MÉDICO</p>
              </div>
            </div>
          </div>
          <div className="media-container-row">
            <div className="mbr-figure">
              <img
                src={require("./assets/testimonial/colombia, hombre.png")}
                alt="Mobirise"
              />
              <div className="border-line-container">
                <div className="border-line"></div>
              </div>
            </div>
            <div className="align-left aside-content">
              <h2 className="mbr-title mbr-fonts-style">
                <span className="top-line-green">Lo</span>
                <span className="top-line-green-md">&nbsp;que&nbsp;</span>dicen
                de Fitemos
              </h2>
              <div className="address">MIEMBRO FITEMOS, COLOMBIA</div>
              <div className="mbr-section-text">
                <p className="description">
                  En mi juventud iba al gimnasio 2 horas. Me parece increíble
                  que con 30 minutos, tengo mejores resultados. Definitivamente
                  la personalización, tutoriales y entrenadores son un factor
                  importante.&nbsp;
                </p>
                <div className="bottom-line-black"></div>
                <p className="name pt-3">JUAN G. RESTREPO, ABOGADO</p>
              </div>
            </div>
          </div>
          <div className="media-container-row">
            <div className="mbr-figure">
              <img
                src={require("./assets/testimonial/mujer, mexico.png")}
                alt="Mobirise"
              />
              <div className="border-line-container">
                <div className="border-line"></div>
              </div>
            </div>
            <div className="align-left aside-content">
              <h2 className="mbr-title mbr-fonts-style">
                <span className="top-line-green">Lo</span>
                <span className="top-line-green-md">&nbsp;que&nbsp;</span>dicen
                de Fitemos
              </h2>
              <div className="address">MIEMBRO FITEMOS, MÉXICO</div>
              <div className="mbr-section-text">
                <p className="description">
                  Fitemos me encanta porque lo realizo donde quiera y cuando
                  quiera! En la semana lo hago en mi depa, antes de ir al
                  trabajo. Pero los fines de semana, me voy al parque y lo hago
                  en grupo con mis amigas!&nbsp;
                </p>
                <div className="bottom-line-black"></div>
                <p className="name pt-3">ANA ISABEL CHÁVEZ, EJECUTIVA</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
}
