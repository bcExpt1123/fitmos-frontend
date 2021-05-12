import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const SlideSide = ({image, name, description, role})=>(
  <div className="media-container-row">
    <div className="mbr-figure">
      <img
        src={image}
        alt="Mobirise"
      />
      <div className="border-line-container">
        <div className="border-line"></div>
      </div>
    </div>
    <div className="align-left aside-content">
      <h2 className="mbr-title mbr-fonts-style">
        <span className="top-line-green">Co</span>
        <span className="top-line-green-md">noce</span> al Team Fitemos
      </h2>
      <div className="address">{name}</div>
      <div className="mbr-section-text">
        <p className="description">
          {description}&nbsp;
        </p>
        <div className="bottom-line-black"></div>
          <p className="name pt-3">{role}</p>
      </div>
    </div>
  </div>
)
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
          <SlideSide image={require("../assets/testimonial/alvaro.png")} name={"Alvaro López"} role={"Entrenador y Atleta"}
            description={`La efectividad de Fitemos yace en su gran personalización de los programas. 
            Nos encargamos de que cada miembro reciba la programación ideal, tomando en cuenta su condición física y objetivos personales.`}/>
          <SlideSide image={require("../assets/testimonial/gaby.png")} name={"Gaby Cárdenas"} role={"Atleta y Entrenadora"}
            description={`Nuestro método de entrenamiento es de alta intensidad y corta duración. 
            Por ende, procuramos educar a los miembros sobre la forma correcta de ejecutar cada workout y así obtener los resultados deseados.`}/>
          <SlideSide image={require("../assets/testimonial/mayron.png")} name={"Mayron Montes"} role={"Lic. Fisioterapia y Entrenador"}
            description={`Todos nuestros programas vienen con soporte de video para aprender las técnicas correctas, 
            junto con los días de descanso programados. Esto es muy importante para mantener un buen estado físico y maximizar el rendimiento a largo plazo.`}/>
          <SlideSide image={require("../assets/testimonial/eliana.png")} name={"Eliana Jiménez"} role={"Lic. Nutrición y Atleta"}
            description={`Así como cada miembro requiere una programación de Fitness personalizada, 
            también requiere la nutrición. Proveemos guías nutricionales semanales a todos los miembros con el fin de mejorar sus hábitos alimenticios.`}/>
          {/* <SlideSide image={require("../assets/testimonial/faby.png")} name={"Faby Antequera"} role={"Lic. Mercadeo Deportivo y Deportista"}
            description={`En Fitemos conocemos todas las variables que crean resultados, cubrimos Fitness Personalizado, 
            Wellness, Nutrición y la Comunidad. No hay nada como compartir el Fitness y motivarte junto a personas iguales a ti. ¡Bienvenido a Fitemos!`}/> */}
        </Slider>
      </div>
    </section>
  );
}
