import React from "react";

import Shop from "./Shop";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Shop {...props} />}
  />
);
export default page;
