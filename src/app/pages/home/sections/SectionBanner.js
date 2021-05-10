import React, { Component } from "react";
// import { jarallax } from "jarallax";
import { NavLink } from "react-router-dom";
import ProofButton from "../components/ProofButton";
import { toAbsoluteUrl, isMobile } from "../../../../_metronic/utils/utils";


const BannerContent = ()=>{
  return(
  <div className="container align-center">
    <div className="row justify-content-md-center">
      <div className="mbr-white col-md-12">
        <h1 className="mbr-section-title mbr-bold pb-3 mbr-fonts-style">
          <div>ENTRENAMIENTOS PERSONALIZADOS</div>
          <div>ORIENTADOS A TUS OBJETIVOS</div>
          <div className="subtitle">GUIADOS POR EXPERTOS</div>
        </h1>
        <p className="mbr-text pb-3 mbr-fonts-style display-7  d-none d-md-block">
          Recibe entrenamientos diarios y realízalos
          <br />
          donde y cuando gustes.
        </p>
        <div className="mbr-section-btn">
          <NavLink
            to="/signup"
            className={"btn btn-md btn-primary fs-home-btn"}
            exact
          >
            <ProofButton/>
          </NavLink>
        </div>
      </div>
    </div>
  </div>
)};

class SectionBanner extends Component {
  constructor(props) {
    super(props);

    // this.$el = React.createRef();
    // this.state = { screenWidth: null };
    // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);    
  }

  // init on mount.
  componentDidMount() {
    // window.addEventListener("resize", this.updateWindowDimensions());
    setTimeout(()=>{
      // if(this.$el.current)jarallax(this.$el.current, { speed: 0.2 });
    },10);
  }

  // destroy on unmount.
  componentWillUnmount() {
    // jarallax(this.$el.current, "destroy");
    // window.removeEventListener("resize", this.updateWindowDimensions);
  }
  // updateWindowDimensions() {
  //   this.setState({ screenWidth: window.innerWidth });
  // }
  render() {
    return (
      <section
        id="SectionBanner"
      >
        <video muted autoPlay loop playsInline={true}>
          {isMobile()?<source src={toAbsoluteUrl('/media/home-background/mobile.mp4')} type="video/mp4" />
            :<source src={toAbsoluteUrl('/media/home-background/desktop.mp4')} type="video/mp4" />
          }
        </video>
        <div
          className="mbr-overlay"
          style={{ opacity: 0.4, backgroundColor: "rgb(35, 35, 35)" }}
        ></div>
        <BannerContent />
      </section>
    );
  }
}

export default SectionBanner;
