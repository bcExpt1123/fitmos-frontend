import React from "react";
import MetaTags from "react-meta-tags";
import { useSelector } from "react-redux";
import { matchPath } from "react-router-dom";


const EventPage = () => {
  const match = matchPath(window.location.pathname, {
    path:'/eventos/:id',
    exact:true,
    strict:true
  });    
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

export default EventPage;
