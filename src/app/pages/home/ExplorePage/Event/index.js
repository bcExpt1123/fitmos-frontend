import React from "react";

import Event from "./Event";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Event {...props} />}
  />
);
export default page;
