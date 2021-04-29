import React, {useEffect} from "react";
import { useSelector } from "react-redux";

import OneColumn from "./layouts/One";
import TwoColumn from "./layouts/Two";
import SectionAsk from "./sections/SectionAsk";
import SectionFaq from "./sections/SectionFaq";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const AyudaPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return(
    currentUser?(
      <TwoColumn>
        <SectionFaq />
        <SectionAsk />
      </TwoColumn>
    ):(
      <OneColumn>
        <SectionFaq />
        <SectionAsk />
      </OneColumn>
    )
  );
}

export default AyudaPage;
