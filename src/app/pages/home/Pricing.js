import React from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import SectionSubscription from "./SectionSubscription";
import SectionFaq from "./SectionFaq";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const PricingPage = () => (
  <>
    <NavBar transparent={true} />

    <SectionSubscription />

    <SectionFaq />

    <Footer />
  </>
);

export default PricingPage;
