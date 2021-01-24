import React from "react";

import Events from "./Events";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Events {...props} />}
  />
);
export default page;
