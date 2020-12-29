import React from 'react';  
import MetaTags from "react-meta-tags";

import RightBar from "./sections/RightBar";
import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";

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