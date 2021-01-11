import React from "react";
import MetaTags from "react-meta-tags";
import ThreeColumn from "./layouts/Three";

export default function Newsfeed() {
  return (
    <>
      <MetaTags>
      <title>Workout -Fitemos </title>
      <meta
        name="description"
        content="Workout -Fitemos"
      />
      </MetaTags>
      <ThreeColumn>
        Newsfeed
      </ThreeColumn>
    </>
  );
}
