import React from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import SectionSubscription from "./sections/SectionSubscription";
import SectionSubscriptionBank from "./sections/SectionSubscriptionBank";
import SectionFaq from "./sections/SectionFaq";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const PricingPage = () => (
  <>
    <NavBar transparent={true} />

    {/* <SectionSubscription /> */}
    <SectionSubscriptionBank />

    <SectionFaq />

    <Footer />
  </>
);

export default PricingPage;
