import React,{ useState, useEffect, useRef } from 'react';
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import { Tooltip } from '@material-ui/core';
import { compose } from "recompose";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import SVG from "react-inlinesvg";
import Avatar from "../../components/Avatar";
import {deletePost, openEditModal, setItemValue} from "../../redux/post/actions";
import { follow, unfollow, mute } from "../../redux/notification/actions";
import { findWorkouts,initialBlock } from "../../redux/done/actions";
import DropDown from "../../components/DropDown";
import LinkProfile from "./customer/Link";
import ReportModal from "./ReportModal";
import TagFollowersModal from "./customer/TagFollowersModal";
import { convertTime, can } from "../../../../../lib/common";
import { CUSTOM_POST_TYPES, articlePath } from "../../../../../lib/social";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import HtmlContentReadMore from './HtmlContentReadMore';
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

export default function PostContent({post, newsfeed,suggested,modalShow}) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const renderWord = (word)=>{
    const follower = post.contentFollowers.filter(customer=>word===`$${customer.id}$`);
    return <>
      {follower.length>0?
        <button className="follower-button dropbtn font-weight-bold" onClick={handleClick(follower[0])}>
          {follower[0].first_name+' '+follower[0].last_name}&nbsp;
        </button>
        :
        <>{word}</>}
    </>
  }
  const history = useHistory();
  const handleClick = (customer)=>()=>{
    history.push("/"+customer.username);
  }
  const renderPostLine = (line)=>{
    const regexp = /(\$[0-9]+\$)/g;
    let content = line.content;
    let res = content.split(regexp);
    return (res.map((word,index)=>{
      return (<React.Fragment key={index}>{
        renderWord(word)
        }
      </React.Fragment>)
      })
    )
  }
  const dispatch = useDispatch();
  const handleDelete = (post)=>()=>{
    dispatch(deletePost(post));
    setRefresh(refresh + 1);
  }
  const openEditPostModal = (post)=>()=>{
    dispatch(openEditModal(post));
    if(modalShow === true)dispatch(setItemValue({name:"openEditModal",value:true}));
    setRefresh(refresh + 1);
  }
  const handleFollow = ()=>{
    dispatch(setItemValue({name:"suggested",value:1}))
    dispatch(follow(post.customer_id));
    setRefresh(refresh + 1);
  }
  const handleUnfollow = ()=>{
    dispatch(setItemValue({name:"suggested",value:0}));
    dispatch(unfollow(post.customer_id));
    setRefresh(refresh + 1);
  }
  const handleMute = ()=>{
    if(suggested)dispatch(setItemValue({name:"suggested",value:1}))
    else dispatch(setItemValue({name:"suggested",value:0}))
    dispatch(mute(post.customer_id));
    setRefresh(refresh + 1);
  }
  const SHOW_LESS_TEXT = 'Colapsar';
  const SHOW_MORE_TEXT = 'Ver más';
  const [showMore, setShowMore] = useState(false);
  const toggleReadMore = ()=>{
    setShowMore(!showMore);
  }
  const [refresh, setRefresh] = useState(false);
  const handleReport=()=>{
    setRefresh(refresh + 1);
    setShowReportModal(true);
  }  
  const [showReportModal, setShowReportModal] = useState(false);
  const onReportModalClose = ()=>{
    setShowReportModal(false);
  }
  /** tagFollowersModal */
  const [showTagFollowersModal, setShowTagFollowersModal] = useState(false);
  const openTagFollowersModal = ()=>{
    setShowTagFollowersModal(true);
  }
  const onCloseTagFollowersModal = ()=>{
    setShowTagFollowersModal(false);
  }
  /** google map show */
  const [position, setPosition] = useState(false);
  useEffect(()=>{
    if(post.medias&&post.medias.length == 0 && post.location){
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${post.location}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,{
        method:"GET",
      })
      .then(response => response.json())
      .then(data => {
        if(data.status == 'OK' && data.results.length>0){
          console.log(data.results[0].geometry);
          setPosition({lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng})
        }
      });
    }
  },[post.medias ,post.location])
  const redirectWorkoutPage = ()=>{
    if(post.type === 'workout'){
      dispatch(findWorkouts(post.workout_date));
      dispatch(initialBlock());
      history.push("/");
    }
  }
  const postHeader = ()=>{
    return (<>
      {post.type=="workout"?
        <>
          &nbsp;comentó <span onClick={redirectWorkoutPage} className="font-weight-bold cursor-pointer">el workout del {post.workout_spanish_short_date}</span>
        </>:
        <>
          {(post.tagFollowers&&post.tagFollowers.length>0 || post.location)&&<span>&nbsp;está&nbsp;</span>}
          {(post.location && post.location!='false')&&<>
            &nbsp;en&nbsp;<span className="font-weight-bold">
              <a href={`http://www.google.com/maps/search/?api=1&query=`+window.encodeURI(post.location)} target="_blank" className="open-map font-size-14 font-weight-bold">{post.location}</a></span>
              &nbsp;
            </>}
          {post.tagFollowers&&post.tagFollowers.length>0&&<>con&nbsp;</>}
          {
            post.tagFollowers && post.tagFollowers.length>0 &&<>
              &nbsp;<span className="follower font-weight-bold">
                <LinkProfile id={post.tagFollowers[0].id} display={post.tagFollowers[0].first_name+' '+post.tagFollowers[0].last_name} username={post.tagFollowers[0].username}/>
                </span>
              {post.tagFollowers.length>1&&
                <>
                  &nbsp;y&nbsp;
                  {post.tagFollowers.length===2?<span className="follower font-weight-bold">
                    <LinkProfile id={post.tagFollowers[1].id} display={post.tagFollowers[1].first_name+' '+post.tagFollowers[1].last_name} username={post.tagFollowers[1].username}/>
                  </span>
                    :
                    <>
                      <Tooltip title={
                        post.tagFollowers.map((follower, index)=>{
                          return index>0&&
                          <div key={follower.id} className="follower">
                            {follower.first_name+' '+follower.last_name}
                          </div>
                        })
                      }>
                        <span className="cursor-pointer font-weight-bold" onClick={openTagFollowersModal}>{post.tagFollowers.length - 1} otros</span>
                      </Tooltip>  
                      {showTagFollowersModal && <TagFollowersModal show={showTagFollowersModal} onClose={onCloseTagFollowersModal} followers={post.tagFollowers}/>}
                    </>
                  }
                </>
              }
            </>
          }
        </>
      }
    </>)
  }
  const commonPostTypes = ['general','workout'];
  const articleType = ()=>{
    if(CUSTOM_POST_TYPES.includes(post.type)){
      switch(post.type){
        case "shop":
          return "Nueva Tienda";
        case "blog":
          return "Nuevo Artículo";
        case "benchmark":
          return "Nuevo Benchmark";
        case "evento":
          return "Nuevo Evento";
        case "workout-post":
          return "Nuevo Workout";
        }
    }
    return "";
  }
  const headerInnerRef = useRef();
  useEffect(()=>{
    if(headerInnerRef && headerInnerRef.current ){
      if(window.innerWidth < 450){
        headerInnerRef.current.style.width=(window.innerWidth-100)+"px";
        headerInnerRef.current.style.verticalAlign="text-top";
        headerInnerRef.current.style.marginTop="-6px";
        headerInnerRef.current.style.marginBottom="13px";  
      }else{
        if(headerInnerRef.current.offsetWidth<430){
          const openMap = headerInnerRef.current.querySelector('.open-map');
          if(openMap)openMap.style.maxWidth = (580 - headerInnerRef.current.offsetWidth) + 'px';
        }
      }
    }
  }, [headerInnerRef])
  return (
    <>
      <div className="post-header">
        {commonPostTypes.includes(post.type) &&
          <>
            <NavLink
              to={"/"+post.customer.username}
              className={"link-profile"}
            >
              <Avatar pictureUrls={post.customer.avatarUrls} size="xs" />
            </NavLink>
            <DropDown refresh={refresh}>
              {({show,toggleHandle})=>(
                <div className=" dropdown">
                  <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                    <i className="fal fa-ellipsis-h dropbtn" />
                  </button>
                  <div className={classnames("dropdown-menu dropdown-menu-right" ,{show})}>
                    {
                      (currentUser.type==="customer" && post.customer_id == currentUser.customer.id || currentUser.type==="admin" && can(currentUser, "social"))?
                      <>
                        <a className={"dropdown-item"} onClick={openEditPostModal(post)}>Editar Publicación</a>
                        <a className={"dropdown-item"} onClick={handleDelete(post)}>Borrar Publicación</a>
                      </>
                      :
                      <>
                        {post.customer.following&&post.customer.following.status ==='accepted'&&<a className={"dropdown-item"} onClick={handleUnfollow}>Dejar de seguir&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                        {/* {post.customer.following == null && <a className={"dropdown-item"} onClick={handleFollow}>Agregar&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>} */}
                        {(newsfeed === true && post.customer.relation == false) && <a className={"dropdown-item"} onClick={handleMute}>Esconder las publicaciones de&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                        <a className={"dropdown-item"} onClick={handleReport}>Reportar Publicación</a>
                      </>
                    }
                  </div>
                </div>    
              )}
            </DropDown>
            <ReportModal type={"post"} post={post} show={showReportModal} onClose={onReportModalClose}/>
            <span ref={headerInnerRef}>
              <span className="full-name">
                <NavLink
                  to={"/"+post.customer.username}
                  className={"link-profile font-weight-bold"}
                >
                  {post.customer.first_name} {post.customer.last_name}
                </NavLink>
              </span>
              {(currentUser.type==="customer" && post.customer_id != currentUser.customer.id&&post.customer.following == null && newsfeed) && (
                ((post.tagFollowers==null || post.tagFollowers && post.tagFollowers.length===0) && post.location==null) && (
                  <span className={"cursor-pointer"} style={{color:"#008EB2"}} onClick={handleFollow}>
                    &nbsp;&nbsp;&nbsp;Agregar
                  </span>
                )
              )}        
              {!modalShow&&postHeader()}
            </span>
          </>
        }
        {CUSTOM_POST_TYPES.includes(post.type)&&
          <>
            <NavLink
              to={"/"+articlePath(post)}
              className={"link-profile"}
            >
              {post.type==='shop'?<Avatar pictureUrls={post.shopLogo} size="xs" />
                :<Avatar pictureUrls={{small:toAbsoluteUrl("/media/logos/logo-mini-sm.png")}} size="xs" />
              }
              
            </NavLink>
            <span style={{display:"inline-block",verticalAlign:"super"}}>
              <span className="full-name">
                <NavLink
                  to={articlePath(post)}
                  className={"link-profile font-weight-bold"}
                >
                  {post.title}
                </NavLink>
              </span>
              {!modalShow&&postHeader()}
            </span>
            <NavLink
              to={articlePath(post)}
              className={"article-type"}
            >
              {articleType()}
            </NavLink>
          </>
        }
        <div className="post-time" >{convertTime(post.created_at)}</div>
      </div>
      <div className={classnames("post-body",{'post-modal-show':modalShow,'read-more-show':showMore})}>
        {post.contentType==="html"?<HtmlContentReadMore content={post.content}/>:
        post.json_content && <>
          {post.json_content.length>5?
            <>
              {showMore?<>
                {post.json_content.map((line, index)=>
                  (index<post.json_content.length-1)?
                    <div key={index}>{renderPostLine(line)}</div>
                    :
                    <div key={index}>{renderPostLine(line)}
                      <button 
                        onClick={toggleReadMore}
                        className="read-more__button"
                      >
                        {SHOW_LESS_TEXT}
                      </button>              
                    </div>
                )}
              </>:<>
                <div>{renderPostLine(post.json_content[0])}</div>
                <div>{renderPostLine(post.json_content[1])}</div>
                <div>{renderPostLine(post.json_content[2])}</div>
                <div>{renderPostLine(post.json_content[3])}</div>
                <div>{renderPostLine(post.json_content[4])}<span>…</span>
                  <button 
                    onClick={toggleReadMore}
                    className="read-more__button"
                  >
                    {SHOW_MORE_TEXT}
                  </button>          
                </div>
              </>            
              }
            </>
            :
            <>
              {post.json_content.map((line,index)=>
                <div key={index}>{
                  renderPostLine(line)
                  }
                </div>)
              }          
            </>
          }
          </>
        }
        {post.type==='workout' && post.dumbells_weight&& (<div className="mt-2" style={{
            color:"rgba(51, 51, 51, 1)",
            backgroundColor:"#B9B7B7",
            display:'inline-block',
            padding:'2px 5px',
            borderRadius:'5px'}}>
            Peso utilizado:{post.dumbells_weight}lbs
          </div>
        )}
      </div>
      {post.medias && (post.medias.length==0 && position) &&<div>
        <Map
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_GOOGLE_MAP_KEY}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          isMarkerShown={position.lat===null?false:true}
          markerPosition={position.lat===null?null:{ lat: parseFloat(position.lat), lng: parseFloat(position.lng) }}
        />
      </div>}
      {modalShow&&<div className="font-size-14" style={{padding:"0 20px", marginBottom:"16px"}}>
        {(post.tagFollowers&&post.tagFollowers.length>0 || post.location || post.type==="workout")&&<SVG src={toAbsoluteUrl("/media/icons/svg/Design/Minus.svg")} style={{width:"30px"}}/>}
        {postHeader()}</div>
      }
    </>
  );
}