import React from "react";

import Posts from "./Posts";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Posts {...props} />}
  />
);
export default page;
