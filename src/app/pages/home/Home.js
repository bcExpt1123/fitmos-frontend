import React,{ useEffect } from "react";
import { withRouter } from "react-router";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import { connect, useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import SectionBanner from "./sections/SectionBanner";
import SectionStep from "./sections/SectionStep";
import SectionGuide from "./sections/SectionGuide";
import SectionPricing from "./sections/SectionPricing";
import SectionTestimonial from "./sections/SectionTestimonial";
import SectionInstagram from "./sections/SectionInstagram";
import ThreeColumn from "./layouts/Three";
import { findWorkouts,initialBlock, fetchSurvey } from "./redux/done/actions";
import PageHeader from "./layouts/PageHeader";
import Header from "./sections/Workout/Header";
import Body from "./sections/Workout/Body";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const Home = ({ auth,history }) => {
  if(auth.currentUser && auth.currentUser.has_active_workout_subscription===false){
    history.push('/pricing');
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(findWorkouts());
    dispatch(initialBlock());
    dispatch(fetchSurvey());
  }, []);
  const tagLine = useSelector(({done})=>done.tagLine);
  return (
  <>

    {auth.currentUser&&auth.logOuting===false ? (
      auth.currentUser.has_workout_subscription?(
      <>
        <MetaTags>
        <title>Workout -Fitemos </title>
        <meta
          name="description"
          content="Workout -Fitemos"
        />
        </MetaTags>
        <ThreeColumn>
          <PageHeader title={`Hola ${auth.currentUser.customer.first_name}`} tagLine={tagLine}/>
          <div className="workout">
            <Header/>
            <Body/>
          </div>
        </ThreeColumn>
      </>
      ):(
        <>
        </>
      )
    ) : (
      <>
        <MetaTags>
          <title>
            Workout Intensos y Personalizados a tus objetivos.
            -Fitemos{" "}
          </title>
          <meta
            name="description"
            content="Entrenamientos Funcionales 100% Personalizados, Orientado a tus Objetivos, Guiados por Experto. Realízala en tu hogar o gimnasio preferido, en el momento que gustes."
          />
        </MetaTags>
        <NavBar transparent={auth.currentUser ? false : true} />
        
        <SectionBanner />

        <SectionStep />

        <SectionGuide />

        <SectionPricing />

        <SectionTestimonial />

        <SectionInstagram />

        <Footer />
      </>
    )}

  </>
  )
};
const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {};

const HomePage = connect(mapStateToProps, null)(withRouter(Home));

export default HomePage;
