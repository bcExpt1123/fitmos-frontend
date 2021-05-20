import React from "react";

import Member from "./Member";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Member {...props} />}
  />
);
export default page;
