import React from "react";

import Product from "./Product";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Product {...props} />}
  />
);
export default page;
