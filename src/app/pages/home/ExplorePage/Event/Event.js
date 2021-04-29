import React from "react";
import { useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import { matchPath } from "react-router-dom";
import Evento from "./Item";

const EventPage = () => {
  const match = matchPath(window.location.pathname, {
    path:'/eventos/:id',
    exact:true,
    strict:true
  }); 
  const event = useSelector(({evento})=>evento.item);   
  return(
    <>
      <MetaTags>
        <title>{event&&event.title} -Fitemos </title>
        <meta
          name="description"
          content="Event -Fitemos"
        />
      </MetaTags>
      <div >
        {match&&<Evento id={match.params.id} />}
      </div>
    </>
)};

export default EventPage;
