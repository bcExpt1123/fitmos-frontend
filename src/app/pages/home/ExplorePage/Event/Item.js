import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from 'react-bootstrap';
import { Markup } from "interweave";
import Slider from "react-slick";
import { compose } from "recompose";
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import { $changeItem, $toggleAttend } from "../../../../../modules/subscription/evento";

const Map = compose(
  withScriptjs,
  withGoogleMap
)
  (props =>
      <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: props.markerPosition===null?8.93:props.markerPosition.lat, lng: props.markerPosition===null?-79.66:props.markerPosition.lng }}
          onClick={props.onMapClick}
      >
          {props.isMarkerShown && <Marker position={props.markerPosition} />}

      </GoogleMap>
  )

const EventPage = ({id}) => {
  const event = useSelector(({evento})=>evento.item);   
  const disable = useSelector(({evento})=>evento.attendDisable);   
  const dispatch = useDispatch();
  useEffect(()=>{
    if(id){
      dispatch($changeItem(id));
    }
  },[id])
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay:true,
    slidesToScroll: 1
  };  
  const handleAttend = ()=>{
    dispatch($toggleAttend(event.id));
  }
  const handleUnattend = ()=>{
    dispatch($toggleAttend(event.id));
  }
  return (
    event?
    <div className="event">
      <div className="title">
        {event.title}
      </div>
      <div className="datetime">
        {event.spanish_date}&nbsp;&nbsp;&nbsp;{event.spanish_time}
      </div>
      {event.images.length>0&&
        <Slider {...settings}>
          {event.images.map((image)=>
            <div key={image.id}>
              <img src={image.url} alt={image.id}/>
            </div>
          )}
        </Slider>
      }
      <Tabs defaultActiveKey="body" id="event">
        <Tab eventKey="body" title="Acerca del Evento">
          <>
            {event.participant?<button className="btn btn-custom-secondary font-size-14" onClick={handleUnattend} disabled={disable}>No Asistiré</button>
            :<button className="btn btn-custom-secondary font-size-14" onClick={handleAttend} disabled={disable}>Asistiré</button>
            }
            <button className="btn btn-custom-secondary font-size-14">Compartir</button>
            <span className="ml-2 participants font-size-14 font-weight-bold">Participantes {event.participants}</span>
            <div className="mt-4">
              <Markup content={event.description}/>
            </div>
            <div className="address">
              <div>
                <label>Ubicación</label>
                <a href={`http://www.google.com/maps/place/${event.latitude},${event.longitude}`} target="_blank" className="open-map font-size-14 font-weight-bold">Open Maps</a>
              </div>
              <div className="public-address">
                {event.address}
              </div>
              <div>
                <Map
                  googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_PAYPAL_GOOGLE_MAP_KEY}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  isMarkerShown={event.latitude===null?false:true}
                  markerPosition={event.latitude===null?null:{ lat: event.latitude, lng: event.longitude }}
                />
              </div>
            </div>
          </>                                                                                     
        </Tab>
        <Tab eventKey="comments" title="Comentarios (29)">
          {event.comments&&event.comments.map( (comment,index)=>(
            <div key={comment.id}>
              {comment.content}
            </div>
          ))}
        </Tab>
      </Tabs>
    </div>
    :
    <>
    </>
)};

export default EventPage;
