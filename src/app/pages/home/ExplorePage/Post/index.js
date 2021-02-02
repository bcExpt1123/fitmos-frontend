import React from "react";

import Post from "./Post";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Post {...props} />}
  />
);
export default page;
