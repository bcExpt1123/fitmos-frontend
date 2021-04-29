import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from 'react-bootstrap';
import { Markup } from "interweave";
import Slider from "react-slick";
import { compose } from "recompose";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import CommentView from "./CommentView";
import MentionTextarea from "../../social/sections/MentionTextarea";
import SharePopup from "../../components/Share/Popup";
import { $changeItem, $toggleAttend, $createComment, $appendNextReplies, $hideReplies } from "../../../../../modules/subscription/evento";
import { setItemValue } from "../../redux/post/actions";
import { shareEvento } from "../../redux/messages/actions";

const Map = compose(
  withScriptjs,
  withGoogleMap
)
  (props =>
      <GoogleMap
          defaultZoom={15}
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
  /** comment */
  const [commentContent, setCommentContent] = useState("");
  const handleCommentChange = (content)=>{
    setCommentContent(content);
  }
  const onCommentFormSubmit= e => {
    e.preventDefault();
    dispatch($createComment(event.id,commentContent))
    setCommentContent("");
  }
  const handleNextReplies = (comment)=>()=>{
    dispatch($appendNextReplies(comment));
  }
  const handleHideReplies = (comment)=>()=>{
    dispatch($hideReplies(comment));
  }
  const history = useHistory();
  const openSharing=()=>{
    dispatch(setItemValue({name:'openShareCustomers',value:true}));
  }
  const selectCustomer = (customer)=>{
    dispatch(shareEvento({customer,id}));
  }
  return (
    event?
    <div className="event">
      <div className="title">
        <span className="cursor-pointer back" onClick={()=>history.push("/eventos")}><i className="fas fa-arrow-left" /></span>
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
            {event.participant?<button className="btn btn-custom-third font-size-14" onClick={handleUnattend} disabled={disable}>Confirmar Participación</button>
            :<button className="btn btn-custom-secondary font-size-14" onClick={handleAttend} disabled={disable}>Confirmar Participación</button>
            }
            <button className="btn btn-custom-secondary font-size-14" onClick={openSharing}>Compartir</button>
            <span className="ml-2 participants font-size-14 font-weight-bold">Participantes {event.participants}</span>
            <div className="mt-4">
              <Markup content={event.description}/>
            </div>
            <div className="address">
              <div>
                <label>Ubicación</label>
                <a href={`http://www.google.com/maps/place/${event.latitude},${event.longitude}`} target="_blank" className="open-map font-size-14 font-weight-bold">Abrir Mapa</a>
              </div>
              <div className="public-address">
                {event.address}
              </div>
              <div>
                <Map
                  googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_GOOGLE_MAP_KEY}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                  isMarkerShown={event.latitude===null?false:true}
                  markerPosition={event.latitude===null?null:{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
                />
              </div>
            </div>
          </>                                                                                     
        </Tab>
        <Tab eventKey="comments" title={`Comentarios (${event.commentsCount})`}>
          {event.comments&&event.comments.map( (comment,index)=>(
            <React.Fragment  key={comment.id}>
              <div className={classnames("comment-view")}>
                <CommentView comment={comment}/>
              </div>
              {(comment.children.length>0) && 
                <div className="cursor-pointer  comment-append-replies append" onClick={handleHideReplies(comment)}> Hide all replies</div>
              }
              <div className={"comment-replies"}>
                {
                  comment.children.map((reply)=>
                    <div className={classnames("comment-view reply")}  key={reply.id}>
                      <CommentView comment={reply}/>
                    </div>
                  )
                }
              </div>
              {(comment.nextChildrenCount>0) && 
                <div className="cursor-pointer comment-append-replies append" onClick={handleNextReplies(comment)}> View next replies</div>
              }
            </React.Fragment>
        ))}
          <form onSubmit={onCommentFormSubmit}>
            <MentionTextarea content={commentContent} setContent={handleCommentChange} submit={true} commentForm={onCommentFormSubmit}/>
          </form>
        </Tab>
      </Tabs>
      <SharePopup selectCustomerCallback={selectCustomer}/>
    </div>
    :
    <>
    </>
)};

export default EventPage;
