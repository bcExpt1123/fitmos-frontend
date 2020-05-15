import React, {useEffect} from "react";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import SectionContactUs from "./SectionContactUs";

const AyudaPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  return(
    <>
      <NavBar />

      <SectionContactUs />

      <Footer />
    </>
  )
}
export default AyudaPage;
