import React from "react";
import MetaTags from "react-meta-tags";

import ThreeColumn from "./layouts/Three";

const LevelPage = () => (
  <>
    <MetaTags>
      <title>Suscripciones -Fitemos </title>
      <meta
        name="description"
        content="suscripciones, facturas, metodos de pago -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      Level Page
    </ThreeColumn>
  </>
);

export default LevelPage;
