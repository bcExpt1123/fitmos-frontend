import React from "react";

import Company from "./Company";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Company {...props} />}
  />
);
export default page;
