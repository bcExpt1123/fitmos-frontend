import React, { Component } from "react";
import { jarallax } from "jarallax";
import { NavLink } from "react-router-dom";
import ProofButton from "../components/ProofButton";


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
          Recibe diariamente entrenamientos
          <br />
          personalizados en tu teléfono y realízalo
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

    this.$el = React.createRef();
    this.state = { screenWidth: null };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);    
  }

  // init on mount.
  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions());
    setTimeout(()=>{
      if(this.$el.current)jarallax(this.$el.current, { speed: 0.2 });
    },10);
  }

  // destroy on unmount.
  componentWillUnmount() {
    this.isDestroyed = true;
    jarallax(this.$el.current, "destroy");
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth });
  }
  render() {
    let url;
    if(this.state.screenWidth>760){
      url = "url(" + require("../assets/img/homebanner.png") + ")";
    }else{
      url = "url(" + require("../assets/img/mobilebackground.jpg") + ")";
    }
    return (
      <section
        id="SectionBanner"
        ref={this.$el}
        className="mbr-parallax-background"
        style={{
          backgroundImage: url
        }}
      >
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
