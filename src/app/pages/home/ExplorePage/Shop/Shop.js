import React from "react";
import MetaTags from "react-meta-tags";

import Shop from "../../ShopPage";

const ShopPage = () => (
  <>
    <MetaTags>
      <title>Shop -Fitemos </title>
      <meta
        name="description"
        content="Shop -Fitemos"
      />
    </MetaTags>
    <Shop />
  </>
);

export default ShopPage;
