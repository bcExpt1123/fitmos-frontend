import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";


const EventsPage = () => {
  return(
    <>
      <MetaTags>
        <title>Event -Fitemos </title>
        <meta
          name="description"
          content="Event -Fitemos"
        />
      </MetaTags>
      Event
    </>
)};

export default EventsPage;