import React, {useEffect} from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

//import SectionContactUs from "./SectionContactUs";
import SectionAsk from "./SectionAsk";
import SectionFaq from "./SectionFaq";

const AyudaPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);
  return(
    <>
      <NavBar />

      <SectionFaq />

      <SectionAsk />

      <Footer />
    </>
  );
}

export default AyudaPage;
