import React from "react";
import MetaTags from "react-meta-tags";

import TwoColumn from "./layouts/Two";
import ThreeColumn from "./layouts/Three";
import Shop from "./ShopPage";
import PageHeader from "./layouts/PageHeader";

const ShopPage = () => (
  <>
    <MetaTags>
      <title>Shop -Fitemos </title>
      <meta
        name="description"
        content="Shop -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <PageHeader title={`Las mejores tiendas de Fitness`}/>
      <Shop />
    </ThreeColumn>
  </>
);

export default ShopPage;
