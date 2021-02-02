import React from "react";

import Benchmark from "./Benchmarks";
import ExplorePage from "../index";

const page = () => (
  <ExplorePage
    section={props => <Benchmark {...props} />}
  />
);
export default page;
