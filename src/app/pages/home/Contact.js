import React, {useEffect} from "react";
import { useSelector } from "react-redux";

import OneColumn from "./layouts/One";
import ThreeColumn from "./layouts/Three";
import SectionContactUs from "./sections/SectionContactUs";
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
      <ThreeColumn>
        <SectionContactUs />
      </ThreeColumn>
    ):(
      <OneColumn>
        <SectionContactUs />
      </OneColumn>
    )
  )
}
export default AyudaPage;
