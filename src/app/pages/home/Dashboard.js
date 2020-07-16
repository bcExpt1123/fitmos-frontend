import React from "react";
import { withRouter } from "react-router";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import SectionBanner from "./SectionBanner";
import SectionStep from "./SectionStep";
import SectionGuide from "./SectionGuide";
import SectionPricing from "./SectionPricing";
import SectionTestimonial from "./SectionTestimonial";
import SectionCommunity from "./SectionCommunity";
import DashboardPage from "./DashboardPage";
import NotificationSection from "./NotificationSection";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const Dashboard = ({ auth,history }) => {
  if(auth.currentUser==null){
    history.push('/auth/login');
  }
  if(auth.currentUser && auth.currentUser.has_workout_subscription===false){
    history.push('/pricing');
  }
  return (
  <>
    <NavBar transparent={false} />

    {auth.currentUser&&auth.logOuting===false && (
      auth.currentUser.has_workout_subscription?(
      <>
        <MetaTags>
          <title>Mi tablero -Fitemos </title>
          <meta
            name="description"
            content="Entrenamientos Funcionales 100% Personalizados, Orientado a tus Objetivos, Guiados por Experto. Realízala en tu hogar o gimnasio preferido, en el momento que gustes."
          />
        </MetaTags>
        <NotificationSection />
        <DashboardPage />
      </>
      ):(
        <>
        </>
      )
    )}

    <Footer />
  </>
  )
};
const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {};

const HomePage = connect(mapStateToProps, null)(withRouter(Dashboard));

export default HomePage;
