import React from "react";
import { FormattedMessage } from "react-intl";
import Carousel from "react-slick";

import Typography from "./components/Typography";
import LazyImage from "./components/LazyImage";
import { imgixUrl } from "../../../lib/imgixUrl";
import { NavLink } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import "./slick.css";

const imgUrl1 = toAbsoluteUrl("/media/media/1.png");
const imgUrl2 = toAbsoluteUrl("/media/media/2.png");
const imgUrl3 = toAbsoluteUrl("/media/media/3.png");
const imgUrl4 = toAbsoluteUrl("/media/media/4.png");
const imgUrl5 = toAbsoluteUrl("/media/media/5.png");
const imgUrl6 = toAbsoluteUrl("/media/media/6.png");
const imgUrl7 = toAbsoluteUrl("/media/media/7.png");
const imgUrl8 = toAbsoluteUrl("/media/media/8.png");
const imgUrl9 = toAbsoluteUrl("/media/media/9.png");
const imgUrl10 = toAbsoluteUrl("/media/media/10.png");
const imgUrl11 = toAbsoluteUrl("/media/media/11.png");
const imgUrl12 = toAbsoluteUrl("/media/media/12.png");

const carouselSettingsSm = {
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  pauseOnHover: false,
  centerMode: true,

  responsive: [
    {
      breakpoint: 599,
      settings: {
        slidesToShow: 2
      }
    }
  ]
};

const carouselSettingsLg = {
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 2000,
  slidesToShow: 3,
  slidesToScroll: 1,
  pauseOnHover: false,

  responsive: [
    {
      breakpoint: 1799,
      settings: {
        slidesToShow: 2
      }
    }
  ]
};

const SlideSm = ({ src1, src2, alt }) => (
  <div className={"carouselSlideSm"}>
    <LazyImage src={imgixUrl(src1)} alt={alt} width={462} />
    <LazyImage src={imgixUrl(src2)} alt={alt} width={462} />
  </div>
);

const SlideLg = ({ src1, src2, src3, alt }) => (
  <div className={"carouselSlideLg"}>
    <div>
      <LazyImage src={imgixUrl(src1)} alt={alt} width={462} />
      <LazyImage src={imgixUrl(src2)} alt={alt} width={462} />
    </div>
    <div>
      <LazyImage src={imgixUrl(src3)} alt={alt} width={940} />
    </div>
  </div>
);

const SectionCommunity = () => (
  <section id="SectionCommunity" className={"community"}>
    <div className={"header container"}>
      <h2>
        Únete a la gran comunidad Fitemos y disfruta de una vida{" "}
        <span style={{ color: "#156376" }}>saludable.</span>
      </h2>
    </div>

    <div className={"contentSm"}>
      <Carousel {...carouselSettingsSm}>
        <SlideSm src1={imgUrl1} src2={imgUrl2} alt="Slide 1" />
        <SlideSm src1={imgUrl3} src2={imgUrl4} alt="Slide 2" />
        <SlideSm src1={imgUrl5} src2={imgUrl6} alt="Slide 3" />
        <SlideSm src1={imgUrl7} src2={imgUrl8} alt="Slide 4" />
        <SlideSm src1={imgUrl9} src2={imgUrl10} alt="Slide 5" />
        <SlideSm src1={imgUrl11} src2={imgUrl12} alt="Slide 6" />
      </Carousel>
    </div>

    <div className={"contentLg"}>
      <Carousel {...carouselSettingsLg}>
        <SlideLg src1={imgUrl2} src2={imgUrl3} src3={imgUrl1} alt="Slide 1" />
        <SlideLg src1={imgUrl6} src2={imgUrl5} src3={imgUrl4} alt="Slide 2" />
        <SlideLg src1={imgUrl9} src2={imgUrl8} src3={imgUrl7} alt="Slide 3" />
        <SlideLg
          src1={imgUrl12}
          src2={imgUrl11}
          src3={imgUrl10}
          alt="Slide 4"
        />
      </Carousel>
    </div>
    <div className="community-btn">
      <NavLink to="/signup" className={"btn btn-md btn-primary fs-btn"} exact>
        COMENZAR
      </NavLink>
    </div>
  </section>
);

export default SectionCommunity;
