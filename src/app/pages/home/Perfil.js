import React from 'react';  
import MetaTags from "react-meta-tags";

import RightBar from "./sections/RightBar";
import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const Perfil = () => (
  <>
    <MetaTags>
      <title>Mi Perfil - Fitemos </title>
      <meta
        name="description"
        content="Mi Perfil -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <PageHeader title={`Mi Perfil`}/>
      <div className="perfil-page">
        <RightBar />
      </div>
    </ThreeColumn>
  </>

  
)
export default Perfil;